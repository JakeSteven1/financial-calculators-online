export interface AccumulationInput {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  annualContribution: number;
  /** Yearly raise in the contribution, percent. */
  contributionGrowthPct?: number;
  /** Annual return, percent. Use a real (after-inflation) return for today's-dollar projections. */
  returnPct: number;
}

export interface AccumulationYear {
  age: number;
  balance: number;
  totalContributions: number;
  totalGrowth: number;
}

/** Contributions are made at the end of each year, after that year's growth. */
export function projectSavings(i: AccumulationInput): AccumulationYear[] {
  const years = Math.max(0, Math.round(i.retirementAge - i.currentAge));
  const r = i.returnPct / 100;
  const g = (i.contributionGrowthPct ?? 0) / 100;
  let balance = i.currentSavings;
  let contributed = i.currentSavings;
  let contribution = i.annualContribution;
  const rows: AccumulationYear[] = [];
  for (let y = 1; y <= years; y++) {
    balance = balance * (1 + r) + contribution;
    contributed += contribution;
    rows.push({ age: i.currentAge + y, balance, totalContributions: contributed, totalGrowth: balance - contributed });
    contribution *= 1 + g;
  }
  return rows;
}

/** Real (inflation-adjusted) rate from nominal return and inflation, both in percent. */
export function realReturnPct(nominalPct: number, inflationPct: number): number {
  return ((1 + nominalPct / 100) / (1 + inflationPct / 100) - 1) * 100;
}

export interface DrawdownInput {
  startAge: number;
  endAge: number;
  startBalance: number;
  /** Spending needed each year (constant, in the same dollars as the balance). */
  annualSpending: number;
  /** Other income each year, such as Social Security or a pension. */
  otherIncome: number;
  /** Tax rate on withdrawals, percent. */
  taxPct: number;
  returnPct: number;
}

export interface DrawdownResult {
  /** Gross yearly withdrawal needed from savings (grossed up for tax). */
  annualWithdrawal: number;
  /** Age at which savings run out, or null if they last to endAge. */
  depletedAge: number | null;
  endingBalance: number;
  balances: { age: number; balance: number }[];
}

/** Withdrawals are taken at the start of each year; the rest grows for the year. */
export function drawdown(i: DrawdownInput): DrawdownResult {
  const need = Math.max(0, i.annualSpending - i.otherIncome);
  const annualWithdrawal = i.taxPct < 100 ? need / (1 - i.taxPct / 100) : Infinity;
  const r = i.returnPct / 100;
  let balance = i.startBalance;
  let depletedAge: number | null = null;
  const balances: { age: number; balance: number }[] = [];
  for (let age = i.startAge; age < i.endAge; age++) {
    if (balance < annualWithdrawal) {
      depletedAge = age;
      balance = 0;
      balances.push({ age, balance });
      break;
    }
    balance = (balance - annualWithdrawal) * (1 + r);
    balances.push({ age: age + 1, balance });
  }
  return { annualWithdrawal, depletedAge, endingBalance: balance, balances };
}

/** Sustainable first-year income at a withdrawal rate (e.g. the 4% rule). */
export const safeWithdrawal = (balance: number, ratePct = 4) => (balance * ratePct) / 100;
