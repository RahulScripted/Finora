import DonutChart from "@components/chart/donut-chart";
import { useTheme } from "@context/Theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import type { BusinessPartnersData } from "@data-types/business-partners/constants";
import { exposureShare } from "@data-types/business-partners/constants";
import type { DonutSlice } from "@data-types/chart/constants";
import { formatLakh, localizeDigits } from "@utils/format-locals";
import Card from "../shared/card";

type Props = { data: BusinessPartnersData };

export default function ExposureCard({ data }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const slices = exposureShare(data.partners);
  const donutSlices: DonutSlice[] = slices.map((sl) => ({
    key: sl.partner.id,
    pct: sl.pct,
    color: sl.color,
  }));

  return (
    <Card padded>
      <View style={s.row}>
        <DonutChart
          slices={donutSlices}
          size={120}
          stroke={16}
          centerContent={
            <>
              <Text style={[s.exposureValue, { color: colors.textPrimary }]}>
                {formatLakh(data.summary.totalDrawdown)}
              </Text>
              <Text style={[s.exposureLabel, { color: colors.textMuted }]}>
                {t("business_partners.exposure")}
              </Text>
            </>
          }
        />

        <View style={s.legend}>
          {slices.map((sl) => (
            <View key={sl.partner.id} style={s.legendRow}>
              <View style={[s.legendDot, { backgroundColor: sl.color }]} />
              <Text style={[s.legendName, { color: colors.textSecondary }]} numberOfLines={1}>
                {sl.partner.name}
              </Text>
              <Text style={[s.legendPct, { color: colors.textPrimary }]}>
                {localizeDigits(String(sl.pct))}%
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[s.stats, { borderTopColor: colors.divider }]}>
        <Stat
          label={t("business_partners.drawn_down")}
          value={formatLakh(data.summary.totalDrawdown)}
          color={colors.textPrimary}
        />
        <View style={[s.statDivider, { backgroundColor: colors.divider }]} />
        <Stat
          label={t("business_partners.interest_paid")}
          value={formatLakh(data.summary.totalInterestPaid)}
          color={colors.accent}
        />
        <View style={[s.statDivider, { backgroundColor: colors.divider }]} />
        <Stat
          label={t("business_partners.partners")}
          value={localizeDigits(String(data.summary.partnerCount))}
          color={colors.textPrimary}
        />
      </View>
    </Card>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  const { colors } = useTheme();
  return (
    <View style={s.stat}>
      <Text style={[s.statLabel, { color: colors.textMuted }]} numberOfLines={1}>
        {label}
      </Text>
      <Text style={[s.statValue, { color }]}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 18 },
  exposureValue: { fontSize: 20, fontWeight: "700", letterSpacing: -0.5 },
  exposureLabel: { fontSize: 11, marginTop: 1 },
  legend: { flex: 1, gap: 10 },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  legendDot: { width: 9, height: 9, borderRadius: 5 },
  legendName: { flex: 1, fontSize: 13, fontWeight: "500" },
  legendPct: { fontSize: 13, fontWeight: "700", fontVariant: ["tabular-nums"] },
  stats: { flexDirection: "row", alignItems: "center", marginTop: 18, paddingTop: 16, borderTopWidth: StyleSheet.hairlineWidth },
  stat: { flex: 1, alignItems: "center", gap: 3 },
  statDivider: { width: StyleSheet.hairlineWidth, height: 32 },
  statLabel: { fontSize: 11 },
  statValue: { fontSize: 15, fontWeight: "700" },
});
