export interface RoiResult {
  gain: number;
  roiPct: number;
  /** Compound annual growth rate in percent; NaN without a holding period. */
  annualizedPct: number;
}

/** ROI = (final − initial) ÷ initial. Annualized ROI = (final ÷ initial)^(1/years) − 1. */
export function returnOnInvestment(initial: number, final: number, years?: number): RoiResult | null {
  if (!(initial > 0)) return null;
  const gain = final - initial;
  const annualizedPct = years && years > 0 && final >= 0 ? (Math.pow(final / initial, 1 / years) - 1) * 100 : NaN;
  return { gain, roiPct: (gain / initial) * 100, annualizedPct };
}
