import ScrollReveal, { ScrollRevealProvider, useScrollRevealValues } from "@animations/scroll-reveal";
import DateRangePicker from "@components/date-range-picker";
import ScreenHeader from "@components/screen-header";
import { useTheme } from "@context/Theme/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSpendSummary } from "@hooks/useSpendSummary";
import { PrimaryButton } from "@helpers/button";
import type { Period } from "@data-types/track-spend/constants";
import type { DateRange } from "@data-types/date-range/constants";
import { formatShortDate } from "@utils/format-locals";
import { useScrollToTop } from "@shared/scroll-to-top";
import CategoryBreakdown from "./components/category-breakdown";
import CostOfFunds from "./components/cost-of-funds";
import Hero from "./components/hero";
import Insight from "./components/insight";
import InvoiceSpend from "./components/invoice-spend";
import PeriodSwitch from "./components/period-switch";
import RecentPayments from "@shared/recent-payments";
import Repayments from "./components/repayments";
import SpendChart from "@shared/spend-chart";
import StatementSheet from "./components/statement-sheet";
import SectionHeader from "./components/shared/section-header";
import SkeletonBlock from "./components/shared/skeleton-block";

const ROUTES = {
  invoices: "invoices",
  paymentHistory: "payment-history",
};

function TrackSpendInner() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [period, setPeriod] = useState<Period>("month");
  const [customRange, setCustomRange] = useState<DateRange | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [statementOpen, setStatementOpen] = useState(false);
  const { data, isLoading, isRefetching, refetch } = useSpendSummary(period);
  const { scrollY, viewportH } = useScrollRevealValues();
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);

  const customLabel = customRange
    ? `${formatShortDate(customRange.start)} – ${formatShortDate(customRange.end)}`
    : null;

  const handlePeriodChange = (p: Period) => {
    setCustomRange(null);
    setPeriod(p);
  };

  return (
    <View style={[s.container, { backgroundColor: colors.background, paddingTop: insets.top + 16 }]}>
      <ScreenHeader title={t("track_spend.title")} />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 32 }]}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.accent} />}
        scrollEventThrottle={16}
        onScroll={(e) => {
          scrollY.value = e.nativeEvent.contentOffset.y;
          viewportH.value = e.nativeEvent.layoutMeasurement.height;
        }}
        onLayout={(e) => {
          viewportH.value = e.nativeEvent.layout.height;
        }}
      >
        <PeriodSwitch
          value={period}
          onChange={handlePeriodChange}
          customLabel={customLabel}
          onOpenCustom={() => setPickerOpen(true)}
        />

        {isLoading ? (
          <View style={s.skeletons}>
            <SkeletonBlock height={150} />
            <SkeletonBlock height={190} />
            <SkeletonBlock height={220} />
          </View>
        ) : (
          <>
            <ScrollReveal delay={0}>
              <Hero data={data} />
            </ScrollReveal>

            <ScrollReveal delay={80} style={s.gapTop16}>
              <SpendChart buckets={data.buckets} period={period} />
            </ScrollReveal>

            <ScrollReveal delay={140}>
              <SectionHeader
                title={t("track_spend.spend_by_invoice")}
                action={t("track_spend.all_invoices")}
                onAction={() => navigation.navigate(ROUTES.invoices)}
              />
              <InvoiceSpend data={data} />
            </ScrollReveal>

            <ScrollReveal delay={200} style={s.gapTop14}>
              <Insight data={data} />
            </ScrollReveal>

            <ScrollReveal delay={260}>
              <SectionHeader title={t("track_spend.where_it_went")} />
              <CategoryBreakdown data={data} />
            </ScrollReveal>

            <ScrollReveal delay={320}>
              <SectionHeader title={t("track_spend.cost_of_funds")} />
              <CostOfFunds data={data} />
            </ScrollReveal>

            <ScrollReveal delay={380}>
              <SectionHeader title={t("track_spend.repayments")} action={t("track_spend.next_30_days")} />
              <Repayments data={data} />
            </ScrollReveal>

            <ScrollReveal delay={440}>
              <SectionHeader
                title={t("track_spend.recent_payments")}
                action={t("track_spend.see_all")}
                onAction={() => navigation.navigate(ROUTES.paymentHistory)}
              />
              <RecentPayments data={data} />
            </ScrollReveal>

            <ScrollReveal delay={500}>
              <PrimaryButton
                title={t("track_spend.download_statement")}
                onPress={() => setStatementOpen(true)}
                style={s.ctaBtn}
              />
            </ScrollReveal>
          </>
        )}
      </ScrollView>

      <DateRangePicker
        visible={pickerOpen}
        initial={customRange}
        onClose={() => setPickerOpen(false)}
        onApply={setCustomRange}
      />

      <StatementSheet
        visible={statementOpen}
        onClose={() => setStatementOpen(false)}
        onDownload={() => {
          // TODO: wire to the real statement export once the API is available.
        }}
      />
    </View>
  );
}

export default function TrackSpendScreen() {
  return (
    <ScrollRevealProvider>
      <TrackSpendInner />
    </ScrollRevealProvider>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  scroll: { paddingTop: 8 },
  gapTop14: { marginTop: 14 },
  gapTop16: { marginTop: 16 },
  skeletons: { gap: 14, marginTop: 20 },
  pressed: { opacity: 0.6 },
  ctaBtn: { marginTop: 24 },
});
