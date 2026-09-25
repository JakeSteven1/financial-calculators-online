import { useMemo, useState } from 'react';
import { rentVsBuy, type RentVsBuyInput } from '../../lib/calc/rent-vs-buy';
import { formatCurrency, parseNumber } from '../../lib/format';
import { NumberField, Results } from '../ui/fields';

type Key = keyof RentVsBuyInput;
const DEFAULTS: Record<Key, string> = {
  years: '10', monthlyRent: '2000', rentIncreasePct: '3', rentersInsuranceYearly: '200',
  homePrice: '400000', downPaymentPct: '20', mortgageRatePct: '6.5', loanYears: '30',
  propertyTaxPct: '1.1', homeInsuranceYearly: '1800', maintenancePct: '1', appreciationPct: '3',
  buyingCostsPct: '3', sellingCostsPct: '6', investmentReturnPct: '5',
};
const FIELDS: { key: Key; label: string; prefix?: string; suffix?: string; group: 'Renting' | 'Buying' | 'Assumptions' }[] = [
  { key: 'monthlyRent', label: 'Monthly rent', prefix: '$', group: 'Renting' },
  { key: 'rentIncreasePct', label: 'Annual rent increase', suffix: '%', group: 'Renting' },
  { key: 'rentersInsuranceYearly', label: "Renter's insurance per year", prefix: '$', group: 'Renting' },
  { key: 'homePrice', label: 'Home price', prefix: '$', group: 'Buying' },
  { key: 'downPaymentPct', label: 'Down payment', suffix: '%', group: 'Buying' },
  { key: 'mortgageRatePct', label: 'Mortgage rate', suffix: '%', group: 'Buying' },
  { key: 'loanYears', label: 'Loan term', suffix: 'years', group: 'Buying' },
  { key: 'propertyTaxPct', label: 'Property tax rate', suffix: '%', group: 'Buying' },
  { key: 'homeInsuranceYearly', label: 'Home insurance per year', prefix: '$', group: 'Buying' },
  { key: 'maintenancePct', label: 'Maintenance per year', suffix: '%', group: 'Buying' },
  { key: 'years', label: 'Years you plan to stay', suffix: 'years', group: 'Assumptions' },
  { key: 'appreciationPct', label: 'Home appreciation per year', suffix: '%', group: 'Assumptions' },
  { key: 'buyingCostsPct', label: 'Closing costs to buy', suffix: '%', group: 'Assumptions' },
  { key: 'sellingCostsPct', label: 'Costs to sell', suffix: '%', group: 'Assumptions' },
  { key: 'investmentReturnPct', label: 'Return if you invested instead', suffix: '%', group: 'Assumptions' },
];

export default function RentVsBuyCalculator() {
  const [v, setV] = useState(DEFAULTS);
  const r = useMemo(() => {
    const n = Object.fromEntries(Object.entries(v).map(([k, s]) => [k, parseNumber(s) || 0])) as unknown as RentVsBuyInput;
    n.years = Math.min(50, Math.max(1, Math.round(n.years)));
    return rentVsBuy(n);
  }, [v]);
  const buyWins = r.totalBuyCost < r.totalRentCost;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {(['Renting', 'Buying', 'Assumptions'] as const).map((group) => (
          <fieldset key={group} className="space-y-3">
            <legend className="font-semibold text-slate-900">{group}</legend>
            {FIELDS.filter((f) => f.group === group).map((f) => (
              <NumberField key={f.key} label={f.label} prefix={f.prefix} suffix={f.suffix} value={v[f.key]} onChange={(val) => setV((s) => ({ ...s, [f.key]: val }))} />
            ))}
          </fieldset>
        ))}
      </div>
      <div className="mt-6 grid gap-6 rounded-lg bg-brand-50 p-5 md:grid-cols-2" aria-live="polite">
        <Results
          items={[
            { label: `Over ${r.timeline.length} years, ${buyWins ? 'buying' : 'renting'} is cheaper by`, value: formatCurrency(Math.abs(r.totalRentCost - r.totalBuyCost), { whole: true }), primary: true },
            { label: 'Net cost of renting', value: formatCurrency(r.totalRentCost, { whole: true }) },
            { label: 'Net cost of buying', value: formatCurrency(r.totalBuyCost, { whole: true }) },
            { label: 'Monthly mortgage (P&I)', value: formatCurrency(r.monthlyMortgage) },
            { label: 'Home equity after selling', value: formatCurrency(r.equityAtEnd, { whole: true }) },
          ]}
          note={<p>{r.breakEvenYear ? `Buying becomes cheaper than renting in year ${r.breakEvenYear}.` : 'Buying never becomes cheaper within this time frame.'}</p>}
        />
        <div className="max-h-80 overflow-auto rounded-md bg-white">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-50">
              <tr><th className="px-3 py-2 text-left">Year</th><th className="px-3 py-2 text-right">Rent cost</th><th className="px-3 py-2 text-right">Buy cost</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {r.timeline.map((t) => (
                <tr key={t.year} className={t.buyCumulative < t.rentCumulative ? 'text-brand-800' : ''}>
                  <td className="px-3 py-1.5">{t.year}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{formatCurrency(t.rentCumulative, { whole: true })}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{formatCurrency(t.buyCumulative, { whole: true })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
