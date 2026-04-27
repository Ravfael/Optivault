"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { 
  Wallet, Bot, Lock, Cpu, Layers, ExternalLink, 
  Code2, MessageCircle, Zap, Shield, Key, Clock, AlertTriangle, TrendingDown, 
  TrendingUp, ArrowDownCircle, LineChart, ChevronDown, CheckCircle2, Server, Globe
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { PROTOCOLS } from "@/lib/mockData";
import { CryptoTooltip } from "@/components/shared/Tooltip";

const stats = [
  { label: "Total Value Managed", value: 420, prefix: "$", suffix: "M+" },
  { label: "Active Yield Farmers", value: 85, prefix: "", suffix: "k+" },
  { label: "Daily Rebalances", value: 12, prefix: "", suffix: "M+" },
  { label: "On-Chain Transparancy", value: 100, prefix: "", suffix: "%" },
];

function Counter({ value, prefix = "", suffix = "" }: { value: number, prefix?: string, suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  useEffect(() => {
    if (isInView && ref.current) {
      let start = 0;
      const duration = 5000;
      const startTime = performance.now();
      
      const update = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const ease = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(ease * value);
        
        if (ref.current) {
          ref.current.textContent = `${prefix}${current}${suffix}`;
        }
        
        if (progress < 1) {
          requestAnimationFrame(update);
        } else if (ref.current) {
          ref.current.textContent = `${prefix}${value}${suffix}`;
        }
      };
      
      requestAnimationFrame(update);
    }
  }, [isInView, value, prefix, suffix]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#8b5cf6]/30 font-sans">
      <Navbar />

      {/* 1. Hero Section (Kept mostly as is, except stats have animation counter) */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 pt-16 overflow-hidden">
        {/* Hero Background Image */}
        <div 
          className="absolute inset-0 z-0 opacity-100 bg-[#050505]"
          style={{
            backgroundImage: "url('/background1.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        />

        {/* Grid overlay - adjusted to subtle deep black theme */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center mt-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1
              className="text-5xl sm:text-6xl md:text-[80px] font-bold text-white 
                           leading-[1.1] tracking-tight mb-6"
            >
              Your Money Working
              <br />24/7 On Autopilot
            </h1>

            <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Optivault is an AI agent that automatically finds and moves your funds<br className="hidden sm:block" />
              to the best yield opportunities on Solana.
            </p>

            <div className="flex justify-center">
              <Link 
                href="/dashboard" 
                className="px-8 py-3 rounded-full bg-[#8b5cf6]/60 text-white font-semibold backdrop-blur-md hover:bg-[#8b5cf6]/80 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]"
              >
                Launch Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section id="stats" className="relative z-10 mt-12 pb-24">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
                  <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </p>
                <p className="text-sm sm:text-base text-white/50">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 2. Problem -> Solution Section (Why Optivault) */}
      <section className="py-24 px-4 relative overflow-hidden border-t border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#8b5cf6]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight">Why Optivault?</h2>
            <p className="text-white/60 max-w-xl mx-auto text-lg">Leave the complexity behind. Upgrade your yield farming experience with AI automation.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            {/* Problem */}
            <div className="bg-[#0a0a0a] border border-white/5 p-10 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -mr-20 -mt-20 transition-opacity opacity-50 group-hover:opacity-100" />
              <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white/90">Manual Farming</h3>
              </div>
              <ul className="space-y-6 relative z-10">
                {[
                  { icon: Clock, text: "Extremely time-consuming to find good APYs" },
                  { icon: TrendingDown, text: "High risk of missing peak yield opportunities" },
                  { icon: Layers, text: "Complex protocol interactions and gas fees" }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <item.icon className="w-6 h-6 text-white/30 shrink-0 mt-0.5" />
                    <span className="text-white/60 text-lg">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solution */}
            <div className="bg-gradient-to-br from-[#110c22] to-[#0a0a0c] border border-[#8b5cf6]/20 p-10 rounded-3xl shadow-[0_0_40px_rgba(139,92,246,0.1)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#8b5cf6]/10 rounded-full blur-3xl -mr-20 -mt-20 transition-opacity opacity-50 group-hover:opacity-100" />
              <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-[#8b5cf6]/20 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.4)]">
                  <Bot className="w-5 h-5 text-[#8b5cf6]" />
                </div>
                <h3 className="text-2xl font-bold text-white">Optivault AI</h3>
              </div>
              <ul className="space-y-6 relative z-10">
                {[
                  { icon: Zap, text: "Fully automated 24/7 portfolio optimization" },
                  { icon: TrendingUp, text: "Smart reallocation for maximized returns" },
                  { icon: Shield, text: "Risk-adjusted scoring keeps your funds safe" }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <item.icon className="w-6 h-6 text-[#8b5cf6] shrink-0 mt-0.5" />
                    <span className="text-white/80 text-lg">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className="py-24 px-4 relative border-y border-white/5 overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-40"
          style={{
            backgroundImage: "url('/background2.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight">How It Works</h2>
            <p className="text-white/60 max-w-xl mx-auto text-lg">Four simple steps to start earning optimized yield.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-[45px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-[#8b5cf6]/30 to-transparent" />
            
            {[
              { icon: Wallet, title: "Connect Wallet", desc: "Securely link your Solana wallet." },
              { icon: ArrowDownCircle, title: "Deposit Funds", desc: "Add USDC, SOL, or other assets." },
              { icon: Cpu, title: "AI Allocates", desc: "Our engine scans for best yields." },
              { icon: LineChart, title: "Earn Yield", desc: "Sit back and watch crypto grow." }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className="w-24 h-24 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center mb-6 relative group-hover:border-[#8b5cf6]/50 transition-colors shadow-xl">
                  <div className="absolute inset-0 rounded-full bg-[#8b5cf6]/0 group-hover:bg-[#8b5cf6]/10 transition-colors" />
                  <step.icon className="w-10 h-10 text-white/80 group-hover:text-[#8b5cf6] transition-colors relative z-10" />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#110c22] border border-white/10 flex items-center justify-center text-xs font-bold text-white/50">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-white/50 text-sm max-w-[200px] leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. AI Strategy / Engine Section */}
      <section className="py-32 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 text-[#8b5cf6] text-sm font-semibold mb-6">
                <Cpu className="w-4 h-4" /> The Brain
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
                Intelligent routing.<br />Real-time execution.
              </h2>
              <p className="text-white/60 text-lg mb-8 leading-relaxed">
                Optivault's AI engine continuously ingests on-chain data, calculating risk-adjusted yields across the Solana ecosystem. When a better opportunity arises, it seamlessly rebalances your portfolio.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: "Risk Scoring", desc: "Every protocol is vetted and scored based on liquidity, audit history, and TVL stability." },
                  { title: "Real-Time Monitoring", desc: "Sub-second block analysis ensures you never miss a yield spike." },
                  { title: "Auto Rebalancing", desc: "Gas-optimized smart routing moves capital only when it's highly profitable." }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#8b5cf6]/20 flex items-center justify-center shrink-0 mt-1">
                      <CheckCircle2 className="w-4 h-4 text-[#8b5cf6]" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">{feature.title}</h4>
                      <p className="text-white/50 text-sm">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Abstract Visual */}
            <div className="relative h-[400px] rounded-3xl border border-white/5 bg-[#0a0a0c] overflow-hidden flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15)_0,transparent_70%)]" />
               <div className="relative z-10 flex items-center justify-center w-full h-full">
                 {/* Central Node */}
                 <motion.div 
                   animate={{ boxShadow: ["0 0 20px rgba(139,92,246,0.2)", "0 0 60px rgba(139,92,246,0.6)", "0 0 20px rgba(139,92,246,0.2)"] }}
                   transition={{ duration: 4, repeat: Infinity }}
                   className="w-24 h-24 rounded-full bg-[#110c22] border border-[#8b5cf6]/50 flex items-center justify-center z-20 shadow-[0_0_30px_rgba(139,92,246,0.3)]"
                 >
                   <Bot className="w-10 h-10 text-[#8b5cf6]" />
                 </motion.div>

                 {/* Surrounding Nodes */}
                 {[0, 1, 2, 3, 4].map((i) => {
                   const angle = (i * Math.PI * 2) / 5;
                   const x = Math.cos(angle) * 120;
                   const y = Math.sin(angle) * 120;
                   return (
                     <div key={i}>
                       <motion.div 
                         initial={{ opacity: 0.2 }}
                         animate={{ opacity: [0.2, 0.8, 0.2] }}
                         transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
                         className="absolute top-1/2 left-1/2 w-12 h-12 -ml-6 -mt-6 rounded-full bg-[#110c22] border border-[#8b5cf6]/30 flex items-center justify-center z-20"
                         style={{ transform: `translate(${x}px, ${y}px)` }}
                       >
                         <Server className="w-4 h-4 text-[#8b5cf6]/60" />
                       </motion.div>
                       {/* Connecting lines */}
                       <svg className="absolute inset-0 w-full h-full z-10" style={{ pointerEvents: 'none' }}>
                         <motion.line 
                           x1="50%" y1="50%" 
                           x2={`calc(50% + ${x}px)`} y2={`calc(50% + ${y}px)`} 
                           stroke="rgba(139,92,246,0.2)" 
                           strokeWidth="2"
                           strokeDasharray="4 4"
                         />
                       </svg>
                     </div>
                   );
                 })}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Supported Protocols Section */}
      <section id="protocols" className="py-24 relative bg-black/40 border-y border-white/5 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
              Integrated Protocols
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Your assets are seamlessly routed across the most secure and liquid lending, staking, and LP protocols.
            </p>
          </div>
        </div>

        <div className="relative flex overflow-hidden w-full group">
          {/* Gradient Mask for fading edges */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />
          
          <motion.div 
            className="flex w-max items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 25, repeat: Infinity }}
            whileHover={{ animationPlayState: "paused" }}
          >
            {[...PROTOCOLS, ...PROTOCOLS].map((protocol, i) => (
              <div 
                key={`${protocol.name}-${i}`} 
                className="flex items-center justify-center px-10 md:px-16 shrink-0"
              >
                <img 
                  src={protocol.logo} 
                  alt={protocol.name} 
                  className="h-20 md:h-28 w-auto object-contain rounded-2xl opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300" 
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. Security & Transparency Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-40"
          style={{
            backgroundImage: "url('/background2.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.08)_0,transparent_60%)] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight">Security First. Always.</h2>
            <p className="text-white/60 max-w-xl mx-auto text-lg">We built Optivault with a paranoid approach to security, so you can sleep soundly.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Key, title: "Non-Custodial", desc: "You maintain 100% control of your funds. Optivault can only route funds, never withdraw them to external addresses." },
              { icon: Code2, title: "Audited Smart Contracts", desc: "Our vault contracts are fully open-source, immutably deployed on Solana, and rigorously audited." },
              { icon: Globe, title: "On-Chain Transparency", desc: "Every rebalance, strategy shift, and yield harvest is completely verifiable on the blockchain." }
            ].map((item, i) => (
              <div key={i} className="bg-[#0a0a0c] border border-white/5 p-8 rounded-3xl hover:border-[#8b5cf6]/20 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-[#110c22] border border-[#8b5cf6]/20 flex items-center justify-center mb-6">
                  <item.icon className="w-6 h-6 text-[#8b5cf6]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="py-24 px-4 bg-black/40 border-y border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-white/60">Everything you need to know about the platform and security.</p>
          </div>

          <div className="space-y-4">
            {[
              { q: "Is my money safe?", a: "Yes. Optivault is strictly non-custodial. The smart contracts ensure that only you can withdraw your initial deposit and generated yield back to your connected wallet." },
              { q: "Can I withdraw anytime?", a: "Absolutely. There are no lock-up periods. You can withdraw your funds at any time directly through the dashboard with zero platform exit fees." },
              { q: "How does the AI decide where to put my funds?", a: "The AI evaluates dozens of data points across Solana protocols every second—including base APY, reward token volatility, liquidity depth, and protocol safety scores—to determine the optimal risk-adjusted allocation." },
              { q: "What are the risks?", a: "While Optivault minimizes risk through diversification and strict protocol vetting, all DeFi investments carry inherent smart contract risks. Never invest more than you can afford to lose." }
            ].map((faq, i) => (
              <div key={i} className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden transition-colors hover:border-white/10">
                <button 
                  className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none group"
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                >
                  <span className="font-bold text-white/90 group-hover:text-white transition-colors">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-white/40 transition-transform ${activeFaq === i ? 'rotate-180 text-[#8b5cf6]' : ''}`} />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${activeFaq === i ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="px-6 pb-5 text-white/50 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Final CTA Section with background3.png */}
      <section className="relative py-32 px-4 overflow-hidden flex justify-center border-t border-white/5">
        <div 
          className="absolute inset-0 z-0 opacity-40 bg-[#050505]"
          style={{
            backgroundImage: "url('/background3.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        />
        <div className="relative z-10 w-full max-w-4xl bg-gradient-to-b from-[#110c22]/90 to-[#0a0a0c]/90 backdrop-blur-xl border border-[#8b5cf6]/20 rounded-[40px] p-12 md:p-20 text-center shadow-[0_0_80px_rgba(139,92,246,0.15)]">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Start earning smarter<br />with AI today.
          </h2>
          <p className="text-white/60 mb-10 max-w-xl mx-auto text-lg">
            Connect your wallet and let the engine find the highest yields on Solana. Setup takes less than 3 minutes.
          </p>
          <Link href="/setup" className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[#8b5cf6] text-white font-bold text-lg hover:bg-[#9333ea] transition-all shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:shadow-[0_0_50px_rgba(139,92,246,0.6)]">
            <Wallet className="w-5 h-5" />
            Connect Wallet
          </Link>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="border-t border-white/5 py-12 px-4 bg-[#050505]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-white tracking-tight">Optivault</span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-white/50 hover:text-white transition-colors">Docs</a>
            <a href="#" className="text-sm font-medium text-white/50 hover:text-white transition-colors">GitHub</a>
            <a href="#" className="text-sm font-medium text-white/50 hover:text-white transition-colors">Twitter</a>
            <a href="#" className="text-sm font-medium text-white/50 hover:text-white transition-colors">Privacy</a>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            <span className="text-xs font-bold text-white/50">Built on Solana</span>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto text-center mt-12 pt-8 border-t border-white/5">
          <p className="text-xs text-white/30 font-medium">© 2026 Optivault. Not financial advice. Crypto investments carry risk.</p>
        </div>
      </footer>
    </div>
  );
}
