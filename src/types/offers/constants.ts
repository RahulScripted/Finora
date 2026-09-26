/* ------------------------------------------------------------------ */
/* Offers — domain types                                              */
/* ------------------------------------------------------------------ */

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
