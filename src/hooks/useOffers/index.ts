import { useCallback, useMemo, useState } from "react";
import type {
  LoanApplication,
  Offer,
  OfferCategory,
  OfferId,
} from "@data-types/offers/constants";
import {
  APPLICATION_STATUS_MOCK,
  LOAN_APPLICATIONS_MOCK,
  OFFERS_MOCK,
  tenureOptionsFor,
} from "@mock/offers";

export type UseOffersResult = {
  offers: Offer[];
  /** Offers filtered by the active category chip. */
  filtered: Offer[];
  category: OfferCategory;
  setCategory: (c: OfferCategory) => void;
  getOffer: (id: OfferId) => Offer | undefined;
  tenuresFor: (id: OfferId) => ReturnType<typeof tenureOptionsFor>;
  statusSteps: typeof APPLICATION_STATUS_MOCK;
  /** The most recent (mock) submitted application. */
  latestApplication: LoanApplication;
  getApplication: (id: string) => LoanApplication | undefined;
};

/** Simple reference generator, e.g. "FIN-BL-2026-00873". */
function makeApplicationId(offerId: OfferId): string {
  const code = offerId.slice(0, 2).toUpperCase();
  const serial = String(Math.floor(1000 + Math.random() * 9000)).padStart(5, "0");
  return `FIN-${code}-2026-${serial}`;
}

export function useOffers(): UseOffersResult {
  const [category, setCategory] = useState<OfferCategory>("all");

  const filtered = useMemo(
    () => (category === "all" ? OFFERS_MOCK : OFFERS_MOCK.filter((o) => o.category === category)),
    [category],
  );

  const getOffer = useCallback(
    (id: OfferId) => OFFERS_MOCK.find((o) => o.id === id),
    [],
  );

  const tenuresFor = useCallback((id: OfferId) => tenureOptionsFor(id), []);

  const getApplication = useCallback(
    (id: string) => LOAN_APPLICATIONS_MOCK.find((a) => a.id === id),
    [],
  );

  return {
    offers: OFFERS_MOCK,
    filtered,
    category,
    setCategory,
    getOffer,
    tenuresFor,
    statusSteps: APPLICATION_STATUS_MOCK,
    latestApplication: LOAN_APPLICATIONS_MOCK[0],
    getApplication,
  };
}

export { makeApplicationId };
