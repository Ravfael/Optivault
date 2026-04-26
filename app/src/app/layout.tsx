import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppWalletProvider } from "@/components/layout/AppWalletProvider";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Optivault — AI-Powered DeFi Yield Optimizer on Solana",
  description: "Let AI automatically manage and optimize your crypto yield on Solana. Connect your wallet, set your preferences, and earn — on autopilot.",
  keywords: ["DeFi", "Yield", "Solana", "AI", "Crypto", "Optimizer", "Optivault"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}>
      <body className="min-h-screen bg-background text-foreground flex flex-col">
        <AppWalletProvider>{children}</AppWalletProvider>
      </body>
    </html>
  );
}
