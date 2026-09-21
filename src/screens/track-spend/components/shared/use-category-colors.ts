import { useTheme } from "@context/Theme/ThemeContext";
import type { CategoryKey } from "@data-types/track-spend/constants";

export function useCategoryColors(): Record<CategoryKey, string> {
  const { colors } = useTheme();
  return {
    vendors: colors.accent,
    salaries: colors.textPrimary,
    logistics: "#F2B36B",
    rent: "#8C93A8",
    other: "#CFC8B8",
  };
}
