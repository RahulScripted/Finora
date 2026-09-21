import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import type { CreditFactor, CreditSummary, FactorKey, FactorStatus } from "@data-types/credit-score/constants";
import { useStatusColors } from "../shared/use-band-colors";
import Card from "../shared/card";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const GRADE: Record<FactorStatus, string> = { great: "A", good: "B", fair: "C", poor: "D" };

/** Impact shown as a compact badge, no dots. */
function ImpactBadge({ level, colors }: { level: "high" | "medium" | "low"; colors: any }) {
  const { t } = useTranslation();
  const bg = level === "high" ? colors.accent + "18" : colors.surface;
  const fg = level === "high" ? colors.accent : colors.textMuted;
  return (
    <View style={[ib.badge, { backgroundColor: bg }]}>
      <Text style={[ib.text, { color: fg }]}>{t(`credit_score.impact_${level}`)}</Text>
    </View>
  );
}
const ib = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  text: { fontSize: 11, fontWeight: "500" },
});

function FactorRow({
  factor, open, last, onToggle, animDelay,
}: {
  factor: CreditFactor;
  open: boolean;
  last: boolean;
  onToggle: () => void;
  animDelay: number;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const statusColors = useStatusColors();
  const color = statusColors[factor.status];
  const title = t(`credit_score.factor_${factor.key}`);

  // Stagger-slide in
  const translateX = useSharedValue(24);
  const opacity = useSharedValue(0);
  translateX.value = withDelay(animDelay, withSpring(0, { damping: 18, stiffness: 120 }));
  opacity.value = withDelay(animDelay, withSpring(1, { damping: 20, stiffness: 140 }));
  const rowStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      style={[
        rowStyle,
        !last && { borderBottomColor: colors.divider, borderBottomWidth: StyleSheet.hairlineWidth },
      ]}
    >
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`${title}, ${factor.value}, ${t(`credit_score.status_${factor.status}`)}, ${t(`credit_score.impact_${factor.impact}`)}`}
        style={({ pressed }) => [s.row, pressed && s.pressed]}
      >
        <View style={[s.grade, { backgroundColor: color + "26" }]}>
          <Text style={[s.gradeText, { color }]}>{GRADE[factor.status]}</Text>
        </View>
        <View style={s.flex}>
          <Text style={[s.value, { color: colors.textPrimary }]} numberOfLines={1}>{title}</Text>
          <ImpactBadge level={factor.impact} colors={colors} />
        </View>
        <View style={s.alignEnd}>
          <Text style={[s.value, { color: colors.textPrimary }]}>{factor.value}</Text>
          <Text style={[s.statusText, { color }]}>{t(`credit_score.status_${factor.status}`)}</Text>
        </View>
        <MaterialCommunityIcons
          name={open ? "chevron-up" : "chevron-down"}
          size={20}
          color={colors.textMuted}
        />
      </Pressable>
      {open ? (
        <View style={[s.tip, { backgroundColor: colors.surface }]}>
          <MaterialCommunityIcons name="lightbulb-on-outline" size={16} color={colors.accent} />
          <Text style={[s.tipText, { color: colors.textSecondary }]}>
            {t(`credit_score.factor_${factor.key}_tip`)}
          </Text>
        </View>
      ) : null}
    </Animated.View>
  );
}

type Props = { data: CreditSummary };

export default function FactorsCard({ data }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const statusColors = useStatusColors();
  const [open, setOpen] = useState<FactorKey | null>(null);

  const strong = data.factors.filter((f) => f.status === "great" || f.status === "good").length;
  const fair = data.factors.filter((f) => f.status === "fair").length;
  const poor = data.factors.filter((f) => f.status === "poor").length;

  const toggle = (key: FactorKey) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((cur) => (cur === key ? null : key));
  };

  return (
    <Card>
      <View style={[s.summary, { borderBottomColor: colors.divider, borderBottomWidth: StyleSheet.hairlineWidth }]}>
        <View style={s.segmentBar}>
          {data.factors.map((f) => (
            <View key={f.key} style={[s.segment, { backgroundColor: statusColors[f.status] }]} />
          ))}
        </View>
        <Text style={[s.summaryText, { color: colors.textSecondary, marginTop: 8 }]}>
          {t("credit_score.factors_summary", { strong, fair, poor })}
        </Text>
      </View>
      {data.factors.map((f, i) => (
        <FactorRow
          key={f.key}
          factor={f}
          open={open === f.key}
          last={i === data.factors.length - 1}
          onToggle={() => toggle(f.key)}
          animDelay={i * 60}
        />
      ))}
    </Card>
  );
}

const s = StyleSheet.create({
  summary: { paddingTop: 16, paddingBottom: 14, paddingHorizontal: 16 },
  segmentBar: { flexDirection: "row", gap: 4 },
  segment: { flex: 1, height: 6, borderRadius: 3 },
  summaryText: { fontSize: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, paddingHorizontal: 16 },
  flex: { flex: 1, minWidth: 0, gap: 4 },
  alignEnd: { alignItems: "flex-end" },
  pressed: { opacity: 0.6 },
  grade: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  gradeText: { fontSize: 16, fontWeight: "700" },
  value: { fontSize: 14, fontWeight: "600", lineHeight: 20 },
  statusText: { fontSize: 12, fontWeight: "500" },
  tip: { flexDirection: "row", gap: 8, marginHorizontal: 16, marginBottom: 12, padding: 12, borderRadius: 12 },
  tipText: { flex: 1, fontSize: 13, lineHeight: 19 },
});
