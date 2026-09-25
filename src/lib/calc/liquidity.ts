export interface LiquidityInput {
  currentAssets: number;
  currentLiabilities: number;
  inventory?: number;
  prepaidExpenses?: number;
  cash?: number;
  marketableSecurities?: number;
  accountsReceivable?: number;
}

/** Current assets ÷ current liabilities. */
export function currentRatio(currentAssets: number, currentLiabilities: number): number {
  return currentLiabilities > 0 ? currentAssets / currentLiabilities : NaN;
}

/** (Current assets − inventory − prepaid expenses) ÷ current liabilities. */
export function quickRatio(currentAssets: number, inventory: number, currentLiabilities: number, prepaidExpenses = 0): number {
  return currentLiabilities > 0 ? (currentAssets - inventory - prepaidExpenses) / currentLiabilities : NaN;
}

/** (Cash + marketable securities + receivables) ÷ current liabilities — quick ratio built from the asset side. */
export function quickRatioFromComponents(cash: number, marketableSecurities: number, accountsReceivable: number, currentLiabilities: number): number {
  return currentLiabilities > 0 ? (cash + marketableSecurities + accountsReceivable) / currentLiabilities : NaN;
}

/** (Cash + marketable securities) ÷ current liabilities. */
export function cashRatio(cash: number, marketableSecurities: number, currentLiabilities: number): number {
  return currentLiabilities > 0 ? (cash + marketableSecurities) / currentLiabilities : NaN;
}

export type RatioHealth = 'weak' | 'adequate' | 'strong';

/** Rule-of-thumb bands; healthy levels vary a lot by industry. */
export function rateRatio(kind: 'current' | 'quick' | 'cash', value: number): RatioHealth | null {
  if (!Number.isFinite(value)) return null;
  const [low, high] = kind === 'current' ? [1, 1.5] : kind === 'quick' ? [0.8, 1] : [0.2, 0.5];
  return value < low ? 'weak' : value < high ? 'adequate' : 'strong';
}

export interface LiquidityResult {
  current: number;
  quick: number;
  cash: number;
  workingCapital: number;
}

export function liquidityRatios(input: LiquidityInput): LiquidityResult {
  const { currentAssets, currentLiabilities, inventory = 0, prepaidExpenses = 0, cash = 0, marketableSecurities = 0 } = input;
  return {
    current: currentRatio(currentAssets, currentLiabilities),
    quick: quickRatio(currentAssets, inventory, currentLiabilities, prepaidExpenses),
    cash: cashRatio(cash, marketableSecurities, currentLiabilities),
    workingCapital: currentAssets - currentLiabilities,
  };
}
