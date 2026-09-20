import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { GlobalLoadingScreen } from "@components/loaders";

type LoadingCtx = {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  isLoading: boolean;
};

const LoadingContext = createContext<LoadingCtx>({
  showLoading: () => {},
  hideLoading: () => {},
  isLoading: false,
});

export const useGlobalLoading = () => useContext(LoadingContext);

const MAX_LOADING_MS = 20000;

export function GlobalLoadingProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<string | undefined>();
  const countRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSafetyTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const showLoading = useCallback((msg?: string) => {
    countRef.current += 1;
    setMessage(msg);
    setVisible(true);
    clearSafetyTimeout();
    timeoutRef.current = setTimeout(() => {
      countRef.current = 0;
      setVisible(false);
    }, MAX_LOADING_MS);
  }, [clearSafetyTimeout]);

  const hideLoading = useCallback(() => {
    countRef.current = Math.max(0, countRef.current - 1);
    if (countRef.current === 0) {
      clearSafetyTimeout();
      setVisible(false);
    }
  }, [clearSafetyTimeout]);

  useEffect(() => () => clearSafetyTimeout(), [clearSafetyTimeout]);

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading, isLoading: visible }}>
      {children}
      <GlobalLoadingScreen visible={visible} message={message} />
    </LoadingContext.Provider>
  );
}
