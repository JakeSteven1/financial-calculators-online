import { describe, expect, it } from 'vitest';
import { estimateClosingCosts } from './closing-costs';

const base = {
  homePrice: 400000, downPaymentPct: 20, ratePct: 6.5, propertyTaxPct: 1.2, insuranceYearly: 1800,
  originationPct: 1, titleInsurancePct: 0.5, transferTaxPct: 0, appraisal: 600, inspection: 450,
  settlementFee: 1000, recordingFees: 150, taxEscrowMonths: 3, prepaidInterestDays: 15,
};

describe('estimateClosingCosts', () => {
  it('itemizes and totals costs', () => {
    const r = estimateClosingCosts(base);
    const get = (k: string) => r.items.find((i) => i.key === k)!.amount;
    expect(r.loanAmount).toBe(320000);
    expect(get('origination')).toBe(3200);
    expect(get('title')).toBe(2000);
    expect(get('taxEscrow')).toBeCloseTo(1200, 6);
    expect(get('interest')).toBeCloseTo((320000 * 0.065 / 365) * 15, 6);
    expect(r.total).toBeCloseTo(r.items.reduce((s, i) => s + i.amount, 0), 6);
    expect(r.cashToClose).toBeCloseTo(80000 + r.total, 6);
    expect(r.typicalLow).toBe(6400);
    expect(r.typicalHigh).toBe(16000);
  });
  it('skips loan costs on a cash purchase', () => {
    const r = estimateClosingCosts({ ...base, downPaymentPct: 100 });
    expect(r.items.find((i) => i.key === 'appraisal')!.amount).toBe(0);
    expect(r.items.find((i) => i.key === 'origination')!.amount).toBe(0);
  });
});
