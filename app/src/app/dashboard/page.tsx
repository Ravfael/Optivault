"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { PortfolioCard } from "@/components/dashboard/PortfolioCard";
import { AIStatusCard } from "@/components/dashboard/AIStatusCard";
import { AllocationChart } from "@/components/dashboard/AllocationChart";
import { APYChart } from "@/components/dashboard/APYChart";
import { AllocationsTable } from "@/components/dashboard/AllocationsTable";
import { motion } from "framer-motion";
import { useOptivault } from "@/hooks/useOptivault";
import { useWallet } from "@solana/wallet-adapter-react";

const sparklineData = [4, 6, 5, 8, 7, 9, 8, 10, 9, 11, 10, 12, 11, 13, 14];

export default function DashboardPage() {
  const { connected } = useWallet();
  const { fetchVaultData } = useOptivault();
  const [vault, setVault] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!connected) return;

    let mounted = true;

    const load = async () => {
      if (!vault) setLoading(true);
      try {
        const data = await fetchVaultData();
        if (mounted) {
          setVault(data);
        }
      } catch (err) {
        console.error("Failed to fetch vault data:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [connected, fetchVaultData]);

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans selection:bg-[#8b5cf6]/30 relative overflow-hidden">
      {/* Background from landing page */}
      <div
        className="fixed inset-0 z-0 opacity-100 bg-[#050505]"
        style={{
          backgroundImage: "url('/background1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative z-10 flex w-full h-screen">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 pt-12 lg:pt-0">
              <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
              <p className="text-sm text-text-muted mt-1">Overview of your AI-managed portfolio</p>
            </motion.div>

            {!connected ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 text-center">
                <h2 className="text-xl font-semibold mb-2">Wallet Disconnected</h2>
                <p className="text-text-muted">Connect your wallet to view your vault.</p>
              </motion.div>
            ) : loading && !vault ? (
              <div className="flex flex-col gap-6 animate-pulse">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="h-32 bg-white/[0.04] rounded-xl" />
                  <div className="h-32 bg-white/[0.04] rounded-xl" />
                  <div className="h-32 bg-white/[0.04] rounded-xl" />
                </div>
                <div className="h-40 bg-white/[0.04] rounded-xl" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-64 bg-white/[0.04] rounded-xl" />
                  <div className="h-64 bg-white/[0.04] rounded-xl" />
                </div>
              </div>
            ) : (
              <>
                {/* Portfolio Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <PortfolioCard title="Total Balance" value={vault && typeof vault.totalDeposited === "number" ? vault.totalDeposited.toFixed(2) + " SOL" : "—"} icon="balance" delay={0} />
                  <PortfolioCard title="Current APY" value="7.82%" icon="apy" delay={0.1} sparklineData={sparklineData} />
                  <PortfolioCard title="Total Earned" value={vault && typeof vault.totalEarned === "number" ? vault.totalEarned.toFixed(4) + " SOL" : "—"} icon="earned" delay={0.2} />
                </div>

                {/* AI Status */}
                <div className="mb-6">
                  <AIStatusCard isActiveInitial={vault ? vault.isActive : false} lastRebalanceTime={vault ? vault.lastRebalance : undefined} />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <AllocationChart />
                  <APYChart />
                </div>

                {/* Allocations Table */}
                <AllocationsTable />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
