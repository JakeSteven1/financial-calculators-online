import { useDeferredValue, useMemo, useState } from 'react';
import { MAX_ALTERNATES, MAX_WINNERS, clampCount, cleanEntries, drawWinners } from '../../lib/calc/giveaway';
import { cryptoRng } from '../../lib/calc/random';
import { PICKSAFELY_URL } from '../../data/site';
import { Button, NumberField } from '../ui/fields';
import EntryInput from '../giveaway/EntryInput';
import WinnerResults, { type FinishedDraw } from '../giveaway/WinnerResults';
import { RollingDisplay, useDrawReveal } from '../giveaway/reveal';

interface Props {
  /** Offer the "duplicates count as extra entries" option. */
  allowWeighting?: boolean;
  /** Label for the entries box. */
  entriesLabel?: string;
  /** Show the one-line PickSafely mention under finished results. */
  promo?: boolean;
}

const fmt = (n: number) => n.toLocaleString('en-US');

export default function EmailWinnerPicker({ allowWeighting = false, entriesLabel = 'Entries', promo = false }: Props) {
  const [text, setText] = useState('');
  const [emailsOnly, setEmailsOnly] = useState(true);
  const [weighted, setWeighted] = useState(false);
  const [winnersIn, setWinnersIn] = useState('1');
  const [alternatesIn, setAlternatesIn] = useState('0');
  const [draw, setDraw] = useState<FinishedDraw | null>(null);
  const { rolling, run } = useDrawReveal();

  // Deferred so typing stays responsive with very large lists.
  const deferredText = useDeferredValue(text);
  const list = useMemo(() => cleanEntries(deferredText, { emailsOnly }), [deferredText, emailsOnly]);
  const useWeights = allowWeighting && weighted;
  const entrants = list.entries.length;
  const tickets = useWeights ? list.found - list.invalid : entrants;
  const numWinners = clampCount(winnersIn, 1, MAX_WINNERS);
  const numAlternates = clampCount(alternatesIn, 0, MAX_ALTERNATES);

  function reset<T>(setter: (v: T) => void) {
    return (v: T) => { setter(v); setDraw(null); };
  }

  function start() {
    // Use the live text in case the deferred value hasn't caught up yet.
    const current = deferredText === text ? list : cleanEntries(text, { emailsOnly });
    if (current.entries.length === 0) return;
    const result = drawWinners(current.entries, numWinners, numAlternates, useWeights ? current.counts : undefined);
    const finished: FinishedDraw = {
      ...result,
      drawnAt: new Date(),
      entrants: current.entries.length,
      tickets: useWeights ? current.counts.reduce((s, c) => s + c, 0) : current.entries.length,
      weighted: useWeights,
      requestedWinners: numWinners,
      requestedAlternates: numAlternates,
    };
    setDraw(null);
    const pool = current.entries;
    run(() => pool[Math.floor(cryptoRng() * pool.length)]!, () => setDraw(finished));
  }

  const stats: [string, number][] = [
    ['Entries found', list.found],
    useWeights ? ['Extra entries from repeats', list.duplicates] : ['Duplicates removed', list.duplicates],
    ['Invalid emails removed', list.invalid],
  ];
  if (useWeights) stats.push(['Unique entrants', entrants]);

  return (
    <div className="grid gap-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-md shadow-gray-200/60 md:grid-cols-2 md:gap-8 md:p-8">
      <div className="min-w-0 space-y-4">
        <EntryInput
          label={entriesLabel}
          value={text}
          onChange={reset(setText)}
          placeholder={'jane@example.com\njohn@example.com\nsam@example.com'}
        />
        <label className="flex items-start gap-2 text-sm text-gray-700">
          <input type="checkbox" className="mt-1" checked={emailsOnly} onChange={(e) => reset(setEmailsOnly)(e.target.checked)} />
          <span>Ignore invalid emails. Turn off to draw from names, handles, or any other text.</span>
        </label>
        {allowWeighting && (
          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input type="checkbox" className="mt-1" checked={weighted} onChange={(e) => reset(setWeighted)(e.target.checked)} />
            <span>Weighted entries: an entry listed more than once gets one extra chance per repeat. Winners are still unique.</span>
          </label>
        )}
        <div className="grid grid-cols-2 gap-4">
          <NumberField label="Winners" value={winnersIn} onChange={reset(setWinnersIn)} min="1" max={String(MAX_WINNERS)} step="1" hint={`1 to ${MAX_WINNERS}`} />
          <NumberField label="Alternates" value={alternatesIn} onChange={reset(setAlternatesIn)} min="0" max={String(MAX_ALTERNATES)} step="1" hint="Backups, optional" />
        </div>
        <p className="text-sm text-gray-600">No duplicate winners: each entry can be drawn at most once.</p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={start} disabled={entrants === 0 || rolling !== null}>
            {draw ? 'Draw again' : numWinners > 1 ? 'Draw winners' : 'Draw winner'}
          </Button>
          <Button variant="secondary" onClick={() => { setText(''); setDraw(null); }}>Clear</Button>
        </div>
      </div>

      <div className="min-w-0 self-start rounded-xl border border-brand-100 bg-brand-50 p-5 md:p-6">
        <div className="border-b border-brand-200 pb-4">
          <p className="text-sm font-medium text-gray-700">Final entries in the draw</p>
          <p className="mt-1 text-4xl font-bold tracking-tight text-gray-900 tabular-nums">{fmt(tickets)}</p>
        </div>
        <dl className="mt-3 space-y-2 text-sm">
          {stats.map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-4">
              <dt className="text-gray-600">{label}</dt>
              <dd className="font-semibold text-gray-900 tabular-nums">{fmt(value)}</dd>
            </div>
          ))}
        </dl>
        {list.invalidSamples.length > 0 && (
          <p className="mt-2 break-all text-xs text-gray-600">
            Skipped: {list.invalidSamples.join(', ')}{list.invalid > list.invalidSamples.length ? '…' : ''}
          </p>
        )}
        <div className="mt-5 border-t border-brand-200 pt-4" aria-live="polite">
          {rolling !== null ? (
            <RollingDisplay value={rolling} />
          ) : draw ? (
            <WinnerResults draw={draw}>
              {promo && (
                <p className="mt-5 border-t border-brand-200 pt-4 text-sm text-gray-600">
                  If you want entrants to be able to check the draw for themselves,{' '}
                  <a href={PICKSAFELY_URL} className="underline">PickSafely</a> runs giveaways with timestamped results
                  anyone can verify.
                </p>
              )}
            </WinnerResults>
          ) : (
            <p className="text-gray-600">{entrants ? 'Ready to draw.' : 'Paste your entries or upload a file to get started.'}</p>
          )}
        </div>
      </div>
    </div>
  );
}
