"use client";

import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl rounded-full border border-white/[0.05] bg-[#1a1a24]/80 backdrop-blur-md px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Image src="/logo_main.png" alt="Optivault" width={140} height={40} className="h-8 md:h-10 w-auto" priority />
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-10">
          <Link href="#" className="text-sm font-medium text-white hover:text-white/80 transition-colors">
            Optivault
          </Link>
          <Link href="#" className="text-sm font-medium text-white hover:text-white/80 transition-colors">
            Optivault
          </Link>
          <Link href="#" className="text-sm font-medium text-white hover:text-white/80 transition-colors">
            Optivault
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
