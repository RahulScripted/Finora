import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import type { SupportTicket } from "@data-types/support/constants";
import { TICKET_STATUS_CONFIG } from "@data-types/support/constants";

type Props = { ticket: SupportTicket; onPress?: () => void };

/** Compact ticket row for the Track list. The step tracker lives in the detail. */
export default function TicketCard({ ticket, onPress }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const cfg = TICKET_STATUS_CONFIG[ticket.status];
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const date = new Date(ticket.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Animated.View style={animStyle}>
    <Pressable
      style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      onPressIn={() => (scale.value = withTiming(0.98, { duration: 120 }))}
      onPressOut={() => (scale.value = withTiming(1, { duration: 120 }))}
      accessibilityRole="button"
    >
      <View style={s.top}>
        <Text style={[s.id, { color: colors.textPrimary }]}>{ticket.id}</Text>
        <View style={[s.badge, { backgroundColor: cfg.color + "20" }]}>
          <View style={[s.badgeDot, { backgroundColor: cfg.color }]} />
          <Text style={[s.badgeText, { color: cfg.color }]}>{t(cfg.labelKey)}</Text>
        </View>
      </View>

      <Text style={[s.category, { color: colors.accent }]}>
        {ticket.category} | {ticket.subcategory}
      </Text>
      <Text style={[s.desc, { color: colors.textSecondary }]} numberOfLines={2}>
        {ticket.description}
      </Text>

      <View style={[s.divider, { backgroundColor: colors.divider }]} />

      <View style={s.footer}>
        <Text style={[s.date, { color: colors.textMuted }]}>{t("support.raised_on", { date })}</Text>
        <MaterialCommunityIcons name="chevron-right" size={18} color={colors.textMuted} />
      </View>
    </Pressable>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, padding: 16, gap: 6 },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  id: { fontSize: 15, fontWeight: "700" },
  badge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 11, fontWeight: "700" },
  category: { fontSize: 12, fontWeight: "600" },
  desc: { fontSize: 13, lineHeight: 20 },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 8 },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 },
  date: { fontSize: 11 },
});
