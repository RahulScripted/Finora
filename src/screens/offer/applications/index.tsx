import { useTheme } from "@context/Theme/ThemeContext";
import { useOffers } from "@hooks/useOffers";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useScrollToTop } from "@shared/scroll-to-top";
import { useRefresh } from "@shared/refresh";
import EmptyView from "@shared/empty-view";
import type { LoanApplication } from "@data-types/offers/constants";
import NavHeader from "../shared/nav-header";
import ApplicationCard from "../components/application-card";
import StatusTabs from "../components/status-tabs";

/** Track Applications — a list of submitted loan applications. */
export default function OfferApplicationsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { filteredApplications, applicationFilter, setApplicationFilter } = useOffers();
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);

  const [, setRefreshKey] = useState(0);
  const { refreshControl } = useRefresh(
    useCallback(() => setRefreshKey((k) => k + 1), []),
  );

  const openApplication = (app: LoanApplication) =>
    navigation.navigate("offer-tracker", { applicationId: app.id });

  const isEmpty = filteredApplications.length === 0;

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <View style={[s.header, { paddingTop: insets.top + 12 }]}>
        <NavHeader title={t("offers.applications.title")} />
        <Text style={[s.subtitle, { color: colors.textSecondary }]}>
          {t("offers.applications.subtitle")}
        </Text>
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          s.scroll,
          { paddingBottom: insets.bottom + 32 },
          isEmpty && s.scrollEmpty,
        ]}
        refreshControl={refreshControl}
      >
        <StatusTabs active={applicationFilter} onChange={setApplicationFilter} />

        {isEmpty ? (
          <EmptyView
            title={t("offers.applications.empty_title")}
            description={t("offers.applications.empty_subtitle")}
          />
        ) : (
          <View style={s.list}>
            {filteredApplications.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onPress={() => openApplication(app)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 8, gap: 8 },
  subtitle: { fontSize: 13, lineHeight: 19 },
  scroll: { paddingHorizontal: 16, gap: 16 },
  scrollEmpty: { flexGrow: 1 },
  list: { gap: 14 },
});
