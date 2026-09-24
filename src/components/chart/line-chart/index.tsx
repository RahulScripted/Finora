import { useTheme } from "@context/Theme/ThemeContext";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
} from "react-native";
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import type { LineChartProps, LineSeries } from "@data-types/chart/constants";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const DEFAULT_HEIGHT = 150;
const PAD_TOP = 12;
const PAD_BOTTOM = 26;
/** Horizontal inset so end-point markers/dots never clip at the edges. */
const PAD_X = 8;

function yOf(v: number, height: number, max: number, min: number) {
  const span = max - min || 1;
  const plotH = height - PAD_TOP - PAD_BOTTOM;
  return PAD_TOP + (1 - (v - min) / span) * plotH;
}

function xOf(i: number, count: number, width: number) {
  const usable = Math.max(1, width - PAD_X * 2);
  return PAD_X + (i / (count - 1 || 1)) * usable;
}

function buildPath(points: number[], width: number, height: number, max: number, min: number) {
  return points
    .map((v, i) => `${i === 0 ? "M" : "L"}${xOf(i, points.length, width).toFixed(1)} ${yOf(v, height, max, min).toFixed(1)}`)
    .join(" ");
}

function AnimatedLine({ d, color, drawLength, dashed }: {
  d: string;
  color: string;
  drawLength: number;
  dashed?: boolean;
}) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.cubic) });
  }, [progress, d]);
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: drawLength * (1 - progress.value),
  }));
  return (
    <AnimatedPath
      d={d}
      stroke={color}
      strokeWidth={2.5}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dashed ? "5 5" : drawLength}
      animatedProps={dashed ? undefined : animatedProps}
    />
  );
}

type Props = LineChartProps & {
  /** Enable touch/drag inspection of a point across all series. */
  interactive?: boolean;
  /** Called with the active index while scrubbing. */
  onActiveIndex?: (index: number) => void;
};

/**
 * Multi-series line chart. Series with `area` render a soft gradient fill.
 * When `interactive`, touch or drag to scrub a vertical marker across points.
 */
export default function LineChart({
  series,
  labels,
  height = DEFAULT_HEIGHT,
  interactive,
  onActiveIndex,
}: Props) {
  const { colors } = useTheme();
  const [width, setWidth] = useState(0);

  const n = Math.max(...series.map((s) => s.points.length), 1);
  const [active, setActive] = useState(n - 1);

  const allValues = series.flatMap((s) => s.points);
  const max = Math.max(1, ...allValues);
  const min = Math.min(...allValues, 0);
  const drawLength = width * 2.2;
  const usableW = Math.max(1, width - PAD_X * 2);

  const paths = series.map((s: LineSeries) => ({
    ...s,
    d: width ? buildPath(s.points, width, height, max, min) : "",
  }));

  const select = (e: GestureResponderEvent) => {
    if (!width || !interactive) return;
    const rel = (e.nativeEvent.locationX - PAD_X) / usableW;
    const i = Math.max(0, Math.min(n - 1, Math.round(rel * (n - 1))));
    setActive(i);
    onActiveIndex?.(i);
  };

  const markerX = xOf(active, n, width);

  return (
    <View>
      <View
        style={{ height }}
        onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => !!interactive}
        onMoveShouldSetResponder={() => !!interactive}
        onResponderGrant={select}
        onResponderMove={select}
      >
        {width > 0 ? (
          <Svg width={width} height={height}>
            <Defs>
              {paths.map((p) =>
                p.area ? (
                  <LinearGradient key={`g-${p.key}`} id={`fill-${p.key}`} x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={p.color} stopOpacity={0.22} />
                    <Stop offset="1" stopColor={p.color} stopOpacity={0} />
                  </LinearGradient>
                ) : null,
              )}
            </Defs>

            {paths.map((p) =>
              p.area && p.d ? (
                <Path
                  key={`a-${p.key}`}
                  d={`${p.d} L ${(width - PAD_X).toFixed(1)} ${height - PAD_BOTTOM} L ${PAD_X} ${height - PAD_BOTTOM} Z`}
                  fill={`url(#fill-${p.key})`}
                />
              ) : null,
            )}

            {paths.map((p) => (
              <AnimatedLine key={p.key} d={p.d} color={p.color} drawLength={drawLength} dashed={p.dashed} />
            ))}

            {/* Scrubber: vertical guide + a dot on each series */}
            {interactive ? (
              <>
                <Line
                  x1={markerX}
                  x2={markerX}
                  y1={PAD_TOP - 4}
                  y2={height - PAD_BOTTOM}
                  stroke={colors.textMuted}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
                {series.map((sr) => {
                  const v = sr.points[active] ?? 0;
                  return (
                    <Circle
                      key={`dot-${sr.key}`}
                      cx={markerX}
                      cy={yOf(v, height, max, min)}
                      r={4.5}
                      fill={colors.card}
                      stroke={sr.color}
                      strokeWidth={2.5}
                    />
                  );
                })}
              </>
            ) : null}
          </Svg>
        ) : null}
      </View>

      <View style={s.axis}>
        <Text style={[s.axisLabel, { color: colors.textMuted }]}>{labels[0] ?? ""}</Text>
        <Text style={[s.axisLabel, { color: colors.textMuted }]}>{labels[labels.length - 1] ?? ""}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  axis: { flexDirection: "row", justifyContent: "space-between", marginTop: -18 },
  axisLabel: { fontSize: 11 },
});
