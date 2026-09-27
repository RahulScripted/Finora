import { useEffect, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Ellipse, Path } from "react-native-svg";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

// Festive balloon palette.
const COLORS = ["#FF5A36", "#FFC24B", "#16A477", "#3787D8", "#8B5CF6", "#FF8A6D", "#E5484D"];

type BalloonSpec = {
  id: number;
  x: number; // horizontal start (px)
  size: number; // balloon width (px)
  color: string;
  delay: number; // ms before it starts rising
  duration: number; // ms to travel up
  drift: number; // horizontal sway amplitude (px)
};

type Props = {
  /** Whether the balloons are animating. */
  active?: boolean;
  /** Number of balloons to float up. */
  count?: number;
};

export default function Balloons({ active = true, count = 14 }: Props) {
  const specs = useMemo<BalloonSpec[]>(() => {
    return Array.from({ length: count }).map((_, i) => {
      const size = 46 + Math.random() * 40;
      return {
        id: i,
        x: Math.random() * (SCREEN_W - size),
        size,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 900,
        duration: 4200 + Math.random() * 2600,
        drift: 14 + Math.random() * 26,
      };
    });
  }, [count]);

  if (!active) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {specs.map((spec) => (
        <Balloon key={spec.id} spec={spec} />
      ))}
    </View>
  );
}

function Balloon({ spec }: { spec: BalloonSpec }) {
  const rise = useSharedValue(0);
  const sway = useSharedValue(0);

  useEffect(() => {
    // Rise once from below the screen to above it.
    rise.value = withDelay(
      spec.delay,
      withTiming(1, { duration: spec.duration, easing: Easing.out(Easing.quad) }),
    );

    // Continuous gentle side-to-side sway.
    sway.value = withDelay(
      spec.delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
          withTiming(-1, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => {
    const startY = SCREEN_H + spec.size;
    const endY = -spec.size * 3;
    const translateY = startY + (endY - startY) * rise.value;
    return {
      transform: [
        { translateX: spec.x + sway.value * spec.drift },
        { translateY },
        { rotate: `${sway.value * 6}deg` },
      ],
      opacity: rise.value > 0.92 ? (1 - rise.value) / 0.08 : 1,
    };
  });

  const w = spec.size;
  const h = spec.size * 1.25;

  return (
    <Animated.View style={[styles.balloon, { width: w, height: h + 40 }, style]}>
      <Svg width={w} height={h + 40} viewBox={`0 0 ${w} ${h + 40}`}>
        {/* String */}
        <Path
          d={`M ${w / 2} ${h} q 6 12 -2 22 q -8 10 2 18`}
          stroke="rgba(120,120,120,0.6)"
          strokeWidth={1}
          fill="none"
        />
        {/* Balloon body */}
        <Ellipse cx={w / 2} cy={h / 2} rx={w / 2} ry={h / 2} fill={spec.color} />
        {/* Highlight */}
        <Ellipse cx={w / 2 - w * 0.16} cy={h / 2 - h * 0.18} rx={w * 0.12} ry={h * 0.16} fill="rgba(255,255,255,0.35)" />
        {/* Knot */}
        <Path
          d={`M ${w / 2 - 5} ${h - 2} L ${w / 2 + 5} ${h - 2} L ${w / 2} ${h + 6} Z`}
          fill={spec.color}
        />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  balloon: { position: "absolute", top: 0, left: 0 },
});
