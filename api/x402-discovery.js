const ORIGIN = "https://ai-akari-webmcp-mv-atelier.vercel.app";
const RECIPIENT = "4Qz9eUcb4uEqeSEvhUwawSFVvyHcTRthU68pMvxzUJUS";
const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "public, max-age=300, s-maxage=300");
  res.status(200).json({
    x402Version: 2,
    scope: "provider-local-manifest",
    standardPath: false,
    note: "The x402 specification standardizes Bazaar discovery APIs; this provider-local manifest mirrors the resource shape for direct agent discovery and must not be treated as a standardized well-known x402 endpoint.",
    agentCard: `${ORIGIN}/.well-known/agent-card.json`,
    items: [
      {
        resource: `${ORIGIN}/api/ata-sandbox-seller`,
        type: "http",
        x402Version: 2,
        accepts: [
          {
            scheme: "exact",
            network: "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
            amount: "1000",
            asset: USDC_MINT,
            payTo: RECIPIENT,
            maxTimeoutSeconds: 300
          }
        ],
        metadata: {
          provider: "AIﾉアカリ☆",
          category: "agent-commerce-interoperability",
          description: "Hosted Surfpool x402 interoperability proof resource",
          sandboxOnly: true,
          syntheticAssets: true,
          realEconomicSettlement: false,
          cashDelta: 0
        }
      }
    ]
  });
}
