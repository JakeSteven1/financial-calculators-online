import { useMemo, useState } from 'react';
import { amortize, monthlyPayment, monthsToPayoff } from '../../lib/calc/loan';
import { formatCurrency, parseNumber } from '../../lib/format';
import { CalculatorShell, EmptyResults, NumberField, Results } from '../ui/fields';
import { formatMonths } from './RefinanceCalculator';

type Payoff = { months: number; totalInterest: number; totalPaid: number; payoff: Date } | { error: string };

const monthFmt = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });

export default function MortgageLengthCalculator() {
  const [balance, setBalance] = useState('250000');
  const [rate, setRate] = useState('6.5');
  const [payment, setPayment] = useState('2000');

  const r = useMemo((): Payoff | null => {
    const p = parseNumber(balance);
    const i = parseNumber(rate);
    const m = parseNumber(payment);
    if (!(p > 0) || !(i >= 0) || !(m > 0)) return null;
    const months = monthsToPayoff(p, i, m);
    if (!Number.isFinite(months)) return { error: `The payment must be more than ${formatCurrency((p * i) / 1200)}, the first month's interest.` };
    const whole = Math.ceil(months - 1e-9);
    // Schedule with the exact payment: scheduled payment for `whole` months plus the extra above it.
    const schedule = amortize(p, i, whole, Math.max(0, m - monthlyPayment(p, i, whole)));
    const payoff = new Date();
    payoff.setMonth(payoff.getMonth() + whole);
    return { months: whole, totalInterest: schedule.totalInterest, totalPaid: schedule.totalPaid, payoff };
  }, [balance, rate, payment]);

  return (
    <CalculatorShell
      inputs={
        <>
          <NumberField label="Loan balance" prefix="$" value={balance} onChange={setBalance} min="0" />
          <NumberField label="Interest rate" suffix="%" value={rate} onChange={setRate} min="0" />
          <NumberField label="Monthly payment (principal and interest)" prefix="$" value={payment} onChange={setPayment} min="0" />
        </>
      }
      results={
        r && !('error' in r) ? (
          <Results
            items={[
              { label: 'Time to pay off', value: formatMonths(r.months), primary: true },
              { label: 'Payoff date', value: monthFmt.format(r.payoff) },
              { label: 'Total interest', value: formatCurrency(r.totalInterest, { whole: true }) },
              { label: 'Total paid', value: formatCurrency(r.totalPaid, { whole: true }) },
            ]}
          />
        ) : (
          <EmptyResults message={r && 'error' in r ? r.error : undefined} />
        )
      }
    />
  );
}
