export const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

/** US life expectancy at birth, CDC NCHS 2023 final data. */
export const LIFE_EXPECTANCY = { all: 78.4, male: 75.8, female: 81.1 } as const;

/** Parses an <input type="date"> value (YYYY-MM-DD) as local midnight. */
export function parseDateInput(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

export interface TimeLived {
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
  weeks: number;
  months: number;
  years: number;
  /** Exact age in fractional years. */
  ageYears: number;
}

export function timeLived(birth: Date, now: Date): TimeLived | null {
  const ms = now.getTime() - birth.getTime();
  if (!(ms >= 0)) return null;
  const seconds = Math.floor(ms / 1000);
  const days = Math.floor(seconds / 86400);
  return {
    seconds,
    minutes: Math.floor(seconds / 60),
    hours: Math.floor(seconds / 3600),
    days,
    weeks: Math.floor(days / 7),
    months: Math.floor(days / 30.44),
    years: fullYearsBetween(birth, now),
    ageYears: ms / MS_PER_YEAR,
  };
}

/** Whole calendar years between two dates (the everyday meaning of "age"). */
export function fullYearsBetween(from: Date, to: Date): number {
  let years = to.getFullYear() - from.getFullYear();
  const beforeBirthday = to.getMonth() < from.getMonth() || (to.getMonth() === from.getMonth() && to.getDate() < from.getDate());
  if (beforeBirthday) years--;
  return years;
}

export function percentOfLifeExpectancy(ageYears: number, expectancyYears: number): number {
  return (ageYears / expectancyYears) * 100;
}

export interface Milestone {
  label: string;
  seconds: number;
  date: Date;
  reached: boolean;
}

/** Round-number second milestones (1 billion, 2 billion, ...) and when they fall. */
export function secondMilestones(birth: Date, now: Date): Milestone[] {
  const marks: [string, number][] = [
    ['100 million seconds', 1e8],
    ['500 million seconds', 5e8],
    ['1 billion seconds', 1e9],
    ['1.5 billion seconds', 1.5e9],
    ['2 billion seconds', 2e9],
    ['2.5 billion seconds', 2.5e9],
    ['3 billion seconds', 3e9],
  ];
  return marks.map(([label, seconds]) => {
    const date = new Date(birth.getTime() + seconds * 1000);
    return { label, seconds, date, reached: date.getTime() <= now.getTime() };
  });
}

export interface LifeClock {
  /** 0-24 hours elapsed on the "day" of your life. */
  hours24: number;
  minutes: number;
  /** e.g. "3:45 PM" */
  label: string;
  percent: number;
}

/** Maps age onto a 24-hour day: birth is midnight, life expectancy is the next midnight. */
export function lifeClock(ageYears: number, expectancyYears: number): LifeClock {
  const fraction = Math.max(0, ageYears / expectancyYears);
  const totalMinutes = Math.floor(Math.min(fraction, 1) * 24 * 60);
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours24 >= 12 && hours24 < 24 ? 'PM' : 'AM';
  const h12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return { hours24, minutes, label: `${h12}:${String(minutes).padStart(2, '0')} ${period}`, percent: fraction * 100 };
}
