export interface EmailListAnalysis {
  /** Non-empty entries found in the input. */
  total: number;
  /** Unique valid emails, in first-seen order (lowercased). */
  unique: string[];
  /** Entry count per unique valid email (for weighted draws). */
  counts: Map<string, number>;
  duplicates: number;
  invalid: string[];
}

const EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value);
}

/** Splits on newlines, commas, semicolons, and whitespace; dedupes case-insensitively. */
export function analyzeEmailList(text: string): EmailListAnalysis {
  const entries = text.split(/[\s,;]+/).map((e) => e.trim()).filter(Boolean);
  const counts = new Map<string, number>();
  const invalid: string[] = [];
  let duplicates = 0;
  for (const entry of entries) {
    if (!isValidEmail(entry)) {
      invalid.push(entry);
      continue;
    }
    const key = entry.toLowerCase();
    const seen = counts.get(key) ?? 0;
    if (seen > 0) duplicates++;
    counts.set(key, seen + 1);
  }
  return { total: entries.length, unique: [...counts.keys()], counts, duplicates, invalid };
}
