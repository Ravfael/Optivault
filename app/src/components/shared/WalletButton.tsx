"use client";

import { WalletMultiButton, useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";
import { Wallet } from "lucide-react";

interface WalletButtonProps {
  variant?: "default" | "sidebar";
}

export function WalletButton({ variant = "default" }: WalletButtonProps) {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  if (!mounted) {
    return <div className={`wallet-button-container ${variant === "sidebar" ? "w-full" : ""}`} style={{ minHeight: "44px" }}></div>;
  }

  if (variant === "sidebar" && !connected) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-full bg-[#8b5cf6] text-white font-bold text-lg hover:bg-[#9333ea] transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] active:scale-[0.98]"
      >
        <Wallet className="w-6 h-6" />
        Connect Wallet
      </button>
    );
  }

  return (
    <div className={`wallet-button-container ${variant === "sidebar" ? "w-full sidebar-wallet" : ""}`}>
      <WalletMultiButton
        style={{
          width: variant === "sidebar" ? "100%" : "auto",
          background: connected ? "rgba(255,255,255,0.06)" : undefined,
          border: connected ? "1px solid rgba(255,255,255,0.08)" : undefined,
          borderRadius: variant === "sidebar" ? "9999px" : "0.75rem",
          display: "flex",
          justifyContent: connected && variant === "sidebar" ? "flex-start" : "center",
          height: "auto",
          padding: variant === "sidebar" ? "12px 24px" : "10px 16px",
          fontFamily: "inherit",
          fontSize: variant === "sidebar" ? "16px" : "14px",
          fontWeight: variant === "sidebar" ? 700 : 500,
          color: "#fff",
        }}
        className={!connected ? "!bg-primary !text-primary-foreground hover:!opacity-90 transition-all rounded-xl" : "hover:bg-white/[0.1] transition-all duration-200"}
      />
    </div>
  );
}
