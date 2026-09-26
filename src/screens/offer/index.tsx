import ScreenHeader from "@components/screen-header";
import { useTheme } from "@context/Theme/ThemeContext";
import { useOffers } from "@hooks/useOffers";
import { useNavigation } from "@react-navigation/native";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useScrollToTop } from "@shared/scroll-to-top";
import { useRefresh } from "@shared/refresh";
import EmptyView from "@shared/empty-view";
import { useCallback, useState } from "react";
import type { Offer } from "@data-types/offers/constants";
import CategoryTabs from "./components/category-tabs";
import CompareBanner from "./components/compare-banner";
import HeroBanner from "./components/hero-banner";
import OfferCard from "./components/offer-card";

/** Splits offers into rows of two for the responsive grid. */
function chunkPairs(items: Offer[]): Offer[][] {
  const rows: Offer[][] = [];
  for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));
  return rows;
}

export default function OffersScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { filtered, category, setCategory } = useOffers();
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);

  // Pull-to-refresh replays the list.
  const [, setRefreshKey] = useState(0);
  const { refreshControl } = useRefresh(
    useCallback(() => setRefreshKey((k) => k + 1), []),
  );

  const openOffer = (offer: Offer) => {
    navigation.navigate("offer-detail", { offerId: offer.id });
  };

  const rows = chunkPairs(filtered);
  const isEmpty = filtered.length === 0;

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <View style={[s.header, { paddingTop: insets.top + 16 }]}>
        <ScreenHeader title={t("offers.title")} />
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
        <HeroBanner onPress={() => navigation.navigate("offer-tracker")} />

        <CategoryTabs active={category} onChange={setCategory} />

        {isEmpty ? (
          <EmptyView
            title={t("offers.empty_title")}
            description={t("offers.empty_subtitle")}
          />
        ) : (
          <>
            <View style={s.grid}>
              {rows.map((row, i) => (
                <View key={i} style={s.gridRow}>
                  {row.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} onPress={() => openOffer(offer)} />
                  ))}
                  {row.length === 1 ? <View style={s.spacer} /> : null}
                </View>
              ))}
            </View>

            <CompareBanner />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 16 },
  scroll: { paddingHorizontal: 16, gap: 16 },
  scrollEmpty: { flexGrow: 1 },
  grid: { gap: 14 },
  gridRow: { flexDirection: "row", gap: 14 },
  spacer: { flex: 1 },
});
