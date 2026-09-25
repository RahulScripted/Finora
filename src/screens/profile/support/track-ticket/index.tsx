import { ScrollRevealProvider, useScrollRevealValues } from "@animations/scroll-reveal";
import ScreenHeader from "@components/screen-header";
import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSupport } from "@hooks/useSupport";
import { TICKET_STATUS_CONFIG, type TicketStatus } from "@data-types/support/constants";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import Animated, { Easing, FadeIn, FadeInDown, FadeOut, LinearTransition } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRefresh } from "@shared/refresh";
import { useScrollToTop } from "@shared/scroll-to-top";
import { useDebounce } from "@utils/debounce";
import { suggestTerms } from "@utils/recommend";
import EmptyView from "@shared/empty-view";
import TicketCard from "../components/ticket-card";
import FilterChips, { type FilterChip } from "../components/filter-chips";

type StatusFilter = "all" | TicketStatus;
const STATUS_ORDER: TicketStatus[] = ["open", "in_progress", "resolved", "closed"];
const PAGE_SIZE = 10;

function TrackTicketInner() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { data, isLoading, refetch } = useSupport();
  const { refreshControl } = useRefresh(refetch);
  const { scrollY, viewportH } = useScrollRevealValues();
  const navigation = useNavigation<any>();
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1); // infinite-scroll page counter
  const debouncedQuery = useDebounce(query, 300);

  // Reset search/filter/scroll each time the screen becomes visible, and
  // replay the list entrance animation.
  const [animKey, setAnimKey] = useState(0);
  useFocusEffect(
    useCallback(() => {
      setQuery("");
      setStatus("all");
      setPage(1);
      setAnimKey((k) => k + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, []),
  );

  const tickets = data.tickets;

  // Reset pagination whenever the query/filter changes.
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, status]);

  // Suggestion pool from ticket fields — used for "did you mean" chips.
  const suggestionPool = useMemo(() => {
    const set = new Set<string>();
    tickets.forEach((tk) => {
      set.add(tk.category);
      set.add(tk.subcategory);
    });
    return Array.from(set);
  }, [tickets]);

  // Status filter counts (over the full set, not the search-filtered set).
  const chips: FilterChip[] = useMemo(() => {
    const base: FilterChip[] = [
      { key: "all", label: t("support.filter_all"), count: tickets.length },
    ];
    STATUS_ORDER.forEach((st) => {
      base.push({
        key: st,
        label: t(TICKET_STATUS_CONFIG[st].labelKey),
        count: tickets.filter((tk) => tk.status === st).length,
      });
    });
    return base;
  }, [tickets, t]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return tickets.filter((tk) => {
      if (status !== "all" && tk.status !== status) return false;
      if (!q) return true;
      return (
        tk.id.toLowerCase().includes(q) ||
        tk.category.toLowerCase().includes(q) ||
        tk.subcategory.toLowerCase().includes(q) ||
        tk.description.toLowerCase().includes(q)
      );
    });
  }, [tickets, debouncedQuery, status]);

  // Infinite scroll: show only the first `page * PAGE_SIZE` matches.
  const visible = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page]);
  const hasMore = visible.length < filtered.length;

  const loadMore = useCallback(() => {
    if (hasMore) setPage((p) => p + 1);
  }, [hasMore]);

  const onScrollEndReached = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const distanceToEnd = contentSize.height - (contentOffset.y + layoutMeasurement.height);
    if (distanceToEnd < 220) loadMore();
  };

  // Suggestions shown when the search yields no results.
  const suggestions = useMemo(
    () => suggestTerms(suggestionPool, debouncedQuery, 5),
    [suggestionPool, debouncedQuery],
  );

  const noTickets = !isLoading && tickets.length === 0;
  const noResults = !isLoading && tickets.length > 0 && filtered.length === 0;
  const isFiltering = debouncedQuery.trim().length > 0 || status !== "all";

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <View style={[s.header, { paddingTop: insets.top + 16 }]}>
        <ScreenHeader title={t("support.track_title")} />
      </View>

      {!noTickets ? (
        <>
          {/* Search */}
          <Animated.View entering={FadeInDown.duration(300).easing(Easing.out(Easing.cubic))} style={s.searchWrap}>
            <View style={[s.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <MaterialCommunityIcons name="magnify" size={18} color={colors.textMuted} />
              <TextInput
                style={[s.searchInput, { color: colors.textPrimary }]}
                placeholder={t("support.search_placeholder")}
                placeholderTextColor={colors.textMuted}
                value={query}
                onChangeText={setQuery}
                returnKeyType="search"
              />
              {query !== debouncedQuery ? (
                <ActivityIndicator size="small" color={colors.accent} />
              ) : query.length > 0 ? (
                <Pressable onPress={() => setQuery("")} hitSlop={8} accessibilityRole="button">
                  <MaterialCommunityIcons name="close-circle" size={16} color={colors.textMuted} />
                </Pressable>
              ) : null}
            </View>
          </Animated.View>

          {/* Status filter chips */}
          <Animated.View entering={FadeInDown.delay(60).duration(300).easing(Easing.out(Easing.cubic))} style={s.filterWrap}>
            <FilterChips chips={chips} value={status} onChange={(k) => setStatus(k as StatusFilter)} />
          </Animated.View>
        </>
      ) : null}

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        refreshControl={refreshControl}
        onScroll={(e) => {
          scrollY.value = e.nativeEvent.contentOffset.y;
          viewportH.value = e.nativeEvent.layoutMeasurement.height;
          onScrollEndReached(e);
        }}
        onLayout={(e) => {
          viewportH.value = e.nativeEvent.layout.height;
        }}
      >
        {noTickets ? (
          <View style={s.emptyWrap}>
            <EmptyView title={t("support.no_tickets")} description={t("support.no_tickets_desc")} />
          </View>
        ) : noResults ? (
          <View>
            <View style={s.emptyWrap}>
              <EmptyView title={t("support.no_results")} description={t("support.try_different_search")} />
            </View>
            {suggestions.length > 0 ? (
              <Animated.View entering={FadeIn} style={s.suggestWrap}>
                <Text style={[s.suggestTitle, { color: colors.textSecondary }]}>
                  {t("support.suggestions")}
                </Text>
                <View style={s.suggestRow}>
                  {suggestions.map((term) => (
                    <Pressable
                      key={term}
                      onPress={() => setQuery(term)}
                      style={[s.suggestChip, { backgroundColor: colors.card, borderColor: colors.border }]}
                      accessibilityRole="button"
                    >
                      <Text style={[s.suggestChipText, { color: colors.accent }]}>{term}</Text>
                    </Pressable>
                  ))}
                </View>
              </Animated.View>
            ) : null}
          </View>
        ) : (
          <View key={animKey} style={s.list}>
            <Text style={[s.count, { color: colors.textSecondary }]}>
              {t("support.ticket_count", { count: filtered.length })}
            </Text>
            {visible.map((ticket, i) => (
              <Animated.View
                key={ticket.id}
                entering={FadeInDown.delay(isFiltering ? 0 : Math.min(i, 8) * 60).duration(320).easing(Easing.out(Easing.cubic))}
                exiting={FadeOut.duration(150)}
                layout={LinearTransition.duration(220)}
              >
                <TicketCard
                  ticket={ticket}
                  onPress={() => navigation.navigate("support-ticket-detail", { ticket })}
                />
              </Animated.View>
            ))}
            {hasMore ? (
              <View style={s.loadMore}>
                <ActivityIndicator size="small" color={colors.accent} />
                <Text style={[s.loadMoreText, { color: colors.textMuted }]}>
                  {t("support.loading_more")}
                </Text>
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

export default function TrackTicketScreen() {
  return (
    <ScrollRevealProvider>
      <TrackTicketInner />
    </ScrollRevealProvider>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 16 },
  searchWrap: { paddingHorizontal: 16, marginBottom: 12 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  searchInput: { flex: 1, fontSize: 15, padding: 0 },
  filterWrap: { paddingLeft: 16, marginBottom: 8 },
  scroll: { paddingHorizontal: 16, paddingTop: 8 },
  list: { gap: 16 },
  count: { fontSize: 12, marginBottom: 4 },
  loadMore: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 16 },
  loadMoreText: { fontSize: 12 },
  emptyWrap: { minHeight: 380 },
  suggestWrap: { marginTop: 4, paddingHorizontal: 8 },
  suggestTitle: { fontSize: 12, fontWeight: "600", textAlign: "center", marginBottom: 10 },
  suggestRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 },
  suggestChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: StyleSheet.hairlineWidth },
  suggestChipText: { fontSize: 13, fontWeight: "600" },
});
