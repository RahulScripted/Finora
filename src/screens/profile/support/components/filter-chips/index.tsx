import { useTheme } from "@context/Theme/ThemeContext";
import { ScrollView, StyleSheet, Text } from "react-native";
import Animated, {
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Pressable } from "react-native";

export type FilterChip = { key: string; label: string; count: number };

type Props = {
  chips: FilterChip[];
  value: string;
  onChange: (key: string) => void;
};

function Chip({ chip, active, onPress }: { chip: FilterChip; active: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View layout={LinearTransition.duration(220)} style={style}>
      <Pressable
        onPress={onPress}
        onPressIn={() => (scale.value = withTiming(0.94, { duration: 120 }))}
        onPressOut={() => (scale.value = withTiming(1, { duration: 120 }))}
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
        style={[
          s.chip,
          {
            backgroundColor: active ? colors.accent : colors.card,
            borderColor: active ? colors.accent : colors.border,
          },
        ]}
      >
        <Text
          style={[
            s.label,
            { color: active ? "#fff" : colors.textSecondary, fontWeight: active ? "700" : "500" },
          ]}
        >
          {chip.label}
        </Text>
        <Text
          style={[
            s.count,
            {
              color: active ? "#fff" : colors.textMuted,
              backgroundColor: active ? "rgba(255,255,255,0.22)" : colors.surface,
            },
          ]}
        >
          {chip.count}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

/** Horizontally scrollable status filter chips with counts. */
export default function FilterChips({ chips, value, onChange }: Props) {
  const { colors } = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.row}
    >
      {chips.map((chip) => (
        <Chip key={chip.key} chip={chip} active={chip.key === value} onPress={() => onChange(chip.key)} />
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  row: { gap: 8, paddingVertical: 2 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: { fontSize: 13 },
  count: {
    fontSize: 11,
    fontWeight: "700",
    minWidth: 18,
    textAlign: "center",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 9,
    overflow: "hidden",
  },
});
