import type { CreditSummary } from "@data-types/credit-score/constants";

export function bandOf(
  score: number,
  bands: CreditSummary["bands"],
): CreditSummary["bands"][number] {
  let current = bands[0];
  for (const b of bands) if (score >= b.from) current = b;
  return current;
}

const DAY_MS = 86_400_000;
const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

export const daysAgo = (iso: string) =>
  Math.max(0, Math.round((startOfDay(new Date()) - startOfDay(new Date(iso))) / DAY_MS));
