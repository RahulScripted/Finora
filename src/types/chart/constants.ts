/** One bar in a bar chart. `amount: null` means "hasn't happened yet". */
export type ChartBucket = { label: string; tooltip: string; amount: number | null };

export type BarChartProps = {
  buckets: ChartBucket[];
  /** Formats an amount for the tooltip and accessibility label. */
  formatValue: (n: number) => string;
  /** Optional accessibility label builder. */
  a11yLabel?: (label: string, formatted: string) => string;
  height?: number;
};
