import { useMemo, useState } from 'react';
import { textStats } from '../../lib/calc/text-stats';
import { formatNumber, formatPercent } from '../../lib/format';
import { NumberField, SelectField, TextAreaField } from '../ui/fields';

const WINDOWS = [
  { value: '8000', label: '8K tokens' },
  { value: '32000', label: '32K tokens' },
  { value: '128000', label: '128K tokens' },
  { value: '200000', label: '200K tokens' },
  { value: '1000000', label: '1M tokens' },
  { value: 'custom', label: 'Custom' },
];

export default function AiContextCalculator() {
  const [text, setText] = useState('');
  const [windowSize, setWindowSize] = useState('128000');
  const [custom, setCustom] = useState('50000');
  const s = useMemo(() => textStats(text), [text]);
  const limit = windowSize === 'custom' ? Number(custom) || 0 : Number(windowSize);
  const used = limit > 0 ? (s.estimatedTokens / limit) * 100 : NaN;
  const status = !Number.isFinite(used) ? '' : used >= 100 ? 'Over the limit: the model can no longer see the start of this conversation.' : used >= 80 ? 'Getting close: start a new chat or summarize soon.' : 'Plenty of room left.';

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <TextAreaField label="Paste your whole conversation" value={text} onChange={setText} rows={10} placeholder="Paste the full chat, including your messages and the AI's replies." />
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <SelectField label="Model context window" value={windowSize} onChange={setWindowSize} options={WINDOWS} />
        {windowSize === 'custom' && <NumberField label="Custom context window" suffix="tokens" value={custom} onChange={setCustom} min="1" />}
      </div>
      <div className="mt-6 rounded-lg bg-brand-50 p-5" aria-live="polite">
        <div className="flex items-baseline justify-between">
          <p className="text-sm text-slate-600">Estimated tokens used</p>
          <p className="text-sm font-semibold">{formatPercent(Math.min(used, 999), 1)} of {formatNumber(limit, 0)}</p>
        </div>
        <p className="text-4xl font-bold text-brand-800">{formatNumber(s.estimatedTokens, 0)}</p>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-white">
          <div className={`h-full ${used >= 100 ? 'bg-red-600' : used >= 80 ? 'bg-amber-500' : 'bg-brand-600'}`} style={{ width: `${Math.min(100, used || 0)}%` }} />
        </div>
        {text && <p className="mt-3 font-medium text-slate-800">{status}</p>}
        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          {[
            ['Words', s.words],
            ['Unique words', s.uniqueWords],
            ['Characters', s.characters],
            ['Complexity score', s.complexity.score],
          ].map(([label, value]) => (
            <div key={label} className="rounded-md bg-white p-3">
              <dt className="text-slate-600">{label}</dt>
              <dd className="text-lg font-semibold tabular-nums">{formatNumber(Number(value), 0)}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-slate-500">
          Word lengths: {s.complexity.simple} simple (≤4 letters), {s.complexity.moderate} moderate (5–7), {s.complexity.complex} complex (8+).
        </p>
      </div>
    </div>
  );
}
