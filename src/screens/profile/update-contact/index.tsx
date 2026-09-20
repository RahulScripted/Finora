import LegalContentScreen from "@components/legal-content";
import { useTranslation } from "react-i18next";
import { CONTACT_SECTION_KEYS } from "@data-types/legal/constants";
import { SUPPORT_CONTACTS } from "@shared/contact-details";

export default function UpdateContactScreen() {
  const { t } = useTranslation();
  return (
    <LegalContentScreen
      title={t("contactDetails.title")}
      titleNamespace="contactDetails"
      contentNamespace="contact_content"
      sectionKeys={CONTACT_SECTION_KEYS}
      contactTitle={t("contactDetails.reach_us")}
      contacts={SUPPORT_CONTACTS}
    />
  );
}
