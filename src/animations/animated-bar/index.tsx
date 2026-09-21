import { useEffect } from "react";
import { AccessibilityInfo } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { Rect } from "react-native-svg";

const AnimatedRect = Animated.createAnimatedComponent(Rect);

type Props = {
  x: number;
  /** Baseline y (bars grow upward from here). */
  baseline: number;
  width: number;
  /** Final bar height. */
  height: number;
  rx: number;
  fill: string;
  /** Stagger delay in ms. */
  delay?: number;
};

/** A single SVG bar that grows up from the baseline on mount. */
export default function AnimatedBar({ x, baseline, width, height, rx, fill, delay = 0 }: Props) {
  const progress = useSharedValue(0);

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (cancelled) return;
      if (reduce) {
        progress.value = 1;
        return;
      }
      progress.value = withDelay(delay, withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) }));
    });
    return () => {
      cancelled = true;
    };
  }, [progress, delay, height]);

  const animatedProps = useAnimatedProps(() => {
    const h = height * progress.value;
    return { y: baseline - h, height: h };
  });

  return <AnimatedRect x={x} width={width} rx={rx} fill={fill} animatedProps={animatedProps} />;
}
