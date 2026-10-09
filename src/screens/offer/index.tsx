import ScreenHeader from "@components/screen-header";
import { useTheme } from "@context/Theme/ThemeContext";
import { useOffers } from "@hooks/useOffers";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useScrollToTop } from "@shared/scroll-to-top";
import { useRefresh } from "@shared/refresh";
import type { Offer, OfferSectionCard } from "@data-types/offers/constants";
import CategoryTile from "./components/category-tile";
import FeaturedCard from "./components/featured-card";
import HeroBanner from "./components/hero-banner";
import NeedHelp from "./components/need-help";
import OfferSectionCards from "./components/section-cards";
import SectionHeading from "./components/section-heading";

export default function OffersScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { sections, featured, offers } = useOffers();
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);

  // Pull-to-refresh replays the landing.
  const [, setRefreshKey] = useState(0);
  const { refreshControl } = useRefresh(
    useCallback(() => setRefreshKey((k) => k + 1), []),
  );

  const openSection = (card: OfferSectionCard) => navigation.navigate(card.route);
  const openOffer = (offer: Offer) => navigation.navigate("offer-detail", { offerId: offer.id });
  const openAllOffers = () => navigation.navigate("offer-list");

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <View style={[s.header, { paddingTop: insets.top + 16 }]}>
        <ScreenHeader title={t("offers.title")} />
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 32 }]}
        refreshControl={refreshControl}
      >
        <HeroBanner />

        {/* Flexible offer section — entry cards driven by config. */}
        <OfferSectionCards cards={sections} onPress={openSection} />

        {/* Loan Categories → "View all" opens the full list. */}
        <View style={s.block}>
          <SectionHeading
            title={t("offers.loan_categories_title")}
            actionLabel={t("offers.view_all")}
            onActionPress={openAllOffers}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.previewRow}
          >
            {offers.map((offer) => (
              <CategoryTile key={offer.id} offer={offer} onPress={() => openOffer(offer)} />
            ))}
          </ScrollView>
        </View>

        {/* Featured offers strip. */}
        <View style={s.block}>
          <SectionHeading title={t("offers.featured_title")} badge={t("offers.featured_badge")} />
          <View style={s.featured}>
            {featured.map((offer) => (
              <FeaturedCard key={offer.id} offer={offer} onPress={() => openOffer(offer)} />
            ))}
          </View>
        </View>

        <NeedHelp onPress={() => navigation.navigate("help-support")} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 16 },
  scroll: { paddingHorizontal: 16, gap: 20 },
  block: { gap: 14 },
  featured: { gap: 14 },
  previewRow: { gap: 12, paddingRight: 4 },
});
