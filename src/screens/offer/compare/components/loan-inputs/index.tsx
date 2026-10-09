import { useTheme } from "@context/Theme/ThemeContext";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";
import { formatCompactCurrency, formatInputNumber, parseLocalizedInput } from "@utils/format-locals";

type Props = {
  principal: number;
  onPrincipal: (v: number) => void;
  months: number;
  onMonths: (v: number) => void;
};

const MIN_MONTHS = 12;
const MAX_MONTHS = 60;

/** Shared loan params — amount (Indian-grouped) + tenure in months. */
export default function LoanInputs({ principal, onPrincipal, months, onMonths }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={s.row}>
        <View style={s.item}>
          <Text style={[s.label, { color: colors.textMuted }]}>{t("offers.compare.loan_amount")}</Text>
          <TextInput
            value={principal ? formatInputNumber(String(principal)) : ""}
            onChangeText={(txt) => onPrincipal(Number(parseLocalizedInput(txt)) || 0)}
            keyboardType="numeric"
            selectTextOnFocus
            placeholderTextColor={colors.placeholder}
            style={[s.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.textPrimary }]}
          />
        </View>
        <View style={s.item}>
          <Text style={[s.label, { color: colors.textMuted }]}>{t("offers.compare.tenure_months")}</Text>
          <TextInput
            value={months ? String(months) : ""}
            onChangeText={(txt) => onMonths(Number(parseLocalizedInput(txt)) || 0)}
            keyboardType="numeric"
            selectTextOnFocus
            placeholderTextColor={colors.placeholder}
            style={[s.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.textPrimary }]}
          />
        </View>
      </View>

      <Text style={[s.hint, { color: colors.textMuted }]}>
        {t("offers.compare.amount_hint", {
          amount: formatCompactCurrency(principal),
          min: MIN_MONTHS,
          max: MAX_MONTHS,
        })}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, padding: 16, gap: 10 },
  row: { flexDirection: "row", gap: 12 },
  item: { flex: 1, gap: 6 },
  label: { fontSize: 12, fontWeight: "600" },
  input: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: "700",
  },
  hint: { fontSize: 11.5, lineHeight: 16 },
});
