import { useTheme } from "@context/Theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { STATUS_CONFIG, type PartnerStatus, type Tone } from "@data-types/business-partners/constants";

type Props = { status: PartnerStatus };

export default function StatusPill({ status }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const cfg = STATUS_CONFIG[status];

  const toneColor: Record<Tone, string> = {
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
    neutral: colors.textMuted,
  };
  const toneSoft: Record<Tone, string> = {
    success: colors.successSoft,
    warning: colors.warningSoft,
    danger: colors.dangerSoft,
    neutral: colors.surface,
  };

  return (
    <View style={[s.pill, { backgroundColor: toneSoft[cfg.tone] }]}>
      <View style={[s.dot, { backgroundColor: toneColor[cfg.tone] }]} />
      <Text style={[s.label, { color: toneColor[cfg.tone] }]}>{t(cfg.labelKey)}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  pill: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  label: { fontSize: 11, fontWeight: "600" },
});
