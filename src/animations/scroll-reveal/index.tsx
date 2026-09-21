import { useEffect, type ReactNode } from "react";
import { AccessibilityInfo, StyleSheet, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

type Props = {
  children: ReactNode;
  /** Stagger delay in ms before this item animates in. */
  delay?: number;
  /** Distance in px the item travels upward while fading in. */
  offset?: number;
  duration?: number;
  style?: ViewStyle;
};

/**
 * Fades + slides its children in on mount. Used to give the screen a smooth,
 * staggered "reveal" as sections appear. Honors the reduce-motion setting.
 */
export default function ScrollReveal({ children, delay = 0, offset = 18, duration = 480, style }: Props) {
  const progress = useSharedValue(0);

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (cancelled) return;
      if (reduce) {
        progress.value = 1;
        return;
      }
      progress.value = withDelay(delay, withTiming(1, { duration, easing: Easing.out(Easing.cubic) }));
    });
    return () => {
      cancelled = true;
    };
  }, [progress, delay, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * offset }],
  }));

  return <Animated.View style={[styles.fill, style, animatedStyle]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  fill: { width: "100%" },
});
