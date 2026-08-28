import { generateKeyPairSigner } from "@solana/kit";
import { Signer } from "@solana/pay-kit";
import { createPayKitClient } from "@solana/pay-kit/client";

const SURFPOOL_RPC = "https://402.surfnet.dev:8899";
const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const TOKEN_PROGRAM = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
const SYSTEM_PROGRAM = "11111111111111111111111111111111";
const RECIPIENT = "4Qz9eUcb4uEqeSEvhUwawSFVvyHcTRthU68pMvxzUJUS";
const EXPECTED_ATOMIC = BigInt(1000);

async function rpc(method, params = []) {
  const response = await fetch(SURFPOOL_RPC, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    signal: AbortSignal.timeout(10000)
  });
  const body = await response.json();
  if (!response.ok || body.error) throw new Error(`${method}: ${body.error?.message ?? `HTTP ${response.status}`}`);
  return body.result;
}

async function fundSandbox(payer, operator) {
  await rpc("surfnet_setAccount", [operator, {
    lamports: 100000000000,
    data: "",
    executable: false,
    owner: SYSTEM_PROGRAM,
    rentEpoch: 0
  }]);
  await rpc("surfnet_setTokenAccount", [payer, USDC_MINT, { amount: 100000000, state: "initialized" }, TOKEN_PROGRAM]);
  await rpc("surfnet_setTokenAccount", [RECIPIENT, USDC_MINT, { amount: 0, state: "initialized" }, TOKEN_PROGRAM]);
}

async function tokenBalance(owner) {
  const result = await rpc("getTokenAccountsByOwner", [owner, { mint: USDC_MINT }, { encoding: "jsonParsed", commitment: "confirmed" }]);
  let total = BigInt(0);
  for (const entry of result.value ?? []) {
    const amount = entry?.account?.data?.parsed?.info?.tokenAmount?.amount;
    if (amount) total += BigInt(amount);
  }
  return total;
}

async function waitBalance(owner, before, minimumDelta) {
  let current = before;
  for (let i = 0; i < 10; i += 1) {
    current = await tokenBalance(owner);
    if (current - before >= minimumDelta) break;
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  return current;
}

async function signatureStatus(signature) {
  const result = await rpc("getSignatureStatuses", [[signature], { searchTransactionHistory: true }]);
  return result.value?.[0] ?? null;
}

function parseBody(text) {
  try { return JSON.parse(text); } catch { return text.slice(0, 8000); }
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const startedAt = new Date().toISOString();
  const payer = await generateKeyPairSigner();
  const operator = await Signer.demo();

  try {
    await fundSandbox(payer.address, operator.pubkey);
    const payerBefore = await tokenBalance(payer.address);
    const recipientBefore = await tokenBalance(RECIPIENT);
    const progress = [];
    const client = await createPayKitClient({
      signer: payer,
      rpcUrl: SURFPOOL_RPC,
      accept: ["x402"],
      onProgress: event => progress.push(event)
    });

    const target = `https://${req.headers.host}/api/ata-sandbox-seller`;
    const response = await client.fetch(target, undefined, "x402");
    const text = await response.text();
    const body = parseBody(text);
    const transaction = body && typeof body === "object" ? String(body.transaction ?? "") : "";

    const recipientAfter = await waitBalance(RECIPIENT, recipientBefore, EXPECTED_ATOMIC);
    const payerAfter = await tokenBalance(payer.address);
    const status = transaction ? await signatureStatus(transaction) : null;
    const payerDelta = payerBefore - payerAfter;
    const recipientDelta = recipientAfter - recipientBefore;
    const txConfirmed = Boolean(status && status.err == null && ["confirmed", "finalized"].includes(status.confirmationStatus));
    const externalSandboxSettled = Boolean(response.ok && transaction.length > 20 && txConfirmed && payerDelta >= EXPECTED_ATOMIC && recipientDelta >= EXPECTED_ATOMIC);

    res.status(externalSandboxSettled ? 200 : 502).json({
      ok: externalSandboxSettled,
      startedAt,
      observedAt: new Date().toISOString(),
      rail: "x402-exact",
      network: "pay.sh hosted Surfpool localnet",
      amount: { asset: "USDC", atomic: EXPECTED_ATOMIC.toString(), decimal: "0.001" },
      payer: { address: payer.address, beforeAtomic: payerBefore.toString(), afterAtomic: payerAfter.toString(), deltaAtomic: payerDelta.toString() },
      recipient: { address: RECIPIENT, beforeAtomic: recipientBefore.toString(), afterAtomic: recipientAfter.toString(), deltaAtomic: recipientDelta.toString() },
      payment: { httpStatus: response.status, transaction: transaction || null, signatureStatus: status, paymentResponseHeader: response.headers.get("payment-response"), body, progress },
      truthBoundary: { externalSandboxSettled, realEconomicSettlement: false, cashDelta: 0, note: "Synthetic Surfpool SOL/USDC only; no economic value moved." }
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      startedAt,
      observedAt: new Date().toISOString(),
      payerAddress: payer.address,
      error: error instanceof Error ? error.message : String(error),
      truthBoundary: { externalSandboxSettled: false, realEconomicSettlement: false, cashDelta: 0 }
    });
  }
}
