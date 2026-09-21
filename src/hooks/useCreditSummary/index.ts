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

  useEffect(() => {
    const id = setTimeout(() => setIsLoading(false), 450);
    return () => clearTimeout(id);
  }, []);

  const data = useMemo(
    () => (account ? randomCreditSummary(account) : CREDIT_SCORE_MOCK),
    [account],
  );

  const refetch = useCallback(() => {
    setIsRefetching(true);
    setTimeout(() => setIsRefetching(false), 700);
  }, []);

  const fetchForAccount = useCallback((acc: string) => {
    setIsRefetching(true);
    // 2.5s simulated latency so the loader is visible for 2-3 seconds
    setTimeout(() => {
      setAccount(acc.trim());
      setIsRefetching(false);
    }, 2500);
  }, []);

  return { data, isLoading, isRefetching, refetch, fetchForAccount };
}
