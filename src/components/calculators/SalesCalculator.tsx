import { useMemo, useState } from 'react';
import { solveSales, type SalesField } from '../../lib/calc/sales';
import { formatCurrency, formatPercent, parseNumber } from '../../lib/format';
import { Button, CalculatorShell, EmptyResults, NumberField, Results } from '../ui/fields';

const LABELS: Record<SalesField, string> = {
  cost: 'Cost',
  revenue: 'Revenue (selling price)',
  profit: 'Gross profit',
  margin: 'Gross margin',
  markup: 'Markup',
};

export default function SalesCalculator() {
  const [values, setValues] = useState<Record<SalesField, string>>({ cost: '60', revenue: '100', profit: '', margin: '', markup: '' });
  const [units, setUnits] = useState('1');
  const set = (f: SalesField) => (v: string) => setValues((prev) => ({ ...prev, [f]: v }));

  const result = useMemo(() => {
    const known: Partial<Record<SalesField, number>> = {};
    for (const [k, v] of Object.entries(values) as [SalesField, string][]) {
      const n = parseNumber(v);
      if (Number.isFinite(n)) known[k] = n;
    }
    return solveSales(known);
  }, [values]);

  const qty = Math.max(0, parseNumber(units) || 0);

  return (
    <CalculatorShell
      inputs={
        <>
          <p className="text-sm text-gray-600">Enter any two values and leave the rest blank. If you fill in more, the first two are used.</p>
          <NumberField label={`${LABELS.cost} per unit`} prefix="$" value={values.cost} onChange={set('cost')} />
          <NumberField label={`${LABELS.revenue} per unit`} prefix="$" value={values.revenue} onChange={set('revenue')} />
          <NumberField label={`${LABELS.profit} per unit`} prefix="$" value={values.profit} onChange={set('profit')} />
          <NumberField label={LABELS.margin} suffix="%" value={values.margin} onChange={set('margin')} />
          <NumberField label={LABELS.markup} suffix="%" value={values.markup} onChange={set('markup')} />
          <NumberField label="Units sold" value={units} onChange={setUnits} min="0" step="1" />
          <Button variant="secondary" onClick={() => setValues({ cost: '', revenue: '', profit: '', margin: '', markup: '' })}>Clear</Button>
        </>
      }
      results={
        result.ok ? (
          <Results
            items={[
              { label: 'Gross profit per unit', value: formatCurrency(result.figures.profit), primary: true },
              { label: 'Cost per unit', value: formatCurrency(result.figures.cost) },
              { label: 'Revenue per unit', value: formatCurrency(result.figures.revenue) },
              { label: 'Gross margin', value: formatPercent(result.figures.margin) },
              { label: 'Markup', value: formatPercent(result.figures.markup) },
              { label: `Total revenue (${qty} units)`, value: formatCurrency(result.figures.revenue * qty) },
              { label: `Total cost (${qty} units)`, value: formatCurrency(result.figures.cost * qty) },
              { label: `Total gross profit (${qty} units)`, value: formatCurrency(result.figures.profit * qty) },
            ]}
            note={<p>Calculated from {LABELS[result.usedFields[0]].toLowerCase()} and {LABELS[result.usedFields[1]].toLowerCase()}.</p>}
          />
        ) : (
          <EmptyResults message={result.error} />
        )
      }
    />
  );
}
