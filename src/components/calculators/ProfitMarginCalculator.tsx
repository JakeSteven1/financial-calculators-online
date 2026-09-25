import { useMemo, useState } from 'react';
import { profitMargin } from '../../lib/calc/profit-margin';
import { formatCurrency, formatPercent, parseNumber } from '../../lib/format';
import { CalculatorShell, NumberField, Results } from '../ui/fields';

export default function ProfitMarginCalculator() {
  const [v, setV] = useState({ price: '100', material: '30', labor: '15', overhead: '10', other: '5', units: '1000', opex: '20000', tax: '21' });
  const set = (k: keyof typeof v) => (value: string) => setV((s) => ({ ...s, [k]: value }));
  const n = (s: string) => parseNumber(s) || 0;

  const r = useMemo(
    () => profitMargin({ pricePerUnit: n(v.price), materialCost: n(v.material), laborCost: n(v.labor), overheadCost: n(v.overhead), otherDirectCost: n(v.other), units: n(v.units), operatingExpenses: n(v.opex), taxRatePct: n(v.tax) }),
    [v],
  );

  return (
    <CalculatorShell
      inputs={
        <>
          <NumberField label="Selling price per unit" prefix="$" value={v.price} onChange={set('price')} min="0" />
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="Material cost per unit" prefix="$" value={v.material} onChange={set('material')} min="0" />
            <NumberField label="Direct labor per unit" prefix="$" value={v.labor} onChange={set('labor')} min="0" />
            <NumberField label="Manufacturing overhead per unit" prefix="$" value={v.overhead} onChange={set('overhead')} min="0" />
            <NumberField label="Other direct costs per unit" prefix="$" value={v.other} onChange={set('other')} min="0" />
          </div>
          <h3 className="pt-2 text-sm font-semibold text-slate-900">For net profit margin (optional)</h3>
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="Units sold" value={v.units} onChange={set('units')} min="0" />
            <NumberField label="Operating expenses" prefix="$" value={v.opex} onChange={set('opex')} min="0" />
            <NumberField label="Tax rate" suffix="%" value={v.tax} onChange={set('tax')} min="0" />
          </div>
        </>
      }
      results={
        <Results
          items={[
            { label: 'Gross profit margin', value: formatPercent(r.grossMarginPct), primary: true },
            { label: 'Cost per unit', value: formatCurrency(r.costPerUnit) },
            { label: 'Gross profit per unit', value: formatCurrency(r.grossProfitPerUnit) },
            { label: 'Markup', value: formatPercent(r.markupPct) },
            { label: 'Revenue', value: formatCurrency(r.revenue, { whole: true }) },
            { label: 'Operating profit', value: formatCurrency(r.operatingProfit, { whole: true }) },
            { label: 'Operating margin', value: formatPercent(r.operatingMarginPct) },
            { label: 'Net profit (after tax)', value: formatCurrency(r.netProfit, { whole: true }) },
            { label: 'Net profit margin', value: formatPercent(r.netMarginPct) },
          ]}
        />
      }
    />
  );
}
