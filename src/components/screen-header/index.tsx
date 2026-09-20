import { useTheme } from "@context/Theme/ThemeContext";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
};

export default function ScreenHeader({ title }: Props) {
  const { colors } = useTheme();

  return (
    <View style={s.row}>
      <Text style={[s.title, { color: colors.textPrimary }]}>{title}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  row: { marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "700" },
});
