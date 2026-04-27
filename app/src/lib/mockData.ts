export interface Protocol {
  name: string;
  logo: string;
  apy: number;
  color: string;
  tvl: number;
}

export interface Allocation {
  protocol: string;
  asset: string;
  allocated: number;
  apy: number;
  earned: number;
  status: "active" | "paused" | "pending";
  logo: string;
  color: string;
}

export interface AIActivity {
  id: string;
  timestamp: string;
  action: "rebalance" | "deposit" | "withdrawal";
  description: string;
  amount: number;
  fromProtocol?: string;
  toProtocol?: string;
  apyBefore?: number;
  apyAfter?: number;
}

export interface PortfolioSnapshot {
  date: string;
  apy: number;
  baseline: number;
}

export const PROTOCOLS: Protocol[] = [
  { name: "Kamino", logo: "/kamino.png", apy: 8.2, color: "#3B82F6", tvl: 420_000_000 },
  { name: "MarginFi", logo: "/marginfi.png", apy: 6.1, color: "#8B5CF6", tvl: 310_000_000 },
  { name: "Marinade", logo: "/marinade.png", apy: 7.4, color: "#F97316", tvl: 580_000_000 },
  { name: "Raydium", logo: "/raydium.jpg", apy: 12.8, color: "#A855F7", tvl: 290_000_000 },
  { name: "Orca", logo: "/orca.jpg", apy: 9.3, color: "#06B6D4", tvl: 210_000_000 },
  { name: "Solend", logo: "/solend.jpg", apy: 5.8, color: "#F97316", tvl: 150_000_000 },
  { name: "Jupiter", logo: "/jupiter.jpeg", apy: 15.2, color: "#14B8A6", tvl: 850_000_000 },
];

export const MOCK_ALLOCATIONS: Allocation[] = [
  {
    protocol: "Kamino",
    asset: "USDC",
    allocated: 6000,
    apy: 8.2,
    earned: 41.2,
    status: "active",
    logo: "🔷",
    color: "#3B82F6",
  },
  {
    protocol: "MarginFi",
    asset: "USDC",
    allocated: 4000,
    apy: 6.1,
    earned: 20.4,
    status: "active",
    logo: "🟪",
    color: "#8B5CF6",
  },
  {
    protocol: "Marinade",
    asset: "SOL",
    allocated: 2500,
    apy: 7.4,
    earned: 15.5,
    status: "active",
    logo: "🟠",
    color: "#F97316",
  },
  {
    protocol: "Raydium",
    asset: "SOL",
    allocated: 1500,
    apy: 12.8,
    earned: 16.0,
    status: "paused",
    logo: "🟣",
    color: "#A855F7",
  },
];

export const MOCK_ACTIVITIES: AIActivity[] = [
  {
    id: "1",
    timestamp: "2025-04-22T12:30:00Z",
    action: "rebalance",
    description:
      "AI moved your funds from MarginFi (5.2% APY) to Kamino (8.3% APY) to maximize your returns",
    amount: 2000,
    fromProtocol: "MarginFi",
    toProtocol: "Kamino",
    apyBefore: 5.2,
    apyAfter: 8.3,
  },
  {
    id: "2",
    timestamp: "2025-04-22T08:15:00Z",
    action: "rebalance",
    description:
      "AI detected higher yields on Marinade and moved a portion of your staked SOL for better returns",
    amount: 1500,
    fromProtocol: "Orca",
    toProtocol: "Marinade",
    apyBefore: 6.8,
    apyAfter: 7.4,
  },
  {
    id: "3",
    timestamp: "2025-04-21T22:00:00Z",
    action: "deposit",
    description:
      "New deposit received and automatically allocated across top-performing protocols",
    amount: 5000,
    toProtocol: "Kamino",
    apyAfter: 8.2,
  },
  {
    id: "4",
    timestamp: "2025-04-21T14:45:00Z",
    action: "rebalance",
    description:
      "AI rebalanced your portfolio to reduce risk exposure — moved funds from Raydium to MarginFi",
    amount: 1000,
    fromProtocol: "Raydium",
    toProtocol: "MarginFi",
    apyBefore: 14.2,
    apyAfter: 6.1,
  },
  {
    id: "5",
    timestamp: "2025-04-20T10:00:00Z",
    action: "rebalance",
    description:
      "Routine daily optimization — slight adjustment to maximize compound returns",
    amount: 800,
    fromProtocol: "Marinade",
    toProtocol: "Kamino",
    apyBefore: 7.1,
    apyAfter: 8.2,
  },
  {
    id: "6",
    timestamp: "2025-04-19T16:30:00Z",
    action: "withdrawal",
    description: "Partial withdrawal processed as requested by user",
    amount: 500,
    fromProtocol: "MarginFi",
  },
  {
    id: "7",
    timestamp: "2025-04-19T09:00:00Z",
    action: "rebalance",
    description:
      "AI detected a new high-yield opportunity on Raydium and allocated funds accordingly",
    amount: 1500,
    fromProtocol: "Orca",
    toProtocol: "Raydium",
    apyBefore: 8.9,
    apyAfter: 12.8,
  },
  {
    id: "8",
    timestamp: "2025-04-18T20:15:00Z",
    action: "deposit",
    description:
      "Initial deposit received — AI agent activated and funds distributed to optimal protocols",
    amount: 10000,
    toProtocol: "Multiple",
    apyAfter: 7.8,
  },
];

export const MOCK_APY_DATA: PortfolioSnapshot[] = Array.from(
  { length: 30 },
  (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
      .toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    apy: 6.5 + Math.sin(i * 0.3) * 1.5 + Math.random() * 0.8,
    baseline: 4.2 + Math.sin(i * 0.2) * 0.5 + Math.random() * 0.3,
  })
);

export const TOOLTIP_DEFINITIONS: Record<string, string> = {
  APY: "Annual Percentage Yield: how much you earn per year, shown as a percentage",
  TVL: "Total Value Locked: the total amount of money deposited in the platform",
  Protocol: "A DeFi app where your money earns yield",
  Rebalance: "AI moves your funds to a better option automatically",
  "Risk Profile": "How aggressive or conservative you want AI to invest your funds",
  SOL: "Solana's native cryptocurrency token",
  USDC: "A stablecoin pegged to the US Dollar — 1 USDC ≈ $1",
  Stablecoin: "A cryptocurrency designed to maintain a stable value, usually $1",
  Yield: "The earnings or returns generated from your deposited funds",
  DeFi: "Decentralized Finance — financial services built on blockchain technology",
  Wallet: "A digital tool that stores your cryptocurrency and lets you interact with DeFi apps",
};
