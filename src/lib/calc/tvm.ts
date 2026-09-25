// Time value of money using the standard financial-calculator sign convention:
//   pv·(1+i)^n + pmt·(1 + i·due)·((1+i)^n − 1)/i + fv = 0
// Money you pay out is negative, money you receive is positive (like Excel's FV/PV/PMT/NPER/RATE).

export type Timing = 'end' | 'begin';

export interface TvmArgs {
  /** Rate per period as a decimal (0.05 = 5%). */
  rate: number;
  periods: number;
  pmt: number;
  pv: number;
  fv: number;
  timing: Timing;
}

const due = (t: Timing) => (t === 'begin' ? 1 : 0);

export function fv({ rate, periods: n, pmt, pv, timing }: Omit<TvmArgs, 'fv'>): number {
  if (rate === 0) return -(pv + pmt * n);
  const g = Math.pow(1 + rate, n);
  return -(pv * g + pmt * (1 + rate * due(timing)) * ((g - 1) / rate));
}

export function pv({ rate, periods: n, pmt, fv: future, timing }: Omit<TvmArgs, 'pv'>): number {
  if (rate === 0) return -(future + pmt * n);
  const g = Math.pow(1 + rate, n);
  return -(future + pmt * (1 + rate * due(timing)) * ((g - 1) / rate)) / g;
}

export function pmt({ rate, periods: n, pv: present, fv: future, timing }: Omit<TvmArgs, 'pmt'>): number {
  if (n === 0) return NaN;
  if (rate === 0) return -(present + future) / n;
  const g = Math.pow(1 + rate, n);
  return -(present * g + future) / ((1 + rate * due(timing)) * ((g - 1) / rate));
}

export function nper({ rate, pmt: payment, pv: present, fv: future, timing }: Omit<TvmArgs, 'periods'>): number {
  if (rate === 0) return payment === 0 ? NaN : -(present + future) / payment;
  const adj = payment * (1 + rate * due(timing)) / rate;
  const ratio = (adj - future) / (adj + present);
  if (!(ratio > 0)) return NaN;
  return Math.log(ratio) / Math.log(1 + rate);
}

/** Solves for the periodic rate with Newton's method, falling back to bisection. */
export function rate({ periods: n, pmt: payment, pv: present, fv: future, timing }: Omit<TvmArgs, 'rate'>): number {
  const f = (r: number) => (r === 0 ? present + payment * n + future : present * Math.pow(1 + r, n) + payment * (1 + r * due(timing)) * ((Math.pow(1 + r, n) - 1) / r) + future);
  let r = 0.05;
  for (let i = 0; i < 100; i++) {
    const y = f(r);
    const h = 1e-7;
    const d = (f(r + h) - y) / h;
    if (!Number.isFinite(d) || d === 0) break;
    const next = r - y / d;
    if (!Number.isFinite(next) || next <= -1) break;
    if (Math.abs(next - r) < 1e-12) return next;
    r = next;
  }
  // Bisection over (-0.9999, 10] when Newton fails to converge.
  let lo = -0.9999;
  let hi = 10;
  if (Math.sign(f(lo)) === Math.sign(f(hi))) return NaN;
  for (let i = 0; i < 300; i++) {
    const mid = (lo + hi) / 2;
    if (Math.sign(f(mid)) === Math.sign(f(lo))) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export type SolveFor = 'fv' | 'pv' | 'pmt' | 'periods' | 'rate';

/** Solves the missing variable; `values` holds the other four (rate as a decimal per period). */
export function solveTvm(solveFor: SolveFor, values: Omit<TvmArgs, SolveFor> & Partial<TvmArgs>): number {
  const v = values as TvmArgs;
  switch (solveFor) {
    case 'fv': return fv(v);
    case 'pv': return pv(v);
    case 'pmt': return pmt(v);
    case 'periods': return nper(v);
    case 'rate': return rate(v);
  }
}
