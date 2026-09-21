import { useTheme } from "@context/Theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import type { SpendSummary } from "@data-types/track-spend/constants";
import { daysUntil, formatINR, formatShortDate } from "@utils/format-locals";
import Card from "../shared/card";

type Props = { data: SpendSummary };

/** Vertical timeline of repayments due within the next 30 days. */
export default function Repayments({ data }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const items = data.repayments.filter((r) => daysUntil(r.dueDate) <= 30);
  if (items.length === 0) return null;

  return (
    <Card>
      <View style={s.timeline}>
        {items.map((r, i) => {
          const days = daysUntil(r.dueDate);
          const soon = days <= 7;
          const first = i === 0;
          const chipText =
            days <= 0
              ? t("track_spend.due_today")
              : soon
                ? t("track_spend.due_soon", { count: days })
                : t("track_spend.due_later", { count: days });

          return (
            <View key={r.invoiceNo} style={s.tlRow}>
              <View style={s.rail}>
                <View
                  style={[
                    s.dot,
                    first
                      ? { backgroundColor: colors.accent, borderColor: colors.accent + "33" }
                      : { backgroundColor: colors.textMuted, borderColor: colors.surface },
                  ]}
                />
                {i < items.length - 1 ? <View style={[s.line, { backgroundColor: colors.divider }]} /> : null}
              </View>
              <View
                style={[s.body, i < items.length - 1 && { paddingBottom: 18 }]}
                accessible
                accessibilityLabel={`${formatShortDate(r.dueDate)}, ${r.client}, ${r.invoiceNo}, ${formatINR(r.amount)}, ${chipText}`}
              >
                <View style={s.top}>
                  <Text style={[s.label, { color: colors.textSecondary }]}>{formatShortDate(r.dueDate)}</Text>
                  <View style={[s.chip, { backgroundColor: soon ? colors.accent + "1F" : colors.surface }]}>
                    <Text style={[s.chipText, { color: soon ? colors.accent : colors.textSecondary }]}>{chipText}</Text>
                  </View>
                </View>
                <Text style={[s.value, { color: colors.textPrimary }]} numberOfLines={1}>
                  {r.client} · {r.invoiceNo}
                </Text>
                <Text style={[s.value, { color: colors.textPrimary }]}>{formatINR(r.amount)}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  timeline: { paddingTop: 14, paddingBottom: 2 },
  tlRow: { flexDirection: "row", gap: 12 },
  rail: { width: 14, alignItems: "center" },
  dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 3, marginTop: 2 },
  line: { flex: 1, width: 1, marginTop: 4 },
  body: { flex: 1, gap: 1 },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 2 },
  label: { fontSize: 12 },
  value: { fontSize: 14, fontWeight: "600", lineHeight: 20, fontVariant: ["tabular-nums"] },
  chip: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 10 },
  chipText: { fontSize: 11, fontWeight: "600" },
});
