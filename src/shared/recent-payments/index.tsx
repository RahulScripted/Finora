import { useTheme } from "@context/Theme/ThemeContext";
import { StyleSheet, Text, View } from "react-native";
import type { SpendSummary } from "@data-types/track-spend/constants";
import { formatINR, formatShortDate, initialsOf } from "@utils/format-locals";
import Card from "@shared/card";

type Props = { data: SpendSummary };

/** List of the most recent outgoing payments. */
export default function RecentPayments({ data }: Props) {
  const { colors } = useTheme();

  return (
    <Card>
      {data.payments.map((p, i) => (
        <View
          key={p.id}
          style={[
            s.row,
            i < data.payments.length - 1 && {
              borderBottomColor: colors.divider,
              borderBottomWidth: StyleSheet.hairlineWidth,
            },
          ]}
        >
          <View style={[s.avatar, { backgroundColor: colors.surface }]}>
            <Text style={[s.avatarText, { color: colors.textPrimary }]}>{initialsOf(p.payee)}</Text>
          </View>
          <View style={s.flex}>
            <Text style={[s.value, { color: colors.textPrimary }]} numberOfLines={1}>
              {p.payee}
            </Text>
            <Text style={[s.label, { color: colors.textSecondary }]}>
              {formatShortDate(p.paidAt)} | {p.invoiceNo}
            </Text>
          </View>
          <Text style={[s.value, { color: colors.textPrimary }]}>{formatINR(p.amount)}</Text>
        </View>
      ))}
    </Card>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 },
  flex: { flex: 1, minWidth: 0 },
  label: { fontSize: 12 },
  value: { fontSize: 14, fontWeight: "600", lineHeight: 20, fontVariant: ["tabular-nums"] },
  avatar: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 12, fontWeight: "600" },
});
