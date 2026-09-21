export type BandKey = "poor" | "fair" | "good" | "very_good" | "excellent";

/** A band runs from `from` up to the next band's `from` (last one runs to `max`). */
export type ScoreBand = { key: BandKey; from: number };

export type FactorKey =
  | "payment_history"
  | "utilization"
  | "credit_age"
  | "inquiries"
  | "credit_mix";

export type FactorStatus = "great" | "good" | "fair" | "poor";
export type Impact = "high" | "medium" | "low";

export type CreditFactor = {
  key: FactorKey;
  status: FactorStatus;
  impact: Impact;
  /** Display value, e.g. "100% on time" */
  value: string;
};

export type ScorePoint = { label: string; score: number };

export type TipId =
  | "keep_utilization_low"
  | "repay_early"
  | "pause_applications";

export type Tip = {
  id: TipId;
  /** MaterialCommunityIcons name */
  icon: string;
  /** Estimated score gain */
  points: number;
};

export type CreditSummary = {
  score: number;
  min: number;
  max: number;
  bands: ScoreBand[];
  /** Points gained or lost since previous report */
  changeSinceLast: number;
  /** ISO date string */
  updatedAt: string;
  bureau: string;
  /** Oldest first. Screen shows last 6 or all 12. */
  history: ScorePoint[];
  factors: CreditFactor[];
  utilization: { used: number; limit: number };
  tips: Tip[];
};
