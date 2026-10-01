import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSpendSummary } from "@hooks/useSpendSummary";
import type { Payment } from "@data-types/track-spend/constants";
import { formatINR, formatShortDate, initialsOf } from "@utils/format-locals";
import Card from "@shared/card";
import { useScrollToTop } from "@shared/scroll-to-top";

/** Groups payments by their paid date so the list reads like a statement. */
function groupByDate(payments: Payment[]): { date: string; items: Payment[] }[] {
  const map = new Map<string, Payment[]>();
  for (const p of payments) {
    const key = p.paidAt.slice(0, 10);
    const bucket = map.get(key);
    if (bucket) bucket.push(p);
    else map.set(key, [p]);
  }
  return Array.from(map.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([date, items]) => ({ date, items }));
}

/** Full transaction history — the "See all" destination for recent payments. */
export default function PaymentHistoryScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { data, isRefetching, refetch } = useSpendSummary("year");
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);

  const payments = data.payments;
  const groups = useMemo(() => groupByDate(payments), [payments]);
  const total = useMemo(() => payments.reduce((sum, p) => sum + p.amount, 0), [payments]);

  return (
    <View style={[s.container, { backgroundColor: colors.background, paddingTop: insets.top + 16 }]}>
      <View style={s.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
          style={[s.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <MaterialCommunityIcons name="chevron-left" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={[s.title, { color: colors.textPrimary }]} numberOfLines={1}>
          {t("transaction_history.title")}
        </Text>
        <View style={s.backBtn} />
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 32 }]}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.accent} />
        }
      >
        {payments.length === 0 ? (
          <View style={s.empty}>
            <MaterialCommunityIcons name="history" size={40} color={colors.textMuted} />
            <Text style={[s.emptyTitle, { color: colors.textPrimary }]}>
              {t("transaction_history.empty_title")}
            </Text>
            <Text style={[s.emptyLabel, { color: colors.textSecondary }]}>
              {t("transaction_history.empty_label")}
            </Text>
          </View>
        ) : (
          <>
            <Card padded>
              <View style={s.summaryRow}>
                <View>
                  <Text style={[s.summaryLabel, { color: colors.textSecondary }]}>
                    {t("transaction_history.total_paid")}
                  </Text>
                  <Text style={[s.summaryValue, { color: colors.textPrimary }]}>
                    {formatINR(total)}
                  </Text>
                </View>
                <Text style={[s.summaryCount, { color: colors.textSecondary }]}>
                  {t("transaction_history.count", { count: payments.length })}
                </Text>
              </View>
            </Card>

            {groups.map((group) => (
              <View key={group.date} style={s.group}>
                <Text style={[s.groupDate, { color: colors.textSecondary }]}>
                  {formatShortDate(group.date)}
                </Text>
                <Card>
                  {group.items.map((p, i) => (
                    <View
                      key={p.id}
                      style={[
                        s.row,
                        i < group.items.length - 1 && {
                          borderBottomColor: colors.divider,
                          borderBottomWidth: StyleSheet.hairlineWidth,
                        },
                      ]}
                    >
                      <View style={[s.avatar, { backgroundColor: colors.surface }]}>
                        <Text style={[s.avatarText, { color: colors.textPrimary }]}>
                          {initialsOf(p.payee)}
                        </Text>
                      </View>
                      <View style={s.flex}>
                        <Text style={[s.payee, { color: colors.textPrimary }]} numberOfLines={1}>
                          {p.payee}
                        </Text>
                        <Text style={[s.meta, { color: colors.textSecondary }]}>
                          {formatShortDate(p.paidAt)} | {p.invoiceNo}
                        </Text>
                      </View>
                      <Text style={[s.amount, { color: colors.textPrimary }]}>
                        {formatINR(p.amount)}
                      </Text>
                    </View>
                  ))}
                </Card>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  title: { flex: 1, textAlign: "center", fontSize: 18, fontWeight: "700" },
  scroll: { paddingTop: 4, gap: 8 },
  summaryRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  summaryLabel: { fontSize: 12 },
  summaryValue: { fontSize: 22, fontWeight: "700", marginTop: 2, fontVariant: ["tabular-nums"] },
  summaryCount: { fontSize: 12, fontWeight: "600" },
  group: { marginTop: 16, gap: 8 },
  groupDate: { fontSize: 13, fontWeight: "600", marginHorizontal: 4 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 },
  flex: { flex: 1, minWidth: 0 },
  meta: { fontSize: 12, marginTop: 2 },
  payee: { fontSize: 14, fontWeight: "600", lineHeight: 20 },
  amount: { fontSize: 14, fontWeight: "600", lineHeight: 20, fontVariant: ["tabular-nums"] },
  avatar: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 12, fontWeight: "600" },
  empty: { alignItems: "center", justifyContent: "center", gap: 10, paddingTop: 80 },
  emptyTitle: { fontSize: 16, fontWeight: "700" },
  emptyLabel: { fontSize: 13, textAlign: "center", lineHeight: 19, paddingHorizontal: 32 },
});
