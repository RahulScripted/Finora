import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View, type LayoutChangeEvent } from "react-native";
import Svg, { Circle, G, Path, Text as SvgText } from "react-native-svg";
import type { CreditSummary } from "@data-types/credit-score/constants";
import { bandOf, daysAgo } from "../../utils";
import { useAnimatedProgress } from "../shared/use-animated-progress";
import { useBandColors } from "../shared/use-band-colors";
import Card from "../shared/card";

/* ------------------------------------------------------------------ */
/* Gauge constants                                                     */
/* ------------------------------------------------------------------ */
const G_W = 280;
const G_H = 160;
const CX = 140;
const CY = 140;
const R = 110;
const SW = 14;
const GAP = 0.18;

const polar = (theta: number, r = R) => ({
  x: CX + r * Math.cos(theta),
  y: CY + r * Math.sin(theta),
});

const arcPath = (a0: number, a1: number) => {
  const p0 = polar(a0);
  const p1 = polar(a1);
  return `M ${p0.x} ${p0.y} A ${R} ${R} 0 0 1 ${p1.x} ${p1.y}`;
};

/* ------------------------------------------------------------------ */
/* Gauge                                                               */
/* ------------------------------------------------------------------ */
function ScoreGauge({ data }: { data: CreditSummary }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const bandColors = useBandColors();
  const progress = useAnimatedProgress();
  const [w, setW] = useState(0);
  const { score, min, max, bands } = data;
  const theta = (v: number) => Math.PI + ((v - min) / (max - min)) * Math.PI;
  const animScore = min + (score - min) * progress;
  const band = bandOf(score, bands);
  const bandColor = bandColors[band.key];
  const knob = polar(theta(animScore));
  const height = w ? (w * G_H) / G_W : 0;

  return (
    <View
      style={{ height }}
      onLayout={(e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width)}
      accessible
      accessibilityLabel={t("credit_score.scale_a11y", {
        score,
        max,
        band: t(`credit_score.band_${band.key}`),
      })}
    >
      {w > 0 ? (
        <Svg width={w} height={height} viewBox={`0 0 ${G_W} ${G_H}`}>
          {bands.map((b, i) => {
            const end = bands[i + 1]?.from ?? max;
            const a0 = theta(b.from) + GAP / 2;
            const a1 = theta(end) - GAP / 2;
            const color = bandColors[b.key];
            const reach = Math.min(a1, theta(animScore));
            return (
              <G key={b.key}>
                <Path d={arcPath(a0, a1)} stroke={color} strokeOpacity={0.2} strokeWidth={SW} strokeLinecap="round" fill="none" />
                {reach > a0 + 0.001 ? (
                  <Path d={arcPath(a0, reach)} stroke={color} strokeWidth={SW} strokeLinecap="round" fill="none" />
                ) : null}
              </G>
            );
          })}
          <Circle cx={knob.x} cy={knob.y} r={10} fill={colors.card} stroke={bandColor} strokeWidth={4} />
          <SvgText x={CX - R} y={G_H - 2} fontSize={11} fill={colors.textMuted} textAnchor="middle">{min}</SvgText>
          <SvgText x={CX + R} y={G_H - 2} fontSize={11} fill={colors.textMuted} textAnchor="middle">{max}</SvgText>
        </Svg>
      ) : null}
      <View style={s.gaugeCenter} pointerEvents="none">
        <View style={s.bandRow}>
          <View style={[s.bandDot, { backgroundColor: bandColor }]} />
          <Text style={[s.bandLabel, { color: colors.textSecondary }]}>
            {t(`credit_score.band_${band.key}`)}
          </Text>
        </View>
        <Text style={[s.scoreNumber, { color: colors.textPrimary }]}>
          {Math.round(animScore)}
        </Text>
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Score card                                                          */
/* ------------------------------------------------------------------ */
type Props = { data: CreditSummary };

export default function ScoreCard({ data }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const band = bandOf(data.score, data.bands);
  const change = data.changeSinceLast;
  const up = change > 0;
  const flat = change === 0;
  const ago = daysAgo(data.updatedAt);

  return (
    <Card padded tint={colors.accent + "0D"}>
      <ScoreGauge data={data} />
      <View style={s.centerCol}>
        {/* Change pill */}
        <View
          style={[
            s.changePill,
            { backgroundColor: flat ? colors.surface : up ? colors.successSoft : colors.accent + "18" },
          ]}
        >
          {!flat ? (
            <MaterialCommunityIcons
              name={up ? "arrow-up" : "arrow-down"}
              size={14}
              color={up ? colors.success : colors.accent}
            />
          ) : null}
          <Text
            style={[
              s.changeText,
              { color: flat ? colors.textSecondary : up ? colors.success : colors.accent },
            ]}
          >
            {flat
              ? t("credit_score.points_flat")
              : t(up ? "credit_score.points_up" : "credit_score.points_down", {
                  count: Math.abs(change),
                })}
          </Text>
        </View>

        {/* Witty line */}
        <Text style={[s.witty, { color: colors.textPrimary }]}>
          {t(`credit_score.line_${band.key}`)}
        </Text>

        {/* Meta chips: updated + bureau */}
        <View style={s.metaRow}>
          <View style={[s.metaChip, { backgroundColor: colors.surface }]}>
            <MaterialCommunityIcons name="clock-outline" size={13} color={colors.textMuted} />
            <Text style={[s.metaText, { color: colors.textMuted }]}>
              {ago === 0
                ? t("credit_score.updated_today")
                : t("credit_score.updated_days", { count: ago })}
            </Text>
          </View>
          <View style={[s.metaChip, { backgroundColor: colors.surface }]}>
            <MaterialCommunityIcons name="shield-check-outline" size={13} color={colors.textMuted} />
            <Text style={[s.metaText, { color: colors.textMuted }]}>{data.bureau}</Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  gaugeCenter: { position: "absolute", left: 0, right: 0, bottom: 10, alignItems: "center" },
  bandRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  bandDot: { width: 8, height: 8, borderRadius: 4 },
  bandLabel: { fontSize: 15, fontWeight: "500" },
  scoreNumber: { fontSize: 56, fontWeight: "700", letterSpacing: -1.5, lineHeight: 62, fontVariant: ["tabular-nums"] },
  centerCol: { alignItems: "center", marginTop: 14, gap: 12 },
  changePill: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  changeText: { fontSize: 12, fontWeight: "600" },
  witty: { fontSize: 14, fontWeight: "500", textAlign: "center", paddingHorizontal: 16, lineHeight: 20 },
  metaRow: { flexDirection: "row", gap: 8 },
  metaChip: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  metaText: { fontSize: 12 },
});
