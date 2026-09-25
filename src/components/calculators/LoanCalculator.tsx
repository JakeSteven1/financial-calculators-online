import { useMemo, useState } from 'react';
import { amortize } from '../../lib/calc/loan';
import { formatCurrency, formatNumber, parseNumber } from '../../lib/format';
import { AmortizationTable } from '../ui/AmortizationTable';
import { CalculatorShell, EmptyResults, NumberField, Results, SelectField } from '../ui/fields';

interface Props {
  defaultAmount?: string;
  defaultRate?: string;
  defaultTerm?: string;
  defaultUnit?: 'years' | 'months';
  /** Show the optional extra monthly payment input. */
  showExtra?: boolean;
  /** Expand the amortization schedule by default. */
  scheduleOpen?: boolean;
}

export default function LoanCalculator({ defaultAmount = '10000', defaultRate = '7', defaultTerm = '5', defaultUnit = 'years', showExtra = false, scheduleOpen = false }: Props) {
  const [amount, setAmount] = useState(defaultAmount);
  const [rate, setRate] = useState(defaultRate);
  const [term, setTerm] = useState(defaultTerm);
  const [unit, setUnit] = useState<'years' | 'months'>(defaultUnit);
  const [extra, setExtra] = useState('0');

  const result = useMemo(() => {
    const p = parseNumber(amount);
    const r = parseNumber(rate);
    const t = parseNumber(term);
    if (!(p > 0) || !(r >= 0) || !(t > 0)) return null;
    const months = Math.round(unit === 'years' ? t * 12 : t);
    if (months < 1 || months > 1200) return null;
    const extraPmt = showExtra ? Math.max(0, parseNumber(extra) || 0) : 0;
    return { base: amortize(p, r, months), withExtra: extraPmt > 0 ? amortize(p, r, months, extraPmt) : null, principal: p };
  }, [amount, rate, term, unit, extra, showExtra]);

  const active = result?.withExtra ?? result?.base;

  return (
    <div>
      <CalculatorShell
        inputs={
          <>
            <NumberField label="Loan amount" prefix="$" value={amount} onChange={setAmount} min="0" />
            <NumberField label="Annual interest rate" suffix="%" value={rate} onChange={setRate} min="0" />
            <div className="grid grid-cols-2 gap-4">
              <NumberField label="Loan term" value={term} onChange={setTerm} min="1" />
              <SelectField label="Unit" value={unit} onChange={setUnit} options={[{ value: 'years', label: 'Years' }, { value: 'months', label: 'Months' }]} />
            </div>
            {showExtra && <NumberField label="Extra payment per month (optional)" prefix="$" value={extra} onChange={setExtra} min="0" />}
          </>
        }
        results={
          result && active ? (
            <Results
              items={[
                { label: 'Monthly payment', value: formatCurrency(result.base.scheduledPayment), primary: true },
                { label: 'Total interest', value: formatCurrency(active.totalInterest) },
                { label: 'Total of all payments', value: formatCurrency(active.totalPaid) },
                { label: 'Number of payments', value: formatNumber(active.payoffMonths, 0) },
                ...(result.withExtra
                  ? [
                      { label: 'Interest saved with extra payments', value: formatCurrency(result.base.totalInterest - result.withExtra.totalInterest) },
                      { label: 'Months saved', value: formatNumber(result.base.payoffMonths - result.withExtra.payoffMonths, 0) },
                    ]
                  : []),
              ]}
            />
          ) : (
            <EmptyResults />
          )
        }
      />
      {active && <AmortizationTable rows={active.rows} defaultOpen={scheduleOpen} />}
    </div>
  );
}
