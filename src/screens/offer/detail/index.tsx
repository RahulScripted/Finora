import { useTheme } from "@context/Theme/ThemeContext";
import { PrimaryButton } from "@helpers/button";
import { useOffers } from "@hooks/useOffers";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { OfferId } from "@data-types/offers/constants";
import { useRefresh } from "@shared/refresh";
import EmptyView from "@shared/empty-view";
import { useCallback, useState } from "react";
import NavHeader from "../shared/nav-header";
import StickyFooter from "../shared/sticky-footer";
import HowItWorks from "./components/how-it-works";
import ProductHero from "./components/product-hero";

export default function OfferDetailScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { getOffer } = useOffers();

  // Bump to replay the content on pull-to-refresh.
  const [, setRefreshKey] = useState(0);
  const { refreshControl } = useRefresh(
    useCallback(() => setRefreshKey((k) => k + 1), []),
  );

  const offerId: OfferId | undefined = route.params?.offerId;
  const offer = offerId ? getOffer(offerId) : undefined;

  if (!offer) {
    return (
      <View style={[s.root, { backgroundColor: colors.background }]}>
        <View style={[s.header, { paddingTop: insets.top + 12 }]}>
          <NavHeader title={t("offers.title")} onBack={() => navigation.goBack()} />
        </View>
        <EmptyView
          title={t("offers.not_found")}
          ctaIcon="arrow-left"
          ctaLabel={t("common.back")}
          onCtaPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  const handleCta = () => {
    navigation.navigate("offer-apply", { offerId: offer.id });
  };

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <View style={[s.header, { paddingTop: insets.top + 12 }]}>
        <NavHeader
          title={t(`offers.products.${offer.id}.title`)}
          onBack={() => navigation.goBack()}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
        refreshControl={refreshControl}
      >
        <ProductHero offer={offer} />
        <HowItWorks offer={offer} />

        <View style={s.feesWrap}>
          <Text style={[s.feesHeading, { color: colors.textSecondary }]}>
            {t("offers.fees_charges")}
          </Text>
          <View style={[s.feesCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[s.feesText, { color: colors.textSecondary }]}>{t(offer.feesKey)}</Text>
          </View>
        </View>
      </ScrollView>

      <StickyFooter>
        <PrimaryButton title={t("offers.cta.apply")} onPress={handleCta} />
      </StickyFooter>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 8 },
  scroll: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24, gap: 22 },
  feesWrap: { gap: 10 },
  feesHeading: { fontSize: 13, fontWeight: "600" },
  feesCard: { borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, padding: 16 },
  feesText: { fontSize: 13, lineHeight: 19 },
});
