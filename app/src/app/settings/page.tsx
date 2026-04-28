"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { CryptoTooltip } from "@/components/shared/Tooltip";
import {
  Shield,
  Scale,
  Rocket,
  Sliders,
  Bell,
  AlertTriangle,
  LogOut,
  Save,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PROTOCOLS } from "@/lib/mockData";

export default function SettingsPage() {
  const [riskProfile, setRiskProfile] = useState("balanced");
  const [maxAllocation, setMaxAllocation] = useState<Record<string, number>>({
    Kamino: 40,
    MarginFi: 30,
    Marinade: 25,
    Raydium: 20,
    Orca: 25,
  });
  const [dailyLimit, setDailyLimit] = useState(5);
  const [notifications, setNotifications] = useState({
    rebalance: true,
    deposits: true,
    warnings: true,
    weekly: false,
  });
  const [saved, setSaved] = useState(false);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const profiles = [
    { id: "conservative", icon: Shield, emoji: "🛡️", label: "Conservative", color: "#22C55E" },
    { id: "balanced", icon: Scale, emoji: "⚖️", label: "Balanced", color: "#7C3AED" },
    { id: "aggressive", icon: Rocket, emoji: "🚀", label: "Aggressive", color: "#F59E0B" },
  ];

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans selection:bg-[#8b5cf6]/30 relative overflow-hidden">
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
          <div className="max-w-3xl mx-auto pt-12 lg:pt-0">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
            <p className="text-sm text-text-muted mt-1">Manage your AI agent preferences and account</p>
          </motion.div>

          <div className="space-y-8">
            {/* Risk Profile */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
              <h2 className="text-base font-semibold text-text-primary mb-1 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary" />
                <CryptoTooltip term="Risk Profile">Risk Profile</CryptoTooltip>
              </h2>
              <p className="text-xs text-text-muted mb-5">How aggressively should AI optimize your returns?</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {profiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setRiskProfile(p.id)}
                    className={cn(
                      "py-4 px-4 rounded-xl border-2 text-center transition-all duration-200",
                      riskProfile === p.id
                        ? "shadow-lg"
                        : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
                    )}
                    style={riskProfile === p.id ? { backgroundColor: `${p.color}10`, borderColor: `${p.color}40` } : undefined}
                  >
                    <span className="text-xl">{p.emoji}</span>
                    <p className="text-sm font-semibold mt-1" style={{ color: riskProfile === p.id ? p.color : "#F1F5F9" }}>
                      {p.label}
                    </p>
                  </button>
                ))}
              </div>
            </motion.section>

            {/* Max Allocation */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
              <h2 className="text-base font-semibold text-text-primary mb-1 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-secondary" />
                Max Allocation per <CryptoTooltip term="Protocol">Protocol</CryptoTooltip>
              </h2>
              <p className="text-xs text-text-muted mb-5">Set the maximum % of your portfolio that can go to each protocol</p>

              <div className="space-y-4">
                {PROTOCOLS.map((protocol) => (
                  <div key={protocol.name} className="flex items-center gap-4">
                    <div className="flex items-center gap-2 w-28 shrink-0">
                      <img src={protocol.logo} alt={protocol.name} className="w-6 h-6 rounded-full object-cover border border-white/10" />
                      <span className="text-sm text-text-primary font-medium">{protocol.name}</span>
                    </div>
                    <div className="flex-1">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={maxAllocation[protocol.name] || 25}
                        onChange={(e) => setMaxAllocation((prev) => ({ ...prev, [protocol.name]: parseInt(e.target.value) }))}
                        className="w-full h-1.5 rounded-full appearance-none bg-white/[0.08] 
                                   [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                                   [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
                                   [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer
                                   [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary/30"
                      />
                    </div>
                    <span className="text-sm font-semibold text-text-primary w-12 text-right">
                      {maxAllocation[protocol.name] || 25}%
                    </span>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Daily Rebalance Limit */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
              <h2 className="text-base font-semibold text-text-primary mb-1 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-warning" />
                Daily <CryptoTooltip term="Rebalance">Rebalance</CryptoTooltip> Limit
              </h2>
              <p className="text-xs text-text-muted mb-5">Maximum number of times AI can move your funds per day</p>

              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(parseInt(e.target.value))}
                  className="flex-1 h-1.5 rounded-full appearance-none bg-white/[0.08]
                             [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
                             [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
                             [&::-webkit-slider-thumb]:bg-warning [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <span className="text-lg font-bold text-text-primary w-16 text-right">
                  {dailyLimit}x/day
                </span>
              </div>
            </motion.section>

            {/* Notifications */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
              <h2 className="text-base font-semibold text-text-primary mb-1 flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                Notifications
              </h2>
              <p className="text-xs text-text-muted mb-5">Choose what updates you want to receive</p>

              <div className="space-y-4">
                {[
                  { key: "rebalance", label: "Rebalance alerts", desc: "Get notified when AI moves your funds" },
                  { key: "deposits", label: "Deposit confirmations", desc: "Confirmation when deposits are processed" },
                  { key: "warnings", label: "Risk warnings", desc: "Alerts about unusual market conditions" },
                  { key: "weekly", label: "Weekly summary", desc: "Weekly report of your portfolio performance" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm text-text-primary font-medium">{item.label}</p>
                      <p className="text-xs text-text-muted">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                      className={cn(
                        "w-11 h-6 rounded-full transition-all duration-200 relative",
                        notifications[item.key as keyof typeof notifications]
                          ? "bg-primary"
                          : "bg-white/[0.1]"
                      )}
                    >
                      <div
                        className={cn(
                          "w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-200",
                          notifications[item.key as keyof typeof notifications] ? "left-6" : "left-1"
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Save */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <button onClick={handleSave} className="btn-primary w-full flex items-center justify-center gap-2">
                {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Settings</>}
              </button>
            </motion.div>

            {/* Danger Zone */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-6 border-danger/20">
              <h2 className="text-base font-semibold text-danger mb-1 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Danger Zone
              </h2>
              <p className="text-xs text-text-muted mb-5">Irreversible actions — proceed with caution</p>

              {!showWithdrawConfirm ? (
                <button
                  onClick={() => setShowWithdrawConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-danger/20 
                             text-danger text-sm font-medium hover:bg-danger/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Withdraw All Funds &amp; Deactivate AI
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-danger/5 border border-danger/20">
                  <p className="text-sm text-text-primary mb-3">
                    Are you sure? This will withdraw all funds and stop your AI agent.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowWithdrawConfirm(false)}
                      className="btn-secondary text-sm px-4 py-2"
                    >
                      Cancel
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-danger text-white text-sm font-semibold 
                                       hover:bg-danger/80 transition-colors">
                      Confirm Withdrawal
                    </button>
                  </div>
                </div>
              )}
            </motion.section>
          </div>
          </div>
        </main>
      </div>
    </div>
  );
}
