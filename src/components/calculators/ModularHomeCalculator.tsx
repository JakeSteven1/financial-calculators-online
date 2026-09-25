import { useMemo, useState } from 'react';
import { MODULAR_COST_ITEMS, modularHomeCost, type ModularCostKey, type ModularGroup } from '../../lib/calc/modular-home';
import { formatCurrency, formatNumber, parseNumber } from '../../lib/format';
import { NumberField, Results } from '../ui/fields';

const DEFAULTS: Record<ModularCostKey, string> = {
  land: '50000', landPrep: '10000', transport: '8000', permits: '3000', water: '5000', septic: '12000',
  electrical: '6000', foundation: '20000', modules: '150000', setup: '25000', driveway: '10000', custom: '5000',
};
const GROUPS: { key: ModularGroup; label: string; color: string }[] = [
  { key: 'structure', label: 'Home structure', color: '#1f7a45' },
  { key: 'site', label: 'Land and site', color: '#0ea5e9' },
  { key: 'utilities', label: 'Utilities', color: '#f59e0b' },
  { key: 'extras', label: 'Extras', color: '#94a3b8' },
];

export default function ModularHomeCalculator() {
  const [costs, setCosts] = useState(DEFAULTS);
  const [sqFt, setSqFt] = useState('1800');
  const [down, setDown] = useState('60000');
  const [rate, setRate] = useState('7');
  const [years, setYears] = useState('30');

  const r = useMemo(() => {
    const parsed: Partial<Record<ModularCostKey, number>> = {};
    for (const k of Object.keys(costs) as ModularCostKey[]) parsed[k] = Math.max(0, parseNumber(costs[k]) || 0);
    return modularHomeCost(parsed, parseNumber(sqFt) || 0, { downPayment: parseNumber(down) || 0, ratePct: parseNumber(rate) || 0, years: parseNumber(years) || 30 });
  }, [costs, sqFt, down, rate, years]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div>
          <div className="grid gap-4 sm:grid-cols-2">
            {MODULAR_COST_ITEMS.map((item) => (
              <NumberField key={item.key} label={item.label} prefix="$" value={costs[item.key]} min="0" onChange={(v) => setCosts((c) => ({ ...c, [item.key]: v }))} />
            ))}
            <NumberField label="Home size" suffix="sq ft" value={sqFt} onChange={setSqFt} min="0" />
          </div>
          <h3 className="mt-6 font-semibold text-slate-900">Financing</h3>
          <div className="mt-2 grid gap-4 sm:grid-cols-3">
            <NumberField label="Down payment" prefix="$" value={down} onChange={setDown} min="0" />
            <NumberField label="Interest rate" suffix="%" value={rate} onChange={setRate} min="0" />
            <NumberField label="Loan term" suffix="years" value={years} onChange={setYears} min="1" />
          </div>
        </div>
        <div className="h-fit rounded-lg bg-brand-50 p-5 lg:sticky lg:top-4" aria-live="polite">
          <Results
            items={[
              { label: 'Total project cost', value: formatCurrency(r.total, { whole: true }), primary: true },
              { label: 'Cost per sq ft (excluding land)', value: Number.isFinite(r.costPerSqFtExLand) ? formatCurrency(r.costPerSqFtExLand) : '—' },
              { label: 'Loan amount', value: formatCurrency(r.loanAmount, { whole: true }) },
              { label: 'Monthly payment (P&I)', value: formatCurrency(r.monthlyPayment) },
            ]}
          />
          <div className="mt-5">
            <div className="flex h-4 overflow-hidden rounded-full bg-white">
              {GROUPS.map((g) => (r.total > 0 ? <div key={g.key} style={{ width: `${(r.byGroup[g.key] / r.total) * 100}%`, background: g.color }} /> : null))}
            </div>
            <ul className="mt-3 space-y-1 text-sm">
              {GROUPS.map((g) => (
                <li key={g.key} className="flex justify-between gap-2">
                  <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm" style={{ background: g.color }} />{g.label}</span>
                  <span className="tabular-nums">{formatCurrency(r.byGroup[g.key], { whole: true })}</span>
                </li>
              ))}
            </ul>
            {Number.isFinite(r.siteToStructurePct) && (
              <p className="mt-3 text-sm text-slate-600">Site, utility, and extra costs are {formatNumber(r.siteToStructurePct, 0)}% of the home structure cost.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
