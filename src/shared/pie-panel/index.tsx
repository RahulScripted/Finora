import DonutChart from "@components/chart/donut-chart";
import { useTheme } from "@context/Theme/ThemeContext";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { PiePanelProps } from "@data-types/chart/constants";

/**
 * Reusable donut + legend panel. React Native counterpart of the web
 * (recharts) PiePanel — sizeable via `size` / `stroke`, interactive slices
 * that highlight the matching legend row, and a center label that shows the
 * active slice (or the aggregate total when nothing is selected).
 *
 * Use `layout="horizontal"` to place the legend beside the donut, and
 * `legendValue="pct"` to show percentages instead of formatted values.
 */
export default function PiePanel({
  data,
  title,
  subtitle,
  totalLabel = "Total",
  format = (v) => `${v}`,
  size = 180,
  stroke = 22,
  hideLegend = false,
  bare = false,
  layout = "vertical",
  legendValue = "value",
  formatPct = (p) => `${Math.round(p)}%`,
  centerValue,
  centerLabel,
}: PiePanelProps) {
  const { colors } = useTheme();
  const [active, setActive] = useState<number | null>(null);

  const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data]);
  const current = active != null ? data[active] : null;

  const slices = useMemo(
    () =>
      data.map((d, i) => ({
        key: d.name,
        pct: total > 0 ? (d.value / total) * 100 : 0,
        // Dim non-active slices when one is selected.
        color: active == null || active === i ? d.color : d.color + "66",
      })),
    [data, total, active],
  );

  const resolvedCenterValue = centerValue ?? format(current ? current.value : total);
  const resolvedCenterLabel = centerLabel ?? (current ? current.name : totalLabel);
  const horizontal = layout === "horizontal";

  const donut = (
    <View style={[s.donutWrap, { width: size, height: size }]}>
      <DonutChart
        size={size}
        stroke={stroke}
        slices={slices}
        centerContent={
          <View style={s.center} pointerEvents="none">
            <Text style={[s.centerValue, { color: colors.textPrimary }]} numberOfLines={1}>
              {resolvedCenterValue}
            </Text>
            <Text style={[s.centerLabel, { color: colors.textMuted }]} numberOfLines={1}>
              {resolvedCenterLabel}
            </Text>
          </View>
        }
      />
    </View>
  );

  const legend = hideLegend ? null : (
    <View style={[s.legend, horizontal && s.legendFlex]}>
      {data.map((slice, i) => {
        const isActive = active === i;
        const trailing =
          legendValue === "pct"
            ? formatPct(total > 0 ? (slice.value / total) * 100 : 0)
            : format(slice.value);
        return (
          <Pressable
            key={slice.name}
            onPressIn={() => setActive(i)}
            onPressOut={() => setActive(null)}
            style={[s.legendRow, isActive && { backgroundColor: colors.surface }]}
          >
            <View style={s.legendLabel}>
              <View style={[s.bar, { backgroundColor: slice.color }]} />
              <Text style={[s.name, { color: colors.textSecondary }]} numberOfLines={1}>
                {slice.name}
              </Text>
            </View>
            <Text style={[s.value, { color: colors.textPrimary }]} numberOfLines={1}>
              {trailing}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <View
      style={[
        s.card,
        bare && s.bare,
        !bare && { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      {title ? (
        <View style={s.head}>
          <Text style={[s.title, { color: colors.textPrimary }]}>{title}</Text>
          {subtitle ? <Text style={[s.subtitle, { color: colors.textMuted }]}>{subtitle}</Text> : null}
        </View>
      ) : null}

      <View style={horizontal ? s.horizontal : undefined}>
        {donut}
        {legend}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, padding: 16, gap: 14 },
  bare: { padding: 0, borderWidth: 0, borderRadius: 0, gap: 14 },
  head: { gap: 2 },
  title: { fontSize: 16, fontWeight: "700" },
  subtitle: { fontSize: 12 },
  horizontal: { flexDirection: "row", alignItems: "center", gap: 18 },
  donutWrap: { alignSelf: "center" },
  center: { ...StyleSheet.absoluteFill, alignItems: "center", justifyContent: "center", gap: 2 },
  centerValue: { fontSize: 20, fontWeight: "800" },
  centerLabel: { fontSize: 12, fontWeight: "500" },
  legend: { gap: 2 },
  legendFlex: { flex: 1, gap: 6 },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 10,
  },
  legendLabel: { flexDirection: "row", alignItems: "center", gap: 10, flexShrink: 1 },
  bar: { width: 5, height: 22, borderRadius: 2.5 },
  name: { fontSize: 14, fontWeight: "600" },
  value: { fontSize: 14, fontWeight: "700" },
});
