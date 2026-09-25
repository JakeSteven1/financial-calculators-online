export interface TipResult {
  tip: number;
  total: number;
  perPerson: number;
  tipPerPerson: number;
}

/**
 * Tip is calculated on the pre-tax subtotal (bill − tax). With `roundUp`, each person's
 * share is rounded up to the next dollar and the tip absorbs the difference.
 */
export function calculateTip(bill: number, tipPct: number, people = 1, tax = 0, roundUp = false): TipResult | null {
  if (!(bill > 0) || !(people >= 1)) return null;
  const base = Math.max(0, bill - tax);
  let tip = (base * tipPct) / 100;
  let total = bill + tip;
  let perPerson = total / people;
  if (roundUp) {
    perPerson = Math.ceil(perPerson - 1e-9);
    total = perPerson * people;
    tip = total - bill;
  }
  return { tip, total, perPerson, tipPerPerson: tip / people };
}
