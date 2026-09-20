import { useTourRegistry } from "@components/product-tour/context/TourContext";
import { useTheme } from "@context/Theme/ThemeContext";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const VISIBLE_TABS = 5;
const BAR_H = 72;

// Raindrop SVG — pointed top, round bottom
function TeardropDot({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size * 1.4} viewBox="0 0 10 14">
      <Path
        d="M5 0 C5 0, 0 6, 0 9 C0 11.76, 2.24 14, 5 14 C7.76 14, 10 11.76, 10 9 C10 6, 5 0, 5 0 Z"
        fill={color}
      />
    </Svg>
  );
}

// Drop animation: teardrop falls from above, elongates, then squishes flat
function DropDot({ active, color }: { active: boolean; color: string }) {
  const progress = useSharedValue(0);
  const prevActive = useRef(active);

  useEffect(() => {
    if (active && !prevActive.current) {
      progress.value = 0;
      progress.value = withTiming(1, {
        duration: 350,
        easing: Easing.in(Easing.quad),
      });
    }
    if (!active) progress.value = 0;
    prevActive.current = active;
  }, [active]);

  const dotStyle = useAnimatedStyle(() => {
    // Matches CSS: top -30px → -7px → 3px
    const translateY = interpolate(progress.value, [0, 0.7, 1], [-30, -7, 3]);
    // Matches CSS: scale(1,1) → scale(1,2) → scale(1.5, 0.5)
    const scaleX = interpolate(progress.value, [0, 0.7, 1], [1, 1, 1.5]);
    const scaleY = interpolate(progress.value, [0, 0.7, 1], [1, 2, 0.5]);
    const opacity = interpolate(
      progress.value,
      [0, 0.03, 0.85, 1],
      [0, 1, 1, 0],
    );
    return {
      transform: [{ translateY }, { scaleX }, { scaleY }],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.dropDot, dotStyle]}>
      <TeardropDot color={color} size={5} />
    </Animated.View>
  );
}

function TabItem({
  isFocused,
  onPress,
  onLongPress,
  renderIcon,
  accentColor,
  inactiveColor,
  label,
}: {
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  renderIcon: (color: string, focused: boolean) => React.ReactNode;
  accentColor: string;
  inactiveColor: string;
  label?: string;
}) {
  // Stretch animation values — matches CSS stretch-animation exactly
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);
  const nudgeY = useSharedValue(0);
  // Fill reveal
  const fillOpacity = useSharedValue(0);
  const outlineOpacity = useSharedValue(1);
  const prevFocused = useRef(isFocused);

  useEffect(() => {
    if (isFocused && !prevFocused.current) {
      // CSS: animation: stretch-animation .5s ease-out .3s
      // 25% { scale3d(.9, 1.2, 1); margin-top: 10px }
      // 75% { scale3d(1.1, .95, 1) }
      // 100% { scale3d(1, 1, 1) }
      const delay = 300;
      const quarter = 125; // 25% of 500ms
      const half = 250; // 50% of 500ms (75%-25%)
      const last = 125; // 25% of 500ms (100%-75%)

      scaleX.value = withDelay(
        delay,
        withSequence(
          withTiming(0.9, {
            duration: quarter,
            easing: Easing.out(Easing.quad),
          }),
          withTiming(1.1, { duration: half, easing: Easing.out(Easing.quad) }),
          withTiming(1, { duration: last, easing: Easing.out(Easing.quad) }),
        ),
      );
      scaleY.value = withDelay(
        delay,
        withSequence(
          withTiming(1.2, {
            duration: quarter,
            easing: Easing.out(Easing.quad),
          }),
          withTiming(0.95, { duration: half, easing: Easing.out(Easing.quad) }),
          withTiming(1, { duration: last, easing: Easing.out(Easing.quad) }),
        ),
      );
      nudgeY.value = withDelay(
        delay,
        withSequence(
          withTiming(8, { duration: quarter, easing: Easing.out(Easing.quad) }),
          withTiming(-2, { duration: half, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: last, easing: Easing.out(Easing.quad) }),
        ),
      );

      // CSS: clip-animation .5s ease .3s forwards (circle expanding from top)
      fillOpacity.value = withDelay(
        delay,
        withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) }),
      );
      outlineOpacity.value = withDelay(delay, withTiming(0, { duration: 250 }));
    } else if (!isFocused && prevFocused.current) {
      scaleX.value = 1;
      scaleY.value = 1;
      nudgeY.value = 0;
      fillOpacity.value = withTiming(0, { duration: 200 });
      outlineOpacity.value = withTiming(1, { duration: 200 });
    }
    // Initial mount state
    if (isFocused && prevFocused.current === isFocused) {
      fillOpacity.value = 1;
      outlineOpacity.value = 0;
    }
    prevFocused.current = isFocused;
  }, [isFocused]);

  const iconAnim = useAnimatedStyle(() => ({
    transform: [
      { scaleX: scaleX.value },
      { scaleY: scaleY.value },
      { translateY: nudgeY.value },
    ],
  }));
  const filledStyle = useAnimatedStyle(() => ({
    opacity: fillOpacity.value,
    position: "absolute" as const,
  }));
  const outlineStyle = useAnimatedStyle(() => ({
    opacity: outlineOpacity.value,
  }));

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabItem}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={label}
    >
      <DropDot active={isFocused} color={accentColor} />
      <Animated.View style={[styles.iconBox, iconAnim]}>
        <Animated.View style={outlineStyle}>
          {renderIcon(inactiveColor, false)}
        </Animated.View>
        <Animated.View style={filledStyle}>
          {renderIcon(accentColor, true)}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

export default function AnimatedTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { register } = useTourRegistry();
  const visibleRoutes = state.routes.slice(0, VISIBLE_TABS);

  const safePad = Platform.OS === "ios" ? insets.bottom : 0;

  return (
    <View style={{ backgroundColor: "transparent" }}>
      {/* The whole bar is registered as one tour target ("tab-bar"). It's a
          plain, full-width, fixed-height container so it measures reliably —
          unlike the animated per-icon views. */}
      <View
        ref={register("tab-bar")}
        collapsable={false}
        style={[styles.bar, { backgroundColor: colors.tabBar }]}
      >
        {visibleRoutes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          const onLongPress = () =>
            navigation.emit({ type: "tabLongPress", target: route.key });

          const renderIcon = (iconColor: string, focused: boolean) =>
            options.tabBarIcon?.({ focused, color: iconColor, size: 26 }) ??
            null;

          const tabLabel =
            typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : (options.title ?? route.name);

          return (
            <TabItem
              key={route.key}
              isFocused={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
              renderIcon={renderIcon}
              accentColor={colors.accent}
              inactiveColor={colors.textMuted}
              label={tabLabel}
            />
          );
        })}
      </View>
      {safePad > 0 && (
        <View style={{ height: safePad, backgroundColor: colors.tabBar }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    height: BAR_H,
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: BAR_H,
    overflow: "visible",
  },
  iconBox: {
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  dropDot: {
    position: "absolute",
    top: 8,
    zIndex: 10,
  },
});
