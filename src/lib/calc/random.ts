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
 * Picks `count` distinct keys where each key's chance is proportional to its
 * weight. After a key wins, it is removed and the draw repeats on the rest.
 */
export function weightedSampleWithoutReplacement(weights: ReadonlyMap<string, number>, count: number, rng: Rng = cryptoRng): string[] {
  const pool = [...weights].filter(([, w]) => w > 0);
  const winners: string[] = [];
  while (winners.length < count && pool.length > 0) {
    const total = pool.reduce((s, [, w]) => s + w, 0);
    let target = rng() * total;
    let idx = pool.findIndex(([, w]) => (target -= w) < 0);
    if (idx === -1) idx = pool.length - 1; // floating point guard
    winners.push(pool[idx]![0]);
    pool.splice(idx, 1);
  }
  return winners;
}
