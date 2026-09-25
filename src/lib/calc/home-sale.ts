export interface HomeSaleInput {
  purchasePrice: number;
  improvements: number;
  desiredProfit: number;
  /** Seller closing costs other than agent commission (title, transfer tax, concessions). */
  closingCosts: number;
  commissionPct: number;
  mortgagePayoff: number;
}

export interface HomeSaleResult {
  /** Minimum selling price to net the desired profit. */
  sellingPrice: number;
  commission: number;
  /** Cash handed to the seller at closing after paying off the mortgage. */
  cashAtClosing: number;
  totalInvested: number;
}

/** Price P such that P − commission% × P − closing costs − purchase − improvements = profit. */
export function homeSellingPrice(i: HomeSaleInput): HomeSaleResult | null {
  const rate = i.commissionPct / 100;
  if (!(rate < 1)) return null;
  const totalInvested = i.purchasePrice + i.improvements;
  const sellingPrice = (totalInvested + i.desiredProfit + i.closingCosts) / (1 - rate);
  const commission = sellingPrice * rate;
  return {
    sellingPrice,
    commission,
    cashAtClosing: sellingPrice - commission - i.closingCosts - i.mortgagePayoff,
    totalInvested,
  };
}
