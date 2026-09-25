import { useMemo, useState } from 'react';
import { COMMON_LIMITS, textStats } from '../../lib/calc/text-stats';
import { formatNumber } from '../../lib/format';
import { TextAreaField } from '../ui/fields';

export default function CharacterCounter() {
  const [text, setText] = useState('');
  const s = useMemo(() => textStats(text), [text]);
  const stats: [string, string][] = [
    ['Characters', formatNumber(s.characters, 0)],
    ['Without spaces', formatNumber(s.charactersNoSpaces, 0)],
    ['Words', formatNumber(s.words, 0)],
    ['Sentences', formatNumber(s.sentences, 0)],
    ['Paragraphs', formatNumber(s.paragraphs, 0)],
    ['Reading time', s.words ? `${Math.max(1, Math.round(s.readingMinutes))} min` : '0 min'],
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md shadow-gray-200/60 md:p-8">
      <TextAreaField label="Your text" value={text} onChange={setText} rows={8} placeholder="Type or paste text here." />
      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" aria-live="polite">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-lg border border-brand-100 bg-brand-50 p-3 text-center">
            <dt className="text-xs text-gray-600">{label}</dt>
            <dd className="text-2xl font-bold text-gray-900 tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
      <h2 className="mt-6 font-semibold text-gray-900">Fits common limits?</h2>
      <ul className="mt-2 grid gap-2 sm:grid-cols-2">
        {COMMON_LIMITS.map((l) => {
          const over = s.characters > l.limit;
          return (
            <li key={l.label} className="flex items-center justify-between gap-3 rounded-md border border-gray-200 px-3 py-2 text-sm">
              <span>{l.label} <span className="text-gray-600">({l.limit})</span></span>
              <span className={over ? 'font-semibold text-red-700' : 'font-semibold text-brand-700'}>
                {over ? `${s.characters - l.limit} over` : `${l.limit - s.characters} left`}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
