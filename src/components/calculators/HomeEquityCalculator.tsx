import { useMemo, useState } from 'react';
import { homeEquity } from '../../lib/calc/home-equity';
import { formatCurrency, formatPercent, parseNumber } from '../../lib/format';
import { CalculatorShell, EmptyResults, NumberField, Results, SelectField } from '../ui/fields';

export default function HomeEquityCalculator() {
  const [value, setValue] = useState('400000');
  const [balance, setBalance] = useState('250000');
  const [other, setOther] = useState('0');
  const [cltv, setCltv] = useState('85');
  const r = useMemo(() => homeEquity(parseNumber(value), parseNumber(balance) || 0, parseNumber(other) || 0, Number(cltv)), [value, balance, other, cltv]);

  return (
    <CalculatorShell
      inputs={
        <>
          <NumberField label="Current home value" prefix="$" value={value} onChange={setValue} min="0" />
          <NumberField label="Remaining mortgage balance" prefix="$" value={balance} onChange={setBalance} min="0" />
          <NumberField label="Other liens (HELOC, second mortgage)" prefix="$" value={other} onChange={setOther} min="0" />
          <SelectField label="Lender's maximum combined LTV" value={cltv} onChange={setCltv} options={['80', '85', '90'].map((v) => ({ value: v, label: `${v}%` }))} />
        </>
      }
      results={
        r ? (
          <div>
            <Results
              items={[
                { label: 'Home equity', value: formatCurrency(r.equity, { whole: true }), primary: true },
                { label: 'Equity share of home value', value: formatPercent(r.equityPct, 1) },
                { label: 'Loan-to-value (LTV)', value: formatPercent(r.ltv, 1) },
                { label: 'Combined LTV', value: formatPercent(r.cltv, 1) },
                { label: `You may be able to borrow (at ${cltv}% CLTV)`, value: formatCurrency(r.borrowable, { whole: true }) },
              ]}
            />
            <div className="mt-4 flex h-4 overflow-hidden rounded-full bg-white">
              <div className="bg-gray-400" style={{ width: `${Math.min(100, r.cltv)}%` }} />
              <div className="bg-brand-600" style={{ width: `${Math.max(0, Math.min(100, r.equityPct))}%` }} />
            </div>
            <p className="mt-1 flex justify-between text-xs text-gray-600"><span>Owed</span><span>Equity</span></p>
          </div>
        ) : (
          <EmptyResults message="Enter your home's current value." />
        )
      }
    />
  );
}
