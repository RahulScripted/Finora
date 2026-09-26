import { useTheme } from "@context/Theme/ThemeContext";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { Offer } from "@data-types/offers/constants";

type Props = { offer: Offer };

/** Numbered "how it works" steps inside a bordered card. */
export default function HowItWorks({ offer }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={s.wrap}>
      <Text style={[s.heading, { color: colors.textSecondary }]}>{t("offers.how_it_works")}</Text>

      <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {offer.steps.map((step, i) => (
          <View
            key={step.key}
            style={[
              s.stepRow,
              i > 0 && { borderTopColor: colors.divider, borderTopWidth: StyleSheet.hairlineWidth },
            ]}
          >
            <View style={[s.badge, { backgroundColor: offer.tint + "1F" }]}>
              <Text style={[s.badgeText, { color: offer.tint }]}>{i + 1}</Text>
            </View>
            <Text style={[s.stepText, { color: colors.textPrimary }]}>
              {t(`offers.products.${offer.id}.steps.${step.key}`)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { gap: 10 },
  heading: { fontSize: 13, fontWeight: "600" },
  card: { borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 16 },
  stepRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 16 },
  badge: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  badgeText: { fontSize: 12, fontWeight: "700" },
  stepText: { flex: 1, fontSize: 14, fontWeight: "500", lineHeight: 20 },
});
