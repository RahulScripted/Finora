import type {
  CashFlowLabel,
  CashFlowPoint,
  CashFlowRange,
  Transaction,
  TransactionSummary,
} from "@data-types/transaction-history/constants";

/** Returns an ISO timestamp `n` days from now (negative = in the past). */
const daysAgo = (n: number, hour = 10, min = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
};

/**
 * Deterministic sample transactions mirroring the design. Kept as a factory so
 * the hook can re-build on refetch without sharing mutable references.
 */
export function buildTransactions(): Transaction[] {
  return [
    {
      id: "txn-001",
      kind: "drawdown",
      direction: "credit",
      status: "credited",
      title: "Invoice Financing Drawdown",
      partner: "Finora Capital",
      amount: 500_000,
      occurredAt: daysAgo(2, 14, 15),
      utr: "123456789012",
      reference: "INV-001234",
      invoiceAmount: 555_556,
      financedAmount: 500_000,
      financingFee: 5_000,
      creditedTo: "Bank Account • 5021",
      charges: [
        { key: "margin_money", label: "Margin Money", amount: 50_000 },
        { key: "interest", label: "Interest (for 30 days)", amount: 12_500 },
        { key: "processing_fee", label: "Processing Fee", amount: 2_500 },
      ],
      remarks: "Invoice financing disbursement against approved invoice.",
    },
    {
      id: "txn-002",
      kind: "repayment",
      direction: "credit",
      status: "credited",
      title: "Repayment Received",
      partner: "HDFC Bank",
      amount: 120_000,
      occurredAt: daysAgo(4, 11, 24),
      utr: "987654321098",
      reference: "REP-008421",
      creditedTo: "Loan Account • 2290",
      remarks: "Repayment received against outstanding drawdown.",
    },
    {
      id: "txn-003",
      kind: "emi",
      direction: "debit",
      status: "debited",
      title: "EMI Deducted",
      partner: "Axis Bank (Auto-Debit)",
      amount: 45_230,
      occurredAt: daysAgo(8, 9, 30),
      utr: "567890123456",
      reference: "EMI-202609-451",
      charges: [
        { key: "principal", label: "Principal", amount: 38_900 },
        { key: "interest", label: "Interest", amount: 6_330 },
      ],
      remarks: "Scheduled EMI auto-debited via NACH mandate.",
    },
    {
      id: "txn-004",
      kind: "fee",
      direction: "debit",
      status: "debited",
      title: "Invoice Financing Fee",
      partner: "Finora Capital",
      amount: 5_000,
      occurredAt: daysAgo(10, 16, 18),
      utr: "345678901234",
      reference: "FEE-INV-00291",
      remarks: "One-time financing fee for invoice disbursement.",
    },
    {
      id: "txn-005",
      kind: "interest",
      direction: "debit",
      status: "debited",
      title: "Interest Charged",
      partner: "Finora Capital",
      amount: 12_500,
      occurredAt: daysAgo(14, 8, 5),
      utr: "456789012345",
      reference: "INT-202609-118",
      remarks: "Accrued interest for the billing cycle.",
    },
    {
      id: "txn-006",
      kind: "repayment",
      direction: "credit",
      status: "pending",
      title: "Repayment Received",
      partner: "ICICI Bank",
      amount: 85_000,
      occurredAt: daysAgo(16, 13, 42),
      utr: "678901234567",
      reference: "REP-008390",
      creditedTo: "Loan Account • 2290",
      remarks: "Repayment under settlement; awaiting bank confirmation.",
    },
    {
      id: "txn-007",
      kind: "charge",
      direction: "debit",
      status: "failed",
      title: "Late Payment Charge",
      partner: "Finora Capital",
      amount: 1_500,
      occurredAt: daysAgo(21, 10, 0),
      utr: "789012345678",
      reference: "CHG-LATE-0074",
      remarks: "Charge reversal — levy waived after review.",
    },
    {
      id: "txn-008",
      kind: "drawdown",
      direction: "credit",
      status: "credited",
      title: "Invoice Financing Drawdown",
      partner: "Finora Capital",
      amount: 300_000,
      occurredAt: daysAgo(27, 15, 10),
      utr: "890123456789",
      reference: "INV-001198",
      invoiceAmount: 333_334,
      financedAmount: 300_000,
      financingFee: 3_000,
      creditedTo: "Bank Account • 5021",
      charges: [
        { key: "margin_money", label: "Margin Money", amount: 30_000 },
        { key: "interest", label: "Interest (for 30 days)", amount: 7_500 },
        { key: "processing_fee", label: "Processing Fee", amount: 1_500 },
      ],
      remarks: "Invoice financing disbursement against approved invoice.",
    },
  ];
}

/**
 * A longer, deterministic feed built by repeating the base set with shifted
 * dates and ids — enough rows to exercise infinite-scroll pagination.
 */
export function buildAllTransactions(): Transaction[] {
  const base = buildTransactions();
  const out: Transaction[] = [];
  for (let cycle = 0; cycle < 6; cycle++) {
    base.forEach((txn, i) => {
      const offset = cycle * base.length + i;
      out.push({
        ...txn,
        id: cycle === 0 ? txn.id : `${txn.id}-${cycle}`,
        occurredAt: daysAgo(cycle * 30 + i * 2, 10 + (i % 8), (i * 7) % 60),
      });
    });
  }
  return out;
}

/** Deterministic pseudo-random in [0,1) from an integer seed. */
function rand(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Per-range chart config: point count, scale, and the localizable axis labels
 * (as references resolved against i18n in the component).
 */
const RANGE_CONFIG: Record<
  CashFlowRange,
  { count: number; labels: CashFlowLabel[]; base: number; amp: number }
> = {
  "1D": {
    count: 24,
    labels: [
      { type: "time", key: "morning" },
      { type: "time", key: "noon" },
      { type: "time", key: "afternoon" },
      { type: "time", key: "evening" },
    ],
    base: 9_000,
    amp: 5_000,
  },
  "1W": {
    count: 7,
    labels: [
      { type: "weekday", index: 0 },
      { type: "weekday", index: 2 },
      { type: "weekday", index: 4 },
      { type: "weekday", index: 6 },
    ],
    base: 60_000,
    amp: 30_000,
  },
  "1M": {
    count: 30,
    labels: [
      { type: "week", n: 1 },
      { type: "week", n: 2 },
      { type: "week", n: 3 },
      { type: "week", n: 4 },
    ],
    base: 110_000,
    amp: 60_000,
  },
  "3M": {
    count: 13,
    labels: [
      { type: "month", index: 6 },
      { type: "month", index: 7 },
      { type: "month", index: 8 },
    ],
    base: 120_000,
    amp: 55_000,
  },
  "6M": {
    count: 24,
    labels: [
      { type: "month", index: 3 },
      { type: "month", index: 5 },
      { type: "month", index: 7 },
      { type: "month", index: 8 },
    ],
    base: 420_000,
    amp: 160_000,
  },
  "1Y": {
    count: 12,
    labels: [
      { type: "month", index: 9 },
      { type: "month", index: 0 },
      { type: "month", index: 3 },
      { type: "month", index: 6 },
      { type: "month", index: 8 },
    ],
    base: 1_300_000,
    amp: 420_000,
  },
};

/** Builds a flowing inflow/outflow series for one range. */
function buildCashFlowSeries(range: CashFlowRange): CashFlowPoint[] {
  const { count, labels, base, amp } = RANGE_CONFIG[range];
  const seedBase = range.charCodeAt(0) + range.length * 7;
  const points: CashFlowPoint[] = [];
  const span = count - 1 || 1;
  for (let i = 0; i < count; i++) {
    // Smooth-ish wave + deterministic jitter so the line reads like a chart.
    const wave = Math.sin((i / count) * Math.PI * 2.4);
    const inflow = Math.round(base + amp * (0.5 + 0.5 * wave) + amp * 0.4 * (rand(seedBase + i) - 0.5));
    const outflow = Math.round(inflow * (0.55 + 0.2 * rand(seedBase + i + 100)));
    // Spread range labels evenly across the points; blanks elsewhere.
    let label: CashFlowLabel = null;
    labels.forEach((lab, li) => {
      const at = Math.round((li / (labels.length - 1 || 1)) * span);
      if (at === i) label = lab;
    });
    points.push({ label, inflow, outflow });
  }
  return points;
}

/**
 * Credit-limit + per-range cash-flow series shown above the list, drawn as a
 * flowing inflow/outflow line like a stock chart.
 */
export function buildTransactionSummary(): TransactionSummary {
  const ranges: CashFlowRange[] = ["1D", "1W", "1M", "3M", "6M", "1Y"];
  const cashFlow = ranges.reduce(
    (acc, r) => {
      acc[r] = buildCashFlowSeries(r);
      return acc;
    },
    {} as Record<CashFlowRange, CashFlowPoint[]>,
  );

  return {
    availableLimit: 250_000,
    usedLimit: 250_000,
    totalLimit: 500_000,
    cashFlow,
  };
}
