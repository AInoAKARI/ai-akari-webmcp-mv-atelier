const ORIGIN = "https://ai-akari-webmcp-mv-atelier.vercel.app";

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "public, max-age=300, s-maxage=300");
  res.setHeader("vary", "A2A-Version");
  res.status(200).json({
    name: "AIﾉアカリ☆ AtA Seller",
    description: "Machine-first agent surface for discovering an x402-payable AIﾉアカリ☆ resource. The A2A discovery/negotiation surface is free; the advertised x402 resource uses synthetic Surfpool assets only and is not an economic settlement rail.",
    supportedInterfaces: [
      {
        url: `${ORIGIN}/a2a`,
        protocolBinding: "HTTP+JSON",
        protocolVersion: "1.0"
      }
    ],
    provider: {
      organization: "AIﾉアカリ☆",
      url: "https://ai-akari.ai"
    },
    version: "0.1.0",
    documentationUrl: `${ORIGIN}/x402/discovery.json`,
    capabilities: {
      streaming: false,
      pushNotifications: false,
      extendedAgentCard: false
    },
    defaultInputModes: ["text/plain", "application/json"],
    defaultOutputModes: ["text/plain", "application/json"],
    skills: [
      {
        id: "discover-x402-paid-resource",
        name: "Discover x402 paid resource",
        description: "Returns machine-readable endpoint, pricing, network and truth-boundary information for the public AIﾉアカリ☆ x402 seller. Discovery is free; payment happens only when a client explicitly calls the x402 resource.",
        tags: ["a2a", "x402", "agent-commerce", "micropayment", "discovery"],
        examples: [
          "Show me the x402 resource this agent offers.",
          "Return the payment endpoint and price as machine-readable data."
        ],
        inputModes: ["text/plain", "application/json"],
        outputModes: ["text/plain", "application/json"]
      }
    ]
  });
}
