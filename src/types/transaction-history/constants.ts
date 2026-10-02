// ─── Transaction History domain model ───

/** Credit = money in, debit = money out. Drives the +/- sign and colour. */
export type TxnDirection = "credit" | "debit";

/** Settlement state shown as a coloured pill on each row. */
export type TxnStatus = "credited" | "debited" | "pending" | "failed";

/**
 * Business classification of a transaction. Each kind maps to an icon and a
 * soft background tint in `@utils/transaction`.
 */
export type TxnKind =
  | "drawdown"
  | "repayment"
  | "emi"
  | "fee"
  | "interest"
  | "charge";

/** Filter pills shown above the list. "all" is a passthrough. */
export type TxnFilter = "all" | "inflow" | "outflow" | "loans" | "charges" | "repayments";
export const TXN_FILTERS: readonly TxnFilter[] = [
  "all",
  "inflow",
  "outflow",
  "loans",
  "charges",
  "repayments",
] as const;

/** Sort options exposed through the "Most Recent" dropdown. */
export type TxnSort = "recent" | "oldest" | "amount_high" | "amount_low";
export const TXN_SORTS: readonly TxnSort[] = ["recent", "oldest", "amount_high", "amount_low"] as const;

/** A single charge/interest line shown on the detail screen. */
export type TxnCharge = { key: string; label: string; amount: number };

/**
 * A localizable x-axis label reference. The component resolves these against
 * i18n (`common.months` / `transaction_history.chart.*`) so axis text follows
 * the active language. `null` renders a blank tick.
 */
export type CashFlowLabel =
  | null
  | { type: "month"; index: number } // index into common.months (0=Jan)
  | { type: "weekday"; index: number } // 0=Mon … 6=Sun
  | { type: "time"; key: string } // transaction_history.chart.time.<key>
  | { type: "week"; n: number }; // "Week {{n}}"

/** One sampled point of inflow vs outflow for the Cash Flow line chart. */
export type CashFlowPoint = { label: CashFlowLabel; inflow: number; outflow: number };

/** Selectable time ranges shown below the Cash Flow chart. */
export type CashFlowRange = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y";
export const CASH_FLOW_RANGES: readonly CashFlowRange[] = ["1D", "1W", "1M", "3M", "6M", "1Y"] as const;

/** Summary header shown above the transaction list. */
export type TransactionSummary = {
  availableLimit: number;
  usedLimit: number;
  totalLimit: number;
  /** Dense, time-ordered cash-flow samples per selectable range. */
  cashFlow: Record<CashFlowRange, CashFlowPoint[]>;
};

export type Transaction = {
  id: string;
  kind: TxnKind;
  direction: TxnDirection;
  status: TxnStatus;
  title: string;
  /** Counterparty — financing partner, bank, etc. */
  partner: string;
  amount: number;
  /** ISO timestamp of when the transaction occurred. */
  occurredAt: string;
  utr: string;
  reference: string;

  // ── Optional detail-screen fields ──
  invoiceAmount?: number;
  financedAmount?: number;
  financingFee?: number;
  creditedTo?: string;
  charges?: TxnCharge[];
  remarks?: string;
};

/** Maps each filter pill to the transactions it should keep. */
export function matchesFilter(txn: Transaction, filter: TxnFilter): boolean {
  switch (filter) {
    case "all":
      return true;
    case "inflow":
      return txn.direction === "credit";
    case "outflow":
      return txn.direction === "debit";
    case "loans":
      return txn.kind === "drawdown";
    case "charges":
      return txn.kind === "fee" || txn.kind === "charge" || txn.kind === "interest";
    case "repayments":
      return txn.kind === "repayment" || txn.kind === "emi";
    default:
      return true;
  }
}

/** Case-insensitive search across UTR, reference, title and partner. */
export function matchesQuery(txn: Transaction, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    txn.utr.toLowerCase().includes(q) ||
    txn.reference.toLowerCase().includes(q) ||
    txn.title.toLowerCase().includes(q) ||
    txn.partner.toLowerCase().includes(q)
  );
}

/** A day-bucketed section of transactions for the grouped list. */
export type TxnDateGroup = { key: string; items: Transaction[] };

/** Groups transactions by calendar day, preserving the incoming order. */
export function groupByDay(list: Transaction[]): TxnDateGroup[] {
  const map = new Map<string, Transaction[]>();
  for (const txn of list) {
    const key = txn.occurredAt.slice(0, 10); // YYYY-MM-DD
    const bucket = map.get(key);
    if (bucket) bucket.push(txn);
    else map.set(key, [txn]);
  }
  return Array.from(map.entries()).map(([key, items]) => ({ key, items }));
}

/** Applies the active sort, returning a new array. */
export function sortTransactions(list: Transaction[], sort: TxnSort): Transaction[] {
  const copy = [...list];
  switch (sort) {
    case "oldest":
      return copy.sort((a, b) => (a.occurredAt < b.occurredAt ? -1 : 1));
    case "amount_high":
      return copy.sort((a, b) => b.amount - a.amount);
    case "amount_low":
      return copy.sort((a, b) => a.amount - b.amount);
    case "recent":
    default:
      return copy.sort((a, b) => (a.occurredAt < b.occurredAt ? 1 : -1));
  }
}
