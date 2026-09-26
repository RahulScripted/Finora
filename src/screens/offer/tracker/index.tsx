import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PrimaryButton } from "@helpers/button";
import { useOffers } from "@hooks/useOffers";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatRupees } from "@data-types/offers/constants";
import { useRefresh } from "@shared/refresh";
import EmptyView from "@shared/empty-view";
import NavHeader from "../shared/nav-header";
import StickyFooter from "../shared/sticky-footer";
import TrackerTimeline from "./components/tracker-timeline";

export default function OfferTrackerScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { latestApplication, getApplication } = useOffers();

  const applicationId: string | undefined = route.params?.applicationId;
  const application = applicationId ? getApplication(applicationId) : latestApplication;

  const [, setRefreshKey] = useState(0);
  const { refreshControl } = useRefresh(
    useCallback(() => setRefreshKey((k) => k + 1), []),
  );

  if (!application) {
    return (
      <View style={[s.root, { backgroundColor: colors.background }]}>
        <View style={[s.header, { paddingTop: insets.top + 12 }]}>
          <NavHeader title={t("offers.tracker.title")} onBack={() => navigation.goBack()} />
        </View>
        <EmptyView
          title={t("offers.tracker.not_found")}
          ctaIcon="arrow-left"
          ctaLabel={t("common.back")}
          onCtaPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <View style={[s.header, { paddingTop: insets.top + 12 }]}>
        <NavHeader title={t("offers.tracker.title")} onBack={() => navigation.goBack()} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
        refreshControl={refreshControl}
      >
        <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Summary */}
          <View style={s.summary}>
            <View style={[s.avatar, { backgroundColor: colors.textPrimary }]}>
              <Text style={[s.avatarText, { color: colors.background }]}>
                {application.lenderInitials}
              </Text>
            </View>
            <View style={s.summaryBody}>
              <Text style={[s.loanName, { color: colors.textPrimary }]}>
                {t(`offers.products.${application.offerId}.title`)}
              </Text>
              <Text style={[s.lender, { color: colors.textSecondary }]}>{application.lender}</Text>
            </View>
            <View style={[s.badge, { backgroundColor: colors.info + "18" }]}>
              <Text style={[s.badgeText, { color: colors.info }]}>
                {t(`offers.tracker.status.${application.status}`)}
              </Text>
            </View>
          </View>

          <Text style={[s.amount, { color: colors.textPrimary }]}>
            {formatRupees(application.amount)}
          </Text>
          <Text style={[s.appliedOn, { color: colors.textMuted }]}>
            {t("offers.tracker.applied_on", { date: application.appliedOn })}
          </Text>

          <View style={[s.divider, { backgroundColor: colors.divider }]} />

          {/* Timeline */}
          <TrackerTimeline steps={application.steps} />

          {/* Info note */}
          <View style={[s.note, { backgroundColor: colors.info + "12" }]}>
            <MaterialCommunityIcons name="information-outline" size={18} color={colors.info} />
            <View style={s.noteBody}>
              <Text style={[s.noteTitle, { color: colors.textPrimary }]}>
                {t("offers.tracker.note_title")}
              </Text>
              <Text style={[s.noteText, { color: colors.textSecondary }]}>
                {t("offers.tracker.note_body")}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <StickyFooter>
        <PrimaryButton
          title={t("offers.tracker.back_to_offers")}
          variant="secondary"
          onPress={() => navigation.navigate("credit")}
        />
      </StickyFooter>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 8 },
  scroll: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 },
  card: { borderRadius: 20, borderWidth: StyleSheet.hairlineWidth, padding: 18 },
  summary: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 15, fontWeight: "800" },
  summaryBody: { flex: 1 },
  loanName: { fontSize: 15, fontWeight: "700" },
  lender: { fontSize: 13, marginTop: 2 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: "700" },
  amount: { fontSize: 22, fontWeight: "800", marginTop: 14 },
  appliedOn: { fontSize: 12.5, marginTop: 4 },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 18 },
  note: { flexDirection: "row", gap: 10, borderRadius: 14, padding: 14, marginTop: 8, alignItems: "flex-start" },
  noteBody: { flex: 1, gap: 3 },
  noteTitle: { fontSize: 13.5, fontWeight: "700" },
  noteText: { fontSize: 12.5, lineHeight: 18 },
});
