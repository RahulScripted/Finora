import { useCallback, useMemo, useState } from "react";
import type { CompareResult, CompareSlot, Offer, OfferId } from "@data-types/offers/constants";
import { computeCompare } from "@data-types/offers/constants";
import { OFFERS_MOCK, rateProfileFor } from "@mock/offers";

/** Offers eligible for comparison (apply-style products with an EMI). */
const COMPARABLE_IDS: OfferId[] = [
  "business_loan",
  "overdraft",
  "supply_chain",
  "purchase_order",
  "term_loan",
  "invoice_discounting",
];

export type UseCompareResult = {
  /** Offers the user can pick from, in display order. */
  options: Offer[];
  /** Current A / B selection (offer ids). */
  selection: Record<CompareSlot, OfferId>;
  /** Choose an offer for a given slot. */
  selectOffer: (slot: CompareSlot, id: OfferId) => void;
  principal: number;
  setPrincipal: (v: number) => void;
  months: number;
  setMonths: (v: number) => void;
  /** Computed results per slot (rate / fee come from each offer's profile). */
  results: Record<CompareSlot, CompareResult>;
  /** The slot with the lower total payable ("better" deal). */
  winner: CompareSlot;
  /** How much the winner saves over the other side. */
  savings: number;
  /** EMI gap between the two offers (absolute). */
  emiGap: number;
  getOffer: (id: OfferId) => Offer | undefined;
};

export function useCompare(): UseCompareResult {
  const options = useMemo(
    () => COMPARABLE_IDS.map((id) => OFFERS_MOCK.find((o) => o.id === id)).filter(Boolean) as Offer[],
    [],
  );

  const [selection, setSelection] = useState<Record<CompareSlot, OfferId>>({
    A: "business_loan",
    B: "term_loan",
  });

  const [principal, setPrincipal] = useState(1_500_000);
  const [months, setMonths] = useState(12);

  const getOffer = useCallback((id: OfferId) => OFFERS_MOCK.find((o) => o.id === id), []);

  const selectOffer = useCallback((slot: CompareSlot, id: OfferId) => {
    setSelection((prev) => ({ ...prev, [slot]: id }));
  }, []);

  // Rate / fee are driven entirely by each selected offer's profile.
  const results = useMemo<Record<CompareSlot, CompareResult>>(() => {
    const a = rateProfileFor(selection.A);
    const b = rateProfileFor(selection.B);
    return {
      A: computeCompare({ annualRate: a.annualRate, feePct: a.feePct }, { principal, months }),
      B: computeCompare({ annualRate: b.annualRate, feePct: b.feePct }, { principal, months }),
    };
  }, [selection, principal, months]);

  const winner: CompareSlot = results.A.totalPayable <= results.B.totalPayable ? "A" : "B";
  const savings = Math.abs(results.A.totalPayable - results.B.totalPayable);
  const emiGap = Math.abs(results.A.emi - results.B.emi);

  return {
    options,
    selection,
    selectOffer,
    principal,
    setPrincipal,
    months,
    setMonths,
    results,
    winner,
    savings,
    emiGap,
    getOffer,
  };
}
