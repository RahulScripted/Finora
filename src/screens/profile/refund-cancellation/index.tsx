import LegalContentScreen from "@components/legal-content";
import { useTranslation } from "react-i18next";
import { REFUND_LAST_UPDATED, REFUND_SECTION_KEYS } from "@data-types/legal/constants";
import { SUPPORT_CONTACTS } from "@shared/contact-details";

export default function RefundCancellationScreen() {
  const { t } = useTranslation();
  return (
    <LegalContentScreen
      title={t("refund.refund_title")}
      lastUpdated={REFUND_LAST_UPDATED}
      titleNamespace="refund"
      contentNamespace="refund_content"
      sectionKeys={REFUND_SECTION_KEYS}
      contactTitle={t("refund.contact")}
      contacts={SUPPORT_CONTACTS}
    />
  );
}
