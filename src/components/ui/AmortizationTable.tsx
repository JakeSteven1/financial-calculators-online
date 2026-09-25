import { useState } from 'react';
import { summarizeByYear, type AmortizationRow } from '../../lib/calc/loan';
import { formatCurrency } from '../../lib/format';

/** Collapsible schedule with a yearly/monthly toggle. */
export function AmortizationTable({ rows, defaultOpen = false }: { rows: AmortizationRow[]; defaultOpen?: boolean }) {
  const [view, setView] = useState<'yearly' | 'monthly'>('yearly');
  const years = summarizeByYear(rows);
  const th = 'px-3 py-2 text-right font-semibold text-slate-700';
  const td = 'px-3 py-1.5 text-right tabular-nums';
  return (
    <details className="mt-6 rounded-lg border border-slate-200 bg-white" open={defaultOpen}>
      <summary className="cursor-pointer px-5 py-3 font-semibold text-slate-900">Amortization schedule</summary>
      <div className="px-5 pb-5">
        <div className="mb-3 flex gap-2 text-sm">
          {(['yearly', 'monthly'] as const).map((v) => (
            <button key={v} type="button" onClick={() => setView(v)} className={`rounded-md px-3 py-1 ${view === v ? 'bg-brand-600 text-white' : 'border border-slate-300 text-slate-700'}`}>
              {v === 'yearly' ? 'By year' : 'By month'}
            </button>
          ))}
        </div>
        <div className="max-h-[28rem] overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">{view === 'yearly' ? 'Year' : 'Month'}</th>
                {view === 'monthly' && <th className={th}>Payment</th>}
                <th className={th}>Principal</th>
                <th className={th}>Interest</th>
                <th className={th}>Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {view === 'yearly'
                ? years.map((y) => (
                    <tr key={y.year}>
                      <td className="px-3 py-1.5">{y.year}</td>
                      <td className={td}>{formatCurrency(y.principal)}</td>
                      <td className={td}>{formatCurrency(y.interest)}</td>
                      <td className={td}>{formatCurrency(y.endBalance)}</td>
                    </tr>
                  ))
                : rows.map((r) => (
                    <tr key={r.month}>
                      <td className="px-3 py-1.5">{r.month}</td>
                      <td className={td}>{formatCurrency(r.payment)}</td>
                      <td className={td}>{formatCurrency(r.principal)}</td>
                      <td className={td}>{formatCurrency(r.interest)}</td>
                      <td className={td}>{formatCurrency(r.balance)}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </details>
  );
}
