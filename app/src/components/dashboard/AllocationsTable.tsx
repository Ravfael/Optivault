"use client";

import { motion } from "framer-motion";
import { MOCK_ALLOCATIONS } from "@/lib/mockData";
import { StatusIndicator } from "@/components/shared/StatusIndicator";
import { CryptoTooltip } from "@/components/shared/Tooltip";
import { formatCurrency } from "@/lib/utils";

export function AllocationsTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="glass-card p-6"
    >
      <h3 className="text-base font-semibold text-text-primary mb-1">
        Current Allocations
      </h3>
      <p className="text-xs text-text-muted mb-6">
        Where your funds are currently deployed
      </p>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left text-xs font-medium text-text-muted pb-3 pr-4">
                <CryptoTooltip term="Protocol">Protocol</CryptoTooltip>
              </th>
              <th className="text-left text-xs font-medium text-text-muted pb-3 pr-4">
                Asset
              </th>
              <th className="text-right text-xs font-medium text-text-muted pb-3 pr-4">
                Allocated
              </th>
              <th className="text-right text-xs font-medium text-text-muted pb-3 pr-4">
                <CryptoTooltip term="APY">APY</CryptoTooltip>
              </th>
              <th className="text-right text-xs font-medium text-text-muted pb-3 pr-4">
                Earned
              </th>
              <th className="text-right text-xs font-medium text-text-muted pb-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {MOCK_ALLOCATIONS.map((allocation, index) => (
              <motion.tr
                key={allocation.protocol}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                      style={{ backgroundColor: `${allocation.color}15` }}
                    >
                      {allocation.logo}
                    </div>
                    <span className="text-sm font-medium text-text-primary">
                      {allocation.protocol}
                    </span>
                  </div>
                </td>
                <td className="py-4 pr-4">
                  <span className="text-sm text-text-muted">
                    <CryptoTooltip term={allocation.asset}>
                      {allocation.asset}
                    </CryptoTooltip>
                  </span>
                </td>
                <td className="py-4 pr-4 text-right">
                  <span className="text-sm font-medium text-text-primary">
                    {formatCurrency(allocation.allocated)}
                  </span>
                </td>
                <td className="py-4 pr-4 text-right">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: allocation.color }}
                  >
                    {allocation.apy}%
                  </span>
                </td>
                <td className="py-4 pr-4 text-right">
                  <span className="text-sm font-medium text-success">
                    +{formatCurrency(allocation.earned)}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <StatusIndicator
                      status={allocation.status}
                      size="sm"
                      showLabel
                    />
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {MOCK_ALLOCATIONS.map((allocation, index) => (
          <motion.div
            key={allocation.protocol}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{allocation.logo}</span>
                <span className="text-sm font-medium text-text-primary">
                  {allocation.protocol}
                </span>
                <span className="text-xs text-text-muted px-1.5 py-0.5 rounded bg-white/[0.04]">
                  {allocation.asset}
                </span>
              </div>
              <StatusIndicator status={allocation.status} size="sm" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-[10px] text-text-muted">Allocated</p>
                <p className="text-sm font-medium text-text-primary">
                  {formatCurrency(allocation.allocated)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-text-muted">APY</p>
                <p
                  className="text-sm font-semibold"
                  style={{ color: allocation.color }}
                >
                  {allocation.apy}%
                </p>
              </div>
              <div>
                <p className="text-[10px] text-text-muted">Earned</p>
                <p className="text-sm font-medium text-success">
                  +{formatCurrency(allocation.earned)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
