import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

export function useCountUp(target: number, duration = 700) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf = 0;
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (cancelled) return;
      if (reduce) {
        setValue(target);
        return;
      }
      const start = Date.now();
      const tick = () => {
        const p = Math.min(1, (Date.now() - start) / duration);
        setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [target, duration]);

  return value;
}
