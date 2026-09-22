import LogoSvg from "./logo.svg";
import { useEffect } from "react";
import Svg, { Path } from "react-native-svg";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const AnimatedPath = Animated.createAnimatedComponent(Path);

export function Logo({ size = 72 }: { size?: number }) {
  return <LogoSvg width={size} height={size} />;
}

export function AnimatedTick({ size = 80, color = "#57b849", active = true }: { size?: number; color?: string; active?: boolean }) {
  const circleDash = useSharedValue(345);
  const circleRot  = useSharedValue(0);
  const checkDash  = useSharedValue(122);

  useEffect(() => {
    if (!active) {
      cancelAnimation(circleDash);
      cancelAnimation(circleRot);
      cancelAnimation(checkDash);
      circleDash.value = 345;
      circleRot.value  = 0;
      checkDash.value  = 122;
      return;
    }

    circleDash.value = withRepeat(
      withSequence(
        withTiming(345, { duration: 500 }),
        withTiming(0,   { duration: 1500, easing: Easing.bezier(0.42, 0, 1, 1) }),
        withTiming(0,   { duration: 1500 }),
        withTiming(345, { duration: 0 }),
        withTiming(345, { duration: 800 }),
      ), -1, false,
    );

    circleRot.value = withRepeat(
      withSequence(
        withTiming(0,   { duration: 500 }),
        withTiming(360, { duration: 1500, easing: Easing.bezier(0.42, 0, 1, 1) }),
        withTiming(360, { duration: 1500 }),
        withTiming(0,   { duration: 0 }),
        withTiming(0,   { duration: 800 }),
      ), -1, false,
    );

    checkDash.value = withRepeat(
      withSequence(
        withTiming(122, { duration: 2000 }),
        withTiming(0,   { duration: 700, easing: Easing.bezier(0.19, 1, 0.22, 1) }),
        withTiming(0,   { duration: 1500 }),
        withTiming(122, { duration: 0 }),
        withTiming(122, { duration: 800 }),
      ), -1, false,
    );

    return () => {
      cancelAnimation(circleDash);
      cancelAnimation(circleRot);
      cancelAnimation(checkDash);
    };
  }, [active]);

  const circleProps = useAnimatedProps(() => ({
    strokeDashoffset: circleDash.value,
    transform: [
      { translateX: 75 }, { translateY: 75 },
      { rotate: `${circleRot.value}deg` },
      { translateX: -75 }, { translateY: -75 },
    ],
  }));

  const checkProps = useAnimatedProps(() => ({ strokeDashoffset: checkDash.value }));

  return (
    <Svg width={size} height={size} viewBox="0 0 150 150">
      <AnimatedPath
        d="M141,69v6c0,37.5-31.3,67.7-69.2,65.9c-33.8-1.6-61.2-29-62.8-62.8C7.3,40.2,37.6,9,75,9c9.2,0,18.4,2,26.8,5.7"
        fill="none" stroke={color} strokeWidth={13.3}
        strokeLinejoin="round" strokeLinecap="round"
        strokeDasharray={345} animatedProps={circleProps}
      />
      <AnimatedPath
        d="M139.9,22.2l-66,66.1L54.1,68.5"
        fill="none" stroke={color} strokeWidth={13.3}
        strokeLinejoin="round" strokeLinecap="square"
        strokeDasharray={122} animatedProps={checkProps}
      />
    </Svg>
  );
}
