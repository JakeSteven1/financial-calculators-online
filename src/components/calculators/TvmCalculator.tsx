import { useMemo, useState } from 'react';
import { solveTvm, type SolveFor, type Timing } from '../../lib/calc/tvm';
import { formatCurrency, formatNumber, formatPercent, parseNumber } from '../../lib/format';
import { CalculatorShell, EmptyResults, NumberField, Results, SelectField } from '../ui/fields';

const TARGETS: { value: SolveFor; label: string }[] = [
  { value: 'fv', label: 'Future value (FV)' },
  { value: 'pv', label: 'Present value (PV)' },
  { value: 'pmt', label: 'Payment (PMT)' },
  { value: 'periods', label: 'Number of periods (N)' },
  { value: 'rate', label: 'Annual interest rate (I/Y)' },
];

export default function TvmCalculator() {
  const [solveFor, setSolveFor] = useState<SolveFor>('fv');
  const [pv, setPv] = useState('-1000');
  const [fv, setFv] = useState('0');
  const [pmt, setPmt] = useState('-100');
  const [annualRate, setAnnualRate] = useState('5');
  const [periods, setPeriods] = useState('10');
  const [perYear, setPerYear] = useState('1');
  const [timing, setTiming] = useState<Timing>('end');

  const result = useMemo(() => {
    const ppy = Number(perYear);
    const values = {
      pv: parseNumber(pv),
      fv: parseNumber(fv),
      pmt: parseNumber(pmt),
      rate: parseNumber(annualRate) / 100 / ppy,
      periods: parseNumber(periods),
      timing,
    };
    const needed = (['pv', 'fv', 'pmt', 'rate', 'periods'] as const).filter((k) => k !== solveFor);
    if (!needed.every((k) => Number.isFinite(values[k]))) return null;
    const answer = solveTvm(solveFor, values);
    return Number.isFinite(answer) ? answer : NaN;
  }, [solveFor, pv, fv, pmt, annualRate, periods, perYear, timing]);

  const display = (() => {
    if (result === null || Number.isNaN(result)) return null;
    if (solveFor === 'rate') return formatPercent(result * Number(perYear) * 100, 4);
    if (solveFor === 'periods') return `${formatNumber(result, 2)} periods (${formatNumber(result / Number(perYear), 2)} years)`;
    return formatCurrency(result);
  })();

  const field = (key: SolveFor, node: React.ReactNode) => (key === solveFor ? null : node);

  return (
    <CalculatorShell
      inputs={
        <>
          <SelectField label="Solve for" value={solveFor} onChange={setSolveFor} options={TARGETS} />
          {field('pv', <NumberField label="Present value (PV)" value={pv} onChange={setPv} hint="Negative for money you pay out, such as a deposit." />)}
          {field('pmt', <NumberField label="Payment per period (PMT)" value={pmt} onChange={setPmt} hint="Negative for payments or deposits you make." />)}
          {field('fv', <NumberField label="Future value (FV)" value={fv} onChange={setFv} />)}
          {field('rate', <NumberField label="Annual interest rate (I/Y)" suffix="%" value={annualRate} onChange={setAnnualRate} />)}
          {field('periods', <NumberField label="Number of periods (N)" value={periods} onChange={setPeriods} min="0" />)}
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Periods per year"
              value={perYear}
              onChange={setPerYear}
              options={[
                { value: '1', label: 'Annual (1)' },
                { value: '2', label: 'Semi-annual (2)' },
                { value: '4', label: 'Quarterly (4)' },
                { value: '12', label: 'Monthly (12)' },
              ]}
            />
            <SelectField
              label="Payment timing"
              value={timing}
              onChange={setTiming}
              options={[
                { value: 'end', label: 'End of period' },
                { value: 'begin', label: 'Beginning of period' },
              ]}
            />
          </div>
        </>
      }
      results={
        display ? (
          <Results
            items={[{ label: TARGETS.find((t) => t.value === solveFor)!.label, value: display, primary: true }]}
            note={<p>Positive results are money you receive; negative results are money you pay.</p>}
          />
        ) : (
          <EmptyResults message={result === null ? 'Fill in the other four values.' : 'No solution for these inputs. Check that cash flows have opposite signs.'} />
        )
      }
    />
  );
}
