/** Parses numbers separated by commas, spaces, semicolons, tabs, or new lines. */
export function parseDataset(text: string): { values: number[]; invalid: string[] } {
  const values: number[] = [];
  const invalid: string[] = [];
  for (const token of text.split(/[\s,;]+/).filter(Boolean)) {
    const n = Number(token);
    if (Number.isFinite(n)) values.push(n);
    else invalid.push(token);
  }
  return { values, invalid };
}

export const sortAsc = (values: readonly number[]) => [...values].sort((a, b) => a - b);

export function sum(values: readonly number[]): number {
  // Kahan summation keeps long decimal lists accurate.
  let s = 0;
  let c = 0;
  for (const v of values) {
    const y = v - c;
    const t = s + y;
    c = t - s - y;
    s = t;
  }
  return s;
}

export function mean(values: readonly number[]): number {
  return values.length ? sum(values) / values.length : NaN;
}

export function median(values: readonly number[]): number {
  if (!values.length) return NaN;
  const s = sortAsc(values);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid]! : (s[mid - 1]! + s[mid]!) / 2;
}

export interface ModeResult {
  /** All values tied for the highest frequency; empty when every value appears once. */
  modes: number[];
  frequency: number;
}

export function mode(values: readonly number[]): ModeResult {
  const counts = new Map<number, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  const frequency = Math.max(0, ...counts.values());
  if (frequency <= 1) return { modes: [], frequency };
  const modes = [...counts].filter(([, c]) => c === frequency).map(([v]) => v).sort((a, b) => a - b);
  return { modes, frequency };
}

/** Sum of squared deviations from the mean. */
function sumSquares(values: readonly number[]): number {
  const m = mean(values);
  return sum(values.map((v) => (v - m) ** 2));
}

export function variance(values: readonly number[], kind: 'population' | 'sample'): number {
  const n = values.length;
  const denom = kind === 'population' ? n : n - 1;
  return denom > 0 ? sumSquares(values) / denom : NaN;
}

export function standardDeviation(values: readonly number[], kind: 'population' | 'sample'): number {
  return Math.sqrt(variance(values, kind));
}

export type QuartileMethod = 'exclusive' | 'inclusive';

export interface Quartiles {
  min: number;
  q1: number;
  q2: number;
  q3: number;
  max: number;
  iqr: number;
  /** Tukey fences: values outside [q1 − 1.5·IQR, q3 + 1.5·IQR] are outliers. */
  lowerFence: number;
  upperFence: number;
  outliers: number[];
}

/** Linear interpolation at fractional rank p (0-based) in sorted data. */
function interpolate(s: readonly number[], p: number): number {
  const lo = Math.floor(p);
  const hi = Math.ceil(p);
  return s[lo]! + (s[hi]! - s[lo]!) * (p - lo);
}

/**
 * exclusive: median of each half, excluding the overall median when n is odd
 *            (Tukey hinges variant used by TI-83 and most textbooks).
 * inclusive: linear interpolation at (n − 1)·p, same as Excel QUARTILE.INC.
 */
export function quartiles(values: readonly number[], method: QuartileMethod = 'exclusive'): Quartiles | null {
  const s = sortAsc(values);
  const n = s.length;
  if (n === 0) return null;
  let q1: number;
  let q3: number;
  if (method === 'inclusive' || n < 4) {
    q1 = interpolate(s, (n - 1) * 0.25);
    q3 = interpolate(s, (n - 1) * 0.75);
  } else {
    const half = Math.floor(n / 2);
    q1 = median(s.slice(0, half));
    q3 = median(s.slice(n % 2 ? half + 1 : half));
  }
  const iqr = q3 - q1;
  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;
  return {
    min: s[0]!,
    q1,
    q2: median(s),
    q3,
    max: s[n - 1]!,
    iqr,
    lowerFence,
    upperFence,
    outliers: s.filter((v) => v < lowerFence || v > upperFence),
  };
}
