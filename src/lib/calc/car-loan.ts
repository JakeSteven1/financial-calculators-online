import { monthlyPayment } from './loan';

export interface CarLoanInput {
  price: number;
  downPayment: number;
  tradeInValue: number;
  /** Amount still owed on the trade-in; rolled into the new loan. */
  tradeInOwed: number;
  salesTaxPct: number;
  /** Title, registration, and dealer fees (financed). */
  fees: number;
  ratePct: number;
  months: number;
}

export interface CarLoanResult {
  salesTax: number;
  loanAmount: number;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
}

/**
 * Sales tax is charged on price minus trade-in value, as in most US states.
 * Negative equity on the trade-in is added to the loan.
 */
export function carLoan(i: CarLoanInput): CarLoanResult | null {
  if (!(i.months > 0)) return null;
  const taxable = Math.max(0, i.price - i.tradeInValue);
  const salesTax = (taxable * i.salesTaxPct) / 100;
  const loanAmount = Math.max(0, i.price + salesTax + i.fees - i.downPayment - (i.tradeInValue - i.tradeInOwed));
  const pmt = loanAmount > 0 ? monthlyPayment(loanAmount, i.ratePct, i.months) : 0;
  const totalInterest = pmt * i.months - loanAmount;
  return { salesTax, loanAmount, monthlyPayment: pmt, totalInterest, totalCost: i.price + salesTax + i.fees + totalInterest };
}
