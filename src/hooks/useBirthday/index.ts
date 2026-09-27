import { useCallback, useEffect, useState } from "react";
import type { UseBirthdayResult } from "@data-types/birthday/constants";
import { isBirthdayToday } from "@utils/birthday";

/**
 * Decides whether to auto-show the birthday celebration: true whenever the
 * given date-of-birth falls on today. Shows on every app launch during the
 * birthday (no once-per-day suppression). Meant to be called on a screen that
 * mounts right after login (e.g. Home).
 */
export function useBirthday(dateOfBirth?: string | null): UseBirthdayResult {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isBirthdayToday(dateOfBirth)) setVisible(true);
  }, [dateOfBirth]);

  const dismiss = useCallback(() => {
    setVisible(false);
  }, []);

  return { visible, dismiss };
}
