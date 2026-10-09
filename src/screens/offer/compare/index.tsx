import { useTheme } from "@context/Theme/ThemeContext";
import { PrimaryButton } from "@helpers/button";
import { useCompare } from "@hooks/useCompare";
import { useNavigation } from "@react-navigation/native";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useScrollToTop } from "@shared/scroll-to-top";

import CompareTable from "./components/compare-table";
import InterestChart from "./components/interest-chart";
import LoanInputs from "./components/loan-inputs";
import MoneySplit from "./components/money-split";
import OfferSelect from "./components/offer-select";
import SavingsNote from "./components/savings-note";

const SLOT_A = "#5B6CFF";
const SLOT_B = "#FF6B45";

/** Compare & Calculate — pick any two offers and weigh them side by side. */
export default function OfferCompareScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);

  const {
    options,
    selection,
    selectOffer,
    principal,
    setPrincipal,
    months,
    setMonths,
    results,
    winner,
    savings,
    emiGap,
  } = useCompare();

  const applyWith = (offerId: string) => navigation.navigate("offer-detail", { offerId });

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      {/* Header — title only. */}
      <View style={[s.header, { paddingTop: insets.top + 16 }]}>
        <Text style={[s.title, { color: colors.textPrimary }]}>{t("offers.compare.title")}</Text>
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 32 }]}
      >
        <Text style={[s.sectionLabel, { color: colors.textSecondary }]}>
          {t("offers.compare.choose_two")}
        </Text>
        <OfferSelect options={options} selection={selection} onSelect={selectOffer} />

        <LoanInputs
          principal={principal}
          onPrincipal={setPrincipal}
          months={months}
          onMonths={setMonths}
        />

        <CompareTable resultA={results.A} resultB={results.B} />

        <InterestChart
          seriesA={results.A.interestByQuarter}
          seriesB={results.B.interestByQuarter}
        />

        <MoneySplit resultA={results.A} resultB={results.B} />

        <SavingsNote winner={winner} savings={savings} emiGap={emiGap} months={months} />

        <View style={s.ctaRow}>
          <PrimaryButton
            title={t("offers.compare.apply_with", { slot: "A" })}
            variant="secondary"
            color={colors.card}
            textColor={colors.textPrimary}
            style={[s.cta, { borderColor: SLOT_A }]}
            onPress={() => applyWith(selection.A)}
          />
          <PrimaryButton
            title={t("offers.compare.apply_with", { slot: "B" })}
            color={SLOT_B}
            style={s.cta}
            onPress={() => applyWith(selection.B)}
          />
        </View>

        <Text style={[s.disclaimer, { color: colors.textMuted }]}>
          {t("offers.compare.disclaimer")}
        </Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 16 },
  title: { fontSize: 22, fontWeight: "700" },
  scroll: { paddingHorizontal: 16, gap: 16 },
  sectionLabel: { fontSize: 13, fontWeight: "600", marginTop: 4 },
  ctaRow: { flexDirection: "row", gap: 12 },
  cta: { flex: 1 },
  disclaimer: { fontSize: 11.5, textAlign: "center", lineHeight: 16 },
});
