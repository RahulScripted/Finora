import { useTheme } from "@context/Theme/ThemeContext";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

function Block({ height, radius = 18, flex }: { height?: number; radius?: number; flex?: number }) {
  const { colors } = useTheme();
  const opacity = useSharedValue(0.5);
  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [opacity]);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View
      style={[{ height, borderRadius: radius, backgroundColor: colors.surface, flex }, style]}
    />
  );
}

/** Loading placeholder for the Business Partners list. */
export default function ListSkeleton() {
  return (
    <View style={s.wrap}>
      <Block height={230} />
      <Block height={190} />
      <View style={s.gap}>
        <Block height={120} />
        <Block height={120} />
        <Block height={120} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { gap: 16 },
  gap: { gap: 12, marginTop: 8 },
});
