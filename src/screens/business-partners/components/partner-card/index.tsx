import Sparkline from "@components/chart/sparkline";
import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Partner } from "@data-types/business-partners/constants";
import { utilizationPct } from "@data-types/business-partners/constants";
import { formatLakh } from "@utils/format-locals";
import LogoTile from "../shared/logo-tile";
import UtilizationRing from "../shared/utilization-ring";

type Props = { partner: Partner; onPress: () => void };

export default function PartnerCard({ partner, onPress }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const pct = utilizationPct(partner);
  const since = new Date(partner.partnerSince).getFullYear();
  const trend = partner.monthlyDrawdown.map((m) => m.amount);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityHint={t("business_partners.view_partner_hint")}
      style={({ pressed }) => [
        s.card,
        {
          backgroundColor: colors.card,
          borderColor: pressed ? colors.accent + "55" : colors.border,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <View style={s.top}>
        <LogoTile initials={partner.initials} color={partner.logoColor} />
        <View style={s.headText}>
          <Text style={[s.name, { color: colors.textPrimary }]} numberOfLines={1}>
            {partner.name}
          </Text>
          <Text style={[s.meta, { color: colors.textSecondary }]} numberOfLines={1}>
            {partner.industry} · {t("business_partners.since", { year: since })}
          </Text>
        </View>
        {/* Explicit affordance that the whole card opens the detail */}
        <View style={[s.chevron, { backgroundColor: colors.surface }]}>
          <MaterialCommunityIcons name="chevron-right" size={18} color={colors.textMuted} />
        </View>
      </View>

      <View style={s.bottom}>
        <Sparkline points={trend} color={partner.logoColor} />
        <View style={s.drawnCol}>
          <Text style={[s.drawnLabel, { color: colors.textMuted }]}>
            {t("business_partners.drawn_down")}
          </Text>
          <Text style={[s.drawnValue, { color: colors.textPrimary }]}>
            {formatLakh(partner.drawnDown)}
          </Text>
        </View>
        <UtilizationRing pct={pct} />
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, padding: 16, gap: 16 },
  top: { flexDirection: "row", alignItems: "center", gap: 12 },
  headText: { flex: 1 },
  name: { fontSize: 15, fontWeight: "700" },
  meta: { fontSize: 12, marginTop: 2 },
  chevron: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  bottom: { flexDirection: "row", alignItems: "center", gap: 12 },
  drawnCol: { flex: 1 },
  drawnLabel: { fontSize: 11 },
  drawnValue: { fontSize: 15, fontWeight: "700", marginTop: 2 },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth },
  footerText: { fontSize: 12, fontWeight: "600" },
});
