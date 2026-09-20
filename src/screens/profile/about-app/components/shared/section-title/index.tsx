import { useTheme } from "@context/Theme/ThemeContext";
import { StyleSheet, Text } from "react-native";

type Props = { children: string };

/** Small label shown above each grouped card. */
export default function SectionTitle({ children }: Props) {
  const { colors } = useTheme();
  return <Text style={[s.title, { color: colors.textSecondary }]}>{children}</Text>;
}

const s = StyleSheet.create({
  title: { fontSize: 13, fontWeight: "600", marginTop: 24, marginBottom: 8, marginLeft: 4 },
});
