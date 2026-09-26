import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { CostBreakdown } from "@data-types/offers/constants";
import { formatRupees } from "@data-types/offers/constants";

type Props = {
  cost: CostBreakdown;
  agreed: boolean;
  onToggleAgree: () => void;
};

/** A single label/value charge row. */
function Row({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={s.row}>
      <Text style={[s.rowLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[s.rowValue, { color: colors.textPrimary }]}>{value}</Text>
    </View>
  );
}

/** Step 3 — full cost breakdown with a terms checkbox. */
export default function CostStep({ cost, agreed, onToggleAgree }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={s.wrap}>
      {/* Requested summary */}
      <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={s.row}>
          <View style={s.flex}>
            <Text style={[s.rowLabel, { color: colors.textSecondary }]}>
              {t("offers.apply.you_requested")}
            </Text>
            <Text style={[s.rowSub, { color: colors.textMuted }]}>
              {t("offers.apply.requested_for", { days: cost.tenureDays, rate: cost.monthlyRate })}
            </Text>
          </View>
          <Text style={[s.requested, { color: colors.textPrimary }]}>
            {formatRupees(cost.principal)}
          </Text>
        </View>
      </View>

      {/* Charges */}
      <Text style={[s.heading, { color: colors.textSecondary }]}>{t("offers.apply.charges")}</Text>
      <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Row label={t("offers.apply.interest_days", { days: cost.tenureDays })} value={formatRupees(cost.interest)} />
        <View style={[s.divider, { backgroundColor: colors.divider }]} />
        <Row label={t("offers.apply.processing_fee", { pct: 1 })} value={formatRupees(cost.processingFee)} />
        <View style={[s.divider, { backgroundColor: colors.divider }]} />
        <Row label={t("offers.apply.gst_on_fee", { pct: 18 })} value={formatRupees(cost.gstOnFee)} />
        <View style={[s.divider, { backgroundColor: colors.divider }]} />
        <Row label={t("offers.apply.stamp_duty")} value={formatRupees(cost.stampDuty)} />
      </View>

      {/* Totals */}
      <View style={[s.totals, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={s.row}>
          <Text style={[s.totalLabel, { color: colors.textPrimary }]}>{t("offers.apply.disbursed")}</Text>
          <Text style={[s.totalValue, { color: colors.textPrimary }]}>{formatRupees(cost.disbursed)}</Text>
        </View>
        <View style={s.row}>
          <Text style={[s.totalLabel, { color: colors.textPrimary }]}>{t("offers.apply.total_repayable")}</Text>
          <Text style={[s.totalValue, { color: colors.accent }]}>{formatRupees(cost.totalRepayable)}</Text>
        </View>
      </View>

      {/* Terms */}
      <Pressable onPress={onToggleAgree} accessibilityRole="checkbox" accessibilityState={{ checked: agreed }} style={s.agreeRow}>
        <MaterialCommunityIcons
          name={agreed ? "checkbox-marked" : "checkbox-blank-outline"}
          size={20}
          color={agreed ? colors.accent : colors.textMuted}
        />
        <Text style={[s.agreeText, { color: colors.textSecondary }]}>{t("offers.apply.agree_terms")}</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { gap: 14, paddingTop: 8 },
  flex: { flex: 1 },
  card: { borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 16, paddingVertical: 4 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12, gap: 12 },
  rowLabel: { fontSize: 14 },
  rowSub: { fontSize: 12, marginTop: 2 },
  rowValue: { fontSize: 14, fontWeight: "600" },
  requested: { fontSize: 16, fontWeight: "800" },
  heading: { fontSize: 13, fontWeight: "600" },
  divider: { height: StyleSheet.hairlineWidth },
  totals: { borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 16, paddingVertical: 6, gap: 0 },
  totalLabel: { fontSize: 15, fontWeight: "700" },
  totalValue: { fontSize: 15, fontWeight: "800" },
  agreeRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, paddingHorizontal: 4 },
  agreeText: { flex: 1, fontSize: 13, lineHeight: 18 },
});
