import { cryptoRng, randomInt, sampleWithoutReplacement, type Rng } from './random';

export interface RandomNumbersInput {
  min: number;
  max: number;
  count: number;
  allowRepeats: boolean;
  sort?: boolean;
}

export type RandomNumbersResult = { ok: true; numbers: number[] } | { ok: false; error: string };

/** Largest range for which unique draws build the full candidate list. */
const MAX_UNIQUE_RANGE = 1_000_000;

export function generateRandomNumbers(input: RandomNumbersInput, rng: Rng = cryptoRng): RandomNumbersResult {
  const min = Math.ceil(Math.min(input.min, input.max));
  const max = Math.floor(Math.max(input.min, input.max));
  const count = Math.floor(input.count);
  if (![min, max, count].every(Number.isFinite)) return { ok: false, error: 'Enter whole numbers for the range and count.' };
  if (min > max) return { ok: false, error: 'The range does not contain any whole numbers.' };
  if (count < 1 || count > 10_000) return { ok: false, error: 'Choose between 1 and 10,000 numbers.' };
  const size = max - min + 1;

  let numbers: number[];
  if (input.allowRepeats) {
    numbers = Array.from({ length: count }, () => randomInt(min, max, rng));
  } else {
    if (count > size) return { ok: false, error: `Only ${size} unique numbers exist between ${min} and ${max}.` };
    if (size <= MAX_UNIQUE_RANGE) {
      numbers = sampleWithoutReplacement(Array.from({ length: size }, (_, i) => min + i), count, rng);
    } else {
      // Huge range: rejection sampling, collisions are rare.
      const seen = new Set<number>();
      while (seen.size < count) seen.add(randomInt(min, max, rng));
      numbers = [...seen];
    }
  }
  if (input.sort) numbers.sort((a, b) => a - b);
  return { ok: true, numbers };
}
