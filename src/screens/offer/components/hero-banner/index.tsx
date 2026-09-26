import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

type Props = {
  onPress?: () => void;
};

/** Dark "Financing for every stage" promo banner at the top of the list. */
export default function HeroBanner({ onPress }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [s.card, { opacity: pressed ? 0.92 : 1 }]}
    >
      <View style={s.body}>
        <Text style={s.title}>{t("offers.hero_title")}</Text>
        <Text style={s.subtitle}>{t("offers.hero_subtitle")}</Text>
      </View>

      <View style={s.right}>
        <View style={s.illustration}>
          <MaterialCommunityIcons name="sprout-outline" size={30} color="#7CE0A8" />
        </View>
        <MaterialCommunityIcons name="chevron-right" size={22} color="rgba(255,255,255,0.75)" />
      </View>
    </Pressable>
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
  subtitle: { color: "rgba(255,255,255,0.72)", fontSize: 12.5, lineHeight: 18 },
  right: { flexDirection: "row", alignItems: "center", gap: 4 },
  illustration: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(124,224,168,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
});
