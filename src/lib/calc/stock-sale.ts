export interface StockSaleInput {
  shares: number;
  buyPrice: number;
  sellPrice: number;
  /** Total commissions and fees for the buy and sell. */
  fees: number;
  /** Capital gains tax rate in percent (applied to gains only). */
  taxRatePct: number;
}

export interface StockSaleResult {
  proceeds: number;
  costBasis: number;
  gain: number;
  returnPct: number;
  tax: number;
  netAfterTax: number;
}

export function stockSale(i: StockSaleInput): StockSaleResult {
  const proceeds = i.shares * i.sellPrice;
  const costBasis = i.shares * i.buyPrice + i.fees;
  const gain = proceeds - costBasis;
  const tax = gain > 0 ? (gain * i.taxRatePct) / 100 : 0;
  return { proceeds, costBasis, gain, returnPct: costBasis > 0 ? (gain / costBasis) * 100 : NaN, tax, netAfterTax: gain - tax };
}
