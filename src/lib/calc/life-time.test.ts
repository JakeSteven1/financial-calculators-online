import { describe, expect, it } from 'vitest';
import { fullYearsBetween, lifeClock, parseDateInput, percentOfLifeExpectancy, secondMilestones, timeLived } from './life-time';

describe('parseDateInput', () => {
  it('parses YYYY-MM-DD as a local date', () => {
    const d = parseDateInput('1990-06-15')!;
    expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([1990, 5, 15]);
    expect(parseDateInput('')).toBeNull();
  });
});

describe('timeLived', () => {
  it('counts units since birth', () => {
    const birth = new Date(2000, 0, 1);
    const now = new Date(2000, 0, 11); // 10 days later
    const t = timeLived(birth, now)!;
    expect(t.days).toBe(10);
    expect(t.hours).toBe(240);
    expect(t.seconds).toBe(864000);
    expect(t.weeks).toBe(1);
  });
  it('returns null for future birthdates', () => {
    expect(timeLived(new Date(2030, 0, 1), new Date(2020, 0, 1))).toBeNull();
  });
});

describe('fullYearsBetween', () => {
  it('only counts completed birthdays', () => {
    expect(fullYearsBetween(new Date(1990, 5, 15), new Date(2020, 5, 14))).toBe(29);
    expect(fullYearsBetween(new Date(1990, 5, 15), new Date(2020, 5, 15))).toBe(30);
  });
});

describe('lifeClock', () => {
  it('maps half of life expectancy to noon', () => {
    expect(lifeClock(40, 80).label).toBe('12:00 PM');
  });
  it('maps a quarter to 6 AM and three quarters to 6 PM', () => {
    expect(lifeClock(20, 80).label).toBe('6:00 AM');
    expect(lifeClock(60, 80).label).toBe('6:00 PM');
  });
  it('starts at midnight and caps at the end of the day', () => {
    expect(lifeClock(0, 80).label).toBe('12:00 AM');
    expect(lifeClock(100, 80).hours24).toBe(24);
  });
});

describe('milestones', () => {
  it('places 1 billion seconds about 31.7 years after birth', () => {
    const birth = new Date(Date.UTC(2000, 0, 1));
    const m = secondMilestones(birth, new Date(Date.UTC(2020, 0, 1))).find((x) => x.seconds === 1e9)!;
    expect(m.date.getUTCFullYear()).toBe(2031);
    expect(m.reached).toBe(false);
    expect(percentOfLifeExpectancy(39.2, 78.4)).toBeCloseTo(50);
  });
});
