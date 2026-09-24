import { useTheme } from "@context/Theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import type { Partner } from "@data-types/business-partners/constants";
import {
  averageMonthlyRatePct,
  utilizationPct,
} from "@data-types/business-partners/constants";
import { formatLakh, localizeDigits } from "@utils/format-locals";
import Card from "../../shared/card";
import LogoTile from "../../shared/logo-tile";
import StatusPill from "../../shared/status-pill";
import UtilizationRing from "../../shared/utilization-ring";

type Props = { partner: Partner };

export default function PartnerSummary({ partner }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const pct = utilizationPct(partner);
  const rate = averageMonthlyRatePct(partner);

  return (
    <Card padded>
      <View style={s.top}>
        <LogoTile initials={partner.initials} color={partner.logoColor} size={52} />
        <View style={s.headText}>
          <Text style={[s.name, { color: colors.textPrimary }]} numberOfLines={1}>
            {partner.name}
          </Text>
          <Text style={[s.industry, { color: colors.textSecondary }]} numberOfLines={1}>
            {partner.industry}
          </Text>
          <View style={s.pillRow}>
            <StatusPill status={partner.status} />
          </View>
        </View>
        <UtilizationRing pct={pct} size={58} stroke={6} />
      </View>

      <View style={[s.stats, { borderTopColor: colors.divider }]}>
        <Stat
          label={t("business_partners.drawn_down")}
          value={formatLakh(partner.drawnDown)}
        />
        <View style={[s.divider, { backgroundColor: colors.divider }]} />
        <Stat
          label={t("business_partners.credit_limit")}
          value={formatLakh(partner.creditLimit)}
        />
        <View style={[s.divider, { backgroundColor: colors.divider }]} />
        <Stat
          label={t("business_partners.avg_rate")}
          value={rate != null ? `${localizeDigits(String(rate))}%` : "—"}
          accent
        />
      </View>
    </Card>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={s.stat}>
      <Text style={[s.statLabel, { color: colors.textMuted }]} numberOfLines={1}>
        {label}
      </Text>
      <Text style={[s.statValue, { color: accent ? colors.accent : colors.textPrimary }]}>
        {value}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  top: { flexDirection: "row", alignItems: "center", gap: 14 },
  headText: { flex: 1 },
  name: { fontSize: 18, fontWeight: "700" },
  industry: { fontSize: 13, marginTop: 2 },
  pillRow: { flexDirection: "row", marginTop: 8 },
  stats: { flexDirection: "row", alignItems: "center", marginTop: 18, paddingTop: 16, borderTopWidth: StyleSheet.hairlineWidth },
  stat: { flex: 1, alignItems: "center", gap: 3 },
  divider: { width: StyleSheet.hairlineWidth, height: 32 },
  statLabel: { fontSize: 11 },
  statValue: { fontSize: 15, fontWeight: "700" },
});
