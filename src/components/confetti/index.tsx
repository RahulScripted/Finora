import { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

// canvas-confetti-style palette.
const COLORS = ["#FF5A36", "#FFC24B", "#16A477", "#3787D8", "#8B5CF6", "#FF8A6D", "#FFFFFF"];

const LIFETIME = 1800; // ms a particle stays alive
const GRAVITY = 1200; // px/s^2

type Particle = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
};

type Props = {
  active?: boolean;
  /** Burst origin as a fraction of the screen. Defaults to slightly above center. */
  origin?: { x: number; y: number };
  /** Particles per burst. */
  count?: number;
  /** How many bursts to fire (spaced out) before stopping. */
  bursts?: number;
};

/**
 * Radial confetti burst — particles fan out from a single origin point in all
 * directions (spread ~360°) and fall with gravity, like canvas-confetti.
 */
export function ConfettiOverlay({ active = false, origin, count = 90, bursts = 2 }: Props) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const ox = (origin?.x ?? 0.5) * SCREEN_W;
    const oy = (origin?.y ?? 0.42) * SCREEN_H;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const fire = () => {
      const batch: Particle[] = [];
      for (let i = 0; i < count; i++) {
        // Fan mostly upward/outward: angle spread across the full circle,
        // biased upward so it arcs up then falls (canvas-confetti feel).
        const angle = Math.PI + Math.random() * Math.PI; // 180°–360° (upper half)
        const speed = 320 + Math.random() * 520;
        batch.push({
          id: idRef.current++,
          x: ox,
          y: oy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          size: 6 + Math.random() * 7,
        });
      }
      setParticles((prev) => [...prev, ...batch]);
    };

    for (let b = 0; b < bursts; b++) {
      timers.push(setTimeout(fire, b * 250));
    }

    return () => timers.forEach(clearTimeout);
  }, [active, origin?.x, origin?.y, count, bursts]);

  const removeParticle = (id: number) => setParticles((prev) => prev.filter((p) => p.id !== id));

  if (!active && particles.length === 0) return null;

  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, s.overlay]}>
      {particles.map((p) => (
        <ConfettiPiece key={p.id} particle={p} onDone={removeParticle} />
      ))}
    </Animated.View>
  );
}

function ConfettiPiece({ particle, onDone }: { particle: Particle; onDone: (id: number) => void }) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withTiming(1, { duration: LIFETIME, easing: Easing.out(Easing.quad) }, (finished) => {
      if (finished) runOnJS(onDone)(particle.id);
    });
  }, [t, particle.id, onDone]);

  const style = useAnimatedStyle(() => {
    const sec = (t.value * LIFETIME) / 1000;
    const dx = particle.vx * sec;
    const dy = particle.vy * sec + 0.5 * GRAVITY * sec * sec;
    return {
      transform: [
        { translateX: particle.x + dx },
        { translateY: particle.y + dy },
        { rotate: `${t.value * 720}deg` },
      ],
      opacity: 1 - t.value * t.value,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: particle.size,
          height: particle.size * 0.55,
          backgroundColor: particle.color,
          borderRadius: 1.5,
        },
        style,
      ]}
    />
  );
}

const s = StyleSheet.create({
  // Render above cards/tickets so the burst is always visible.
  overlay: { zIndex: 9999, elevation: 9999 },
});

export default ConfettiOverlay;
