import { useMemo, useState } from 'react';
import { simpleInterest, termInYears } from '../../lib/calc/simple-interest';
import { formatCurrency, parseNumber } from '../../lib/format';
import { CalculatorShell, EmptyResults, NumberField, Results, SelectField } from '../ui/fields';

type Unit = 'years' | 'months' | 'days';

export default function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState('10000');
  const [rate, setRate] = useState('5');
  const [term, setTerm] = useState('3');
  const [unit, setUnit] = useState<Unit>('years');

  const result = useMemo(() => {
    const p = parseNumber(principal);
    const r = parseNumber(rate);
    const t = parseNumber(term);
    if (![p, r, t].every(Number.isFinite) || t < 0) return null;
    return simpleInterest(p, r, termInYears(t, unit));
  }, [principal, rate, term, unit]);

  return (
    <CalculatorShell
      inputs={
        <>
          <NumberField label="Principal amount" prefix="$" value={principal} onChange={setPrincipal} min="0" />
          <NumberField label="Annual interest rate" suffix="%" value={rate} onChange={setRate} />
          <div className="grid grid-cols-2 gap-4">
            <NumberField label="Time" value={term} onChange={setTerm} min="0" />
            <SelectField label="Unit" value={unit} onChange={setUnit} options={[{ value: 'years', label: 'Years' }, { value: 'months', label: 'Months' }, { value: 'days', label: 'Days' }]} />
          </div>
        </>
      }
      results={
        result ? (
          <Results
            items={[
              { label: 'Total (principal + interest)', value: formatCurrency(result.total), primary: true },
              { label: 'Interest', value: formatCurrency(result.interest) },
              { label: 'Principal', value: formatCurrency(result.total - result.interest) },
            ]}
          />
        ) : (
          <EmptyResults />
        )
      }
    />
  );
}
