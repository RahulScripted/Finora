import { useTheme } from "@context/Theme/ThemeContext";
import { StyleSheet, Text, View } from "react-native";
import type { ReactNode } from "react";

type Props = { title: string; action?: ReactNode };

export default function SectionHeader({ title, action }: Props) {
  const { colors } = useTheme();
  return (
    <View style={s.row}>
      <Text style={[s.title, { color: colors.textSecondary }]}>{title}</Text>
      {action ? <View>{action}</View> : null}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 24, marginBottom: 8, marginLeft: 4 },
  title: { fontSize: 13, fontWeight: "600" },
});
