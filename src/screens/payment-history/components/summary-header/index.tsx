import { useTheme } from "@context/Theme/ThemeContext";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import LineChart from "@components/chart/line-chart";
import ProgressRing from "@components/chart/progress-ring";
import {
  CASH_FLOW_RANGES,
  type CashFlowLabel,
  type CashFlowRange,
  type TransactionSummary,
} from "@data-types/transaction-history/constants";
import { formatINR, getMonthsShort } from "@utils/format-locals";
import Card from "@shared/card";

type FlowMode = "inflow" | "outflow";

type TFn = (key: string, opts?: Record<string, unknown>) => string;

/** Resolves a chart x-axis label reference to localized display text. */
function resolveLabel(label: CashFlowLabel, t: TFn, months: string[]): string {
  if (!label) return "";
  switch (label.type) {
    case "month":
      return months[label.index] ?? "";
    case "weekday":
      return t(`transaction_history.chart.weekdays.${label.index}`);
    case "time":
      return t(`transaction_history.chart.time.${label.key}`);
    case "week":
      return t("transaction_history.chart.week", { n: label.n });
    default:
      return "";
  }
}

/** Credit-limit ring + a single interactive Cash Flow line with a range selector. */
export default function SummaryHeader({ summary }: { summary: TransactionSummary }) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const usedPct = summary.totalLimit > 0 ? (summary.usedLimit / summary.totalLimit) * 100 : 0;

  const [mode, setMode] = useState<FlowMode>("inflow");
  const [range, setRange] = useState<CashFlowRange>("3M");

  const data = summary.cashFlow[range];
  const [active, setActive] = useState(data.length - 1);
  const point = data[Math.min(active, data.length - 1)];

  const lineColor = mode === "inflow" ? colors.success : colors.accent;

  // Single series — only the chosen flow + range is drawn. Keyed so the
  // draw-in animation replays when the flow or range changes.
  const series = useMemo(
    () => [
      {
        key: `${mode}-${range}`,
        points: data.map((c) => (mode === "inflow" ? c.inflow : c.outflow)),
        color: lineColor,
        area: true,
      },
    ],
    [data, mode, range, lineColor],
  );

  const months = getMonthsShort();
  const labels = data.map((c) => resolveLabel(c.label, t, months));
  const activeValue = mode === "inflow" ? point.inflow : point.outflow;

  const Toggle = ({ value, label, color }: { value: FlowMode; label: string; color: string }) => {
    const selected = mode === value;
    return (
      <Pressable
        onPress={() => setMode(value)}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        style={({ pressed }) => [
          s.toggle,
          { backgroundColor: selected ? color + "1A" : "transparent" },
          pressed && s.pressed,
        ]}
      >
        <View style={[s.dot, { backgroundColor: color }]} />
        <Text style={[s.toggleText, { color: selected ? color : colors.textSecondary }]}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <View style={s.wrap}>
      {/* Credit limit — Available Limit is primary; ring shows utilisation. */}
      <Card padded>
        <View style={s.limitRow}>
          <View style={s.limitCol}>
            <Text style={[s.limitLabel, { color: colors.textSecondary }]}>
              {t("transaction_history.available_limit")}
            </Text>
            <Text style={[s.limitValue, { color: colors.textPrimary }]}>
              {formatINR(summary.availableLimit)}
            </Text>
            <Text style={[s.limitTotal, { color: colors.textMuted }]}>
              {t("transaction_history.of_total", { amount: formatINR(summary.totalLimit) })}
            </Text>
          </View>

          <ProgressRing
            pct={usedPct}
            color={colors.accent}
            size={76}
            stroke={7}
            label={
              <Text style={[s.ringLabel, { color: colors.textPrimary }]}>{Math.round(usedPct)}%</Text>
            }
          />
        </View>
      </Card>

      {/* Cash flow — one flowing line, toggle flow + pick a time range */}
      <Card padded>
        <View style={s.cashHead}>
          <Text style={[s.cashTitle, { color: colors.textPrimary }]} numberOfLines={1}>
            {t("transaction_history.cash_flow")}
          </Text>
          <View style={s.toggles}>
            <Toggle value="inflow" label={t("transaction_history.inflow")} color={colors.success} />
            <Toggle value="outflow" label={t("transaction_history.outflow")} color={colors.accent} />
          </View>
        </View>

        {/* Scrub readout for the active point */}
        <View style={s.readout}>
          <Text style={[s.readoutLabel, { color: colors.textSecondary }]}>
            {t(`transaction_history.${mode}`)}
          </Text>
          <Text style={[s.readoutValue, { color: lineColor }]}>{formatINR(activeValue)}</Text>
        </View>

        <LineChart
          key={`${mode}-${range}`}
          series={series}
          labels={labels}
          height={160}
          interactive
          onActiveIndex={setActive}
        />

        {/* Time-range selector */}
        <View style={[s.ranges, { borderTopColor: colors.divider }]}>
          {CASH_FLOW_RANGES.map((r) => {
            const selected = r === range;
            return (
              <Pressable
                key={r}
                onPress={() => {
                  setRange(r);
                  setActive(summary.cashFlow[r].length - 1);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                style={({ pressed }) => [
                  s.rangeBtn,
                  selected && { backgroundColor: colors.accent + "1A" },
                  pressed && s.pressed,
                ]}
              >
                <Text
                  style={[
                    s.rangeText,
                    { color: selected ? colors.accent : colors.textMuted },
                    selected && s.rangeTextActive,
                  ]}
                >
                  {r}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { gap: 12 },
  limitRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  limitCol: { minWidth: 0, flexShrink: 1 },
  limitLabel: { fontSize: 12 },
  limitValue: { fontSize: 24, fontWeight: "700", marginTop: 2, fontVariant: ["tabular-nums"] },
  limitTotal: { fontSize: 12, marginTop: 3 },
  ringLabel: { fontSize: 13, fontWeight: "700" },
  cashHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 10,
  },
  cashTitle: { fontSize: 15, fontWeight: "700", flexShrink: 1 },
  toggles: { flexDirection: "row", gap: 6 },
  toggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  pressed: { opacity: 0.7 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  toggleText: { fontSize: 12, fontWeight: "600" },
  readout: { marginBottom: 6, gap: 1 },
  readoutLabel: { fontSize: 11 },
  readoutValue: { fontSize: 20, fontWeight: "700", fontVariant: ["tabular-nums"] },
  ranges: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  rangeBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  rangeText: { fontSize: 13, fontWeight: "600" },
  rangeTextActive: { fontWeight: "800" },
});
