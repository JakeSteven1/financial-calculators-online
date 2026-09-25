export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  uniqueWords: number;
  sentences: number;
  paragraphs: number;
  /** Minutes at 238 words per minute (average adult silent reading speed). */
  readingMinutes: number;
  /** Rough token estimate for large language models: about 4 characters per token in English. */
  estimatedTokens: number;
  /** Words by length: ≤4 simple, 5–7 moderate, ≥8 complex (from the original tool). */
  complexity: { simple: number; moderate: number; complex: number; score: number };
}

const wordList = (text: string) => text.split(/\s+/).filter(Boolean);

export function textStats(text: string): TextStats {
  const words = wordList(text);
  const unique = new Set(words.map((w) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')).filter(Boolean));
  const chars = [...text];
  let simple = 0;
  let moderate = 0;
  let complex = 0;
  for (const w of words) {
    const len = [...w.replace(/[^\p{L}\p{N}]/gu, '')].length;
    if (len <= 4) simple++;
    else if (len <= 7) moderate++;
    else complex++;
  }
  return {
    characters: chars.length,
    charactersNoSpaces: chars.filter((c) => !/\s/.test(c)).length,
    words: words.length,
    uniqueWords: unique.size,
    sentences: (text.match(/[^.!?]*[\p{L}\p{N}][^.!?]*(?:[.!?]+|$)/gu) ?? []).length,
    paragraphs: text.split(/\n\s*\n/).filter((p) => p.trim()).length,
    readingMinutes: words.length / 238,
    estimatedTokens: Math.ceil(chars.length / 4),
    complexity: { simple, moderate, complex, score: simple + moderate * 2 + complex * 3 },
  };
}

export interface CharacterLimit {
  label: string;
  limit: number;
}

export const COMMON_LIMITS: CharacterLimit[] = [
  { label: 'Email subject line', limit: 60 },
  { label: 'Page title (SEO)', limit: 60 },
  { label: 'Meta description', limit: 160 },
  { label: 'Image caption', limit: 125 },
  { label: 'SMS message', limit: 160 },
  { label: 'X (Twitter) post', limit: 280 },
];
