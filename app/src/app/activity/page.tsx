"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { MOCK_ACTIVITIES } from "@/lib/mockData";
import { CryptoTooltip } from "@/components/shared/Tooltip";
import {
  ArrowRightLeft,
  ArrowDownToLine,
  ArrowUpFromLine,
  Filter,
  TrendingUp,
  Clock,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const filterOptions = [
  { id: "all", label: "All" },
  { id: "rebalance", label: "Rebalance" },
  { id: "deposit", label: "Deposit" },
  { id: "withdrawal", label: "Withdrawal" },
];

const actionIcons = {
  rebalance: ArrowRightLeft,
  deposit: ArrowDownToLine,
  withdrawal: ArrowUpFromLine,
};

const actionColors = {
  rebalance: "#7C3AED",
  deposit: "#22C55E",
  withdrawal: "#F59E0B",
};

function formatTime(ts: string) {
  const date = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return "Just now";
}

export default function ActivityPage() {
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all"
      ? MOCK_ACTIVITIES
      : MOCK_ACTIVITIES.filter((a) => a.action === filter);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        <div className="max-w-4xl mx-auto pt-12 lg:pt-0">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-bold text-text-primary">
              AI Activity Log
            </h1>
            <p className="text-sm text-text-muted mt-1">
              Every decision your AI agent has made — explained in plain language
            </p>
          </motion.div>

          {/* Filter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 mb-8 flex-wrap"
          >
            <Filter className="w-4 h-4 text-text-muted" />
            {filterOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setFilter(opt.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  filter === opt.id
                    ? "bg-primary/15 text-primary border border-primary/20"
                    : "bg-white/[0.04] text-text-muted border border-white/[0.06] hover:bg-white/[0.08]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-white/[0.04]" />

            <div className="space-y-4">
              {filtered.map((activity, i) => {
                const Icon = actionIcons[activity.action];
                const color = actionColors[activity.action];

                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="relative pl-12"
                  >
                    {/* Timeline dot */}
                    <div
                      className="absolute left-[10px] top-5 w-5 h-5 rounded-full flex items-center justify-center z-10"
                      style={{ backgroundColor: `${color}20` }}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    </div>

                    <div className="glass-card-hover p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${color}15` }}
                          >
                            <Icon className="w-4 h-4" style={{ color }} />
                          </div>
                          <div>
                            <span
                              className="text-xs font-semibold uppercase tracking-wider"
                              style={{ color }}
                            >
                              <CryptoTooltip term={activity.action === "rebalance" ? "Rebalance" : ""}>
                                {activity.action}
                              </CryptoTooltip>
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Clock className="w-3 h-3 text-text-muted" />
                              <span className="text-xs text-text-muted">
                                {formatTime(activity.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <span className="text-sm font-semibold text-text-primary">
                          {formatCurrency(activity.amount)}
                        </span>
                      </div>

                      <p className="text-sm text-text-muted leading-relaxed mb-3">
                        {activity.description}
                      </p>

                      {/* APY comparison */}
                      {activity.apyBefore !== undefined &&
                        activity.apyAfter !== undefined && (
                          <div className="flex items-center gap-3 pt-3 border-t border-white/[0.04]">
                            <div className="flex items-center gap-1.5 text-xs">
                              <span className="text-text-muted">
                                <CryptoTooltip term="APY">APY</CryptoTooltip>:
                              </span>
                              <span className="text-text-muted/80 line-through">
                                {activity.apyBefore}%
                              </span>
                              <span className="text-text-muted">→</span>
                              <span className="text-success font-semibold">
                                {activity.apyAfter}%
                              </span>
                              {activity.apyAfter > activity.apyBefore && (
                                <TrendingUp className="w-3 h-3 text-success" />
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-text-muted">No activities found for this filter.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
