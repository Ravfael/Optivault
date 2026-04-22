"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { WalletButton } from "@/components/shared/WalletButton";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/[0.06]
                        bg-background/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center
                            shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-text-primary tracking-tight">
              Optivault
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#how-it-works"
              className="text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              How It Works
            </a>
            <a
              href="#protocols"
              className="text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              Protocols
            </a>
            <a
              href="#stats"
              className="text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              Stats
            </a>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden sm:block text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              Dashboard
            </Link>
            <WalletButton />
          </div>
        </div>
      </div>
    </header>
  );
}
