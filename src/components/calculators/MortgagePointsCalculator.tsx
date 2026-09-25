import { useMemo, useState } from 'react';
import { mortgagePoints } from '../../lib/calc/mortgage-points';
import { formatCurrency, parseNumber } from '../../lib/format';
import { CalculatorShell, EmptyResults, NumberField, Results, SelectField } from '../ui/fields';
import { formatMonths } from './RefinanceCalculator';

export default function MortgagePointsCalculator() {
  const [v, setV] = useState({ loan: '300000', rate: '7', points: '2', newRate: '6.5', years: '30', hold: '10' });
  const set = (k: keyof typeof v) => (value: string) => setV((s) => ({ ...s, [k]: value }));

  const r = useMemo(() => {
    const n = Object.fromEntries(Object.entries(v).map(([k, s]) => [k, parseNumber(s)])) as Record<keyof typeof v, number>;
    if (!Object.values(n).every(Number.isFinite)) return null;
    return mortgagePoints({ loanAmount: n.loan, baseRatePct: n.rate, points: n.points, reducedRatePct: n.newRate, years: n.years, holdYears: n.hold });
  }, [v]);

  return (
    <CalculatorShell
      inputs={
        <>
          <NumberField label="Loan amount" prefix="$" value={v.loan} onChange={set('loan')} min="0" />
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="Rate without points" suffix="%" value={v.rate} onChange={set('rate')} min="0" />
            <NumberField label="Rate with points" suffix="%" value={v.newRate} onChange={set('newRate')} min="0" />
            <NumberField label="Points purchased" value={v.points} onChange={set('points')} min="0" step="0.125" hint="1 point = 1% of the loan" />
            <SelectField label="Loan term" value={v.years} onChange={set('years')} options={['30', '20', '15'].map((y) => ({ value: y, label: `${y} years` }))} />
          </div>
          <NumberField label="How long you'll keep the loan" suffix="years" value={v.hold} onChange={set('hold')} min="0" />
        </>
      }
      results={
        r ? (
          <Results
            items={[
              { label: 'Break-even point', value: formatMonths(r.breakEvenMonths), primary: true },
              { label: 'Cost of points', value: formatCurrency(r.pointsCost) },
              { label: 'Payment without points', value: formatCurrency(r.basePayment) },
              { label: 'Payment with points', value: formatCurrency(r.reducedPayment) },
              { label: 'Monthly savings', value: formatCurrency(r.monthlySavings) },
              { label: `Net savings over ${v.hold} years`, value: formatCurrency(r.netSavings) },
            ]}
            note={<p>{r.netSavings > 0 ? 'Buying points pays off if you keep the loan this long.' : 'You would sell or refinance before the points pay for themselves.'}</p>}
          />
        ) : (
          <EmptyResults />
        )
      }
    />
  );
}
