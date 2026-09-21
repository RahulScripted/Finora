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

  useEffect(() => {
    const id = setTimeout(() => setIsLoading(false), 450);
    return () => clearTimeout(id);
  }, []);

  const data = useMemo(() => buildSpendSummary(period), [period]);

  const refetch = useCallback(() => {
    setIsRefetching(true);
    setTimeout(() => setIsRefetching(false), 700);
  }, []);

  return { data, isLoading, isRefetching, refetch };
}
