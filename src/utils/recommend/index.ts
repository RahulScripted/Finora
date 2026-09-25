/**
 * Lightweight search suggester. Ranks items by how well their searchable text
 * matches a query (prefix > word-start > substring), returning the best few.
 * Feature-agnostic: pass a `getText` accessor for your item shape.
 */

export type RecommendOptions<T> = {
  /** Returns the searchable strings for an item (e.g. [id, category, desc]). */
  getText: (item: T) => string[];
  /** Max suggestions to return. Default 5. */
  limit?: number;
};

function scoreText(haystack: string, query: string): number {
  const h = haystack.toLowerCase();
  const q = query.toLowerCase();
  if (!q) return 0;
  if (h === q) return 100;
  if (h.startsWith(q)) return 80;
  // word-boundary start
  if (new RegExp(`\\b${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(h)) return 60;
  if (h.includes(q)) return 40;
  return 0;
}

/** Returns items ranked by relevance to `query` (best first), capped at `limit`. */
export function recommend<T>(items: T[], query: string, opts: RecommendOptions<T>): T[] {
  const q = query.trim();
  if (!q) return [];
  const limit = opts.limit ?? 5;

  return items
    .map((item) => {
      const best = Math.max(0, ...opts.getText(item).map((text) => scoreText(text, q)));
      return { item, score: best };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.item);
}

/**
 * Suggests distinct search terms (strings) from a pool, matching the query.
 * Useful for a "did you mean / try" chips row under a search box.
 */
export function suggestTerms(pool: string[], query: string, limit = 6): string[] {
  const q = query.trim().toLowerCase();
  const seen = new Set<string>();
  const ranked = pool
    .map((term) => ({ term, score: scoreText(term, q || term) }))
    .filter((r) => (q ? r.score > 0 : true))
    .sort((a, b) => b.score - a.score);

  const out: string[] = [];
  for (const { term } of ranked) {
    const key = term.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(term);
    if (out.length >= limit) break;
  }
  return out;
}
