import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View, type ViewStyle } from "react-native";
import type { ComponentProps } from "react";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type Props = {
  icon?: IconName;
  title: string;
  description?: string;
  style?: ViewStyle;
};

/** Inline empty state used across the support screens. */
export default function EmptyState({ icon = "inbox-outline", title, description, style }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[s.wrap, style]}>
      <View style={[s.bubble, { backgroundColor: colors.surface }]}>
        <MaterialCommunityIcons name={icon} size={40} color={colors.textMuted} />
      </View>
      <Text style={[s.title, { color: colors.textPrimary }]}>{title}</Text>
      {description ? (
        <Text style={[s.desc, { color: colors.textSecondary }]}>{description}</Text>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 80, paddingHorizontal: 40, gap: 12 },
  bubble: { width: 88, height: 88, borderRadius: 44, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 16, fontWeight: "700", textAlign: "center" },
  desc: { fontSize: 13, textAlign: "center", lineHeight: 19 },
});
