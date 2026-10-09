import { useTheme } from "@context/Theme/ThemeContext";
import React, { useState } from "react";
import { StyleSheet, Text, View, type LayoutChangeEvent } from "react-native";
import Svg, { Line, Rect, Text as SvgText } from "react-native-svg";
import { useTranslation } from "react-i18next";
import { formatCompactCurrency, formatINR } from "@utils/format-locals";

type Props = {
  /** Interest paid per quarter for offer A. */
  seriesA: number[];
  /** Interest paid per quarter for offer B. */
  seriesB: number[];
};

const SLOT_A = "#5B6CFF";
const SLOT_B = "#FF6B45";
const HEIGHT = 170;
const BASELINE = 140;
const MAX_BAR = 110;
const QUARTERS = ["Q1", "Q2", "Q3", "Q4"];

/** Grouped (A vs B) bar chart of interest paid per quarter, with a full breakdown. */
export default function InterestChart({ seriesA, seriesB }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [width, setWidth] = useState(0);

  const max = Math.max(1, ...seriesA, ...seriesB);
  const n = QUARTERS.length;
  const slot = width / n;
  const barW = Math.max(8, Math.min(20, slot * 0.26));
  const gap = 4;

  const totalA = seriesA.reduce((a, b) => a + b, 0);
  const totalB = seriesB.reduce((a, b) => a + b, 0);

  return (
    <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[s.title, { color: colors.textPrimary }]}>{t("offers.compare.interest_paid")}</Text>
      <Text style={[s.sub, { color: colors.textMuted }]}>{t("offers.compare.per_quarter")}</Text>

      <View style={{ height: HEIGHT }} onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}>
        {width > 0 ? (
          <Svg width={width} height={HEIGHT}>
            <Line x1={0} x2={width} y1={BASELINE} y2={BASELINE} stroke={colors.divider} strokeWidth={1} />
            {QUARTERS.map((q, i) => {
              const center = i * slot + slot / 2;
              const hA = Math.max(3, (seriesA[i] / max) * MAX_BAR);
              const hB = Math.max(3, (seriesB[i] / max) * MAX_BAR);
              const xA = center - barW - gap / 2;
              const xB = center + gap / 2;
              return (
                <React.Fragment key={q}>
                  <Rect x={xA} y={BASELINE - hA} width={barW} height={hA} rx={3} fill={SLOT_A} />
                  <Rect x={xB} y={BASELINE - hB} width={barW} height={hB} rx={3} fill={SLOT_B} />
                  <SvgText x={center} y={BASELINE + 18} fontSize={12} fill={colors.textMuted} textAnchor="middle">
                    {q}
                  </SvgText>
                </React.Fragment>
              );
            })}
          </Svg>
        ) : null}
      </View>

      <View style={s.legend}>
        <Legend color={SLOT_A} label={t("offers.compare.offer_a")} textColor={colors.textSecondary} />
        <Legend color={SLOT_B} label={t("offers.compare.offer_b")} textColor={colors.textSecondary} />
      </View>

      {/* Full per-quarter breakdown with amounts. */}
      <View style={[s.breakdown, { borderTopColor: colors.divider }]}>
        <View style={s.breakRow}>
          <Text style={[s.breakHeadLabel, { color: colors.textSecondary }]}>
            {t("offers.compare.per_quarter")}
          </Text>
          <Text style={[s.breakHead, { color: SLOT_A }]}>A</Text>
          <Text style={[s.breakHead, { color: SLOT_B }]}>B</Text>
        </View>

        {QUARTERS.map((q, i) => (
          <View key={q} style={s.breakRow}>
            <Text style={[s.breakLabel, { color: colors.textSecondary }]}>{q}</Text>
            <Text style={[s.breakValue, { color: colors.textPrimary }]} numberOfLines={1}>
              {formatINR(seriesA[i])}
            </Text>
            <Text style={[s.breakValue, { color: colors.textPrimary }]} numberOfLines={1}>
              {formatINR(seriesB[i])}
            </Text>
          </View>
        ))}

        <View style={[s.breakRow, s.totalRow, { borderTopColor: colors.divider }]}>
          <Text style={[s.breakLabel, s.totalLabel, { color: colors.textPrimary }]}>
            {t("offers.compare.total_interest")}
          </Text>
          <Text style={[s.breakValue, s.totalValue, { color: colors.textPrimary }]} numberOfLines={1}>
            {formatCompactCurrency(totalA)}
          </Text>
          <Text style={[s.breakValue, s.totalValue, { color: colors.textPrimary }]} numberOfLines={1}>
            {formatCompactCurrency(totalB)}
          </Text>
        </View>
      </View>
    </View>
  );
}

function Legend({ color, label, textColor }: { color: string; label: string; textColor: string }) {
  return (
    <View style={s.legendItem}>
      <View style={[s.dot, { backgroundColor: color }]} />
      <Text style={[s.legendText, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, padding: 16, gap: 2 },
  title: { fontSize: 14, fontWeight: "700" },
  sub: { fontSize: 12, marginBottom: 6 },
  legend: { flexDirection: "row", gap: 20, marginTop: 4 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 3 },
  legendText: { fontSize: 12, fontWeight: "600" },
  breakdown: { marginTop: 14, borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 10 },
  breakRow: { flexDirection: "row", alignItems: "center", paddingVertical: 7 },
  breakHeadLabel: { flex: 1.4, fontSize: 12, fontWeight: "700" },
  breakHead: { flex: 1, fontSize: 12, fontWeight: "800", textAlign: "right" },
  breakLabel: { flex: 1.4, fontSize: 13 },
  breakValue: { flex: 1, fontSize: 13, fontWeight: "600", textAlign: "right" },
  totalRow: { borderTopWidth: StyleSheet.hairlineWidth, marginTop: 4 },
  totalLabel: { fontWeight: "800" },
  totalValue: { fontWeight: "800" },
});
