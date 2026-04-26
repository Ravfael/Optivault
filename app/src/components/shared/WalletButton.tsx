"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";

interface WalletButtonProps {
  variant?: "default" | "sidebar";
}

export function WalletButton({ variant = "default" }: WalletButtonProps) {
  const { connected } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={`wallet-button-container ${variant === "sidebar" ? "w-full" : ""}`} style={{ minHeight: "44px" }}></div>;
  }

  return (
    <div className={`wallet-button-container ${variant === "sidebar" ? "w-full" : ""}`}>
      <WalletMultiButton
        style={{
          width: variant === "sidebar" ? "100%" : "auto",
          background: connected ? "rgba(255,255,255,0.06)" : undefined,
          border: connected ? "1px solid rgba(255,255,255,0.08)" : undefined,
          borderRadius: "0.75rem",
          display: "flex",
          justifyContent: connected && variant === "sidebar" ? "flex-start" : "center",
          height: "auto",
          padding: "10px 16px",
          fontFamily: "inherit",
          fontSize: "14px",
          fontWeight: 500,
          color: "#fff",
        }}
        className={!connected ? "!bg-primary !text-primary-foreground hover:!opacity-90 transition-all rounded-xl" : "hover:bg-white/[0.1] transition-all duration-200"}
      />
    </div>
  );
}
