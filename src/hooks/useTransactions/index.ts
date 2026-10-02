import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  Transaction,
  TransactionSummary,
} from "@data-types/transaction-history/constants";
import {
  buildAllTransactions,
  buildTransactionSummary,
} from "@mock/transaction-history";

const PAGE_SIZE = 6;

export type UseTransactionsResult = {
  data: Transaction[];
  all: Transaction[];
  summary: TransactionSummary;
  isLoading: boolean;
  isRefetching: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;
  refetch: () => void;
  getTransaction: (id: string) => Transaction | undefined;
};


export function useTransactions(): UseTransactionsResult {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [fetchKey, setFetchKey] = useState(0);
  const loadingRef = useRef(false);

  useEffect(() => {
    const id = setTimeout(() => setIsLoading(false), 450);
    return () => clearTimeout(id);
  }, []);

  const all = useMemo(
    () => buildAllTransactions(),
    [fetchKey],
  );
  const summary = useMemo(() => buildTransactionSummary(), []);

  const data = useMemo(() => all.slice(0, page * PAGE_SIZE), [all, page]);
  const hasMore = data.length < all.length;

  const getTransaction = useCallback((id: string) => all.find((t) => t.id === id), [all]);

  const loadMore = useCallback(() => {
    if (loadingRef.current || isLoading) return;
    if (page * PAGE_SIZE >= all.length) return;
    loadingRef.current = true;
    setLoadingMore(true);
    setTimeout(() => {
      setPage((p) => p + 1);
      setLoadingMore(false);
      loadingRef.current = false;
    }, 900);
  }, [page, all.length, isLoading]);

  const refetch = useCallback(() => {
    setIsRefetching(true);
    setTimeout(() => {
      setPage(1);
      setFetchKey((k) => k + 1);
      setIsRefetching(false);
    }, 700);
  }, []);

  return {
    data,
    all,
    summary,
    isLoading,
    isRefetching,
    loadingMore,
    hasMore,
    loadMore,
    refetch,
    getTransaction,
  };
}
