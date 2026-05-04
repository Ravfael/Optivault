import { useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getVaultPDA, getUserConfigPDA } from "@/lib/program";

export function useOptivault() {
  const { connection } = useConnection();
  const wallet = useWallet();

  function getProvider() {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error("Wallet not connected");
    }
    return new AnchorProvider(connection, wallet as any, {
      commitment: "confirmed",
    });
  }

  // Initialize vault untuk user baru
  async function initializeVault(riskLevel: number, timeHorizonDays: number) {
    try {
      const provider = getProvider();
      const program = getProgram(provider);
      const [vaultPDA] = getVaultPDA(provider.wallet.publicKey);
      const [configPDA] = getUserConfigPDA(provider.wallet.publicKey);

      // Check if vault already exists
      const vaultAccountInfo = await connection.getAccountInfo(vaultPDA);
      if (vaultAccountInfo) {
        console.log("ℹ️ Vault already initialized");
        return { success: true, alreadyInitialized: true };
      }

      // Check balance to provide a better error instead of simulation failed block
      const balance = await connection.getBalance(provider.wallet.publicKey);
      if (balance === 0) {
        return { success: false, error: "Your Devnet wallet has 0 SOL. Please use faucet.solana.com to get Devnet SOL to pay for transaction fees." };
      }

      const timeHorizon = Math.floor(Date.now() / 1000) + timeHorizonDays * 86400;

      const tx = await program.methods
        .initialize(riskLevel, new BN(timeHorizon))
        .accounts({
          user: provider.wallet.publicKey,
          vaultAccount: vaultPDA,
          userConfig: configPDA,
          systemProgram: PublicKey.default,
        } as any)
        .rpc();

      console.log("✅ Vault initialized:", tx);
      return { success: true, signature: tx };
    } catch (error: any) {
      console.error("❌ Initialize failed:", error);
      if (error.message?.includes("This transaction has already been processed")) {
        console.log("✅ Vault initialized (recovered from RPC retry simulation error)");
        return { success: true, signature: "already-processed-via-rpc" };
      }
      return { success: false, error: error.message };
    }
  }

  // Deposit SOL ke vault
  async function deposit(amountSol: number) {
    try {
      const provider = getProvider();
      const program = getProgram(provider);
      const [vaultPDA] = getVaultPDA(provider.wallet.publicKey);

      // Normal SOL scaling
      const lamports = amountSol * 1_000_000_000;

      const balance = await connection.getBalance(provider.wallet.publicKey);
      if (balance < lamports) {
        return { success: false, error: `Insufficient Devnet SOL for this deposit simulation. You need at least ${(lamports / 1e9).toFixed(5)} SOL.` };
      }

      const tx = await program.methods
        .deposit(new BN(lamports))
        .accounts({
          user: provider.wallet.publicKey,
          vaultAccount: vaultPDA,
          systemProgram: PublicKey.default,
        } as any)
        .rpc();

      console.log("✅ Deposit successful:", tx);
      return { success: true, signature: tx };
    } catch (error: any) {
      console.error("❌ Deposit failed:", error);
      if (error.message?.includes("This transaction has already been processed")) {
        console.log("✅ Deposit successful (recovered from RPC retry simulation error)");
        return { success: true, signature: "already-processed-via-rpc" };
      }
      return { success: false, error: error.message };
    }
  }

  // Withdraw SOL dari vault
  async function withdraw(amountSol: number) {
    try {
      const provider = getProvider();
      const program = getProgram(provider);
      const [vaultPDA] = getVaultPDA(provider.wallet.publicKey);

      const lamports = amountSol * 1_000_000_000;

      const tx = await program.methods
        .withdraw(new BN(lamports))
        .accounts({
          user: provider.wallet.publicKey,
          vaultAccount: vaultPDA,
          systemProgram: PublicKey.default,
        } as any)
        .rpc();

      console.log("✅ Withdraw successful:", tx);
      return { success: true, signature: tx };
    } catch (error: any) {
      console.error("❌ Withdraw failed:", error);
      if (error.message?.includes("This transaction has already been processed")) {
        console.log("✅ Withdraw successful (recovered from RPC retry simulation error)");
        return { success: true, signature: "already-processed-via-rpc" };
      }
      return { success: false, error: error.message };
    }
  }

  // Fetch vault data untuk ditampilkan di dashboard
  async function updateUserConfig(riskLevel: number, dailyRebalanceLimit: number): Promise<{ success: boolean; signature?: string; error?: string }> {
    try {
      const provider = getProvider();
      const program = getProgram(provider);
      const [configPDA] = getUserConfigPDA(provider.wallet.publicKey);

      // Check if updateConfig exists on the IDL
      if ((program.methods as any).updateUserConfig) {
        const tx = await (program.methods as any)
          .updateUserConfig(riskLevel, dailyRebalanceLimit)
          .accounts({
            user: provider.wallet.publicKey,
            userConfig: configPDA,
            systemProgram: PublicKey.default,
          } as any)
          .rpc();

        console.log("✅ Config updated:", tx);
        return { success: true, signature: tx };
      } else {
        // Fallback for MVP if the instruction doesn't exist yet
        console.log("ℹ️ Simulated updateUserConfig (instruction not in IDL)", { riskLevel, dailyRebalanceLimit });

        // Save to localStorage so it persists across page reloads
        localStorage.setItem(`optivault_riskLevel_${provider.wallet.publicKey.toString()}`, riskLevel.toString());
        localStorage.setItem(`optivault_dailyLimit_${provider.wallet.publicKey.toString()}`, dailyRebalanceLimit.toString());

        return { success: true, signature: "simulated-update-success" };
      }
    } catch (error: any) {
      console.error("❌ Update config failed:", error);
      return { success: false, error: error.message };
    }
  }

  // Fetch vault data untuk ditampilkan di dashboard
  const fetchVaultData = useCallback(async () => {
    try {
      const provider = getProvider();
      const program = getProgram(provider);
      const [vaultPDA] = getVaultPDA(provider.wallet.publicKey);
      const [configPDA] = getUserConfigPDA(provider.wallet.publicKey);

      const vaultAccountInfo = await connection.getAccountInfo(vaultPDA);
      if (!vaultAccountInfo) {
        return { success: true, vault: null, config: null };
      }

      const vault = await program.account.vaultAccount.fetch(vaultPDA);
      const config = await program.account.userConfig.fetch(configPDA);

      // Read fallback data from localStorage if it exists
      const fallbackRiskStr = localStorage.getItem(`optivault_riskLevel_${provider.wallet.publicKey.toString()}`);
      const fallbackLimitStr = localStorage.getItem(`optivault_dailyLimit_${provider.wallet.publicKey.toString()}`);

      const riskLevel = fallbackRiskStr ? parseInt(fallbackRiskStr) : config.riskLevel;
      const dailyRebalanceLimit = fallbackLimitStr ? parseInt(fallbackLimitStr) : config.dailyRebalanceLimit;

      console.log("Raw vault data from chain:", {
        totalDepositedLamports: vault.totalDeposited.toString(),
        totalEarnedLamports: vault.totalEarned.toString(),
      });

      return {
        success: true,
        vault: {
          totalDeposited: vault.totalDeposited.toNumber() / 1_000_000_000,
          totalEarned: vault.totalEarned.toNumber() / 1_000_000_000,
          isActive: vault.isActive,
          lastRebalance: new Date(vault.lastRebalance.toNumber() * 1000),
        },
        config: {
          riskLevel,
          timeHorizon: new Date(config.timeHorizon.toNumber() * 1000),
          dailyRebalanceLimit,
        },
      };
    } catch (error: any) {
      console.error("❌ Fetch vault data failed:", error);
      return { success: false, error: error.message };
    }
  }, [connection, wallet]);

  return {
    initializeVault,
    deposit,
    withdraw,
    fetchVaultData,
    updateUserConfig,
    isWalletConnected: !!wallet.publicKey,
  };
}
