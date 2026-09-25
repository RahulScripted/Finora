import { useEffect, useRef, useState } from "react";

/**
 * Debounces a rapidly-changing value. Returns the latest value only after it
 * has stopped changing for `delay` ms. Handy for search inputs.
 *
 *   const debounced = useDebounce(query, 300);
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

/**
 * Wraps a function so it only runs after `delay` ms of inactivity.
 * The returned function has a `.cancel()` to clear a pending call.
 */
export function debounce<A extends unknown[]>(
  fn: (...args: A) => void,
  delay = 300,
): ((...args: A) => void) & { cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const debounced = (...args: A) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };

  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = undefined;
  };

  return debounced;
}

/**
 * A debounced callback that stays stable across renders.
 *
 *   const onSearch = useDebouncedCallback((q: string) => doSearch(q), 300);
 */
export function useDebouncedCallback<A extends unknown[]>(
  fn: (...args: A) => void,
  delay = 300,
) {
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (...args: A) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fnRef.current(...args), delay);
  };
}
