import LegalContentScreen from "@components/legal-content";
import { useTranslation } from "react-i18next";
import { TERMS_LAST_UPDATED, TERMS_SECTION_KEYS } from "@data-types/legal/constants";

export default function TermsConditionsScreen() {
  const { t } = useTranslation();
  return (
    <LegalContentScreen
      title={t("terms.terms_title")}
      badgeLabel={t("legal.data_protected")}
      lastUpdated={TERMS_LAST_UPDATED}
      titleNamespace="terms"
      contentNamespace="terms_content"
      sectionKeys={TERMS_SECTION_KEYS}
    />
  );
}
