import ProgressRing from "@components/chart/progress-ring";
import { useTheme } from "@context/Theme/ThemeContext";
import { StyleSheet, Text } from "react-native";
import { utilizationTone } from "@data-types/business-partners/constants";
import { localizeDigits } from "@utils/format-locals";

type Props = { pct: number; size?: number; stroke?: number };

/** Utilization progress ring, colored by zone (green/amber/red), with % label. */
export default function UtilizationRing({ pct, size = 46, stroke = 5 }: Props) {
  const { colors } = useTheme();
  const clamped = Math.max(0, Math.min(100, pct));
  const tone = utilizationTone(clamped);
  const toneColor =
    tone === "success" ? colors.success : tone === "warning" ? colors.warning : colors.danger;

  return (
    <ProgressRing
      pct={clamped}
      color={toneColor}
      size={size}
      stroke={stroke}
      label={
        <Text style={[s.pct, { color: colors.textPrimary, fontSize: size * 0.24 }]}>
          {localizeDigits(String(clamped))}%
        </Text>
      }
    />
  );
}

const s = StyleSheet.create({
  pct: { fontWeight: "700", fontVariant: ["tabular-nums"] },
});
