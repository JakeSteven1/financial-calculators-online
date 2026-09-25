import { useMemo, useState } from 'react';
import { homeAffordability } from '../../lib/calc/affordability';
import { formatCurrency, parseNumber } from '../../lib/format';
import { CalculatorShell, EmptyResults, NumberField, Results, SelectField } from '../ui/fields';

const RULES = {
  conventional: { label: 'Conservative (28% / 36%)', front: 28, back: 36 },
  fha: { label: 'FHA (31% / 43%)', front: 31, back: 43 },
  stretch: { label: 'Stretch (36% / 45%)', front: 36, back: 45 },
} as const;

export default function AffordabilityCalculator() {
  const [v, setV] = useState({ income: '120000', debts: '500', down: '60000', rate: '6.5', years: '30', tax: '1.1', insurance: '1800', hoa: '0' });
  const [rule, setRule] = useState<keyof typeof RULES>('conventional');
  const set = (k: keyof typeof v) => (value: string) => setV((s) => ({ ...s, [k]: value }));
  const n = (s: string) => parseNumber(s) || 0;

  const r = useMemo(
    () =>
      homeAffordability({
        annualIncome: n(v.income), monthlyDebts: n(v.debts), downPayment: n(v.down), ratePct: n(v.rate), years: n(v.years) || 30,
        propertyTaxPct: n(v.tax), insuranceYearly: n(v.insurance), hoaMonthly: n(v.hoa), frontEndPct: RULES[rule].front, backEndPct: RULES[rule].back,
      }),
    [v, rule],
  );

  return (
    <CalculatorShell
      inputs={
        <>
          <NumberField label="Annual household income (before tax)" prefix="$" value={v.income} onChange={set('income')} min="0" />
          <NumberField label="Monthly debt payments" prefix="$" value={v.debts} onChange={set('debts')} min="0" hint="Car loans, student loans, credit card minimums." />
          <NumberField label="Down payment" prefix="$" value={v.down} onChange={set('down')} min="0" />
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="Interest rate" suffix="%" value={v.rate} onChange={set('rate')} min="0" />
            <SelectField label="Loan term" value={v.years} onChange={set('years')} options={['30', '20', '15'].map((y) => ({ value: y, label: `${y} years` }))} />
            <NumberField label="Property tax rate" suffix="%" value={v.tax} onChange={set('tax')} min="0" />
            <NumberField label="Insurance per year" prefix="$" value={v.insurance} onChange={set('insurance')} min="0" />
          </div>
          <NumberField label="HOA per month" prefix="$" value={v.hoa} onChange={set('hoa')} min="0" />
          <SelectField label="Debt-to-income limits" value={rule} onChange={setRule} options={Object.entries(RULES).map(([value, r]) => ({ value: value as keyof typeof RULES, label: r.label }))} />
        </>
      }
      results={
        r ? (
          <Results
            items={[
              { label: 'You can afford a home up to', value: formatCurrency(r.maxHomePrice, { whole: true }), primary: true },
              { label: 'Loan amount', value: formatCurrency(r.loanAmount, { whole: true }) },
              { label: 'Total monthly housing payment', value: formatCurrency(r.monthlyHousing) },
              { label: 'Principal and interest', value: formatCurrency(r.principalAndInterest) },
            ]}
            note={<p>Limited by the {r.limitedBy === 'front-end' ? 'housing-cost' : 'total-debt'} ratio. Lenders also weigh credit score, savings, and job history.</p>}
          />
        ) : (
          <EmptyResults message="Your debts and fixed costs already use up the allowed budget. Try lowering debts or a different DTI limit." />
        )
      }
    />
  );
}
