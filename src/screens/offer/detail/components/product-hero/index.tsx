import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { Offer } from "@data-types/offers/constants";

type Props = { offer: Offer };

/** Icon + tagline header and the two highlight stat chips. */
export default function ProductHero({ offer }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={s.wrap}>
      <View style={s.headerRow}>
        <View style={[s.iconWrap, { backgroundColor: offer.tint + "1F" }]}>
          <MaterialCommunityIcons name={offer.icon as any} size={26} color={offer.tint} />
        </View>
        <Text style={[s.tagline, { color: colors.textPrimary }]}>
          {t(`offers.products.${offer.id}.tagline`)}
        </Text>
      </View>

      <View style={s.chipRow}>
        {offer.highlights.map((h, i) => (
          <View
            key={i}
            style={[s.chip, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Text style={[s.chipLabel, { color: colors.textSecondary }]}>{t(h.labelKey)}</Text>
            <Text style={[s.chipValue, { color: colors.textPrimary }]}>{h.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { gap: 18 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconWrap: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  tagline: { flex: 1, fontSize: 18, fontWeight: "700", lineHeight: 24 },
  chipRow: { flexDirection: "row", gap: 12 },
  chip: {
    flex: 1,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 4,
  },
  chipLabel: { fontSize: 12 },
  chipValue: { fontSize: 18, fontWeight: "800" },
});
