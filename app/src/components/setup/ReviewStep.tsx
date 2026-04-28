"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Clock, TrendingUp, AlertTriangle } from "lucide-react";
import { CryptoTooltip } from "@/components/shared/Tooltip";
import { useOptivault } from "@/hooks/useOptivault";

interface ReviewStepProps {
  amount: string;
  asset: "SOL" | "USDC";
  riskProfile: string;
  timeHorizon: string;
  customDate: string;
  onConfirm: (signature: string) => void;
  onBack: () => void;
}

const riskConfig: Record<string, { label: string; emoji: string; color: string; apyMin: number; apyMax: number }> = {
  conservative: { label: "Conservative", emoji: "🛡️", color: "#22C55E", apyMin: 4, apyMax: 7 },
  balanced: { label: "Balanced", emoji: "⚖️", color: "#7C3AED", apyMin: 6, apyMax: 10 },
  aggressive: { label: "Aggressive", emoji: "🚀", color: "#F59E0B", apyMin: 9, apyMax: 15 },
};

const timeLabels: Record<string, string> = { "1w": "1 Week", "1m": "1 Month", "3m": "3 Months" };

function getDays(th: string, cd: string): number {
  if (th === "1w") return 7;
  if (th === "1m") return 30;
  if (th === "3m") return 90;
  if (th === "custom" && cd) return Math.max(1, Math.ceil((new Date(cd).getTime() - Date.now()) / 86400000));
  return 30;
}

export function ReviewStep({ amount, asset, riskProfile, timeHorizon, customDate, onConfirm, onBack }: ReviewStepProps) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { initializeVault, deposit } = useOptivault();

  const risk = riskConfig[riskProfile] || riskConfig.balanced;
  const numAmount = parseFloat(amount) || 0;
  const days = getDays(timeHorizon, customDate);
  const avgApy = (risk.apyMin + risk.apyMax) / 2;
  const estimatedEarnings = (numAmount * avgApy * days) / (365 * 100);
  const timeLabel = timeHorizon === "custom" && customDate ? `${days} days (until ${new Date(customDate).toLocaleDateString()})` : timeLabels[timeHorizon] || timeHorizon;

  const handleConfirm = async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      let rLevel = 2; // balanced
      if (riskProfile === "conservative") rLevel = 1;
      else if (riskProfile === "aggressive") rLevel = 3;

      const initRes = await initializeVault(rLevel, days);
      if (initRes && !initRes.success) {
        throw new Error(initRes.error || "Failed to initialize vault.");
      }

      const res = await deposit(numAmount);
      if (res && res.success && res.signature) {
        onConfirm(res.signature);
      } else {
        throw new Error(res?.error || "Failed to deposit funds.");
      }
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.message || "Transaction block failed");
      setConfirming(false);
    } finally {
      setLoading(false);
    }
  };

  const rows = [
    {
      icon: <DollarSign className="w-5 h-5 text-text-muted" />,
      label: "Deposit Amount",
      value: (
        <span className="text-base font-bold text-text-primary">
          {numAmount.toLocaleString()} <CryptoTooltip term={asset}>{asset}</CryptoTooltip>
        </span>
      ),
      border: true,
    },
    {
      icon: <span className="text-lg">{risk.emoji}</span>,
      label: <CryptoTooltip term="Risk Profile">Risk Profile</CryptoTooltip>,
      value: (
        <span className="text-base font-semibold" style={{ color: risk.color }}>
          {risk.label}
        </span>
      ),
      border: true,
    },
    { icon: <Clock className="w-5 h-5 text-text-muted" />, label: "Duration", value: <span className="text-base font-medium text-text-primary">{timeLabel}</span>, border: true },
    {
      icon: <TrendingUp className="w-5 h-5 text-text-muted" />,
      label: (
        <span>
          Estimated <CryptoTooltip term="APY">APY</CryptoTooltip>
        </span>
      ),
      value: (
        <span className="text-base font-semibold text-secondary">
          {risk.apyMin}–{risk.apyMax}%
        </span>
      ),
      border: true,
    },
    { icon: <DollarSign className="w-5 h-5 text-success" />, label: "Estimated Earnings", value: <span className="text-lg font-bold text-success">~${estimatedEarnings.toFixed(2)}</span>, border: false },
  ];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-text-primary mb-2">Review &amp; Confirm</h2>
      <p className="text-text-muted mb-8">Double-check everything before activating your AI agent.</p>

      <div className="glass-card p-6 space-y-4 mb-6">
        {rows.map((r, i) => (
          <div key={i} className={`flex items-center justify-between py-3 ${r.border ? "border-b border-white/[0.06]" : ""}`}>
            <div className="flex items-center gap-3">
              {r.icon}
              <span className="text-sm text-text-muted">{r.label}</span>
            </div>
            {r.value}
          </div>
        ))}
      </div>

      {errorMsg && <div className="mb-4 p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm text-center">{errorMsg}</div>}

      <button
        onClick={handleConfirm}
        disabled={loading}
        className={`w-full py-4 rounded-xl text-base font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${confirming ? "bg-gradient-to-r from-success to-emerald-600 text-white shadow-lg shadow-success/30" : "btn-primary"}`}
      >
        {loading ? "Processing..." : confirming ? "Confirm Deposit — Click Again" : "Deposit & Activate AI"}
      </button>

      <div className="flex items-start gap-2 mt-4 p-3 rounded-xl bg-warning/5 border border-warning/10">
        <AlertTriangle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
        <p className="text-[11px] text-text-muted leading-relaxed">
          By depositing, you authorize Optivault&apos;s AI agent to manage your funds across supported <CryptoTooltip term="Protocol">protocols</CryptoTooltip>. Crypto investments carry risk. You can withdraw at any time.
        </p>
      </div>

      <button onClick={onBack} disabled={loading} className="w-full mt-3 text-center text-sm text-text-muted hover:text-text-primary transition-colors disabled:opacity-50">
        ← Go Back
      </button>
    </motion.div>
  );
}
