import { monthlyPayment } from './loan';

export interface ClosingCostItem {
  key: string;
  label: string;
  amount: number;
}

export interface ClosingCostInput {
  homePrice: number;
  downPaymentPct: number;
  ratePct: number;
  propertyTaxPct: number;
  insuranceYearly: number;
  originationPct: number;
  titleInsurancePct: number;
  transferTaxPct: number;
  appraisal: number;
  inspection: number;
  settlementFee: number;
  recordingFees: number;
  /** Months of property tax collected for escrow at closing. */
  taxEscrowMonths: number;
  /** Days of interest prepaid from closing to the end of the month. */
  prepaidInterestDays: number;
}

export interface ClosingCostResult {
  loanAmount: number;
  downPayment: number;
  items: ClosingCostItem[];
  total: number;
  totalPctOfPrice: number;
  cashToClose: number;
  /** Typical 2%–5% range for comparison. */
  typicalLow: number;
  typicalHigh: number;
  monthlyPayment: number;
}

export function estimateClosingCosts(i: ClosingCostInput): ClosingCostResult {
  const downPayment = (i.homePrice * i.downPaymentPct) / 100;
  const loanAmount = i.homePrice - downPayment;
  const items: ClosingCostItem[] = [
    { key: 'origination', label: 'Loan origination fee', amount: (loanAmount * i.originationPct) / 100 },
    { key: 'appraisal', label: 'Appraisal', amount: loanAmount > 0 ? i.appraisal : 0 },
    { key: 'inspection', label: 'Home inspection', amount: i.inspection },
    { key: 'title', label: 'Title insurance and search', amount: (i.homePrice * i.titleInsurancePct) / 100 },
    { key: 'settlement', label: 'Escrow / settlement fee', amount: i.settlementFee },
    { key: 'recording', label: 'Recording fees', amount: i.recordingFees },
    { key: 'transfer', label: 'Transfer taxes (buyer share)', amount: (i.homePrice * i.transferTaxPct) / 100 },
    { key: 'insurance', label: 'Prepaid homeowners insurance (12 months)', amount: i.insuranceYearly },
    { key: 'taxEscrow', label: `Property tax escrow (${i.taxEscrowMonths} months)`, amount: ((i.homePrice * i.propertyTaxPct) / 100 / 12) * i.taxEscrowMonths },
    { key: 'interest', label: `Prepaid interest (${i.prepaidInterestDays} days)`, amount: ((loanAmount * i.ratePct) / 100 / 365) * i.prepaidInterestDays },
  ];
  const total = items.reduce((s, it) => s + it.amount, 0);
  return {
    loanAmount,
    downPayment,
    items,
    total,
    totalPctOfPrice: i.homePrice > 0 ? (total / i.homePrice) * 100 : NaN,
    cashToClose: downPayment + total,
    typicalLow: loanAmount * 0.02,
    typicalHigh: loanAmount * 0.05,
    monthlyPayment: loanAmount > 0 ? monthlyPayment(loanAmount, i.ratePct, 360) : 0,
  };
}
