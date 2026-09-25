import { useState } from 'react';
import { DESKTOP_VISIBLE_CHARS, evaluateSubject, MOBILE_VISIBLE_CHARS } from '../../lib/calc/email-subject';
import { TextField } from '../ui/fields';

const METER: Record<string, string> = { Excellent: '#16a34a', 'Very good': '#65a30d', Good: '#84cc16', Fair: '#eab308', 'Too long': '#dc2626', 'Too short': '#f97316', 'N/A': '#e5e7eb' };

function Preview({ label, subject, limit }: { label: string; subject: string; limit: number }) {
  const chars = [...subject];
  const shown = chars.length > limit ? `${chars.slice(0, limit).join('')}…` : subject;
  return (
    <div className="min-w-0 rounded-md border border-gray-200 bg-white p-3">
      <p className="text-xs uppercase tracking-wide text-gray-600">{label}</p>
      <p className="mt-1 font-semibold text-gray-900">Your Company</p>
      <p className="truncate text-gray-800">{shown || 'Your subject line'}</p>
    </div>
  );
}

export default function EmailSubjectTool() {
  const [subject, setSubject] = useState('Your weekly guide to smarter money moves');
  const r = evaluateSubject(subject);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md shadow-gray-200/60 md:p-8">
      <TextField label="Email subject line" value={subject} onChange={setSubject} />
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="min-w-0 rounded-xl border border-brand-100 bg-brand-50 p-5" aria-live="polite">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div><p className="text-xs text-gray-600">Words</p><p className="text-2xl font-bold text-gray-900">{r.words}</p></div>
            <div><p className="text-xs text-gray-600">Characters</p><p className="text-2xl font-bold text-gray-900">{r.characters}</p></div>
            <div><p className="text-xs text-gray-600">Grade</p><p className="text-lg font-bold text-brand-800">{r.grade}</p></div>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
            <div className="h-full transition-all" style={{ width: `${r.score}%`, background: METER[r.grade] }} />
          </div>
          <p className="mt-4 text-gray-800">{r.feedback}</p>
          {r.warnings.length > 0 && (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-amber-800">
              {r.warnings.map((w) => <li key={w}>{w}</li>)}
            </ul>
          )}
        </div>
        <div className="min-w-0 space-y-3">
          <Preview label={`Mobile inbox (~${MOBILE_VISIBLE_CHARS} characters)`} subject={subject} limit={MOBILE_VISIBLE_CHARS} />
          <Preview label={`Desktop inbox (~${DESKTOP_VISIBLE_CHARS} characters)`} subject={subject} limit={DESKTOP_VISIBLE_CHARS} />
        </div>
      </div>
    </div>
  );
}
