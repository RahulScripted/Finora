import { useTheme } from "@context/Theme/ThemeContext";
import { StyleSheet, Text } from "react-native";

/** Section label above each day's transactions ("Today", "Yesterday", a date). */
export default function DateGroupHeader({ label }: { label: string }) {
  const { colors } = useTheme();
  return <Text style={[s.label, { color: colors.textSecondary }]}>{label}</Text>;
}

const s = StyleSheet.create({
  label: { fontSize: 13, fontWeight: "600", marginTop: 20, marginBottom: 6 },
});
