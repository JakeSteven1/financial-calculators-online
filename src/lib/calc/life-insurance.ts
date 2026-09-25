export interface LifeInsuranceInput {
  annualIncome: number;
  /** Years of income to replace. */
  yearsToReplace: number;
  debts: number;
  mortgageBalance: number;
  dependents: number;
  educationPerDependent: number;
  finalExpenses: number;
  existingCoverage: number;
  savings: number;
}

export interface LifeInsuranceResult {
  incomeNeed: number;
  educationNeed: number;
  totalNeeds: number;
  resources: number;
  recommended: number;
}

/** DIME-style needs analysis: debts + income + mortgage + education + final expenses − existing resources. */
export function lifeInsuranceNeed(i: LifeInsuranceInput): LifeInsuranceResult {
  const incomeNeed = i.annualIncome * i.yearsToReplace;
  const educationNeed = i.dependents * i.educationPerDependent;
  const totalNeeds = incomeNeed + i.debts + i.mortgageBalance + educationNeed + i.finalExpenses;
  const resources = i.existingCoverage + i.savings;
  return { incomeNeed, educationNeed, totalNeeds, resources, recommended: Math.max(0, totalNeeds - resources) };
}

/** Suggested years of income replacement: until 65, at least 5 and at most 20. */
export function suggestedYears(age: number): number {
  return Math.min(20, Math.max(5, 65 - age));
}
