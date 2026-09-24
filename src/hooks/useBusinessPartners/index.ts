import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  BusinessPartnersData,
  Partner,
} from "@data-types/business-partners/constants";
import { BUSINESS_PARTNERS_MOCK } from "@mock/business-partners";

export type UseBusinessPartnersResult = {
  data: BusinessPartnersData;
  isLoading: boolean;
  isRefetching: boolean;
  refetch: () => void;
  /** Look up a single partner by id (for the detail screen). */
  getPartner: (id: string) => Partner | undefined;
};

/**
 * Serves the Business Partners list + summary. Mirrors the app's other data
 * hooks: a short initial load, plus a simulated refetch for pull-to-refresh.
 */
export function useBusinessPartners(): UseBusinessPartnersResult {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setIsLoading(false), 650);
    return () => clearTimeout(id);
  }, []);

  const data = useMemo<BusinessPartnersData>(() => BUSINESS_PARTNERS_MOCK, []);

  const refetch = useCallback(() => {
    setIsRefetching(true);
    setTimeout(() => setIsRefetching(false), 700);
  }, []);

  const getPartner = useCallback(
    (id: string) => data.partners.find((p) => p.id === id),
    [data.partners],
  );

  return { data, isLoading, isRefetching, refetch, getPartner };
}
