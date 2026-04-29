"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Bot } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface SuccessStepProps {
  amount: string;
  asset: string;
  riskProfile: string;
  signature?: string;
}

const riskLabels: Record<string, string> = {
  conservative: "Conservative",
  balanced: "Balanced",
  aggressive: "Aggressive",
};

export function SuccessStep({ amount, asset, riskProfile, signature }: SuccessStepProps) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center">
      {/* Animated checkmark */}
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2, stiffness: 200 }} className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.4, stiffness: 200 }}>
          <CheckCircle2 className="w-10 h-10 text-success" />
        </motion.div>
      </motion.div>

      <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-2xl font-bold text-text-primary mb-2">
        Your AI Agent is now active!
      </motion.h2>

      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-text-muted mb-8">
        Sit back and let AI optimize your returns 24/7.
      </motion.p>

      {/* Summary */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-card p-6 mb-8 text-left">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">AI Agent Activated</p>
            <p className="text-xs text-text-muted">Managing your portfolio</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Deposited</span>
            <span className="font-medium text-text-primary">
              {parseFloat(amount).toLocaleString()} {asset}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Strategy</span>
            <span className="font-medium text-text-primary">{riskLabels[riskProfile] || riskProfile}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Status</span>
            <span className="font-medium text-success flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-success status-pulse" />
              Active
            </span>
          </div>
          {signature && (
            <div className="flex justify-between text-sm mt-3 pt-3 border-t border-white/[0.1]">
              <span className="text-text-muted flex-shrink-0">Tx ID</span>
              <a href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-primary hover:underline self-center ml-2 truncate">
                {signature}
              </a>
            </div>
          )}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2 w-full justify-center">
          Go to Dashboard
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </motion.div>
  );
}
