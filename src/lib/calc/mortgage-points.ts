import { monthlyPayment } from './loan';

export interface PointsInput {
  loanAmount: number;
  baseRatePct: number;
  points: number;
  /** Rate after buying the points. */
  reducedRatePct: number;
  years: number;
  /** How long you expect to keep the loan. */
  holdYears: number;
}

export interface PointsResult {
  pointsCost: number;
  basePayment: number;
  reducedPayment: number;
  monthlySavings: number;
  breakEvenMonths: number;
  /** Payment savings over the holding period minus the cost of the points. */
  netSavings: number;
}

/** One point costs 1% of the loan amount. */
export function mortgagePoints(i: PointsInput): PointsResult | null {
  if (!(i.loanAmount > 0) || !(i.years > 0)) return null;
  const months = Math.round(i.years * 12);
  const pointsCost = (i.loanAmount * i.points) / 100;
  const basePayment = monthlyPayment(i.loanAmount, i.baseRatePct, months);
  const reducedPayment = monthlyPayment(i.loanAmount, i.reducedRatePct, months);
  const monthlySavings = basePayment - reducedPayment;
  const heldMonths = Math.min(months, Math.round(i.holdYears * 12));
  return {
    pointsCost,
    basePayment,
    reducedPayment,
    monthlySavings,
    breakEvenMonths: monthlySavings > 0 ? pointsCost / monthlySavings : Infinity,
    netSavings: monthlySavings * heldMonths - pointsCost,
  };
}
