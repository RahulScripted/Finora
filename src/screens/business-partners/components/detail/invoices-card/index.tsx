import { useTheme } from "@context/Theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import type { Invoice } from "@data-types/business-partners/constants";
import { formatINR, formatShortDate, localizeDigits } from "@utils/format-locals";
import Card from "../../shared/card";

type Props = { invoices: Invoice[] };

export default function InvoicesCard({ invoices }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Card>
      {invoices.map((inv, i) => (
        <View
          key={inv.invoiceNo}
          style={[
            s.row,
            i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.divider },
          ]}
        >
          <View style={[s.badge, { backgroundColor: colors.accent + "14" }]}>
            <Text style={[s.badgeText, { color: colors.accent }]}>
              {localizeDigits(String(i + 1))}
            </Text>
          </View>

          <View style={s.info}>
            <Text style={[s.no, { color: colors.textPrimary }]}>
              {inv.invoiceNo} · {t("business_partners.pct_funded", { pct: localizeDigits(String(inv.advancePct)) })}
            </Text>
            <Text style={[s.due, { color: colors.textMuted }]}>
              {t("business_partners.due_on", { date: formatShortDate(inv.dueDate) })}
            </Text>
          </View>

          <Text style={[s.amount, { color: colors.textPrimary }]}>{formatINR(inv.amount)}</Text>
        </View>
      ))}
    </Card>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14, paddingHorizontal: 16 },
  badge: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  badgeText: { fontSize: 13, fontWeight: "700" },
  info: { flex: 1 },
  no: { fontSize: 14, fontWeight: "600" },
  due: { fontSize: 12, marginTop: 2 },
  amount: { fontSize: 14, fontWeight: "700" },
});
