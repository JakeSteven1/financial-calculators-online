import { useMemo, useState } from 'react';
import { mortgagePayment } from '../../lib/calc/mortgage';
import { formatCurrency, parseNumber } from '../../lib/format';
import { NumberField, SelectField } from '../ui/fields';

export default function RateComparisonCalculator() {
  const [v, setV] = useState({ price: '400000', down: '40000', years: '30', rate1: '6.75', rate2: '6.25', points2: '1', tax: '4800', insurance: '1800', pmi: '0.5' });
  const set = (k: keyof typeof v) => (value: string) => setV((s) => ({ ...s, [k]: value }));
  const n = (s: string) => parseNumber(s) || 0;

  const r = useMemo(() => {
    const common = { homePrice: n(v.price), downPayment: n(v.down), years: n(v.years), propertyTaxYearly: n(v.tax), insuranceYearly: n(v.insurance), pmiRatePct: n(v.pmi) };
    const a = mortgagePayment({ ...common, ratePct: n(v.rate1) });
    const b = mortgagePayment({ ...common, ratePct: n(v.rate2) });
    if (!a || !b) return null;
    const months = Math.round(n(v.years) * 12);
    const pointsCost = (b.loanAmount * n(v.points2)) / 100;
    return {
      a, b, pointsCost,
      totalA: a.principalAndInterest * months,
      totalB: b.principalAndInterest * months + pointsCost,
      monthlyDiff: a.totalMonthly - b.totalMonthly,
    };
  }, [v]);

  const row = (label: string, a: string, b: string, strong = false) => (
    <tr className={strong ? 'font-semibold text-gray-900' : ''}>
      <td className="py-2 pr-3 text-gray-600">{label}</td>
      <td className="py-2 text-right tabular-nums">{a}</td>
      <td className="py-2 text-right tabular-nums">{b}</td>
    </tr>
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md shadow-gray-200/60 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NumberField label="Home price" prefix="$" value={v.price} onChange={set('price')} min="0" />
        <NumberField label="Down payment" prefix="$" value={v.down} onChange={set('down')} min="0" />
        <SelectField label="Loan term" value={v.years} onChange={set('years')} options={['30', '20', '15', '10'].map((y) => ({ value: y, label: `${y} years` }))} />
        <NumberField label="Option 1 rate" suffix="%" value={v.rate1} onChange={set('rate1')} min="0" />
        <NumberField label="Option 2 rate" suffix="%" value={v.rate2} onChange={set('rate2')} min="0" />
        <NumberField label="Option 2 points (optional)" value={v.points2} onChange={set('points2')} min="0" hint="Points paid to get option 2's rate." />
        <NumberField label="Property tax per year" prefix="$" value={v.tax} onChange={set('tax')} min="0" />
        <NumberField label="Insurance per year" prefix="$" value={v.insurance} onChange={set('insurance')} min="0" />
        <NumberField label="PMI rate (if < 20% down)" suffix="%" value={v.pmi} onChange={set('pmi')} min="0" />
      </div>
      {r ? (
        <div className="mt-6 overflow-x-auto rounded-xl border border-brand-100 bg-brand-50 p-5" aria-live="polite">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left"><th className="py-2"><span className="sr-only">Measure</span></th><th className="py-2 text-right">Option 1 ({v.rate1}%)</th><th className="py-2 text-right">Option 2 ({v.rate2}%)</th></tr>
            </thead>
            <tbody className="divide-y divide-brand-100">
              {row('Principal and interest', formatCurrency(r.a.principalAndInterest), formatCurrency(r.b.principalAndInterest))}
              {row('Taxes, insurance, PMI', formatCurrency(r.a.totalMonthly - r.a.principalAndInterest), formatCurrency(r.b.totalMonthly - r.b.principalAndInterest))}
              {row('Total monthly payment', formatCurrency(r.a.totalMonthly), formatCurrency(r.b.totalMonthly), true)}
              {row('Total interest', formatCurrency(r.a.totalInterest, { whole: true }), formatCurrency(r.b.totalInterest, { whole: true }))}
              {row('Upfront points', formatCurrency(0), formatCurrency(r.pointsCost, { whole: true }))}
              {row('Total P&I + points', formatCurrency(r.totalA, { whole: true }), formatCurrency(r.totalB, { whole: true }), true)}
            </tbody>
          </table>
          <p className="mt-4 font-medium text-gray-800">
            {Math.abs(r.monthlyDiff) < 0.005
              ? 'Both options have the same monthly payment.'
              : `Option ${r.monthlyDiff > 0 ? 2 : 1} saves ${formatCurrency(Math.abs(r.monthlyDiff))} a month and ${formatCurrency(Math.abs(r.totalA - r.totalB), { whole: true })} over the full term${r.pointsCost && r.monthlyDiff > 0 ? `; the points pay for themselves in ${Math.ceil(r.pointsCost / r.monthlyDiff)} months` : ''}.`}
          </p>
        </div>
      ) : (
        <p className="mt-6 text-gray-600">Check the home price and down payment.</p>
      )}
    </div>
  );
}
