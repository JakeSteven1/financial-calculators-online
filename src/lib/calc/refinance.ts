import { monthlyPayment } from './loan';

export interface RefinanceInput {
  balance: number;
  currentRatePct: number;
  remainingYears: number;
  newRatePct: number;
  newYears: number;
  closingCosts: number;
  /** Add closing costs to the new loan instead of paying them up front. */
  rollInCosts?: boolean;
}

export interface RefinanceResult {
  currentPayment: number;
  newPayment: number;
  newLoanAmount: number;
  monthlySavings: number;
  /** Months of savings needed to recover closing costs; Infinity if the payment doesn't drop. */
  breakEvenMonths: number;
  currentTotalCost: number;
  /** All new-loan payments plus any closing costs paid up front. */
  newTotalCost: number;
  lifetimeSavings: number;
}

export function compareRefinance(i: RefinanceInput): RefinanceResult | null {
  if (!(i.balance > 0) || !(i.remainingYears > 0) || !(i.newYears > 0)) return null;
  const currentMonths = Math.round(i.remainingYears * 12);
  const newMonths = Math.round(i.newYears * 12);
  const currentPayment = monthlyPayment(i.balance, i.currentRatePct, currentMonths);
  const newLoanAmount = i.balance + (i.rollInCosts ? i.closingCosts : 0);
  const newPayment = monthlyPayment(newLoanAmount, i.newRatePct, newMonths);
  const monthlySavings = currentPayment - newPayment;
  const currentTotalCost = currentPayment * currentMonths;
  const newTotalCost = newPayment * newMonths + (i.rollInCosts ? 0 : i.closingCosts);
  return {
    currentPayment,
    newPayment,
    newLoanAmount,
    monthlySavings,
    breakEvenMonths: monthlySavings > 0 ? i.closingCosts / monthlySavings : Infinity,
    currentTotalCost,
    newTotalCost,
    lifetimeSavings: currentTotalCost - newTotalCost,
  };
}
