import { useMemo, useState } from 'react';
import { lifeInsuranceNeed, suggestedYears } from '../../lib/calc/life-insurance';
import { formatCurrency, parseNumber } from '../../lib/format';
import { CalculatorShell, NumberField, Results } from '../ui/fields';

export default function LifeInsuranceCalculator() {
  const [v, setV] = useState({ age: '35', income: '80000', years: '20', debts: '20000', mortgage: '250000', dependents: '2', education: '50000', final: '15000', coverage: '0', savings: '25000' });
  const set = (k: keyof typeof v) => (value: string) => setV((s) => ({ ...s, [k]: value }));
  const n = (s: string) => Math.max(0, parseNumber(s) || 0);
  const r = useMemo(
    () => lifeInsuranceNeed({ annualIncome: n(v.income), yearsToReplace: n(v.years), debts: n(v.debts), mortgageBalance: n(v.mortgage), dependents: n(v.dependents), educationPerDependent: n(v.education), finalExpenses: n(v.final), existingCoverage: n(v.coverage), savings: n(v.savings) }),
    [v],
  );

  return (
    <CalculatorShell
      inputs={
        <>
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="Your age" value={v.age} onChange={(a) => { set('age')(a); const age = parseNumber(a); if (age > 0) set('years')(String(suggestedYears(age))); }} min="18" />
            <NumberField label="Annual income" prefix="$" value={v.income} onChange={set('income')} min="0" />
            <NumberField label="Years of income to replace" value={v.years} onChange={set('years')} min="0" />
            <NumberField label="Number of dependents" value={v.dependents} onChange={set('dependents')} min="0" step="1" />
            <NumberField label="Debts (excluding mortgage)" prefix="$" value={v.debts} onChange={set('debts')} min="0" />
            <NumberField label="Mortgage balance" prefix="$" value={v.mortgage} onChange={set('mortgage')} min="0" />
            <NumberField label="Education per dependent" prefix="$" value={v.education} onChange={set('education')} min="0" />
            <NumberField label="Final expenses" prefix="$" value={v.final} onChange={set('final')} min="0" />
            <NumberField label="Existing life insurance" prefix="$" value={v.coverage} onChange={set('coverage')} min="0" />
            <NumberField label="Savings and investments" prefix="$" value={v.savings} onChange={set('savings')} min="0" />
          </div>
        </>
      }
      results={
        <Results
          items={[
            { label: 'Recommended coverage', value: formatCurrency(r.recommended, { whole: true }), primary: true },
            { label: 'Income replacement', value: formatCurrency(r.incomeNeed, { whole: true }) },
            { label: 'Education', value: formatCurrency(r.educationNeed, { whole: true }) },
            { label: 'Total needs', value: formatCurrency(r.totalNeeds, { whole: true }) },
            { label: 'Minus existing resources', value: formatCurrency(r.resources, { whole: true }) },
          ]}
          note={<p>A starting estimate, not a quote. Term life policies are usually sold in round amounts, so round up.</p>}
        />
      }
    />
  );
}
