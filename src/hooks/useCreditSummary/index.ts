import { useCallback, useEffect, useMemo, useState } from "react";
import type { CreditSummary } from "@data-types/credit-score/constants";
import { CREDIT_SCORE_MOCK } from "@mock/credit-score";
import { randomCreditSummary } from "@utils/pick-random";

export type UseCreditSummaryResult = {
  data: CreditSummary;
  isLoading: boolean;
  isRefetching: boolean;
  refetch: () => void;
  /** Call with an account number to recalculate the whole summary. */
  fetchForAccount: (account: string) => void;
};

export function useCreditSummary(): UseCreditSummaryResult {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  // bump this to force data to recompute on refetch
  const [fetchKey, setFetchKey] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => setIsLoading(false), 450);
    return () => clearTimeout(id);
  }, []);

  const data = useMemo(
    () => (account ? randomCreditSummary(account + fetchKey) : CREDIT_SCORE_MOCK),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account, fetchKey],
  );

  const refetch = useCallback(() => {
    if (!account) return;
    setIsRefetching(true);
    setTimeout(() => {
      setFetchKey((k) => k + 1);
      setIsRefetching(false);
    }, 700);
  }, [account]);

  const fetchForAccount = useCallback((acc: string) => {
    setIsRefetching(true);
    setTimeout(() => {
      setAccount(acc.trim());
      setFetchKey((k) => k + 1);
      setIsRefetching(false);
    }, 2500);
  }, []);

  return { data, isLoading, isRefetching, refetch, fetchForAccount };
}
