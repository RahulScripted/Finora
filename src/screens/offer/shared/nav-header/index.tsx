import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  /** Shows a right-side close (X) button that calls this when set. */
  onClose?: () => void;
};

/**
 * Centered title with an optional right-side close (X) button. No back button
 * — offer screens are dismissed via the tab bar / close action.
 */
export default function NavHeader({ title, onClose }: Props) {
  const { colors } = useTheme();

  return (
    <View style={s.row}>
      {/* Left spacer keeps the title centered without a back button. */}
      <View style={s.spacer} />

      <Text style={[s.title, { color: colors.textPrimary }]} numberOfLines={1}>
        {title}
      </Text>

      {onClose ? (
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          hitSlop={8}
          style={[s.circle, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <MaterialCommunityIcons name="close" size={20} color={colors.textPrimary} />
        </Pressable>
      ) : (
        <View style={s.spacer} />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  circle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  spacer: { width: 38, height: 38 },
  title: { flex: 1, textAlign: "center", fontSize: 17, fontWeight: "700" },
});
