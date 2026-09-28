import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  /** Optional pill shown next to the title, e.g. "Quick & Easy". */
  badge?: string;
  /** Renders a right-aligned "View all" action when provided. */
  actionLabel?: string;
  onActionPress?: () => void;
};

/** Row heading with an optional badge and a trailing "View all" link. */
export default function SectionHeading({ title, badge, actionLabel, onActionPress }: Props) {
  const { colors } = useTheme();

  return (
    <View style={s.row}>
      <View style={s.left}>
        <Text style={[s.title, { color: colors.textPrimary }]}>{title}</Text>
        {badge ? (
          <View style={[s.badge, { backgroundColor: colors.success + "1F" }]}>
            <Text style={[s.badgeText, { color: colors.success }]}>{badge}</Text>
          </View>
        ) : null}
      </View>

      {actionLabel && onActionPress ? (
        <Pressable
          onPress={onActionPress}
          accessibilityRole="button"
          hitSlop={8}
          style={({ pressed }) => [s.action, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Text style={[s.actionText, { color: colors.accent }]}>{actionLabel}</Text>
          <MaterialCommunityIcons name="arrow-right" size={16} color={colors.accent} />
        </Pressable>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  left: { flexDirection: "row", alignItems: "center", gap: 10, flexShrink: 1 },
  title: { fontSize: 17, fontWeight: "800" },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: "700" },
  action: { flexDirection: "row", alignItems: "center", gap: 3 },
  actionText: { fontSize: 13, fontWeight: "700" },
});
