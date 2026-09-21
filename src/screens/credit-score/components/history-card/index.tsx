import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View, type GestureResponderEvent, type LayoutChangeEvent } from "react-native";
import Svg, { Circle, Defs, G, Line, LinearGradient, Path, Rect, Stop, Text as SvgText } from "react-native-svg";
import type { CreditSummary } from "@data-types/credit-score/constants";
import { useBandColors } from "../shared/use-band-colors";
import Card from "../shared/card";

const H_HEIGHT = 176;
const PAD = { t: 34, r: 12, b: 26, l: 12 };

function smoothPath(pts: { x: number; y: number }[]) {
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const mx = (a.x + b.x) / 2;
    d += ` C ${mx} ${a.y} ${mx} ${b.y} ${b.x} ${b.y}`;
  }
  return d;
}

type Props = { data: CreditSummary };

export default function HistoryCard({ data }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const bandColors = useBandColors();
  const [range, setRange] = useState<"6m" | "12m">("6m");
  const [w, setW] = useState(0);

  const points = useMemo(
    () => (range === "6m" ? data.history.slice(-6) : data.history),
    [range, data.history],
  );
  const n = points.length;
  const [selected, setSelected] = useState(n - 1);
  useEffect(() => setSelected(n - 1), [n]);

  const idx = Math.min(selected, n - 1);
  const first = points[0];
  const last = points[n - 1];
  const delta = last.score - first.score;

  const { yMin, yMax } = useMemo(() => {
    const scores = points.map((p) => p.score);
    return {
      yMin: Math.floor((Math.min(...scores) - 10) / 10) * 10,
      yMax: Math.ceil((Math.max(...scores) + 10) / 10) * 10,
    };
  }, [points]);

  const innerW = Math.max(0, w - PAD.l - PAD.r);
  const innerH = H_HEIGHT - PAD.t - PAD.b;
  const baseY = PAD.t + innerH;
  const yOf = (v: number) => PAD.t + (1 - (v - yMin) / (yMax - yMin)) * innerH;
  const xy = points.map((p, i) => ({
    x: PAD.l + (n === 1 ? 0 : (i * innerW) / (n - 1)),
    y: yOf(p.score),
  }));
  const line = n > 1 && w > 0 ? smoothPath(xy) : "";
  const area = line ? `${line} L ${xy[n - 1].x} ${baseY} L ${xy[0].x} ${baseY} Z` : "";

  const pick = (e: GestureResponderEvent) => {
    if (!innerW) return;
    const i = Math.round(((e.nativeEvent.locationX - PAD.l) / innerW) * (n - 1));
    setSelected(Math.max(0, Math.min(n - 1, i)));
  };

  const sel = xy[idx];
  const selPoint = points[idx];
  const tipText = `${selPoint.label} · ${selPoint.score}`;
  const tipW = tipText.length * 6.3 + 20;
  const tipX = sel ? Math.max(0, Math.min(w - tipW, sel.x - tipW / 2)) : 0;
  const tipY = sel ? Math.max(2, sel.y - 42) : 0;
  const showLabel = (i: number) => (n <= 6 ? true : i % 2 === 0 || i === n - 1);
  const thresholds = data.bands.filter((b) => b.from > yMin && b.from < yMax);
  const up = delta >= 0;

  return (
    <Card padded>
      <View style={s.top}>
        <View
          style={[
            s.changePill,
            { backgroundColor: up ? colors.successSoft : colors.accent + "18", flexShrink: 1 },
          ]}
        >
          <MaterialCommunityIcons
            name={up ? "arrow-top-right" : "arrow-bottom-right"}
            size={14}
            color={up ? colors.success : colors.accent}
          />
          <Text style={[s.changeText, { color: up ? colors.success : colors.accent }]} numberOfLines={1}>
            {t(up ? "credit_score.history_up" : "credit_score.history_down", {
              pts: Math.abs(delta),
              since: first.label,
            })}
          </Text>
        </View>
        <View style={[s.rangeTrack, { backgroundColor: colors.surface }]}>
          {(["6m", "12m"] as const).map((r) => {
            const active = r === range;
            return (
              <Pressable
                key={r}
                onPress={() => setRange(r)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={[
                  s.rangeItem,
                  active && {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderWidth: StyleSheet.hairlineWidth,
                  },
                ]}
              >
                <Text
                  style={[
                    s.rangeText,
                    { color: active ? colors.textPrimary : colors.textSecondary, fontWeight: active ? "600" : "400" },
                  ]}
                >
                  {t(`credit_score.range_${r}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <View
        style={{ height: H_HEIGHT, marginTop: 8 }}
        onLayout={(e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => true}
        onResponderGrant={pick}
        onResponderMove={pick}
        onResponderTerminationRequest={() => true}
        accessible
        accessibilityLabel={t("credit_score.history_a11y", { label: selPoint.label, score: selPoint.score })}
      >
        {w > 0 && n > 1 ? (
          <Svg width={w} height={H_HEIGHT}>
            <Defs>
              <LinearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={colors.accent} stopOpacity={0.28} />
                <Stop offset="1" stopColor={colors.accent} stopOpacity={0} />
              </LinearGradient>
            </Defs>
            {thresholds.map((b) => (
              <G key={b.key}>
                <Line x1={PAD.l} x2={w - PAD.r} y1={yOf(b.from)} y2={yOf(b.from)} stroke={bandColors[b.key]} strokeOpacity={0.55} strokeWidth={1} strokeDasharray="3 4" />
                <SvgText x={w - PAD.r} y={yOf(b.from) - 4} fontSize={11} fill={colors.textMuted} textAnchor="end">
                  {`${t(`credit_score.band_${b.key}`)} ${b.from}+`}
                </SvgText>
              </G>
            ))}
            <Path d={area} fill="url(#scoreFill)" />
            <Path d={line} stroke={colors.accent} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {xy.map((p, i) =>
              i === idx ? null : (
                <Circle key={i} cx={p.x} cy={p.y} r={3} fill={colors.card} stroke={colors.accent} strokeWidth={2} />
              ),
            )}
            {sel ? (
              <G>
                <Line x1={sel.x} x2={sel.x} y1={sel.y} y2={baseY} stroke={colors.accent} strokeOpacity={0.35} strokeWidth={1} />
                <Circle cx={sel.x} cy={sel.y} r={9} fill={colors.accent} fillOpacity={0.2} />
                <Circle cx={sel.x} cy={sel.y} r={5} fill={colors.card} stroke={colors.accent} strokeWidth={3} />
                <Rect x={tipX} y={tipY} width={tipW} height={22} rx={8} fill={colors.textPrimary} />
                <Path d={`M${sel.x - 4} ${tipY + 22} L${sel.x} ${tipY + 27} L${sel.x + 4} ${tipY + 22} Z`} fill={colors.textPrimary} />
                <SvgText x={tipX + tipW / 2} y={tipY + 15} fontSize={11} fill={colors.background} textAnchor="middle">{tipText}</SvgText>
              </G>
            ) : null}
            {points.map((p, i) =>
              showLabel(i) ? (
                <SvgText key={`x-${i}`} x={xy[i].x} y={H_HEIGHT - 6} fontSize={11} fill={i === idx ? colors.textPrimary : colors.textMuted} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"}>
                  {p.label}
                </SvgText>
              ) : null,
            )}
          </Svg>
        ) : null}
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  changePill: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  changeText: { fontSize: 12, fontWeight: "600" },
  rangeTrack: { flexDirection: "row", borderRadius: 10, padding: 2 },
  rangeItem: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8 },
  rangeText: { fontSize: 12 },
});
