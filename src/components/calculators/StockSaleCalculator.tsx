import { useMemo, useState } from 'react';
import { stockSale } from '../../lib/calc/stock-sale';
import { formatCurrency, formatPercent, parseNumber } from '../../lib/format';
import { CalculatorShell, NumberField, Results, SelectField } from '../ui/fields';

const TAX_PRESETS = [
  { value: '0', label: 'None / tax-advantaged account' },
  { value: '15', label: 'Long-term, 15%' },
  { value: '20', label: 'Long-term, 20%' },
  { value: '22', label: 'Short-term, 22% bracket' },
  { value: '24', label: 'Short-term, 24% bracket' },
  { value: '32', label: 'Short-term, 32% bracket' },
];

export default function StockSaleCalculator() {
  const [v, setV] = useState({ shares: '100', buy: '50', sell: '75', fees: '0', tax: '15' });
  const set = (k: keyof typeof v) => (value: string) => setV((s) => ({ ...s, [k]: value }));
  const n = (s: string) => parseNumber(s) || 0;
  const r = useMemo(() => stockSale({ shares: n(v.shares), buyPrice: n(v.buy), sellPrice: n(v.sell), fees: n(v.fees), taxRatePct: n(v.tax) }), [v]);

  return (
    <CalculatorShell
      inputs={
        <>
          <NumberField label="Number of shares" value={v.shares} onChange={set('shares')} min="0" />
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="Purchase price per share" prefix="$" value={v.buy} onChange={set('buy')} min="0" />
            <NumberField label="Sale price per share" prefix="$" value={v.sell} onChange={set('sell')} min="0" />
          </div>
          <NumberField label="Commissions and fees (total)" prefix="$" value={v.fees} onChange={set('fees')} min="0" />
          <SelectField label="Capital gains tax rate" value={v.tax} onChange={set('tax')} options={TAX_PRESETS} />
        </>
      }
      results={
        <Results
          items={[
            { label: r.gain >= 0 ? 'Profit' : 'Loss', value: formatCurrency(Math.abs(r.gain)), primary: true },
            { label: 'Sale proceeds', value: formatCurrency(r.proceeds) },
            { label: 'Cost basis (incl. fees)', value: formatCurrency(r.costBasis) },
            { label: 'Return', value: formatPercent(r.returnPct) },
            { label: 'Estimated tax', value: formatCurrency(r.tax) },
            { label: 'Profit after tax', value: formatCurrency(r.netAfterTax) },
          ]}
          note={<p>Estimates only. Short-term gains (held one year or less) are taxed as ordinary income; state taxes may also apply.</p>}
        />
      }
    />
  );
}
