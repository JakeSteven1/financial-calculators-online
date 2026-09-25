// Fixed-rate, fully amortizing loans with monthly payments.

/** Monthly payment: M = P·i / (1 − (1 + i)^−n), where i is the monthly rate. */
export function monthlyPayment(principal: number, annualRatePct: number, months: number): number {
  if (!(months > 0)) return NaN;
  const i = annualRatePct / 100 / 12;
  if (i === 0) return principal / months;
  return (principal * i) / (1 - Math.pow(1 + i, -months));
}

export interface AmortizationRow {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

export interface AmortizationResult {
  rows: AmortizationRow[];
  scheduledPayment: number;
  totalInterest: number;
  totalPaid: number;
  /** Months actually needed (fewer than the term when paying extra). */
  payoffMonths: number;
}

/**
 * Month-by-month schedule. `extraMonthly` is added to principal each month.
 * The final payment is trimmed so the balance lands exactly on zero.
 */
export function amortize(principal: number, annualRatePct: number, months: number, extraMonthly = 0): AmortizationResult {
  const i = annualRatePct / 100 / 12;
  const scheduledPayment = monthlyPayment(principal, annualRatePct, months);
  const rows: AmortizationRow[] = [];
  let balance = principal;
  let totalInterest = 0;
  let totalPaid = 0;
  for (let month = 1; month <= months && balance > 0.005; month++) {
    const interest = balance * i;
    let payment = scheduledPayment + extraMonthly;
    if (payment > balance + interest) payment = balance + interest;
    const toPrincipal = payment - interest;
    balance = Math.max(0, balance - toPrincipal);
    totalInterest += interest;
    totalPaid += payment;
    rows.push({ month, payment, interest, principal: toPrincipal, balance });
  }
  return { rows, scheduledPayment, totalInterest, totalPaid, payoffMonths: rows.length };
}

export interface YearSummary {
  year: number;
  interest: number;
  principal: number;
  endBalance: number;
}

export function summarizeByYear(rows: AmortizationRow[]): YearSummary[] {
  const years: YearSummary[] = [];
  for (const row of rows) {
    const year = Math.ceil(row.month / 12);
    let y = years[year - 1];
    if (!y) {
      y = { year, interest: 0, principal: 0, endBalance: row.balance };
      years.push(y);
    }
    y.interest += row.interest;
    y.principal += row.principal;
    y.endBalance = row.balance;
  }
  return years;
}

/** Months to repay `principal` with a fixed monthly payment; Infinity if the payment never covers interest. */
export function monthsToPayoff(principal: number, annualRatePct: number, payment: number): number {
  const i = annualRatePct / 100 / 12;
  if (principal <= 0) return 0;
  if (i === 0) return payment > 0 ? principal / payment : Infinity;
  if (payment <= principal * i) return Infinity;
  return -Math.log(1 - (principal * i) / payment) / Math.log(1 + i);
}

/** Remaining balance after `paidMonths` scheduled payments. */
export function remainingBalance(principal: number, annualRatePct: number, months: number, paidMonths: number): number {
  const i = annualRatePct / 100 / 12;
  if (i === 0) return principal * (1 - paidMonths / months);
  const pmt = monthlyPayment(principal, annualRatePct, months);
  const g = Math.pow(1 + i, paidMonths);
  return principal * g - pmt * ((g - 1) / i);
}
