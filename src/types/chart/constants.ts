export type ChartBucket = { label: string; tooltip: string; amount: number | null };

export type BarChartProps = {
  buckets: ChartBucket[];
  formatValue: (n: number) => string;
  a11yLabel?: (label: string, formatted: string) => string;
  height?: number;
};
