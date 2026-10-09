import PiePanel from "@shared/pie-panel";
import { useTheme } from "@context/Theme/ThemeContext";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { CompareResult, CompareSlot } from "@data-types/offers/constants";
import type { PieSlice } from "@data-types/chart/constants";
import { formatCompactCurrency, formatINR } from "@utils/format-locals";

type Props = {
  resultA: CompareResult;
  resultB: CompareResult;
};

const SLOT_COLORS: Record<CompareSlot, string> = { A: "#5B6CFF", B: "#FF6B45" };
const PRINCIPAL_COLOR = "#5B6CFF";
const INTEREST_COLOR = "#9B6BFF";
const FEES_COLOR = "#F2B21C";
const PIE_SIZE = 104;

/** Where each offer's total payable goes — a donut per offer plus a shared legend. */
export default function MoneySplit({ resultA, resultB }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const pie = (slot: CompareSlot, r: CompareResult) => {
    const pieData: PieSlice[] = [
      { name: t("offers.compare.principal"), value: r.split.principal, color: PRINCIPAL_COLOR },
      { name: t("offers.compare.interest"), value: r.split.interest, color: INTEREST_COLOR },
      { name: t("offers.compare.fees_gst"), value: r.split.fees, color: FEES_COLOR },
    ];
    return (
      <View style={s.pieCol}>
        <PiePanel
          bare
          hideLegend
          size={PIE_SIZE}
          stroke={18}
          data={pieData}
          centerValue={
            <Text style={[s.centerValue, { color: colors.textPrimary }]}>
              {formatCompactCurrency(r.totalPayable)}
            </Text>
          }
          centerLabel={
            <Text style={[s.centerLabel, { color: SLOT_COLORS[slot] }]}>
              {t("offers.compare.offer_slot", { slot })}
            </Text>
          }
        />
      </View>
    );
  };

  const rows: { key: string; color: string; label: string; a: number; b: number }[] = [
    { key: "principal", color: PRINCIPAL_COLOR, label: t("offers.compare.principal"), a: resultA.split.principal, b: resultB.split.principal },
    { key: "interest", color: INTEREST_COLOR, label: t("offers.compare.interest"), a: resultA.split.interest, b: resultB.split.interest },
    { key: "fees", color: FEES_COLOR, label: t("offers.compare.fees_gst"), a: resultA.split.fees, b: resultB.split.fees },
  ];

  return (
    <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[s.title, { color: colors.textPrimary }]}>{t("offers.compare.money_goes")}</Text>

      <View style={s.pies}>
        {pie("A", resultA)}
        {pie("B", resultB)}
      </View>

      {/* Column headers for the legend values. */}
      <View style={s.legendHead}>
        <View style={s.legendLabelCol} />
        <Text style={[s.legendHeadText, { color: SLOT_COLORS.A }]}>A</Text>
        <Text style={[s.legendHeadText, { color: SLOT_COLORS.B }]}>B</Text>
      </View>

      <View style={s.legend}>
        {rows.map((row, i) => (
          <View
            key={row.key}
            style={[s.legendRow, i < rows.length - 1 && { borderBottomColor: colors.divider, borderBottomWidth: StyleSheet.hairlineWidth }]}
          >
            <View style={s.legendLabelCol}>
              <View style={[s.bar, { backgroundColor: row.color }]} />
              <Text style={[s.legendLabel, { color: colors.textSecondary }]} numberOfLines={1}>
                {row.label}
              </Text>
            </View>
            <Text style={[s.legendValue, { color: colors.textPrimary }]} numberOfLines={1}>
              {formatINR(row.a)}
            </Text>
            <Text style={[s.legendValue, { color: colors.textPrimary }]} numberOfLines={1}>
              {formatINR(row.b)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, padding: 16, gap: 14 },
  title: { fontSize: 14, fontWeight: "700" },
  pies: { flexDirection: "row", justifyContent: "space-evenly" },
  pieCol: { alignItems: "center" },
  centerValue: { fontSize: 13, fontWeight: "800" },
  centerLabel: { fontSize: 11, fontWeight: "700", marginTop: 1 },
  legendHead: { flexDirection: "row", alignItems: "center" },
  legendHeadText: { flex: 1, fontSize: 12, fontWeight: "800", textAlign: "right" },
  legend: { gap: 0 },
  legendRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  legendLabelCol: { flex: 1.4, flexDirection: "row", alignItems: "center", gap: 8 },
  bar: { width: 4, height: 16, borderRadius: 2 },
  legendLabel: { fontSize: 13, fontWeight: "500" },
  legendValue: { flex: 1, fontSize: 13.5, fontWeight: "700", textAlign: "right" },
});
