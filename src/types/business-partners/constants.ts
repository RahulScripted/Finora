/**
 * Business Partners / Anchors feature — types + display config.
 * Mock data lives in @mock/business-partners, served via @hooks/useBusinessPartners.
 */

export type PartnerStatus = "active" | "limit_near_full" | "limit_full" | "inactive";

export type MonthPoint = { month: string; amount: number };

export type Invoice = {
  invoiceNo: string;
  advancePct: number;
  amount: number;
  /** ISO date */
  dueDate: string;
};

export type DrawdownEvent = {
  id: string;
  invoiceNo: string;
  type: "drawdown" | "repayment";
  amount: number;
  /** ISO date */
  date: string;
  status: "pending" | "completed";
};

export type Partner = {
  id: string;
  name: string;
  initials: string;
  /** Hex — logo tile + its slice in the exposure donut. Keep distinct across partners. */
  logoColor: string;
  industry: string;
  /** ISO date */
  partnerSince: string;
  status: PartnerStatus;
  creditLimit: number;
  drawnDown: number;
  interestPaid: number;
  openInvoiceCount: number;
  monthlyDrawdown: MonthPoint[];
  /** Present on the detail screen's partner, optional on list-only partners. */
  monthlyRepayment?: MonthPoint[];
  monthlyInterest?: MonthPoint[];
  invoices?: Invoice[];
  drawdownHistory?: DrawdownEvent[];
};

export type BusinessPartnersData = {
  summary: { totalDrawdown: number; totalInterestPaid: number; partnerCount: number };
  partners: Partner[];
};

/* ------------------------------------------------------------------ */
/* Status display config                                               */
/* ------------------------------------------------------------------ */

export type Tone = "success" | "warning" | "danger" | "neutral";

export const STATUS_CONFIG: Record<PartnerStatus, { labelKey: string; tone: Tone }> = {
  active: { labelKey: "business_partners.status_active", tone: "success" },
  limit_near_full: { labelKey: "business_partners.status_near_full", tone: "warning" },
  limit_full: { labelKey: "business_partners.status_full", tone: "danger" },
  inactive: { labelKey: "business_partners.status_inactive", tone: "neutral" },
};

/** Utilization ring / bar color by how much of the credit limit is used. */
export const UTILIZATION_ZONES = [
  { max: 50, tone: "success" as const },
  { max: 80, tone: "warning" as const },
  { max: 101, tone: "danger" as const },
];

export function utilizationTone(pct: number): "success" | "warning" | "danger" {
  return UTILIZATION_ZONES.find((z) => pct < z.max)?.tone ?? "danger";
}

export function utilizationPct(
  partner: Pick<Partner, "drawnDown" | "creditLimit">,
): number {
  return partner.creditLimit > 0
    ? Math.round((partner.drawnDown / partner.creditLimit) * 100)
    : 0;
}

/* ------------------------------------------------------------------ */
/* Chart palette — assign in order so colors stay stable as partners   */
/* are added or removed from the exposure donut / bar chart.           */
/* ------------------------------------------------------------------ */

export const CHART_PALETTE = ["#7C3AED", "#0B5FFF", "#12805C", "#F2B36B", "#D9460F", "#8C93A8"];

export function paletteColor(index: number): string {
  return CHART_PALETTE[index % CHART_PALETTE.length];
}

/* ------------------------------------------------------------------ */
/* Derived helpers used by both screens                                */
/* ------------------------------------------------------------------ */

export type ExposureSlice = { partner: Partner; pct: number; color: string };

/** Share of total drawdown per partner, sorted largest-first, colored by the palette. */
export function exposureShare(partners: Partner[]): ExposureSlice[] {
  const total = partners.reduce((sum, p) => sum + p.drawnDown, 0) || 1;
  return [...partners]
    .sort((a, b) => b.drawnDown - a.drawnDown)
    .map((p, i) => ({
      partner: p,
      pct: Math.round((p.drawnDown / total) * 100),
      color: p.logoColor || paletteColor(i),
    }));
}

export function totalInterestForPartner(partner: Partner): number {
  return partner.monthlyInterest?.reduce((sum, m) => sum + m.amount, 0) ?? partner.interestPaid;
}

/** Average monthly interest rate, e.g. "avg rate 1.4%/mo". Needs both series present. */
export function averageMonthlyRatePct(partner: Partner): number | null {
  if (!partner.monthlyInterest || !partner.monthlyDrawdown?.length) return null;
  const totalInterest = partner.monthlyInterest.reduce((s, m) => s + m.amount, 0);
  const avgDrawdown =
    partner.monthlyDrawdown.reduce((s, m) => s + m.amount, 0) / partner.monthlyDrawdown.length;
  if (avgDrawdown === 0) return null;
  return Math.round((totalInterest / partner.monthlyInterest.length / avgDrawdown) * 1000) / 10;
}
