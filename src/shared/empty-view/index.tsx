import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, type ComponentProps } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Ellipse, G, Path, Rect } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

/**
 * A friendly magnifying-glass character that gently floats, blinks and smiles.
 * Pure SVG + Reanimated — theme-aware, no image assets needed.
 */
function EmptyIllustration({ color }: { color: string }) {
  const translateY = useSharedValue(0);
  const eyeOpen = useSharedValue(1); // 1 = open, 0 = blink
  const smileProgress = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );

    // Human-like blink: hold open, quick close, quick open, hold again.
    eyeOpen.value = withRepeat(
      withSequence(
        withDelay(2200, withTiming(1, { duration: 0 })),
        withTiming(0, { duration: 90, easing: Easing.in(Easing.quad) }),
        withTiming(1, { duration: 130, easing: Easing.out(Easing.quad) }),
      ),
      -1,
      false,
    );

    smileProgress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );
  }, [translateY, eyeOpen, smileProgress]);

  const glassStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const eyeProps = useAnimatedProps(() => ({ ry: 0.35 + eyeOpen.value * 1.85 }));

  const mouthProps = useAnimatedProps(() => {
    const sm = smileProgress.value;
    return { d: `M${88 - sm} 81 Q91.5 ${81 - sm * 2.5} ${95 + sm} 81` };
  });

  return (
    <View style={il.container}>
      <Animated.View style={[StyleSheet.absoluteFill, glassStyle]}>
        <Svg width={168} height={132} viewBox="52 36 92 118" fill="none">
          <G stroke={color} strokeLinecap="round" strokeLinejoin="round">
            <Circle cx={91} cy={73} r={31} strokeWidth={4} />
            <Circle cx={91} cy={73} r={25} strokeWidth={3} />
            <AnimatedEllipse cx={80.5} cy={70} rx={2.2} fill={color} stroke="none" animatedProps={eyeProps} />
            <AnimatedEllipse cx={100.5} cy={70} rx={2.2} fill={color} stroke="none" animatedProps={eyeProps} />
            <AnimatedPath strokeWidth={2.5} stroke={color} fill="none" animatedProps={mouthProps} />
            <Rect x={112} y={95} width={12} height={46} fill={color} stroke="none" transform="rotate(-55 115 92)" />
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
}

const il = StyleSheet.create({
  container: { width: 168, height: 132 },
});

type Props = {
  title: string;
  description?: string;
  /** Optional icon shown on the CTA button. */
  ctaIcon?: IconName;
  ctaLabel?: string;
  onCtaPress?: () => void;
};

/**
 * Shared empty / not-found view. Shows the animated illustration, a title,
 * an optional description, and an optional CTA. Used e.g. when a search
 * returns no results. Works in both light and dark themes.
 */
export default function EmptyView({ title, description, ctaIcon, ctaLabel, onCtaPress }: Props) {
  const { colors } = useTheme();

  return (
    <View style={s.wrap}>
      <EmptyIllustration color={colors.textSecondary} />

      <Text style={[s.title, { color: colors.textPrimary }]}>{title}</Text>
      {description ? (
        <Text style={[s.desc, { color: colors.textSecondary }]}>{description}</Text>
      ) : null}

      {ctaLabel && onCtaPress ? (
        <TouchableOpacity
          style={[s.cta, { backgroundColor: colors.accent }]}
          onPress={onCtaPress}
          activeOpacity={0.85}
          accessibilityRole="button"
        >
          {ctaIcon ? <MaterialCommunityIcons name={ctaIcon} size={18} color="#fff" /> : null}
          <Text style={s.ctaText}>{ctaLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20, paddingBottom: 60 },
  title: { fontSize: 18, fontWeight: "800", marginTop: 8, marginBottom: 6, textAlign: "center" },
  desc: { fontSize: 13.5, textAlign: "center", lineHeight: 20, marginBottom: 16 },
  cta: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14 },
  ctaText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
