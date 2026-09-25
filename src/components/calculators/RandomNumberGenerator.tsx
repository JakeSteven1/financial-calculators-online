import { useState } from 'react';
import { generateRandomNumbers } from '../../lib/calc/random-numbers';
import { parseNumber } from '../../lib/format';
import { Button, NumberField } from '../ui/fields';

export default function RandomNumberGenerator() {
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState('1');
  const [allowRepeats, setAllowRepeats] = useState(false);
  const [sort, setSort] = useState(false);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [error, setError] = useState('');

  function generate() {
    const res = generateRandomNumbers({ min: parseNumber(min), max: parseNumber(max), count: parseNumber(count), allowRepeats, sort });
    if (res.ok) {
      setNumbers(res.numbers);
      setError('');
    } else {
      setNumbers([]);
      setError(res.error);
    }
  }

  return (
    <div className="grid gap-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-md shadow-gray-200/60 md:p-8 md:grid-cols-2 md:gap-8">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <NumberField label="Minimum" value={min} onChange={setMin} step="1" />
          <NumberField label="Maximum" value={max} onChange={setMax} step="1" />
        </div>
        <NumberField label="How many numbers" value={count} onChange={setCount} min="1" max="10000" step="1" />
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={allowRepeats} onChange={(e) => setAllowRepeats(e.target.checked)} /> Allow repeats
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={sort} onChange={(e) => setSort(e.target.checked)} /> Sort results
        </label>
        <Button onClick={generate}>Generate</Button>
      </div>
      <div className="rounded-xl border border-brand-100 bg-brand-50 p-5" aria-live="polite">
        {error ? (
          <p className="text-red-700">{error}</p>
        ) : numbers.length === 0 ? (
          <p className="text-gray-600">Set a range and press Generate.</p>
        ) : numbers.length === 1 ? (
          <div className="text-center">
            <p className="text-sm text-gray-600">Your random number</p>
            <p className="mt-2 text-6xl font-bold tracking-tight text-gray-900 tabular-nums break-all">{numbers[0]}</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600">{numbers.length} random numbers</p>
            <p className="mt-2 max-h-72 overflow-auto font-mono text-lg text-gray-900 break-words">{numbers.join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
