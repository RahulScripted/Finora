import { useTranslation } from "react-i18next";
import EmptyScreen from "@shared/empty-screen";

export default function PaymentHistoryScreen() {
  const { t } = useTranslation();
  return (
    <EmptyScreen
      title={t("track_spend.recent_payments")}
      icon="history"
      label="Your full payment history will live here."
    />
  );
}
