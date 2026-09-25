export interface GrossMarginResult {
  grossProfit: number;
  /** Percent of revenue. */
  marginPct: number;
  /** Percent of cost. */
  markupPct: number;
}

export function grossMargin(revenue: number, costOfGoods: number): GrossMarginResult {
  const grossProfit = revenue - costOfGoods;
  return {
    grossProfit,
    marginPct: revenue !== 0 ? (grossProfit / revenue) * 100 : NaN,
    markupPct: costOfGoods !== 0 ? (grossProfit / costOfGoods) * 100 : NaN,
  };
}

/** Price that yields the target margin: cost ÷ (1 − margin). */
export function priceForMargin(cost: number, targetMarginPct: number): number {
  return targetMarginPct < 100 ? cost / (1 - targetMarginPct / 100) : NaN;
}
