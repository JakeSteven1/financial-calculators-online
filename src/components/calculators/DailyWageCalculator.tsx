import { useMemo, useState } from 'react';
import { salaryToDaily } from '../../lib/calc/wage';
import { formatCurrency, parseNumber } from '../../lib/format';
import { CalculatorShell, EmptyResults, NumberField, Results } from '../ui/fields';

export default function DailyWageCalculator() {
  const [salary, setSalary] = useState('65000');
  const [days, setDays] = useState('5');
  const [hours, setHours] = useState('8');
  const [unpaid, setUnpaid] = useState('0');

  const r = useMemo(() => {
    const s = parseNumber(salary);
    const d = parseNumber(days);
    const h = parseNumber(hours);
    if (!(s >= 0) || !(d > 0 && d <= 7) || !(h > 0)) return null;
    const res = salaryToDaily(s, d, h, parseNumber(unpaid) || 0);
    return Number.isFinite(res.perWorkday) ? res : null;
  }, [salary, days, hours, unpaid]);

  return (
    <CalculatorShell
      inputs={
        <>
          <NumberField label="Yearly salary" prefix="$" value={salary} onChange={setSalary} min="0" />
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="Workdays per week" value={days} onChange={setDays} min="1" max="7" />
            <NumberField label="Hours per workday" value={hours} onChange={setHours} min="1" />
          </div>
          <NumberField label="Unpaid days off per year" value={unpaid} onChange={setUnpaid} min="0" hint="Paid holidays and vacation don't count here." />
        </>
      }
      results={
        r ? (
          <Results
            items={[
              { label: 'You make per workday', value: formatCurrency(r.perWorkday), primary: true },
              { label: 'Per calendar day (÷ 365)', value: formatCurrency(r.perCalendarDay) },
              { label: 'Per hour', value: formatCurrency(r.perHour) },
              { label: 'Paid workdays per year', value: String(r.workdays) },
            ]}
            note={<p>Before taxes and deductions.</p>}
          />
        ) : (
          <EmptyResults />
        )
      }
    />
  );
}
