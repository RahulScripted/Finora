/**
 * BoxLoader — Reanimated port of the CSS "three morphing boxes" loader.
 * Uses the app accent color so it always matches the theme.
 */
import { useTheme } from "@context/Theme/ThemeContext";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";

const FULL = 112;
const HALF = 48;
const GAP = 64; // FULL - HALF
const DUR = 375; // each keyframe step = 3000ms / 8 steps
const EASE = Easing.inOut(Easing.ease);
const cfg = (d = DUR) => ({ duration: d, easing: EASE });
const DELAY = 1000;

export default function BoxLoader() {
  const { colors } = useTheme();
  const color = colors.accent;

  /* ---- box1: bottom-left ---- */
  const b1w = useSharedValue(FULL);
  const b1h = useSharedValue(HALF);
  const b1t = useSharedValue(GAP);
  const b1l = useSharedValue(0);

  /* ---- box2: top-left ---- */
  const b2w = useSharedValue(HALF);
  const b2h = useSharedValue(HALF);
  const b2t = useSharedValue(0);
  const b2l = useSharedValue(0);

  /* ---- box3: top-right ---- */
  const b3w = useSharedValue(HALF);
  const b3h = useSharedValue(HALF);
  const b3t = useSharedValue(0);
  const b3l = useSharedValue(GAP);

  useEffect(() => {
    // box1 animation
    b1w.value = withDelay(DELAY, withRepeat(withSequence(
      withTiming(HALF, cfg()), // 0→12.5%
      withTiming(HALF, cfg()), // 12.5→25%
      withTiming(HALF, cfg()), // 25→37.5%
      withTiming(HALF, cfg()), // 37.5→50%
      withTiming(HALF, cfg()), // 50→62.5%
      withTiming(HALF, cfg()), // 62.5→75%
      withTiming(HALF, cfg()), // 75→87.5%
      withTiming(HALF, cfg()), // 87.5→100%
    ), -1, false));
    b1h.value = withDelay(DELAY, withRepeat(withSequence(
      withTiming(HALF, cfg()),
      withTiming(HALF, cfg()),
      withTiming(HALF, cfg()),
      withTiming(HALF, cfg()),
      withTiming(HALF, cfg()),
      withTiming(HALF, cfg()),
      withTiming(FULL, cfg()),
      withTiming(HALF, cfg()),
    ), -1, false));
    b1t.value = withDelay(DELAY, withRepeat(withSequence(
      withTiming(GAP, cfg()),
      withTiming(GAP, cfg()),
      withTiming(GAP, cfg()),
      withTiming(GAP, cfg()),
      withTiming(GAP, cfg()),
      withTiming(GAP, cfg()),
      withTiming(0, cfg()),
      withTiming(0, cfg()),
    ), -1, false));
    b1l.value = withDelay(DELAY, withRepeat(withSequence(
      withTiming(0, cfg()),
      withTiming(0, cfg()),
      withTiming(0, cfg()),
      withTiming(0, cfg()),
      withTiming(0, cfg()),
      withTiming(0, cfg()),
      withTiming(0, cfg()),
      withTiming(0, cfg()),
    ), -1, false));

    // box2 animation
    b2w.value = withDelay(DELAY, withRepeat(withSequence(
      withTiming(HALF, cfg()),
      withTiming(HALF, cfg()),
      withTiming(HALF, cfg()),
      withTiming(HALF, cfg()),
      withTiming(FULL, cfg()),
      withTiming(HALF, cfg()),
      withTiming(HALF, cfg()),
      withTiming(HALF, cfg()),
    ), -1, false));
    b2h.value = withDelay(DELAY, withRepeat(withSequence(
      withTiming(HALF, cfg()),
      withTiming(HALF, cfg()),
      withTiming(HALF, cfg()),
      withTiming(HALF, cfg()),
      withTiming(HALF, cfg()),
      withTiming(HALF, cfg()),
      withTiming(HALF, cfg()),
      withTiming(HALF, cfg()),
    ), -1, false));
    b2t.value = withDelay(DELAY, withRepeat(withSequence(
      withTiming(0, cfg()),
      withTiming(0, cfg()),
      withTiming(0, cfg()),
      withTiming(0, cfg()),
      withTiming(0, cfg()),
      withTiming(0, cfg()),
      withTiming(0, cfg()),
      withTiming(0, cfg()),
    ), -1, false));
    b2l.value = withDelay(DELAY, withRepeat(withSequence(
      withTiming(0, cfg()),
      withTiming(0, cfg()),
      withTiming(0, cfg()),
      withTiming(0, cfg()),
      withTiming(0, cfg()),
      withTiming(GAP, cfg()),
      withTiming(GAP, cfg()),
      withTiming(GAP, cfg()),
    ), -1, false));

    // box3 animation
    b3w.value = withDelay(DELAY, withRepeat(withSequence(
      withTiming(HALF, cfg()),
      withTiming(HALF, cfg()),
      withTiming(HALF, cfg()),
      withTiming(HALF, cfg()),
      withTiming(HALF, cfg()),
      withTiming(HALF, cfg()),
      withTiming(HALF, cfg()),
      withTiming(FULL, cfg()),
    ), -1, false));
    b3h.value = withDelay(DELAY, withRepeat(withSequence(
      withTiming(HALF, cfg()),
      withTiming(HALF, cfg()),
      withTiming(FULL, cfg()),
      withTiming(HALF, cfg()),
      withTiming(HALF, cfg()),
      withTiming(HALF, cfg()),
      withTiming(HALF, cfg()),
      withTiming(HALF, cfg()),
    ), -1, false));
    b3t.value = withDelay(DELAY, withRepeat(withSequence(
      withTiming(0, cfg()),
      withTiming(0, cfg()),
      withTiming(0, cfg()),
      withTiming(GAP, cfg()),
      withTiming(GAP, cfg()),
      withTiming(GAP, cfg()),
      withTiming(GAP, cfg()),
      withTiming(GAP, cfg()),
    ), -1, false));
    b3l.value = withDelay(DELAY, withRepeat(withSequence(
      withTiming(GAP, cfg()),
      withTiming(GAP, cfg()),
      withTiming(GAP, cfg()),
      withTiming(GAP, cfg()),
      withTiming(GAP, cfg()),
      withTiming(GAP, cfg()),
      withTiming(GAP, cfg()),
      withTiming(0, cfg()),
    ), -1, false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const s1 = useAnimatedStyle(() => ({
    width: b1w.value, height: b1h.value,
    top: b1t.value, left: b1l.value,
  }));
  const s2 = useAnimatedStyle(() => ({
    width: b2w.value, height: b2h.value,
    top: b2t.value, left: b2l.value,
  }));
  const s3 = useAnimatedStyle(() => ({
    width: b3w.value, height: b3h.value,
    top: b3t.value, left: b3l.value,
  }));

  const boxStyle = [s.box, { backgroundColor: color }];

  return (
    <View style={s.wrap}>
      <Animated.View style={[boxStyle, s1]} />
      <Animated.View style={[boxStyle, s2]} />
      <Animated.View style={[boxStyle, s3]} />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { width: FULL, height: FULL, position: "relative" },
  box: { borderRadius: 10, position: "absolute" },
});
