import { monthlyPayment } from './loan';

export interface AffordabilityInput {
  annualIncome: number;
  monthlyDebts: number;
  downPayment: number;
  ratePct: number;
  years: number;
  propertyTaxPct: number;
  insuranceYearly: number;
  hoaMonthly: number;
  /** Max housing cost as % of gross monthly income (front-end DTI). */
  frontEndPct: number;
  /** Max housing + other debts as % of gross monthly income (back-end DTI). */
  backEndPct: number;
}

export interface AffordabilityResult {
  maxHomePrice: number;
  loanAmount: number;
  /** Total monthly housing payment (P&I + tax + insurance + HOA) at the max price. */
  monthlyHousing: number;
  principalAndInterest: number;
  limitedBy: 'front-end' | 'back-end';
}

/**
 * Solves f·(P − D) + P·t/12 + c = M for price P, where f is the payment per dollar
 * borrowed, t the property tax rate, c fixed monthly costs, and M the max housing budget.
 */
export function homeAffordability(i: AffordabilityInput): AffordabilityResult | null {
  const monthlyIncome = i.annualIncome / 12;
  const front = (monthlyIncome * i.frontEndPct) / 100;
  const back = (monthlyIncome * i.backEndPct) / 100 - i.monthlyDebts;
  const budget = Math.min(front, back);
  const limitedBy = front <= back ? 'front-end' : 'back-end';
  const months = Math.round(i.years * 12);
  const f = monthlyPayment(1, i.ratePct, months);
  const t = i.propertyTaxPct / 100 / 12;
  const c = i.insuranceYearly / 12 + i.hoaMonthly;
  if (!(budget > c) || !Number.isFinite(f)) return null;
  let price = (budget - c + f * i.downPayment) / (f + t);
  // If the down payment alone covers the price, there is no loan.
  if (price <= i.downPayment) price = (budget - c) / t > 0 ? Math.min(i.downPayment, (budget - c) / t) : i.downPayment;
  const loanAmount = Math.max(0, price - i.downPayment);
  const pi = loanAmount * f;
  return { maxHomePrice: price, loanAmount, monthlyHousing: pi + price * t + c, principalAndInterest: pi, limitedBy };
}
