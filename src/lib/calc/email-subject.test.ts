import { describe, expect, it } from 'vitest';
import { countWords, evaluateSubject } from './email-subject';

describe('evaluateSubject', () => {
  it('grades by word count', () => {
    expect(evaluateSubject('Your weekly guide to smarter money moves').grade).toBe('Excellent');
    expect(evaluateSubject('Six words make a great subject').grade).toBe('Very good');
    expect(evaluateSubject('Hello there').grade).toBe('Too short');
    expect(evaluateSubject('one two three four five six seven eight nine').grade).toBe('Too long');
    expect(evaluateSubject('   ').grade).toBe('N/A');
  });
  it('counts characters and words', () => {
    const r = evaluateSubject('  Big news inside  ');
    expect(r.words).toBe(3);
    expect(countWords('a  b\tc')).toBe(3);
  });
  it('warns about caps, exclamation points, spam words, and length', () => {
    const r = evaluateSubject('GET YOUR FREE GIFT TODAY!!');
    expect(r.warnings.some((w) => w.includes('ALL CAPS'))).toBe(true);
    expect(r.warnings.some((w) => w.includes('exclamation'))).toBe(true);
    expect(r.warnings.some((w) => w.includes('“free”'))).toBe(true);
    expect(evaluateSubject('Freedom awaits you this weekend at the lake house').warnings.some((w) => w.includes('spam'))).toBe(false);
    expect(evaluateSubject('x'.repeat(70)).warnings.some((w) => w.includes('cut off in most inboxes'))).toBe(true);
  });
});
