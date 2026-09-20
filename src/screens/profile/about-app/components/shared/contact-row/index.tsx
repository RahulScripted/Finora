import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type Props = {
  icon: IconName;
  label: string;
  value: string;
  onPress: () => void;
  last?: boolean;
};

/** Tappable row with a leading icon, label/value, and an external-link affordance. */
export default function ContactRow({ icon, label, value, onPress, last }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${value}`}
      style={({ pressed }) => [
        s.row,
        !last && { borderBottomColor: colors.divider, borderBottomWidth: StyleSheet.hairlineWidth },
        pressed && s.pressed,
      ]}
    >
      <View style={[s.iconCircle, { backgroundColor: colors.accent + "18" }]}>
        <MaterialCommunityIcons name={icon} size={19} color={colors.accent} />
      </View>
      <View style={s.rowText}>
        <Text style={[s.rowLabel, { color: colors.textSecondary }]}>{label}</Text>
        <Text style={[s.rowValue, { color: colors.textPrimary }]} numberOfLines={1}>
          {value}
        </Text>
      </View>
      <MaterialCommunityIcons name="arrow-top-right" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 },
  rowText: { flex: 1, minWidth: 0 },
  rowLabel: { fontSize: 12 },
  rowValue: { fontSize: 14, fontWeight: "600", lineHeight: 20 },
  iconCircle: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  pressed: { opacity: 0.6 },
});
