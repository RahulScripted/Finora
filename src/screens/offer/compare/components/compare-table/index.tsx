import { useTheme } from "@context/Theme/ThemeContext";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { CompareResult, CompareSlot } from "@data-types/offers/constants";
import { formatCompactCurrency, formatINR } from "@utils/format-locals";

type Props = {
  resultA: CompareResult;
  resultB: CompareResult;
};

const SLOT_COLORS: Record<CompareSlot, string> = { A: "#5B6CFF", B: "#FF6B45" };

type Row = {
  label: string;
  a: number;
  b: number;
  format: (v: number) => string;
  /** "lower" → smaller value wins; set null to skip the win marker. */
  better: "lower" | null;
  strong?: boolean;
};

/** Side-by-side metric table. The better value in each row gets a check. */
export default function CompareTable({ resultA, resultB }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const pct = (v: number) => `${v}% p.a.`;

  const rows: Row[] = [
    { label: t("offers.compare.monthly_emi"), a: resultA.emi, b: resultB.emi, format: formatINR, better: "lower" },
    { label: t("offers.compare.interest_rate"), a: resultA.annualRate, b: resultB.annualRate, format: pct, better: "lower" },
    { label: t("offers.compare.fee_gst"), a: resultA.feePlusGst, b: resultB.feePlusGst, format: formatINR, better: "lower" },
    { label: t("offers.compare.total_interest"), a: resultA.totalInterest, b: resultB.totalInterest, format: formatINR, better: "lower" },
    { label: t("offers.compare.total_payable"), a: resultA.totalPayable, b: resultB.totalPayable, format: formatCompactCurrency, better: "lower", strong: true },
  ];

  const winnerOf = (row: Row): CompareSlot | null => {
    if (row.better == null || row.a === row.b) return null;
    return row.a < row.b ? "A" : "B";
  };

  const cell = (row: Row, slot: CompareSlot, value: number) => {
    const win = winnerOf(row) === slot;
    const color = win ? colors.success : colors.textPrimary;
    return (
      <View style={s.cell}>
        <Text style={[s.value, row.strong && s.valueStrong, { color }]} numberOfLines={1}>
          {row.format(value)}
        </Text>
      </View>
    );
  };

  return (
    <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={s.headerRow}>
        <Text style={[s.headLabel, { color: colors.textSecondary }]}>{t("offers.compare.compare")}</Text>
        <View style={s.cell}>
          <Text style={[s.headSlot, { color: SLOT_COLORS.A }]}>A</Text>
        </View>
        <View style={s.cell}>
          <Text style={[s.headSlot, { color: SLOT_COLORS.B }]}>B</Text>
        </View>
      </View>

      {rows.map((row, i) => (
        <View key={row.label} style={[s.row, i < rows.length - 1 && { borderBottomColor: colors.divider, borderBottomWidth: StyleSheet.hairlineWidth }]}>
          <Text style={[s.rowLabel, { color: colors.textSecondary }]}>{row.label}</Text>
          {cell(row, "A", row.a)}
          {cell(row, "B", row.b)}
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 16, paddingVertical: 6 },
  headerRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  headLabel: { flex: 1.3, fontSize: 13, fontWeight: "700" },
  headSlot: { fontSize: 15, fontWeight: "800" },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
  rowLabel: { flex: 1.3, fontSize: 13, lineHeight: 18 },
  cell: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 4 },
  value: { fontSize: 13.5, fontWeight: "600" },
  valueStrong: { fontWeight: "800" },
});
