import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

type Props = {
  onPress?: () => void;
};

/** "Not sure which is right for you?" prompt at the bottom of the list. */
export default function CompareBanner({ onPress }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[s.wrap, { backgroundColor: colors.accent + "14" }]}>
      <View style={s.illustration}>
        <Image
          source={require("@assets/illustration/offer/not-sure.png")}
          style={s.illustrationImage}
          resizeMode="contain"
        />
      </View>

      <View style={s.body}>
        <Text style={[s.title, { color: colors.textPrimary }]}>{t("offers.not_sure_title")}</Text>
        <Text style={[s.sub, { color: colors.textSecondary }]}>{t("offers.not_sure_subtitle")}</Text>

        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          style={({ pressed }) => [
            s.cta,
            { backgroundColor: colors.textPrimary, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={[s.ctaText, { color: colors.background }]}>
            {t("offers.compare_calculate")}
          </Text>
          <MaterialCommunityIcons name="chevron-right" size={17} color={colors.background} />
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flexDirection: "row", gap: 14, borderRadius: 18, padding: 16, alignItems: "center" },
  illustration: { width: 118, height: 138, alignItems: "center", justifyContent: "center" },
  illustrationImage: { width: "100%", height: "100%" },
  body: { flex: 1, gap: 4 },
  title: { fontSize: 14, fontWeight: "700" },
  sub: { fontSize: 12, lineHeight: 17 },
  cta: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 8,
  },
  ctaText: { fontSize: 13, fontWeight: "700" },
});
