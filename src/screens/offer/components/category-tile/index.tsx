import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { Offer } from "@data-types/offers/constants";

type Props = {
  offer: Offer;
  onPress: () => void;
};

/** Compact icon tile used in the "Loan Categories" strip. */
export default function CategoryTile({ offer, onPress }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        s.tile,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={[s.iconWrap, { backgroundColor: offer.tint + "1F" }]}>
        <MaterialCommunityIcons name={offer.icon as any} size={26} color={offer.tint} />
      </View>
      <Text style={[s.label, { color: colors.textPrimary }]} numberOfLines={2}>
        {t(`offers.products.${offer.id}.title`)}
      </Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  tile: {
    width: 92,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    gap: 10,
  },
  iconWrap: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  label: { fontSize: 12, fontWeight: "600", textAlign: "center", lineHeight: 16 },
});
