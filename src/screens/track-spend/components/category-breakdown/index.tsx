import { useTheme } from "@context/Theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import type { SpendSummary } from "@data-types/track-spend/constants";
import { formatLakh } from "@utils/format-locals";
import Card from "../shared/card";
import { useCategoryColors } from "../shared/use-category-colors";

type Props = { data: SpendSummary };

const SIZE = 104;
const STROKE = 14;
const GAP = 3;

/** Donut chart with a legend showing where spend went by category. */
export default function CategoryBreakdown({ data }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const palette = useCategoryColors();

  const r = (SIZE - STROKE) / 2;
  const C = 2 * Math.PI * r;
  const total = data.categories.reduce((sum, c) => sum + c.amount, 0) || 1;

  let offset = 0;
  const arcs = data.categories.map((c) => {
    const len = (c.amount / total) * C;
    const arc = (
      <Circle
        key={c.key}
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={r}
        fill="none"
        stroke={palette[c.key]}
        strokeWidth={STROKE}
        strokeDasharray={`${Math.max(len - GAP, 0)} ${C}`}
        strokeDashoffset={-offset}
      />
    );
    offset += len;
    return arc;
  });

  return (
    <Card padded>
      <View style={s.row}>
        <View
          style={{ width: SIZE, height: SIZE }}
          accessible
          accessibilityLabel={data.categories
            .map((c) => `${t(`track_spend.category_${c.key}`)} ${Math.round((c.amount / total) * 100)}%`)
            .join(", ")}
        >
          <Svg width={SIZE} height={SIZE}>
            <Circle cx={SIZE / 2} cy={SIZE / 2} r={r} fill="none" stroke={colors.surface} strokeWidth={STROKE} />
            <G rotation={-90} origin={`${SIZE / 2}, ${SIZE / 2}`}>
              {arcs}
            </G>
          </Svg>
          <View style={s.center} pointerEvents="none">
            <Text style={[s.amount, { color: colors.textPrimary }]}>{formatLakh(data.totalSpent)}</Text>
            <Text style={[s.sub, { color: colors.textSecondary }]}>{t("track_spend.spent")}</Text>
          </View>
        </View>
        <View style={s.legend}>
          {data.categories.map((c) => (
            <View key={c.key} style={s.legendRow}>
              <View style={[s.dot, { backgroundColor: palette[c.key] }]} />
              <Text style={[s.name, { color: colors.textPrimary }]} numberOfLines={1}>
                {t(`track_spend.category_${c.key}`)}
              </Text>
              <Text style={[s.pct, { color: colors.textSecondary }]}>{Math.round((c.amount / total) * 100)}%</Text>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 18 },
  center: { ...StyleSheet.absoluteFill, alignItems: "center", justifyContent: "center" },
  amount: { fontSize: 16, fontWeight: "700" },
  sub: { fontSize: 11 },
  legend: { flex: 1, gap: 10 },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  name: { flex: 1, fontSize: 13 },
  pct: { fontSize: 12 },
});
