import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { AccessibilityInfo, StyleSheet, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

// ─── Context ──────────────────────────────────────────────────────────────────
// Parent passes its scrollY SharedValue down so each ScrollReveal can
// react to it on the UI thread without any JS-thread subscriber overhead.

type Ctx = {
  scrollY: SharedValue<number>;
  viewportH: SharedValue<number>;
};

const FALLBACK_SCROLL_Y: SharedValue<number> = { value: 0 } as SharedValue<number>;
const FALLBACK_VIEWPORT_H: SharedValue<number> = { value: 800 } as SharedValue<number>;

const ScrollRevealContext = createContext<Ctx>({
  scrollY: FALLBACK_SCROLL_Y,
  viewportH: FALLBACK_VIEWPORT_H,
});

export function ScrollRevealProvider({ children }: { children: ReactNode }) {
  const scrollY = useSharedValue(0);
  const viewportH = useSharedValue(800);

  return (
    <ScrollRevealContext.Provider value={{ scrollY, viewportH }}>
      {children}
    </ScrollRevealContext.Provider>
  );
}

/** Returns { scrollY, viewportH } shared values to wire into the ScrollView. */
export function useScrollRevealValues() {
  return useContext(ScrollRevealContext);
}

// ─── ScrollReveal ─────────────────────────────────────────────────────────────

type Props = {
  children: ReactNode;
  delay?: number;
  offset?: number;
  duration?: number;
  style?: ViewStyle;
};

export default function ScrollReveal({
  children,
  delay = 0,
  offset = 28,
  duration = 500,
  style,
}: Props) {
  const { scrollY, viewportH } = useContext(ScrollRevealContext);
  const progress = useSharedValue(0);
  const triggered = useRef(false);
  const layoutY = useRef<number | null>(null);

  // Called both from onLayout and from the scroll listener
  function tryTrigger(sy: number, vh: number) {
    if (triggered.current || layoutY.current === null) return;
    // Trigger when the top of the item is within 95% of the visible viewport
    if (layoutY.current > sy + vh * 0.95) return;
    triggered.current = true;
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      progress.value = reduce
        ? 1
        : withDelay(delay, withTiming(1, { duration, easing: Easing.out(Easing.cubic) }));
    });
  }

  // Re-check on every scroll tick via a reaction on the shared values
  useEffect(() => {
    // Poll every 16ms while not yet triggered — lightweight since it stops once triggered
    const id = setInterval(() => {
      if (triggered.current) {
        clearInterval(id);
        return;
      }
      tryTrigger(scrollY.value, viewportH.value);
    }, 16);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollY, viewportH]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * offset }],
  }));

  return (
    <Animated.View
      onLayout={(e) => {
        layoutY.current = e.nativeEvent.layout.y;
        tryTrigger(scrollY.value, viewportH.value);
      }}
      style={[s.fill, style, animatedStyle]}
    >
      {children}
    </Animated.View>
  );
}

const s = StyleSheet.create({ fill: { width: "100%" } });
