import { useMemo, useState } from 'react';
import { compoundInterest } from '../../lib/calc/compound-interest';
import { formatCurrency, parseNumber } from '../../lib/format';
import { BarChart } from '../ui/BarChart';
import { CalculatorShell, EmptyResults, NumberField, Results, SelectField } from '../ui/fields';

const FREQUENCIES = [
  { value: '1', label: 'Annually' },
  { value: '2', label: 'Semi-annually' },
  { value: '4', label: 'Quarterly' },
  { value: '12', label: 'Monthly' },
  { value: '365', label: 'Daily' },
];

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('10000');
  const [rate, setRate] = useState('5');
  const [years, setYears] = useState('10');
  const [frequency, setFrequency] = useState('12');
  const [monthly, setMonthly] = useState('0');

  const result = useMemo(() => {
    const p = parseNumber(principal);
    const r = parseNumber(rate);
    const y = parseNumber(years);
    const c = parseNumber(monthly || '0');
    if (![p, r, y, c].every(Number.isFinite) || p < 0 || y <= 0 || y > 100 || c < 0) return null;
    return compoundInterest({ principal: p, annualRate: r, years: y, compoundsPerYear: Number(frequency), monthlyContribution: c });
  }, [principal, rate, years, frequency, monthly]);

  return (
    <div>
      <CalculatorShell
        inputs={
          <>
            <NumberField label="Principal amount" prefix="$" value={principal} onChange={setPrincipal} min="0" />
            <NumberField label="Annual interest rate" suffix="%" value={rate} onChange={setRate} />
            <NumberField label="Time" suffix="years" value={years} onChange={setYears} min="0" />
            <SelectField label="Compounding frequency" value={frequency} onChange={setFrequency} options={FREQUENCIES} />
            <NumberField label="Monthly contribution (optional)" prefix="$" value={monthly} onChange={setMonthly} min="0" />
          </>
        }
        results={
          result ? (
            <Results
              items={[
                { label: 'Future value', value: formatCurrency(result.finalBalance), primary: true },
                { label: 'Total interest earned', value: formatCurrency(result.totalInterest) },
                { label: 'Total contributions', value: formatCurrency(result.totalContributions) },
              ]}
            />
          ) : (
            <EmptyResults />
          )
        }
      />
      {result && result.schedule.length > 1 && (
        <BarChart
          title="Balance by year: contributions and interest"
          bars={result.schedule.map((y) => ({ label: `Yr ${y.year}`, values: [y.totalContributions, Math.max(0, y.totalInterest)] }))}
          series={[
            { label: 'Contributions', color: '#94a3b8' },
            { label: 'Interest', color: '#1f7a45' },
          ]}
          formatValue={(v) => formatCurrency(v, { whole: true })}
        />
      )}
    </div>
  );
}
