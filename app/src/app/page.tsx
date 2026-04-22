"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Wallet,
  SlidersHorizontal,
  Bot,
  ArrowDown,
  Lock,
  Percent,
  Cpu,
  Layers,
  ExternalLink,
  Code2,
  MessageCircle,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { PROTOCOLS } from "@/lib/mockData";
import { CryptoTooltip } from "@/components/shared/Tooltip";



const stats = [
  { label: "Total Value Locked", value: "$127.4M", icon: Lock, tooltip: "TVL" },
  { label: "Average APY Today", value: "8.7%", icon: Percent, tooltip: "APY" },
  { label: "Active AI Agents", value: "12,847", icon: Cpu },
  { label: "Protocols Monitored", value: "5", icon: Layers, tooltip: "Protocol" },
];

const steps = [
  {
    icon: Wallet,
    title: "Connect your Solana wallet",
    description: "Link your wallet in one click. We support Phantom, Solflare, and more.",
    color: "#7C3AED",
  },
  {
    icon: SlidersHorizontal,
    title: "Set your preferences",
    description: "Choose how much to deposit, your risk level, and time horizon.",
    color: "#14B8A6",
  },
  {
    icon: Bot,
    title: "AI handles everything",
    description: "Our AI agent monitors yields 24/7 and automatically moves your funds to the best opportunities.",
    color: "#22C55E",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-16 overflow-hidden">
        {/* Animated orbs */}
        <div className="orb orb-primary w-[500px] h-[500px] -top-48 -left-48 animate-float" />
        <div className="orb orb-secondary w-[400px] h-[400px] top-1/3 -right-32 animate-float-delayed" />
        <div className="orb orb-primary w-[300px] h-[300px] bottom-0 left-1/3 animate-float-slow" />

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 
                         border border-primary/20 text-primary text-sm font-medium mb-8"
            >
              <Zap className="w-3.5 h-3.5" />
              AI-Powered Yield Optimization on Solana
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-text-primary 
                           leading-[1.1] tracking-tight mb-6">
              Your Money, Working{" "}
              <span className="gradient-text">24/7</span>
              <br />
              — On Autopilot
            </h1>

            <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
              Optivault is an AI agent that automatically finds and moves your funds
              to the best <CryptoTooltip term="Yield">yield</CryptoTooltip> opportunities
              on Solana — so you earn more, effortlessly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/setup" className="btn-primary text-base px-8 py-4 flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Connect Wallet &amp; Start Earning
              </Link>
              <a
                href="#how-it-works"
                className="btn-secondary text-base px-8 py-4 flex items-center gap-2"
              >
                See How It Works
                <ArrowDown className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section id="stats" className="relative z-10 -mt-20">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                <p className="text-xs text-text-muted mt-1">
                  {stat.tooltip ? (
                    <CryptoTooltip term={stat.tooltip}>{stat.label}</CryptoTooltip>
                  ) : (
                    stat.label
                  )}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              How It Works
            </h2>
            <p className="text-text-muted max-w-xl mx-auto">
              Three simple steps to start earning optimized yield — no expertise
              required.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card-hover p-8 text-center group"
              >
                <div
                  className="w-14 h-14 mx-auto mb-5 rounded-2xl flex items-center justify-center 
                             transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${step.color}15` }}
                >
                  <step.icon className="w-7 h-7" style={{ color: step.color }} />
                </div>

                <div className="text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">
                  Step {i + 1}
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Protocols */}
      <section id="protocols" className="py-24 px-4 relative">
        <div className="orb orb-secondary w-[300px] h-[300px] -right-20 top-0" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Supported <CryptoTooltip term="Protocol">Protocols</CryptoTooltip>
            </h2>
            <p className="text-text-muted max-w-xl mx-auto">
              Optivault continuously monitors the best{" "}
              <CryptoTooltip term="DeFi">DeFi</CryptoTooltip> protocols on Solana
              to find optimal yields for your funds.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {PROTOCOLS.map((protocol, i) => (
              <motion.div
                key={protocol.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card-hover p-6 text-center group"
              >
                <div className="text-3xl mb-3">{protocol.logo}</div>
                <h3 className="text-sm font-semibold text-text-primary mb-1">
                  {protocol.name}
                </h3>
                <div
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: `${protocol.color}15`,
                    color: protocol.color,
                  }}
                >
                  {protocol.apy}% <CryptoTooltip term="APY">APY</CryptoTooltip>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-text-primary mb-4">
                Ready to put your crypto to work?
              </h2>
              <p className="text-text-muted mb-8 max-w-lg mx-auto">
                Join thousands of users earning optimized yield with AI-powered
                management — no effort required.
              </p>
              <Link
                href="/setup"
                className="btn-primary text-base px-8 py-4 inline-flex items-center gap-2"
              >
                <Wallet className="w-5 h-5" />
                Get Started Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-bold text-text-primary">Optivault</span>
                <p className="text-xs text-text-muted">AI Yield Optimizer</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-text-muted hover:text-text-primary transition-colors flex items-center gap-1">
                Docs <ExternalLink className="w-3 h-3" />
              </a>
              <a href="#" className="text-sm text-text-muted hover:text-text-primary transition-colors flex items-center gap-1">
                <Code2 className="w-4 h-4" /> GitHub
              </a>
              <a href="#" className="text-sm text-text-muted hover:text-text-primary transition-colors flex items-center gap-1">
                <MessageCircle className="w-4 h-4" /> Twitter
              </a>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-xs text-text-muted">Built on Solana</span>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-xs text-text-muted/60">
              © 2025 Optivault. Not financial advice. Crypto investments carry risk.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
