/**
 * Deterministic barcode generator.
 *
 * Produces a stable set of bar widths from any seed string (e.g. a ticket
 * number), so the same ticket always renders the same barcode, but different
 * tickets look unique. Pure + side-effect free — safe to call during render.
 */

export type BarcodeBar = { width: number; opacity: number };

/** djb2-style string hash → 32-bit int. */
function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0; // force 32-bit
  }
  return h;
}

/** Seeded pseudo-random in [0, 1). */
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Generates `count` bars from `value`. Bar widths alternate between a thin and
 * thick weight based on the seeded random, and opacity varies for a printed look.
 */
export function generateBarcode(value: string, count = 60): BarcodeBar[] {
  const seed = hashCode(value || "FINORA");
  return Array.from({ length: count }).map((_, i) => {
    const r = seededRandom(seed + i);
    const r2 = seededRandom(seed + i * 3 + 1);
    return {
      width: r > 0.7 ? 2.5 : r > 0.4 ? 1.5 : 1,
      opacity: r2 > 0.5 ? 1 : 0.6,
    };
  });
}
