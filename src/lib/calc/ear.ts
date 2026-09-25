/** Effective annual rate (percent) from a nominal annual rate compounded n times a year. n = Infinity for continuous. */
export function effectiveAnnualRate(nominalPct: number, periodsPerYear: number): number {
  const r = nominalPct / 100;
  if (periodsPerYear === Infinity) return (Math.exp(r) - 1) * 100;
  if (!(periodsPerYear > 0)) return NaN;
  return (Math.pow(1 + r / periodsPerYear, periodsPerYear) - 1) * 100;
}

/** Nominal annual rate (percent) that produces the given effective rate. */
export function nominalFromEffective(effectivePct: number, periodsPerYear: number): number {
  const e = effectivePct / 100;
  if (periodsPerYear === Infinity) return Math.log(1 + e) * 100;
  if (!(periodsPerYear > 0)) return NaN;
  return periodsPerYear * (Math.pow(1 + e, 1 / periodsPerYear) - 1) * 100;
}
