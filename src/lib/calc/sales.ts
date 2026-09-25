// Solves the sales triangle: cost, revenue, gross profit, gross margin, markup.
// Any two values (except margin + markup, which don't fix a dollar amount) determine the rest.

export type SalesField = 'cost' | 'revenue' | 'profit' | 'margin' | 'markup';

export interface SalesFigures {
  cost: number;
  revenue: number;
  profit: number;
  /** Percent of revenue. */
  margin: number;
  /** Percent of cost. */
  markup: number;
}

export type SalesResult = { ok: true; figures: SalesFigures; usedFields: [SalesField, SalesField] } | { ok: false; error: string };

export const SALES_FIELD_ORDER: SalesField[] = ['cost', 'revenue', 'profit', 'margin', 'markup'];

function fromCostRevenue(cost: number, revenue: number): SalesFigures {
  const profit = revenue - cost;
  return {
    cost,
    revenue,
    profit,
    margin: revenue === 0 ? NaN : (profit / revenue) * 100,
    markup: cost === 0 ? NaN : (profit / cost) * 100,
  };
}

/** Uses the first two provided fields in SALES_FIELD_ORDER. Percent inputs are in percent units. */
export function solveSales(known: Partial<Record<SalesField, number>>): SalesResult {
  const provided = SALES_FIELD_ORDER.filter((f) => Number.isFinite(known[f]));
  if (provided.length < 2) return { ok: false, error: 'Enter any two values.' };
  const [a, b] = provided as [SalesField, SalesField];
  const v = (f: SalesField) => known[f]!;
  const m = () => v('margin') / 100;
  const k = () => v('markup') / 100;
  const key = `${a}+${b}`;

  let cost: number;
  let revenue: number;
  switch (key) {
    case 'cost+revenue': cost = v('cost'); revenue = v('revenue'); break;
    case 'cost+profit': cost = v('cost'); revenue = cost + v('profit'); break;
    case 'cost+margin': cost = v('cost'); revenue = cost / (1 - m()); break;
    case 'cost+markup': cost = v('cost'); revenue = cost * (1 + k()); break;
    case 'revenue+profit': revenue = v('revenue'); cost = revenue - v('profit'); break;
    case 'revenue+margin': revenue = v('revenue'); cost = revenue * (1 - m()); break;
    case 'revenue+markup': revenue = v('revenue'); cost = revenue / (1 + k()); break;
    case 'profit+margin': revenue = v('profit') / m(); cost = revenue - v('profit'); break;
    case 'profit+markup': cost = v('profit') / k(); revenue = cost + v('profit'); break;
    default: return { ok: false, error: 'Margin and markup alone cannot set a price. Add a dollar amount.' };
  }
  if (!Number.isFinite(cost) || !Number.isFinite(revenue)) return { ok: false, error: 'These values have no solution (for example, a 100% margin).' };
  return { ok: true, figures: fromCostRevenue(cost, revenue), usedFields: [a, b] };
}

/** Converts between margin and markup (both in percent). */
export const marginToMarkup = (margin: number) => (margin / (100 - margin)) * 100;
export const markupToMargin = (markup: number) => (markup / (100 + markup)) * 100;
