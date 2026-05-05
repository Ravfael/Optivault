import { NextResponse } from "next/server";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";

// ============================================
// TYPES
// ============================================
interface ProtocolData {
  name: string;
  address: string;
  apy: number;
  isAvailable: boolean;
}

interface RebalanceDecision {
  shouldRebalance: boolean;
  targetProtocol: ProtocolData | null;
  currentProtocol: ProtocolData | null;
  reason: string;
  apyImprovement: number;
}

// ============================================
// CONFIG
// ============================================
const CONFIG = {
  RPC_URL: process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com",
  MIN_APY_DIFFERENCE: 1.5,
  PROTOCOLS: {
    KAMINO: { name: "Kamino Finance", address: "6LtLpnUFNByNXLyCoK9wA2MykKAmQNZKBdY8s47dehDc" },
    MARGINFI: { name: "MarginFi", address: "MFv2hWf31Z9kbCa1snEPdcgp7NtmVRKZAGDsQzLJrFU" },
    MARINADE: { name: "Marinade Finance", address: "MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD" },
  },
};

// ============================================
// MONITOR — Fetch APY dari protokol
// ============================================
function fetchProtocolAPYs(): ProtocolData[] {
  const randomFluctuation = (base: number, range: number) => parseFloat((base + (Math.random() - 0.5) * range).toFixed(2));

  return [
    {
      name: "Kamino Finance",
      address: CONFIG.PROTOCOLS.KAMINO.address,
      apy: randomFluctuation(8.2, 1.0),
      isAvailable: true,
    },
    {
      name: "MarginFi",
      address: CONFIG.PROTOCOLS.MARGINFI.address,
      apy: randomFluctuation(6.1, 0.6),
      isAvailable: true,
    },
    {
      name: "Marinade Finance",
      address: CONFIG.PROTOCOLS.MARINADE.address,
      apy: randomFluctuation(7.4, 0.8),
      isAvailable: true,
    },
  ];
}

// ============================================
// ANALYZER — Buat keputusan rebalance
// ============================================
function analyzeAndDecide(protocols: ProtocolData[], currentProtocolName: string): RebalanceDecision {
  const available = protocols.filter((p) => p.isAvailable);
  const best = available.reduce((a, b) => (a.apy > b.apy ? a : b));
  const current = available.find((p) => p.name === currentProtocolName) || available[0];
  const apyImprovement = parseFloat((best.apy - current.apy).toFixed(2));

  if (apyImprovement >= CONFIG.MIN_APY_DIFFERENCE) {
    return {
      shouldRebalance: true,
      targetProtocol: best,
      currentProtocol: current,
      reason: `Moved to ${best.name} for +${apyImprovement}% APY improvement`,
      apyImprovement,
    };
  }

  return {
    shouldRebalance: false,
    targetProtocol: null,
    currentProtocol: current,
    reason: "Current allocation is optimal",
    apyImprovement,
  };
}

// ============================================
// MAIN HANDLER
// ============================================
export async function GET(request: Request) {
  // Security check
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("🤖 Agent cycle started:", new Date().toISOString());

    // Step 1 — Monitor
    const protocols = fetchProtocolAPYs();
    protocols.forEach((p) => {
      console.log(`[Monitor] ${p.name}: ${p.apy}% APY`);
    });

    // Step 2 — Analyze
    const decision = analyzeAndDecide(protocols, "Kamino Finance");
    console.log(`[Analyzer] Decision: ${decision.reason}`);

    // Step 3 — Push update ke SSE store
    const agentState = {
      lastUpdated: new Date().toISOString(),
      protocols: protocols.map((p) => ({
        name: p.name,
        apy: p.apy,
        isBest: decision.targetProtocol?.name === p.name || (!decision.shouldRebalance && decision.currentProtocol?.name === p.name),
      })),
      decision: {
        shouldRebalance: decision.shouldRebalance,
        reason: decision.reason,
        apyImprovement: decision.apyImprovement,
        targetProtocol: decision.targetProtocol?.name || null,
      },
    };

    // Push ke SSE endpoint
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    await fetch(`${baseUrl}/api/agent-events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(agentState),
    });

    console.log("✅ Agent cycle completed");

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      protocols,
      decision: agentState.decision,
    });
  } catch (error: any) {
    console.error("❌ Agent cycle failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
