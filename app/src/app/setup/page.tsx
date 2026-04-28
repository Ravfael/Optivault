"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { AmountStep } from "@/components/setup/AmountStep";
import { RiskProfileStep } from "@/components/setup/RiskProfileStep";
import { TimeHorizonStep } from "@/components/setup/TimeHorizonStep";
import { ReviewStep } from "@/components/setup/ReviewStep";
import { SuccessStep } from "@/components/setup/SuccessStep";

const stepNames = ["Amount", "Risk", "Duration", "Review", "Done"];

export default function SetupPage() {
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState("");
  const [asset, setAsset] = useState<"SOL" | "USDC">("USDC");
  const [riskProfile, setRiskProfile] = useState("");
  const [timeHorizon, setTimeHorizon] = useState("");
  const [customDate, setCustomDate] = useState("");
  const [signature, setSignature] = useState("");
  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans selection:bg-[#8b5cf6]/30 relative overflow-hidden">
      <div
        className="fixed inset-0 z-0 opacity-100 bg-[#050505]"
        style={{
          backgroundImage: "url('/background1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative z-10 flex w-full h-screen">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="max-w-2xl mx-auto pt-12 lg:pt-0">
          {/* Progress */}
          {step < 4 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                {stepNames.slice(0, 4).map((name, i) => (
                  <div key={name} className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                          i < step ? "bg-success text-white" : i === step ? "bg-primary text-white" : "bg-white/[0.06] text-text-muted"
                        }`}
                      >
                        {i < step ? "✓" : i + 1}
                      </div>
                      <span className={`hidden sm:block text-xs font-medium ${i <= step ? "text-text-primary" : "text-text-muted"}`}>{name}</span>
                    </div>
                    {i < 3 && <div className={`w-8 sm:w-16 h-[2px] mx-2 rounded transition-colors ${i < step ? "bg-success" : "bg-white/[0.06]"}`} />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Steps */}
          <AnimatePresence mode="wait">
            {step === 0 && <AmountStep key="amount" amount={amount} setAmount={setAmount} asset={asset} setAsset={setAsset} onNext={() => setStep(1)} />}
            {step === 1 && <RiskProfileStep key="risk" riskProfile={riskProfile} setRiskProfile={setRiskProfile} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
            {step === 2 && <TimeHorizonStep key="time" timeHorizon={timeHorizon} setTimeHorizon={setTimeHorizon} customDate={customDate} setCustomDate={setCustomDate} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
            {step === 3 && (
              <ReviewStep
                key="review"
                amount={amount}
                asset={asset}
                riskProfile={riskProfile}
                timeHorizon={timeHorizon}
                customDate={customDate}
                onConfirm={(sig) => {
                  if (sig) setSignature(sig);
                  setStep(4);
                }}
                onBack={() => setStep(2)}
              />
            )}
            {step === 4 && <SuccessStep key="success" amount={amount} asset={asset} riskProfile={riskProfile} signature={signature} />}
          </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
