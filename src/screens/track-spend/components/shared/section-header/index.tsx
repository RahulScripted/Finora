import { useTheme } from "@context/Theme/ThemeContext";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  action?: string;
  onAction?: () => void;
};

/** Section title with an optional right-aligned action link. */
export default function SectionHeader({ title, action, onAction }: Props) {
  const { colors } = useTheme();
  return (
    <View style={s.header}>
      <Text style={[s.title, { color: colors.textSecondary }]}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction} hitSlop={8} accessibilityRole="button">
          <Text style={[s.action, { color: onAction ? colors.accent : colors.textSecondary }]}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 8,
    marginHorizontal: 4,
  },
  title: { fontSize: 13, fontWeight: "600" },
  action: { fontSize: 13, fontWeight: "600" },
});
