export interface CacInput {
  marketingSpend: number;
  salesSpend: number;
  otherCosts: number;
  newCustomers: number;
  /** Optional: monthly revenue per customer and gross margin for payback period. */
  monthlyRevenuePerCustomer?: number;
  grossMarginPct?: number;
  /** Optional: customer lifetime value for the LTV:CAC ratio. */
  lifetimeValue?: number;
}

export interface CacResult {
  totalSpend: number;
  cac: number;
  /** Months of gross profit needed to recoup CAC. */
  paybackMonths: number;
  ltvToCac: number;
}

export function customerAcquisitionCost(i: CacInput): CacResult | null {
  if (!(i.newCustomers > 0)) return null;
  const totalSpend = i.marketingSpend + i.salesSpend + i.otherCosts;
  const cac = totalSpend / i.newCustomers;
  const monthlyProfit = (i.monthlyRevenuePerCustomer ?? 0) * ((i.grossMarginPct ?? 100) / 100);
  return {
    totalSpend,
    cac,
    paybackMonths: monthlyProfit > 0 ? cac / monthlyProfit : NaN,
    ltvToCac: i.lifetimeValue && cac > 0 ? i.lifetimeValue / cac : NaN,
  };
}
