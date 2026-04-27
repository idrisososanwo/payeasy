export type NetworkStatus = "healthy" | "degraded" | "down";

export interface NetworkHealth {
  status: NetworkStatus;
  checkedAt: Date;
}

const HORIZON_URL = "https://horizon-testnet.stellar.org";
const TIMEOUT_MS = 6000;

export async function getNetworkHealth(): Promise<NetworkHealth> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(HORIZON_URL, { signal: controller.signal });
    clearTimeout(timer);

    if (!res.ok) {
      return { status: "degraded", checkedAt: new Date() };
    }

    const data = (await res.json()) as Record<string, unknown>;
    const ingestLatest = data.ingest_latest_ledger as number | undefined;

    // If the ledger sequence is stale or missing, treat as degraded.
    const status: NetworkStatus =
      typeof ingestLatest === "number" && ingestLatest > 0
        ? "healthy"
        : "degraded";

    return { status, checkedAt: new Date() };
  } catch {
    clearTimeout(timer);
    return { status: "down", checkedAt: new Date() };
  }
}
