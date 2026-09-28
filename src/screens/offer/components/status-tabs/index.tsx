import { useTheme } from "@context/Theme/ThemeContext";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { useTranslation } from "react-i18next";
import type { ApplicationFilter } from "@hooks/useOffers";

const FILTERS: ApplicationFilter[] = ["all", "under_review", "approved", "rejected"];

type Props = {
  active: ApplicationFilter;
  onChange: (f: ApplicationFilter) => void;
};

/** Horizontally scrollable status filter for the applications list. */
export default function StatusTabs({ active, onChange }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.row}>
      {FILTERS.map((f) => {
        const isActive = f === active;
        return (
          <Pressable
            key={f}
            onPress={() => onChange(f)}
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
            <Text style={[s.label, { color: isActive ? colors.background : colors.textSecondary }]}>
              {t(`offers.applications.filter.${f}`)}
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
