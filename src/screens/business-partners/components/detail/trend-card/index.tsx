import LineChart from "@components/chart/line-chart";
import { useTheme } from "@context/Theme/ThemeContext";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import type { MonthPoint } from "@data-types/business-partners/constants";
import type { LineSeries } from "@data-types/chart/constants";
import type { DateRange } from "@data-types/date-range/constants";
import { formatINR, formatShortDate } from "@utils/format-locals";
import { filterByRange } from "../../../utils";
import Card from "../../shared/card";
import PeriodDropdown, { type DropdownOption } from "../../shared/period-dropdown";

type Period = "q" | "half" | "custom";
type Props = {
  drawdown: MonthPoint[];
  repayment: MonthPoint[];
  /** Applied custom range (owned by the screen so the date picker renders at root). */
  range: DateRange | null;
  /** Ask the screen to open the shared date-range picker. */
  onRequestCustom: () => void;
};

export default function TrendCard({ drawdown, repayment, range, onRequestCustom }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [period, setPeriod] = useState<Period>("half");

  // A custom range takes over as soon as one is applied.
  const effectivePeriod: Period = range ? "custom" : period;

  // Resolve the visible series for the chosen period.
  const { dd, rp } = useMemo(() => {
    if (effectivePeriod === "custom" && range) {
      return { dd: filterByRange(drawdown, range.start, range.end), rp: filterByRange(repayment, range.start, range.end) };
    }
    const months = effectivePeriod === "q" ? 3 : 6;
    return { dd: drawdown.slice(-months), rp: repayment.slice(-months) };
  }, [effectivePeriod, range, drawdown, repayment]);

  const labels = dd.map((m) => m.month);

  const [active, setActive] = useState(dd.length - 1);
  const idx = Math.min(active, dd.length - 1);
  const ddVal = dd[idx]?.amount ?? 0;
  const rpVal = rp[idx]?.amount ?? 0;
  const gap = ddVal - rpVal;

  const options: DropdownOption<Period>[] = [
    { key: "q", label: t("business_partners.period_3m") },
    { key: "half", label: t("business_partners.period_6m") },
    { key: "custom", label: t("business_partners.period_custom") },
  ];

  const customLabel =
    effectivePeriod === "custom" && range
      ? `${formatShortDate(range.start)} – ${formatShortDate(range.end)}`
      : undefined;

  const handleChange = (next: Period) => {
    if (next === "custom") {
      onRequestCustom();
      return;
    }
    setPeriod(next);
    setActive(999); // reset to last point of the new window
  };

  const series: LineSeries[] = [
    { key: "repayment", points: rp.map((m) => m.amount), color: colors.success, dashed: true },
    { key: "drawdown", points: dd.map((m) => m.amount), color: colors.accent, area: true },
  ];

  const chartKey = effectivePeriod === "custom" && range ? `${range.start}-${range.end}` : effectivePeriod;

  return (
    <Card padded>
      <View style={s.header}>
        <Text style={[s.title, { color: colors.textPrimary }]}>
          {t("business_partners.drawdown_vs_repayment")}
        </Text>
        <PeriodDropdown
          options={options}
          value={effectivePeriod}
          triggerLabel={customLabel}
          onChange={handleChange}
        />
      </View>

      {/* Selected-month readout — shows the outstanding gap clearly */}
      <View style={[s.readout, { backgroundColor: colors.surface }]}>
        <View style={s.readCol}>
          <View style={s.readLabelRow}>
            <View style={[s.dot, { backgroundColor: colors.accent }]} />
            <Text style={[s.readLabel, { color: colors.textMuted }]}>
              {t("business_partners.drawdown")}
            </Text>
          </View>
          <Text style={[s.readValue, { color: colors.textPrimary }]}>{formatINR(ddVal)}</Text>
        </View>

        <View style={s.readCol}>
          <View style={s.readLabelRow}>
            <View style={[s.dashDot, { backgroundColor: colors.success }]} />
            <Text style={[s.readLabel, { color: colors.textMuted }]}>
              {t("business_partners.repayment")}
            </Text>
          </View>
          <Text style={[s.readValue, { color: colors.textPrimary }]}>{formatINR(rpVal)}</Text>
        </View>

        <View style={s.readCol}>
          <Text style={[s.readLabel, { color: colors.textMuted }]}>
            {t("business_partners.outstanding")}
          </Text>
          <Text style={[s.readValue, { color: gap > 0 ? colors.accent : colors.success }]}>
            {formatINR(Math.abs(gap))}
          </Text>
        </View>
      </View>

      <Text style={[s.scrubHint, { color: colors.textMuted }]}>
        {t("business_partners.scrub_month", { month: labels[idx] ?? "" })}
      </Text>

      <LineChart
        key={chartKey}
        series={series}
        labels={labels}
        interactive
        onActiveIndex={setActive}
      />

      <View style={s.legend}>
        <View style={s.legendItem}>
          <View style={[s.legendLine, { backgroundColor: colors.accent }]} />
          <Text style={[s.legendText, { color: colors.textSecondary }]}>
            {t("business_partners.drawdown")}
          </Text>
        </View>
        <View style={s.legendItem}>
          <View style={[s.legendDash, { backgroundColor: colors.success }]} />
          <Text style={[s.legendText, { color: colors.textSecondary }]}>
            {t("business_partners.repayment")}
          </Text>
        </View>
        <Text style={[s.months, { color: colors.textMuted }]}>
          {t("business_partners.months_count", { count: dd.length })}
        </Text>
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12, gap: 8 },
  title: { fontSize: 15, fontWeight: "700" },
  readout: { flexDirection: "row", borderRadius: 12, padding: 12, marginBottom: 6 },
  readCol: { flex: 1, gap: 4 },
  readLabelRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  dashDot: { width: 7, height: 3, borderRadius: 2 },
  readLabel: { fontSize: 11 },
  readValue: { fontSize: 14, fontWeight: "700", fontVariant: ["tabular-nums"] },
  scrubHint: { fontSize: 11, textAlign: "center", marginBottom: 6 },
  legend: { flexDirection: "row", alignItems: "center", gap: 16, marginTop: 12 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendLine: { width: 16, height: 3, borderRadius: 2 },
  legendDash: { width: 16, height: 3, borderRadius: 2, opacity: 0.9 },
  legendText: { fontSize: 12, fontWeight: "500" },
  months: { fontSize: 11, marginLeft: "auto" },
});
