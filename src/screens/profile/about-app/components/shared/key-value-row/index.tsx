import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
  value: string;
  last?: boolean;
  onPress?: () => void;
};

/** Label/value pair row. Optionally tappable (shown as a link). */
export default function KeyValueRow({ label, value, last, onPress }: Props) {
  const { colors } = useTheme();
  const isLink = !!onPress;
  return (
    <Pressable
      disabled={!isLink}
      onPress={onPress}
      accessibilityRole={isLink ? "link" : "text"}
      style={({ pressed }) => [
        s.row,
        !last && { borderBottomColor: colors.divider, borderBottomWidth: StyleSheet.hairlineWidth },
        pressed && s.pressed,
      ]}
    >
      <Text style={[s.label, { color: colors.textSecondary }]}>{label}</Text>
      <View style={s.valueWrap}>
        <Text
          style={[s.value, { color: isLink ? colors.accent : colors.textPrimary }]}
          numberOfLines={1}
        >
          {value}
        </Text>
        {isLink ? (
          <MaterialCommunityIcons name="arrow-top-right" size={15} color={colors.accent} />
        ) : null}
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 14,
  },
  label: { fontSize: 12 },
  value: { fontSize: 14, fontWeight: "600", lineHeight: 20 },
  valueWrap: { flexDirection: "row", alignItems: "center", gap: 3, flexShrink: 1 },
  pressed: { opacity: 0.6 },
});
