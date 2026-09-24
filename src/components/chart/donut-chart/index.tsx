import { useTheme } from "@context/Theme/ThemeContext";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import type { DonutChartProps } from "@data-types/chart/constants";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function Slice({
  size,
  stroke,
  circumference,
  color,
  fraction,
  offset,
}: {
  size: number;
  stroke: number;
  circumference: number;
  color: string;
  fraction: number;
  offset: number;
}) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => {
    const len = circumference * fraction * progress.value;
    return {
      strokeDasharray: `${len} ${circumference - len}`,
      strokeDashoffset: -circumference * offset,
    };
  });

  const r = (size - stroke) / 2;
  return (
    <AnimatedCircle
      cx={size / 2}
      cy={size / 2}
      r={r}
      stroke={color}
      strokeWidth={stroke}
      fill="none"
      strokeLinecap="butt"
      animatedProps={animatedProps}
      transform={`rotate(-90 ${size / 2} ${size / 2})`}
    />
  );
}

/**
 * Generic animated donut. Pass `slices` as percentages (0–100); they should
 * sum to ~100. Render anything in the middle via `centerContent`.
 */
export default function DonutChart({
  slices,
  size = 120,
  stroke = 16,
  centerContent,
  trackColor,
}: DonutChartProps) {
  const { colors } = useTheme();
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;

  let acc = 0;
  const withOffsets = slices.map((sl) => {
    const fraction = sl.pct / 100;
    const entry = { ...sl, fraction, offset: acc };
    acc += fraction;
    return entry;
  });

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={trackColor ?? colors.surface}
          strokeWidth={stroke}
          fill="none"
        />
        {withOffsets.map((sl) => (
          <Slice
            key={sl.key}
            size={size}
            stroke={stroke}
            circumference={circumference}
            color={sl.color}
            fraction={sl.fraction}
            offset={sl.offset}
          />
        ))}
      </Svg>
      {centerContent ? (
        <View style={s.center} pointerEvents="none">
          {centerContent}
        </View>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  center: { ...StyleSheet.absoluteFill, alignItems: "center", justifyContent: "center" },
});
