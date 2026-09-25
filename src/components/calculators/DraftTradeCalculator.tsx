import { useMemo, useState } from 'react';
import { evaluateTrade, pickValue, type DraftPick } from '../../lib/calc/draft-trade';
import { formatNumber } from '../../lib/format';
import { Button, SelectField } from '../ui/fields';

type Row = { round: string; pick: string };
const MAX_PICKS = 5;
const blank = (): Row => ({ round: '', pick: '' });
const TEAM_OPTIONS = [8, 10, 12, 14, 16].map((n) => ({ value: String(n), label: `${n} teams` }));
const numOptions = (n: number, prefix: string) => [{ value: '', label: '—' }, ...Array.from({ length: n }, (_, i) => ({ value: String(i + 1), label: `${prefix} ${i + 1}` }))];

function toPicks(rows: Row[]): DraftPick[] {
  return rows.filter((r) => r.round && r.pick).map((r) => ({ round: Number(r.round), pick: Number(r.pick) }));
}

function Side({ title, rows, setRows, teams }: { title: string; rows: Row[]; setRows: (r: Row[]) => void; teams: number }) {
  const rounds = Math.floor(224 / teams);
  const update = (i: number, patch: Partial<Row>) => setRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  return (
    <fieldset className="space-y-3">
      <legend className="text-lg font-semibold text-slate-900">{title}</legend>
      {rows.map((row, i) => {
        const value = row.round && row.pick ? pickValue({ round: Number(row.round), pick: Number(row.pick) }, teams) : null;
        return (
          <div key={i} className="grid grid-cols-[1fr_1fr_4rem] items-end gap-2">
            <SelectField label={`Pick ${i + 1} round`} value={row.round} onChange={(v) => update(i, { round: v })} options={numOptions(rounds, 'Round')} />
            <SelectField label="Pick in round" value={row.pick} onChange={(v) => update(i, { pick: v })} options={numOptions(teams, 'Pick')} />
            <span className="pb-2 text-right text-sm tabular-nums text-slate-600">{value === null ? '' : formatNumber(value, 1)}</span>
          </div>
        );
      })}
    </fieldset>
  );
}

export default function DraftTradeCalculator() {
  const [teams, setTeams] = useState('10');
  const [a, setA] = useState<Row[]>([{ round: '1', pick: '2' }, ...Array.from({ length: MAX_PICKS - 1 }, blank)]);
  const [b, setB] = useState<Row[]>([{ round: '1', pick: '6' }, { round: '2', pick: '5' }, ...Array.from({ length: MAX_PICKS - 2 }, blank)]);
  const n = Number(teams);
  const result = useMemo(() => evaluateTrade(toPicks(a), toPicks(b), n), [a, b, n]);

  const verdict =
    result.valueA === 0 && result.valueB === 0
      ? 'Choose picks on both sides.'
      : result.verdict === 'fair'
        ? 'This trade is fair: the sides are within 5% of each other.'
        : `Side ${result.verdict} gives up ${formatNumber(Math.abs(result.difference), 1)} more points (${formatNumber(result.differencePct, 1)}%). The team receiving side ${result.verdict} wins the trade.`;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="max-w-xs">
        <SelectField label="League size" value={teams} onChange={(v) => { setTeams(v); setA(a.map(blank)); setB(b.map(blank)); }} options={TEAM_OPTIONS} />
      </div>
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <Side title="Side A picks" rows={a} setRows={setA} teams={n} />
        <Side title="Side B picks" rows={b} setRows={setB} teams={n} />
      </div>
      <div className="mt-6 rounded-lg bg-brand-50 p-5" aria-live="polite">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div><p className="text-sm text-slate-600">Side A value</p><p className="text-3xl font-bold text-brand-800 tabular-nums">{formatNumber(result.valueA, 1)}</p></div>
          <div><p className="text-sm text-slate-600">Side B value</p><p className="text-3xl font-bold text-brand-800 tabular-nums">{formatNumber(result.valueB, 1)}</p></div>
        </div>
        <p className="mt-4 text-center font-medium text-slate-800">{verdict}</p>
      </div>
      <div className="mt-4">
        <Button variant="secondary" onClick={() => { setA(a.map(blank)); setB(b.map(blank)); }}>Clear picks</Button>
      </div>
    </div>
  );
}
