import { useState, useEffect } from "react";

export interface AgentState {
  lastUpdated: string;
  protocols: {
    name: string;
    apy: number;
    isBest: boolean;
  }[];
  decision: {
    shouldRebalance: boolean;
    reason: string;
    apyImprovement: number;
    targetProtocol: string | null;
  };
  rebalanceHistory: {
    timestamp: string;
    from: string;
    to: string;
    apyBefore: number;
    apyAfter: number;
    reason: string;
  }[];
}

export function useAgentStream() {
  const [agentState, setAgentState] = useState<AgentState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let retryTimeout: NodeJS.Timeout;

    const connect = () => {
      eventSource = new EventSource("/api/agent-events");

      eventSource.onopen = () => {
        setIsConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const data: AgentState = JSON.parse(event.data);
          setAgentState(data);
          setLastUpdated(new Date(data.lastUpdated));
        } catch (err) {
          console.error("Error parsing agent event:", err);
        }
      };

      eventSource.onerror = () => {
        setIsConnected(false);
        eventSource?.close();
        // Retry logic
        retryTimeout = setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      clearTimeout(retryTimeout);
      eventSource?.close();
    };
  }, []);

  return { agentState, isConnected, lastUpdated };
}
