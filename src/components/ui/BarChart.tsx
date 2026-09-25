// Minimal stacked bar chart in plain SVG (no charting library). The SVG is drawn
// at its container's pixel width so axis text stays 12px on phones and desktops.
import { useEffect, useRef, useState } from 'react';

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
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(240, Math.round(entry.contentRect.width))));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const height = 240;
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  const maxTotal = Math.max(1, ...bars.map((b) => b.values.reduce((s, v) => s + Math.max(0, v), 0)));
  // Room for the longest y-axis label at 12px (~7px per character).
  const pad = { top: 10, right: 4, bottom: 28, left: 12 + 7 * Math.max(...ticks.map((t) => formatValue(maxTotal * t).length)) };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const max = maxTotal;
  const slot = innerW / Math.max(1, bars.length);
  const barW = Math.max(2, slot * 0.7);
  const labelEvery = Math.ceil(bars.length / Math.max(2, Math.floor(innerW / 56)));

  return (
    <figure className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <span className="font-semibold text-gray-900">{title}</span>
        <span className="flex flex-wrap gap-4 text-sm text-gray-600">
          {series.map((s) => (
            <span key={s.label} className="inline-flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-sm" style={{ background: s.color }} />{s.label}
            </span>
          ))}
        </span>
      </figcaption>
      <div ref={ref} className="mt-4">
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className="block max-w-full" role="img" aria-label={title}>
        {ticks.map((t) => {
          const y = pad.top + innerH * (1 - t);
          return (
            <g key={t}>
              <line x1={pad.left} x2={width - pad.right} y1={y} y2={y} stroke="#e5e7eb" />
              <text x={pad.left - 6} y={y + 4} textAnchor="end" fontSize="12" fill="#4b5563">{formatValue(max * t)}</text>
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
                return <rect key={s} x={x} y={pad.top + innerH - acc} width={barW} height={h} fill={series[s]?.color} stroke="#fff" strokeWidth={2}><title>{`${bar.label} ${series[s]?.label}: ${formatValue(v)}`}</title></rect>;
              })}
              {i % labelEvery === 0 && (
                <text x={x + barW / 2} y={height - 8} textAnchor="middle" fontSize="12" fill="#4b5563">{bar.label}</text>
              )}
            </g>
          );
        })}
      </svg>
      </div>
    </figure>
  );
}
