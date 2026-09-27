import { useTheme } from "@context/Theme/ThemeContext";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import ProgressSteps, { type StepItem } from "../progress-steps";

type Props = {
  /** Label of the current step, e.g. "Choose amount". */
  stepLabel: string;
  /** 1-indexed current step. */
  currentStep: number;
  totalSteps: number;
  /** Short labels shown under each dot. */
  stepLabels: string[];
  /** Application reference badge shown while the flow is in progress. */
  applicationId?: string;
};

/**
 * Detailed step header: current step label, "Step X of Y", the animated
 * dotted stepper, and the application ID badge. Mirrors the Customer-App.
 */
export default function StepHeader({
  stepLabel,
  currentStep,
  totalSteps,
  stepLabels,
  applicationId,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const steps: StepItem[] = stepLabels.map((label) => ({ label }));

  return (
    <View style={s.container}>
      <View style={s.row}>
        <Text style={[s.label, { color: colors.textPrimary }]}>{stepLabel}</Text>
        <Text style={[s.stepText, { color: colors.textMuted }]}>
          {t("offers.apply.step_of", { current: currentStep, total: totalSteps })}
        </Text>
      </View>

      <ProgressSteps steps={steps} currentStep={currentStep - 1} />

      {applicationId ? (
        <View style={s.idRow}>
          <Text style={[s.idLabel, { color: colors.textSecondary }]}>
            {t("offers.apply.application_id")}
          </Text>
          <View style={[s.idBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[s.idValue, { color: colors.textPrimary }]}>{applicationId}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  container: { marginTop: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  label: { fontSize: 14, fontWeight: "700" },
  stepText: { fontSize: 12, fontVariant: ["tabular-nums"] },
  idRow: { flexDirection: "row", alignItems: "center", marginTop: 8, gap: 8 },
  idLabel: { fontSize: 12 },
  idBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: StyleSheet.hairlineWidth },
  idValue: { fontSize: 12, fontWeight: "700" },
});
