import { useMemo, useState } from 'react';
import { effectiveAnnualRate } from '../../lib/calc/ear';
import { formatPercent, parseNumber } from '../../lib/format';
import { CalculatorShell, EmptyResults, NumberField, Results, SelectField } from '../ui/fields';

const FREQS = [
  { value: '1', label: 'Annually (1)' },
  { value: '2', label: 'Semi-annually (2)' },
  { value: '4', label: 'Quarterly (4)' },
  { value: '12', label: 'Monthly (12)' },
  { value: '52', label: 'Weekly (52)' },
  { value: '365', label: 'Daily (365)' },
  { value: 'inf', label: 'Continuously' },
];
const toN = (v: string) => (v === 'inf' ? Infinity : Number(v));

export default function EarCalculator() {
  const [rate, setRate] = useState('12');
  const [freq, setFreq] = useState('12');
  const nominal = parseNumber(rate);
  const ear = useMemo(() => effectiveAnnualRate(nominal, toN(freq)), [nominal, freq]);

  return (
    <CalculatorShell
      inputs={
        <>
          <NumberField label="Nominal annual interest rate (APR)" suffix="%" value={rate} onChange={setRate} />
          <SelectField label="Compounding frequency" value={freq} onChange={setFreq} options={FREQS} />
        </>
      }
      results={
        Number.isFinite(ear) ? (
          <div>
            <Results items={[{ label: 'Effective annual rate (EAR / APY)', value: formatPercent(ear, 4), primary: true }]} />
            <table className="mt-4 w-full text-sm">
              <thead><tr className="text-left text-gray-600"><th className="py-1">Compounding</th><th className="py-1 text-right">EAR at {formatPercent(nominal)}</th></tr></thead>
              <tbody>
                {FREQS.map((f) => (
                  <tr key={f.value} className={f.value === freq ? 'font-semibold text-brand-800' : ''}>
                    <td className="py-0.5">{f.label}</td>
                    <td className="py-0.5 text-right tabular-nums">{formatPercent(effectiveAnnualRate(nominal, toN(f.value)), 4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyResults />
        )
      }
    />
  );
}
