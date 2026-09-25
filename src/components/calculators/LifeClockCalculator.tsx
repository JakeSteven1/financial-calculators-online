import { useMemo, useState } from 'react';
import { LIFE_EXPECTANCY, lifeClock, parseDateInput, timeLived } from '../../lib/calc/life-time';
import { formatNumber } from '../../lib/format';
import { NumberField, SelectField, TextField } from '../ui/fields';

type Group = 'all' | 'male' | 'female' | 'custom';

function ClockFace({ hours24, minutes }: { hours24: number; minutes: number }) {
  const hourAngle = ((hours24 % 12) + minutes / 60) * 30;
  const minuteAngle = minutes * 6;
  const hand = (angle: number, length: number, width: number) => (
    <line x1="100" y1="100" x2={100 + length * Math.sin((angle * Math.PI) / 180)} y2={100 - length * Math.cos((angle * Math.PI) / 180)} stroke="#1e40af" strokeWidth={width} strokeLinecap="round" />
  );
  return (
    <svg viewBox="0 0 200 200" className="mx-auto h-48 w-48" role="img" aria-label="Life clock face">
      <circle cx="100" cy="100" r="92" fill="#fff" stroke="#2563eb" strokeWidth="4" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        return <line key={i} x1={100 + 78 * Math.sin(a)} y1={100 - 78 * Math.cos(a)} x2={100 + 86 * Math.sin(a)} y2={100 - 86 * Math.cos(a)} stroke="#6b7280" strokeWidth="3" />;
      })}
      {hand(hourAngle, 48, 6)}
      {hand(minuteAngle, 70, 3)}
      <circle cx="100" cy="100" r="5" fill="#1e40af" />
    </svg>
  );
}

export default function LifeClockCalculator() {
  const [birth, setBirth] = useState('');
  const [group, setGroup] = useState<Group>('all');
  const [custom, setCustom] = useState('80');

  const result = useMemo(() => {
    const date = parseDateInput(birth);
    const expectancy = group === 'custom' ? Number(custom) : LIFE_EXPECTANCY[group];
    if (!date || !(expectancy > 0)) return null;
    const lived = timeLived(date, new Date());
    if (!lived) return null;
    return { clock: lifeClock(lived.ageYears, expectancy), age: lived.ageYears, expectancy };
  }, [birth, group, custom]);

  return (
    <div className="grid gap-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-md shadow-gray-200/60 md:p-8 md:grid-cols-2 md:gap-8">
      <div className="space-y-4">
        <TextField label="Birthdate" type="date" value={birth} onChange={setBirth} />
        <SelectField
          label="Life expectancy"
          value={group}
          onChange={setGroup}
          options={[
            { value: 'all', label: `US average (${LIFE_EXPECTANCY.all} years)` },
            { value: 'male', label: `US male (${LIFE_EXPECTANCY.male} years)` },
            { value: 'female', label: `US female (${LIFE_EXPECTANCY.female} years)` },
            { value: 'custom', label: 'Custom' },
          ]}
        />
        {group === 'custom' && <NumberField label="Custom life expectancy" suffix="years" value={custom} onChange={setCustom} min="1" />}
      </div>
      <div className="rounded-xl border border-brand-100 bg-brand-50 p-5 text-center" aria-live="polite">
        {result ? (
          <>
            <ClockFace hours24={result.clock.hours24} minutes={result.clock.minutes} />
            <p className="mt-3 text-sm text-gray-600">Your life clock reads</p>
            <p className="text-4xl font-bold tracking-tight text-gray-900">{result.clock.label}</p>
            <p className="mt-3 text-sm text-gray-600">
              At {formatNumber(result.age, 1)} years old you are {formatNumber(Math.min(result.clock.percent, 100), 1)}% of the way through a {result.expectancy}-year life.
            </p>
          </>
        ) : (
          <p className="text-gray-600">{birth ? 'Enter a birthdate in the past.' : 'Enter your birthdate to see your life clock.'}</p>
        )}
      </div>
    </div>
  );
}
