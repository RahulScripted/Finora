import type { ChartBucket } from "@data-types/chart/constants";
import type { MonthPoint } from "@data-types/business-partners/constants";

/** Map a monthly series into the generic BarChart bucket shape. */
export function toBuckets(series: MonthPoint[]): ChartBucket[] {
  return series.map((p) => ({ label: p.month, tooltip: p.month, amount: p.amount }));
}

/** Sum a monthly series. */
export function sumSeries(series: MonthPoint[] | undefined): number {
  return series?.reduce((s, m) => s + m.amount, 0) ?? 0;
}

/** Describe a line-tone from a semantic tone key. */
export type ToneColorKey = "success" | "warning" | "danger" | "neutral";

export type DatedPoint = MonthPoint & { date: Date };

/**
 * Assign a real Date to each monthly point, assuming the series is a run of
 * consecutive months ending in the most recent one (last point = current month).
 */
export function withDates(series: MonthPoint[]): DatedPoint[] {
  const n = series.length;
  const now = new Date();
  const anchor = new Date(now.getFullYear(), now.getMonth(), 1);
  return series.map((p, i) => {
    const offset = n - 1 - i; // 0 for the last point
    return { ...p, date: new Date(anchor.getFullYear(), anchor.getMonth() - offset, 1) };
  });
}

/** Keep only the points whose month falls within [startISO, endISO] (inclusive by month). */
export function filterByRange(
  series: MonthPoint[],
  startISO: string,
  endISO: string,
): MonthPoint[] {
  const start = new Date(startISO);
  const end = new Date(endISO);
  const startMonth = new Date(start.getFullYear(), start.getMonth(), 1).getTime();
  const endMonth = new Date(end.getFullYear(), end.getMonth() + 1, 0, 23, 59, 59).getTime();
  const dated = withDates(series).filter((p) => {
    const t = p.date.getTime();
    return t >= startMonth && t <= endMonth;
  });
  // Always return at least the last point so the chart is never empty.
  const points = dated.length ? dated : withDates(series).slice(-1);
  return points.map(({ month, amount }) => ({ month, amount }));
}
