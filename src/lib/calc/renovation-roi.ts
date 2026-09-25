export interface RenovationRoiResult {
  netGain: number;
  roiPct: number;
  /** Share of the cost recovered in added value. */
  costRecoveredPct: number;
}

export function renovationRoi(cost: number, valueIncrease: number): RenovationRoiResult | null {
  if (!(cost > 0)) return null;
  const netGain = valueIncrease - cost;
  return { netGain, roiPct: (netGain / cost) * 100, costRecoveredPct: (valueIncrease / cost) * 100 };
}
