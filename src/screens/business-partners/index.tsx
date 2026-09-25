import ScrollReveal, {
  ScrollRevealProvider,
  useScrollRevealValues,
} from "@animations/scroll-reveal";
import ScreenHeader from "@components/screen-header";
import { useTheme } from "@context/Theme/ThemeContext";
import { useBusinessPartners } from "@hooks/useBusinessPartners";
import DateRangePicker from "@components/date-range-picker";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { DateRange } from "@data-types/date-range/constants";
import { useRefresh } from "@shared/refresh";
import { useScrollToTop } from "@shared/scroll-to-top";
import SectionHeader from "./components/shared/section-header";
import ListSkeleton from "./components/shared/skeleton";
import ExposureCard from "./components/exposure-card";
import DrawdownByPartnerCard from "./components/drawdown-by-partner-card";
import PartnerCard from "./components/partner-card";

function BusinessPartnersInner() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { data, isLoading, refetch } = useBusinessPartners();
  const { refreshControl } = useRefresh(refetch);
  const { scrollY, viewportH } = useScrollRevealValues();
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);

  // Bump a key each time the screen gains focus so the reveal animations
  // replay on every visit, not just the first mount.
  const [revealKey, setRevealKey] = useState(0);
  useFocusEffect(
    useCallback(() => {
      setRevealKey((k) => k + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, []),
  );

  // Custom range for the "Drawdown by partner" card — owned here so the
  // date-range picker Modal renders at the screen root (slides from bottom).
  const [drawdownRange, setDrawdownRange] = useState<DateRange | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <View style={[s.header, { paddingTop: insets.top + 16 }]}>
        <ScreenHeader title={t("business_partners.title")} />
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 32 }]}
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
        {isLoading ? (
          <ListSkeleton />
        ) : (
          <View key={revealKey}>
            <ScrollReveal delay={0}>
              <ExposureCard data={data} />
            </ScrollReveal>

            <ScrollReveal delay={60} style={{ marginTop: 16 }}>
              <DrawdownByPartnerCard
                partners={data.partners}
                range={drawdownRange}
                onRequestCustom={() => setPickerOpen(true)}
              />
            </ScrollReveal>

            <ScrollReveal delay={0}>
              <SectionHeader title={t("business_partners.your_partners")} />
            </ScrollReveal>

            <View style={s.list}>
              {data.partners.map((p, i) => (
                <ScrollReveal key={p.id} delay={120 + i * 70}>
                  <PartnerCard
                    partner={p}
                    onPress={() =>
                      navigation.navigate("business-partner-detail", { partnerId: p.id })
                    }
                  />
                </ScrollReveal>
              ))}
            </View>

            <ScrollReveal delay={0}>
              <Text style={[s.footer, { color: colors.textMuted }]}>
                {t("business_partners.footer_note")}
              </Text>
            </ScrollReveal>
          </View>
        )}
      </ScrollView>

      <DateRangePicker
        visible={pickerOpen}
        initial={drawdownRange}
        onClose={() => setPickerOpen(false)}
        onApply={(r) => setDrawdownRange(r)}
      />
    </View>
  );
}

export default function BusinessPartnersScreen() {
  return (
    <ScrollRevealProvider>
      <BusinessPartnersInner />
    </ScrollRevealProvider>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 16 },
  scroll: { paddingTop: 8, paddingHorizontal: 16 },
  list: { gap: 12 },
  footer: { fontSize: 11, lineHeight: 16, textAlign: "center", marginTop: 24, paddingHorizontal: 24 },
});
