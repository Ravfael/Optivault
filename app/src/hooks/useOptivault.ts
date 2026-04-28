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
      return { success: false, error: error.message };
    }
  }

  // Deposit SOL ke vault
  async function deposit(amountSol: number) {
    try {
      const provider = getProvider();
      const program = getProgram(provider);
      const [vaultPDA] = getVaultPDA(provider.wallet.publicKey);

      // We are simulating USDC with Devnet SOL.
      // 1000 "USDC" normally = 1000 SOL if * 1_000_000_000, which is impossible to get from faucets.
      // Scaling down to 10,000 lamports per nominal USDC so a 1000 "USDC" mock deposit only uses 0.01 Devnet SOL.
      const lamports = amountSol * 10_000;

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
