import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import type { SpendSummary } from "@data-types/track-spend/constants";
import { formatINR, formatLakh } from "@utils/format-locals";
import { useCountUp } from "../shared/use-count-up";

type Props = { data: SpendSummary };

/** Headline spend figure, period delta, and the funded/spent/unspent stat strip. */
export default function Hero({ data }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const animatedTotal = useCountUp(data.totalSpent);
  const isDown = data.changePct < 0;
  const pct = Math.abs(data.changePct);
  const usedPct = data.funded > 0 ? Math.round((data.totalSpent / data.funded) * 100) : 0;

  const stats = [
    {
      label: t("track_spend.funded"),
      value: formatLakh(data.funded),
      sub: t("track_spend.invoices_count", { count: data.fundedInvoiceCount }),
      color: colors.textPrimary,
    },
    {
      label: t("track_spend.spent"),
      value: formatLakh(data.totalSpent),
      sub: t("track_spend.pct_used", { pct: usedPct }),
      color: colors.accent,
    },
    {
      label: t("track_spend.unspent"),
      value: formatLakh(data.unspent),
      sub: t("track_spend.in_wallet"),
      color: colors.textPrimary,
    },
  ];

  return (
    <View style={s.hero}>
      <Text style={[s.label, { color: colors.textSecondary }]}>{t("track_spend.spent_label")}</Text>
      <Text
        style={[s.amount, { color: colors.textPrimary }]}
        accessibilityLabel={formatINR(data.totalSpent)}
        adjustsFontSizeToFit
        numberOfLines={1}
      >
        {formatINR(animatedTotal)}
      </Text>
      <View style={[s.deltaPill, { backgroundColor: isDown ? colors.successSoft : colors.accent + "18" }]}>
        <MaterialCommunityIcons
          name={isDown ? "arrow-bottom-right" : "arrow-top-right"}
          size={14}
          color={isDown ? colors.success : colors.accent}
        />
        <Text style={[s.deltaText, { color: isDown ? colors.success : colors.accent }]}>
          {t(isDown ? "track_spend.delta_down" : "track_spend.delta_up", { pct })}
        </Text>
      </View>

      <View style={[s.stats, { borderTopColor: colors.divider }]}>
        {stats.map((stat, i) => (
          <View
            key={stat.label}
            style={[
              s.statCell,
              i > 0 && { borderLeftColor: colors.divider, borderLeftWidth: StyleSheet.hairlineWidth, paddingLeft: 12 },
            ]}
          >
            <Text style={[s.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
            <Text style={[s.statValue, { color: stat.color }]}>{stat.value}</Text>
            <Text style={[s.statSub, { color: colors.textMuted }]} numberOfLines={1}>
              {stat.sub}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  hero: { paddingTop: 22, paddingHorizontal: 4 },
  label: { fontSize: 13 },
  amount: { fontSize: 38, fontWeight: "700", letterSpacing: -0.6, marginTop: 2, fontVariant: ["tabular-nums"] },
  deltaPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 10,
  },
  deltaText: { fontSize: 12, fontWeight: "600" },
  stats: { flexDirection: "row", marginTop: 20, paddingTop: 16, borderTopWidth: StyleSheet.hairlineWidth },
  statCell: { flex: 1 },
  statLabel: { fontSize: 12 },
  statValue: { fontSize: 17, fontWeight: "700", marginTop: 2, fontVariant: ["tabular-nums"] },
  statSub: { fontSize: 11, marginTop: 1 },
});
