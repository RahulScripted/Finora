import { useTheme } from "@context/Theme/ThemeContext";
import { StyleSheet, Text } from "react-native";

export default function SectionLabel({ label }: { label: string }) {
  const { colors } = useTheme();
  return <Text style={[s.text, { color: colors.textMuted }]}>{label}</Text>;
}

const s = StyleSheet.create({
  text: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 8,
    marginTop: 4,
    marginHorizontal: 2,
  },
});
