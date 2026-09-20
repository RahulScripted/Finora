import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  name: string;
  email: string;
  onPress: () => void;
};

export default function ProfileCard({ name, email, onPress }: Props) {
  const { colors, resolved } = useTheme();
  const initial = name.trim().charAt(0).toUpperCase();
  const avatarBg = colors.primary + (resolved === "dark" ? "22" : "14");

  return (
    <TouchableOpacity
      style={[s.card, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[s.avatar, { backgroundColor: avatarBg }]}>
        <Text style={[s.initial, { color: colors.primary }]}>{initial}</Text>
      </View>
      <View style={s.info}>
        <Text style={[s.name, { color: colors.textPrimary }]}>{name}</Text>
        <Text style={[s.email, { color: colors.textMuted }]}>{email}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 16,
  },
  avatar: { width: 44, height: 44, borderRadius: 22, justifyContent: "center", alignItems: "center" },
  initial: { fontSize: 18, fontWeight: "700" },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: "700" },
  email: { fontSize: 12, marginTop: 2 },
});
