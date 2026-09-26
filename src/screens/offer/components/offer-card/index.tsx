import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { Offer } from "@data-types/offers/constants";

type Props = {
  offer: Offer;
  onPress: () => void;
};

/** Grid card for a single loan product on the offers list. */
export default function OfferCard({ offer, onPress }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        s.card,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={[s.iconWrap, { backgroundColor: offer.tint + "1F" }]}>
        <MaterialCommunityIcons name={offer.icon as any} size={22} color={offer.tint} />
      </View>

      <Text style={[s.title, { color: colors.textPrimary }]} numberOfLines={2}>
        {t(`offers.products.${offer.id}.title`)}
      </Text>
      <Text style={[s.sub, { color: colors.textSecondary }]} numberOfLines={2}>
        {t(`offers.products.${offer.id}.card_sub`)}
      </Text>

      <View style={s.footer}>
        <Text style={[s.ceiling, { color: colors.textPrimary }]}>{offer.ceiling}</Text>
        <MaterialCommunityIcons name="chevron-right" size={18} color={colors.textMuted} />
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    gap: 8,
    minHeight: 168,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: { fontSize: 15, fontWeight: "700", lineHeight: 20 },
  sub: { fontSize: 12, lineHeight: 17, flex: 1 },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 },
  ceiling: { fontSize: 13, fontWeight: "600" },
});
