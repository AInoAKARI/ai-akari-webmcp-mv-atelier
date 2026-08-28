import { randomUUID } from "node:crypto";

const ORIGIN = "https://ai-akari-webmcp-mv-atelier.vercel.app";
const SELLER = `${ORIGIN}/api/ata-sandbox-seller`;
const MANIFEST = `${ORIGIN}/x402/discovery.json`;

function fail(res, status, code, message) {
  res.setHeader("content-type", "application/a2a+json; charset=utf-8");
  res.status(status).json({ error: { code, message } });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    fail(res, 405, "method_not_allowed", "POST required");
    return;
  }

  const requestedVersion = String(req.headers["a2a-version"] ?? "");
  if (requestedVersion !== "1.0") {
    fail(res, 400, "version_not_supported", "A2A-Version: 1.0 is required");
    return;
  }

  const body = typeof req.body === "object" && req.body !== null ? req.body : {};
  const incoming = body.message;
  if (!incoming || typeof incoming !== "object" || !incoming.messageId || !Array.isArray(incoming.parts)) {
    fail(res, 400, "request_malformed", "message.messageId and message.parts are required");
    return;
  }

  const contextId = incoming.contextId || randomUUID();
  res.setHeader("content-type", "application/a2a+json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.status(200).json({
    message: {
      messageId: randomUUID(),
      contextId,
      role: "ROLE_AGENT",
      parts: [
        {
          text: "AIﾉアカリ☆の公開x402 sellerを発見しました。A2A面は無料です。支払いはクライアントが明示的にx402 resourceを呼んだ場合だけ発生し、現在の公開resourceはSurfpool synthetic資産による相互運用証明専用です。"
        },
        {
          data: {
            resource: SELLER,
            discoveryManifest: MANIFEST,
            protocol: "x402",
            x402Version: 2,
            scheme: "exact",
            amountAtomic: "1000",
            amountDisplay: "0.001 synthetic USDC",
            networkExecution: "pay.sh hosted Surfpool localnet",
            sandboxOnly: true,
            realEconomicSettlement: false,
            cashDelta: 0,
            instruction: "GET the resource. On HTTP 402, inspect PAYMENT-REQUIRED and continue only under the caller's explicit spending policy."
          },
          mediaType: "application/json"
        }
      ]
    }
  });
}
