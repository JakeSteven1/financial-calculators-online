/** Net worth as a percent of total lifetime earnings. */
export function lifetimeWealthRatio(assets: number, liabilities: number, lifetimeIncome: number): number {
  return lifetimeIncome > 0 ? ((assets - liabilities) / lifetimeIncome) * 100 : NaN;
}

/** "The Millionaire Next Door" expected net worth: age × pretax income ÷ 10 (excluding inheritances). */
export function expectedNetWorth(age: number, annualIncome: number): number {
  return (age * annualIncome) / 10;
}

export type WealthClass = 'PAW' | 'AAW' | 'UAW';

/** Prodigious (≥ 2× expected), average, or under accumulator of wealth (≤ ½ expected). */
export function classifyWealth(netWorth: number, expected: number): WealthClass | null {
  if (!(expected > 0)) return null;
  if (netWorth >= 2 * expected) return 'PAW';
  if (netWorth <= expected / 2) return 'UAW';
  return 'AAW';
}
