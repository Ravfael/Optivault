"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { PortfolioCard } from "@/components/dashboard/PortfolioCard";
import { AIStatusCard } from "@/components/dashboard/AIStatusCard";
import { AllocationChart } from "@/components/dashboard/AllocationChart";
import { APYChart } from "@/components/dashboard/APYChart";
import { AllocationsTable } from "@/components/dashboard/AllocationsTable";
import { motion } from "framer-motion";

const sparklineData = [4, 6, 5, 8, 7, 9, 8, 10, 9, 11, 10, 12, 11, 13, 14];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 pt-12 lg:pt-0"
          >
            <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
            <p className="text-sm text-text-muted mt-1">
              Overview of your AI-managed portfolio
            </p>
          </motion.div>

          {/* Portfolio Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <PortfolioCard
              title="Total Balance"
              value="$14,000.00"
              change={3.24}
              icon="balance"
              delay={0}
            />
            <PortfolioCard
              title="Current APY"
              value="7.82%"
              change={1.12}
              icon="apy"
              delay={0.1}
              sparklineData={sparklineData}
            />
            <PortfolioCard
              title="Total Earned"
              value="$93.10"
              change={12.5}
              icon="earned"
              delay={0.2}
            />
          </div>

          {/* AI Status */}
          <div className="mb-6">
            <AIStatusCard />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <AllocationChart />
            <APYChart />
          </div>

          {/* Allocations Table */}
          <AllocationsTable />
        </div>
      </main>
    </div>
  );
}
