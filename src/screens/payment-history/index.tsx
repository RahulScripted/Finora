import ScreenHeader from "@components/screen-header";
import { useTheme } from "@context/Theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PaymentHistoryScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  return (
    <View style={[s.container, { backgroundColor: colors.background, paddingTop: insets.top + 16 }]}>
      <ScreenHeader title={t("track_spend.recent_payments")} />
    </View>
  );
}

const s = StyleSheet.create({ container: { flex: 1, paddingHorizontal: 16 } });
