"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PieChart, Activity, Settings, Zap, Menu, X, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import { WalletButton } from "@/components/shared/WalletButton";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAgentStream } from "@/hooks/useAgentStream";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/setup", label: "Portfolio", icon: PieChart },
  { href: "/activity", label: "AI Activity", icon: Activity },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isConnected } = useAgentStream();

  const sidebarContent = (
    <>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 px-3 mb-8 group">
        <Image src="/logo_main.png" alt="Optivault" width={140} height={40} className="h-8 w-auto" priority />
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive ? "bg-primary/15 text-primary-light border border-primary/20" : "text-text-muted hover:text-text-primary hover:bg-white/[0.04]",
              )}
            >
              <item.icon className="w-[18px] h-[18px]" />
              {item.label}
              {isActive && <motion.div layoutId="sidebar-indicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </nav>

      {/* AI Agent Status */}
      <div className="mb-4 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CircleDot className={cn("w-4 h-4", isConnected ? "text-green-500" : "text-red-500")} />
          <span className="text-xs font-medium text-text-primary">AI Agent</span>
        </div>
        <span className={cn("text-[10px] font-semibold uppercase tracking-wider", isConnected ? "text-green-500" : "text-red-500")}>{isConnected ? "Live" : "Offline"}</span>
      </div>

      {/* Wallet */}
      <WalletButton variant="sidebar" />
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-64 h-screen sticky top-0 p-4 border-r border-white/[0.06]
                         bg-white/[0.02] backdrop-blur-2xl"
      >
        {sidebarContent}
      </aside>

      {/* Mobile hamburger */}
      <button onClick={() => setMobileOpen(true)} className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl glass-card">
        <Menu className="w-5 h-5 text-text-primary" />
      </button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setMobileOpen(false)} />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 p-4 z-50 
                         bg-black/40 backdrop-blur-2xl border-r border-white/[0.06] flex flex-col"
            >
              <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-1 text-text-muted hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
