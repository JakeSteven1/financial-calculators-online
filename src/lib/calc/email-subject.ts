export type SubjectGrade = 'Excellent' | 'Very good' | 'Good' | 'Fair' | 'Too long' | 'Too short' | 'N/A';

export interface SubjectEvaluation {
  characters: number;
  words: number;
  grade: SubjectGrade;
  /** 0-100 for the meter. */
  score: number;
  feedback: string;
  warnings: string[];
}

/** Characters most mobile inboxes show before truncating. */
export const MOBILE_VISIBLE_CHARS = 40;
/** Characters most desktop inboxes show. */
export const DESKTOP_VISIBLE_CHARS = 60;

const SPAM_TRIGGERS = ['free', 'act now', 'urgent', 'guarantee', 'winner', 'cash', '100%', 'risk-free', 'click here', 'limited time'];

// Word-count bands follow the original tool: 6-7 words tends to perform best.
const BANDS: { test: (w: number) => boolean; grade: SubjectGrade; score: number; feedback: string }[] = [
  { test: (w) => w === 7, grade: 'Excellent', score: 100, feedback: 'Perfect length. Seven-word subject lines tend to get the highest open rates.' },
  { test: (w) => w === 6, grade: 'Very good', score: 90, feedback: 'Great length. Six-word subject lines perform well across industries.' },
  { test: (w) => w === 5, grade: 'Good', score: 80, feedback: 'Good length. One or two more words could lift open rates.' },
  { test: (w) => w === 4, grade: 'Good', score: 75, feedback: 'Good, but consider adding two or three words for more context.' },
  { test: (w) => w === 8, grade: 'Fair', score: 60, feedback: 'Slightly long. Try trimming a word.' },
  { test: (w) => w >= 9, grade: 'Too long', score: 40, feedback: 'Too long. Most effective subject lines are seven words or fewer.' },
  { test: (w) => w >= 1 && w <= 3, grade: 'Too short', score: 50, feedback: 'Very short. Aim for six or seven words to give readers a reason to open.' },
];

export function countWords(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

export function evaluateSubject(subject: string): SubjectEvaluation {
  const characters = [...subject].length;
  const words = countWords(subject);
  const band = BANDS.find((b) => b.test(words));
  const warnings: string[] = [];
  if (words > 0) {
    const letters = subject.replace(/[^a-z]/gi, '');
    if (letters.length > 10 && letters === letters.toUpperCase()) warnings.push('ALL CAPS reads as shouting and can trigger spam filters.');
    if ((subject.match(/!/g) ?? []).length > 1) warnings.push('Multiple exclamation points hurt credibility and deliverability.');
    const lower = subject.toLowerCase();
    const triggers = SPAM_TRIGGERS.filter((w) => new RegExp(`(^|[^a-z])${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z]|$)`).test(lower));
    if (triggers.length) warnings.push(`Possible spam trigger words: ${triggers.map((t) => `“${t}”`).join(', ')}.`);
    if (characters > DESKTOP_VISIBLE_CHARS) warnings.push(`At ${characters} characters, this will be cut off in most inboxes (about ${DESKTOP_VISIBLE_CHARS} show on desktop).`);
    else if (characters > MOBILE_VISIBLE_CHARS) warnings.push(`Phones typically show about ${MOBILE_VISIBLE_CHARS} characters, so the end may be cut off on mobile.`);
  }
  return {
    characters,
    words,
    grade: band?.grade ?? 'N/A',
    score: band?.score ?? 0,
    feedback: band?.feedback ?? 'Type a subject line to get feedback.',
    warnings,
  };
}
