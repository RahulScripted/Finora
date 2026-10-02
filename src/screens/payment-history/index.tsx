import ScreenHeader from "@components/screen-header";
import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTransactions } from "@hooks/useTransactions";
import {
  groupByDay,
  matchesFilter,
  matchesQuery,
  sortTransactions,
  type TxnFilter,
} from "@data-types/transaction-history/constants";
import { useRefresh } from "@shared/refresh";
import { useScrollToTop } from "@shared/scroll-to-top";
import DateGroupHeader from "@shared/date-group-header";
import StatementSheet from "@shared/statement-sheet";
import TransactionListItem from "@shared/transaction-list-item";
import { dayGroupLabel, kindColors, kindIcon, rowTimestamp } from "@utils/transaction";
import { formatINR } from "@utils/format-locals";
import FilterSheet from "./components/filter-sheet";
import SearchBar from "./components/search-bar";
import SummaryHeader from "./components/summary-header";

/** Fires loadMore when the user scrolls near the bottom. */
function nearBottom(e: NativeSyntheticEvent<NativeScrollEvent>): boolean {
  const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
  return contentOffset.y + layoutMeasurement.height >= contentSize.height - 320;
}

/** Full transaction history — the "See all" destination for recent payments. */
export default function PaymentHistoryScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { data, summary, refetch, loadMore, loadingMore, hasMore } = useTransactions();
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);
  const { refreshControl } = useRefresh(refetch);

  const [filter, setFilter] = useState<TxnFilter>("all");
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [soaOpen, setSoaOpen] = useState(false);

  const filtering = query.trim().length > 0 || filter !== "all";

  const groups = useMemo(() => {
    const filtered = data.filter((txn) => matchesFilter(txn, filter) && matchesQuery(txn, query));
    return groupByDay(sortTransactions(filtered, "recent"));
  }, [data, filter, query]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!filtering && hasMore && nearBottom(e)) loadMore();
  };

  const isEmpty = groups.length === 0;

  return (
    <View style={[s.container, { backgroundColor: colors.background, paddingTop: insets.top + 16 }]}>
      <ScreenHeader title={t("transaction_history.title")} />

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 24 }]}
        scrollEventThrottle={48}
        onScroll={onScroll}
        refreshControl={refreshControl}
      >
        <SummaryHeader summary={summary} />

        <View style={s.searchWrap}>
          <SearchBar
            value={query}
            onChange={setQuery}
            onFilterPress={() => setFilterOpen(true)}
            filterActive={filter !== "all"}
          />
        </View>

        <View style={s.listHead}>
          <Text style={[s.listHeadTitle, { color: colors.textPrimary }]}>
            {t("transaction_history.recent_transactions")}
          </Text>
          <Pressable
            onPress={() => setSoaOpen(true)}
            accessibilityRole="button"
            accessibilityLabel={t("track_spend.download_statement")}
            hitSlop={8}
            style={({ pressed }) => [
              s.soaBtn,
              { backgroundColor: colors.accent + "14", borderColor: colors.accent + "33" },
              pressed && s.pressed,
            ]}
          >
            <MaterialCommunityIcons name="tray-arrow-down" size={16} color={colors.accent} />
            <Text style={[s.soaText, { color: colors.accent }]}>{t("transaction_history.soa")}</Text>
          </Pressable>
        </View>

        {isEmpty ? (
          <View style={s.empty}>
            <MaterialCommunityIcons name="history" size={40} color={colors.textMuted} />
            <Text style={[s.emptyTitle, { color: colors.textPrimary }]}>
              {filtering ? t("transaction_history.no_results") : t("transaction_history.empty_title")}
            </Text>
            <Text style={[s.emptyLabel, { color: colors.textSecondary }]}>
              {filtering ? t("transaction_history.try_adjusting") : t("transaction_history.empty_label")}
            </Text>
          </View>
        ) : (
          groups.map((group) => (
            <View key={group.key}>
              <DateGroupHeader label={dayGroupLabel(group.key, t)} />
              {group.items.map((txn) => {
                const tone = kindColors(txn.kind, colors);
                const credit = txn.direction === "credit";
                return (
                  <TransactionListItem
                    key={txn.id}
                    title={txn.title}
                    subtitle={txn.partner}
                    amount={`${credit ? "+" : "-"} ${formatINR(txn.amount)}`}
                    amountColor={credit ? colors.success : colors.danger}
                    timestamp={rowTimestamp(txn.occurredAt)}
                    icon={kindIcon(txn.kind)}
                    iconColor={tone.fg}
                    iconBg={tone.bg}
                    onPress={() => navigation.navigate("transaction-detail", { id: txn.id })}
                  />
                );
              })}
            </View>
          ))
        )}

        {loadingMore && !filtering ? (
          <View style={s.footer}>
            <ActivityIndicator size="small" color={colors.accent} />
          </View>
        ) : null}
      </ScrollView>

      <FilterSheet
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        active={filter}
        onSelect={setFilter}
      />

      <StatementSheet visible={soaOpen} onClose={() => setSoaOpen(false)} onDownload={() => {}} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  scroll: { paddingTop: 4 },
  searchWrap: { marginTop: 12 },
  listHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 2,
  },
  listHeadTitle: { fontSize: 18, fontWeight: "700", flexShrink: 1 },
  soaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  soaText: { fontSize: 13, fontWeight: "700", letterSpacing: 0.3 },
  pressed: { opacity: 0.6 },
  footer: { paddingVertical: 20, alignItems: "center" },
  empty: { alignItems: "center", justifyContent: "center", gap: 10, paddingTop: 48 },
  emptyTitle: { fontSize: 16, fontWeight: "700" },
  emptyLabel: { fontSize: 13, textAlign: "center", lineHeight: 19, paddingHorizontal: 32 },
});
