import { useMemo, useState } from 'react';
import { fromHourly, fromYearly } from '../../lib/calc/wage';
import { formatCurrency, parseNumber } from '../../lib/format';
import { CalculatorShell, EmptyResults, NumberField, Results, SelectField } from '../ui/fields';

type Mode = 'hourly' | 'yearly';

export default function HourlySalaryCalculator() {
  const [mode, setMode] = useState<Mode>('hourly');
  const [amount, setAmount] = useState('20');
  const [hours, setHours] = useState('40');
  const [weeks, setWeeks] = useState('52');

  const r = useMemo(() => {
    const a = parseNumber(amount);
    const h = parseNumber(hours);
    const w = parseNumber(weeks);
    if (!(a >= 0) || !(h > 0) || !(w > 0 && w <= 52)) return null;
    return mode === 'hourly' ? fromHourly(a, h, w) : fromYearly(a, h, w);
  }, [mode, amount, hours, weeks]);

  return (
    <CalculatorShell
      inputs={
        <>
          <SelectField label="Convert from" value={mode} onChange={(m) => { setMode(m); setAmount(m === 'hourly' ? '20' : '50000'); }} options={[{ value: 'hourly', label: 'Hourly wage → salary' }, { value: 'yearly', label: 'Yearly salary → hourly' }]} />
          <NumberField label={mode === 'hourly' ? 'Hourly wage' : 'Yearly salary'} prefix="$" value={amount} onChange={setAmount} min="0" />
          <NumberField label="Hours per week" value={hours} onChange={setHours} min="1" />
          <NumberField label="Paid weeks per year" value={weeks} onChange={setWeeks} min="1" max="52" hint="52 if you're paid for vacation and holidays." />
        </>
      }
      results={
        r ? (
          <Results
            items={[
              mode === 'hourly' ? { label: 'Yearly salary', value: formatCurrency(r.yearly), primary: true } : { label: 'Hourly wage', value: formatCurrency(r.hourly), primary: true },
              ...(mode === 'hourly' ? [] : [{ label: 'Yearly', value: formatCurrency(r.yearly) }]),
              { label: 'Monthly', value: formatCurrency(r.monthly) },
              { label: 'Biweekly', value: formatCurrency(r.biweekly) },
              { label: 'Weekly', value: formatCurrency(r.weekly) },
              { label: 'Daily (5-day week)', value: formatCurrency(r.daily) },
            ]}
            note={<p>Figures are before taxes and deductions.</p>}
          />
        ) : (
          <EmptyResults />
        )
      }
    />
  );
}
