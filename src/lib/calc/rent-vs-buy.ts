import { monthlyPayment, remainingBalance } from './loan';

export interface RentVsBuyInput {
  years: number;
  monthlyRent: number;
  rentIncreasePct: number;
  rentersInsuranceYearly: number;
  homePrice: number;
  downPaymentPct: number;
  mortgageRatePct: number;
  loanYears: number;
  propertyTaxPct: number;
  homeInsuranceYearly: number;
  maintenancePct: number;
  appreciationPct: number;
  buyingCostsPct: number;
  sellingCostsPct: number;
  /** Return the buyer gives up on the cash used for down payment and closing. */
  investmentReturnPct: number;
}

export interface RentVsBuyYear {
  year: number;
  rentCumulative: number;
  buyCumulative: number;
}

export interface RentVsBuyResult {
  totalRentCost: number;
  /** Everything paid to own, minus the equity you walk away with, plus lost investment returns. */
  totalBuyCost: number;
  homeValueAtEnd: number;
  equityAtEnd: number;
  opportunityCost: number;
  monthlyMortgage: number;
  /** First year in which buying is cheaper, or null. */
  breakEvenYear: number | null;
  timeline: RentVsBuyYear[];
}

/** Net cost of renting vs buying if you sell the home at the end of each year. */
export function rentVsBuy(i: RentVsBuyInput): RentVsBuyResult {
  const loan = i.homePrice * (1 - i.downPaymentPct / 100);
  const loanMonths = Math.round(i.loanYears * 12);
  const pmt = loan > 0 ? monthlyPayment(loan, i.mortgageRatePct, loanMonths) : 0;
  const upfront = i.homePrice * (i.downPaymentPct / 100) + i.homePrice * (i.buyingCostsPct / 100);

  let rentPaid = 0;
  let ownPaid = upfront;
  let rent = i.monthlyRent;
  const timeline: RentVsBuyYear[] = [];
  let last = { totalBuyCost: 0, homeValue: i.homePrice, equity: 0, opportunity: 0 };

  for (let y = 1; y <= i.years; y++) {
    rentPaid += rent * 12 + i.rentersInsuranceYearly;
    rent *= 1 + i.rentIncreasePct / 100;

    const valueStart = i.homePrice * Math.pow(1 + i.appreciationPct / 100, y - 1);
    const monthsPaid = Math.min(12, Math.max(0, loanMonths - (y - 1) * 12));
    ownPaid += pmt * monthsPaid + valueStart * (i.propertyTaxPct / 100 + i.maintenancePct / 100) + i.homeInsuranceYearly;

    const homeValue = i.homePrice * Math.pow(1 + i.appreciationPct / 100, y);
    const balance = loan > 0 ? Math.max(0, remainingBalance(loan, i.mortgageRatePct, loanMonths, Math.min(loanMonths, y * 12))) : 0;
    const equity = homeValue * (1 - i.sellingCostsPct / 100) - balance;
    const opportunity = upfront * (Math.pow(1 + i.investmentReturnPct / 100, y) - 1);
    const buyCost = ownPaid - equity + opportunity;
    timeline.push({ year: y, rentCumulative: rentPaid, buyCumulative: buyCost });
    last = { totalBuyCost: buyCost, homeValue, equity, opportunity };
  }

  const breakEven = timeline.find((t) => t.buyCumulative < t.rentCumulative);
  return {
    totalRentCost: rentPaid,
    totalBuyCost: last.totalBuyCost,
    homeValueAtEnd: last.homeValue,
    equityAtEnd: last.equity,
    opportunityCost: last.opportunity,
    monthlyMortgage: pmt,
    breakEvenYear: breakEven?.year ?? null,
    timeline,
  };
}
