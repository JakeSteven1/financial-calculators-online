import { useEffect, useRef, useState } from 'react';

const ROLL_MS = 1400;
const TICK_MS = 70;

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Drives the "slot machine" reveal. The result is decided before the animation
 * starts; the rolling values are only decoration. With reduced motion the
 * result shows immediately.
 */
export function useDrawReveal() {
  const [rolling, setRolling] = useState<string | null>(null);
  const timers = useRef<number[]>([]);

  function stop() {
    timers.current.forEach((t) => { clearInterval(t); clearTimeout(t); });
    timers.current = [];
  }

  useEffect(() => stop, []);

  /** Shows values from `sample()` for a moment, then calls `finish()`. */
  function run(sample: () => string, finish: () => void) {
    stop();
    if (prefersReducedMotion()) {
      setRolling(null);
      finish();
      return;
    }
    setRolling(sample());
    timers.current.push(
      window.setInterval(() => setRolling(sample()), TICK_MS),
      window.setTimeout(() => {
        stop();
        setRolling(null);
        finish();
      }, ROLL_MS),
    );
  }

  return { rolling, run };
}

/** The rolling value shown during a draw. Hidden from screen readers, which hear "Drawing…" once. */
export function RollingDisplay({ value, label = 'Drawing…' }: { value: string; label?: string }) {
  return (
    <div className="py-6 text-center">
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p aria-hidden="true" className="mt-3 truncate font-mono text-2xl font-bold text-brand-800 tabular-nums sm:text-3xl">{value}</p>
    </div>
  );
}
