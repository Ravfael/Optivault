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
      return { success: false, error: error.message };
    }
  }

  // Deposit SOL ke vault
  async function deposit(amountSol: number) {
    try {
      const provider = getProvider();
      const program = getProgram(provider);
      const [vaultPDA] = getVaultPDA(provider.wallet.publicKey);

      // Convert SOL ke lamports (1 SOL = 1_000_000_000 lamports)
      const lamports = amountSol * 1_000_000_000;

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
      return { success: false, error: error.message };
    }
  }

  // Fetch vault data untuk ditampilkan di dashboard
  async function fetchVaultData() {
    try {
      const provider = getProvider();
      const program = getProgram(provider);
      const [vaultPDA] = getVaultPDA(provider.wallet.publicKey);
      const [configPDA] = getUserConfigPDA(provider.wallet.publicKey);

      const vault = await program.account.vaultAccount.fetch(vaultPDA);
      const config = await program.account.userConfig.fetch(configPDA);

      return {
        success: true,
        vault: {
          totalDeposited: vault.totalDeposited.toNumber() / 1_000_000_000,
          totalEarned: vault.totalEarned.toNumber() / 1_000_000_000,
          isActive: vault.isActive,
          lastRebalance: new Date(vault.lastRebalance.toNumber() * 1000),
        },
        config: {
          riskLevel: config.riskLevel,
          timeHorizon: new Date(config.timeHorizon.toNumber() * 1000),
          dailyRebalanceLimit: config.dailyRebalanceLimit,
        },
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  return {
    initializeVault,
    deposit,
    withdraw,
    fetchVaultData,
    isWalletConnected: !!wallet.publicKey,
  };
}
