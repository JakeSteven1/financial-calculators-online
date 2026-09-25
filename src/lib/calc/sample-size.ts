/** Two-sided z-scores for common confidence levels. */
export const Z_SCORES: Record<string, number> = {
  '80': 1.2816,
  '85': 1.4395,
  '90': 1.6449,
  '95': 1.96,
  '98': 2.3263,
  '99': 2.5758,
};

/**
 * Cochran's formula n0 = z²·p(1−p)/e², with the finite population correction
 * n = n0 / (1 + (n0 − 1)/N). Returns a whole number (rounded up).
 */
export function sampleSize(confidencePct: string, marginOfErrorPct: number, population?: number, proportionPct = 50): number {
  const z = Z_SCORES[confidencePct];
  const e = marginOfErrorPct / 100;
  const p = proportionPct / 100;
  if (!z || !(e > 0) || !(p > 0 && p < 1)) return NaN;
  let n = (z * z * p * (1 - p)) / (e * e);
  if (population && population > 0) n = n / (1 + (n - 1) / population);
  return Math.ceil(n - 1e-9);
}

/** Margin of error (percent) for a given sample size. */
export function marginOfError(confidencePct: string, sample: number, population?: number, proportionPct = 50): number {
  const z = Z_SCORES[confidencePct];
  const p = proportionPct / 100;
  if (!z || !(sample > 0)) return NaN;
  let se = Math.sqrt((p * (1 - p)) / sample);
  if (population && population > sample) se *= Math.sqrt((population - sample) / (population - 1));
  return z * se * 100;
}
