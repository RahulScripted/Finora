import Logo from "@assets/svgs/Logo";
import { useTheme } from "@context/Theme/ThemeContext";
import Constants from "expo-constants";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

const APP_VERSION = Constants.expoConfig?.version ?? "1.0.0";

/** Footer with logo, version line, and copyright. */
export default function AboutFooter() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={s.footer}>
      <Logo size={22} />
      <Text style={[s.version, { color: colors.textSecondary }]}>
        {t("about_app.footer_version", { version: APP_VERSION })}
      </Text>
      <Text style={[s.copy, { color: colors.textMuted }]}>{t("about_app.copyright")}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  footer: { alignItems: "center", paddingTop: 32, paddingBottom: 8, gap: 6 },
  version: { fontSize: 12, fontWeight: "500" },
  copy: { fontSize: 11, textAlign: "center", paddingHorizontal: 24, lineHeight: 16 },
});
