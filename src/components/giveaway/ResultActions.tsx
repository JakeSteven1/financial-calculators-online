import { useState } from 'react';
import { Button } from '../ui/fields';

interface Props {
  /** Plain text copied to the clipboard. */
  copyText: string;
  copyLabel: string;
  /** CSV file contents and name for the download button. */
  csv: string;
  csvName: string;
}

/** Copy and "Download CSV" buttons for a finished draw. */
export default function ResultActions({ copyText, copyLabel, csv, csvName }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function download() {
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = csvName;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="secondary" onClick={copy}>{copied ? 'Copied' : copyLabel}</Button>
      <Button variant="secondary" onClick={download}>Download CSV</Button>
    </div>
  );
}

/** "Sep 25, 2026, 3:04:05 PM EDT" in the visitor's locale and time zone. */
export function formatDrawTime(date: Date): string {
  return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'long' });
}

/** File-name-safe timestamp: 2026-09-25-1504. */
export function fileStamp(date: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}-${p(date.getHours())}${p(date.getMinutes())}`;
}
