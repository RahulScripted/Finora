import ScreenHeader from "@components/screen-header";
import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { Easing, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRefresh } from "@shared/refresh";
import { useScrollToTop } from "@shared/scroll-to-top";
import type { SupportTicket, TicketStatus } from "@data-types/support/constants";
import { TICKET_STATUS_CONFIG } from "@data-types/support/constants";
import EmptyState from "../components/empty-state";
import Timeline, { type StepState, type TimelineStep } from "../components/timeline";

/** Ordered lifecycle used to build the journey timeline. */
const LIFECYCLE: TicketStatus[] = ["open", "in_progress", "resolved", "closed"];

/** Builds timeline steps for a ticket: past = done, current = active, later = upcoming. */
function buildSteps(status: TicketStatus, t: (k: string) => string, createdLabel: string): TimelineStep[] {
  const current = LIFECYCLE.indexOf(status);
  return LIFECYCLE.map((st, i) => {
    let state: StepState;
    if (i < current) state = "done";
    else if (i === current) state = status === "closed" || status === "resolved" ? "done" : "active";
    else state = "upcoming";
    return {
      label: t(TICKET_STATUS_CONFIG[st].labelKey),
      time: i === 0 ? createdLabel : undefined,
      state,
    };
  });
}

export default function TicketDetailScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const route = useRoute<any>();
  const ticket: SupportTicket | undefined = route.params?.ticket;
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);

  // Bump on focus so the entrance + timeline animations replay each visit.
  const [animKey, setAnimKey] = useState(0);
  useFocusEffect(
    useCallback(() => {
      setAnimKey((k) => k + 1);
    }, []),
  );

  // Pull-to-refresh re-triggers the animations too.
  const { refreshControl } = useRefresh(() => setAnimKey((k) => k + 1));

  if (!ticket) {
    return (
      <View style={[s.root, { backgroundColor: colors.background, paddingTop: insets.top + 16 }]}>
        <View style={s.headerWrap}>
          <ScreenHeader title={t("support.detail_title")} />
        </View>
        <EmptyState icon="ticket-outline" title={t("support.not_found")} />
      </View>
    );
  }

  const cfg = TICKET_STATUS_CONFIG[ticket.status];
  const created = new Date(ticket.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <View style={[s.root, { backgroundColor: colors.background, paddingTop: insets.top + 16 }]}>
      <View style={s.headerWrap}>
        <ScreenHeader title={ticket.id} />
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 32 }]}
        refreshControl={refreshControl}
      >
        {/* Status hero */}
        <Animated.View
          key={`hero-${animKey}`}
          entering={FadeInDown.duration(340).easing(Easing.out(Easing.cubic))}
          style={[s.hero, { backgroundColor: cfg.color + "12" }]}
        >
          <View style={[s.heroBadge, { backgroundColor: cfg.color }]}>
            <MaterialCommunityIcons name="ticket-confirmation-outline" size={22} color="#fff" />
          </View>
          <Text style={[s.heroStatus, { color: cfg.color }]}>{t(cfg.labelKey)}</Text>
          <Text style={[s.heroSub, { color: colors.textSecondary }]}>
            {t("support.raised_on", { date: created })}
          </Text>
        </Animated.View>

        {/* Vertical animated progress timeline */}
        <Animated.View
          key={`tl-${animKey}`}
          entering={FadeInDown.delay(90).duration(340).easing(Easing.out(Easing.cubic))}
          style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Text style={[s.cardTitle, { color: colors.textPrimary }]}>{t("support.progress")}</Text>
          <Timeline
            steps={buildSteps(ticket.status, t, created)}
            doneColor={cfg.color}
            animKey={animKey}
          />
        </Animated.View>

        {/* Details */}
        <Animated.View
          key={`det-${animKey}`}
          entering={FadeInDown.delay(180).duration(340).easing(Easing.out(Easing.cubic))}
          style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <DetailRow label={t("support.ticket_no")} value={ticket.id} last={false} />
          <DetailRow label={t("support.category")} value={ticket.category} last={false} />
          <DetailRow label={t("support.subcategory")} value={ticket.subcategory} last />
        </Animated.View>

        {/* Description */}
        <Animated.View
          key={`desc-${animKey}`}
          entering={FadeInDown.delay(240).duration(340).easing(Easing.out(Easing.cubic))}
          style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Text style={[s.descLabel, { color: colors.textSecondary }]}>{t("support.description")}</Text>
          <Text style={[s.descText, { color: colors.textPrimary }]}>{ticket.description}</Text>
        </Animated.View>

        {/* Assistance */}
        <Animated.View
          key={`info-${animKey}`}
          entering={FadeInDown.delay(300).duration(340).easing(Easing.out(Easing.cubic))}
          style={[s.infoBox, { backgroundColor: colors.accent + "10", borderColor: colors.accent + "22" }]}
        >
          <MaterialCommunityIcons name="information-outline" size={16} color={colors.accent} />
          <Text style={[s.infoText, { color: colors.accent }]}>{t("support.assistance_message")}</Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function DetailRow({ label, value, last }: { label: string; value: string; last: boolean }) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        s.detailRow,
        !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.divider },
      ]}
    >
      <Text style={[s.detailLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[s.detailValue, { color: colors.textPrimary }]}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  headerWrap: { paddingHorizontal: 16 },
  scroll: { paddingHorizontal: 16, paddingTop: 4, gap: 14 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  hero: { alignItems: "center", borderRadius: 18, paddingVertical: 22, gap: 6 },
  heroBadge: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  heroStatus: { fontSize: 17, fontWeight: "800" },
  heroSub: { fontSize: 12 },
  card: { borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, padding: 16 },
  cardTitle: { fontSize: 13, fontWeight: "700", marginBottom: 14 },
  // timeline
  tlRow: { flexDirection: "row", gap: 12 },
  tlLeft: { alignItems: "center", width: 24 },
  tlDot: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  tlLine: { width: 2, flex: 1, minHeight: 22, marginVertical: 2, borderRadius: 1 },
  tlLabel: { fontSize: 14, paddingTop: 2, paddingBottom: 14 },
  // details
  detailRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, gap: 12 },
  detailLabel: { fontSize: 13 },
  detailValue: { fontSize: 14, fontWeight: "600", flexShrink: 1, textAlign: "right" },
  descLabel: { fontSize: 13, fontWeight: "600", marginBottom: 8 },
  descText: { fontSize: 14, lineHeight: 22 },
  infoBox: { flexDirection: "row", alignItems: "flex-start", gap: 10, padding: 14, borderRadius: 12, borderWidth: StyleSheet.hairlineWidth },
  infoText: { flex: 1, fontSize: 12, lineHeight: 18 },
});
