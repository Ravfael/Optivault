"use client";

import { motion } from "framer-motion";
import { Calendar, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeHorizonStepProps {
  timeHorizon: string;
  setTimeHorizon: (v: string) => void;
  customDate: string;
  setCustomDate: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const options = [
  { id: "1w", label: "1 Week", days: 7 },
  { id: "1m", label: "1 Month", days: 30 },
  { id: "3m", label: "3 Months", days: 90 },
  { id: "custom", label: "Custom", days: 0 },
];

export function TimeHorizonStep({
  timeHorizon,
  setTimeHorizon,
  customDate,
  setCustomDate,
  onNext,
  onBack,
}: TimeHorizonStepProps) {
  const isValid =
    timeHorizon && (timeHorizon !== "custom" || customDate !== "");

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-lg mx-auto"
    >
      <h2 className="text-2xl font-bold text-text-primary mb-2">
        How long do you want to keep your funds deposited?
      </h2>
      <p className="text-text-muted mb-8">
        Longer time horizons help AI optimize your returns better.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {options.map((option) => {
          const isSelected = timeHorizon === option.id;
          return (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setTimeHorizon(option.id)}
              className={cn(
                "py-4 px-4 rounded-xl border-2 text-center transition-all duration-200",
                isSelected
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-white/[0.02] border-white/[0.06] text-text-muted hover:bg-white/[0.04] hover:border-white/[0.1]"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                {option.id === "custom" && (
                  <Calendar className="w-4 h-4" />
                )}
                <span className="text-sm font-semibold">{option.label}</span>
              </div>
              {option.days > 0 && (
                <p className="text-xs mt-1 opacity-60">{option.days} days</p>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Custom date picker */}
      {timeHorizon === "custom" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-6"
        >
          <label className="block text-sm text-text-muted mb-2">
            Select end date
          </label>
          <input
            type="date"
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="input-field [color-scheme:dark]"
          />
        </motion.div>
      )}

      {/* Helper text */}
      <div className="flex items-start gap-2 mb-8 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
        <Info className="w-4 h-4 text-text-muted mt-0.5 shrink-0" />
        <p className="text-xs text-text-muted">
          You can withdraw anytime, but longer horizons help AI optimize better.
          No lock-up period — your funds stay flexible.
        </p>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-secondary flex-1 text-center">
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="btn-primary flex-1 text-center"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}
