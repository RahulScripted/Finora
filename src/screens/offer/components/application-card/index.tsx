import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { LoanApplication, ApplicationStatus } from "@data-types/offers/constants";
import { formatRupees } from "@data-types/offers/constants";
import { useOffers } from "@hooks/useOffers";

type Props = {
  application: LoanApplication;
  onPress: () => void;
};

/** Resolves the accent + soft background for a given application status. */
function statusColors(status: ApplicationStatus, colors: ReturnType<typeof useTheme>["colors"]) {
  switch (status) {
    case "approved":
    case "disbursed":
      return { fg: colors.success, bg: colors.success + "1F" };
    case "rejected":
      return { fg: colors.danger, bg: colors.danger + "1F" };
    default:
      return { fg: colors.warning, bg: colors.warning + "1F" };
  }
}

/** Row card for a single submitted loan application on the tracker list. */
export default function ApplicationCard({ application, onPress }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { getOffer } = useOffers();

  const offer = getOffer(application.offerId);
  const tint = offer?.tint ?? colors.accent;
  const icon = offer?.icon ?? "file-document-outline";
  const status = statusColors(application.status, colors);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        s.card,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.9 : 1 },
      ]}
    >
      <View style={[s.iconWrap, { backgroundColor: tint + "1F" }]}>
        <MaterialCommunityIcons name={icon as any} size={22} color={tint} />
      </View>

      <View style={s.body}>
        <View style={s.topRow}>
          <Text style={[s.name, { color: colors.textPrimary }]} numberOfLines={1}>
            {t(`offers.products.${application.offerId}.title`)}
          </Text>
          <View style={[s.badge, { backgroundColor: status.bg }]}>
            <Text style={[s.badgeText, { color: status.fg }]}>
              {t(`offers.applications.status.${application.status}`)}
            </Text>
          </View>
        </View>

        <Text style={[s.amount, { color: colors.textPrimary }]}>
          {formatRupees(application.amount)}
        </Text>
        <Text style={[s.applied, { color: colors.textMuted }]}>
          {t("offers.applications.applied_on", { date: application.appliedOn })}
        </Text>
      </View>

      <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
  },
  iconWrap: { width: 44, height: 44, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  body: { flex: 1, gap: 2 },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  name: { flex: 1, fontSize: 14.5, fontWeight: "700" },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: "700" },
  amount: { fontSize: 16, fontWeight: "800", marginTop: 2 },
  applied: { fontSize: 12 },
});
