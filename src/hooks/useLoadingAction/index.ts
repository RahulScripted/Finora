import { useCallback } from "react";
import { useGlobalLoading } from "@context/Loading/GlobalLoadingContext";

type RunOptions = {
  /** Message shown under the coin loader. */
  message?: string;
  /** How long the loader stays visible (ms). Defaults to 3500. */
  duration?: number;
  /** Called once the loader hides (e.g. show a success toast). */
  onDone?: () => void;
};

/**
 * Shows the global coin loader for a set duration, then hides it and runs
 * `onDone`. Handy for button clicks and simulated async work.
 */
export function useLoadingAction() {
  const { showLoading, hideLoading } = useGlobalLoading();

  return useCallback(
    ({ message, duration = 3500, onDone }: RunOptions = {}) => {
      showLoading(message);
      setTimeout(() => {
        hideLoading();
        onDone?.();
      }, duration);
    },
    [showLoading, hideLoading],
  );
}
