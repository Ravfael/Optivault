"use client";

import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl rounded-full border border-white/[0.05] bg-[#1a1a24]/80 backdrop-blur-md px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Image src="/logo_main.png" alt="Optivault" width={140} height={40} className="h-8 md:h-10 w-auto" priority />
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-10">
          <Link href="#how-it-works" className="text-sm font-medium text-white hover:text-white/80 transition-colors">
            How It Works
          </Link>
          <Link href="#protocols" className="text-sm font-medium text-white hover:text-white/80 transition-colors">
            Protocols
          </Link>
          <Link href="#security" className="text-sm font-medium text-white hover:text-white/80 transition-colors">
            Security
          </Link>
          <Link href="#faq" className="text-sm font-medium text-white hover:text-white/80 transition-colors">
            FAQ
          </Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-white hover:text-white/80 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}
