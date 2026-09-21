import BarChart from "@components/chart/bar-chart";
import { useTheme } from "@context/Theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { AVG_UNIT, type Period, type SpendBucket } from "@data-types/track-spend/constants";
import { formatINR } from "@utils/format-locals";
import Card from "../shared/card";

type Props = { buckets: SpendBucket[]; period: Period };

/** Spend bar chart with a title + average summary, backed by the shared BarChart. */
export default function SpendChart({ buckets, period }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const known = buckets.filter((b) => b.amount != null) as { amount: number }[];
  const average = known.length ? Math.round(known.reduce((sum, b) => sum + b.amount, 0) / known.length) : 0;

  return (
    <Card padded>
      <View style={s.header}>
        <Text style={[s.value, { color: colors.textPrimary }]}>{t(`track_spend.chart_${AVG_UNIT[period]}`)}</Text>
        <Text style={[s.label, { color: colors.textSecondary }]}>
          {t(`track_spend.avg_${AVG_UNIT[period]}`, { amount: formatINR(average) })}
        </Text>
      </View>
      <View style={s.chart}>
        <BarChart
          buckets={buckets}
          formatValue={formatINR}
          a11yLabel={(label, amount) => t("track_spend.chart_a11y", { label, amount })}
        />
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" },
  value: { fontSize: 14, fontWeight: "600", lineHeight: 20, fontVariant: ["tabular-nums"] },
  label: { fontSize: 12 },
  chart: { marginTop: 6 },
});
