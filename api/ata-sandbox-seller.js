import { createPayKit, usd } from "@solana/pay-kit";

const SURFPOOL_RPC = "https://402.surfnet.dev:8899";
const RECIPIENT = "4Qz9eUcb4uEqeSEvhUwawSFVvyHcTRthU68pMvxzUJUS";

const payPromise = createPayKit({
  network: "solana_localnet",
  rpcUrl: SURFPOOL_RPC,
  accept: ["x402"],
  operator: { recipient: RECIPIENT },
  pricing: {
    ataSandboxProof: {
      amount: usd("0.001"),
      accept: ["x402"],
      description: "AIﾉアカリ☆ AtA hosted sandbox proof"
    }
  }
});

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const pay = await payPromise;
  const host = req.headers.host;
  const request = new Request(`https://${host}${req.url}`, { method: "GET", headers: req.headers });
  const gated = pay.fetch("ataSandboxProof", (_request, payment) => Response.json({
    ok: true,
    kind: "ata-external-sandbox-paid-resource",
    protocol: payment.protocol,
    scheme: payment.scheme,
    payer: payment.payer ?? null,
    recipient: RECIPIENT,
    transaction: payment.transaction,
    truthBoundary: { sandboxOnly: true, realEconomicSettlement: false, cashDelta: 0 }
  }, { headers: { "cache-control": "no-store" } }));

  const response = await gated(request);
  res.status(response.status);
  response.headers.forEach((value, key) => res.setHeader(key, value));
  res.send(await response.text());
}
