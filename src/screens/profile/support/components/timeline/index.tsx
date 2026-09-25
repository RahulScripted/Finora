import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

export type StepState = "done" | "active" | "failed" | "skip" | "upcoming";
export type TimelineStep = { label: string; time?: string; description?: string; state: StepState };

const STEP_DELAY = 800;
const PROGRESS_DURATION = 600;
const CIRCUMFERENCE = 2 * Math.PI * 8;
const TERMINAL: Set<StepState> = new Set(["failed", "skip"]);
const UNFILLED: Set<StepState> = new Set(["skip", "upcoming"]);

const ICON: Record<StepState, string> = {
  done: "check",
  active: "clock-outline",
  failed: "close",
  skip: "minus",
  upcoming: "circle-small",
};

type StepPhase = "waiting" | "current" | "done";

/** Spinning ring with the step icon held steady in the center. */
function Spinner({ color, icon }: { color: string; icon: string }) {
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 1000, easing: Easing.linear, useNativeDriver: true }),
    ).start();
    return () => spin.stopAnimation();
  }, [spin]);

  return (
    <View style={[s.dot, { borderWidth: 0 }]}>
      {/* Rotating ring */}
      <Animated.View
        style={{
          position: "absolute",
          transform: [{ rotate: spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] }) }],
        }}
      >
        <Svg width={22} height={22} viewBox="0 0 22 22">
          <G rotation={-90} origin="11, 11">
            <Circle cx={11} cy={11} r={8} stroke={color + "25"} strokeWidth={2.5} fill="transparent" />
            <Circle
              cx={11}
              cy={11}
              r={8}
              stroke={color}
              strokeWidth={2.5}
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={`${CIRCUMFERENCE}`}
              strokeDashoffset={`${CIRCUMFERENCE * 0.65}`}
            />
          </G>
        </Svg>
      </Animated.View>
      {/* Steady icon on top */}
      <MaterialCommunityIcons name={icon as any} size={11} color={color} />
    </View>
  );
}

function DotIcon({ state, color }: { state: StepState; color: string }) {
  const scale = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(scale, { toValue: 1, friction: 5, tension: 100, useNativeDriver: true }).start();
  }, [scale]);
  const filled = !UNFILLED.has(state);

  return (
    <Animated.View
      style={[s.dot, { borderColor: color, backgroundColor: filled ? color : "transparent", transform: [{ scale }] }]}
    >
      <MaterialCommunityIcons name={ICON[state] as any} size={11} color={filled ? "#fff" : color} />
    </Animated.View>
  );
}

function StepRow({
  step,
  isLast,
  idx,
  doneColor,
}: {
  step: TimelineStep;
  isLast: boolean;
  idx: number;
  doneColor?: string;
}) {
  const { colors } = useTheme();
  const [phase, setPhase] = useState<StepPhase>("waiting");
  const fade = useRef(new Animated.Value(0)).current;

  const colorMap: Record<StepState, string> = {
    done: doneColor || colors.success,
    active: colors.warning,
    failed: colors.danger,
    skip: colors.textMuted,
    upcoming: colors.textMuted,
  };
  const c = colorMap[step.state];

  useEffect(() => {
    const t1 = setTimeout(() => {
      Animated.timing(fade, { toValue: 1, duration: 250, useNativeDriver: true }).start();
      setPhase("current");
    }, idx * STEP_DELAY);
    const t2 = setTimeout(() => setPhase("done"), idx * STEP_DELAY + PROGRESS_DURATION);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [idx, fade]);

  return (
    <Animated.View
      style={{ opacity: fade, transform: [{ translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [6, 0] }) }] }}
    >
      <View style={s.row}>
        <View style={s.dotCol}>
          {phase === "current" ? (
            <Spinner color={c} icon={ICON[step.state]} />
          ) : phase === "done" ? (
            <DotIcon state={step.state} color={c} />
          ) : (
            /* Waiting / not-yet-reached: grey filled circle WITH the step icon */
            <View style={[s.dot, { borderColor: colors.border, backgroundColor: colors.surface }]}>
              <MaterialCommunityIcons name={ICON[step.state] as any} size={11} color={colors.textMuted} />
            </View>
          )}
          {!isLast ? (
            <View style={[s.connector, { backgroundColor: phase === "done" ? c + "40" : colors.divider }]} />
          ) : null}
        </View>

        <View style={step.description ? s.contentCol : s.content}>
          <View style={step.description ? undefined : s.contentRow}>
            <Text
              style={[
                s.label,
                {
                  color:
                    phase === "done" && !UNFILLED.has(step.state) ? colors.textPrimary : colors.textSecondary,
                },
              ]}
            >
              {step.label}
            </Text>
            {step.time && phase === "done" ? (
              <Text style={[s.time, { color: colors.textSecondary }]}>{step.time}</Text>
            ) : null}
          </View>
          {step.description && phase === "done" ? (
            <Text style={[s.desc, { color: colors.textSecondary }]}>{step.description}</Text>
          ) : null}
        </View>
      </View>
    </Animated.View>
  );
}

type Props = {
  steps: TimelineStep[];
  heading?: string;
  /** Re-run the reveal when this changes (e.g. on screen focus). */
  animKey?: string | number;
  doneColor?: string;
};

/** Animated vertical journey timeline: each step reveals with a spinner → icon. */
export default function Timeline({ steps, heading, animKey, doneColor }: Props) {
  const { colors } = useTheme();
  const [key, setKey] = useState(0);
  useEffect(() => {
    setKey((k) => k + 1);
  }, [animKey]);

  if (!steps.length) return null;

  // Stop rendering after a terminal state (failed / skipped).
  let stop = steps.length - 1;
  for (let i = 0; i < steps.length; i++) {
    if (TERMINAL.has(steps[i].state)) {
      stop = i;
      break;
    }
  }
  const visible = steps.slice(0, stop + 1);

  return (
    <View>
      {heading ? <Text style={[s.heading, { color: colors.textSecondary }]}>{heading}</Text> : null}
      {visible.map((step, i) => (
        <StepRow
          key={`${key}-${i}`}
          step={step}
          isLast={i === visible.length - 1}
          idx={i}
          doneColor={doneColor}
        />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  heading: { fontSize: 10, fontWeight: "700", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 12 },
  row: { flexDirection: "row" },
  dotCol: { alignItems: "center", width: 24 },
  dot: { width: 22, height: 22, borderRadius: 11, justifyContent: "center", alignItems: "center", borderWidth: 2 },
  connector: { width: 2, flex: 1, minHeight: 16, borderRadius: 1 },
  content: { flex: 1, minHeight: 22, paddingBottom: 18, marginLeft: 10 },
  contentCol: { flex: 1, minHeight: 22, paddingBottom: 18, marginLeft: 10 },
  contentRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { flex: 1, fontSize: 13, fontWeight: "500" },
  desc: { fontSize: 12, lineHeight: 17, marginTop: 3 },
  time: { fontSize: 12, fontWeight: "600" },
});
