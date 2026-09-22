/**
 * useUnmaskField
 *
 * Simulates a secure API call that returns the unmasked value of a sensitive field.
 * In production, this would call your backend with proper auth headers.
 *
 * Sensitive fields that require unmasking:
 *  - PAN          → stored masked as "XXXXX1234F" (first 5 chars hidden)
 *  - Aadhaar      → stored as last-4 digits, full number fetched on demand
 *  - Account no.  → stored as last-4 digits
 *  - GSTIN        → first 10 chars hidden: "XXXXXXXXXX1Z5"
 */

import { useCallback, useState } from "react";

export type UnmaskState = {
  value: string | null;
  isLoading: boolean;
  error: string | null;
};

// Simulated unmasked values — in production these come from the API
const UNMASKED_VALUES: Record<string, Record<string, string>> = {
  usr_9f21a3: {
    pan: "ABCDE1234F",
    aadhaar: "1234 5678 8842",
  },
  usr_7b4e10: {
    pan: "FGHIJ5678K",
    aadhaar: "9876 5432 4321",
  },
  biz_3d8c71: {
    gstin: "27ABCPT1234F1Z5",
    account: "XXXX XXXX XXXX 4821",
  },
};

export function useUnmaskField() {
  const [states, setStates] = useState<Record<string, UnmaskState>>({});

  const unmask = useCallback(
    async (entityId: string, field: string): Promise<string | null> => {
      const key = `${entityId}__${field}`;
      setStates((prev) => ({
        ...prev,
        [key]: { value: null, isLoading: true, error: null },
      }));

      // Simulate 1s network latency
      await new Promise((r) => setTimeout(r, 1000));

      const value = UNMASKED_VALUES[entityId]?.[field] ?? null;
      setStates((prev) => ({
        ...prev,
        [key]: {
          value,
          isLoading: false,
          error: value ? null : "Unable to fetch. Please try again.",
        },
      }));
      return value;
    },
    [],
  );

  const getState = useCallback(
    (entityId: string, field: string): UnmaskState => {
      return (
        states[`${entityId}__${field}`] ?? {
          value: null,
          isLoading: false,
          error: null,
        }
      );
    },
    [states],
  );

  const clear = useCallback((entityId: string, field: string) => {
    const key = `${entityId}__${field}`;
    setStates((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  return { unmask, getState, clear };
}
