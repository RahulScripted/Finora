import BarChart from "@components/chart/bar-chart";
import { useTheme } from "@context/Theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import type { MonthPoint } from "@data-types/business-partners/constants";
import { formatINR, formatLakh } from "@utils/format-locals";
import { toBuckets } from "../../../utils";
import Card from "../../shared/card";

type Props = { series: MonthPoint[]; total: number };

export default function InterestCard({ series, total }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Card padded>
      <View style={s.header}>
        <Text style={[s.title, { color: colors.textPrimary }]}>
          {t("business_partners.interest_paid")}
        </Text>
        <Text style={[s.total, { color: colors.textSecondary }]}>
          {t("business_partners.total_value", { value: formatLakh(total) })}
        </Text>
      </View>

      <BarChart
        buckets={toBuckets(series)}
        formatValue={(n) => formatINR(n)}
        a11yLabel={(label, formatted) =>
          t("business_partners.interest_a11y", { label, amount: formatted })
        }
      />
    </Card>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  title: { fontSize: 15, fontWeight: "700" },
  total: { fontSize: 12, fontWeight: "500" },
});
