import { useTheme } from "@context/Theme/ThemeContext";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = { children: ReactNode };

/** Pins a CTA to the bottom of the screen above the safe-area inset. */
export default function StickyFooter({ children }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        s.wrap,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.divider,
          paddingBottom: insets.bottom + 12,
        },
      ]}
    >
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
