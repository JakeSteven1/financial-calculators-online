import { useMemo, useState } from 'react';
import { mean, median, mode, parseDataset, quartiles, sortAsc, standardDeviation, sum, variance, type QuartileMethod } from '../../lib/calc/stats';
import { formatNumber } from '../../lib/format';
import { SelectField, TextAreaField } from '../ui/fields';

export type StatsFocus = 'mean' | 'median' | 'mode' | 'quartiles' | 'stdev';

const fmt = (v: number) => formatNumber(v, 6);

/** One dataset input, with the page's focus statistic shown first and a full summary below. */
export default function StatsCalculator({ focus }: { focus: StatsFocus }) {
  const [text, setText] = useState('6, 7, 15, 36, 39, 40, 41, 42, 43, 47, 49');
  const [method, setMethod] = useState<QuartileMethod>('exclusive');
  const [kind, setKind] = useState<'sample' | 'population'>('sample');

  const data = useMemo(() => parseDataset(text), [text]);
  const v = data.values;
  const n = v.length;
  const sorted = useMemo(() => sortAsc(v), [v]);
  const q = useMemo(() => quartiles(v, method), [v, method]);
  const m = useMemo(() => mode(v), [v]);

  const modeText = m.modes.length ? `${m.modes.map(fmt).join(', ')} (appears ${m.frequency}×)` : 'No mode (no value repeats)';

  const primary: Record<StatsFocus, { label: string; value: string; detail: string }> = {
    mean: { label: 'Mean (average)', value: fmt(mean(v)), detail: `Sum ${fmt(sum(v))} ÷ ${n} values` },
    median: {
      label: 'Median',
      value: fmt(median(v)),
      detail: n % 2 ? `Middle value is position ${(n + 1) / 2} of ${n}` : `Average of positions ${n / 2} and ${n / 2 + 1} of ${n}`,
    },
    mode: { label: m.modes.length > 1 ? 'Modes' : 'Mode', value: m.modes.length ? m.modes.map(fmt).join(', ') : 'None', detail: m.modes.length ? `Each appears ${m.frequency} times` : 'Every value appears only once' },
    quartiles: { label: 'Interquartile range (IQR)', value: q ? fmt(q.iqr) : '—', detail: q ? `Q1 ${fmt(q.q1)} · Q2 ${fmt(q.q2)} · Q3 ${fmt(q.q3)}` : '' },
    stdev: {
      label: `${kind === 'sample' ? 'Sample' : 'Population'} standard deviation`,
      value: fmt(standardDeviation(v, kind)),
      detail: `Variance ${fmt(variance(v, kind))}, divided by ${kind === 'sample' ? 'n − 1' : 'n'}`,
    },
  };

  const summary: [string, string][] = [
    ['Count (n)', String(n)],
    ['Sum', fmt(sum(v))],
    ['Mean', fmt(mean(v))],
    ['Median', fmt(median(v))],
    ['Mode', modeText],
    ['Minimum', q ? fmt(q.min) : '—'],
    ['Maximum', q ? fmt(q.max) : '—'],
    ['Range', q ? fmt(q.max - q.min) : '—'],
    ['Q1', q ? fmt(q.q1) : '—'],
    ['Q3', q ? fmt(q.q3) : '—'],
    ['IQR', q ? fmt(q.iqr) : '—'],
    ['Sample std. deviation', fmt(standardDeviation(v, 'sample'))],
    ['Population std. deviation', fmt(standardDeviation(v, 'population'))],
    ['Sample variance', fmt(variance(v, 'sample'))],
  ];

  const p = primary[focus];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <TextAreaField label="Data set" value={text} onChange={setText} rows={6} hint="Separate numbers with commas, spaces, or new lines. You can paste a spreadsheet column." />
          {focus === 'quartiles' && (
            <SelectField
              label="Quartile method"
              value={method}
              onChange={setMethod}
              options={[
                { value: 'exclusive', label: 'Median of halves (textbook, TI-83)' },
                { value: 'inclusive', label: 'Linear interpolation (Excel QUARTILE.INC)' },
              ]}
            />
          )}
          {focus === 'stdev' && (
            <SelectField
              label="Data is a"
              value={kind}
              onChange={setKind}
              options={[
                { value: 'sample', label: 'Sample (divide by n − 1)' },
                { value: 'population', label: 'Population (divide by n)' },
              ]}
            />
          )}
          {data.invalid.length > 0 && <p className="text-sm text-amber-700">Ignored non-numbers: {data.invalid.slice(0, 8).join(', ')}</p>}
        </div>
        <div className="rounded-lg bg-brand-50 p-5" aria-live="polite">
          {n === 0 ? (
            <p className="text-slate-600">Enter at least one number.</p>
          ) : (
            <>
              <p className="text-sm text-slate-600">{p.label}</p>
              <p className="mt-1 text-4xl font-bold text-brand-800 break-all">{p.value}</p>
              <p className="mt-2 text-sm text-slate-600">{p.detail}</p>
              {focus === 'quartiles' && q && q.outliers.length > 0 && (
                <p className="mt-2 text-sm text-slate-700">Outliers (outside {fmt(q.lowerFence)} to {fmt(q.upperFence)}): {q.outliers.map(fmt).join(', ')}</p>
              )}
              <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">Sorted data</p>
              <p className="mt-1 max-h-24 overflow-auto font-mono text-sm text-slate-800 break-words">{sorted.map(fmt).join(', ')}</p>
            </>
          )}
        </div>
      </div>
      {n > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-slate-900">Summary statistics</h3>
          <dl className="mt-2 grid gap-x-8 gap-y-1 text-sm sm:grid-cols-2">
            {summary.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 border-b border-slate-100 py-1">
                <dt className="text-slate-600">{label}</dt>
                <dd className="text-right font-medium text-slate-900 tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
