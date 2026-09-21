/**
 * pick-random
 *
 * Generates a fully self-consistent random CreditSummary.
 * Every field is derived from the score so the whole screen
 * stays coherent — change the score and utilization, history,
 * factors, tips, and change-since-last all recalculate.
 *
 * Swap `randomCreditSummary` for a real API call later.
 */
import type {
  BandKey,
  CreditFactor,
  CreditSummary,
  FactorKey,
  FactorStatus,
  Impact,
  ScorePoint,
  Tip,
  TipId,
} from "@data-types/credit-score/constants";

/* ------------------------------------------------------------------ */
/* Primitive helpers                                                   */
/* ------------------------------------------------------------------ */

/** Integer in [min, max] inclusive, seeded by account so same number always gives same result. */
function seededInt(seed: number, min: number, max: number, salt = 0): number {
  // Simple LCG — good enough for a mock
  const s = ((seed * 1_664_525 + 1_013_904_223 + salt * 22_695_477) & 0x7fff_ffff) >>> 0;
  return min + (s % (max - min + 1));
}

function seededFloat(seed: number, min: number, max: number, salt = 0): number {
  const s = ((seed * 214_013 + 2_531_011 + salt * 6_364_136) & 0x7fff_ffff) >>> 0;
  return min + (s / 0x7fff_ffff) * (max - min);
}

function seededPick<T>(seed: number, arr: T[], salt = 0): T {
  return arr[seededInt(seed, 0, arr.length - 1, salt)];
}

/** Turn an account number string into a stable integer seed. */
export function accountSeed(account: string): number {
  let h = 0x811c_9dc5;
  for (let i = 0; i < account.length; i++) {
    h ^= account.charCodeAt(i);
    h = (h * 0x0100_0193) >>> 0;
  }
  return h;
}

/* ------------------------------------------------------------------ */
/* Score → band                                                        */
/* ------------------------------------------------------------------ */

const BANDS: { key: BandKey; from: number }[] = [
  { key: "poor", from: 300 },
  { key: "fair", from: 550 },
  { key: "good", from: 650 },
  { key: "very_good", from: 750 },
  { key: "excellent", from: 800 },
];

function bandForScore(score: number): BandKey {
  let key: BandKey = "poor";
  for (const b of BANDS) if (score >= b.from) key = b.key;
  return key;
}

/* ------------------------------------------------------------------ */
/* History: 12 months ending at `score`                               */
/* ------------------------------------------------------------------ */

const MONTH_LABELS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];

function buildHistory(seed: number, score: number): ScorePoint[] {
  // Walk backwards from the final score with ±random monthly deltas
  const points: number[] = [score];
  for (let i = 1; i < 12; i++) {
    const delta = seededInt(seed, -18, 10, i * 7);
    points.unshift(Math.max(300, Math.min(900, points[0] + delta)));
  }
  return MONTH_LABELS.map((label, i) => ({ label, score: points[i] }));
}

/* ------------------------------------------------------------------ */
/* Factors: derived from score band                                   */
/* ------------------------------------------------------------------ */

type FactorSpec = {
  key: FactorKey;
  impact: Impact;
  goodStatuses: FactorStatus[];
  badStatuses: FactorStatus[];
  goodValues: string[];
  badValues: string[];
};

const FACTOR_SPECS: FactorSpec[] = [
  {
    key: "payment_history",
    impact: "high",
    goodStatuses: ["great", "great", "good"],
    badStatuses: ["fair", "poor"],
    goodValues: ["100% on time", "99% on time", "98% on time"],
    badValues: ["2 late payments", "4 missed payments"],
  },
  {
    key: "utilization",
    impact: "high",
    goodStatuses: ["great", "good"],
    badStatuses: ["fair", "poor"],
    goodValues: ["8%", "15%", "22%"],
    badValues: ["38%", "55%", "72%"],
  },
  {
    key: "credit_age",
    impact: "medium",
    goodStatuses: ["great", "good"],
    badStatuses: ["fair", "poor"],
    goodValues: ["7 yrs 2 mo", "5 yrs 8 mo", "4 yrs 1 mo"],
    badValues: ["2 yrs 3 mo", "1 yr 6 mo"],
  },
  {
    key: "inquiries",
    impact: "low",
    goodStatuses: ["great", "good"],
    badStatuses: ["fair", "poor"],
    goodValues: ["0 in 12 months", "1 in 12 months"],
    badValues: ["4 in 12 months", "7 in 12 months"],
  },
  {
    key: "credit_mix",
    impact: "low",
    goodStatuses: ["great", "good"],
    badStatuses: ["fair", "poor"],
    goodValues: ["4 account types", "3 account types"],
    badValues: ["1 account type", "2 account types"],
  },
];

function buildFactors(seed: number, score: number): CreditFactor[] {
  const band = bandForScore(score);
  // Higher scores lean towards good statuses
  const goodBias = band === "excellent" ? 0.9 : band === "very_good" ? 0.75 : band === "good" ? 0.55 : band === "fair" ? 0.35 : 0.15;

  return FACTOR_SPECS.map((spec, i) => {
    const pickGood = seededFloat(seed, 0, 1, i * 13) < goodBias;
    const statuses = pickGood ? spec.goodStatuses : spec.badStatuses;
    const values = pickGood ? spec.goodValues : spec.badValues;
    return {
      key: spec.key,
      impact: spec.impact,
      status: seededPick(seed, statuses, i * 31) as FactorStatus,
      value: seededPick(seed, values, i * 17),
    };
  });
}

/* ------------------------------------------------------------------ */
/* Utilization: linked to score                                       */
/* ------------------------------------------------------------------ */

function buildUtilization(seed: number, score: number): { used: number; limit: number } {
  // Better score → lower utilization tendency
  const band = bandForScore(score);
  const limitBase = seededInt(seed, 500_000, 3_000_000, 99);
  const limit = Math.round(limitBase / 100_000) * 100_000;

  const maxPct = band === "excellent" ? 15 : band === "very_good" ? 25 : band === "good" ? 35 : band === "fair" ? 55 : 75;
  const minPct = 2;
  const pct = seededInt(seed, minPct, maxPct, 88);
  const used = Math.round((limit * pct) / 100 / 1000) * 1000;

  return { used, limit };
}

/* ------------------------------------------------------------------ */
/* Tips: ones most relevant to the weakest factors                    */
/* ------------------------------------------------------------------ */

const ALL_TIPS: Tip[] = [
  { id: "keep_utilization_low", icon: "speedometer-slow", points: 18 },
  { id: "repay_early", icon: "calendar-check-outline", points: 12 },
  { id: "pause_applications", icon: "pause-circle-outline", points: 8 },
];

function buildTips(seed: number, factors: CreditFactor[]): Tip[] {
  const weakKeys = factors.filter((f) => f.status === "fair" || f.status === "poor").map((f) => f.key);

  // Reorder tips: utilization tip first if utilization is weak, etc.
  const ordered: TipId[] = [];
  if (weakKeys.includes("utilization")) ordered.push("keep_utilization_low");
  if (weakKeys.includes("payment_history")) ordered.push("repay_early");
  if (weakKeys.includes("inquiries")) ordered.push("pause_applications");

  // Fill remaining slots from ALL_TIPS in seeded order
  for (const t of ALL_TIPS) {
    if (!ordered.includes(t.id)) ordered.push(t.id);
  }

  return ordered.slice(0, 3).map((id) => ALL_TIPS.find((t) => t.id === id)!);
}

/* ------------------------------------------------------------------ */
/* Change since last                                                   */
/* ------------------------------------------------------------------ */

function buildChange(seed: number, history: ScorePoint[]): number {
  if (history.length < 2) return 0;
  return history[history.length - 1].score - history[history.length - 2].score;
}

/* ------------------------------------------------------------------ */
/* Public API                                                         */
/* ------------------------------------------------------------------ */

/**
 * Given any account number string, deterministically generates
 * a full CreditSummary. Same account number always returns the
 * same result. Different numbers return different results.
 */
export function randomCreditSummary(account: string): CreditSummary {
  const seed = accountSeed(account);
  const score = seededInt(seed, 310, 890, 0);
  const history = buildHistory(seed, score);
  const factors = buildFactors(seed, score);
  const utilization = buildUtilization(seed, score);
  const tips = buildTips(seed, factors);
  const changeSinceLast = buildChange(seed, history);

  // updatedAt: 0–7 days ago
  const daysOld = seededInt(seed, 0, 7, 55);
  const updatedAt = new Date(Date.now() - daysOld * 86_400_000).toISOString();

  return {
    score,
    min: 300,
    max: 900,
    bands: BANDS,
    changeSinceLast,
    updatedAt,
    bureau: "CIBIL",
    history,
    factors,
    utilization,
    tips,
  };
}
