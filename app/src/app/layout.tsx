import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import { AppWalletProvider } from "@/components/layout/AppWalletProvider";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Optivault",
  description: "Let AI automatically manage and optimize your crypto yield on Solana. Connect your wallet, set your preferences, and earn — on autopilot.",
  keywords: ["DeFi", "Yield", "Solana", "AI", "Crypto", "Optimizer", "Optivault"],

  icons: {
    icon: "/optivault.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} dark h-full antialiased`}>
      <body className="min-h-screen bg-background text-foreground flex flex-col">
        <AppWalletProvider>{children}</AppWalletProvider>
      </body>
    </html>
  );
}
