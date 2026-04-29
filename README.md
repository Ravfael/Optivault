<div align="center">
  <img src="assets/banner1.png" alt="Optivault Banner" width="100%" />

# Optivault 🏦🤖

**AI-Powered Automated DeFi Yield Aggregation and Rebalancing on Solana**

_Built for the Hackathon - DeFi & AI Tracks_

</div>

<br />

## 📖 Overview

**Optivault** is an intelligent, non-custodial yield aggregator on the Solana blockchain. It seamlessly integrates a sleek web application, an Anchor-built smart contract, and an off-chain AI-powered agent.

Optivault allows users to deposit their assets, select a personalized risk profile (Conservative, Balanced, Aggressive), and let an automated AI Agent dynamically rebalance their portfolio across top Solana DeFi protocols (such as Kamino, MarginFi, etc.) to maximize yield while maintaining the desired risk exposure.

---

## ⚡ Features

- **Personalized Vaults**: Define your time horizon and set your risk appetite.
- **Smart Contract Security**: Funds are secured on-chain via our Rust-based Anchor program, ensuring full transparency.
- **AI-Driven Rebalancing**: An off-chain analyzer continuously monitors protocol APYs, liquidity, and risk metrics, automatically firing rebalance instructions to capture the highest safe yields.
- **Zero-Friction UI**: A seamless Next.js frontend with robust wallet integration for tracking performance, APY charts, and allocation metrics in real-time.

---

## 🏗️ System Architecture

Optivault consists of three main components engineered for high speed and automated yield matching:

1. **`app/` (Frontend UI)**
   - **Stack**: Next.js, TailwindCSS, Solana Wallet Adapter.
   - **Role**: Dashboard for users to deposit assets, configure their risk profile, visualize APY history, and track their AI agent's performance.

2. **`optivault/` (Smart Contract)**
   - **Stack**: Rust, Anchor Framework.
   - **Role**: Maintains state (`risk_level`, `time_horizon`), holds deposits in secure PDAs, and enforces on-chain permissioning for rebalancing operations (`initialize`, `deposit`, `withdraw`, `rebalance`).

3. **`agent/` (Off-chain AI Rebalancer)**
   - **Stack**: Node.js, TypeScript, `@solana/web3.js`.
   - **Role**: A continuously running Node watcher that polls DeFi protocol APIs and market conditions. It simulates potential allocations and fires signed `rebalance` transactions to the Optivault Anchor program when conditions align with a user's risk tier.

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+)
- Yarn / npm
- Rust & Solana CLI (latest)
- Anchor CLI (`avm`)

### 1. Smart Contract Deployment

```bash
cd optivault
yarn install
# Build the Anchor program
anchor build
# Deploy to localnet or devnet
anchor deploy
```

### 2. Frontend Setup

```bash
cd app
npm install  # or yarn
# Start the Next.js development server
npm run dev
```

Navigate to `http://localhost:3000` to interact with the Optivault UI.

### 3. Run the AI Agent

```bash
cd agent
npm install
# Configure your agent's .env file with your RPC URL and Keypair
cp .env.example .env
# Start the monitoring and execution agent
npm start
```

---

## 🔮 Roadmap / What's Next

- Integrate integration with more diverse Solana DeFi protocols (Meteora, Raydium, etc).
- Implement advanced Machine Learning models directly analyzing on-chain program tick data for front-running protection.
- Support for tokenized Real World Assets (RWAs) as part of balanced/conservative risk profiles.
- Automated tax and yield reporting directly exporting to CSV.

---

## 🏆 Hackathon Submission Details

**Track:** DeFi / AI & Consumer
**Live Demo:** _(Add your link here)_
**Video Presentation:** _(Add your link here)_

_Optivault was built with 🩵 for the Solana ecosystem._
