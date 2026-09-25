import { useCallback, useEffect, useState } from "react";
import type { SupportData, SupportTicket } from "@data-types/support/constants";
import { SUPPORT_MOCK } from "@mock/support";

export type UseSupportResult = {
  data: SupportData;
  isLoading: boolean;
  isRefetching: boolean;
  /** Pull-to-refresh — re-reads the (mock) support data. */
  refetch: () => void;
  /** Creates a ticket and returns it (so the success screen can show its number). */
  submitTicket: (ticket: Omit<SupportTicket, "id" | "status" | "createdAt">) => SupportTicket;
};

// Module-level ticket store so tickets created on one screen are visible on
// another (e.g. Create → Track). Seeded once from the mock. When a real API is
// wired, replace these reads/writes with the service-request calls.
let TICKETS: SupportTicket[] = [...SUPPORT_MOCK.tickets];
const listeners = new Set<(tickets: SupportTicket[]) => void>();

function notify() {
  listeners.forEach((fn) => fn([...TICKETS]));
}

export function useSupport(): UseSupportResult {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([...TICKETS]);

  useEffect(() => {
    const id = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(id);
  }, []);

  const refetch = useCallback(() => {
    setIsRefetching(true);
    setTimeout(() => {
      setTickets([...TICKETS]);
      setIsRefetching(false);
    }, 700);
  }, []);

  // Subscribe to the shared store so every screen stays in sync.
  useEffect(() => {
    listeners.add(setTickets);
    setTickets([...TICKETS]);
    return () => {
      listeners.delete(setTickets);
    };
  }, []);

  const submitTicket = useCallback(
    (ticket: Omit<SupportTicket, "id" | "status" | "createdAt">): SupportTicket => {
      const newTicket: SupportTicket = {
        ...ticket,
        id: `TKT-${Date.now().toString().slice(-6)}`,
        status: "open",
        createdAt: new Date().toISOString(),
      };
      TICKETS = [newTicket, ...TICKETS];
      notify();
      return newTicket;
    },
    [],
  );

  const data: SupportData = { ...SUPPORT_MOCK, tickets };

  return { data, isLoading, isRefetching, refetch, submitTicket };
}
