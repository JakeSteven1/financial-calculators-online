export interface ProfitMarginInput {
  pricePerUnit: number;
  materialCost: number;
  laborCost: number;
  overheadCost: number;
  otherDirectCost: number;
  units: number;
  /** Operating expenses for the period (rent, salaries, marketing). */
  operatingExpenses: number;
  /** Income tax rate in percent applied to positive operating profit. */
  taxRatePct: number;
}

export interface ProfitMarginResult {
  costPerUnit: number;
  grossProfitPerUnit: number;
  grossMarginPct: number;
  markupPct: number;
  revenue: number;
  grossProfit: number;
  operatingProfit: number;
  operatingMarginPct: number;
  netProfit: number;
  netMarginPct: number;
}

export function profitMargin(i: ProfitMarginInput): ProfitMarginResult {
  const costPerUnit = i.materialCost + i.laborCost + i.overheadCost + i.otherDirectCost;
  const grossProfitPerUnit = i.pricePerUnit - costPerUnit;
  const revenue = i.pricePerUnit * i.units;
  const grossProfit = grossProfitPerUnit * i.units;
  const operatingProfit = grossProfit - i.operatingExpenses;
  const tax = operatingProfit > 0 ? (operatingProfit * i.taxRatePct) / 100 : 0;
  const netProfit = operatingProfit - tax;
  const pct = (x: number, base: number) => (base !== 0 ? (x / base) * 100 : NaN);
  return {
    costPerUnit,
    grossProfitPerUnit,
    grossMarginPct: pct(grossProfitPerUnit, i.pricePerUnit),
    markupPct: pct(grossProfitPerUnit, costPerUnit),
    revenue,
    grossProfit,
    operatingProfit,
    operatingMarginPct: pct(operatingProfit, revenue),
    netProfit,
    netMarginPct: pct(netProfit, revenue),
  };
}
