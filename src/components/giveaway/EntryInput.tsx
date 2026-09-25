import { useId, useRef, useState, type DragEvent } from 'react';

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/** Largest file read into the text box; 20 MB is several hundred thousand emails. */
const MAX_FILE_BYTES = 20 * 1024 * 1024;

/** Text box for entries that also accepts an uploaded or dropped CSV/TXT file. */
export default function EntryInput({ label, value, onChange, placeholder }: Props) {
  const id = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState('');

  async function load(file: File | undefined) {
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setStatus(`${file.name} is larger than 20 MB. Split it into smaller files.`);
      return;
    }
    const text = await file.text();
    onChange(text);
    setStatus(`Loaded ${file.name}.`);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    void load(e.dataTransfer.files[0]);
  }

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <button type="button" onClick={() => fileRef.current?.click()} className="text-sm font-semibold text-brand-700 underline-offset-2 hover:underline">
          Upload CSV or TXT
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.txt,text/csv,text/plain"
          className="hidden"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => { void load(e.target.files?.[0]); e.target.value = ''; }}
        />
      </div>
      <textarea
        id={id}
        rows={10}
        value={value}
        placeholder={placeholder}
        spellCheck={false}
        onChange={(e) => { onChange(e.target.value); setStatus(''); }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        aria-describedby={`${id}-hint`}
        className={`mt-1 w-full rounded-lg border bg-white px-3 py-2.5 font-mono text-sm text-gray-900 shadow-xs transition-colors hover:border-gray-400 focus:border-brand-600 focus:ring-3 focus:ring-brand-200 focus:outline-none ${dragging ? 'border-brand-600 bg-brand-50 ring-3 ring-brand-200' : 'border-gray-300'}`}
      />
      <p id={`${id}-hint`} className="mt-1 text-xs text-gray-600" aria-live="polite">
        {status || 'One entry per line or separated by commas. You can also drop a CSV or TXT file here.'}
      </p>
    </div>
  );
}
