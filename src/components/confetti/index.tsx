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

// Buckeyes-style palette from the tsparticles sample; tweak freely.
const COLORS = ["#FF5A36", "#FFFFFF", "#FF8A6D", "#16A477", "#3787D8", "#E99A24"];

const DURATION_MS = 7 * 1000;
const GRAVITY = 900; // px/s^2
const LIFETIME = 1600; // ms a particle stays alive

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
};

function launch(originX: number, angleDeg: number, spread: number, speed: number) {
  const angle = (angleDeg + (Math.random() - 0.5) * spread) * (Math.PI / 180);
  return { vx: Math.cos(angle) * speed, vy: -Math.sin(angle) * speed, originX };
}

function ConfettiPiece({ particle, onDone }: { particle: Particle; onDone: (id: number) => void }) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withTiming(1, { duration: LIFETIME, easing: Easing.linear }, (finished) => {
      if (finished) runOnJS(onDone)(particle.id);
    });
  }, [t, particle.id, onDone]);

  const style = useAnimatedStyle(() => {
    const sec = (t.value * LIFETIME) / 1000;
    const dx = particle.vx * sec;
    const dy = particle.vy * sec + 0.5 * GRAVITY * sec * sec;
    return {
      transform: [{ translateX: particle.x + dx }, { translateY: particle.y + dy }, { rotate: `${t.value * 720}deg` }],
      opacity: 1 - t.value,
    };
  });

  return (
    <Animated.View
      style={[
        { position: "absolute", width: particle.size, height: particle.size * 0.6, backgroundColor: particle.color, borderRadius: 1 },
        style,
      ]}
    />
  );
}
export function ConfettiOverlay({ active = false }: Props) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }
    const end = Date.now() + DURATION_MS;
    let frame: ReturnType<typeof setTimeout>;

    const tick = () => {
      const batch: Particle[] = [];
      for (const side of [
        { originX: 0, angle: 60 },
        { originX: SCREEN_W, angle: 120 },
      ]) {
        for (let i = 0; i < 2; i++) {
          const speed = 520 + Math.random() * 220;
          const v = launch(side.originX, side.angle, 55, speed);
          batch.push({
            id: idRef.current++,
            x: side.originX,
            y: SCREEN_H,
            vx: v.vx,
            vy: v.vy,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            size: 7 + Math.random() * 6,
          });
        }
      }
      setParticles((prev) => [...prev, ...batch]);
      if (Date.now() < end) frame = setTimeout(tick, 60);
    };
    tick();

    return () => clearTimeout(frame);
  }, [active]);

  const removeParticle = (id: number) => setParticles((prev) => prev.filter((p) => p.id !== id));

  if (!active && particles.length === 0) return null;

  return (
    <Animated.View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {particles.map((p) => (
        <ConfettiPiece key={p.id} particle={p} onDone={removeParticle} />
      ))}
    </Animated.View>
  );
}

export default ConfettiOverlay;
