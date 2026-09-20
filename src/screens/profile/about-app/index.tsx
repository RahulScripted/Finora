import ScreenHeader from "@components/screen-header";
import { useTheme } from "@context/Theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { Linking, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CONTACT_SUPPORT_EMAIL, CONTACT_SUPPORT_PHONE } from "@shared/contact-details";
import {
  COMPANY_FOUNDED,
  COMPANY_NAME,
  COMPANY_WEBSITE,
  COMPANY_WEBSITE_URL,
} from "@data-types/about/constants";
import {
  AboutFooter,
  AboutHero,
  ContactRow,
  GrievanceCard,
  InfoCard,
  KeyValueRow,
  LegalLinks,
  OfficeMap,
  SectionTitle,
  SocialLinks,
} from "./components";

const open = (url: string) => Linking.openURL(url).catch(() => undefined);

export default function AboutAppScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[s.container, { backgroundColor: colors.background, paddingTop: insets.top + 16 }]}>
      <ScreenHeader title={t("about_app.title")} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 32 }]}
      >
        <AboutHero />

        {/* Customer care */}
        <SectionTitle>{t("about_app.customer_care")}</SectionTitle>
        <InfoCard>
          <ContactRow
            icon="phone-outline"
            label={t("about_app.call_us")}
            value={CONTACT_SUPPORT_PHONE}
            onPress={() => open(`tel:${CONTACT_SUPPORT_PHONE}`)}
          />
          <ContactRow
            icon="email-outline"
            label={t("about_app.email_us")}
            value={CONTACT_SUPPORT_EMAIL}
            onPress={() => open(`mailto:${CONTACT_SUPPORT_EMAIL}`)}
            last
          />
        </InfoCard>

        {/* Grievance officer */}
        <SectionTitle>{t("about_app.grievance_officer")}</SectionTitle>
        <GrievanceCard />

        {/* Company */}
        <SectionTitle>{t("about_app.about_company")}</SectionTitle>
        <InfoCard>
          <KeyValueRow label={t("about_app.company")} value={COMPANY_NAME} />
          <KeyValueRow label={t("about_app.founded")} value={COMPANY_FOUNDED} />
          <KeyValueRow
            label={t("about_app.website")}
            value={COMPANY_WEBSITE}
            onPress={() => open(COMPANY_WEBSITE_URL)}
            last
          />
        </InfoCard>

        {/* Office */}
        <SectionTitle>{t("about_app.office_address")}</SectionTitle>
        <OfficeMap />

        {/* Legal */}
        <SectionTitle>{t("about_app.legal")}</SectionTitle>
        <LegalLinks />

        {/* Social */}
        <SectionTitle>{t("about_app.connect_with_us")}</SectionTitle>
        <SocialLinks />

        {/* Footer */}
        <AboutFooter />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  scroll: { paddingTop: 4 },
});
