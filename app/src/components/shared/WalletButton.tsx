"use client";

import { useState } from "react";
import { Wallet, LogOut, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WalletButtonProps {
  variant?: "default" | "sidebar";
}

const MOCK_ADDRESS = "7xKX...m3Fp";

export function WalletButton({ variant = "default" }: WalletButtonProps) {
  const [connected, setConnected] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  if (!connected) {
    return (
      <button
        onClick={() => setConnected(true)}
        className="btn-primary flex items-center gap-2"
      >
        <Wallet className="w-4 h-4" />
        <span>Connect Wallet</span>
      </button>
    );
  }

  if (variant === "sidebar") {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.04] 
                     border border-white/[0.06] hover:bg-white/[0.08] transition-all duration-200"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary 
                          flex items-center justify-center text-xs font-bold">
            7x
          </div>
          <div className="flex-1 text-left">
            <p className="text-xs text-text-muted">Connected</p>
            <p className="text-sm font-medium text-text-primary">{MOCK_ADDRESS}</p>
          </div>
          <ChevronDown className="w-4 h-4 text-text-muted" />
        </button>
        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute bottom-full left-0 right-0 mb-2 glass-card p-2"
            >
              <button
                onClick={() => {
                  setConnected(false);
                  setShowDropdown(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-danger 
                           hover:bg-white/[0.06] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Disconnect
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] 
                   border border-white/[0.08] hover:bg-white/[0.1] transition-all duration-200"
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary" />
        <span className="text-sm font-medium">{MOCK_ADDRESS}</span>
        <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
      </button>
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full right-0 mt-2 w-48 glass-card p-2 z-50"
          >
            <button
              onClick={() => {
                setConnected(false);
                setShowDropdown(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-danger 
                         hover:bg-white/[0.06] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Disconnect Wallet
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
