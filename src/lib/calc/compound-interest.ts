export interface CompoundInterestInput {
  principal: number;
  /** Nominal annual rate in percent (5 = 5%). */
  annualRate: number;
  years: number;
  /** Compounding periods per year (1, 4, 12, 365...). */
  compoundsPerYear: number;
  /** Deposit added at the end of every month. */
  monthlyContribution?: number;
}

export interface CompoundYear {
  year: number;
  balance: number;
  totalContributions: number;
  totalInterest: number;
}

export interface CompoundInterestResult {
  finalBalance: number;
  totalContributions: number;
  totalInterest: number;
  schedule: CompoundYear[];
}

/** A = P(1 + r/n)^(nt) — the classic closed form, no contributions. */
export function futureValue(principal: number, annualRate: number, years: number, compoundsPerYear: number): number {
  const r = annualRate / 100;
  return principal * Math.pow(1 + r / compoundsPerYear, compoundsPerYear * years);
}

/**
 * Month-by-month projection. Growth uses the monthly rate equivalent to the
 * chosen compounding frequency, so with no contributions the result matches
 * A = P(1 + r/n)^(nt) exactly.
 */
export function compoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  const { principal, annualRate, years, compoundsPerYear, monthlyContribution = 0 } = input;
  const r = annualRate / 100;
  const monthlyGrowth = Math.pow(1 + r / compoundsPerYear, compoundsPerYear / 12);
  const months = Math.round(years * 12);

  let balance = principal;
  let contributions = principal;
  const schedule: CompoundYear[] = [];
  for (let m = 1; m <= months; m++) {
    balance = balance * monthlyGrowth + monthlyContribution;
    contributions += monthlyContribution;
    if (m % 12 === 0 || m === months) {
      schedule.push({
        year: Math.ceil(m / 12),
        balance,
        totalContributions: contributions,
        totalInterest: balance - contributions,
      });
    }
  }
  return { finalBalance: balance, totalContributions: contributions, totalInterest: balance - contributions, schedule };
}
