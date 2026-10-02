import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps, ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type Props = {
  title: string;
  subtitle: string;
  /** Pre-formatted, signed amount shown top-right (e.g. "+ ₹480"). */
  amount: string;
  amountColor: string;
  /** Pre-formatted date/time shown bottom-right. */
  timestamp: string;
  /** Leading icon name, with a soft tinted square behind it. */
  icon: IconName;
  iconColor: string;
  iconBg: string;
  /** Optional custom leading element (e.g. a brand logo) overrides the icon. */
  leading?: ReactNode;
  onPress?: () => void;
};

/**
 * Flat transaction row for a date-grouped statement list: leading icon on the
 * left with title/subtitle, signed amount over a timestamp on the right.
 * Borderless by design — rows are separated by whitespace, not cards.
 */
export default function TransactionListItem({
  title,
  subtitle,
  amount,
  amountColor,
  timestamp,
  icon,
  iconColor,
  iconBg,
  leading,
  onPress,
}: Props) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${amount}`}
      style={({ pressed }) => [s.row, pressed && s.pressed]}
    >
      {leading ?? (
        <View style={[s.icon, { backgroundColor: iconBg }]}>
          <MaterialCommunityIcons name={icon} size={22} color={iconColor} />
        </View>
      )}

      <View style={s.body}>
        <Text style={[s.title, { color: colors.textPrimary }]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={[s.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>

      <View style={s.right}>
        <Text style={[s.amount, { color: amountColor }]} numberOfLines={1}>
          {amount}
        </Text>
        <Text style={[s.time, { color: colors.textMuted }]} numberOfLines={1}>
          {timestamp}
        </Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 12 },
  pressed: { opacity: 0.6 },
  icon: { width: 46, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  body: { flex: 1, minWidth: 0, gap: 3 },
  title: { fontSize: 15, fontWeight: "700", lineHeight: 20 },
  subtitle: { fontSize: 13 },
  right: { alignItems: "flex-end", gap: 3, minWidth: 108 },
  amount: { fontSize: 15, fontWeight: "700", fontVariant: ["tabular-nums"] },
  time: { fontSize: 12 },
});
