import { useMemo, useState } from 'react';
import { carLoan } from '../../lib/calc/car-loan';
import { formatCurrency, parseNumber } from '../../lib/format';
import { CalculatorShell, EmptyResults, NumberField, Results, SelectField } from '../ui/fields';

export default function CarLoanCalculator() {
  const [v, setV] = useState({ price: '35000', down: '5000', tradeIn: '0', owed: '0', tax: '6', fees: '500', rate: '7', months: '60' });
  const set = (k: keyof typeof v) => (value: string) => setV((s) => ({ ...s, [k]: value }));
  const n = (s: string) => parseNumber(s) || 0;

  const r = useMemo(
    () => carLoan({ price: n(v.price), downPayment: n(v.down), tradeInValue: n(v.tradeIn), tradeInOwed: n(v.owed), salesTaxPct: n(v.tax), fees: n(v.fees), ratePct: n(v.rate), months: n(v.months) }),
    [v],
  );

  return (
    <CalculatorShell
      inputs={
        <>
          <NumberField label="Vehicle price" prefix="$" value={v.price} onChange={set('price')} min="0" />
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="Down payment" prefix="$" value={v.down} onChange={set('down')} min="0" />
            <NumberField label="Sales tax" suffix="%" value={v.tax} onChange={set('tax')} min="0" />
            <NumberField label="Trade-in value" prefix="$" value={v.tradeIn} onChange={set('tradeIn')} min="0" />
            <NumberField label="Owed on trade-in" prefix="$" value={v.owed} onChange={set('owed')} min="0" />
            <NumberField label="Interest rate (APR)" suffix="%" value={v.rate} onChange={set('rate')} min="0" />
            <SelectField label="Loan term" value={v.months} onChange={set('months')} options={['24', '36', '48', '60', '72', '84'].map((m) => ({ value: m, label: `${m} months` }))} />
          </div>
          <NumberField label="Title, registration, and fees" prefix="$" value={v.fees} onChange={set('fees')} min="0" />
        </>
      }
      results={
        r ? (
          <Results
            items={[
              { label: 'Monthly payment', value: formatCurrency(r.monthlyPayment), primary: true },
              { label: 'Amount financed', value: formatCurrency(r.loanAmount) },
              { label: 'Sales tax', value: formatCurrency(r.salesTax) },
              { label: 'Total interest', value: formatCurrency(r.totalInterest) },
              { label: 'Total cost of the car', value: formatCurrency(r.totalCost) },
            ]}
          />
        ) : (
          <EmptyResults />
        )
      }
    />
  );
}
