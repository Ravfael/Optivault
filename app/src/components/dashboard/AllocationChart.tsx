"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { MOCK_ALLOCATIONS } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";
import { CryptoTooltip } from "@/components/shared/Tooltip";

const data = MOCK_ALLOCATIONS.map((a) => ({
  name: a.protocol,
  value: a.allocated,
  color: a.color,
  apy: a.apy,
  logo: a.logo,
}));

const total = data.reduce((s, d) => s + d.value, 0);

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: { name: string; value: number; apy: number } }>;
}

function CustomChartTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="glass-card px-3 py-2 text-xs">
      <p className="font-semibold text-text-primary">{d.name}</p>
      <p className="text-text-muted">
        {formatCurrency(d.value)} · {d.apy}% APY
      </p>
    </div>
  );
}

export function AllocationChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="glass-card p-6"
    >
      <h3 className="text-base font-semibold text-text-primary mb-1">
        <CryptoTooltip term="Protocol">Portfolio Allocation</CryptoTooltip>
      </h3>
      <p className="text-xs text-text-muted mb-6">
        How your funds are distributed across protocols
      </p>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Donut chart */}
        <div className="w-48 h-48 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-bold text-text-primary">
                {formatCurrency(total)}
              </p>
              <p className="text-[10px] text-text-muted">Total</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3 w-full">
          {data.map((d) => (
            <div
              key={d.name}
              className="flex items-center justify-between py-2 px-3 rounded-lg 
                         hover:bg-white/[0.03] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-sm text-text-primary flex items-center gap-2">
                  <img /* eslint-disable-next-line @next/next/no-img-element */  /* eslint-disable-next-line @next/next/no-img-element */  src={d.logo} alt={d.name} className="w-5 h-5 rounded-full object-cover border border-white/10" />
                  {d.name}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-text-primary">
                  {formatCurrency(d.value)}
                </p>
                <p className="text-xs text-text-muted">{d.apy}% APY</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
