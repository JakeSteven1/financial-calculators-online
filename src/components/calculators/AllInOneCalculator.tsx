import { useState } from 'react';
import CompoundInterestCalculator from './CompoundInterestCalculator';
import LoanCalculator from './LoanCalculator';
import MortgageCalculator from './MortgageCalculator';

const TABS = [
  { key: 'loan', label: 'Loan' },
  { key: 'investment', label: 'Investment' },
  { key: 'mortgage', label: 'Mortgage' },
] as const;

export default function AllInOneCalculator() {
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('loan');
  return (
    <div>
      <div role="tablist" aria-label="Calculator type" className="mb-4 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-md px-4 py-2 font-semibold ${tab === t.key ? 'bg-brand-600 text-white' : 'border border-slate-300 bg-white text-slate-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">
        {tab === 'loan' && <LoanCalculator />}
        {tab === 'investment' && <CompoundInterestCalculator />}
        {tab === 'mortgage' && <MortgageCalculator />}
      </div>
    </div>
  );
}
