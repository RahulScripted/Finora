import { useCallback, useMemo, useState } from "react";
import type {
  ApplicationStatus,
  LoanApplication,
  Offer,
  OfferCategory,
  OfferId,
  OfferSectionCard,
} from "@data-types/offers/constants";
import {
  APPLICATION_STATUS_MOCK,
  LOAN_APPLICATIONS_MOCK,
  OFFER_SECTIONS_MOCK,
  OFFERS_MOCK,
  tenureOptionsFor,
} from "@mock/offers";

/** Status chips shown on the applications list ("all" first). */
export type ApplicationFilter = "all" | ApplicationStatus;

export type UseOffersResult = {
  offers: Offer[];
  /** Flexible entry cards for the Offers tab landing. */
  sections: OfferSectionCard[];
  /** Offers highlighted in the "Featured offers" strip. */
  featured: Offer[];
  /** Offers filtered by the active category chip. */
  filtered: Offer[];
  category: OfferCategory;
  setCategory: (c: OfferCategory) => void;
  getOffer: (id: OfferId) => Offer | undefined;
  tenuresFor: (id: OfferId) => ReturnType<typeof tenureOptionsFor>;
  statusSteps: typeof APPLICATION_STATUS_MOCK;
  /** Every submitted application (tracker list). */
  applications: LoanApplication[];
  /** Applications filtered by the active status chip. */
  filteredApplications: LoanApplication[];
  applicationFilter: ApplicationFilter;
  setApplicationFilter: (f: ApplicationFilter) => void;
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
  const [applicationFilter, setApplicationFilter] = useState<ApplicationFilter>("all");

  const filtered = useMemo(
    () => (category === "all" ? OFFERS_MOCK : OFFERS_MOCK.filter((o) => o.category === category)),
    [category],
  );

  const featured = useMemo(() => OFFERS_MOCK.filter((o) => o.featured), []);

  const filteredApplications = useMemo(
    () =>
      applicationFilter === "all"
        ? LOAN_APPLICATIONS_MOCK
        : LOAN_APPLICATIONS_MOCK.filter((a) => a.status === applicationFilter),
    [applicationFilter],
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
    sections: OFFER_SECTIONS_MOCK,
    featured,
    filtered,
    category,
    setCategory,
    getOffer,
    tenuresFor,
    statusSteps: APPLICATION_STATUS_MOCK,
    applications: LOAN_APPLICATIONS_MOCK,
    filteredApplications,
    applicationFilter,
    setApplicationFilter,
    latestApplication: LOAN_APPLICATIONS_MOCK[0],
    getApplication,
  };
}

export { makeApplicationId };
