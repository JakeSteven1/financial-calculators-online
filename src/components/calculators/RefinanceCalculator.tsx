import { useMemo, useState } from 'react';
import { compareRefinance } from '../../lib/calc/refinance';
import { formatCurrency, formatNumber, parseNumber } from '../../lib/format';
import { CalculatorShell, EmptyResults, NumberField, Results } from '../ui/fields';

interface Props {
  /** Lead with the break-even result instead of monthly savings. */
  focus?: 'savings' | 'breakEven';
}

export function formatMonths(months: number): string {
  if (!Number.isFinite(months)) return 'Never';
  const m = Math.ceil(months);
  const y = Math.floor(m / 12);
  const r = m % 12;
  return y ? `${m} months (${y} yr${y > 1 ? 's' : ''}${r ? ` ${r} mo` : ''})` : `${m} months`;
}

export default function RefinanceCalculator({ focus = 'savings' }: Props) {
  const [v, setV] = useState({ balance: '250000', rate: '7.5', years: '25', newRate: '6', newYears: '25', costs: '5000' });
  const [rollIn, setRollIn] = useState(false);
  const set = (k: keyof typeof v) => (value: string) => setV((s) => ({ ...s, [k]: value }));

  const r = useMemo(() => {
    const n = Object.fromEntries(Object.entries(v).map(([k, s]) => [k, parseNumber(s)])) as Record<keyof typeof v, number>;
    if (!Object.values(n).every(Number.isFinite)) return null;
    return compareRefinance({ balance: n.balance, currentRatePct: n.rate, remainingYears: n.years, newRatePct: n.newRate, newYears: n.newYears, closingCosts: n.costs, rollInCosts: rollIn });
  }, [v, rollIn]);

  const breakEven = r ? { label: 'Break-even point', value: formatMonths(r.breakEvenMonths) } : null;
  const savings = r ? { label: r.monthlySavings >= 0 ? 'Monthly savings' : 'Monthly increase', value: formatCurrency(Math.abs(r.monthlySavings)) } : null;

  return (
    <CalculatorShell
      inputs={
        <>
          <h2 className="text-sm font-semibold text-gray-900">Current loan</h2>
          <NumberField label="Remaining balance" prefix="$" value={v.balance} onChange={set('balance')} min="0" />
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="Current rate" suffix="%" value={v.rate} onChange={set('rate')} min="0" />
            <NumberField label="Years remaining" value={v.years} onChange={set('years')} min="1" />
          </div>
          <h2 className="pt-2 text-sm font-semibold text-gray-900">New loan</h2>
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="New rate" suffix="%" value={v.newRate} onChange={set('newRate')} min="0" />
            <NumberField label="New term" suffix="years" value={v.newYears} onChange={set('newYears')} min="1" />
          </div>
          <NumberField label="Closing costs" prefix="$" value={v.costs} onChange={set('costs')} min="0" />
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={rollIn} onChange={(e) => setRollIn(e.target.checked)} /> Roll closing costs into the new loan
          </label>
        </>
      }
      results={
        r && breakEven && savings ? (
          <Results
            items={[
              { ...(focus === 'breakEven' ? breakEven : savings), primary: true },
              focus === 'breakEven' ? savings : breakEven,
              { label: 'Current payment', value: formatCurrency(r.currentPayment) },
              { label: 'New payment', value: formatCurrency(r.newPayment) },
              { label: 'Remaining cost, current loan', value: formatCurrency(r.currentTotalCost, { whole: true }) },
              { label: 'Total cost, new loan + closing', value: formatCurrency(r.newTotalCost, { whole: true }) },
              { label: r.lifetimeSavings >= 0 ? 'Lifetime savings' : 'Lifetime extra cost', value: formatCurrency(Math.abs(r.lifetimeSavings), { whole: true }) },
            ]}
            note={
              <p>
                {r.monthlySavings <= 0
                  ? 'The new payment is not lower, so the closing costs are never recovered through monthly savings.'
                  : r.lifetimeSavings < 0
                    ? 'Your payment drops, but a longer term means you pay more in total.'
                    : `Refinancing pays off if you keep the loan longer than about ${formatNumber(Math.ceil(r.breakEvenMonths), 0)} months.`}
              </p>
            }
          />
        ) : (
          <EmptyResults />
        )
      }
    />
  );
}
