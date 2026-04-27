"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface Transaction {
  id: string;
  hash: string;
  createdAt: string;
  sourceAccount: string;
  fee: string;
  memo?: string;
  isNew?: boolean;
}

interface UseTransactionPollingOptions {
  accountId: string | null;
  horizonUrl?: string;
}

interface UseTransactionPollingResult {
  transactions: Transaction[];
  isConnected: boolean;
  error: string | null;
}

const HORIZON_TESTNET = "https://horizon-testnet.stellar.org";

export function useTransactionPolling({
  accountId,
  horizonUrl = HORIZON_TESTNET,
}: UseTransactionPollingOptions): UseTransactionPollingResult {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const newBadgeTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const clearNewBadge = useCallback((txId: string) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === txId ? { ...tx, isNew: false } : tx))
    );
  }, []);

  useEffect(() => {
    if (!accountId) return;

    const url = `${horizonUrl}/accounts/${accountId}/transactions?cursor=now&order=asc`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    es.onmessage = (event) => {
      try {
        const raw = JSON.parse(event.data) as Record<string, unknown>;
        const tx: Transaction = {
          id: raw.id as string,
          hash: raw.hash as string,
          createdAt: raw.created_at as string,
          sourceAccount: raw.source_account as string,
          fee: raw.fee_charged as string,
          memo: raw.memo as string | undefined,
          isNew: true,
        };

        setTransactions((prev) => {
          if (prev.some((t) => t.id === tx.id)) return prev;
          return [tx, ...prev];
        });

        const timer = setTimeout(() => clearNewBadge(tx.id), 5000);
        newBadgeTimersRef.current.set(tx.id, timer);
      } catch {
        // ignore malformed SSE frames
      }
    };

    es.onerror = () => {
      setIsConnected(false);
      setError("Lost connection to Horizon. Reconnecting…");
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
      setIsConnected(false);
      newBadgeTimersRef.current.forEach(clearTimeout);
      newBadgeTimersRef.current.clear();
    };
  }, [accountId, horizonUrl, clearNewBadge]);

  return { transactions, isConnected, error };
}
