import { monthlyPayment } from './loan';

export interface MortgageInput {
  homePrice: number;
  downPayment: number;
  ratePct: number;
  years: number;
  /** Annual property tax in dollars. */
  propertyTaxYearly?: number;
  /** Annual homeowners insurance in dollars. */
  insuranceYearly?: number;
  hoaMonthly?: number;
  /** Annual PMI as a percent of the loan, charged while down payment < 20%. */
  pmiRatePct?: number;
}

export interface MortgageResult {
  loanAmount: number;
  downPaymentPct: number;
  principalAndInterest: number;
  propertyTax: number;
  insurance: number;
  hoa: number;
  pmi: number;
  totalMonthly: number;
  totalInterest: number;
}

export function mortgagePayment(input: MortgageInput): MortgageResult | null {
  const { homePrice, downPayment, ratePct, years, propertyTaxYearly = 0, insuranceYearly = 0, hoaMonthly = 0, pmiRatePct = 0 } = input;
  if (!(homePrice > 0) || downPayment < 0 || downPayment > homePrice || !(years > 0)) return null;
  const loanAmount = homePrice - downPayment;
  const months = Math.round(years * 12);
  const pi = loanAmount > 0 ? monthlyPayment(loanAmount, ratePct, months) : 0;
  const downPaymentPct = (downPayment / homePrice) * 100;
  const pmi = downPaymentPct < 20 ? (loanAmount * pmiRatePct) / 100 / 12 : 0;
  const propertyTax = propertyTaxYearly / 12;
  const insurance = insuranceYearly / 12;
  return {
    loanAmount,
    downPaymentPct,
    principalAndInterest: pi,
    propertyTax,
    insurance,
    hoa: hoaMonthly,
    pmi,
    totalMonthly: pi + propertyTax + insurance + hoaMonthly + pmi,
    totalInterest: pi * months - loanAmount,
  };
}
