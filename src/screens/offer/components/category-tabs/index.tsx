import { useTheme } from "@context/Theme/ThemeContext";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { useTranslation } from "react-i18next";
import type { OfferCategory } from "@data-types/offers/constants";

const CATEGORIES: OfferCategory[] = ["all", "invoice", "business_loan", "others"];

type Props = {
  active: OfferCategory;
  onChange: (c: OfferCategory) => void;
};

/** Horizontally scrollable pill filter for the offers list. */
export default function CategoryTabs({ active, onChange }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.row}
    >
      {CATEGORIES.map((cat) => {
        const isActive = cat === active;
        return (
          <Pressable
            key={cat}
            onPress={() => onChange(cat)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            style={[
              s.pill,
              {
                backgroundColor: isActive ? colors.textPrimary : colors.card,
                borderColor: isActive ? colors.textPrimary : colors.border,
              },
            ]}
          >
            <Text
              style={[
                s.label,
                { color: isActive ? colors.background : colors.textSecondary },
              ]}
            >
              {t(`offers.categories.${cat}`)}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  row: { gap: 10, paddingVertical: 4, paddingRight: 8 },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: { fontSize: 13, fontWeight: "600" },
});
