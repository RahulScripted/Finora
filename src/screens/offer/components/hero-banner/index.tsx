import { Image, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

/** Dark "Financing for every stage" promo banner at the top of the list. */
export default function HeroBanner() {
  const { t } = useTranslation();

  return (
    <View style={s.card}>
      <View style={s.body}>
        <Text style={s.title}>{t("offers.hero_title")}</Text>
        <Text style={s.subtitle}>{t("offers.hero_subtitle")}</Text>
      </View>

      <Image
        source={require("@assets/illustration/offer/banner.webp")}
        style={s.illustration}
        resizeMode="contain"
      />
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 20,
    padding: 18,
    backgroundColor: "#1B2430",
  },
  body: { flex: 1, gap: 6 },
  title: { color: "#FFFFFF", fontSize: 17, fontWeight: "800", lineHeight: 23 },
  subtitle: { color: "rgba(255,255,255,0.72)", fontSize: 12.5, lineHeight: 18, marginTop: 5 },
  illustration: { width: 140, height: 140 },
});
