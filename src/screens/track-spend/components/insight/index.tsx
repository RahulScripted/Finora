import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import type { SpendSummary } from "@data-types/track-spend/constants";
import { daysUntil } from "@utils/format-locals";

type Props = { data: SpendSummary };

/** Friendly nudge about the next upcoming repayment. */
export default function Insight({ data }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const next = data.repayments[0];
  if (!next) return null;

  const count = Math.max(0, daysUntil(next.dueDate));
  const message =
    count === 0
      ? t("track_spend.insight_due_today", { client: next.client, invoice: next.invoiceNo })
      : t("track_spend.insight_repayment", { client: next.client, invoice: next.invoiceNo, count });

  return (
    <View style={[s.insight, { backgroundColor: colors.accent + "14", borderColor: colors.accent + "38" }]}>
      <View style={[s.icon, { backgroundColor: colors.card }]}>
        <MaterialCommunityIcons name="creation" size={17} color={colors.accent} />
      </View>
      <View style={s.flex}>
        <Text style={[s.title, { color: colors.accent }]}>{t("track_spend.insight_title")}</Text>
        <Text style={[s.body, { color: colors.textPrimary }]}>{message}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  insight: { flexDirection: "row", gap: 10, padding: 14, borderRadius: 18, borderWidth: StyleSheet.hairlineWidth },
  icon: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  flex: { flex: 1, minWidth: 0 },
  title: { fontSize: 12, fontWeight: "600" },
  body: { fontSize: 13, lineHeight: 19, marginTop: 2 },
});
