import type { Offer, TenureOption, ApplicationStatusStep } from "@data-types/offers/constants";

/* ------------------------------------------------------------------ */
/* Loan products shown on the offers list                             */
/* ------------------------------------------------------------------ */
export const OFFERS_MOCK: Offer[] = [
  {
    id: "business_loan",
    category: "business_loan",
    icon: "office-building-outline",
    tint: "#7C5CFC",
    ceiling: "Up to ₹2 Cr",
    action: "apply",
    highlights: [
      { labelKey: "offers.highlight.up_to", value: "₹2 Cr" },
      { labelKey: "offers.highlight.rate_from", value: "11.5%/yr" },
    ],
    steps: [{ key: "choose_amount" }, { key: "pick_tenure_36" }, { key: "see_emi" }],
    feesKey: "offers.products.business_loan.fees",
    minAmount: 100_000,
    maxAmount: 20_000_000,
  },
  {
    id: "overdraft",
    category: "business_loan",
    icon: "sync",
    tint: "#3787D8",
    ceiling: "Up to ₹1 Cr",
    action: "setup",
    highlights: [
      { labelKey: "offers.highlight.up_to", value: "₹1 Cr" },
      { labelKey: "offers.highlight.interest_from", value: "1.3%/mo" },
    ],
    steps: [{ key: "set_limit" }, { key: "draw_repay" }, { key: "interest_on_used" }],
    feesKey: "offers.products.overdraft.fees",
    minAmount: 50_000,
    maxAmount: 10_000_000,
  },
  {
    id: "supply_chain",
    category: "others",
    icon: "truck-outline",
    tint: "#E99A24",
    ceiling: "Up to ₹75 L",
    action: "partners",
    highlights: [
      { labelKey: "offers.highlight.up_to", value: "₹75 L" },
      { labelKey: "offers.highlight.rate_from", value: "1.0%/mo" },
    ],
    steps: [{ key: "choose_anchor" }, { key: "select_invoice" }, { key: "anchor_repays" }],
    feesKey: "offers.products.supply_chain.fees",
    minAmount: 100_000,
    maxAmount: 7_500_000,
  },
  {
    id: "purchase_order",
    category: "others",
    icon: "clipboard-check-outline",
    tint: "#16A477",
    ceiling: "Up to ₹1 Cr",
    action: "upload",
    highlights: [
      { labelKey: "offers.highlight.up_to", value: "₹1 Cr" },
      { labelKey: "offers.highlight.advance_up_to", value: "75%" },
    ],
    steps: [{ key: "upload_po" }, { key: "verify_buyer" }, { key: "funds_released" }],
    feesKey: "offers.products.purchase_order.fees",
    minAmount: 100_000,
    maxAmount: 10_000_000,
    advancePct: 75,
  },
  {
    id: "term_loan",
    category: "business_loan",
    icon: "calendar-clock",
    tint: "#3787D8",
    ceiling: "Up to ₹2 Cr",
    action: "apply",
    highlights: [
      { labelKey: "offers.highlight.up_to", value: "₹2 Cr" },
      { labelKey: "offers.highlight.rate_from", value: "12%/yr" },
    ],
    steps: [{ key: "choose_amount" }, { key: "pick_tenure_60" }, { key: "see_emi" }],
    feesKey: "offers.products.term_loan.fees",
    minAmount: 100_000,
    maxAmount: 20_000_000,
  },
  {
    id: "invoice_discounting",
    category: "invoice",
    icon: "file-document-outline",
    tint: "#FF6B45",
    ceiling: "Up to 90%",
    action: "apply",
    highlights: [
      { labelKey: "offers.highlight.advance_up_to", value: "90%" },
      { labelKey: "offers.highlight.rate_from", value: "1.1%/mo" },
    ],
    steps: [{ key: "choose_amount" }, { key: "pick_tenure" }, { key: "review_confirm" }],
    feesKey: "offers.products.invoice_discounting.fees",
    minAmount: 50_000,
    maxAmount: 300_000,
    advancePct: 90,
  },
];

/* ------------------------------------------------------------------ */
/* Tenure options offered during the apply flow                       */
/* ------------------------------------------------------------------ */
export const TENURE_OPTIONS_MOCK: Record<string, TenureOption[]> = {
  invoice_discounting: [
    { days: 30, monthlyRate: 1.3 },
    { days: 60, monthlyRate: 1.1, noteKey: "matches_due_date", recommended: true },
    { days: 90, monthlyRate: 1.1 },
    { days: 120, monthlyRate: 1.15 },
  ],
  default: [
    { days: 90, monthlyRate: 1.2 },
    { days: 180, monthlyRate: 1.1, recommended: true },
    { days: 270, monthlyRate: 1.05 },
    { days: 360, monthlyRate: 1.0 },
  ],
};

export function tenureOptionsFor(offerId: string): TenureOption[] {
  return TENURE_OPTIONS_MOCK[offerId] ?? TENURE_OPTIONS_MOCK.default;
}

/* ------------------------------------------------------------------ */
/* Application status timeline (confirmation screen)                  */
/* ------------------------------------------------------------------ */
export const APPLICATION_STATUS_MOCK: ApplicationStatusStep[] = [
  { key: "received", icon: "check", timeKey: "just_now", done: true },
  { key: "review", icon: "clock-outline", timeKey: "in_2_hours", done: false },
  { key: "disbursed", icon: "bank-outline", timeKey: "", done: false },
];

import type { LoanApplication } from "@data-types/offers/constants";

/* ------------------------------------------------------------------ */
/* Submitted loan applications (tracker / success screens)            */
/* ------------------------------------------------------------------ */
export const LOAN_APPLICATIONS_MOCK: LoanApplication[] = [
  {
    id: "FIN-BL-2026-00458",
    offerId: "business_loan",
    lender: "Bajaj Finserv",
    lenderInitials: "FC",
    amount: 1_500_000,
    tenureDays: 360,
    status: "under_review",
    appliedOn: "18 Sep 2026",
    appliedAt: "18 Sep 2026, 10:24 AM",
    processingTime: "2 – 3 Business Days",
    steps: [
      { key: "submitted", state: "done", timestamp: "18 Sep 2026, 10:24 AM" },
      { key: "document_verification", state: "done", timestamp: "19 Sep 2026, 02:15 PM" },
      { key: "credit_assessment", state: "current", timestamp: "20 Sep 2026, 11:30 AM" },
      { key: "approval", state: "pending", timestamp: "" },
      { key: "disbursal", state: "pending", timestamp: "" },
    ],
  },
];
