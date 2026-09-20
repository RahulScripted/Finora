import React, { useCallback, useRef } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

function TeardropDot({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 10 10">
      <Path
        d="M5 0 C7.5 0, 10 2.5, 10 5 C10 7.75, 7.75 10, 5 10 C2.25 10, 0 7.75, 0 5 C0 2.5, 2.5 0, 5 0 Z"
        fill={color}
      />
    </Svg>
  );
}

type Props = {
  children: React.ReactNode;
  accentColor: string;
  onComplete: () => void;
  style?: any;
};

export default function AnimatedIconPress({ children, accentColor, onComplete, style }: Props) {
  const dropProgress = useSharedValue(0);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);
  const nudgeY = useSharedValue(0);
  const animating = useRef(false);

  const handlePress = useCallback(() => {
    if (animating.current) return;
    animating.current = true;

    dropProgress.value = 0;
    dropProgress.value = withTiming(1, { duration: 350, easing: Easing.in(Easing.quad) });

    const delay = 300;
    scaleX.value = withDelay(delay, withSequence(
      withTiming(0.9, { duration: 125, easing: Easing.out(Easing.quad) }),
      withTiming(1.1, { duration: 250, easing: Easing.out(Easing.quad) }),
      withTiming(1, { duration: 125, easing: Easing.out(Easing.quad) }),
    ));
    scaleY.value = withDelay(delay, withSequence(
      withTiming(1.2, { duration: 125, easing: Easing.out(Easing.quad) }),
      withTiming(0.95, { duration: 250, easing: Easing.out(Easing.quad) }),
      withTiming(1, { duration: 125, easing: Easing.out(Easing.quad) }),
    ));
    nudgeY.value = withDelay(delay, withSequence(
      withTiming(6, { duration: 125, easing: Easing.out(Easing.quad) }),
      withTiming(-2, { duration: 250, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 125, easing: Easing.out(Easing.quad) }, () => {
        runOnJS(onComplete)();
        animating.current = false;
      }),
    ));
  }, [onComplete]);

  const dropStyle = useAnimatedStyle(() => {
    const translateY = interpolate(dropProgress.value, [0, 0.7, 1], [-30, -7, 3]);
    const sx = interpolate(dropProgress.value, [0, 0.7, 1], [1, 1, 1.5]);
    const sy = interpolate(dropProgress.value, [0, 0.7, 1], [1, 2, 0.5]);
    const opacity = interpolate(dropProgress.value, [0, 0.03, 0.85, 1], [0, 1, 1, 0]);
    return {
      transform: [{ translateY }, { scaleX: sx }, { scaleY: sy }, { rotate: '45deg' }],
      opacity,
    };
  });

  const iconAnim = useAnimatedStyle(() => ({
    transform: [{ scaleX: scaleX.value }, { scaleY: scaleY.value }, { translateY: nudgeY.value }],
  }));

  return (
    <Pressable onPress={handlePress} style={[styles.wrapper, style]}>
      <Animated.View style={[styles.dot, dropStyle]}>
        <TeardropDot color={accentColor} size={5} />
      </Animated.View>
      <Animated.View style={iconAnim}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    zIndex: 10,
  },
  dot: {
    position: 'absolute',
    top: 0,
    zIndex: 10,
  },
});
