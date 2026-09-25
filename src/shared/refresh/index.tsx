import { useTheme } from "@context/Theme/ThemeContext";
import { useCallback, useState } from "react";
import { RefreshControl, type RefreshControlProps } from "react-native";

export type UseRefreshResult = {
  refreshing: boolean;
  handleRefresh: () => void;
  /** Drop-in element for a ScrollView / FlatList `refreshControl` prop. */
  refreshControl: React.ReactElement<RefreshControlProps>;
};

/**
 * App-wide pull-to-refresh. One place for the spinner state + themed colors,
 * so every screen uses the same refresh behaviour (DRY).
 *
 *   const { refreshControl } = useRefresh(reload);
 *   <ScrollView refreshControl={refreshControl} ... />
 */
export function useRefresh(
  onRefresh?: () => void | Promise<void>,
  minDuration = 700,
): UseRefreshResult {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    const started = Date.now();
    Promise.resolve(onRefresh?.()).finally(() => {
      const elapsed = Date.now() - started;
      const wait = Math.max(0, minDuration - elapsed);
      setTimeout(() => setRefreshing(false), wait);
    });
  }, [onRefresh, minDuration]);

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
      tintColor={colors.accent}
      colors={[colors.accent]}
    />
  );

  return { refreshing, handleRefresh, refreshControl };
}
