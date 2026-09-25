export interface PayBreakdown {
  hourly: number;
  daily: number;
  weekly: number;
  biweekly: number;
  monthly: number;
  yearly: number;
}

/** Converts an hourly wage to every pay period. `weeksPerYear` excludes unpaid weeks off. */
export function fromHourly(hourly: number, hoursPerWeek: number, weeksPerYear = 52, daysPerWeek = 5): PayBreakdown {
  const weekly = hourly * hoursPerWeek;
  const yearly = weekly * weeksPerYear;
  return { hourly, daily: weekly / daysPerWeek, weekly, biweekly: weekly * 2, monthly: yearly / 12, yearly };
}

export function fromYearly(yearly: number, hoursPerWeek: number, weeksPerYear = 52, daysPerWeek = 5): PayBreakdown {
  const weekly = yearly / weeksPerYear;
  return { hourly: weekly / hoursPerWeek, daily: weekly / daysPerWeek, weekly, biweekly: weekly * 2, monthly: yearly / 12, yearly };
}

export interface DailyWage {
  /** Salary ÷ paid working days (workdays minus unpaid days). */
  perWorkday: number;
  /** Salary ÷ 365. */
  perCalendarDay: number;
  perHour: number;
  workdays: number;
}

/**
 * Paid holidays and vacation don't reduce pay, so the per-workday rate divides by all
 * scheduled workdays; `unpaidDaysOff` are removed from both the days and the salary base.
 */
export function salaryToDaily(yearly: number, daysPerWeek = 5, hoursPerDay = 8, unpaidDaysOff = 0): DailyWage {
  const workdays = 52 * daysPerWeek - unpaidDaysOff;
  const perWorkday = workdays > 0 ? yearly / workdays : NaN;
  return { perWorkday, perCalendarDay: yearly / 365, perHour: perWorkday / hoursPerDay, workdays };
}
