import ScrollReveal, { ScrollRevealProvider, useScrollRevealValues } from "@animations/scroll-reveal";
import ScreenHeader from "@components/screen-header";
import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCreditSummary } from "@hooks/useCreditSummary";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useScrollToTop } from "@shared/scroll-to-top";
import FactorsCard from "./components/factors-card";
import HistoryCard from "./components/history-card";
import ScoreCard from "./components/score-card";
import SectionHeader from "./components/shared/section-header";
import BoxLoader from "./components/shared/box-loader";
import TipsCard from "./components/tips-card";
import UtilizationCard from "./components/utilization-card";

/* ------------------------------------------------------------------ */
/* Account input card — shown always at the top                       */
/* ------------------------------------------------------------------ */

/** Formats raw digits as XXXX-XXXX-XXXX-XXXX */
function formatAccountNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.match(/.{1,4}/g)?.join("-") ?? digits;
}

/** Strips formatting dashes to get raw digits */
function stripFormatting(formatted: string): string {
  return formatted.replace(/-/g, "");
}

function AccountInput({
  onSubmit,
  onClear,
  onChange,
  fetching,
  account,
}: {
  onSubmit: (account: string) => void;
  onClear: () => void;
  onChange?: (raw: string) => void;
  fetching: boolean;
  account: string;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const handleChange = (text: string) => {
    const formatted = formatAccountNumber(text);
    setAccount_local(formatted);
    onChange?.(stripFormatting(formatted));
  };

  // local display state mirrors the formatted string
  const [account_local, setAccount_local] = useState(account ? formatAccountNumber(account) : "");

  const handleClear = () => {
    setAccount_local("");
    onClear();
  };

  const handleSubmit = () => {
    const raw = stripFormatting(account_local);
    if (raw.length !== 16 || fetching) return;
    onSubmit(raw);
  };

  const digits = stripFormatting(account_local);
  const isComplete = digits.length === 16;

  return (
    <View style={[ai.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Icon + headline */}
      <View style={ai.headerRow}>
        <View style={[ai.iconWrap, { backgroundColor: colors.accent + "18" }]}>
          <MaterialCommunityIcons name="shield-search" size={22} color={colors.accent} />
        </View>
        <View style={ai.flex}>
          <Text style={[ai.title, { color: colors.textPrimary }]}>
            {t("credit_score.input_title")}
          </Text>
          <Text style={[ai.sub, { color: colors.textSecondary }]}>
            {t("credit_score.input_subtitle")}
          </Text>
        </View>
      </View>

      {/* Input row */}
      <View style={[ai.inputRow, { backgroundColor: colors.surface, borderColor: isComplete ? colors.accent + "60" : colors.border }]}>
        <MaterialCommunityIcons name="bank-outline" size={18} color={colors.textMuted} />
        <TextInput
          style={[ai.input, { color: colors.textPrimary }]}
          placeholder={t("credit_score.check_placeholder")}
          placeholderTextColor={colors.textMuted}
          value={account_local}
          onChangeText={handleChange}
          keyboardType="number-pad"
          maxLength={19}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          editable={!fetching}
        />
        {/* Digit counter */}
        {digits.length > 0 && digits.length < 16 ? (
          <Text style={[ai.counter, { color: colors.textMuted }]}>{digits.length}/16</Text>
        ) : null}
        {digits.length > 0 && !fetching ? (
          <Pressable onPress={handleClear} hitSlop={8}>
            <MaterialCommunityIcons name="close-circle" size={16} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      {/* CTA — only enabled at exactly 16 digits */}
      <Pressable
        onPress={handleSubmit}
        disabled={!isComplete || fetching}
        accessibilityRole="button"
        style={({ pressed }) => [
          ai.cta,
          {
            backgroundColor: colors.accent,
            opacity: pressed || !isComplete || fetching ? 0.65 : 1,
          },
        ]}
      >
        <MaterialCommunityIcons name="shield-search" size={17} color="#fff" />
        <Text style={ai.ctaText}>{t("credit_score.check_cta")}</Text>
      </Pressable>

      <Text style={[ai.consent, { color: colors.textMuted }]}>
        {t("credit_score.check_consent", { bureau: "CIBIL" })}
      </Text>
    </View>
  );
}

const ai = StyleSheet.create({
  card: { borderRadius: 20, borderWidth: StyleSheet.hairlineWidth, padding: 18, gap: 14 },
  headerRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  flex: { flex: 1 },
  iconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 16, fontWeight: "700", lineHeight: 22 },
  sub: { fontSize: 13, lineHeight: 18, marginTop: 2 },
  inputRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14, paddingVertical: 13, borderRadius: 14, borderWidth: StyleSheet.hairlineWidth },
  input: { flex: 1, fontSize: 15, padding: 0 },
  counter: { fontSize: 11, fontVariant: ["tabular-nums"] },
  cta: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 14 },
  ctaText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  consent: { fontSize: 11, textAlign: "center", lineHeight: 16 },
});

/* ------------------------------------------------------------------ */
/* Results — slides in after account is submitted                     */
/* ------------------------------------------------------------------ */
function ResultsSection({ data, isRefetching, refetch }: {
  data: ReturnType<typeof useCreditSummary>["data"];
  isRefetching: boolean;
  refetch: () => void;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  // Animate the whole block in
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(32);
  opacity.value = withTiming(1, { duration: 500 });
  translateY.value = withSpring(0, { damping: 18, stiffness: 100 });
  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <ScrollReveal delay={0} style={{ marginTop: 16 }}>
        <ScoreCard data={data} />
      </ScrollReveal>

      <ScrollReveal delay={60}>
        <SectionHeader title={t("credit_score.section_history")} />
        <HistoryCard data={data} />
      </ScrollReveal>

      <ScrollReveal delay={0}>
        <SectionHeader title={t("credit_score.section_factors")} />
        <FactorsCard data={data} />
      </ScrollReveal>

      <ScrollReveal delay={0}>
        <SectionHeader title={t("credit_score.section_utilization")} />
        <UtilizationCard data={data} />
      </ScrollReveal>

      <ScrollReveal delay={0}>
        <SectionHeader title={t("credit_score.section_tips")} />
        <TipsCard data={data} />
      </ScrollReveal>

      <ScrollReveal delay={0}>
        <Text style={[rs.disclaimer, { color: colors.textMuted }]}>
          {t("credit_score.disclaimer", { bureau: data.bureau })}
        </Text>
      </ScrollReveal>
    </Animated.View>
  );
}

const rs = StyleSheet.create({
  disclaimer: { fontSize: 11, lineHeight: 16, textAlign: "center", marginTop: 24, paddingHorizontal: 24 },
});

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */
function CreditScoreInner() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { data, isLoading, isRefetching, refetch, fetchForAccount } = useCreditSummary();
  const { scrollY, viewportH } = useScrollRevealValues();
  const [hasResult, setHasResult] = useState(false);
  const [account, setAccount] = useState("");
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);

  const handleSubmit = (acc: string) => {
    fetchForAccount(acc);
    // Wait for the 2.5s loader then reveal results and scroll
    setTimeout(() => {
      setHasResult(true);
      setTimeout(() => scrollRef.current?.scrollTo({ y: 220, animated: true }), 80);
    }, 2600);
  };

  const handleClear = () => {
    setHasResult(false);
    setAccount("");
  };

  const handleRefetch = () => {
    refetch();
  };

  return (
    <KeyboardAvoidingView
      style={[s.root, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[s.header, { paddingTop: insets.top + 16 }]}>
        <ScreenHeader title={t("credit_score.title")} />
      </View>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        refreshControl={
          hasResult ? (
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefetch}
              tintColor={colors.accent}
            />
          ) : undefined
        }
        onScroll={(e) => {
          scrollY.value = e.nativeEvent.contentOffset.y;
          viewportH.value = e.nativeEvent.layoutMeasurement.height;
        }}
        onLayout={(e) => {
          viewportH.value = e.nativeEvent.layout.height;
        }}
      >
        <AccountInput
          onSubmit={handleSubmit}
          onClear={handleClear}
          onChange={setAccount}
          fetching={isRefetching}
          account={account}
        />

        {/* Full-area loader while fetching (first time or re-check) */}
        {isRefetching ? (
          <View style={s.loaderWrap}>
            <BoxLoader />
          </View>
        ) : null}

        {hasResult && !isRefetching ? (
          <ResultsSection data={data} isRefetching={isRefetching} refetch={handleRefetch} />
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function CreditScoreScreen() {
  return (
    <ScrollRevealProvider>
      <CreditScoreInner />
    </ScrollRevealProvider>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 16 },
  scroll: { paddingTop: 8, paddingHorizontal: 16 },
  loaderWrap: { alignItems: "center", justifyContent: "center", paddingTop: 120, paddingBottom: 40 },
});
