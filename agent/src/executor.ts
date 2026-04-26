import { Keypair, PublicKey } from "@solana/web3.js";
import { CONFIG } from "./config";
import { RebalanceDecision } from "./analyzer";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes"; // Extract base58 util from anchor

export interface TransactionResult {
  success: boolean;
  signature: string | null;
  error: string | null;
  executedAt: Date;
}

export function loadAgentKeypair(): Keypair {
  const privateKeyRaw = CONFIG.AGENT_PRIVATE_KEY;
  if (!privateKeyRaw) {
    throw new Error("AGENT_PRIVATE_KEY is missing in .env");
  }

  try {
    // Try parsing as JSON array first
    if (privateKeyRaw.startsWith("[")) {
      const secretArray = JSON.parse(privateKeyRaw);
      return Keypair.fromSecretKey(Uint8Array.from(secretArray));
    } else {
      // Fallback to base58 decoding using Anchor's utility
      const secretArray = bs58.decode(privateKeyRaw);
      return Keypair.fromSecretKey(secretArray);
    }
  } catch (error) {
    throw new Error(`Invalid AGENT_PRIVATE_KEY format: ${error instanceof Error ? error.message : error}`);
  }
}

export function getVaultPDA(ownerPublicKey: PublicKey): PublicKey {
  if (!CONFIG.PROGRAM_ID) throw new Error("PROGRAM_ID is missing in config");
  const programId = new PublicKey(CONFIG.PROGRAM_ID);
  
  const [vaultPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), ownerPublicKey.toBuffer()],
    programId
  );
  return vaultPda;
}

export async function executeRebalance(
  decision: RebalanceDecision,
  vaultOwner: PublicKey
): Promise<TransactionResult> {
  if (!decision.shouldRebalance || !decision.targetProtocol) {
    return { success: false, signature: null, error: "No rebalance needed", executedAt: new Date() };
  }

  try {
    console.log(`🔄 Executing rebalance: [${decision.currentProtocol?.name || "None"}] → [${decision.targetProtocol.name}] | APY improvement: +${decision.apyImprovement}%`);
    
    // MOCK TRANSACTION
    const mockSignature = "mock_sig_" + Math.random().toString(36).substring(2, 15);
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    console.log(`✅ Transaction confirmed: ${mockSignature}`);

    return {
      success: true,
      signature: mockSignature,
      error: null,
      executedAt: new Date(),
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Execution failed: ${errorMsg}`);
    return {
      success: false,
      signature: null,
      error: errorMsg,
      executedAt: new Date(),
    };
  }
}

export async function checkVaultStatus(vaultOwner: PublicKey): Promise<{ isActive: boolean; totalDeposited: number; currentProtocol: string }> {
  try {
    // MOCK DATA for now since the IDL is not connected
    return {
      isActive: true,
      totalDeposited: 1000,
      currentProtocol: "Kamino Finance"
    };
  } catch (error) {
    console.error("Error fetching vault status", error);
    throw error;
  }
}
