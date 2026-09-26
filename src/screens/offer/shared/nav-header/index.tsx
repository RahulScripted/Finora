import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  onBack: () => void;
  /** Shows a right-side close (X) button that calls this when set. */
  onClose?: () => void;
};

/**
 * Centered title with a circular back button — matches the offer
 * detail and apply-flow headers in the design.
 */
export default function NavHeader({ title, onBack, onClose }: Props) {
  const { colors } = useTheme();

  return (
    <View style={s.row}>
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        hitSlop={8}
        style={[s.circle, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <MaterialCommunityIcons name="chevron-left" size={24} color={colors.textPrimary} />
      </Pressable>

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
        // Invisible spacer keeps the title centered without drawing a circle.
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
