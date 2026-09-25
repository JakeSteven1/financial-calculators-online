export interface BudgetInput {
  income: number;
  period: 'monthly' | 'annual';
  /** When true, income is before tax and `taxPct` is removed first. */
  preTax: boolean;
  taxPct: number;
  needsPct: number;
  wantsPct: number;
  savingsPct: number;
}

export interface BudgetBucket {
  monthly: number;
  annual: number;
}

export interface BudgetResult {
  monthlyTakeHome: number;
  needs: BudgetBucket;
  wants: BudgetBucket;
  savings: BudgetBucket;
  /** Sum of the three percentages; should be 100. */
  totalPct: number;
}

export function budget503020(i: BudgetInput): BudgetResult {
  const annualGross = i.period === 'annual' ? i.income : i.income * 12;
  const annualTakeHome = i.preTax ? annualGross * (1 - i.taxPct / 100) : annualGross;
  const bucket = (pct: number): BudgetBucket => ({ annual: (annualTakeHome * pct) / 100, monthly: (annualTakeHome * pct) / 100 / 12 });
  return {
    monthlyTakeHome: annualTakeHome / 12,
    needs: bucket(i.needsPct),
    wants: bucket(i.wantsPct),
    savings: bucket(i.savingsPct),
    totalPct: i.needsPct + i.wantsPct + i.savingsPct,
  };
}
