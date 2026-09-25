import { useMemo, useState } from 'react';
import { budget503020 } from '../../lib/calc/budget';
import { formatCurrency, parseNumber } from '../../lib/format';
import { NumberField, SelectField } from '../ui/fields';

const BUCKETS = [
  { key: 'needs', label: 'Needs', color: '#2563eb', hint: 'Housing, utilities, groceries, insurance, minimum debt payments' },
  { key: 'wants', label: 'Wants', color: '#d97706', hint: 'Dining out, entertainment, travel, subscriptions' },
  { key: 'savings', label: 'Savings & debt payoff', color: '#0d9488', hint: 'Emergency fund, retirement, extra debt payments' },
] as const;

export default function BudgetCalculator() {
  const [income, setIncome] = useState('5000');
  const [period, setPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [preTax, setPreTax] = useState<'after' | 'before'>('after');
  const [tax, setTax] = useState('22');
  const [pct, setPct] = useState({ needs: '50', wants: '30', savings: '20' });

  const r = useMemo(
    () =>
      budget503020({
        income: parseNumber(income) || 0, period, preTax: preTax === 'before', taxPct: parseNumber(tax) || 0,
        needsPct: parseNumber(pct.needs) || 0, wantsPct: parseNumber(pct.wants) || 0, savingsPct: parseNumber(pct.savings) || 0,
      }),
    [income, period, preTax, tax, pct],
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md shadow-gray-200/60 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <NumberField label="Income" prefix="$" value={income} onChange={setIncome} min="0" />
        <SelectField label="Per" value={period} onChange={setPeriod} options={[{ value: 'monthly', label: 'Month' }, { value: 'annual', label: 'Year' }]} />
        <SelectField label="Income is" value={preTax} onChange={setPreTax} options={[{ value: 'after', label: 'After tax (take-home)' }, { value: 'before', label: 'Before tax (gross)' }]} />
        {preTax === 'before' && <NumberField label="Estimated tax rate" suffix="%" value={tax} onChange={setTax} min="0" max="100" />}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {BUCKETS.map((b) => (
          <NumberField key={b.key} label={`${b.label} %`} suffix="%" value={pct[b.key]} onChange={(v) => setPct((p) => ({ ...p, [b.key]: v }))} min="0" max="100" />
        ))}
      </div>
      {r.totalPct !== 100 && <p className="mt-2 text-sm text-amber-700">Your percentages add up to {r.totalPct}%, not 100%.</p>}
      <div className="mt-6 rounded-xl border border-brand-100 bg-brand-50 p-5" aria-live="polite">
        <p className="text-sm text-gray-600">Monthly take-home pay</p>
        <p className="text-4xl font-bold tracking-tight text-gray-900 tabular-nums">{formatCurrency(r.monthlyTakeHome)}</p>
        <div className="mt-4 flex h-4 overflow-hidden rounded-full bg-white">
          {BUCKETS.map((b) => <div key={b.key} style={{ width: `${r.totalPct ? (Number(pct[b.key]) / r.totalPct) * 100 : 0}%`, background: b.color }} />)}
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {BUCKETS.map((b) => (
            <div key={b.key} className="rounded-md bg-white p-4">
              <p className="flex items-center gap-2 font-semibold text-gray-900"><span className="h-3 w-3 rounded-sm" style={{ background: b.color }} />{b.label} ({pct[b.key]}%)</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{formatCurrency(r[b.key].monthly)}<span className="text-sm font-normal text-gray-600">/mo</span></p>
              <p className="text-sm text-gray-600">{formatCurrency(r[b.key].annual, { whole: true })} per year</p>
              <p className="mt-2 text-xs text-gray-600">{b.hint}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
