export type ChartBucket = { label: string; tooltip: string; amount: number | null };

export type BarChartProps = {
  buckets: ChartBucket[];
  formatValue: (n: number) => string;
  a11yLabel?: (label: string, formatted: string) => string;
  height?: number;
};

/* ------------------------------------------------------------------ */
/* Donut chart                                                         */
/* ------------------------------------------------------------------ */
export type DonutSlice = {
  /** Stable key per slice. */
  key: string;
  /** Percentage of the whole, 0–100. */
  pct: number;
  color: string;
};

export type DonutChartProps = {
  slices: DonutSlice[];
  /** Diameter in px. */
  size?: number;
  /** Ring thickness in px. */
  stroke?: number;
  /** Optional content rendered in the middle of the ring. */
  centerContent?: React.ReactNode;
  /** Color of the unfilled track. Defaults to theme surface. */
  trackColor?: string;
};

/* ------------------------------------------------------------------ */
/* Progress ring (single-value donut)                                  */
/* ------------------------------------------------------------------ */
export type ProgressRingProps = {
  /** 0–100. */
  pct: number;
  /** Ring color. If omitted, caller can pass via `color`. */
  color: string;
  size?: number;
  stroke?: number;
  /** Optional label rendered in the center. */
  label?: React.ReactNode;
};

/* ------------------------------------------------------------------ */
/* Column chart (categorical bars, one per item)                       */
/* ------------------------------------------------------------------ */
export type ColumnDatum = {
  key: string;
  /** Short label under the column. */
  label: string;
  value: number;
  color: string;
};

export type ColumnChartProps = {
  data: ColumnDatum[];
  height?: number;
  /** Format the value shown above / under each column. */
  formatValue?: (n: number) => string;
};

/* ------------------------------------------------------------------ */
/* Line chart (one or more series over the same x-axis)                */
/* ------------------------------------------------------------------ */
export type LineSeries = {
  key: string;
  /** y-values, aligned to `labels`. */
  points: number[];
  color: string;
  /** Draw as a dashed line (e.g. a comparison/secondary series). */
  dashed?: boolean;
  /** Fill the area under this line with a soft gradient. */
  area?: boolean;
};

export type LineChartProps = {
  series: LineSeries[];
  /** x-axis labels; only first and last are rendered by default. */
  labels: string[];
  height?: number;
};

/* ------------------------------------------------------------------ */
/* Sparkline (tiny trend line, no axes)                                */
/* ------------------------------------------------------------------ */
export type SparklineProps = {
  points: number[];
  color: string;
  width?: number;
  height?: number;
};
