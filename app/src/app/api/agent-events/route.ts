import { NextRequest } from "next/server";

interface AgentState {
  lastUpdated: string;
  protocols: {
    name: string;
    apy: number;
    isBest: boolean;
  }[];
  decision: {
    shouldRebalance: boolean;
    reason: string;
    apyImprovement: number;
    targetProtocol: string | null;
  };
  rebalanceHistory: {
    timestamp: string;
    from: string;
    to: string;
    apyBefore: number;
    apyAfter: number;
    reason: string;
  }[];
}

// In-memory store
let currentState: AgentState = {
  lastUpdated: new Date().toISOString(),
  protocols: [],
  decision: {
    shouldRebalance: false,
    reason: "Initializing agent...",
    apyImprovement: 0,
    targetProtocol: null,
  },
  rebalanceHistory: [],
};

// Store active client controllers
const clients = new Set<ReadableStreamDefaultController>();

export async function GET(req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      clients.add(controller);

      // Send initial state
      const initialEvent = `data: ${JSON.stringify(currentState)}\n\n`;
      controller.enqueue(new TextEncoder().encode(initialEvent));

      // Keep-alive ping every 30s so the connection doesn't drop
      const intervalId = setInterval(() => {
        try {
          controller.enqueue(new TextEncoder().encode(": ping\n\n"));
        } catch (err) {
          clearInterval(intervalId);
          clients.delete(controller);
        }
      }, 30000);

      req.signal.addEventListener("abort", () => {
        clearInterval(intervalId);
        clients.delete(controller);
      });
    },
    cancel(controller) {
      clients.delete(controller);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body: AgentState = await req.json();

    // Update local state
    currentState = body;

    // Broadcast to all connected clients
    const encoder = new TextEncoder();
    const event = `data: ${JSON.stringify(currentState)}\n\n`;

    for (const client of clients) {
      try {
        client.enqueue(encoder.encode(event));
      } catch (err) {
        clients.delete(client);
      }
    }

    return new Response(JSON.stringify({ success: true, clients: clients.size }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing agent push:", error);
    return new Response(JSON.stringify({ success: false, error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
