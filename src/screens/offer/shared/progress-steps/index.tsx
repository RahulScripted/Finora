import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

export type StepItem = { label: string };

type Props = {
  steps: StepItem[];
  /** Zero-indexed current step. */
  currentStep: number;
};

const DOT_SIZE = 28;
const LABEL_HEIGHT = 16;

/**
 * Animated dotted stepper — numbered dots that turn into checkmarks as the
 * user advances, with connector lines that fill in. Mirrors the Customer-App.
 */
export default function ProgressSteps({ steps, currentStep }: Props) {
  const { colors } = useTheme();

  return (
    <View style={s.container}>
      {steps.map((step, i) => {
        const state = i < currentStep ? "complete" : i === currentStep ? "active" : "inactive";
        const isLast = i === steps.length - 1;
        const labelColor =
          state === "inactive"
            ? colors.textMuted
            : state === "active"
              ? colors.accent
              : colors.success;
        return (
          <React.Fragment key={i}>
            <View style={s.dotWrapper}>
              <StepDot
                index={i + 1}
                state={state}
                green={colors.success}
                accent={colors.accent}
                muted={colors.border}
                surface={colors.surface}
              />
              <Text style={[s.stepLabel, { color: labelColor }]} numberOfLines={1}>
                {step.label}
              </Text>
            </View>
            {!isLast ? (
              <ConnectorLine filled={i < currentStep} green={colors.success} muted={colors.border} />
            ) : null}
          </React.Fragment>
        );
      })}
    </View>
  );
}

function ConnectorLine({ filled, green, muted }: { filled: boolean; green: string; muted: string }) {
  const progress = useSharedValue(filled ? 1 : 0);

  useEffect(() => {
    progress.value = filled
      ? withDelay(450, withTiming(1, { duration: 350, easing: Easing.out(Easing.cubic) }))
      : withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
  }, [filled, progress]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  return (
    <View style={[s.connector, { backgroundColor: muted }]}>
      <Animated.View style={[s.connectorFill, { backgroundColor: green }, fillStyle]} />
    </View>
  );
}

function StepDot({
  index,
  state,
  green,
  accent,
  muted,
  surface,
}: {
  index: number;
  state: "complete" | "active" | "inactive";
  green: string;
  accent: string;
  muted: string;
  surface: string;
}) {
  const bg = useSharedValue(state === "complete" ? 1 : 0);
  const checkOpacity = useSharedValue(state === "complete" ? 1 : 0);
  const checkScale = useSharedValue(state === "complete" ? 1 : 0);

  useEffect(() => {
    if (state === "complete") {
      bg.value = withTiming(1, { duration: 250, easing: Easing.out(Easing.cubic) });
      checkOpacity.value = withDelay(250, withTiming(1, { duration: 200 }));
      checkScale.value = withDelay(250, withTiming(1, { duration: 250, easing: Easing.out(Easing.back(2)) }));
    } else {
      bg.value = withTiming(0, { duration: 250 });
      checkOpacity.value = withTiming(0, { duration: 150 });
      checkScale.value = withTiming(0, { duration: 150 });
    }
  }, [state, bg, checkOpacity, checkScale]);

  const dotStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(bg.value, [0, 1], [surface, green]),
    borderColor:
      state === "inactive"
        ? muted
        : state === "active"
          ? accent
          : interpolateColor(bg.value, [0, 1], [accent, green]),
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
    transform: [{ scale: checkScale.value }],
  }));

  return (
    <Animated.View style={[s.dot, dotStyle]}>
      <Animated.View style={checkStyle}>
        <MaterialCommunityIcons name="check" size={15} color="#fff" />
      </Animated.View>
      {state !== "complete" ? (
        <Text style={[s.stepNumber, { color: state === "active" ? accent : muted }]}>{index}</Text>
      ) : null}
    </Animated.View>
  );
}

const s = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "flex-start", paddingBottom: LABEL_HEIGHT + 6, paddingTop: 8 },
  dotWrapper: { alignItems: "center", width: DOT_SIZE },
  stepLabel: { position: "absolute", top: DOT_SIZE + 6, fontSize: 10, fontWeight: "600", textAlign: "center", width: 80 },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumber: { fontSize: 12, fontWeight: "700", position: "absolute" },
  connector: { flex: 1, height: 2, borderRadius: 2, alignSelf: "flex-start", marginTop: DOT_SIZE / 2 - 1 },
  connectorFill: { height: "100%", borderRadius: 2 },
});
