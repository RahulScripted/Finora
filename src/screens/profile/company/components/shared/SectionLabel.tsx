import { useTheme } from "@context/Theme/ThemeContext";
import { StyleSheet, Text } from "react-native";

export default function SectionLabel({ label }: { label: string }) {
  const { colors } = useTheme();
  return <Text style={[s.text, { color: colors.textMuted }]}>{label}</Text>;
}

const s = StyleSheet.create({
  text: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 8,
    marginLeft: 2,
    marginTop: 4,
  },
});
