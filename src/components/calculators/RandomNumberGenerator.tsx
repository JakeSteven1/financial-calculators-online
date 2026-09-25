import { useState } from 'react';
import { toCsv } from '../../lib/calc/giveaway';
import { randomInt } from '../../lib/calc/random';
import { generateRandomNumbers } from '../../lib/calc/random-numbers';
import { parseNumber } from '../../lib/format';
import { Button, NumberField } from '../ui/fields';
import ResultActions, { fileStamp, formatDrawTime } from '../giveaway/ResultActions';
import { RollingDisplay, useDrawReveal } from '../giveaway/reveal';

interface Draw {
  numbers: number[];
  min: number;
  max: number;
  allowRepeats: boolean;
  drawnAt: Date;
}

/** Above this many numbers, show a compact list instead of one card per number. */
const MAX_CARDS = 50;

const fmt = (n: number) => n.toLocaleString('en-US');

export default function RandomNumberGenerator() {
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState('1');
  const [allowRepeats, setAllowRepeats] = useState(false);
  const [sort, setSort] = useState(false);
  const [draw, setDraw] = useState<Draw | null>(null);
  const [error, setError] = useState('');
  const { rolling, run } = useDrawReveal();

  function generate() {
    const input = { min: parseNumber(min), max: parseNumber(max), count: parseNumber(count), allowRepeats, sort };
    const res = generateRandomNumbers(input);
    setDraw(null);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setError('');
    const lo = Math.ceil(Math.min(input.min, input.max));
    const hi = Math.floor(Math.max(input.min, input.max));
    const finished: Draw = { numbers: res.numbers, min: lo, max: hi, allowRepeats, drawnAt: new Date() };
    run(() => fmt(randomInt(lo, hi)), () => setDraw(finished));
  }

  return (
    <div className="grid gap-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-md shadow-gray-200/60 md:grid-cols-2 md:gap-8 md:p-8">
      <div className="min-w-0 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <NumberField label="Minimum" value={min} onChange={setMin} step="1" />
          <NumberField label="Maximum" value={max} onChange={setMax} step="1" />
        </div>
        <NumberField label="How many numbers" value={count} onChange={setCount} min="1" max="10000" step="1" hint="1 to 10,000" />
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={allowRepeats} onChange={(e) => setAllowRepeats(e.target.checked)} /> Allow repeats
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={sort} onChange={(e) => setSort(e.target.checked)} /> Sort results
        </label>
        <Button onClick={generate} disabled={rolling !== null}>{draw ? 'Generate again' : 'Generate'}</Button>
      </div>
      <div className="min-w-0 self-start rounded-xl border border-brand-100 bg-brand-50 p-5 md:p-6" aria-live="polite">
        {error ? (
          <p className="text-red-700">{error}</p>
        ) : rolling !== null ? (
          <RollingDisplay value={rolling} />
        ) : !draw ? (
          <p className="text-gray-600">Set a range and press Generate.</p>
        ) : (
          <NumberResults draw={draw} />
        )}
      </div>
    </div>
  );
}

function NumberResults({ draw }: { draw: Draw }) {
  const { numbers } = draw;
  const when = formatDrawTime(draw.drawnAt);
  const range = `${fmt(draw.min)} to ${fmt(draw.max)}`;
  const csv = toCsv([
    ['Draw', 'Number', 'Drawn at', 'Min', 'Max'],
    ...numbers.map((n, i) => [i + 1, n, draw.drawnAt.toISOString(), draw.min, draw.max]),
  ]);
  const copyText = `${numbers.join(', ')}\n\nDrawn ${when}, range ${range}, ${draw.allowRepeats ? 'repeats allowed' : 'no repeats'}.`;

  return (
    <div>
      {numbers.length === 1 ? (
        <div className="text-center">
          <p className="text-sm text-gray-600">Your random number</p>
          <p className="mt-2 break-all text-6xl font-bold tracking-tight text-gray-900 tabular-nums motion-safe:animate-reveal">{fmt(numbers[0]!)}</p>
        </div>
      ) : (
        <>
          <h2 className="text-lg font-semibold text-gray-900">{fmt(numbers.length)} random numbers</h2>
          {numbers.length <= MAX_CARDS ? (
            <ol className="mt-3 flex flex-wrap gap-2" aria-label="Random numbers">
              {numbers.map((n, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-brand-200 bg-white px-3 py-1.5 font-mono text-lg font-semibold text-brand-800 tabular-nums motion-safe:animate-reveal"
                  style={{ animationDelay: `${Math.min(i, 20) * 50}ms` }}
                >
                  {n}
                </li>
              ))}
            </ol>
          ) : (
            <p tabIndex={0} aria-label="Random numbers" className="mt-3 max-h-72 overflow-auto rounded-lg border border-brand-200 bg-white p-3 font-mono text-gray-900 break-words">
              {numbers.join(', ')}
            </p>
          )}
        </>
      )}
      <p className="mt-4 text-sm text-gray-600">
        Drawn {when}. Range {range}, {draw.allowRepeats ? 'repeats allowed' : 'no repeats'}.
      </p>
      <div className="mt-4">
        <ResultActions
          copyText={copyText}
          copyLabel={numbers.length > 1 ? 'Copy numbers' : 'Copy number'}
          csv={csv}
          csvName={`random-numbers-${fileStamp(draw.drawnAt)}.csv`}
        />
      </div>
    </div>
  );
}
