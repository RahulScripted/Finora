import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PrimaryButton } from "@helpers/button";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { formatRupees } from "@data-types/offers/constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  amount: number;
  applicationId: string;
  appliedAt: string;
  processingTime: string;
  onViewStatus: () => void;
  onBackHome: () => void;
};

/** A single label/value row in the details card. */
function DetailRow({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={s.detailRow}>
      <Text style={[s.detailLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[s.detailValue, { color: colors.textPrimary }]}>{value}</Text>
    </View>
  );
}

/**
 * Rich success screen shown after an application is submitted.
 * Shared because every offer flow ends here.
 */
export default function ApplicationSubmitted({
  amount,
  applicationId,
  appliedAt,
  processingTime,
  onViewStatus,
  onBackHome,
}: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 24 }]}
    >
      <View style={[s.tick, { backgroundColor: colors.successSoft }]}>
        <MaterialCommunityIcons name="check" size={40} color={colors.success} />
      </View>

      <Text style={[s.title, { color: colors.textPrimary }]}>{t("offers.confirmation.title")}</Text>
      <Text style={[s.subtitle, { color: colors.textSecondary }]}>
        {t("offers.confirmation.subtitle", { amount: formatRupees(amount) })}
      </Text>

      <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <DetailRow label={t("offers.confirmation.application_id")} value={applicationId} />
        <View style={[s.divider, { backgroundColor: colors.divider }]} />
        <DetailRow label={t("offers.confirmation.applied_on")} value={appliedAt} />
        <View style={[s.divider, { backgroundColor: colors.divider }]} />
        <DetailRow label={t("offers.confirmation.processing_time")} value={processingTime} />
      </View>

      <View style={s.actions}>
        <PrimaryButton title={t("offers.confirmation.view_status")} onPress={onViewStatus} />
        <PrimaryButton
          title={t("offers.confirmation.back_home")}
          variant="secondary"
          onPress={onBackHome}
        />
      </View>

      <View style={s.brand}>
        <MaterialCommunityIcons name="finance" size={22} color={colors.accent} />
        <Text style={[s.brandName, { color: colors.textPrimary }]}>Finora</Text>
      </View>
      <Text style={[s.tagline, { color: colors.textMuted }]}>{t("offers.confirmation.tagline")}</Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { alignItems: "center", paddingHorizontal: 20, paddingTop: 24 },
  tick: { width: 88, height: 88, borderRadius: 44, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  title: { fontSize: 22, fontWeight: "800", textAlign: "center" },
  subtitle: { fontSize: 14, textAlign: "center", lineHeight: 20, marginTop: 8, marginBottom: 24, paddingHorizontal: 12 },
  card: { width: "100%", borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 16 },
  detailRow: { paddingVertical: 14, gap: 4 },
  detailLabel: { fontSize: 12.5 },
  detailValue: { fontSize: 15, fontWeight: "700" },
  divider: { height: StyleSheet.hairlineWidth },
  actions: { width: "100%", gap: 12, marginTop: 20 },
  brand: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 28 },
  brandName: { fontSize: 18, fontWeight: "800" },
  tagline: { fontSize: 12.5, marginTop: 6 },
});
