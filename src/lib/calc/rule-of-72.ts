/** Years to double at an annual rate (percent), by the Rule of 72. */
export const yearsToDoubleRule72 = (ratePct: number) => (ratePct > 0 ? 72 / ratePct : NaN);

/** Annual rate (percent) needed to double in the given years, by the Rule of 72. */
export const rateToDoubleRule72 = (years: number) => (years > 0 ? 72 / years : NaN);

/** Exact doubling time with annual compounding: ln 2 / ln(1 + r). */
export const exactYearsToDouble = (ratePct: number) => (ratePct > 0 ? Math.log(2) / Math.log(1 + ratePct / 100) : NaN);

/** Exact annual rate (percent) to double in `years`: 2^(1/years) − 1. */
export const exactRateToDouble = (years: number) => (years > 0 ? (Math.pow(2, 1 / years) - 1) * 100 : NaN);
