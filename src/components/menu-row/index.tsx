import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  icon: string;
  label: string;
  subtitle?: string;
  color: string;
  onPress?: () => void;
  danger?: boolean;
};

export default function MenuRow({ icon, label, subtitle, color, onPress, danger }: Props) {
  const { colors, resolved } = useTheme();
  const iconBg = color + (resolved === "dark" ? "22" : "14");

  return (
    <TouchableOpacity
      style={[s.card, { backgroundColor: colors.card }]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={[s.iconCircle, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons name={icon as any} size={20} color={color} />
      </View>
      <View style={s.content}>
        <Text style={[s.label, { color: danger ? colors.danger : colors.textPrimary }]}>
          {label}
        </Text>
        {subtitle && (
          <Text style={[s.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
        )}
      </View>
      {!danger && (
        <MaterialCommunityIcons name="chevron-right" size={18} color={colors.textMuted} />
      )}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 14,
  },
  iconCircle: { width: 40, height: 40, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  content: { flex: 1 },
  label: { fontSize: 14, fontWeight: "600" },
  subtitle: { fontSize: 11, marginTop: 2 },
});
