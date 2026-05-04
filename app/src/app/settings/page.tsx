"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { CryptoTooltip } from "@/components/shared/Tooltip";
import { useOptivault } from "@/hooks/useOptivault";
import { Shield, Scale, Rocket, Sliders, Bell, AlertTriangle, LogOut, Save, Check, Wallet, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PROTOCOLS } from "@/lib/mockData";

export default function SettingsPage() {
  const router = useRouter();
  const { fetchVaultData, updateUserConfig, withdraw, isWalletConnected } = useOptivault();

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

  // State to track if data was loaded and original values
  const [originalSettings, setOriginalSettings] = useState<{
    riskProfile: string;
    dailyLimit: number;
    notifications: typeof notifications;
  } | null>(null);

  const [totalDeposited, setTotalDeposited] = useState(0);

  const [isInitializing, setIsInitializing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const loadData = useCallback(async () => {
    if (!isWalletConnected) {
      setIsInitializing(false);
      return;
    }

    try {
      // Load off-chain settings
      const notifSettings = {
        rebalance: localStorage.getItem("optivault_notif_rebalance") !== "false",
        deposits: localStorage.getItem("optivault_notif_deposit") !== "false",
        warnings: localStorage.getItem("optivault_notif_risk") !== "false",
        weekly: localStorage.getItem("optivault_notif_weekly") === "true",
      };
      setNotifications(notifSettings);

      // Load allocations
      const kaminoAlloc = localStorage.getItem("optivault_allocation_kamino");
      const marginfiAlloc = localStorage.getItem("optivault_allocation_marginfi");
      const marinadeAlloc = localStorage.getItem("optivault_allocation_marinade");
      const raydiumAlloc = localStorage.getItem("optivault_allocation_raydium");
      const orcaAlloc = localStorage.getItem("optivault_allocation_orca");

      if (kaminoAlloc) setMaxAllocation((prev) => ({ ...prev, Kamino: parseInt(kaminoAlloc) }));
      if (marginfiAlloc) setMaxAllocation((prev) => ({ ...prev, MarginFi: parseInt(marginfiAlloc) }));
      if (marinadeAlloc) setMaxAllocation((prev) => ({ ...prev, Marinade: parseInt(marinadeAlloc) }));
      if (raydiumAlloc) setMaxAllocation((prev) => ({ ...prev, Raydium: parseInt(raydiumAlloc) }));
      if (orcaAlloc) setMaxAllocation((prev) => ({ ...prev, Orca: parseInt(orcaAlloc) }));

      const res = await fetchVaultData();
      if (res.success && res.config && res.vault) {
        setTotalDeposited(res.vault.totalDeposited);

        // Map contract risk level back to string
        const mappedRisk = res.config.riskLevel === 1 ? "conservative" : res.config.riskLevel === 2 ? "balanced" : "aggressive";

        setRiskProfile(mappedRisk);
        setDailyLimit(res.config.dailyRebalanceLimit);

        setOriginalSettings({
          riskProfile: mappedRisk,
          dailyLimit: res.config.dailyRebalanceLimit,
          notifications: notifSettings,
        });
      } else {
        // Fallback to local storage if SC fetch fails
        const riskLvl = localStorage.getItem("optivault_risk_level");
        const dailyLim = localStorage.getItem("optivault_daily_limit");

        const mappedRisk = riskLvl === "1" ? "conservative" : riskLvl === "2" ? "balanced" : riskLvl === "3" ? "aggressive" : "balanced";
        const limitVal = dailyLim ? parseInt(dailyLim) : 5;

        setRiskProfile(mappedRisk);
        setDailyLimit(limitVal);

        setOriginalSettings({
          riskProfile: mappedRisk,
          dailyLimit: limitVal,
          notifications: notifSettings,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsInitializing(false);
    }
  }, [isWalletConnected, fetchVaultData]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const showToast = (text: string, type: "success" | "error") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const numRisk = riskProfile === "conservative" ? 1 : riskProfile === "balanced" ? 2 : 3;

      // Save ALL settings to localStorage immediately
      localStorage.setItem("optivault_risk_level", String(numRisk));
      localStorage.setItem("optivault_daily_limit", String(dailyLimit));
      localStorage.setItem("optivault_allocation_kamino", String(maxAllocation.Kamino || 0));
      localStorage.setItem("optivault_allocation_marginfi", String(maxAllocation.MarginFi || 0));
      localStorage.setItem("optivault_allocation_marinade", String(maxAllocation.Marinade || 0));
      localStorage.setItem("optivault_allocation_raydium", String(maxAllocation.Raydium || 0));
      localStorage.setItem("optivault_allocation_orca", String(maxAllocation.Orca || 0));

      localStorage.setItem("optivault_notif_rebalance", String(notifications.rebalance));
      localStorage.setItem("optivault_notif_deposit", String(notifications.deposits));
      localStorage.setItem("optivault_notif_risk", String(notifications.warnings));
      localStorage.setItem("optivault_notif_weekly", String(notifications.weekly));

      // If wallet connected, also attempt to save to SC
      if (isWalletConnected) {
        await updateUserConfig(numRisk, dailyLimit);
      }

      setSaved(true);
      showToast("Settings saved successfully", "success");
      setOriginalSettings({
        riskProfile,
        dailyLimit,
        notifications,
      });
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      showToast(err.message || "An error occurred", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleWithdrawAll = async () => {
    if (!isWalletConnected) return;
    if (totalDeposited === 0) return;

    setIsWithdrawing(true);
    try {
      const res = await withdraw(totalDeposited);
      if (res.success) {
        // Clear ALL optivault localStorage keys
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("optivault_")) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));

        showToast("Funds withdrawn successfully", "success");
        setTimeout(() => {
          router.push("/setup");
        }, 2000);
      } else {
        showToast(res.error || "Withdrawal failed", "error");
        setIsWithdrawing(false);
      }
    } catch (err: any) {
      showToast(err.message || "An error occurred", "error");
      setIsWithdrawing(false);
    }
  };

  const totalAllocation = Object.values(maxAllocation).reduce((acc, curr) => acc + curr, 0);
  const isAllocationInvalid = totalAllocation > 100;

  const hasChanges = useMemo(() => {
    if (!originalSettings) return true; // If no initial load, assume changes initially or let them save
    if (originalSettings.riskProfile !== riskProfile) return true;
    if (originalSettings.dailyLimit !== dailyLimit) return true;
    if (JSON.stringify(originalSettings.notifications) !== JSON.stringify(notifications)) return true;
    return false;
  }, [originalSettings, riskProfile, dailyLimit, notifications]);

  const canSave = !isSaving && !isAllocationInvalid && hasChanges;

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

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={cn(
            "fixed top-4 right-4 z-50 px-4 py-2 rounded-xl border flex items-center gap-2 shadow-lg transition-all",
            toastMessage.type === "success" ? "bg-primary/10 border-primary/30 text-primary" : "bg-danger/10 border-danger/30 text-danger",
          )}
        >
          {toastMessage.type === "success" ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span className="text-sm font-medium">{toastMessage.text}</span>
        </div>
      )}

      <div className="relative z-10 flex w-full h-screen">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {!isWalletConnected ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Wallet className="w-12 h-12 text-white/20 mb-4" />
              <h2 className="text-xl font-semibold text-text-primary mb-2">Wallet Not Connected</h2>
              <p className="text-text-muted text-sm max-w-sm text-center">Connect your wallet to manage settings.</p>
            </div>
          ) : isInitializing ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-primary opacity-50" />
            </div>
          ) : (
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
                        className={cn("py-4 px-4 rounded-xl border-2 text-center transition-all duration-200", riskProfile === p.id ? "shadow-lg" : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]")}
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
                          <img /* eslint-disable-next-line @next/next/no-img-element */ src={protocol.logo} alt={protocol.name} className="w-6 h-6 rounded-full object-cover border border-white/10" />
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
                        <span className="text-sm font-semibold text-text-primary w-12 text-right">{maxAllocation[protocol.name] || 25}%</span>
                      </div>
                    ))}
                  </div>
                  {isAllocationInvalid && (
                    <div className="mt-4 p-3 rounded-xl bg-danger/10 border border-danger/20 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-danger" />
                      <p className="text-sm text-danger font-medium">Total allocation cannot exceed 100% (currently {totalAllocation}%)</p>
                    </div>
                  )}
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
                      max={10}
                      value={dailyLimit}
                      onChange={(e) => setDailyLimit(parseInt(e.target.value))}
                      className="flex-1 h-1.5 rounded-full appearance-none bg-white/[0.08]
                             [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
                             [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
                             [&::-webkit-slider-thumb]:bg-warning [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                    <span className="text-lg font-bold text-text-primary w-16 text-right">{dailyLimit}x/day</span>
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
                          className={cn("w-11 h-6 rounded-full transition-all duration-200 relative", notifications[item.key as keyof typeof notifications] ? "bg-primary" : "bg-white/[0.1]")}
                        >
                          <div className={cn("w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-200", notifications[item.key as keyof typeof notifications] ? "left-6" : "left-1")} />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.section>

                {/* Save */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <button onClick={handleSave} disabled={!canSave} className={cn("btn-primary w-full flex items-center justify-center gap-2 transition-all", !canSave ? "opacity-50 cursor-not-allowed bg-white/10" : "")}>
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                      </>
                    ) : saved ? (
                      <>
                        <Check className="w-4 h-4" /> Saved!
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> Save Settings
                      </>
                    )}
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
                      disabled={totalDeposited === 0}
                      className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 rounded-xl border border-danger/20 
                             text-danger text-sm font-medium hover:bg-danger/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    >
                      <LogOut className="w-4 h-4" />
                      {totalDeposited === 0 ? "No funds to withdraw" : "Withdraw All Funds & Deactivate AI"}
                    </button>
                  ) : (
                    <div className="p-4 rounded-xl bg-danger/5 border border-danger/20">
                      <p className="text-sm text-text-primary mb-3">Are you sure? This will withdraw all funds and stop your AI agent.</p>
                      <div className="flex gap-3">
                        <button disabled={isWithdrawing} onClick={() => setShowWithdrawConfirm(false)} className="btn-secondary text-sm px-4 py-2 disabled:opacity-50">
                          Cancel
                        </button>
                        <button
                          disabled={isWithdrawing}
                          onClick={handleWithdrawAll}
                          className="px-4 py-2 rounded-xl bg-danger text-white text-sm font-semibold 
                                       hover:bg-danger/80 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          {isWithdrawing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                          Confirm Withdrawal
                        </button>
                      </div>
                    </div>
                  )}
                </motion.section>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
