export type ClvMode = 'lifespan' | 'retention';

export interface ClvInput {
  avgPurchaseValue: number;
  purchasesPerYear: number;
  /** Gross margin in percent; 100 gives revenue-based CLV. */
  grossMargin: number;
  mode: ClvMode;
  /** Years a customer stays (lifespan mode). */
  lifespanYears?: number;
  /** Annual retention in percent, < 100 (retention mode). */
  retentionRate?: number;
  /** Annual discount rate in percent; 0 for undiscounted. */
  discountRate?: number;
  /** Optional customer acquisition cost. */
  acquisitionCost?: number;
}

export interface ClvResult {
  annualValue: number;
  expectedLifespanYears: number;
  clv: number;
  /** CLV minus acquisition cost (NaN if no CAC given). */
  netClv: number;
  /** CLV divided by acquisition cost (NaN if no CAC given). */
  clvToCac: number;
}

/**
 * Lifespan mode: value is earned at the start of each year for `lifespanYears`.
 * Retention mode: a customer present in year t stays for year t+1 with probability r,
 * giving an expected lifespan of 1/(1−r) years.
 * Discounting treats the first year as undiscounted (payments at the start of each year).
 */
export function customerLifetimeValue(input: ClvInput): ClvResult | null {
  const { avgPurchaseValue, purchasesPerYear, grossMargin, mode, discountRate = 0, acquisitionCost } = input;
  const annualValue = avgPurchaseValue * purchasesPerYear * (grossMargin / 100);
  const d = discountRate / 100;
  let clv: number;
  let expectedLifespanYears: number;

  if (mode === 'retention') {
    const r = (input.retentionRate ?? NaN) / 100;
    if (!(r >= 0 && r < 1)) return null;
    expectedLifespanYears = 1 / (1 - r);
    // Σ_{t≥0} V·(r/(1+d))^t = V·(1+d)/(1+d−r)
    clv = annualValue * ((1 + d) / (1 + d - r));
  } else {
    const L = input.lifespanYears ?? NaN;
    if (!(L >= 0)) return null;
    expectedLifespanYears = L;
    clv = d === 0 ? annualValue * L : annualValue * (1 + d) * ((1 - Math.pow(1 + d, -L)) / d);
  }

  const hasCac = acquisitionCost !== undefined && Number.isFinite(acquisitionCost) && acquisitionCost > 0;
  return {
    annualValue,
    expectedLifespanYears,
    clv,
    netClv: hasCac ? clv - acquisitionCost : NaN,
    clvToCac: hasCac ? clv / acquisitionCost : NaN,
  };
}
