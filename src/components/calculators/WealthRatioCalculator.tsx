import { useMemo, useState } from 'react';
import { classifyWealth, expectedNetWorth, lifetimeWealthRatio } from '../../lib/calc/wealth-ratio';
import { formatCurrency, formatPercent, parseNumber } from '../../lib/format';
import { CalculatorShell, EmptyResults, NumberField, Results, type ResultItem } from '../ui/fields';

const CLASS_LABEL = { PAW: 'Prodigious accumulator of wealth', AAW: 'Average accumulator of wealth', UAW: 'Under accumulator of wealth' };

export default function WealthRatioCalculator() {
  const [v, setV] = useState({ assets: '650000', liabilities: '250000', lifetime: '1800000', age: '45', income: '95000' });
  const set = (k: keyof typeof v) => (value: string) => setV((s) => ({ ...s, [k]: value }));

  const r = useMemo(() => {
    const n = Object.fromEntries(Object.entries(v).map(([k, s]) => [k, parseNumber(s)])) as Record<keyof typeof v, number>;
    const netWorth = (n.assets || 0) - (n.liabilities || 0);
    const ratio = lifetimeWealthRatio(n.assets || 0, n.liabilities || 0, n.lifetime);
    const expected = n.age > 0 && n.income > 0 ? expectedNetWorth(n.age, n.income) : NaN;
    return { netWorth, ratio, expected, cls: classifyWealth(netWorth, expected) };
  }, [v]);

  const items: ResultItem[] = [
    { label: 'Lifetime wealth ratio', value: formatPercent(r.ratio, 1), primary: true },
    { label: 'Net worth', value: formatCurrency(r.netWorth, { whole: true }) },
    ...(Number.isFinite(r.expected) ? [{ label: 'Expected net worth for your age and income', value: formatCurrency(r.expected, { whole: true }) }] : []),
    ...(r.cls ? [{ label: 'You are a', value: CLASS_LABEL[r.cls] }] : []),
  ];

  return (
    <CalculatorShell
      inputs={
        <>
          <NumberField label="Total assets (everything you own)" prefix="$" value={v.assets} onChange={set('assets')} min="0" />
          <NumberField label="Total liabilities (everything you owe)" prefix="$" value={v.liabilities} onChange={set('liabilities')} min="0" />
          <NumberField label="Total lifetime income (everything you've earned)" prefix="$" value={v.lifetime} onChange={set('lifetime')} min="0" />
          <h3 className="pt-2 text-sm font-semibold text-slate-900">Compare with the expected net worth (optional)</h3>
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="Age" value={v.age} onChange={set('age')} min="0" />
            <NumberField label="Annual pretax income" prefix="$" value={v.income} onChange={set('income')} min="0" />
          </div>
        </>
      }
      results={Number.isFinite(r.ratio) ? <Results items={items} /> : <EmptyResults message="Enter your total lifetime income." />}
    />
  );
}
