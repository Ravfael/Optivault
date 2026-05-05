import { CONFIG } from "./config";
import { fetchMarketSnapshot } from "./monitor";
import { analyzeAndDecide } from "./analyzer";
import { loadAgentKeypair, checkVaultStatus, executeRebalance } from "./executor";

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

const rebalanceHistory: AgentState["rebalanceHistory"] = [];

async function pushUpdateToFrontend(state: AgentState) {
  try {
    const res = await fetch(`${CONFIG.FRONTEND_URL}/api/agent-events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(state),
    });
    if (res.ok) {
      console.log(`📡 Pushed update to frontend`);
    } else {
      console.log(`⚠️ Frontend responded with status ${res.status}, skipping push`);
    }
  } catch (err) {
    console.log(`⚠️ Frontend not running, skipping push`);
  }
}

async function runLoop() {
  console.log(`\n╔═══════════════════════════════╗`);
  console.log(`║   OPTIVAULT AI AGENT v1.0     ║`);
  console.log(`║   Yield Optimizer on Solana   ║`);
  console.log(`╚═══════════════════════════════╝\n`);

  let agentKeypair;
  try {
    agentKeypair = loadAgentKeypair();
    console.log(`➡️  Agent Wallet: ${agentKeypair.publicKey.toBase58()}`);
  } catch (error) {
    console.error("❌ Failed to load agent keypair:", error instanceof Error ? error.message : error);
    process.exit(1);
  }

  console.log(`⚙️  Config Loaded:`);
  console.log(`   RPC URL:             ${CONFIG.RPC_URL}`);
  console.log(`   Polling Interval:    ${CONFIG.POLLING_INTERVAL_MS / 1000}s`);
  console.log(`   Min APY Difference:  ${CONFIG.MIN_APY_DIFFERENCE}%\n`);

  const userProfile = {
    riskLevel: 2 as const,
    maxAllocationPerProtocol: 80,
    dailyRebalanceLimit: 5,
    rebalanceCountToday: 0,
  };

  const agentLogic = async () => {
    try {
      // Step 1: Monitor
      const snapshot = await fetchMarketSnapshot();

      // Step 2: Check Vault Status
      const vaultStatus = await checkVaultStatus(agentKeypair.publicKey);

      // Step 3: Analyze
      const decision = analyzeAndDecide(snapshot, vaultStatus.currentProtocol, userProfile);

      // Step 4: Execute
      if (decision.shouldRebalance) {
        const result = await executeRebalance(decision, agentKeypair.publicKey);
        if (result.success) {
          userProfile.rebalanceCountToday += 1;
          vaultStatus.currentProtocol = decision.targetProtocol!.name;
        }
      }

      // Step 5: Log Summary Table
      console.log(`\n┌─────────────────────────────────────────┐`);
      console.log(`│ OPTIVAULT AGENT — ${new Date().toLocaleString()} │`);
      console.log(`├─────────────────────────────────────────┤`);

      const bestName = decision.targetProtocol?.name;
      snapshot.protocols.forEach((p) => {
        const _apy = p.apy.toFixed(2).padStart(5, " ");
        const _name = p.name.padEnd(21, " ");
        const isBestFlag = p.name === bestName ? "✅ BEST" : "";
        console.log(`│ ${_name} │ ${_apy}% │ ${isBestFlag.padEnd(7, " ")} │`);
      });

      console.log(`├─────────────────────────────────────────┤`);
      const reasonLabel = decision.shouldRebalance ? `Rebalance to ${decision.targetProtocol?.name} (+${decision.apyImprovement}%)` : "No rebalance needed";
      console.log(`│ Decision: ${reasonLabel.padEnd(29, " ")} │`);
      console.log(`└─────────────────────────────────────────┘\n`);

      if (decision.shouldRebalance) {
        const fromProtocol = vaultStatus.currentProtocol;
        const currentApyRecord = snapshot.protocols.find((p) => p.name === fromProtocol);

        rebalanceHistory.unshift({
          timestamp: new Date().toISOString(),
          from: fromProtocol,
          to: decision.targetProtocol!.name,
          apyBefore: currentApyRecord ? parseFloat(currentApyRecord.apy.toFixed(2)) : 0,
          apyAfter: parseFloat(decision.targetProtocol!.apy.toFixed(2)),
          reason: decision.reason,
        });

        // Keep history manageable
        if (rebalanceHistory.length > 50) {
          rebalanceHistory.pop();
        }
      }

      const agentState: AgentState = {
        lastUpdated: new Date().toISOString(),
        protocols: snapshot.protocols.map((p) => ({
          name: p.name,
          apy: parseFloat(p.apy.toFixed(2)),
          isBest: p.name === bestName,
        })),
        decision: {
          shouldRebalance: decision.shouldRebalance,
          reason: decision.reason,
          apyImprovement: parseFloat((decision.apyImprovement || 0).toFixed(2)),
          targetProtocol: decision.targetProtocol?.name || null,
        },
        rebalanceHistory: [...rebalanceHistory], // clone array
      };

      await pushUpdateToFrontend(agentState);
    } catch (error) {
      console.error("❌ Agent loop encountered an error:", error);
    }
  };

  // Run immediate first loop
  await agentLogic();

  // Schedule subsequent loops
  const intervalId = setInterval(agentLogic, CONFIG.POLLING_INTERVAL_MS);

  process.on("SIGINT", () => {
    console.log("\n🛑 Optivault Agent shutting down...");
    clearInterval(intervalId);
    process.exit(0);
  });
}

runLoop();
