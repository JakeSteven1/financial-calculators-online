export interface HomeEquityResult {
  equity: number;
  equityPct: number;
  /** Loan-to-value of the first mortgage, percent. */
  ltv: number;
  /** Combined loan-to-value of all liens, percent. */
  cltv: number;
  /** Additional amount a lender might lend up to the max CLTV. */
  borrowable: number;
}

export function homeEquity(homeValue: number, mortgageBalance: number, otherLiens: number, maxCltvPct: number): HomeEquityResult | null {
  if (!(homeValue > 0)) return null;
  const debt = mortgageBalance + otherLiens;
  const equity = homeValue - debt;
  return {
    equity,
    equityPct: (equity / homeValue) * 100,
    ltv: (mortgageBalance / homeValue) * 100,
    cltv: (debt / homeValue) * 100,
    borrowable: Math.max(0, (homeValue * maxCltvPct) / 100 - debt),
  };
}
