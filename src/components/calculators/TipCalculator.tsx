import { useMemo, useState } from 'react';
import { calculateTip } from '../../lib/calc/tip';
import { formatCurrency, parseNumber } from '../../lib/format';
import { CalculatorShell, EmptyResults, NumberField, Results } from '../ui/fields';

const PRESETS = ['15', '18', '20', '22', '25'];

export default function TipCalculator() {
  const [bill, setBill] = useState('85');
  const [tax, setTax] = useState('0');
  const [pct, setPct] = useState('20');
  const [people, setPeople] = useState('1');
  const [roundUp, setRoundUp] = useState(false);
  const r = useMemo(() => calculateTip(parseNumber(bill), parseNumber(pct) || 0, Math.floor(parseNumber(people)) || 1, parseNumber(tax) || 0, roundUp), [bill, tax, pct, people, roundUp]);

  return (
    <CalculatorShell
      inputs={
        <>
          <NumberField label="Bill amount" prefix="$" value={bill} onChange={setBill} min="0" />
          <NumberField label="Tax included in bill (optional)" prefix="$" value={tax} onChange={setTax} min="0" hint="Tip is calculated on the amount before tax." />
          <div>
            <span className="block text-sm font-medium text-slate-700">Tip percentage</span>
            <div className="mt-1 flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button key={p} type="button" onClick={() => setPct(p)} className={`rounded-md px-3 py-2 text-sm font-semibold ${pct === p ? 'bg-brand-600 text-white' : 'border border-slate-300 bg-white text-slate-700'}`}>{p}%</button>
              ))}
            </div>
            <div className="mt-2"><NumberField label="Custom tip" suffix="%" value={pct} onChange={setPct} min="0" /></div>
          </div>
          <NumberField label="Split between" suffix="people" value={people} onChange={setPeople} min="1" step="1" />
          <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={roundUp} onChange={(e) => setRoundUp(e.target.checked)} /> Round each share up to the nearest dollar</label>
        </>
      }
      results={
        r ? (
          <Results
            items={[
              { label: Number(people) > 1 ? 'Each person pays' : 'Total to pay', value: formatCurrency(Number(people) > 1 ? r.perPerson : r.total), primary: true },
              { label: 'Tip', value: formatCurrency(r.tip) },
              { label: 'Total with tip', value: formatCurrency(r.total) },
              ...(Number(people) > 1 ? [{ label: 'Tip per person', value: formatCurrency(r.tipPerPerson) }] : []),
            ]}
          />
        ) : (
          <EmptyResults message="Enter the bill amount." />
        )
      }
    />
  );
}
