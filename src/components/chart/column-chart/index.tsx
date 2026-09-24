import AnimatedBar from "@animations/animated-bar";
import { useTheme } from "@context/Theme/ThemeContext";
import { useState } from "react";
import { StyleSheet, Text, View, type LayoutChangeEvent } from "react-native";
import Svg from "react-native-svg";
import type { ColumnChartProps } from "@data-types/chart/constants";

const DEFAULT_HEIGHT = 120;

/**
 * Categorical column chart — one colored bar per item. Optional value labels
 * render beneath each column. Decoupled from any feature via `data`.
 */
export default function ColumnChart({ data, height = DEFAULT_HEIGHT, formatValue }: ColumnChartProps) {
  const { colors } = useTheme();
  const [width, setWidth] = useState(0);

  const baseline = height - 4;
  const maxBar = height - 16;
  const max = Math.max(1, ...data.map((d) => d.value));
  const n = data.length || 1;
  const slot = width / n;
  const barW = Math.max(20, Math.min(56, slot * 0.5));

  return (
    <View>
      <View style={{ height }} onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}>
        {width > 0 ? (
          <Svg width={width} height={height}>
            {data.map((d, i) => {
              const h = Math.max(6, (d.value / max) * maxBar);
              const x = i * slot + (slot - barW) / 2;
              return (
                <AnimatedBar
                  key={d.key}
                  x={x}
                  baseline={baseline}
                  width={barW}
                  height={h}
                  rx={10}
                  fill={d.color}
                  delay={Math.min(i * 90, 360)}
                />
              );
            })}
          </Svg>
        ) : null}
      </View>

      <View style={s.labels}>
        {data.map((d) => (
          <View key={d.key} style={s.col}>
            {formatValue ? (
              <Text style={[s.value, { color: colors.textSecondary }]} numberOfLines={1}>
                {formatValue(d.value)}
              </Text>
            ) : null}
            <Text style={[s.label, { color: colors.textMuted }]} numberOfLines={1}>
              {d.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  labels: { flexDirection: "row", marginTop: 4 },
  col: { flex: 1, alignItems: "center", gap: 2 },
  value: { fontSize: 12, fontWeight: "600" },
  label: { fontSize: 11 },
});
