import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import type { ComponentProps } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import type { CreditSummary } from "@data-types/credit-score/constants";
import Card from "../shared/card";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

function TipRow({
  tip,
  last,
  animDelay,
}: {
  tip: CreditSummary["tips"][number];
  last: boolean;
  animDelay: number;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);
  opacity.value = withDelay(animDelay, withTiming(1, { duration: 380 }));
  translateY.value = withDelay(animDelay, withSpring(0, { damping: 16, stiffness: 110 }));

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        s.row,
        !last && { borderBottomColor: colors.divider, borderBottomWidth: StyleSheet.hairlineWidth },
        animStyle,
      ]}
    >
      <View style={[s.icon, { backgroundColor: colors.accent + "18" }]}>
        <MaterialCommunityIcons name={tip.icon as IconName} size={19} color={colors.accent} />
      </View>
      <View style={s.flex}>
        <Text style={[s.value, { color: colors.textPrimary }]}>
          {t(`credit_score.tip_${tip.id}_title`)}
        </Text>
        <Text style={[s.label, { color: colors.textSecondary, lineHeight: 17 }]}>
          {t(`credit_score.tip_${tip.id}_body`)}
        </Text>
      </View>
      <View style={[s.pts, { backgroundColor: colors.successSoft }]}>
        <Text style={[s.ptsText, { color: colors.success }]}>
          {t("credit_score.pts", { count: tip.points })}
        </Text>
      </View>
    </Animated.View>
  );
}

type Props = { data: CreditSummary };

export default function TipsCard({ data }: Props) {
  return (
    <Card>
      {data.tips.map((tip, i) => (
        <TipRow
          key={tip.id}
          tip={tip}
          last={i === data.tips.length - 1}
          animDelay={i * 80}
        />
      ))}
    </Card>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14, paddingHorizontal: 16 },
  flex: { flex: 1, minWidth: 0 },
  icon: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  value: { fontSize: 14, fontWeight: "600", lineHeight: 20 },
  label: { fontSize: 12 },
  pts: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 10 },
  ptsText: { fontSize: 12, fontWeight: "600" },
});
