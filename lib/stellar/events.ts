export type ContractEventType =
  | "escrow_created"
  | "contribution"
  | "released"
  | "dispute_raised"
  | "refunded"
  | "unknown";

export interface ContractEvent {
  id: string;
  type: ContractEventType;
  contractId: string;
  ledger: number;
  createdAt: string;
  txHash: string;
  data: Record<string, string | number | boolean>;
}

interface RpcEventValue {
  type: string;
  value: string;
}

interface RpcEvent {
  id: string;
  type: string;
  ledger: number;
  ledgerClosedAt: string;
  contractId: string;
  topic: RpcEventValue[];
  value: RpcEventValue;
  txHash: string;
  inSuccessfulContractCall: boolean;
}

interface RpcResponse {
  result?: {
    events: RpcEvent[];
  };
  error?: { message: string };
}

const SOROBAN_RPC = "https://soroban-testnet.stellar.org";

function parseEventType(topic: RpcEventValue[]): ContractEventType {
  const sym = topic.find((t) => t.type === "sSym" || t.type === "sym");
  if (!sym) return "unknown";
  const v = sym.value.toLowerCase();
  if (v.includes("create")) return "escrow_created";
  if (v.includes("contribut")) return "contribution";
  if (v.includes("release")) return "released";
  if (v.includes("dispute")) return "dispute_raised";
  if (v.includes("refund")) return "refunded";
  return "unknown";
}

export async function getContractEvents(
  contractId: string,
  startLedger = 0
): Promise<ContractEvent[]> {
  const body = {
    jsonrpc: "2.0",
    id: 1,
    method: "getEvents",
    params: {
      startLedger,
      filters: [
        {
          type: "contract",
          contractIds: [contractId],
        },
      ],
      pagination: { limit: 100 },
    },
  };

  try {
    const res = await fetch(SOROBAN_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json: RpcResponse = await res.json();

    if (json.error) {
      console.error("getContractEvents RPC error:", json.error.message);
      return [];
    }

    return (json.result?.events ?? []).map((e) => ({
      id: e.id,
      type: parseEventType(e.topic),
      contractId: e.contractId,
      ledger: e.ledger,
      createdAt: e.ledgerClosedAt,
      txHash: e.txHash,
      data: {},
    }));
  } catch (err) {
    console.error("getContractEvents fetch error:", err);
    return [];
  }
}
