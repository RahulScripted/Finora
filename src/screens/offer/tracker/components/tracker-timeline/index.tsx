import { useTheme } from "@context/Theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { TrackerStep } from "@data-types/offers/constants";

type Props = { steps: TrackerStep[] };

/** Vertical milestone timeline with done / current / pending states. */
export default function TrackerTimeline({ steps }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const done = step.state === "done";
        const current = step.state === "current";

        const dotColor = done ? colors.success : current ? colors.info : colors.border;
        const connectorColor = done ? colors.success : colors.border;

        return (
          <View key={step.key} style={s.row}>
            {/* Rail: dot + connector */}
            <View style={s.rail}>
              <View
                style={[
                  s.dot,
                  {
                    backgroundColor: done ? colors.success : current ? colors.info + "22" : colors.surface,
                    borderColor: dotColor,
                  },
                ]}
              >
                {done ? (
                  <MaterialCommunityIcons name="check" size={14} color="#fff" />
                ) : (
                  <View style={[s.innerDot, { backgroundColor: current ? colors.info : colors.textMuted }]} />
                )}
              </View>
              {!isLast ? <View style={[s.connector, { backgroundColor: connectorColor }]} /> : null}
            </View>

            {/* Label + timestamp */}
            <View style={[s.body, isLast && s.bodyLast]}>
              <Text
                style={[
                  s.label,
                  { color: step.state === "pending" ? colors.textMuted : colors.textPrimary },
                ]}
              >
                {t(`offers.tracker.steps.${step.key}`)}
              </Text>
              <Text style={[s.time, { color: colors.textMuted }]}>
                {step.timestamp || t("offers.tracker.pending")}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: "row", gap: 14 },
  rail: { alignItems: "center", width: 28 },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  innerDot: { width: 8, height: 8, borderRadius: 4 },
  connector: { width: 2, flex: 1, marginVertical: 2 },
  body: { flex: 1, paddingBottom: 24 },
  bodyLast: { paddingBottom: 0 },
  label: { fontSize: 15, fontWeight: "700" },
  time: { fontSize: 12.5, marginTop: 3 },
});
