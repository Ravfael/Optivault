"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Pause, Play, Clock, ArrowRightLeft } from "lucide-react";
import { StatusIndicator } from "@/components/shared/StatusIndicator";
import { CryptoTooltip } from "@/components/shared/Tooltip";

interface AIStatusCardProps {
  isActiveInitial?: boolean;
  lastRebalanceTime?: Date | null;
}

export function AIStatusCard({ isActiveInitial = true, lastRebalanceTime }: AIStatusCardProps) {
  const [isActive, setIsActive] = useState(isActiveInitial);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsActive(isActiveInitial), 0);
  }, [isActiveInitial]);

  const handleToggle = () => {
    if (showConfirm) {
      setIsActive(!isActive);
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="glass-card p-6 relative overflow-hidden">
      {/* Animated gradient border top */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-primary 
                      bg-[length:200%_100%] animate-[gradient_3s_ease_infinite]"
        style={{ backgroundSize: "200% 100%", animation: "gradient 3s ease infinite" }}
      />

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 
                          flex items-center justify-center border border-primary/10"
          >
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">AI Agent</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <StatusIndicator status={isActive ? "active" : "paused"} size="sm" />
              <span className={`text-sm font-medium ${isActive ? "text-success" : "text-warning"}`}>{isActive ? "Active" : "Paused"}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showConfirm && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setShowConfirm(false)}
              className="px-3 py-1.5 text-xs text-text-muted hover:text-text-primary 
                         bg-white/[0.04] rounded-lg transition-colors"
            >
              Cancel
            </motion.button>
          )}
          <button
            onClick={handleToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                       ${showConfirm ? "bg-warning/20 text-warning border border-warning/30 hover:bg-warning/30" : isActive ? "bg-white/[0.06] text-text-muted hover:text-text-primary hover:bg-white/[0.1]" : "btn-primary"}`}
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4" />
                {showConfirm ? "Confirm Pause" : "Pause AI"}
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                {showConfirm ? "Confirm Resume" : "Resume AI"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Current strategy */}
      <div className="space-y-3">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <ArrowRightLeft className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-text-muted mb-1">Current Strategy</p>
            <p className="text-sm text-text-primary">
              Allocated 60% to Kamino (
              <CryptoTooltip term="APY">
                <span className="text-success">8.2% APY</span>
              </CryptoTooltip>
              ), 40% to MarginFi (
              <CryptoTooltip term="APY">
                <span className="text-secondary">6.1% APY</span>
              </CryptoTooltip>
              )
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <Clock className="w-4 h-4 text-text-muted shrink-0" />
          <div>
            <p className="text-sm text-text-muted">
              Last action:{" "}
              <span className="text-text-primary">
                {lastRebalanceTime && lastRebalanceTime.getTime() > 0 ? (
                  <>
                    <CryptoTooltip term="Rebalance">Rebalanced </CryptoTooltip>
                    {lastRebalanceTime.toLocaleString()}
                  </>
                ) : (
                  "Pending initial AI execution..."
                )}
              </span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
