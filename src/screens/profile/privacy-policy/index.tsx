import LegalContentScreen from "@components/legal-content";
import { useTranslation } from "react-i18next";
import {
  PRIVACY_COMPANY_NAME,
  PRIVACY_LAST_UPDATED,
  PRIVACY_PRIVACY_EMAIL,
  PRIVACY_SECTION_KEYS,
} from "@data-types/legal/constants";
import { CONTACT_SUPPORT_EMAIL, CONTACT_SUPPORT_PHONE } from "@shared/contact-details";

export default function PrivacyPolicyScreen() {
  const { t } = useTranslation();
  return (
    <LegalContentScreen
      title={t("legal.privacy_title")}
      badgeLabel={t("legal.data_protected")}
      lastUpdated={PRIVACY_LAST_UPDATED}
      titleNamespace="legal"
      contentNamespace="privacy_content"
      sectionKeys={PRIVACY_SECTION_KEYS}
      contactTitle={t("legal.contact_support")}
      contacts={[
        { icon: "email-outline", label: CONTACT_SUPPORT_EMAIL, href: `mailto:${CONTACT_SUPPORT_EMAIL}` },
        { icon: "shield-lock-outline", label: PRIVACY_PRIVACY_EMAIL, href: `mailto:${PRIVACY_PRIVACY_EMAIL}` },
        { icon: "phone-outline", label: CONTACT_SUPPORT_PHONE, href: `tel:${CONTACT_SUPPORT_PHONE}` },
      ]}
      footer={`© ${new Date().getFullYear()} ${PRIVACY_COMPANY_NAME}. All rights reserved.`}
    />
  );
}
