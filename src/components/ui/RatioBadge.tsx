import type { RatioHealth } from '../../lib/calc/liquidity';

const STYLES: Record<RatioHealth, string> = {
  weak: 'bg-red-100 text-red-800',
  adequate: 'bg-amber-100 text-amber-800',
  strong: 'bg-green-100 text-green-800',
};

export function RatioBadge({ health }: { health: RatioHealth | null }) {
  if (!health) return null;
  return <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${STYLES[health]}`}>{health}</span>;
}
