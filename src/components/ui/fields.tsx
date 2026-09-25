import { useId, type ReactNode } from 'react';

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-base text-gray-900 tabular-nums shadow-xs transition-colors hover:border-gray-400 focus:border-brand-600 focus:ring-3 focus:ring-brand-200 focus:outline-none';

interface NumberFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
  hint?: string;
  step?: string;
  min?: string;
  max?: string;
}

export function NumberField({ label, value, onChange, prefix, suffix, hint, step = 'any', min, max }: NumberFieldProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative mt-1">
        {prefix && <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-600">{prefix}</span>}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          step={step}
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} ${prefix ? 'pl-7' : ''} ${suffix ? 'pr-12' : ''}`}
        />
        {suffix && <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-600">{suffix}</span>}
      </div>
      {hint && <p className="mt-1 text-xs text-gray-600">{hint}</p>}
    </div>
  );
}

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'date' | 'email';
  hint?: string;
}

export function TextField({ label, value, onChange, type = 'text', hint }: TextFieldProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} className={`${inputClass} mt-1`} />
      {hint && <p className="mt-1 text-xs text-gray-600">{hint}</p>}
    </div>
  );
}

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  hint?: string;
}

export function TextAreaField({ label, value, onChange, rows = 6, placeholder, hint }: TextAreaFieldProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} mt-1 font-mono text-sm`}
      />
      {hint && <p className="mt-1 text-xs text-gray-600">{hint}</p>}
    </div>
  );
}

interface SelectFieldProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}

export function SelectField<T extends string>({ label, value, onChange, options }: SelectFieldProps<T>) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value as T)} className={`${inputClass} mt-1`}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function Button({ children, onClick, variant = 'primary' }: { children: ReactNode; onClick: () => void; variant?: 'primary' | 'secondary' }) {
  const styles =
    variant === 'primary'
      ? 'bg-brand-600 text-white hover:bg-brand-700'
      : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50';
  return (
    <button type="button" onClick={onClick} className={`rounded-md px-4 py-2 font-semibold shadow-sm ${styles}`}>
      {children}
    </button>
  );
}

/** Two-column card: inputs on the left, results on the right. */
export function CalculatorShell({ inputs, results }: { inputs: ReactNode; results: ReactNode }) {
  return (
    <div className="grid gap-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-md shadow-gray-200/60 md:grid-cols-2 md:gap-8 md:p-8">
      <div className="min-w-0 space-y-5">{inputs}</div>
      <div className="min-w-0 self-start rounded-xl border border-brand-100 bg-brand-50 p-5 md:p-6" aria-live="polite">{results}</div>
    </div>
  );
}

export interface ResultItem {
  label: string;
  value: string;
  primary?: boolean;
}

export function Results({ items, note }: { items: ResultItem[]; note?: ReactNode }) {
  return (
    <div>
      <dl className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className={item.primary ? 'border-b border-brand-200 pb-4' : 'flex items-baseline justify-between gap-4'}>
            <dt className={item.primary ? 'text-sm font-medium text-gray-700' : 'text-sm text-gray-600'}>{item.label}</dt>
            <dd className={item.primary ? 'mt-1 text-4xl font-bold tracking-tight text-gray-900 tabular-nums' : 'font-semibold text-gray-900 tabular-nums'}>{item.value}</dd>
          </div>
        ))}
      </dl>
      {note && <div className="mt-4 text-sm text-gray-600">{note}</div>}
    </div>
  );
}

export function EmptyResults({ message = 'Enter valid values to see results.' }: { message?: string }) {
  return <p className="text-gray-600">{message}</p>;
}
