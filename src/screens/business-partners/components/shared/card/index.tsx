import { useTheme } from "@context/Theme/ThemeContext";
import { StyleSheet, View, type ViewStyle } from "react-native";
import type { ReactNode } from "react";

type Props = { children: ReactNode; padded?: boolean; tint?: string; style?: ViewStyle };

export default function Card({ children, padded, tint, style }: Props) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        s.card,
        { backgroundColor: tint ?? colors.card, borderColor: colors.border },
        padded && s.padded,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: 18, borderWidth: StyleSheet.hairlineWidth },
  padded: { padding: 16 },
});
