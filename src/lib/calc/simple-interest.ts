export interface SimpleInterestResult {
  interest: number;
  total: number;
}

/** I = P × r × t; total = P(1 + rt). Rate in percent per year, time in years. */
export function simpleInterest(principal: number, annualRate: number, years: number): SimpleInterestResult {
  const interest = principal * (annualRate / 100) * years;
  return { interest, total: principal + interest };
}

/** Converts a term expressed in another unit to years. */
export function termInYears(value: number, unit: 'years' | 'months' | 'days'): number {
  if (unit === 'months') return value / 12;
  if (unit === 'days') return value / 365;
  return value;
}
