import { useMemo, useState } from 'react';
import { analyzeEmailList } from '../../lib/calc/email-list';
import { sampleWithoutReplacement, weightedSampleWithoutReplacement } from '../../lib/calc/random';
import { Button, NumberField, TextAreaField } from '../ui/fields';

interface Props {
  /** Offer the "duplicates count as extra entries" option. */
  allowWeighting?: boolean;
}

export default function EmailWinnerPicker({ allowWeighting = false }: Props) {
  const [text, setText] = useState('');
  const [count, setCount] = useState('1');
  const [weighted, setWeighted] = useState(false);
  const [winners, setWinners] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const analysis = useMemo(() => analyzeEmailList(text), [text]);
  const numWinners = Math.max(1, Math.floor(Number(count) || 1));
  const eligible = analysis.unique.length;
  const useWeights = allowWeighting && weighted;

  function draw() {
    setCopied(false);
    setWinners(
      useWeights
        ? weightedSampleWithoutReplacement(analysis.counts, numWinners)
        : sampleWithoutReplacement(analysis.unique, numWinners),
    );
  }

  async function copyWinners() {
    try {
      await navigator.clipboard.writeText(winners.join('\n'));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const stats = [
    ['Total entries', analysis.total],
    ['Eligible (unique valid)', eligible],
    [useWeights ? 'Extra entries from repeats' : 'Duplicates removed', analysis.duplicates],
    ['Invalid', analysis.invalid.length],
  ] as const;

  return (
    <div className="grid gap-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-md shadow-gray-200/60 md:p-8 md:grid-cols-2 md:gap-8">
      <div className="space-y-4">
        <TextAreaField
          label="Email entries (one per line, or separated by commas)"
          value={text}
          onChange={(v) => { setText(v); setWinners([]); }}
          rows={10}
          placeholder={'jane@example.com\njohn@example.com\nsam@example.com'}
        />
        <NumberField label="Number of winners" value={count} onChange={setCount} min="1" step="1" />
        {allowWeighting && (
          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input type="checkbox" className="mt-1" checked={weighted} onChange={(e) => { setWeighted(e.target.checked); setWinners([]); }} />
            <span>Weighted entries: an email listed more than once gets one extra chance per repeat. Winners are still unique.</span>
          </label>
        )}
        <div className="flex flex-wrap gap-3">
          <Button onClick={draw}>{numWinners > 1 ? 'Select winners' : 'Select winner'}</Button>
          <Button variant="secondary" onClick={() => { setText(''); setWinners([]); }}>Clear</Button>
        </div>
      </div>
      <div className="rounded-xl border border-brand-100 bg-brand-50 p-5" aria-live="polite">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          {stats.map(([label, value]) => (
            <div key={label}>
              <dt className="text-gray-600">{label}</dt>
              <dd className="text-xl font-semibold text-gray-900">{value}</dd>
            </div>
          ))}
        </dl>
        {winners.length > 0 ? (
          <div className="mt-5 border-t border-brand-100 pt-4">
            <h2 className="font-semibold text-gray-900">{winners.length > 1 ? 'Winners' : 'Winner'}</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-6 text-lg font-semibold text-brand-800">
              {winners.map((w) => <li key={w} className="break-all">{w}</li>)}
            </ol>
            {winners.length < numWinners && (
              <p className="mt-2 text-sm text-gray-600">Only {winners.length} eligible entries, so fewer winners were drawn.</p>
            )}
            <div className="mt-3"><Button variant="secondary" onClick={copyWinners}>{copied ? 'Copied' : 'Copy winners'}</Button></div>
          </div>
        ) : (
          <p className="mt-5 text-gray-600">{eligible ? 'Ready to draw.' : 'Paste your entries to get started.'}</p>
        )}
        {analysis.invalid.length > 0 && (
          <p className="mt-4 text-xs text-gray-600 break-all">Skipped: {analysis.invalid.slice(0, 5).join(', ')}{analysis.invalid.length > 5 ? '…' : ''}</p>
        )}
      </div>
    </div>
  );
}
