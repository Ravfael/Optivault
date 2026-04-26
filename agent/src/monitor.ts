import { CONFIG } from "./config";

export interface ProtocolData {
  name: string;
  address: string;
  apy: number;
  tvl: number;
  isAvailable: boolean;
  lastUpdated: Date;
}

export interface MarketSnapshot {
  protocols: ProtocolData[];
  fetchedAt: Date;
}

export async function fetchMarketSnapshot(): Promise<MarketSnapshot> {
  const protocols: ProtocolData[] = [];
  
  try {
    // Simulate API calls with small random APY fluctuations
    
    // Kamino: base 8.2% ± 0.5%
    const kaminoApy = 8.2 + (Math.random() * 1.0 - 0.5);
    protocols.push({
      name: CONFIG.PROTOCOLS.KAMINO.name,
      address: CONFIG.PROTOCOLS.KAMINO.address,
      apy: parseFloat(kaminoApy.toFixed(2)),
      tvl: 15000000,
      isAvailable: true,
      lastUpdated: new Date()
    });

    // MarginFi: base 6.1% ± 0.3%
    const marginFiApy = 6.1 + (Math.random() * 0.6 - 0.3);
    protocols.push({
      name: CONFIG.PROTOCOLS.MARGINFI.name,
      address: CONFIG.PROTOCOLS.MARGINFI.address,
      apy: parseFloat(marginFiApy.toFixed(2)),
      tvl: 12000000,
      isAvailable: true,
      lastUpdated: new Date()
    });

    // Marinade: base 7.4% ± 0.4%
    const marinadeApy = 7.4 + (Math.random() * 0.8 - 0.4);
    protocols.push({
      name: CONFIG.PROTOCOLS.MARINADE.name,
      address: CONFIG.PROTOCOLS.MARINADE.address,
      apy: parseFloat(marinadeApy.toFixed(2)),
      tvl: 25000000,
      isAvailable: true,
      lastUpdated: new Date()
    });

    for (const p of protocols) {
      console.log(`[Monitor] Fetched ${p.name}: ${p.apy}% APY`);
    }

  } catch (error) {
    console.error("[Monitor] Error fetching market snapshot:", error);
  }

  return {
    protocols,
    fetchedAt: new Date()
  };
}
