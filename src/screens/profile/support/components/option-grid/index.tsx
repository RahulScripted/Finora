import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Pressable } from "react-native";

export type SupportOption = {
  id: string;
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
};

type Props = { options: SupportOption[] };

/** One tile with an entrance stagger + spring press-scale. */
function OptionTile({ opt, index }: { opt: SupportOption; index: number }) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).duration(360).easing(Easing.out(Easing.cubic))}
      style={[s.cell, style]}
    >
      <Pressable
        style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={opt.onPress}
        onPressIn={() => (scale.value = withTiming(0.96, { duration: 120 }))}
        onPressOut={() => (scale.value = withTiming(1, { duration: 120 }))}
        accessibilityRole="button"
      >
        <View style={[s.icon, { backgroundColor: opt.color + "18" }]}>
          <MaterialCommunityIcons name={opt.icon as any} size={24} color={opt.color} />
        </View>
        <Text style={[s.label, { color: colors.textPrimary }]}>{opt.label}</Text>
      </Pressable>
    </Animated.View>
  );
}

/** Grid of quick support actions — rounded-square icon tile with label below. */
export default function OptionGrid({ options }: Props) {
  return (
    <View style={s.grid}>
      {options.map((opt, i) => (
        <OptionTile key={opt.id} opt={opt} index={i} />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 14 },
  cell: { width: "47%", flexGrow: 1 },
  card: {
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 18,
    minHeight: 116,
    justifyContent: "space-between",
    gap: 14,
  },
  icon: { width: 48, height: 48, borderRadius: 15, justifyContent: "center", alignItems: "center" },
  label: { fontSize: 15, fontWeight: "700" },
});
