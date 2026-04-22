"use client";

import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "active" | "paused" | "pending";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const statusConfig = {
  active: {
    color: "bg-success",
    label: "Active",
    pulse: true,
  },
  paused: {
    color: "bg-warning",
    label: "Paused",
    pulse: false,
  },
  pending: {
    color: "bg-text-muted",
    label: "Pending",
    pulse: true,
  },
};

const sizeConfig = {
  sm: "w-2 h-2",
  md: "w-3 h-3",
  lg: "w-4 h-4",
};

export function StatusIndicator({
  status,
  size = "md",
  showLabel = false,
}: StatusIndicatorProps) {
  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div
          className={cn(
            "rounded-full",
            config.color,
            sizeConfig[size],
            config.pulse && "status-pulse"
          )}
        />
      </div>
      {showLabel && (
        <span className="text-sm text-text-muted font-medium">
          {config.label}
        </span>
      )}
    </div>
  );
}
