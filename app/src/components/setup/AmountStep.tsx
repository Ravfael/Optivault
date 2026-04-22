"use client";

import { motion } from "framer-motion";
import { Wallet, Info } from "lucide-react";
import { CryptoTooltip } from "@/components/shared/Tooltip";

interface AmountStepProps {
  amount: string;
  setAmount: (v: string) => void;
  asset: "SOL" | "USDC";
  setAsset: (v: "SOL" | "USDC") => void;
  onNext: () => void;
}

const MOCK_BALANCES = {
  SOL: 42.5,
  USDC: 12500,
};

export function AmountStep({
  amount,
  setAmount,
  asset,
  setAsset,
  onNext,
}: AmountStepProps) {
  const balance = MOCK_BALANCES[asset];
  const minDeposit = asset === "USDC" ? 10 : 0.1;
  const numAmount = parseFloat(amount) || 0;
  const isValid = numAmount >= minDeposit && numAmount <= balance;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-lg mx-auto"
    >
      <h2 className="text-2xl font-bold text-text-primary mb-2">
        How much would you like to deposit?
      </h2>
      <p className="text-text-muted mb-8">
        Choose the amount and asset you want to grow with AI-optimized{" "}
        <CryptoTooltip term="Yield">yield</CryptoTooltip>.
      </p>

      {/* Asset toggle */}
      <div className="flex gap-2 mb-6">
        {(["SOL", "USDC"] as const).map((a) => (
          <button
            key={a}
            onClick={() => setAsset(a)}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              asset === a
                ? "bg-primary/15 text-primary border border-primary/30"
                : "bg-white/[0.04] text-text-muted border border-white/[0.06] hover:bg-white/[0.08]"
            }`}
          >
            <CryptoTooltip term={a}>{a}</CryptoTooltip>
          </button>
        ))}
      </div>

      {/* Amount input */}
      <div className="relative mb-3">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={`Enter amount in ${asset}`}
          className="input-field text-2xl font-bold h-16 pr-20"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted font-medium">
          {asset}
        </span>
      </div>

      {/* Balance display */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Wallet className="w-4 h-4" />
          <span>
            <CryptoTooltip term="Wallet">Wallet</CryptoTooltip> balance:{" "}
            <span className="text-text-primary font-medium">
              {balance.toLocaleString()} {asset}
            </span>
          </span>
        </div>
        <button
          onClick={() => setAmount(balance.toString())}
          className="text-xs text-primary hover:text-primary-light transition-colors font-medium"
        >
          MAX
        </button>
      </div>

      {/* Helper text */}
      <div className="flex items-start gap-2 mb-8 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
        <Info className="w-4 h-4 text-text-muted mt-0.5 shrink-0" />
        <p className="text-xs text-text-muted">
          Minimum deposit: {minDeposit} {asset}. You can withdraw your funds at
          any time.
        </p>
      </div>

      {/* Next button */}
      <button
        onClick={onNext}
        disabled={!isValid}
        className="btn-primary w-full text-center"
      >
        Continue
      </button>
    </motion.div>
  );
}
