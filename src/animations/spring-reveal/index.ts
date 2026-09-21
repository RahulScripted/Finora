import { useEffect } from "react";
import { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

/**
 * Drives a bottom-sheet reveal: the backdrop fades in and the content
 * springs up from below. Returns styles to spread onto the backdrop and
 * the sheet content.
 */
export function useSpringReveal(visible: boolean) {
  const progress = useSharedValue(0);
  const translateY = useSharedValue(80);

  useEffect(() => {
    if (visible) {
      progress.value = withTiming(1, { duration: 220 });
      translateY.value = withSpring(0, { damping: 16, stiffness: 140, mass: 0.7 });
    } else {
      progress.value = withTiming(0, { duration: 180 });
      translateY.value = withTiming(80, { duration: 180 });
    }
  }, [visible, progress, translateY]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: translateY.value }],
  }));

  return { backdropStyle, contentStyle };
}
