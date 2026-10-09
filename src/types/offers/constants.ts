/* ------------------------------------------------------------------ */
/* Offers — domain types                                              */
/* ------------------------------------------------------------------ */

/**
 * A single entry card in the flexible "offer section" on the Offers tab.
 * Fully data-driven so cards can be added / reordered without touching UI.
 * Uses an icon for now; swap `icon` for `image` later without breaking types.
 */
export type OfferSectionKey = "loan_offers" | "track_applications";

export type OfferSectionCard = {
  key: OfferSectionKey;
  /** MaterialCommunityIcons name — placeholder until images are supplied. */
  icon: string;
  /** Optional image asset (takes priority over `icon` once provided). */
  image?: number;
  /** Hex accent used behind the icon / image. */
  tint: string;
  /** Route this card navigates to on press. */
  route: string;
};

/** Top-level filter categories on the offers list screen. */
export type OfferCategory = "all" | "invoice" | "business_loan" | "others";

/** Stable identifier for every loan product we surface. */
export type OfferId =
  | "business_loan"
  | "overdraft"
  | "supply_chain"
  | "purchase_order"
  | "term_loan"
  | "invoice_discounting";

/**
 * The kind of primary action a product offers. This decides which
 * flow the CTA launches:
 *  - `apply`   → full multi-step application (amount → tenure → cost → done)
 *  - `setup`   → single confirmation (e.g. set up an overdraft limit)
 *  - `upload`  → placeholder document-upload flow
 *  - `partners`→ view linked anchor partners
 */
export type OfferActionKind = "apply" | "setup" | "upload" | "partners";

/** A single "how it works" step, shown as a numbered list. */
export type OfferStep = {
  /** i18n key under `offers.products.<id>.steps` */
  key: string;
};

/** Two compact stat chips shown at the top of the detail screen. */
export type OfferHighlight = {
  /** i18n key for the small caption, e.g. "Up to" */
  labelKey: string;
  /** Already-formatted value, e.g. "₹2 Cr" or "11.5%/yr" */
  value: string;
};

export type Offer = {
  id: OfferId;
  category: Exclude<OfferCategory, "all">;
  /** MaterialCommunityIcons name for the product icon. */
  icon: string;
  /** Optional illustration blended into the right edge of the featured card. */
  image?: number;
  /** Hex accent used behind the icon and on chips. */
  tint: string;
  /** Short headline shown on the list card, e.g. "Up to ₹2 Cr". */
  ceiling: string;
  /** What the CTA does. */
  action: OfferActionKind;
  /** Two highlight chips on the detail screen. */
  highlights: [OfferHighlight, OfferHighlight];
  /** Ordered "how it works" steps. */
  steps: OfferStep[];
  /** i18n key for the fees & charges footnote. */
  feesKey: string;
  /** Application amount bounds (only relevant for `apply` products). */
  minAmount: number;
  maxAmount: number;
  /** Advance percentage disbursed up-front (invoice/PO products). */
  advancePct?: number;
  /** Surfaced in the "Featured offers" strip on the Offers tab. */
  featured?: boolean;
};

/* --------------------------- application ---------------------------- */

/** A selectable repayment tenure with its monthly rate. */
export type TenureOption = {
  days: number;
  /** Monthly rate as a percentage, e.g. 1.1 → "1.1%/mo". */
  monthlyRate: number;
  /** Optional i18n note key, e.g. "matches your invoice due date". */
  noteKey?: string;
  /** Marks the pre-selected / recommended option. */
  recommended?: boolean;
};

/** The steps of the apply flow, used for the progress bar. */
export type ApplyStep = "amount" | "tenure" | "cost" | "done";

/** Computed cost breakdown for a chosen amount + tenure. */
export type CostBreakdown = {
  principal: number;
  tenureDays: number;
  monthlyRate: number;
  interest: number;
  processingFee: number;
  gstOnFee: number;
  stampDuty: number;
  /** principal − fees − gst − stamp (what lands in the account). */
  disbursed: number;
  /** principal + interest (what must be repaid). */
  totalRepayable: number;
};

/** Progress of a submitted application, shown on the confirmation screen. */
export type ApplicationStatusStep = {
  key: "received" | "review" | "disbursed";
  /** MaterialCommunityIcons name. */
  icon: string;
  /** i18n key for the trailing timestamp, e.g. "just_now". */
  timeKey: string;
  done: boolean;
};

/* --------------------------- tracker -------------------------------- */

/** State of a single milestone on the application tracker timeline. */
export type TrackerStepState = "done" | "current" | "pending";

export type TrackerStepKey =
  | "submitted"
  | "document_verification"
  | "credit_assessment"
  | "approval"
  | "disbursal";

export type TrackerStep = {
  key: TrackerStepKey;
  state: TrackerStepState;
  /** Formatted timestamp, or empty when still pending. */
  timestamp: string;
};

export type ApplicationStatus = "under_review" | "approved" | "rejected" | "disbursed";

/** A submitted loan application, used by the tracker + success screens. */
export type LoanApplication = {
  /** Human-facing reference, e.g. "FIN-BL-2026-0058". */
  id: string;
  offerId: OfferId;
  /** Lender shown on the tracker card. */
  lender: string;
  /** Two-letter avatar seed, e.g. "FC". */
  lenderInitials: string;
  amount: number;
  tenureDays: number;
  status: ApplicationStatus;
  /** Formatted application date, e.g. "18 Sep 2026". */
  appliedOn: string;
  /** Formatted date + time, e.g. "18 Sep 2026, 10:24 AM". */
  appliedAt: string;
  /** e.g. "2 – 3 Business Days". */
  processingTime: string;
  steps: TrackerStep[];
};

/* --------------------------- helpers -------------------------------- */

/** Ordered list used to render the apply-flow progress bar. */
export const APPLY_STEPS: ApplyStep[] = ["amount", "tenure", "cost", "done"];

/**
 * Compute a full cost breakdown for a loan/advance.
 * Interest is pro-rated over the tenure in days from the monthly rate.
 */
export function computeCost(
  principal: number,
  tenureDays: number,
  monthlyRate: number,
  opts: { processingPct?: number; gstPct?: number; stampDuty?: number } = {},
): CostBreakdown {
  const { processingPct = 1, gstPct = 18, stampDuty = 100 } = opts;

  const interest = Math.round((principal * (monthlyRate / 100) * tenureDays) / 30);
  const processingFee = Math.round(principal * (processingPct / 100));
  const gstOnFee = Math.round(processingFee * (gstPct / 100));

  const disbursed = principal - processingFee - gstOnFee - stampDuty;
  const totalRepayable = principal + interest;

  return {
    principal,
    tenureDays,
    monthlyRate,
    interest,
    processingFee,
    gstOnFee,
    stampDuty,
    disbursed,
    totalRepayable,
  };
}

/** Compact rupee formatter, e.g. 270000 → "₹2,70,000". */
export function formatRupees(value: number): string {
  return "₹" + value.toLocaleString("en-IN");
}

/* ------------------------------------------------------------------ */
/* Compare & Calculate — domain types + finance maths                 */
/* ------------------------------------------------------------------ */

/** The two comparison slots. */
export type CompareSlot = "A" | "B";

/** Baseline rate/fee for an offer, pre-filled into the calculator. */
export type OfferRateProfile = {
  id: OfferId;
  /** Annual interest rate as a percentage, e.g. 11.5. */
  annualRate: number;
  /** Processing fee as a percentage of principal, e.g. 2. */
  feePct: number;
};

/** User-editable inputs for one side of the comparison. */
export type CompareInput = {
  annualRate: number;
  feePct: number;
};

/** Shared loan parameters applied to both offers. */
export type CompareParams = {
  principal: number;
  /** Tenure in months. */
  months: number;
};

/** Full computed result for a single offer. */
export type CompareResult = {
  /** Equated monthly instalment. */
  emi: number;
  annualRate: number;
  /** Processing fee + GST on the fee. */
  feePlusGst: number;
  processingFee: number;
  gstOnFee: number;
  /** Total interest paid across the tenure. */
  totalInterest: number;
  /** principal + interest + fee + gst. */
  totalPayable: number;
  /** Interest grouped into four quarters of the tenure. */
  interestByQuarter: number[];
  /** Split of total payable: principal / interest / fees. */
  split: { principal: number; interest: number; fees: number };
};

const GST_ON_FEE_PCT = 18;

/**
 * Standard reducing-balance EMI.
 * EMI = P·r·(1+r)^n / ((1+r)^n − 1), where r is the monthly rate.
 */
export function computeEmi(principal: number, annualRate: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRate / 12 / 100;
  if (r === 0) return Math.round(principal / months);
  const pow = Math.pow(1 + r, months);
  return Math.round((principal * r * pow) / (pow - 1));
}

/**
 * Full comparison maths for one offer. Interest is derived from the
 * amortised schedule so it matches the EMI exactly, then bucketed into
 * four quarters for the chart.
 */
export function computeCompare(input: CompareInput, params: CompareParams): CompareResult {
  const { principal, months } = params;
  const { annualRate, feePct } = input;

  const emi = computeEmi(principal, annualRate, months);
  const r = annualRate / 12 / 100;

  // Walk the amortisation schedule to get per-month interest.
  const monthlyInterest: number[] = [];
  let balance = principal;
  for (let m = 0; m < months; m += 1) {
    const interest = balance * r;
    const principalPaid = emi - interest;
    balance = Math.max(0, balance - principalPaid);
    monthlyInterest.push(interest);
  }

  const totalInterest = Math.round(monthlyInterest.reduce((a, b) => a + b, 0));
  const processingFee = Math.round(principal * (feePct / 100));
  const gstOnFee = Math.round(processingFee * (GST_ON_FEE_PCT / 100));
  const feePlusGst = processingFee + gstOnFee;
  const totalPayable = principal + totalInterest + feePlusGst;

  // Bucket monthly interest into four even quarters of the tenure.
  const interestByQuarter = [0, 0, 0, 0];
  const perQuarter = months / 4;
  monthlyInterest.forEach((val, i) => {
    const q = Math.min(3, Math.floor(i / perQuarter));
    interestByQuarter[q] += val;
  });

  return {
    emi,
    annualRate,
    feePlusGst,
    processingFee,
    gstOnFee,
    totalInterest,
    totalPayable,
    interestByQuarter: interestByQuarter.map((v) => Math.round(v)),
    split: { principal, interest: totalInterest, fees: feePlusGst },
  };
}

/** Compact lakh/crore formatter for large totals, e.g. 1630000 → "₹16.30 L". */
export function formatCompact(value: number): string {
  if (value >= 1_00_00_000) return "₹" + (value / 1_00_00_000).toFixed(2) + " Cr";
  if (value >= 1_00_000) return "₹" + (value / 1_00_000).toFixed(2) + " L";
  return "₹" + value.toLocaleString("en-IN");
}
