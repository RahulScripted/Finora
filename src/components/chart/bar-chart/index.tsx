import AnimatedBar from "@animations/animated-bar";
import { useTheme } from "@context/Theme/ThemeContext";
import { useEffect, useMemo, useState } from "react";
import { View, type GestureResponderEvent, type LayoutChangeEvent } from "react-native";
import Svg, { G, Line, Path, Rect, Text as SvgText } from "react-native-svg";
import type { BarChartProps } from "@data-types/chart/constants";

const DEFAULT_HEIGHT = 130;
const BASELINE = 108;
const MAX_BAR = 70;

/**
 * Generic interactive bar chart. Touch or drag to inspect a bar.
 * Decoupled from any feature — pass `buckets` and a `formatValue` fn.
 */
export default function BarChart({ buckets, formatValue, a11yLabel, height = DEFAULT_HEIGHT }: BarChartProps) {
  const { colors } = useTheme();
  const [width, setWidth] = useState(0);
  const n = buckets.length;

  const { max, peakIndex, average } = useMemo(() => {
    let maxAmount = 1;
    let peak = 0;
    let sum = 0;
    let count = 0;
    buckets.forEach((b, i) => {
      if (b.amount == null) return;
      sum += b.amount;
      count += 1;
      if (b.amount > maxAmount) {
        maxAmount = b.amount;
        peak = i;
      }
    });
    return { max: maxAmount, peakIndex: peak, average: count ? Math.round(sum / count) : 0 };
  }, [buckets]);

  const [selected, setSelected] = useState(peakIndex);
  useEffect(() => setSelected(peakIndex), [peakIndex]);

  const select = (e: GestureResponderEvent) => {
    if (!width) return;
    const i = Math.max(0, Math.min(n - 1, Math.floor((e.nativeEvent.locationX / width) * n)));
    if (buckets[i].amount != null) setSelected(i);
  };

  const slot = width / n;
  const barW = Math.max(5, Math.min(18, slot * 0.62));
  const step = Math.ceil(n / 5);
  const showLabel = (i: number) => i % step === 0 || (i === n - 1 && (n - 1) % step >= Math.ceil(step / 2));

  const sel = buckets[selected];
  const selAmount = sel?.amount ?? 0;
  const selHeight = Math.max(4, (selAmount / max) * MAX_BAR);
  const tooltipText = sel ? `${sel.tooltip} · ${formatValue(selAmount)}` : "";
  const tooltipW = tooltipText.length * 6.3 + 20;
  const barCenter = selected * slot + slot / 2;
  const tooltipX = Math.max(0, Math.min(width - tooltipW, barCenter - tooltipW / 2));
  const tooltipY = Math.max(2, BASELINE - selHeight - 32);
  const avgY = BASELINE - (average / max) * MAX_BAR;

  return (
    <View
      style={{ height }}
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
      onStartShouldSetResponder={() => true}
      onResponderGrant={select}
      onResponderMove={select}
      onResponderTerminationRequest={() => true}
      accessible
      accessibilityLabel={a11yLabel?.(sel?.tooltip ?? "", formatValue(selAmount))}
    >
      {width > 0 ? (
        <Svg width={width} height={height}>
          <Line x1={0} x2={width} y1={BASELINE} y2={BASELINE} stroke={colors.divider} strokeWidth={1} />
          {buckets.map((b, i) => {
            const x = i * slot + (slot - barW) / 2;
            const isFuture = b.amount == null;
            const h = isFuture ? 6 : Math.max(4, ((b.amount as number) / max) * MAX_BAR);
            return (
              <AnimatedBar
                key={`${b.label}-${i}`}
                x={x}
                baseline={BASELINE}
                width={barW}
                height={h}
                rx={barW / 2}
                fill={isFuture ? colors.divider : i === selected ? colors.accent : colors.accent + "40"}
                delay={Math.min(i * 24, 360)}
              />
            );
          })}
          <Line x1={0} x2={width} y1={avgY} y2={avgY} stroke={colors.textMuted} strokeWidth={1} strokeDasharray="3 3" />
          {sel ? (
            <G>
              <Rect x={tooltipX} y={tooltipY} width={tooltipW} height={22} rx={8} fill={colors.textPrimary} />
              <Path
                d={`M${barCenter - 4} ${tooltipY + 22} L${barCenter} ${tooltipY + 27} L${barCenter + 4} ${tooltipY + 22} Z`}
                fill={colors.textPrimary}
              />
              <SvgText x={tooltipX + tooltipW / 2} y={tooltipY + 15} fontSize={11} fill={colors.background} textAnchor="middle">
                {tooltipText}
              </SvgText>
            </G>
          ) : null}
          {buckets.map((b, i) =>
            showLabel(i) ? (
              <SvgText
                key={`l-${i}`}
                x={i === n - 1 ? Math.min(width, i * slot + slot / 2 + 6) : i * slot + slot / 2}
                y={124}
                fontSize={11}
                fill={colors.textMuted}
                textAnchor={i === n - 1 ? "end" : "middle"}
              >
                {b.label}
              </SvgText>
            ) : null,
          )}
        </Svg>
      ) : null}
    </View>
  );
}
