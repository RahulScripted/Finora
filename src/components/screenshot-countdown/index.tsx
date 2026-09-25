import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";

type Props = {
  active: boolean;
  seconds?: number;
  onComplete: () => void;
};

/**
 * Fullscreen 3-2-1 countdown. It hides itself just before firing `onComplete`
 * so the overlay is never part of the captured screenshot.
 */
export function ScreenshotCountdownOverlay({ active, seconds = 3, onComplete }: Props) {
  const { t } = useTranslation();
  const [count, setCount] = useState(seconds);
  const [hidden, setHidden] = useState(false);
  const scale = useSharedValue(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!active) return;

    let current = seconds;
    const pop = () => {
      scale.value = 1.4;
      scale.value = withTiming(1, { duration: 400 });
    };

    const tick = () => {
      if (current <= 1) {
        setHidden(true);
        setTimeout(() => onCompleteRef.current(), 60);
        return;
      }
      current -= 1;
      setCount(current);
      pop();
      timerRef.current = setTimeout(tick, 1000);
    };

    pop();
    timerRef.current = setTimeout(tick, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, seconds, scale]);

  const numStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!active || hidden) return null;

  return (
    <View style={s.overlay} pointerEvents="auto">
      <Animated.Text style={[s.count, numStyle]}>{count}</Animated.Text>
      <Text style={s.hint}>{t("support.capturing")}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999,
    elevation: 99999,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  count: { fontSize: 96, fontWeight: "900", color: "#fff" },
  hint: { color: "#fff", fontSize: 14, fontWeight: "600", marginTop: 8 },
});

export default ScreenshotCountdownOverlay;
