"use client";

import { CryptoTooltip } from "./Tooltip";

interface ProtocolBadgeProps {
  name: string;
  logo: string;
  apy?: number;
  color: string;
  size?: "sm" | "md" | "lg";
}

const sizeConfig = {
  sm: {
    container: "px-3 py-1.5",
    logo: "text-base",
    name: "text-xs",
    apy: "text-[10px]",
  },
  md: {
    container: "px-4 py-3",
    logo: "text-2xl",
    name: "text-sm",
    apy: "text-xs",
  },
  lg: {
    container: "px-6 py-4",
    logo: "text-3xl",
    name: "text-base",
    apy: "text-sm",
  },
};

export function ProtocolBadge({
  name,
  logo,
  apy,
  color,
  size = "md",
}: ProtocolBadgeProps) {
  const sizes = sizeConfig[size];

  return (
    <div className="glass-card-hover p-[1px] group">
      <div className={`flex items-center gap-3 ${sizes.container}`}>
        <span className={sizes.logo}>{logo}</span>
        <div className="flex flex-col">
          <span className={`font-medium text-text-primary ${sizes.name}`}>
            {name}
          </span>
          {apy !== undefined && (
            <span
              className={`font-semibold ${sizes.apy}`}
              style={{ color }}
            >
              <CryptoTooltip term="APY">{apy}% APY</CryptoTooltip>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
