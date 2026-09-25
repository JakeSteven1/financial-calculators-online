import { describe, expect, it } from 'vitest';
import { textStats } from './text-stats';

describe('textStats', () => {
  it('counts characters, words, and sentences', () => {
    const s = textStats('Hello world. How are you today?\n\nFine, thanks!');
    expect(s.characters).toBe(46);
    expect(s.words).toBe(8);
    expect(s.sentences).toBe(3);
    expect(s.paragraphs).toBe(2);
    expect(s.charactersNoSpaces).toBe(38);
  });
  it('counts unique words case-insensitively without punctuation', () => {
    expect(textStats('The cat. the CAT, the dog').uniqueWords).toBe(3);
  });
  it('estimates tokens and complexity', () => {
    const s = textStats('a bb ccccc dddddddd');
    expect(s.estimatedTokens).toBe(5);
    expect(s.complexity).toEqual({ simple: 2, moderate: 1, complex: 1, score: 2 + 2 + 3 });
  });
  it('handles empty text', () => {
    const s = textStats('');
    expect([s.characters, s.words, s.sentences, s.paragraphs]).toEqual([0, 0, 0, 0]);
  });
  it('counts emoji as one character', () => {
    expect(textStats('hi 👋').characters).toBe(4);
  });
});
