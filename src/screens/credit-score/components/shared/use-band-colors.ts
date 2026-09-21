import { useTheme } from "@context/Theme/ThemeContext";
import type { BandKey, FactorStatus } from "@data-types/credit-score/constants";

export function useBandColors(): Record<BandKey, string> {
  const { colors } = useTheme();
  return {
    poor: "#E5484D",
    fair: "#F59E0B",
    good: "#8CCB4F",
    very_good: "#34B26B",
    excellent: colors.success,
  };
}

export function useStatusColors(): Record<FactorStatus, string> {
  const { colors } = useTheme();
  return { great: colors.success, good: "#8CCB4F", fair: "#F59E0B", poor: "#E5484D" };
}
