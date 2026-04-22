"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Percent, Coins } from "lucide-react";
import { CryptoTooltip } from "@/components/shared/Tooltip";
import { formatPercent } from "@/lib/utils";

interface PortfolioCardProps {
  title: string;
  value: string;
  change?: number;
  icon: "balance" | "apy" | "earned";
  delay?: number;
  sparklineData?: number[];
}

const icons = {
  balance: DollarSign,
  apy: Percent,
  earned: Coins,
};

export function PortfolioCard({
  title,
  value,
  change,
  icon,
  delay = 0,
  sparklineData,
}: PortfolioCardProps) {
  const Icon = icons[icon];
  const isPositive = change !== undefined && change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="glass-card p-6 relative overflow-hidden group"
    >
      {/* Background glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-primary/5 blur-2xl 
                      group-hover:bg-primary/10 transition-all duration-500" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-sm text-text-muted font-medium">
              {icon === "apy" ? (
                <CryptoTooltip term="APY">{title}</CryptoTooltip>
              ) : (
                title
              )}
            </h3>
          </div>
          {change !== undefined && (
            <div
              className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                isPositive
                  ? "bg-success/10 text-success"
                  : "bg-danger/10 text-danger"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {formatPercent(change)}
            </div>
          )}
        </div>

        <p className="text-3xl font-bold text-text-primary">{value}</p>

        {/* Mini sparkline */}
        {sparklineData && (
          <div className="mt-3 flex items-end gap-[2px] h-8">
            {sparklineData.map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-primary/30 hover:bg-primary/50 transition-colors"
                style={{ height: `${(v / Math.max(...sparklineData)) * 100}%` }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
