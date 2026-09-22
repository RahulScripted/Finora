import { useCallback, useEffect, useMemo, useState } from "react";
import type { Period, SpendSummary } from "@data-types/track-spend/constants";
import { buildSpendSummary } from "@mock/track-spend";

export type UseSpendSummaryResult = {
  data: SpendSummary;
  isLoading: boolean;
  isRefetching: boolean;
  refetch: () => void;
};

export function useSpendSummary(period: Period): UseSpendSummaryResult {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [fetchKey, setFetchKey] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => setIsLoading(false), 450);
    return () => clearTimeout(id);
  }, []);

  const data = useMemo(
    () => buildSpendSummary(period),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [period, fetchKey],
  );

  const refetch = useCallback(() => {
    setIsRefetching(true);
    setTimeout(() => {
      setFetchKey((k) => k + 1);
      setIsRefetching(false);
    }, 700);
  }, []);

  return { data, isLoading, isRefetching, refetch };
}
