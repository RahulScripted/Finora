export type Period = "week" | "month" | "quarter" | "year";
export const PERIODS: Period[] = ["week", "month", "quarter", "year"];
export const AVG_UNIT: Record<Period, "day" | "week" | "month"> = {
  week: "day",
  month: "day",
  quarter: "week",
  year: "month",
};

export type SpendBucket = { label: string; tooltip: string; amount: number | null };
export type CategoryKey = "vendors" | "salaries" | "logistics" | "rent" | "other";
export type CategorySpend = { key: CategoryKey; amount: number; payments: number };

export type FundedInvoiceSpend = {
  invoiceNo: string;
  client: string;
  advancePct: number;
  funded: number;
  spent: number;
};

export type Repayment = {
  invoiceNo: string;
  client: string;
  amount: number;
  /** ISO date string */
  dueDate: string;
};

export type Payment = {
  id: string;
  payee: string;
  invoiceNo: string;
  amount: number;
  paidAt: string;
};

export type SpendSummary = {
  totalSpent: number;
  changePct: number;
  funded: number;
  fundedInvoiceCount: number;
  unspent: number;
  buckets: SpendBucket[];
  categories: CategorySpend[];
  invoices: FundedInvoiceSpend[];
  costOfFunds: { fees: number; interest: number };
  repayments: Repayment[];
  payments: Payment[];
};
