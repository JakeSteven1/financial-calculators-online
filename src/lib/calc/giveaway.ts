import { isValidEmail } from './email-list';
import { cryptoRng, sampleWithoutReplacement, weightedSampleIndexes, type Rng } from './random';

export const MAX_WINNERS = 50;
export const MAX_ALTERNATES = 50;

export interface CleanOptions {
  /** Drop entries that are not valid email addresses. */
  emailsOnly: boolean;
}

export interface CleanedEntries {
  /** Non-blank entries found in the input, before cleanup. */
  found: number;
  /** Unique entries in first-seen order (trimmed, original casing). */
  entries: string[];
  /** How many times each unique entry appeared (weights for weighted draws). */
  counts: number[];
  /** Repeats of an entry already seen (case-insensitive). */
  duplicates: number;
  /** Entries dropped because they are not valid emails (only when emailsOnly). */
  invalid: number;
  /** First few invalid entries, for display. */
  invalidSamples: string[];
}

/** Removes CSV-style quotes: `"a@b.com"` -> `a@b.com`, `""` -> `"`. */
function unquote(value: string): string {
  return value.length >= 2 && value.startsWith('"') && value.endsWith('"') ? value.slice(1, -1).replaceAll('""', '"') : value;
}

/**
 * Splits pasted or uploaded text into entries: one per line, or separated by
 * commas, semicolons, or tabs. Trims whitespace, drops blanks, and removes
 * duplicates case-insensitively, keeping the first spelling seen.
 */
export function cleanEntries(text: string, { emailsOnly }: CleanOptions): CleanedEntries {
  const index = new Map<string, number>();
  const entries: string[] = [];
  const counts: number[] = [];
  const invalidSamples: string[] = [];
  let found = 0;
  let duplicates = 0;
  let invalid = 0;
  for (const part of text.split(/\r?\n|[,;\t]/)) {
    const entry = unquote(part.trim()).trim();
    if (!entry) continue;
    found++;
    if (emailsOnly && !isValidEmail(entry)) {
      invalid++;
      if (invalidSamples.length < 5) invalidSamples.push(entry);
      continue;
    }
    const key = entry.toLowerCase();
    const i = index.get(key);
    if (i === undefined) {
      index.set(key, entries.length);
      entries.push(entry);
      counts.push(1);
    } else {
      duplicates++;
      counts[i]!++;
    }
  }
  return { found, entries, counts, duplicates, invalid, invalidSamples };
}

export interface DrawResult {
  winners: string[];
  alternates: string[];
}

/**
 * Draws `winners + alternates` distinct entries in one pass, so nobody can be
 * both a winner and an alternate. The first `winners` picks win; the rest are
 * alternates in the order they should be contacted. With `weights`, an entry's
 * chance is proportional to its weight.
 */
export function drawWinners(
  entries: readonly string[],
  winners: number,
  alternates: number,
  weights?: readonly number[],
  rng: Rng = cryptoRng,
): DrawResult {
  const total = winners + alternates;
  const picked = weights
    ? weightedSampleIndexes(weights, total, rng).map((i) => entries[i]!)
    : sampleWithoutReplacement(entries, total, rng);
  return { winners: picked.slice(0, winners), alternates: picked.slice(winners) };
}

/** Clamps a typed count to a whole number in [min, max]; blank or invalid gives `min`. */
export function clampCount(value: string, min: number, max: number): number {
  const n = Math.floor(Number(value));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min;
}

/** Hides most of an entry for public posting: jane@gmail.com -> j***@gmail.com. */
export function maskEntry(entry: string): string {
  const at = entry.lastIndexOf('@');
  if (at > 0) return `${entry[0]}***${entry.slice(at)}`;
  // Social handles (@name) keep the @ and first letter.
  if (at === 0) return entry.length > 1 ? `@${entry[1]}***` : entry;
  return entry.length > 1 ? `${entry[0]}***` : entry;
}

/**
 * Builds RFC 4180 CSV text, quoting fields that need it. Text starting with
 * = + - @ gets a leading apostrophe so spreadsheets don't run it as a formula.
 */
export function toCsv(rows: readonly (readonly (string | number)[])[]): string {
  const field = (v: string | number) => {
    const s = typeof v === 'string' && /^[=+\-@\t\r]/.test(v) ? `'${v}` : String(v);
    return /[",\r\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
  };
  return rows.map((r) => r.map(field).join(',')).join('\r\n') + '\r\n';
}
