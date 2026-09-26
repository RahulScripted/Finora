import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { TenureOption } from "@data-types/offers/constants";
import { formatRupees } from "@data-types/offers/constants";

type Props = {
  amount: number;
  options: TenureOption[];
  selectedDays: number;
  onSelect: (days: number) => void;
};

/** Step 2 — choose a repayment tenure from a radio list. */
export default function TenureStep({ amount, options, selectedDays, onSelect }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const recommended = options.find((o) => o.recommended);

  return (
    <View style={s.wrap}>
      <Text style={[s.caption, { color: colors.textSecondary }]}>
        {t("offers.apply.amount_for", { amount: formatRupees(amount) })}
      </Text>

      <View style={s.list}>
        {options.map((opt) => {
          const active = opt.days === selectedDays;
          return (
            <Pressable
              key={opt.days}
              onPress={() => onSelect(opt.days)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              style={[
                s.option,
                {
                  backgroundColor: active ? colors.accent + "12" : colors.card,
                  borderColor: active ? colors.accent : colors.border,
                },
              ]}
            >
              <View style={s.optionBody}>
                <Text style={[s.days, { color: colors.textPrimary }]}>
                  {t("offers.apply.days", { count: opt.days })}
                </Text>
                <Text style={[s.rate, { color: colors.textSecondary }]}>
                  {t("offers.apply.rate_per_mo", { rate: opt.monthlyRate })}
                  {opt.noteKey ? ` · ${t(`offers.apply.note_${opt.noteKey}`)}` : ""}
                </Text>
              </View>
              <MaterialCommunityIcons
                name={active ? "radiobox-marked" : "radiobox-blank"}
                size={22}
                color={active ? colors.accent : colors.textMuted}
              />
            </Pressable>
          );
        })}
      </View>

      {recommended ? (
        <View style={[s.hint, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MaterialCommunityIcons name="lightbulb-on-outline" size={16} color={colors.warning} />
          <Text style={[s.hintText, { color: colors.textSecondary }]}>
            {t("offers.apply.tenure_hint", { days: recommended.days })}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { gap: 14, paddingTop: 8 },
  caption: { fontSize: 13 },
  list: { gap: 12 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  optionBody: { flex: 1, gap: 4 },
  days: { fontSize: 15, fontWeight: "700" },
  rate: { fontSize: 12, lineHeight: 17 },
  hint: {
    flexDirection: "row",
    gap: 10,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    alignItems: "flex-start",
  },
  hintText: { flex: 1, fontSize: 12, lineHeight: 18 },
});
