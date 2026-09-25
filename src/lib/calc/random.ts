/** Returns a float in [0, 1). Injected so tests can be deterministic. */
export type Rng = () => number;

/** Cryptographically strong RNG (Web Crypto; available in browsers and Node). */
export const cryptoRng: Rng = () => {
  const buf = new Uint32Array(2);
  crypto.getRandomValues(buf);
  // 53 random bits -> [0, 1)
  return (buf[0]! * 2 ** 21 + (buf[1]! >>> 11)) / 2 ** 53;
};

/** Uniform integer in [min, max] inclusive. */
export function randomInt(min: number, max: number, rng: Rng = cryptoRng): number {
  return min + Math.floor(rng() * (max - min + 1));
}

/** Picks `count` distinct items uniformly (partial Fisher-Yates). */
export function sampleWithoutReplacement<T>(items: readonly T[], count: number, rng: Rng = cryptoRng): T[] {
  const pool = [...items];
  const n = Math.min(Math.max(0, Math.floor(count)), pool.length);
  for (let i = 0; i < n; i++) {
    const j = i + Math.floor(rng() * (pool.length - i));
    [pool[i], pool[j]] = [pool[j]!, pool[i]!];
  }
  return pool.slice(0, n);
}

/**
 * Picks `count` distinct indexes where each index's chance is proportional to
 * its weight. After an index wins, its weight drops to zero and the draw
 * repeats on the rest. O(n) per pick, so fine for large lists and few winners.
 */
export function weightedSampleIndexes(weights: readonly number[], count: number, rng: Rng = cryptoRng): number[] {
  const w = weights.map((x) => (x > 0 ? x : 0));
  let total = w.reduce((s, x) => s + x, 0);
  const picked: number[] = [];
  while (picked.length < count && total > 0) {
    let target = rng() * total;
    let idx = -1;
    for (let i = 0; i < w.length; i++) {
      if (w[i]! === 0) continue;
      idx = i; // last positive weight doubles as the floating point guard
      if ((target -= w[i]!) < 0) break;
    }
    if (idx === -1) break;
    picked.push(idx);
    total -= w[idx]!;
    w[idx] = 0;
  }
  return picked;
}

/** Map-keyed wrapper around weightedSampleIndexes. */
export function weightedSampleWithoutReplacement(weights: ReadonlyMap<string, number>, count: number, rng: Rng = cryptoRng): string[] {
  const keys = [...weights.keys()];
  return weightedSampleIndexes([...weights.values()], count, rng).map((i) => keys[i]!);
}
