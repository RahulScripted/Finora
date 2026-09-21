import { useTheme } from "@context/Theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import type { SpendSummary } from "@data-types/track-spend/constants";
import { formatINR } from "@utils/format-locals";
import Card from "../shared/card";

type Props = { data: SpendSummary };

/** Breakdown of processing fees + interest and their share of spend. */
export default function CostOfFunds({ data }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { fees, interest } = data.costOfFunds;
  const totalCost = fees + interest;
  const pct = data.totalSpent > 0 ? Number(((totalCost / data.totalSpent) * 100).toFixed(1)) : 0;

  return (
    <Card>
      <View style={[s.row, { borderBottomColor: colors.divider, borderBottomWidth: StyleSheet.hairlineWidth }]}>
        <Text style={[s.label, { color: colors.textSecondary }]}>{t("track_spend.processing_fees")}</Text>
        <Text style={[s.value, { color: colors.textPrimary }]}>{formatINR(fees)}</Text>
      </View>
      <View style={[s.row, { borderBottomColor: colors.divider, borderBottomWidth: StyleSheet.hairlineWidth }]}>
        <Text style={[s.label, { color: colors.textSecondary }]}>{t("track_spend.interest")}</Text>
        <Text style={[s.value, { color: colors.textPrimary }]}>{formatINR(interest)}</Text>
      </View>
      <View style={s.row}>
        <View>
          <Text style={[s.value, { color: colors.textPrimary }]}>{t("track_spend.total_cost")}</Text>
          <Text style={[s.subLabel, { color: colors.textSecondary }]}>{t("track_spend.pct_of_spend", { pct })}</Text>
        </View>
        <Text style={[s.total, { color: colors.textPrimary }]}>{formatINR(totalCost)}</Text>
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14 },
  label: { fontSize: 14 },
  subLabel: { fontSize: 12 },
  value: { fontSize: 14, fontWeight: "600", lineHeight: 20, fontVariant: ["tabular-nums"] },
  total: { fontSize: 20, fontWeight: "700", letterSpacing: -0.2, fontVariant: ["tabular-nums"] },
});
