import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { Offer } from "@data-types/offers/constants";

type Props = {
  offer: Offer;
  onPress: () => void;
};

/** Wide, richer card used in the "Featured offers" strip. */
export default function FeaturedCard({ offer, onPress }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        s.card,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.9 : 1 },
      ]}
    >
      {offer.image ? (
        <View style={s.blendLayer} pointerEvents="none">
          <Image source={offer.image} style={s.blendImage} resizeMode="contain" />
          {/* Fade the illustration into the card background from the left. */}
          <LinearGradient
            colors={[colors.card, colors.card + "00"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </View>
      ) : null}

      <View style={s.head}>
        <View style={[s.iconWrap, { backgroundColor: offer.tint + "1F" }]}>
          <MaterialCommunityIcons name={offer.icon as any} size={20} color={offer.tint} />
        </View>
        <Text style={[s.name, { color: colors.textPrimary }]} numberOfLines={1}>
          {t(`offers.products.${offer.id}.title`)}
        </Text>
        <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />
      </View>

      <Text style={[s.tagline, { color: colors.textSecondary }]} numberOfLines={2}>
        {t(`offers.products.${offer.id}.tagline`)}
      </Text>

      <View style={s.chips}>
        {offer.highlights.map((h, i) => (
          <View key={i} style={[s.chip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[s.chipLabel, { color: colors.textMuted }]}>{t(h.labelKey)}</Text>
            <Text style={[s.chipValue, { color: colors.textPrimary }]}>{h.value}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    gap: 10,
    overflow: "hidden",
  },
  // Illustration pinned to the right edge, fading into the card.
  blendLayer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "48%",
  },
  blendImage: {
    position: "absolute",
    right: -10,
    top: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  head: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconWrap: { width: 36, height: 36, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  name: { flex: 1, fontSize: 15, fontWeight: "700" },
  tagline: { fontSize: 12.5, lineHeight: 18 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipLabel: { fontSize: 11.5 },
  chipValue: { fontSize: 11.5, fontWeight: "700" },
});
