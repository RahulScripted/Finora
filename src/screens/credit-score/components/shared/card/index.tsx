import { useTheme } from "@context/Theme/ThemeContext";
import { StyleSheet, View, type ReactNode } from "react-native";

type Props = { children: ReactNode; padded?: boolean; tint?: string };

export default function Card({ children, padded, tint }: Props) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        s.card,
        { backgroundColor: tint ?? colors.card, borderColor: colors.border },
        padded && s.padded,
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
