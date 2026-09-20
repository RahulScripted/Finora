import { useTheme } from "@context/Theme/ThemeContext";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

type Props = { children: ReactNode; padded?: boolean };

/** Rounded, bordered container that groups rows of content. */
export default function InfoCard({ children, padded }: Props) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        s.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        padded && s.cardPadded,
      ]}
    >
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 16 },
  cardPadded: { paddingVertical: 16 },
});
