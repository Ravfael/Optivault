"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { TOOLTIP_DEFINITIONS } from "@/lib/mockData";

interface CryptoTooltipProps {
  term: string;
  children: React.ReactNode;
}

export function CryptoTooltip({ term, children }: CryptoTooltipProps) {
  const definition = TOOLTIP_DEFINITIONS[term];
  if (!definition) return <>{children}</>;

  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          <span className="border-b border-dotted border-text-muted/40 cursor-help">
            {children}
          </span>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            className="z-50 px-3 py-2 text-sm bg-white/10 backdrop-blur-xl border border-white/10 
                       rounded-lg text-text-primary max-w-xs shadow-xl"
            sideOffset={5}
          >
            {definition}
            <TooltipPrimitive.Arrow className="fill-white/10" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

interface SimpleTooltipProps {
  content: string;
  children: React.ReactNode;
}

export function SimpleTooltip({ content, children }: SimpleTooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            className="z-50 px-3 py-2 text-sm bg-white/10 backdrop-blur-xl border border-white/10 
                       rounded-lg text-text-primary max-w-xs shadow-xl"
            sideOffset={5}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-white/10" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
