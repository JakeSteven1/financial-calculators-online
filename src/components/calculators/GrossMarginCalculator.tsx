import { useMemo, useState } from 'react';
import { grossMargin, priceForMargin } from '../../lib/calc/gross-margin';
import { formatCurrency, formatPercent, parseNumber } from '../../lib/format';
import { CalculatorShell, EmptyResults, NumberField, Results } from '../ui/fields';

export default function GrossMarginCalculator() {
  const [revenue, setRevenue] = useState('100');
  const [cogs, setCogs] = useState('55');
  const [other, setOther] = useState('5');
  const [target, setTarget] = useState('50');

  const result = useMemo(() => {
    const rev = parseNumber(revenue);
    const cost = parseNumber(cogs) + (parseNumber(other) || 0);
    if (!Number.isFinite(rev) || !Number.isFinite(cost)) return null;
    const t = parseNumber(target);
    return { ...grossMargin(rev, cost), cost, targetPrice: Number.isFinite(t) ? priceForMargin(cost, t) : NaN };
  }, [revenue, cogs, other, target]);

  return (
    <CalculatorShell
      inputs={
        <>
          <NumberField label="Revenue (selling price)" prefix="$" value={revenue} onChange={setRevenue} min="0" />
          <NumberField label="Cost of goods sold" prefix="$" value={cogs} onChange={setCogs} min="0" hint="What you paid to make or buy the item." />
          <NumberField label="Other direct costs (optional)" prefix="$" value={other} onChange={setOther} min="0" hint="Per-sale costs like shipping or marketing." />
          <NumberField label="Target gross margin (optional)" suffix="%" value={target} onChange={setTarget} />
        </>
      }
      results={
        result ? (
          <Results
            items={[
              { label: 'Gross margin', value: formatPercent(result.marginPct), primary: true },
              { label: 'Gross profit', value: formatCurrency(result.grossProfit) },
              { label: 'Total cost', value: formatCurrency(result.cost) },
              { label: 'Markup', value: formatPercent(result.markupPct) },
              ...(Number.isFinite(result.targetPrice) ? [{ label: `Price for a ${target}% margin`, value: formatCurrency(result.targetPrice) }] : []),
            ]}
          />
        ) : (
          <EmptyResults />
        )
      }
    />
  );
}
