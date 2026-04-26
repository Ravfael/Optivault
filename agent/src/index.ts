import { CONFIG } from "./config";
import { fetchMarketSnapshot } from "./monitor";
import { analyzeAndDecide } from "./analyzer";
import { loadAgentKeypair, checkVaultStatus, executeRebalance } from "./executor";

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
    rebalanceCountToday: 0 
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
        const _apy = p.apy.toFixed(2).padStart(5, ' ');
        const _name = p.name.padEnd(21, ' ');
        const isBestFlag = p.name === bestName ? "✅ BEST" : "";
        console.log(`│ ${_name} │ ${_apy}% │ ${isBestFlag.padEnd(7, ' ')} │`);
      });

      console.log(`├─────────────────────────────────────────┤`);
      const reasonLabel = decision.shouldRebalance 
        ? `Rebalance to ${decision.targetProtocol?.name} (+${decision.apyImprovement}%)`
        : "No rebalance needed";
      console.log(`│ Decision: ${reasonLabel.padEnd(29, ' ')} │`);
      console.log(`└─────────────────────────────────────────┘\n`);

    } catch (error) {
      console.error("❌ Agent loop encountered an error:", error);
    }
  };

  // Run immediate first loop
  await agentLogic();
  
  // Schedule subsequent loops
  const intervalId = setInterval(agentLogic, CONFIG.POLLING_INTERVAL_MS);

  process.on('SIGINT', () => {
    console.log("\n🛑 Optivault Agent shutting down...");
    clearInterval(intervalId);
    process.exit(0);
  });
}

runLoop();
