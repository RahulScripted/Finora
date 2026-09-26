import { useTheme } from "@context/Theme/ThemeContext";
import { StyleSheet, View } from "react-native";

type Props = {
  /** Total number of steps in the flow. */
  total: number;
  /** Zero-based index of the current step. */
  current: number;
};

/** Segmented progress bar shown under the apply-flow header. */
export default function StepProgress({ total, current }: Props) {
  const { colors } = useTheme();

  return (
    <View style={s.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            s.segment,
            { backgroundColor: i <= current ? colors.accent : colors.border },
          ]}
        />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: "row", gap: 6 },
  segment: { flex: 1, height: 4, borderRadius: 2 },
});
