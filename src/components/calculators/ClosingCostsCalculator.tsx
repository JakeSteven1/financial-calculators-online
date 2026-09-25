import { useMemo, useState } from 'react';
import { estimateClosingCosts, type ClosingCostInput } from '../../lib/calc/closing-costs';
import { formatCurrency, formatPercent, parseNumber } from '../../lib/format';
import { NumberField, Results } from '../ui/fields';

type Key = keyof ClosingCostInput;
const DEFAULTS: Record<Key, string> = {
  homePrice: '400000', downPaymentPct: '20', ratePct: '6.5', propertyTaxPct: '1.1', insuranceYearly: '1800',
  originationPct: '1', titleInsurancePct: '0.5', transferTaxPct: '0', appraisal: '600', inspection: '450',
  settlementFee: '1000', recordingFees: '150', taxEscrowMonths: '3', prepaidInterestDays: '15',
};
const FIELDS: { key: Key; label: string; prefix?: string; suffix?: string }[] = [
  { key: 'homePrice', label: 'Home price', prefix: '$' },
  { key: 'downPaymentPct', label: 'Down payment', suffix: '%' },
  { key: 'ratePct', label: 'Interest rate', suffix: '%' },
  { key: 'propertyTaxPct', label: 'Property tax rate', suffix: '%' },
  { key: 'insuranceYearly', label: 'Homeowners insurance per year', prefix: '$' },
  { key: 'originationPct', label: 'Origination fee', suffix: '%' },
  { key: 'titleInsurancePct', label: 'Title insurance', suffix: '%' },
  { key: 'transferTaxPct', label: 'Transfer tax (buyer share)', suffix: '%' },
  { key: 'appraisal', label: 'Appraisal', prefix: '$' },
  { key: 'inspection', label: 'Inspection', prefix: '$' },
  { key: 'settlementFee', label: 'Escrow / settlement fee', prefix: '$' },
  { key: 'recordingFees', label: 'Recording fees', prefix: '$' },
  { key: 'taxEscrowMonths', label: 'Months of tax escrow' },
  { key: 'prepaidInterestDays', label: 'Days of prepaid interest' },
];

export default function ClosingCostsCalculator() {
  const [v, setV] = useState(DEFAULTS);
  const r = useMemo(() => {
    const n = Object.fromEntries(Object.entries(v).map(([k, s]) => [k, Math.max(0, parseNumber(s) || 0)])) as unknown as ClosingCostInput;
    n.downPaymentPct = Math.min(100, n.downPaymentPct);
    return estimateClosingCosts(n);
  }, [v]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md shadow-gray-200/60 md:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="grid gap-4 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <NumberField key={f.key} label={f.label} prefix={f.prefix} suffix={f.suffix} value={v[f.key]} min="0" onChange={(val) => setV((s) => ({ ...s, [f.key]: val }))} />
          ))}
        </div>
        <div className="h-fit rounded-xl border border-brand-100 bg-brand-50 p-5" aria-live="polite">
          <Results
            items={[
              { label: 'Estimated closing costs', value: formatCurrency(r.total, { whole: true }), primary: true },
              { label: 'Share of home price', value: formatPercent(r.totalPctOfPrice, 1) },
              { label: 'Down payment', value: formatCurrency(r.downPayment, { whole: true }) },
              { label: 'Total cash to close', value: formatCurrency(r.cashToClose, { whole: true }) },
            ]}
            note={<p>Typical range (2%–5% of the loan): {formatCurrency(r.typicalLow, { whole: true })} to {formatCurrency(r.typicalHigh, { whole: true })}.</p>}
          />
          <ul className="mt-4 space-y-1 border-t border-brand-100 pt-3 text-sm">
            {r.items.filter((i) => i.amount > 0).map((i) => (
              <li key={i.key} className="flex justify-between gap-3"><span className="text-gray-600">{i.label}</span><span className="tabular-nums">{formatCurrency(i.amount, { whole: true })}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
