import { useEffect } from "react";
import { AccessibilityInfo, Dimensions } from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";

const { height: SCREEN_H } = Dimensions.get("window");

const SPRING_OPEN = { damping: 14, stiffness: 70, mass: 1 };
const CLOSE_CONFIG = { duration: 300, easing: Easing.bezier(0.4, 0, 0.6, 1) };
const INSTANT = { duration: 0 };

let _reduceMotion = false;
AccessibilityInfo.isReduceMotionEnabled().then((v) => { _reduceMotion = v; });
AccessibilityInfo.addEventListener("reduceMotionChanged", (v) => { _reduceMotion = v; });

/**
 * Drives a bottom-sheet reveal: the backdrop fades in and the content
 * springs up from below with a subtle scale. Returns styles to spread
 * onto the backdrop and the sheet content.
 */
export function useSpringReveal(visible: boolean) {
  const backdrop = useSharedValue(0);
  const translateY = useSharedValue(SCREEN_H);
  const scale = useSharedValue(0.96);

  useEffect(() => {
    if (_reduceMotion) {
      backdrop.value = withTiming(visible ? 1 : 0, INSTANT);
      translateY.value = withTiming(visible ? 0 : SCREEN_H, INSTANT);
      scale.value = withTiming(visible ? 1 : 0.96, INSTANT);
      return;
    }
    if (visible) {
      backdrop.value = withTiming(1, { duration: 350 });
      translateY.value = withSpring(0, SPRING_OPEN);
      scale.value = withSpring(1, SPRING_OPEN);
    } else {
      backdrop.value = withTiming(0, CLOSE_CONFIG);
      translateY.value = withTiming(SCREEN_H, CLOSE_CONFIG);
      scale.value = withTiming(0.96, CLOSE_CONFIG);
    }
  }, [visible, backdrop, translateY, scale]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdrop.value }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return { backdropStyle, contentStyle };
}
