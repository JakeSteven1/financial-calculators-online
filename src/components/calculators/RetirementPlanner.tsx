import { useMemo, useState } from 'react';
import { drawdown, projectSavings, realReturnPct } from '../../lib/calc/retirement';
import { formatCurrency, formatPercent, parseNumber } from '../../lib/format';
import { BarChart } from '../ui/BarChart';
import { NumberField, Results } from '../ui/fields';

const DEFAULTS = {
  age: '35', retire: '65', lifeExpectancy: '92', savings: '50000', income: '85000', contribution: '10000',
  raise: '2', returnPre: '7', returnPost: '5', inflation: '2.5', spending: '60000', other: '24000', tax: '12',
};
type Key = keyof typeof DEFAULTS;
const FIELDS: { key: Key; label: string; prefix?: string; suffix?: string; group: string }[] = [
  { key: 'age', label: 'Current age', group: 'You' },
  { key: 'retire', label: 'Retirement age', group: 'You' },
  { key: 'lifeExpectancy', label: 'Plan until age', group: 'You' },
  { key: 'income', label: 'Current annual income', prefix: '$', group: 'You' },
  { key: 'savings', label: 'Current retirement savings', prefix: '$', group: 'Saving' },
  { key: 'contribution', label: 'Annual contribution', prefix: '$', group: 'Saving' },
  { key: 'raise', label: 'Contribution increase per year', suffix: '%', group: 'Saving' },
  { key: 'returnPre', label: 'Return before retirement', suffix: '%', group: 'Saving' },
  { key: 'spending', label: 'Yearly spending in retirement (today’s $)', prefix: '$', group: 'Retirement' },
  { key: 'other', label: 'Social Security / pension per year (today’s $)', prefix: '$', group: 'Retirement' },
  { key: 'returnPost', label: 'Return during retirement', suffix: '%', group: 'Retirement' },
  { key: 'tax', label: 'Tax rate on withdrawals', suffix: '%', group: 'Retirement' },
  { key: 'inflation', label: 'Inflation', suffix: '%', group: 'Retirement' },
];

export default function RetirementPlanner() {
  const [v, setV] = useState(DEFAULTS);
  const r = useMemo(() => {
    const n = Object.fromEntries(Object.entries(v).map(([k, s]) => [k, parseNumber(s)])) as Record<Key, number>;
    if (!Object.values(n).every(Number.isFinite) || n.retire <= n.age || n.lifeExpectancy <= n.retire || n.lifeExpectancy - n.age > 100) return null;
    // Everything in today's dollars: grow with real returns, and real contribution raises.
    const realPre = realReturnPct(n.returnPre, n.inflation);
    const realPost = realReturnPct(n.returnPost, n.inflation);
    const acc = projectSavings({ currentAge: n.age, retirementAge: n.retire, currentSavings: n.savings, annualContribution: n.contribution, contributionGrowthPct: realReturnPct(n.raise, n.inflation), returnPct: realPre });
    const atRetirement = acc.at(-1)?.balance ?? n.savings;
    const dd = drawdown({ startAge: n.retire, endAge: n.lifeExpectancy, startBalance: atRetirement, annualSpending: n.spending, otherIncome: n.other, taxPct: n.tax, returnPct: realPost });
    const nominalAtRetirement = atRetirement * Math.pow(1 + n.inflation / 100, n.retire - n.age);
    return { acc, dd, atRetirement, nominalAtRetirement, replacement: (n.spending / n.income) * 100, n };
  }, [v]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {['You', 'Saving', 'Retirement'].map((group) => (
          <fieldset key={group} className="space-y-3">
            <legend className="font-semibold text-slate-900">{group}</legend>
            {FIELDS.filter((f) => f.group === group).map((f) => (
              <NumberField key={f.key} label={f.label} prefix={f.prefix} suffix={f.suffix} value={v[f.key]} onChange={(val) => setV((s) => ({ ...s, [f.key]: val }))} />
            ))}
          </fieldset>
        ))}
      </div>
      {r ? (
        <>
          <div className={`mt-6 rounded-lg p-5 ${r.dd.depletedAge ? 'bg-amber-50' : 'bg-brand-50'}`} aria-live="polite">
            <p className="text-lg font-semibold text-slate-900">
              {r.dd.depletedAge ? `Your savings run out at age ${r.dd.depletedAge}.` : `Your savings last past age ${r.n.lifeExpectancy}.`}
            </p>
            <div className="mt-4 grid gap-6 md:grid-cols-2">
              <Results
                items={[
                  { label: `Savings at ${r.n.retire} (today’s dollars)`, value: formatCurrency(r.atRetirement, { whole: true }), primary: true },
                  { label: 'Same amount in future dollars', value: formatCurrency(r.nominalAtRetirement, { whole: true }) },
                ]}
              />
              <Results
                items={[
                  { label: 'Yearly withdrawal needed (before tax)', value: formatCurrency(r.dd.annualWithdrawal, { whole: true }) },
                  { label: 'Withdrawal rate', value: formatPercent((r.dd.annualWithdrawal / r.atRetirement) * 100, 1) },
                  { label: 'Spending as share of current income', value: formatPercent(r.replacement, 0) },
                  { label: `Balance left at ${r.n.lifeExpectancy} (today’s $)`, value: formatCurrency(r.dd.endingBalance, { whole: true }) },
                ]}
              />
            </div>
          </div>
          <BarChart
            title="Projected savings by age, in today's dollars"
            bars={[...r.acc.map((a) => ({ label: String(a.age), values: [a.balance, 0] })), ...r.dd.balances.map((b) => ({ label: String(b.age), values: [0, b.balance] }))]}
            series={[{ label: 'Saving', color: '#1f7a45' }, { label: 'Retired', color: '#0ea5e9' }]}
            formatValue={(x) => formatCurrency(x, { whole: true })}
          />
        </>
      ) : (
        <p className="mt-6 text-slate-600">Check that retirement age is after your current age and before the plan-until age.</p>
      )}
    </div>
  );
}
