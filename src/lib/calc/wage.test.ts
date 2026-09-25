import { describe, expect, it } from 'vitest';
import { fromHourly, fromYearly, salaryToDaily } from './wage';

describe('wage conversions', () => {
  it('hourly to yearly', () => {
    const p = fromHourly(7.25, 40);
    expect(p.yearly).toBe(15080);
    expect(p.weekly).toBe(290);
    expect(p.daily).toBe(58);
    expect(p.monthly).toBeCloseTo(1256.67, 2);
  });
  it('yearly to hourly round-trips', () => {
    expect(fromYearly(fromHourly(25, 40, 50).yearly, 40, 50).hourly).toBeCloseTo(25, 10);
    expect(fromYearly(52000, 40).hourly).toBe(25);
  });
  it('salary to daily wage', () => {
    const d = salaryToDaily(65000);
    expect(d.workdays).toBe(260);
    expect(d.perWorkday).toBe(250);
    expect(d.perCalendarDay).toBeCloseTo(178.08, 2);
    expect(d.perHour).toBe(31.25);
    expect(salaryToDaily(50000, 5, 8, 10).workdays).toBe(250);
  });
});
