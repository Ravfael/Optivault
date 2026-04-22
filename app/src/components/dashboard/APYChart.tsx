"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { MOCK_APY_DATA } from "@/lib/mockData";
import { CryptoTooltip } from "@/components/shared/Tooltip";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: { date: string; apy: number; baseline: number };
  }>;
  label?: string;
}

function CustomChartTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-4 py-3 text-xs space-y-1">
      <p className="font-medium text-text-muted">{label}</p>
      <p className="text-primary font-semibold">
        Optivault: {payload[0].payload.apy.toFixed(2)}%
      </p>
      <p className="text-text-muted">
        Holding: {payload[0].payload.baseline.toFixed(2)}%
      </p>
    </div>
  );
}

export function APYChart() {
  const [period, setPeriod] = useState<"7d" | "30d">("30d");

  const filteredData =
    period === "7d" ? MOCK_APY_DATA.slice(-7) : MOCK_APY_DATA;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-text-primary">
            <CryptoTooltip term="APY">APY</CryptoTooltip> Performance
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Your returns vs. holding in wallet
          </p>
        </div>
        <div className="flex gap-1 p-1 rounded-lg bg-white/[0.04]">
          {(["7d", "30d"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                period === p
                  ? "bg-primary/20 text-primary"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="apyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="baselineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#64748B" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#64748B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v.toFixed(1)}%`}
              domain={["dataMin - 1", "dataMax + 1"]}
            />
            <Tooltip content={<CustomChartTooltip />} />
            <Area
              type="monotone"
              dataKey="baseline"
              stroke="#64748B"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fill="url(#baselineGradient)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="apy"
              stroke="#7C3AED"
              strokeWidth={2}
              fill="url(#apyGradient)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#7C3AED",
                stroke: "#0A0A0F",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-[2px] bg-primary rounded" />
          <span className="text-xs text-text-muted">Optivault APY</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-[2px] bg-text-muted rounded border-dashed" style={{ borderTop: "2px dashed #64748B", height: 0, width: 12 }} />
          <span className="text-xs text-text-muted">If held in wallet</span>
        </div>
      </div>
    </motion.div>
  );
}
