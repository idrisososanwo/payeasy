"use client";

import { Receipt, Wifi, WifiOff } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";
import Link from "next/link";
import { useTransactionPolling } from "@/hooks/useTransactionPolling";

// Replace with the actual connected wallet account ID when auth is wired up.
const DEMO_ACCOUNT_ID: string | null = null;

export default function HistoryPage() {
  const { transactions, isConnected, error } = useTransactionPolling({
    accountId: DEMO_ACCOUNT_ID,
  });

  return (
    <main className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-white">Payment History</h1>
            <p className="text-dark-500 mt-1 text-sm">
              All your escrow transactions in one place.
            </p>
          </div>

          {DEMO_ACCOUNT_ID && (
            <div className="flex items-center gap-2 text-xs">
              {isConnected ? (
                <>
                  <Wifi size={14} className="text-emerald-400" />
                  <span className="text-emerald-400">Live</span>
                </>
              ) : (
                <>
                  <WifiOff size={14} className="text-dark-500" />
                  <span className="text-dark-500">Connecting…</span>
                </>
              )}
            </div>
          )}
        </div>

        {error && (
          <p className="mb-4 text-xs text-amber-400 glass px-4 py-2 rounded-lg">
            {error}
          </p>
        )}

        <div className="glass-card p-2">
          {transactions.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No transactions yet"
              description="Once you contribute to an escrow, your payment history will appear here."
              action={{
                label: "Create Escrow",
                onClick: () => {
                  window.location.href = "/escrow/create";
                },
              }}
            />
          ) : (
            <ul className="divide-y divide-white/5">
              {transactions.map((tx) => (
                <li
                  key={tx.id}
                  className="flex items-start justify-between gap-4 py-4 px-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                      <Receipt size={15} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white text-sm font-medium truncate max-w-[180px] sm:max-w-xs">
                          {tx.hash}
                        </p>
                        {tx.isNew && (
                          <span className="text-[10px] font-semibold bg-brand-500/20 text-brand-400 px-1.5 py-0.5 rounded-full animate-pulse">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-dark-500 text-xs mt-0.5">
                        {new Date(tx.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-accent-400 text-sm font-semibold">
                      Fee: {tx.fee} stroops
                    </p>
                    <p className="text-dark-600 text-xs truncate max-w-[120px]">
                      {tx.sourceAccount.slice(0, 8)}…
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-dark-500 hover:text-brand-400 transition-colors">
            &larr; Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
