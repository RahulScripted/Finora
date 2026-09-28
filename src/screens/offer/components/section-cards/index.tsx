import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { OfferSectionCard } from "@data-types/offers/constants";

type Props = {
  cards: OfferSectionCard[];
  onPress: (card: OfferSectionCard) => void;
};

/**
 * Flexible entry-card grid for the Offers tab. Renders whatever cards the
 * config provides, wrapping to new rows automatically. Uses an icon for now;
 * if a card supplies an `image`, that is shown instead.
 */
export default function OfferSectionCards({ cards, onPress }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={s.grid}>
      {cards.map((card) => (
        <Pressable
          key={card.key}
          onPress={() => onPress(card)}
          accessibilityRole="button"
          style={({ pressed }) => [
            s.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <View style={[s.iconWrap, { backgroundColor: card.tint + "1F" }]}>
            {card.image ? (
              <Image source={card.image} style={s.image} resizeMode="contain" />
            ) : (
              <MaterialCommunityIcons name={card.icon as any} size={24} color={card.tint} />
            )}
          </View>

          <Text style={[s.title, { color: colors.textPrimary }]} numberOfLines={1}>
            {t(`offers.section.${card.key}.title`)}
          </Text>
          <Text style={[s.sub, { color: colors.textSecondary }]} numberOfLines={2}>
            {t(`offers.section.${card.key}.subtitle`)}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 14 },
  card: {
    flexGrow: 1,
    flexBasis: "45%",
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    gap: 6,
    minHeight: 128,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  image: { width: 26, height: 26 },
  title: { fontSize: 15, fontWeight: "700" },
  sub: { fontSize: 12, lineHeight: 17 },
});
