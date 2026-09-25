import { useMemo, useState } from 'react';
import { customerAcquisitionCost } from '../../lib/calc/cac';
import { formatCurrency, formatNumber, parseNumber } from '../../lib/format';
import { CalculatorShell, EmptyResults, NumberField, Results, type ResultItem } from '../ui/fields';

export default function CacCalculator() {
  const [v, setV] = useState({ marketing: '20000', sales: '15000', other: '5000', customers: '200', arpu: '', margin: '80', ltv: '' });
  const set = (k: keyof typeof v) => (value: string) => setV((s) => ({ ...s, [k]: value }));
  const n = (s: string) => parseNumber(s);

  const r = useMemo(
    () =>
      customerAcquisitionCost({
        marketingSpend: n(v.marketing) || 0, salesSpend: n(v.sales) || 0, otherCosts: n(v.other) || 0, newCustomers: n(v.customers),
        monthlyRevenuePerCustomer: n(v.arpu) || 0, grossMarginPct: n(v.margin), lifetimeValue: n(v.ltv) || 0,
      }),
    [v],
  );

  const items: ResultItem[] = r
    ? [
        { label: 'Customer acquisition cost', value: formatCurrency(r.cac), primary: true },
        { label: 'Total acquisition spend', value: formatCurrency(r.totalSpend, { whole: true }) },
        ...(Number.isFinite(r.paybackMonths) ? [{ label: 'CAC payback period', value: `${formatNumber(r.paybackMonths, 1)} months` }] : []),
        ...(Number.isFinite(r.ltvToCac) ? [{ label: 'LTV : CAC ratio', value: `${formatNumber(r.ltvToCac, 1)} : 1` }] : []),
      ]
    : [];

  return (
    <CalculatorShell
      inputs={
        <>
          <NumberField label="Marketing spend" prefix="$" value={v.marketing} onChange={set('marketing')} min="0" hint="Ads, content, events, agency fees." />
          <NumberField label="Sales spend" prefix="$" value={v.sales} onChange={set('sales')} min="0" hint="Sales salaries, commissions, tools." />
          <NumberField label="Other acquisition costs" prefix="$" value={v.other} onChange={set('other')} min="0" />
          <NumberField label="New customers acquired" value={v.customers} onChange={set('customers')} min="0" step="1" />
          <h3 className="pt-2 text-sm font-semibold text-slate-900">Optional: payback and LTV</h3>
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="Monthly revenue per customer" prefix="$" value={v.arpu} onChange={set('arpu')} min="0" />
            <NumberField label="Gross margin" suffix="%" value={v.margin} onChange={set('margin')} min="0" />
          </div>
          <NumberField label="Customer lifetime value" prefix="$" value={v.ltv} onChange={set('ltv')} min="0" />
        </>
      }
      results={r ? <Results items={items} note={<p>Benchmarks: LTV:CAC of 3:1 or higher, and CAC payback under 12 months, are common targets.</p>} /> : <EmptyResults message="Enter the number of new customers." />}
    />
  );
}
