// Minimal stacked bar chart in plain SVG (no charting library).

export interface BarSeries {
  label: string;
  color: string;
}

interface BarChartProps {
  /** One entry per bar; values align with `series` and are stacked bottom-up. */
  bars: { label: string; values: number[] }[];
  series: BarSeries[];
  formatValue: (v: number) => string;
  title: string;
}

export function BarChart({ bars, series, formatValue, title }: BarChartProps) {
  const width = 640;
  const height = 260;
  const pad = { top: 12, right: 8, bottom: 32, left: 76 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const max = Math.max(1, ...bars.map((b) => b.values.reduce((s, v) => s + Math.max(0, v), 0)));
  const slot = innerW / Math.max(1, bars.length);
  const barW = Math.max(2, slot * 0.7);
  const labelEvery = Math.ceil(bars.length / 8);
  const ticks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <figure className="mt-6">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={title}>
        {ticks.map((t) => {
          const y = pad.top + innerH * (1 - t);
          return (
            <g key={t}>
              <line x1={pad.left} x2={width - pad.right} y1={y} y2={y} stroke="#e2e8f0" />
              <text x={pad.left - 6} y={y + 4} textAnchor="end" fontSize="14" fill="#64748b">{formatValue(max * t)}</text>
            </g>
          );
        })}
        {bars.map((bar, i) => {
          let acc = 0;
          const x = pad.left + i * slot + (slot - barW) / 2;
          return (
            <g key={bar.label}>
              {bar.values.map((v, s) => {
                const h = (Math.max(0, v) / max) * innerH;
                acc += h;
                return <rect key={s} x={x} y={pad.top + innerH - acc} width={barW} height={h} fill={series[s]?.color}><title>{`${bar.label} ${series[s]?.label}: ${formatValue(v)}`}</title></rect>;
              })}
              {i % labelEvery === 0 && (
                <text x={x + barW / 2} y={height - 10} textAnchor="middle" fontSize="14" fill="#64748b">{bar.label}</text>
              )}
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 flex flex-wrap gap-4 text-sm text-slate-600">
        {series.map((s) => (
          <span key={s.label} className="inline-flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-sm" style={{ background: s.color }} />{s.label}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
