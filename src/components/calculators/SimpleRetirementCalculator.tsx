import { useMemo, useState } from 'react';
import { projectSavings, safeWithdrawal } from '../../lib/calc/retirement';
import { formatCurrency, parseNumber } from '../../lib/format';
import { BarChart } from '../ui/BarChart';
import { CalculatorShell, EmptyResults, NumberField, Results } from '../ui/fields';

export default function SimpleRetirementCalculator() {
  const [v, setV] = useState({ age: '30', retire: '65', savings: '20000', contribution: '6000', rate: '7' });
  const set = (k: keyof typeof v) => (value: string) => setV((s) => ({ ...s, [k]: value }));

  const rows = useMemo(() => {
    const n = Object.fromEntries(Object.entries(v).map(([k, s]) => [k, parseNumber(s)])) as Record<keyof typeof v, number>;
    if (!Object.values(n).every(Number.isFinite) || n.retire <= n.age || n.retire - n.age > 80) return null;
    return projectSavings({ currentAge: n.age, retirementAge: n.retire, currentSavings: n.savings, annualContribution: n.contribution, returnPct: n.rate });
  }, [v]);
  const last = rows?.at(-1);

  return (
    <div>
      <CalculatorShell
        inputs={
          <>
            <div className="grid grid-cols-2 gap-3">
              <NumberField label="Current age" value={v.age} onChange={set('age')} min="0" />
              <NumberField label="Retirement age" value={v.retire} onChange={set('retire')} min="0" />
            </div>
            <NumberField label="Current retirement savings" prefix="$" value={v.savings} onChange={set('savings')} min="0" />
            <NumberField label="Annual contribution" prefix="$" value={v.contribution} onChange={set('contribution')} min="0" />
            <NumberField label="Expected annual return" suffix="%" value={v.rate} onChange={set('rate')} />
          </>
        }
        results={
          last ? (
            <Results
              items={[
                { label: `Savings at age ${last.age}`, value: formatCurrency(last.balance, { whole: true }), primary: true },
                { label: 'Total contributions', value: formatCurrency(last.totalContributions, { whole: true }) },
                { label: 'Investment growth', value: formatCurrency(last.totalGrowth, { whole: true }) },
                { label: 'Yearly income at a 4% withdrawal rate', value: formatCurrency(safeWithdrawal(last.balance), { whole: true }) },
              ]}
              note={<p>Amounts are in future dollars. Use the full retirement calculator to adjust for inflation.</p>}
            />
          ) : (
            <EmptyResults message="Retirement age must be after your current age." />
          )
        }
      />
      {rows && rows.length > 1 && (
        <BarChart
          title="Retirement savings by age"
          bars={rows.map((r) => ({ label: String(r.age), values: [r.totalContributions, Math.max(0, r.totalGrowth)] }))}
          series={[{ label: 'Contributions', color: '#94a3b8' }, { label: 'Growth', color: '#1f7a45' }]}
          formatValue={(x) => formatCurrency(x, { whole: true })}
        />
      )}
    </div>
  );
}
