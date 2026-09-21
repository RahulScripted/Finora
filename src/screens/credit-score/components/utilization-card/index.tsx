import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View, type LayoutChangeEvent } from "react-native";
import Svg, { Circle, G, Rect, Text as SvgText } from "react-native-svg";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import type { CreditSummary, FactorStatus } from "@data-types/credit-score/constants";
import { formatINR, formatLakh } from "@utils/format-locals";
import { useAnimatedProgress } from "../shared/use-animated-progress";
import { useStatusColors } from "../shared/use-band-colors";
import Card from "../shared/card";

const ZONES: { key: FactorStatus; from: number; to: number }[] = [
  { key: "great", from: 0, to: 10 },
  { key: "good", from: 10, to: 30 },
  { key: "fair", from: 30, to: 50 },
  { key: "poor", from: 50, to: 100 },
];
const TARGET_PCT = 30;

type Props = { data: CreditSummary };

export default function UtilizationCard({ data }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const statusColors = useStatusColors();
  const progress = useAnimatedProgress(900);
  const [w, setW] = useState(0);
  const { used, limit } = data.utilization;
  const pct = limit > 0 ? (used / limit) * 100 : 0;
  const shownPct = Math.min(100, pct) * progress;
  const zone = ZONES.find((z) => pct < z.to) ?? ZONES[ZONES.length - 1];
  const zoneColor = statusColors[zone.key];
  const headroom = (limit * TARGET_PCT) / 100 - used;
  const BAR_Y = 8;
  const BAR_H = 12;
  const knobX = Math.max(9, Math.min(w - 9, (shownPct / 100) * w));

  // Staggered entrance animations for the two stat values and the hint
  const leftOp = useSharedValue(0);
  const leftY = useSharedValue(12);
  const rightOp = useSharedValue(0);
  const rightY = useSharedValue(12);
  const hintOp = useSharedValue(0);
  const hintY = useSharedValue(10);

  leftOp.value = withDelay(80, withTiming(1, { duration: 400 }));
  leftY.value = withDelay(80, withSpring(0, { damping: 16, stiffness: 120 }));
  rightOp.value = withDelay(180, withTiming(1, { duration: 400 }));
  rightY.value = withDelay(180, withSpring(0, { damping: 16, stiffness: 120 }));
  hintOp.value = withDelay(500, withTiming(1, { duration: 350 }));
  hintY.value = withDelay(500, withSpring(0, { damping: 16, stiffness: 100 }));

  const leftStyle = useAnimatedStyle(() => ({ opacity: leftOp.value, transform: [{ translateY: leftY.value }] }));
  const rightStyle = useAnimatedStyle(() => ({ opacity: rightOp.value, transform: [{ translateY: rightY.value }] }));
  const hintStyle = useAnimatedStyle(() => ({ opacity: hintOp.value, transform: [{ translateY: hintY.value }] }));

  return (
    <Card padded>
      <View style={s.top}>
        <Animated.View style={leftStyle}>
          <Text style={[s.label, { color: colors.textSecondary }]}>{t("credit_score.used")}</Text>
          <Text style={[s.bigValue, { color: colors.textPrimary }]}>{formatLakh(used)}</Text>
        </Animated.View>

        <View style={[s.chip, { backgroundColor: zoneColor + "22" }]}>
          <Text style={[s.chipText, { color: zoneColor }]}>
            {Math.round(pct)}% · {t(`credit_score.status_${zone.key}`)}
          </Text>
        </View>

        <Animated.View style={[s.alignEnd, rightStyle]}>
          <Text style={[s.label, { color: colors.textSecondary }]}>{t("credit_score.limit")}</Text>
          <Text style={[s.bigValue, { color: colors.textPrimary }]}>{formatLakh(limit)}</Text>
        </Animated.View>
      </View>

      <View
        style={{ height: 46, marginTop: 14 }}
        onLayout={(e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width)}
        accessible
        accessibilityLabel={t("credit_score.util_a11y", {
          pct: Math.round(pct),
          status: t(`credit_score.status_${zone.key}`),
        })}
      >
        {w > 0 ? (
          <Svg width={w} height={46}>
            {ZONES.map((z) => {
              const x = (z.from / 100) * w + 1;
              const zw = ((z.to - z.from) / 100) * w - 2;
              const fillTo = Math.min(z.to, shownPct);
              const fw = ((fillTo - z.from) / 100) * w - 2;
              return (
                <G key={z.key}>
                  <Rect x={x} y={BAR_Y} width={zw} height={BAR_H} rx={6} fill={statusColors[z.key]} fillOpacity={0.22} />
                  {fillTo > z.from && fw > 0 ? (
                    <Rect x={x} y={BAR_Y} width={fw} height={BAR_H} rx={6} fill={statusColors[z.key]} />
                  ) : null}
                </G>
              );
            })}
            <Circle cx={knobX} cy={BAR_Y + BAR_H / 2} r={10} fill={colors.card} stroke={zoneColor} strokeWidth={4} />
            {ZONES.map((z, i) => (
              <SvgText
                key={`l-${z.key}`}
                x={i === 0 ? 0 : (((z.from + z.to) / 2) / 100) * w}
                y={42}
                fontSize={11}
                fill={colors.textMuted}
                textAnchor={i === 0 ? "start" : "middle"}
              >
                {t(`credit_score.status_${z.key}`)}
              </SvgText>
            ))}
          </Svg>
        ) : null}
      </View>

      <Animated.View style={[s.hint, { backgroundColor: colors.surface }, hintStyle]}>
        <MaterialCommunityIcons name="lightbulb-on-outline" size={16} color={colors.accent} />
        <Text style={[s.hintText, { color: colors.textSecondary }]}>
          {headroom >= 0
            ? t("credit_score.util_headroom", { amount: formatINR(headroom), pct: TARGET_PCT })
            : t("credit_score.util_over", { amount: formatINR(-headroom), pct: TARGET_PCT })}
        </Text>
      </Animated.View>
    </Card>
  );
}

const s = StyleSheet.create({
  top: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" },
  label: { fontSize: 12 },
  bigValue: { fontSize: 22, fontWeight: "700", letterSpacing: -0.3, marginTop: 2, fontVariant: ["tabular-nums"] },
  alignEnd: { alignItems: "flex-end" },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 2 },
  chipText: { fontSize: 12, fontWeight: "600" },
  hint: { flexDirection: "row", gap: 8, padding: 12, borderRadius: 12, marginTop: 6 },
  hintText: { flex: 1, fontSize: 13, lineHeight: 19 },
});
