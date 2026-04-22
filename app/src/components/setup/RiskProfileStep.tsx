"use client";

import { motion } from "framer-motion";
import { Shield, Scale, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { CryptoTooltip } from "@/components/shared/Tooltip";

interface RiskProfileStepProps {
  riskProfile: string;
  setRiskProfile: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const profiles = [
  {
    id: "conservative",
    icon: Shield,
    emoji: "🛡️",
    label: "Conservative",
    description:
      "Safety first. Stablecoins only, lower but steady returns. Best for beginners.",
    apyRange: "4–7%",
    color: "#22C55E",
    bgColor: "rgba(34, 197, 94, 0.08)",
    borderColor: "rgba(34, 197, 94, 0.2)",
  },
  {
    id: "balanced",
    icon: Scale,
    emoji: "⚖️",
    label: "Balanced",
    description:
      "A mix of stable and higher-yield opportunities. Great for most users.",
    apyRange: "6–10%",
    color: "#7C3AED",
    bgColor: "rgba(124, 58, 237, 0.08)",
    borderColor: "rgba(124, 58, 237, 0.2)",
  },
  {
    id: "aggressive",
    icon: Rocket,
    emoji: "🚀",
    label: "Aggressive",
    description:
      "Higher potential returns, with higher risk. For experienced users.",
    apyRange: "9–15%",
    color: "#F59E0B",
    bgColor: "rgba(245, 158, 11, 0.08)",
    borderColor: "rgba(245, 158, 11, 0.2)",
  },
];

export function RiskProfileStep({
  riskProfile,
  setRiskProfile,
  onNext,
  onBack,
}: RiskProfileStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-lg mx-auto"
    >
      <h2 className="text-2xl font-bold text-text-primary mb-2">
        How do you want AI to manage your funds?
      </h2>
      <p className="text-text-muted mb-8">
        Choose a{" "}
        <CryptoTooltip term="Risk Profile">risk profile</CryptoTooltip> that
        matches your comfort level.
      </p>

      <div className="space-y-3 mb-8">
        {profiles.map((profile) => {
          const isSelected = riskProfile === profile.id;
          return (
            <motion.button
              key={profile.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setRiskProfile(profile.id)}
              className={cn(
                "w-full text-left p-5 rounded-2xl border-2 transition-all duration-300",
                isSelected
                  ? "shadow-lg"
                  : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1]"
              )}
              style={
                isSelected
                  ? {
                      backgroundColor: profile.bgColor,
                      borderColor: profile.borderColor,
                    }
                  : undefined
              }
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl">{profile.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3
                      className="text-base font-semibold"
                      style={{ color: isSelected ? profile.color : "#F1F5F9" }}
                    >
                      {profile.label}
                    </h3>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: `${profile.color}15`,
                        color: profile.color,
                      }}
                    >
                      <CryptoTooltip term="APY">
                        {profile.apyRange} APY
                      </CryptoTooltip>
                    </span>
                  </div>
                  <p className="text-sm text-text-muted">{profile.description}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-secondary flex-1 text-center">
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!riskProfile}
          className="btn-primary flex-1 text-center"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}
