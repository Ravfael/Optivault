"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { PortfolioCard } from "@/components/dashboard/PortfolioCard";
import { AIStatusCard } from "@/components/dashboard/AIStatusCard";
import { AllocationChart } from "@/components/dashboard/AllocationChart";
import { APYChart } from "@/components/dashboard/APYChart";
import { AllocationsTable } from "@/components/dashboard/AllocationsTable";
import { motion, AnimatePresence } from "framer-motion";
import { useOptivault } from "@/hooks/useOptivault";
import { useAgentStream } from "@/hooks/useAgentStream";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";

const sparklineData = [4, 6, 5, 8, 7, 9, 8, 10, 9, 11, 10, 12, 11, 13, 14];

export default function DashboardPage() {
  const { connected } = useWallet();
  const { fetchVaultData } = useOptivault();
  const { agentState, isConnected, lastUpdated } = useAgentStream();
  const [vault, setVault] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!connected) return;

    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchVaultData();
        if (mounted) {
          if (data && data.success) {
            setVault(data.vault);
          } else {
            setVault(null);
          }
        }
      } catch (err) {
        console.error("Failed to fetch vault data:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    // Refresh vault data on focus
    const onFocus = () => {
      load();
    };
    window.addEventListener("focus", onFocus);

    const interval = setInterval(load, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [connected, fetchVaultData]);

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans selection:bg-[#8b5cf6]/30 relative overflow-hidden">
      {/* Background from landing page */}
      <div
        className="fixed inset-0 z-0 opacity-100 bg-[#050505]"
        style={{
          backgroundImage: "url('/background2.png')",
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
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 pt-12 lg:pt-0 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
                <p className="text-sm text-text-muted mt-1">Overview of your AI-managed portfolio</p>
              </div>
              <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-full">
                <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-primary shadow-[0_0_8px_rgba(139,92,246,0.6)] animate-pulse" : "bg-gray-500"}`} />
                <span className="text-xs font-medium text-text-muted">{isConnected ? "Agent Live" : "Agent Offline"}</span>
              </div>
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
            ) : !vault || vault.totalDeposited <= 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 text-center max-w-lg mx-auto mt-12">
                <div className="w-16 h-16 bg-white/[0.02] border border-white/[0.05] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h2 className="text-xl font-bold mb-2">No active vault found</h2>
                <p className="text-text-muted mb-6">Start by making a deposit to activate your AI agent.</p>
                <Link href="/setup" className="btn-primary inline-flex items-center gap-2">
                  Setup Vault Now
                </Link>
              </motion.div>
            ) : (
              <>
                {/* Portfolio Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <PortfolioCard title="Total Balance" value={vault && typeof vault.totalDeposited === "number" ? vault.totalDeposited.toFixed(2) + " SOL" : "—"} icon="balance" delay={0} />
                  <PortfolioCard
                    title="Current APY"
                    value={agentState?.protocols.find((p) => p.isBest)?.apy ? `${agentState.protocols.find((p) => p.isBest)?.apy}%` : vault?.isActive ? "7.82%" : "—"}
                    icon="apy"
                    delay={0.1}
                    sparklineData={sparklineData}
                  />
                  <PortfolioCard title="Total Earned" value={vault && typeof vault.totalEarned === "number" ? vault.totalEarned.toFixed(4) + " SOL" : "—"} icon="earned" delay={0.2} />
                </div>

                {/* AI Status */}
                <div className="mb-6">
                  <AIStatusCard
                    isActiveInitial={isConnected}
                    lastRebalanceTime={agentState?.lastUpdated ? new Date(agentState.lastUpdated) : vault?.lastRebalance}
                    agentMessage={
                      agentState?.decision.shouldRebalance ? `AI rebalanced to ${agentState?.decision.targetProtocol} (+${agentState?.decision.apyImprovement}% APY)` : agentState?.decision.reason || "Current allocation is optimal"
                    }
                  />
                </div>

                {/* AI Activity Section */}
                <div className="mb-6">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-text-primary">Recent AI Activity</h2>
                      <Link href="/activity" className="text-xs text-primary hover:text-primary-light transition-colors">
                        View All
                      </Link>
                    </div>
                    {agentState && agentState.rebalanceHistory.length > 0 ? (
                      <div className="space-y-4">
                        {agentState.rebalanceHistory.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex gap-4 p-3 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                            <div className="text-sm font-medium text-text-muted mt-1 w-16">{new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                            <div className="flex-1">
                              <p className="text-sm text-text-primary">
                                <span className="text-primary mr-1">Rebalanced</span> from {item.from} to {item.to}
                              </p>
                              <p className="text-xs text-text-muted mt-1">
                                {item.reason} (+{(item.apyAfter - item.apyBefore).toFixed(2)}%)
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-text-muted text-center py-6">No rebalances yet — AI is monitoring</p>
                    )}
                  </motion.div>
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
