import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

/** Animates from 0 → 1 with ease-out cubic. Jumps to 1 if reduce motion is on. */
export function useAnimatedProgress(duration = 900) {
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (cancelled) return;
      if (reduce) { setP(1); return; }
      const start = Date.now();
      const tick = () => {
        const t = Math.min(1, (Date.now() - start) / duration);
        setP(1 - Math.pow(1 - t, 3));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    return () => { cancelled = true; cancelAnimationFrame(raf); };
  }, [duration]);

  return p;
}
