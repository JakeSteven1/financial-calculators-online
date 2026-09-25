// Parsing and display helpers shared by calculator islands.

/** Parses user input like "$1,250.50" or "7%"; returns NaN when not a number. */
export function parseNumber(input: string): number {
  const cleaned = input.replace(/[$,%\s]/g, '');
  if (cleaned === '' || cleaned === '-' || cleaned === '.') return NaN;
  return Number(cleaned);
}

const currencyFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const currencyWholeFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export function formatCurrency(value: number, opts: { whole?: boolean } = {}): string {
  if (!Number.isFinite(value)) return '—';
  return (opts.whole ? currencyWholeFmt : currencyFmt).format(value);
}

export function formatNumber(value: number, maxDecimals = 2): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: maxDecimals }).format(value);
}

/** Formats a percentage given in percent units (7.5 -> "7.50%"). */
export function formatPercent(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return '—';
  return `${value.toFixed(decimals)}%`;
}
