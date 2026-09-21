import type { CreditSummary } from "@data-types/credit-score/constants";

const DAY_MS = 86_400_000;

export const CREDIT_SCORE_MOCK: CreditSummary = {
  score: 730,
  min: 300,
  max: 900,
  bands: [
    { key: "poor", from: 300 },
    { key: "fair", from: 550 },
    { key: "good", from: 650 },
    { key: "very_good", from: 750 },
    { key: "excellent", from: 800 },
  ],
  changeSinceLast: 8,
  updatedAt: new Date(Date.now() - 2 * DAY_MS).toISOString(),
  bureau: "CIBIL",
  history: [
    { label: "Oct", score: 648 },
    { label: "Nov", score: 655 },
    { label: "Dec", score: 651 },
    { label: "Jan", score: 660 },
    { label: "Feb", score: 668 },
    { label: "Mar", score: 664 },
    { label: "Apr", score: 672 },
    { label: "May", score: 681 },
    { label: "Jun", score: 681 },
    { label: "Jul", score: 704 },
    { label: "Aug", score: 722 },
    { label: "Sep", score: 730 },
  ],
  factors: [
    { key: "payment_history", status: "great", impact: "high", value: "100% on time" },
    { key: "utilization", status: "good", impact: "high", value: "20%" },
    { key: "credit_age", status: "fair", impact: "medium", value: "3 yrs 4 mo" },
    { key: "inquiries", status: "fair", impact: "low", value: "4 in 12 months" },
    { key: "credit_mix", status: "good", impact: "low", value: "3 account types" },
  ],
  utilization: { used: 240_000, limit: 1_200_000 },
  tips: [
    { id: "keep_utilization_low", icon: "speedometer-slow", points: 18 },
    { id: "repay_early", icon: "calendar-check-outline", points: 12 },
    { id: "pause_applications", icon: "pause-circle-outline", points: 8 },
  ],
};
