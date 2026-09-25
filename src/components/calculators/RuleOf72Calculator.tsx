import { useMemo, useState } from 'react';
import { exactRateToDouble, exactYearsToDouble, rateToDoubleRule72, yearsToDoubleRule72 } from '../../lib/calc/rule-of-72';
import { formatNumber, formatPercent, parseNumber } from '../../lib/format';
import { CalculatorShell, EmptyResults, NumberField, Results, SelectField } from '../ui/fields';

type Mode = 'years' | 'rate';

export default function RuleOf72Calculator() {
  const [mode, setMode] = useState<Mode>('years');
  const [value, setValue] = useState('8');

  const result = useMemo(() => {
    const v = parseNumber(value);
    if (!(v > 0)) return null;
    return mode === 'years'
      ? { estimate: `${formatNumber(yearsToDoubleRule72(v), 2)} years`, exact: `${formatNumber(exactYearsToDouble(v), 2)} years` }
      : { estimate: formatPercent(rateToDoubleRule72(v)), exact: formatPercent(exactRateToDouble(v)) };
  }, [mode, value]);

  return (
    <CalculatorShell
      inputs={
        <>
          <SelectField
            label="I want to find"
            value={mode}
            onChange={setMode}
            options={[
              { value: 'years', label: 'Years to double my money' },
              { value: 'rate', label: 'Interest rate needed to double' },
            ]}
          />
          {mode === 'years' ? (
            <NumberField label="Annual interest rate" suffix="%" value={value} onChange={setValue} min="0" />
          ) : (
            <NumberField label="Years to double" suffix="years" value={value} onChange={setValue} min="0" />
          )}
        </>
      }
      results={
        result ? (
          <Results
            items={[
              { label: mode === 'years' ? 'Rule of 72 estimate' : 'Rule of 72 rate', value: result.estimate, primary: true },
              { label: 'Exact (annual compounding)', value: result.exact },
            ]}
          />
        ) : (
          <EmptyResults message="Enter a number greater than zero." />
        )
      }
    />
  );
}
