import PiePanel from "@shared/pie-panel";
import { useTheme } from "@context/Theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import type { BusinessPartnersData } from "@data-types/business-partners/constants";
import { exposureShare } from "@data-types/business-partners/constants";
import type { PieSlice } from "@data-types/chart/constants";
import { formatLakh, localizeDigits } from "@utils/format-locals";
import Card from "../shared/card";

type Props = { data: BusinessPartnersData };

export default function ExposureCard({ data }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const slices = exposureShare(data.partners);
  // Use each partner's share directly as the slice value so legend
  // percentages match the original (pre-computed) exposure split.
  const pieData: PieSlice[] = slices.map((sl) => ({
    name: sl.partner.name,
    value: sl.pct,
    color: sl.color,
  }));

  return (
    <Card padded>
      <PiePanel
        bare
        layout="horizontal"
        legendValue="pct"
        size={120}
        stroke={16}
        data={pieData}
        formatPct={(p) => `${localizeDigits(String(Math.round(p)))}%`}
        centerValue={
          <Text style={[s.exposureValue, { color: colors.textPrimary }]}>
            {formatLakh(data.summary.totalDrawdown)}
          </Text>
        }
        centerLabel={
          <Text style={[s.exposureLabel, { color: colors.textMuted }]}>
            {t("business_partners.exposure")}
          </Text>
        }
      />

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
  exposureValue: { fontSize: 20, fontWeight: "700", letterSpacing: -0.5 },
  exposureLabel: { fontSize: 11, marginTop: 1 },
  stats: { flexDirection: "row", alignItems: "center", marginTop: 18, paddingTop: 16, borderTopWidth: StyleSheet.hairlineWidth },
  stat: { flex: 1, alignItems: "center", gap: 3 },
  statDivider: { width: StyleSheet.hairlineWidth, height: 32 },
  statLabel: { fontSize: 11 },
  statValue: { fontSize: 15, fontWeight: "700" },
});
