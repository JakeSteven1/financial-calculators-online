import { useEffect, useState } from 'react';
import { LIFE_EXPECTANCY, parseDateInput, percentOfLifeExpectancy, secondMilestones, timeLived } from '../../lib/calc/life-time';
import { formatNumber } from '../../lib/format';
import { TextField } from '../ui/fields';

const dateFmt = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' });

export default function LifeSecondsCalculator() {
  const [birth, setBirth] = useState('');
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const birthDate = parseDateInput(birth);
  const lived = birthDate ? timeLived(birthDate, now) : null;
  const pct = lived ? percentOfLifeExpectancy(lived.ageYears, LIFE_EXPECTANCY.all) : 0;
  const units: [string, number][] = lived
    ? [['Minutes', lived.minutes], ['Hours', lived.hours], ['Days', lived.days], ['Weeks', lived.weeks], ['Months', lived.months], ['Years', lived.years]]
    : [];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md shadow-gray-200/60 md:p-8">
      <div className="max-w-xs">
        <TextField label="Your birthdate" type="date" value={birth} onChange={setBirth} />
      </div>
      <div className="mt-6 rounded-xl border border-brand-100 bg-brand-50 p-5" aria-live="off">
        {!lived ? (
          <p className="text-gray-600">{birth ? 'Enter a birthdate in the past.' : 'Enter your birthdate to start the counter.'}</p>
        ) : (
          <>
            <p className="text-center text-sm text-gray-600">You have been alive for</p>
            <p className="mt-1 text-center text-4xl font-bold tracking-tight text-gray-900 tabular-nums sm:text-5xl">{formatNumber(lived.seconds, 0)}</p>
            <p className="text-center text-sm text-gray-600">seconds and counting</p>
            <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {units.map(([label, value]) => (
                <div key={label} className="rounded-md bg-white p-3 text-center">
                  <dt className="text-xs uppercase tracking-wide text-gray-600">{label}</dt>
                  <dd className="text-xl font-semibold text-gray-900 tabular-nums">{formatNumber(value, 0)}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Share of US average life expectancy ({LIFE_EXPECTANCY.all} years)</span>
                <span className="font-semibold">{formatNumber(Math.min(pct, 100), 1)}%</span>
              </div>
              <div className="mt-1 h-3 overflow-hidden rounded-full bg-white">
                <div className="h-full bg-brand-600" style={{ width: `${Math.min(pct, 100)}%` }} />
              </div>
            </div>
            <h2 className="mt-6 font-semibold text-gray-900">Second milestones</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {secondMilestones(birthDate!, now).map((m) => (
                <li key={m.label} className={m.reached ? 'text-gray-600' : 'text-gray-800'}>
                  {m.reached ? '✓' : '○'} {m.label}: {dateFmt.format(m.date)}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
