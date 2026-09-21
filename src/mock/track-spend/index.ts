import type {
  CategoryKey,
  Period,
  SpendBucket,
  SpendSummary,
} from "@data-types/track-spend/constants";
import { getMonthsShort } from "@utils/format-locals";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const PERIOD_TOTAL: Record<Period, number> = {
  week: 104_200,
  month: 428_650,
  quarter: 1_286_400,
  year: 4_905_000,
};

const PERIOD_CHANGE: Record<Period, number> = { week: 4, month: -12, quarter: -3, year: 9 };

const CATEGORY_MIX: { key: CategoryKey; pct: number; payments: number }[] = [
  { key: "vendors", pct: 42, payments: 14 },
  { key: "salaries", pct: 26, payments: 1 },
  { key: "logistics", pct: 14, payments: 22 },
  { key: "rent", pct: 10, payments: 3 },
  { key: "other", pct: 8, payments: 9 },
];

const RAW_MONTH = [15, 23, 12, 27, 20, 9, 33, 22, 17, 29, 14, 26, 38, 19, 12, 31, 21, 26, 16, 23, 35];
const RAW_WEEK = [42, 31, 58, 27, 64, 39, 18];
const RAW_QUARTER = [82, 95, 71, 110, 88, 120, 76, 101, 93, 84, 118, 97, 105];
const RAW_YEAR = [310, 290, 350, 420, 380, 410, 455, 398, 428];

/** Scales `values` so they add up to exactly `total`. */
function normalize(values: number[], total: number): number[] {
  const raw = values.reduce((a, b) => a + b, 0);
  const scaled = values.map((v) => Math.round((v * total) / raw));
  scaled[scaled.length - 1] += total - scaled.reduce((a, b) => a + b, 0);
  return scaled;
}

function makeBuckets(period: Period, total: number): SpendBucket[] {
  const fill = (labels: { label: string; tooltip: string }[], raw: number[]): SpendBucket[] => {
    const scaled = normalize(raw, total);
    return labels.map((l, i) => ({ ...l, amount: i < scaled.length ? scaled[i] : null }));
  };

  switch (period) {
    case "week":
      return fill(WEEKDAYS.map((d) => ({ label: d, tooltip: d })), RAW_WEEK);
    case "quarter":
      return fill(
        Array.from({ length: 13 }, (_, i) => ({ label: String(i + 1), tooltip: `Week ${i + 1}` })),
        RAW_QUARTER,
      );
    case "year":
      return fill(getMonthsShort().map((m) => ({ label: m, tooltip: m })), RAW_YEAR);
    default:
      return fill(
        Array.from({ length: 30 }, (_, i) => ({ label: String(i + 1), tooltip: `${i + 1} Sep` })),
        RAW_MONTH,
      );
  }
}

const inDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
};

/** Builds a deterministic sample summary for the given period. */
export function buildSpendSummary(period: Period): SpendSummary {
  const total = PERIOD_TOTAL[period];
  const amounts = CATEGORY_MIX.map((c) => Math.round((total * c.pct) / 100));
  amounts[amounts.length - 1] += total - amounts.reduce((a, b) => a + b, 0);

  const funded = Math.round(total * (570_000 / 428_650));

  return {
    totalSpent: total,
    changePct: PERIOD_CHANGE[period],
    funded,
    fundedInvoiceCount: 3,
    unspent: funded - total,
    buckets: makeBuckets(period, total),
    categories: CATEGORY_MIX.map((c, i) => ({ key: c.key, amount: amounts[i], payments: c.payments })),
    invoices: [
      { invoiceNo: "INV-2041", client: "Sharma Retail", advancePct: 90, funded: 180_000, spent: 152_000 },
      { invoiceNo: "INV-2038", client: "Kapoor Foods", advancePct: 90, funded: 270_000, spent: 188_650 },
      { invoiceNo: "INV-2029", client: "Om Sai Traders", advancePct: 80, funded: 120_000, spent: 88_000 },
    ],
    costOfFunds: {
      fees: Math.round((total * 4_200) / 428_650),
      interest: Math.round((total * 2_220) / 428_650),
    },
    repayments: [
      { invoiceNo: "INV-2038", client: "Kapoor Foods", amount: 270_000, dueDate: inDays(7) },
      { invoiceNo: "INV-2029", client: "Om Sai Traders", amount: 120_000, dueDate: inDays(9) },
      { invoiceNo: "INV-2041", client: "Sharma Retail", amount: 180_000, dueDate: inDays(21) },
    ],
    payments: [
      { id: "p1", payee: "Sharma Textiles", invoiceNo: "INV-2041", amount: 64_000, paidAt: inDays(-1) },
      { id: "p2", payee: "Blue Dart", invoiceNo: "INV-2038", amount: 8_450, paidAt: inDays(-2) },
      { id: "p3", payee: "Kapoor Packaging", invoiceNo: "INV-2038", amount: 42_300, paidAt: inDays(-4) },
    ],
  };
}
