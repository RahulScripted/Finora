import { useTheme } from "@context/Theme/ThemeContext";
import { PrimaryButton } from "@helpers/button";
import { playSuccess } from "@helpers/sounds";
import { useOffers, makeApplicationId } from "@hooks/useOffers";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { ApplyStep, OfferId } from "@data-types/offers/constants";
import { computeCost } from "@data-types/offers/constants";
import AmountStep from "./components/amount-step";
import CostStep from "./components/cost-step";
import TenureStep from "./components/tenure-step";
import NavHeader from "../shared/nav-header";
import StepProgress from "../shared/step-progress";
import StickyFooter from "../shared/sticky-footer";
import ApplicationSubmitted from "../shared/application-submitted";

/** Formats "now" as "18 Sep 2026, 10:24 AM" for the success screen. */
function formatNow(): string {
  const d = new Date();
  const date = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  return `${date}, ${time}`;
}

/** Steps that show the progress bar (the success screen doesn't). */
const FLOW_STEPS: ApplyStep[] = ["amount", "tenure", "cost"];

export default function OfferApplyScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { getOffer, tenuresFor } = useOffers();

  const offerId: OfferId = route.params?.offerId ?? "invoice_discounting";
  const offer = getOffer(offerId)!;
  const tenures = useMemo(() => tenuresFor(offerId), [offerId, tenuresFor]);

  const [step, setStep] = useState<ApplyStep>("amount");
  const [amount, setAmount] = useState(Math.round((offer.minAmount + offer.maxAmount) / 6));
  const [tenureDays, setTenureDays] = useState(
    tenures.find((tn) => tn.recommended)?.days ?? tenures[0].days,
  );
  const [agreed, setAgreed] = useState(false);
  // Generated once the application is confirmed.
  const [submission, setSubmission] = useState<{ id: string; at: string } | null>(null);

  const selectedTenure = tenures.find((tn) => tn.days === tenureDays) ?? tenures[0];
  const cost = useMemo(
    () => computeCost(amount, selectedTenure.days, selectedTenure.monthlyRate),
    [amount, selectedTenure],
  );

  const stepIndex = FLOW_STEPS.indexOf(step);

  const goBack = () => {
    if (step === "amount") return navigation.goBack();
    if (step === "tenure") return setStep("amount");
    if (step === "cost") return setStep("tenure");
  };

  const handleNext = () => {
    if (step === "amount") return setStep("tenure");
    if (step === "tenure") return setStep("cost");
    if (step === "cost") {
      playSuccess();
      setSubmission({ id: makeApplicationId(offerId), at: formatNow() });
      return setStep("done");
    }
  };

  const titleKey =
    step === "amount"
      ? "offers.apply.amount_title"
      : step === "tenure"
        ? "offers.apply.tenure_title"
        : "offers.apply.cost_title";

  const ctaTitle =
    step === "amount"
      ? t("offers.apply.continue")
      : step === "tenure"
        ? t("offers.apply.see_full_cost")
        : t("offers.apply.confirm_apply");

  // ── Success screen ────────────────────────────────────────────────
  if (step === "done" && submission) {
    return (
      <View style={[s.root, { backgroundColor: colors.background, paddingTop: insets.top + 12 }]}>
        <ApplicationSubmitted
          amount={amount}
          applicationId={submission.id}
          appliedAt={submission.at}
          processingTime={t("offers.confirmation.processing_default")}
          onViewStatus={() => navigation.navigate("offer-tracker")}
          onBackHome={() => navigation.navigate("home")}
        />
      </View>
    );
  }

  // ── Flow steps ────────────────────────────────────────────────────
  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <View style={[s.header, { paddingTop: insets.top + 12 }]}>
        <NavHeader
          title={t(titleKey)}
          onBack={goBack}
          onClose={() => navigation.navigate("credit")}
        />
        <View style={s.progress}>
          <StepProgress total={FLOW_STEPS.length} current={stepIndex} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {step === "amount" ? (
          <AmountStep offer={offer} amount={amount} onChange={setAmount} />
        ) : null}
        {step === "tenure" ? (
          <TenureStep
            amount={amount}
            options={tenures}
            selectedDays={tenureDays}
            onSelect={setTenureDays}
          />
        ) : null}
        {step === "cost" ? (
          <CostStep cost={cost} agreed={agreed} onToggleAgree={() => setAgreed((a) => !a)} />
        ) : null}
      </ScrollView>

      <StickyFooter>
        <PrimaryButton
          title={ctaTitle}
          onPress={handleNext}
          disabled={step === "cost" && !agreed}
        />
      </StickyFooter>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 8, gap: 14 },
  progress: { paddingHorizontal: 4 },
  scroll: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 },
});
