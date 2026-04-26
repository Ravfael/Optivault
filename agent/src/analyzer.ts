import { ProtocolData, MarketSnapshot } from "./monitor";
import { CONFIG } from "./config";

export interface UserProfile {
  riskLevel: 1 | 2 | 3;
  maxAllocationPerProtocol: number;
  dailyRebalanceLimit: number;
  rebalanceCountToday: number;
}

export interface RebalanceDecision {
  shouldRebalance: boolean;
  targetProtocol: ProtocolData | null;
  currentProtocol: ProtocolData | null;
  reason: string;
  apyImprovement: number;
}

export function analyzeAndDecide(
  snapshot: MarketSnapshot,
  currentProtocolAddress: string,
  userProfile: UserProfile
): RebalanceDecision {
  try {
    const currentProtocol = snapshot.protocols.find(p => p.name === currentProtocolAddress) || null;
    const currentApy = currentProtocol?.apy || 0;

    // 1. Filter out unavailable protocols
    let available = snapshot.protocols.filter(p => p.isAvailable);

    // 2-4. Filter based on risk profile
    if (userProfile.riskLevel === 1) {
      // Conservative: Kamino and MarginFi only
      available = available.filter(p => 
        p.name === CONFIG.PROTOCOLS.KAMINO.name || 
        p.name === CONFIG.PROTOCOLS.MARGINFI.name
      );
    } // If 2, Balanced: Consider all. If 3, Aggressive: consider all (prioritize APY later)

    if (available.length === 0) {
      const reason = "No available protocols match your risk profile.";
      console.log(`⏸️  ${reason}`);
      return { shouldRebalance: false, targetProtocol: null, currentProtocol, reason, apyImprovement: 0 };
    }

    // 5. Find best protocol 
    const bestProtocol = available.reduce((prev, curr) => (curr.apy > prev.apy ? curr : prev));
    const apyImprovement = parseFloat((bestProtocol.apy - currentApy).toFixed(2));

    // 7. Check daily limit
    if (userProfile.rebalanceCountToday >= userProfile.dailyRebalanceLimit) {
      const reason = "Blocked by daily rebalance limit.";
      console.log(`🚫 ${reason}`);
      return { shouldRebalance: false, targetProtocol: null, currentProtocol, reason, apyImprovement: 0 };
    }                 

    // 6. Check if improvement meets MIN_APY_DIFFERENCE
    if (bestProtocol.name !== currentProtocol?.name && apyImprovement > CONFIG.MIN_APY_DIFFERENCE) {
      const reason = `Found better opportunity in ${bestProtocol.name} (+${apyImprovement}% improvement over ${currentProtocol?.name || 'none'}).`;
      console.log(`✅ ${reason}`);
      return { shouldRebalance: true, targetProtocol: bestProtocol, currentProtocol, reason, apyImprovement };
    }

    const reason = "Current protocol is optimal or APY difference is too small.";
    console.log(`⏸️  ${reason}`);
    return { shouldRebalance: false, targetProtocol: bestProtocol, currentProtocol, reason, apyImprovement: 0 };

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "analyzer error";
    console.error("[Analyzer] Error during analysis:", errorMsg);
    return { shouldRebalance: false, targetProtocol: null, currentProtocol: null, reason: "Error during analysis", apyImprovement: 0 };
  }
}
