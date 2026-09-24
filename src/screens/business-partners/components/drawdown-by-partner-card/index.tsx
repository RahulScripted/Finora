import ColumnChart from "@components/chart/column-chart";
import { useTheme } from "@context/Theme/ThemeContext";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import type { Partner } from "@data-types/business-partners/constants";
import type { ColumnDatum } from "@data-types/chart/constants";
import type { DateRange } from "@data-types/date-range/constants";
import { formatLakh, formatShortDate } from "@utils/format-locals";
import { filterByRange, sumSeries } from "../../utils";
import Card from "../shared/card";
import PeriodDropdown, { type DropdownOption } from "../shared/period-dropdown";

type Period = "month" | "q" | "half" | "custom";

/** Value per partner for the chosen period / custom range. */
function valueFor(partner: Partner, period: Period, range: DateRange | null): number {
  const series = partner.monthlyDrawdown;
  if (series.length === 0) return 0;
  if (period === "custom" && range) return sumSeries(filterByRange(series, range.start, range.end));
  if (period === "month") return series[series.length - 1].amount;
  const months = period === "q" ? 3 : 6;
  return sumSeries(series.slice(-months));
}

type Props = {
  partners: Partner[];
  /** Applied custom range (owned by the screen so the date picker renders at root). */
  range: DateRange | null;
  /** Ask the screen to open the shared date-range picker. */
  onRequestCustom: () => void;
};

/** Drawdown compared across partners, switchable by time window. */
export default function DrawdownByPartnerCard({ partners, range, onRequestCustom }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [period, setPeriod] = useState<Period>("month");

  const effectivePeriod: Period = range ? "custom" : period;

  const options: DropdownOption<Period>[] = [
    { key: "month", label: t("business_partners.period_month") },
    { key: "q", label: t("business_partners.period_3m") },
    { key: "half", label: t("business_partners.period_6m") },
    { key: "custom", label: t("business_partners.period_custom") },
  ];

  const data: ColumnDatum[] = useMemo(
    () =>
      partners.map((p) => ({
        key: p.id,
        label: p.name.split(" ")[0],
        value: valueFor(p, effectivePeriod, range),
        color: p.logoColor,
      })),
    [partners, effectivePeriod, range],
  );

  const customLabel =
    effectivePeriod === "custom" && range
      ? `${formatShortDate(range.start)} – ${formatShortDate(range.end)}`
      : undefined;

  const handleChange = (next: Period) => {
    if (next === "custom") {
      onRequestCustom();
      return;
    }
    setPeriod(next);
  };

  const chartKey = effectivePeriod === "custom" && range ? `${range.start}-${range.end}` : effectivePeriod;

  return (
    <Card padded>
      <View style={s.header}>
        <Text style={[s.title, { color: colors.textPrimary }]}>
          {t("business_partners.drawdown_by_partner")}
        </Text>
        <PeriodDropdown
          options={options}
          value={effectivePeriod}
          triggerLabel={customLabel}
          onChange={handleChange}
        />
      </View>

      {/* Re-mount the chart on window change so bars re-animate */}
      <ColumnChart key={chartKey} data={data} formatValue={(n) => formatLakh(n)} />
    </Card>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14, gap: 8 },
  title: { fontSize: 15, fontWeight: "700" },
});
