export interface BreakEvenInput {
  fixedCosts: number;
  pricePerUnit: number;
  variableCostPerUnit: number;
  /** Optional profit target; 0 gives the plain break-even point. */
  targetProfit?: number;
}

export interface BreakEvenResult {
  contributionMargin: number;
  /** Contribution margin as a percent of price. */
  contributionMarginRatio: number;
  units: number;
  /** Units rounded up to whole units you actually need to sell. */
  unitsWhole: number;
  revenue: number;
}

/** Units = (fixed costs + target profit) ÷ (price − variable cost). */
export function breakEven({ fixedCosts, pricePerUnit, variableCostPerUnit, targetProfit = 0 }: BreakEvenInput): BreakEvenResult | null {
  const contributionMargin = pricePerUnit - variableCostPerUnit;
  if (!(contributionMargin > 0) || !(pricePerUnit > 0)) return null;
  const units = (fixedCosts + targetProfit) / contributionMargin;
  return {
    contributionMargin,
    contributionMarginRatio: (contributionMargin / pricePerUnit) * 100,
    units,
    unitsWhole: Math.ceil(units - 1e-9),
    revenue: units * pricePerUnit,
  };
}
