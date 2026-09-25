import ScrollReveal, {
  ScrollRevealProvider,
  useScrollRevealValues,
} from "@animations/scroll-reveal";
import { useTheme } from "@context/Theme/ThemeContext";
import { PrimaryButton } from "@helpers/button";
import { useBusinessPartners } from "@hooks/useBusinessPartners";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateRangePicker from "@components/date-range-picker";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { DateRange } from "@data-types/date-range/constants";
import { useRefresh } from "@shared/refresh";
import ScreenHeader from "@components/screen-header";
import { totalInterestForPartner } from "@data-types/business-partners/constants";
import SectionHeader from "../components/shared/section-header";
import PartnerSummary from "../components/detail/partner-summary";
import TrendCard from "../components/detail/trend-card";
import InterestCard from "../components/detail/interest-card";
import InvoicesCard from "../components/detail/invoices-card";

function DetailInner() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { getPartner } = useBusinessPartners();
  const { scrollY, viewportH } = useScrollRevealValues();
  const scrollRef = useRef<ScrollView>(null);

  const partnerId: string | undefined = route.params?.partnerId;
  const partner = partnerId ? getPartner(partnerId) : undefined;

  // Replay reveal animations each time the screen gains focus.
  const [revealKey, setRevealKey] = useState(0);
  useFocusEffect(
    useCallback(() => {
      setRevealKey((k) => k + 1);
    }, []),
  );
  const { refreshControl } = useRefresh(() => setRevealKey((k) => k + 1));

  // Custom range for the trend card — owned here so the picker Modal
  // renders at the screen root (slides up correctly on all platforms).
  const [trendRange, setTrendRange] = useState<DateRange | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  if (!partner) {
    return (
      <View style={[s.root, { backgroundColor: colors.background }]}>
        <View style={[s.header, { paddingTop: insets.top + 16 }]}>
          <ScreenHeader title={t("business_partners.detail_title")} />
        </View>
        <View style={s.empty}>
          <MaterialCommunityIcons name="account-off-outline" size={40} color={colors.textMuted} />
          <Text style={[s.emptyText, { color: colors.textSecondary }]}>
            {t("business_partners.not_found")}
          </Text>
        </View>
      </View>
    );
  }

  const interestTotal = totalInterestForPartner(partner);

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <View style={[s.header, { paddingTop: insets.top + 16 }]}>
        <ScreenHeader title={partner.name} />
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 24 }]}
        scrollEventThrottle={16}
        refreshControl={refreshControl}
        onScroll={(e) => {
          scrollY.value = e.nativeEvent.contentOffset.y;
          viewportH.value = e.nativeEvent.layoutMeasurement.height;
        }}
        onLayout={(e) => {
          viewportH.value = e.nativeEvent.layout.height;
        }}
      >
        <View key={revealKey}>
          <ScrollReveal delay={0}>
            <PartnerSummary partner={partner} />
          </ScrollReveal>

          {partner.monthlyRepayment ? (
            <ScrollReveal delay={60} style={{ marginTop: 16 }}>
              <TrendCard
                drawdown={partner.monthlyDrawdown}
                repayment={partner.monthlyRepayment}
                range={trendRange}
                onRequestCustom={() => setPickerOpen(true)}
              />
            </ScrollReveal>
          ) : null}

          {partner.monthlyInterest ? (
            <ScrollReveal delay={120} style={{ marginTop: 16 }}>
              <InterestCard series={partner.monthlyInterest} total={interestTotal} />
            </ScrollReveal>
          ) : null}

          {partner.invoices && partner.invoices.length > 0 ? (
            <>
              <ScrollReveal delay={180}>
                <SectionHeader title={t("business_partners.active_invoices")} />
              </ScrollReveal>
              <ScrollReveal delay={180}>
                <InvoicesCard invoices={partner.invoices} />
              </ScrollReveal>
            </>
          ) : null}

          <ScrollReveal delay={240} style={{ marginTop: 24 }}>
            <PrimaryButton
              title={t("business_partners.raise_invoice")}
              leftAccessory={
                <MaterialCommunityIcons name="file-document-plus-outline" size={18} color="#fff" />
              }
              onPress={() => navigation.navigate("invoices")}
            />
          </ScrollReveal>
        </View>
      </ScrollView>

      <DateRangePicker
        visible={pickerOpen}
        initial={trendRange}
        onClose={() => setPickerOpen(false)}
        onApply={(r) => setTrendRange(r)}
      />
    </View>
  );
}

export default function BusinessPartnerDetailScreen() {
  return (
    <ScrollRevealProvider>
      <DetailInner />
    </ScrollRevealProvider>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 16 },
  scroll: { paddingTop: 8, paddingHorizontal: 16 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, paddingBottom: 80 },
  emptyText: { fontSize: 14 },
});
