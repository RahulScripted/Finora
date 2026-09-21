import { useTranslation } from "react-i18next";
import EmptyScreen from "@shared/empty-screen";

export default function OffersScreen() {
  const { t } = useTranslation();
  return (
    <EmptyScreen
      title={t("offers.title")}
      icon="tag-outline"
      label="Exclusive offers tailored for you."
    />
  );
}
