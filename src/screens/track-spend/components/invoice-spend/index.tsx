import { useTheme } from "@context/Theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import type { SpendSummary } from "@data-types/track-spend/constants";
import { formatINR, initialsOf } from "@utils/format-locals";
import Card from "../shared/card";

type Props = { data: SpendSummary };

/** Per-invoice funded-vs-spent breakdown with a usage progress bar. */
export default function InvoiceSpend({ data }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Card>
      {data.invoices.map((inv, i) => {
        const ratio = inv.funded > 0 ? Math.min(1, inv.spent / inv.funded) : 0;
        return (
          <View
            key={inv.invoiceNo}
            style={[
              s.row,
              i < data.invoices.length - 1 && {
                borderBottomColor: colors.divider,
                borderBottomWidth: StyleSheet.hairlineWidth,
              },
            ]}
            accessible
            accessibilityLabel={`${inv.client}, ${inv.invoiceNo}, ${formatINR(inv.spent)} ${t("track_spend.of_amount", {
              amount: formatINR(inv.funded),
            })}`}
          >
            <View style={s.inner}>
              <View style={[s.avatar, { backgroundColor: colors.surface }]}>
                <Text style={[s.avatarText, { color: colors.textPrimary }]}>{initialsOf(inv.client)}</Text>
              </View>
              <View style={s.flex}>
                <Text style={[s.value, { color: colors.textPrimary }]} numberOfLines={1}>
                  {inv.client}
                </Text>
                <Text style={[s.label, { color: colors.textSecondary }]} numberOfLines={1}>
                  {inv.invoiceNo} · {t("track_spend.pct_funded", { pct: inv.advancePct })}
                </Text>
              </View>
              <View style={s.alignEnd}>
                <Text style={[s.value, { color: colors.textPrimary }]}>{formatINR(inv.spent)}</Text>
                <Text style={[s.label, { color: colors.textSecondary }]}>
                  {t("track_spend.of_amount", { amount: formatINR(inv.funded) })}
                </Text>
              </View>
            </View>
            <View style={[s.track, { backgroundColor: colors.surface }]}>
              <View style={[s.fill, { backgroundColor: colors.accent, width: `${ratio * 100}%` }]} />
            </View>
          </View>
        );
      })}
    </Card>
  );
}

const s = StyleSheet.create({
  row: { paddingVertical: 14 },
  inner: { flexDirection: "row", alignItems: "center", gap: 12 },
  flex: { flex: 1, minWidth: 0 },
  alignEnd: { alignItems: "flex-end" },
  label: { fontSize: 12 },
  value: { fontSize: 14, fontWeight: "600", lineHeight: 20, fontVariant: ["tabular-nums"] },
  track: { height: 6, borderRadius: 3, overflow: "hidden", marginTop: 10 },
  fill: { height: "100%", borderRadius: 3 },
  avatar: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 12, fontWeight: "600" },
});
