import { useState, type ReactNode } from 'react';
import { maskEntry, toCsv } from '../../lib/calc/giveaway';
import ResultActions, { fileStamp, formatDrawTime } from './ResultActions';

export interface FinishedDraw {
  winners: string[];
  alternates: string[];
  drawnAt: Date;
  /** Unique entries in the draw. */
  entrants: number;
  /** Total chances when weighted (equals entrants otherwise). */
  tickets: number;
  weighted: boolean;
  requestedWinners: number;
  requestedAlternates: number;
}

const fmt = (n: number) => n.toLocaleString('en-US');

/** Winners and alternates with draw details, a mask toggle, copy, and CSV download. */
export default function WinnerResults({ draw, children }: { draw: FinishedDraw; children?: ReactNode }) {
  const [masked, setMasked] = useState(false);
  const show = (e: string) => (masked ? maskEntry(e) : e);
  const when = formatDrawTime(draw.drawnAt);
  const pool = draw.weighted ? `${fmt(draw.tickets)} entries (${fmt(draw.entrants)} people)` : `${fmt(draw.entrants)} entries`;
  const noun = draw.winners.length === 1 ? 'Winner' : 'Winners';

  const copyText = [
    `${noun}:`,
    ...draw.winners.map((w, i) => `${i + 1}. ${show(w)}`),
    ...(draw.alternates.length ? ['', 'Alternates:', ...draw.alternates.map((w, i) => `${i + 1}. ${show(w)}`)] : []),
    '',
    `Drawn ${when} from ${pool}.`,
  ].join('\n');

  const csv = toCsv([
    ['Position', 'Result', 'Entry', 'Drawn at', 'Total entries'],
    ...draw.winners.map((w, i) => [i + 1, 'Winner', show(w), draw.drawnAt.toISOString(), draw.tickets]),
    ...draw.alternates.map((w, i) => [i + 1, 'Alternate', show(w), draw.drawnAt.toISOString(), draw.tickets]),
  ]);

  const short = draw.winners.length < draw.requestedWinners || draw.alternates.length < draw.requestedAlternates;

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">{noun}</h2>
      <p className="mt-1 text-sm text-gray-600">Drawn {when} from {pool}.</p>
      <ol className="mt-3 space-y-2">
        {draw.winners.map((w, i) => (
          <li
            key={w}
            className="flex items-baseline gap-3 rounded-lg border border-brand-200 bg-white px-3 py-2 motion-safe:animate-reveal"
            style={{ animationDelay: `${Math.min(i, 20) * 80}ms` }}
          >
            <span className="w-6 shrink-0 text-right text-sm font-semibold text-gray-600 tabular-nums">{i + 1}.</span>
            <span className="min-w-0 break-all text-base font-semibold text-brand-800 sm:text-lg">{show(w)}</span>
          </li>
        ))}
      </ol>
      {draw.alternates.length > 0 && (
        <>
          <h3 className="mt-5 font-semibold text-gray-900">Alternates</h3>
          <p className="text-sm text-gray-600">In order, if a winner can’t be reached or declines.</p>
          <ol className="mt-2 space-y-1">
            {draw.alternates.map((w, i) => (
              <li key={w} className="flex items-baseline gap-3 px-3">
                <span className="w-6 shrink-0 text-right text-sm text-gray-600 tabular-nums">{i + 1}.</span>
                <span className="min-w-0 break-all text-gray-900">{show(w)}</span>
              </li>
            ))}
          </ol>
        </>
      )}
      {short && (
        <p className="mt-3 text-sm text-gray-600">
          The list ran out of entries, so fewer {draw.alternates.length < draw.requestedAlternates && draw.winners.length === draw.requestedWinners ? 'alternates' : 'winners'} were drawn than requested.
        </p>
      )}
      <label className="mt-5 flex items-start gap-2 text-sm text-gray-700">
        <input type="checkbox" className="mt-1" checked={masked} onChange={(e) => setMasked(e.target.checked)} />
        <span>Mask entries for public posting (j***@gmail.com). Copy and download use the same view.</span>
      </label>
      <div className="mt-4">
        <ResultActions
          copyText={copyText}
          copyLabel={draw.winners.length + draw.alternates.length > 1 ? 'Copy results' : 'Copy winner'}
          csv={csv}
          csvName={`giveaway-results-${fileStamp(draw.drawnAt)}.csv`}
        />
      </div>
      {children}
    </div>
  );
}
