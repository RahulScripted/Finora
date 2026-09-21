import { useTheme } from "@context/Theme/ThemeContext";
import { StyleSheet, Text, View } from "react-native";

type Props = { title: string };

export default function SectionHeader({ title }: Props) {
  const { colors } = useTheme();
  return (
    <Text style={[s.title, { color: colors.textSecondary }]}>{title}</Text>
  );
}

const s = StyleSheet.create({
  title: { fontSize: 13, fontWeight: "600", marginTop: 24, marginBottom: 8, marginLeft: 4 },
});
