import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { CompareSlot } from "@data-types/offers/constants";
import { formatINR } from "@utils/format-locals";

type Props = {
  winner: CompareSlot;
  savings: number;
  emiGap: number;
  months: number;
};

/** Green highlight summarising how much the better offer saves. */
export default function SavingsNote({ winner, savings, emiGap, months }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[s.wrap, { backgroundColor: colors.successSoft, borderColor: colors.success + "55" }]}>
      <MaterialCommunityIcons name="shimmer" size={20} color={colors.success} />
      <View style={s.body}>
        <Text style={[s.line, { color: colors.text }]}>
          {t("offers.compare.saves_summary", {
            slot: winner,
            amount: formatINR(savings),
            months,
          })}
        </Text>
        <Text style={[s.line, { color: colors.text }]}>
          {t("offers.compare.lower_emi_summary", {
            slot: winner,
            amount: formatINR(emiGap),
          })}
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    gap: 12,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    alignItems: "flex-start",
  },
  body: { flex: 1, gap: 4 },
  line: { fontSize: 13, lineHeight: 19, fontWeight: "600" },
});
