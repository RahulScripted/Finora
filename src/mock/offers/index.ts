import type {
  Offer,
  OfferSectionCard,
  TenureOption,
  ApplicationStatusStep,
  OfferRateProfile,
} from "@data-types/offers/constants";

/* ------------------------------------------------------------------ */
/* Flexible "offer section" entry cards (Offers tab landing)          */
/* Add / reorder cards here — the UI renders whatever this returns.   */
/* Icons are placeholders; drop an `image` in later to swap them out. */
/* ------------------------------------------------------------------ */
export const OFFER_SECTIONS_MOCK: OfferSectionCard[] = [
  {
    key: "loan_offers",
    icon: "sale",
    tint: "#16A477",
    image: require("@assets/illustration/offer/loan-offers.png"),
    route: "offer-list",
  },
  {
    key: "track_applications",
    icon: "progress-clock",
    tint: "#3787D8",
    image: require("@assets/illustration/offer/track-application.png"),
    route: "offer-applications",
  },
];

/* ------------------------------------------------------------------ */
/* Loan products shown on the offers list                             */
/* ------------------------------------------------------------------ */
export const OFFERS_MOCK: Offer[] = [
  {
    id: "business_loan",
    category: "business_loan",
    icon: "office-building-outline",
    image: require("@assets/illustration/offer/buisness-loans.png"),
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
    featured: true,
  },
  {
    id: "overdraft",
    category: "business_loan",
    icon: "sync",
    image: require("@assets/illustration/offer/overdraft.png"),
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
    featured: true,
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
  {
    id: "FIN-OV-2026-00312",
    offerId: "overdraft",
    lender: "HDFC Bank",
    lenderInitials: "HB",
    amount: 1_500_000,
    tenureDays: 0,
    status: "approved",
    appliedOn: "08 Sep 2026",
    appliedAt: "08 Sep 2026, 09:10 AM",
    processingTime: "1 – 2 Business Days",
    steps: [
      { key: "submitted", state: "done", timestamp: "08 Sep 2026, 09:10 AM" },
      { key: "document_verification", state: "done", timestamp: "09 Sep 2026, 12:40 PM" },
      { key: "credit_assessment", state: "done", timestamp: "10 Sep 2026, 03:05 PM" },
      { key: "approval", state: "done", timestamp: "11 Sep 2026, 10:00 AM" },
      { key: "disbursal", state: "pending", timestamp: "" },
    ],
  },
  {
    id: "FIN-SC-2026-00187",
    offerId: "supply_chain",
    lender: "ICICI Bank",
    lenderInitials: "IC",
    amount: 750_000,
    tenureDays: 180,
    status: "under_review",
    appliedOn: "03 Sep 2026",
    appliedAt: "03 Sep 2026, 02:20 PM",
    processingTime: "2 – 3 Business Days",
    steps: [
      { key: "submitted", state: "done", timestamp: "03 Sep 2026, 02:20 PM" },
      { key: "document_verification", state: "current", timestamp: "04 Sep 2026, 11:00 AM" },
      { key: "credit_assessment", state: "pending", timestamp: "" },
      { key: "approval", state: "pending", timestamp: "" },
      { key: "disbursal", state: "pending", timestamp: "" },
    ],
  },
  {
    id: "FIN-IN-2026-00099",
    offerId: "invoice_discounting",
    lender: "Axis Bank",
    lenderInitials: "AX",
    amount: 1_200_000,
    tenureDays: 90,
    status: "rejected",
    appliedOn: "28 Aug 2026",
    appliedAt: "28 Aug 2026, 04:45 PM",
    processingTime: "2 – 3 Business Days",
    steps: [
      { key: "submitted", state: "done", timestamp: "28 Aug 2026, 04:45 PM" },
      { key: "document_verification", state: "done", timestamp: "29 Aug 2026, 01:30 PM" },
      { key: "credit_assessment", state: "done", timestamp: "30 Aug 2026, 05:10 PM" },
      { key: "approval", state: "pending", timestamp: "" },
      { key: "disbursal", state: "pending", timestamp: "" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Compare & Calculate — baseline rate / fee per product             */
/* Pre-fills the calculator; the user can override either value.      */
/* ------------------------------------------------------------------ */
export const OFFER_RATE_PROFILES_MOCK: Record<string, OfferRateProfile> = {
  business_loan: { id: "business_loan", annualRate: 11.5, feePct: 2 },
  overdraft: { id: "overdraft", annualRate: 12.5, feePct: 1.5 },
  supply_chain: { id: "supply_chain", annualRate: 9.5, feePct: 1 },
  purchase_order: { id: "purchase_order", annualRate: 13, feePct: 1.5 },
  term_loan: { id: "term_loan", annualRate: 10.25, feePct: 2.5 },
  invoice_discounting: { id: "invoice_discounting", annualRate: 10.8, feePct: 1 },
};

export function rateProfileFor(offerId: string): OfferRateProfile {
  return (
    OFFER_RATE_PROFILES_MOCK[offerId] ?? {
      id: offerId as OfferRateProfile["id"],
      annualRate: 12,
      feePct: 2,
    }
  );
}
