import { useMemo, useState } from 'react';
import { homeSellingPrice } from '../../lib/calc/home-sale';
import { formatCurrency, parseNumber } from '../../lib/format';
import { CalculatorShell, EmptyResults, NumberField, Results } from '../ui/fields';

export default function HomeSellingPriceCalculator() {
  const [v, setV] = useState({ purchase: '300000', improvements: '20000', profit: '50000', closing: '6000', commission: '5.5', payoff: '200000' });
  const set = (k: keyof typeof v) => (value: string) => setV((s) => ({ ...s, [k]: value }));
  const n = (s: string) => parseNumber(s) || 0;
  const r = useMemo(
    () => homeSellingPrice({ purchasePrice: n(v.purchase), improvements: n(v.improvements), desiredProfit: n(v.profit), closingCosts: n(v.closing), commissionPct: n(v.commission), mortgagePayoff: n(v.payoff) }),
    [v],
  );

  return (
    <CalculatorShell
      inputs={
        <>
          <NumberField label="Original purchase price" prefix="$" value={v.purchase} onChange={set('purchase')} min="0" />
          <NumberField label="Improvements made" prefix="$" value={v.improvements} onChange={set('improvements')} min="0" />
          <NumberField label="Desired profit" prefix="$" value={v.profit} onChange={set('profit')} />
          <NumberField label="Seller closing costs" prefix="$" value={v.closing} onChange={set('closing')} min="0" hint="Title, transfer taxes, attorney, and concessions." />
          <NumberField label="Agent commission" suffix="%" value={v.commission} onChange={set('commission')} min="0" />
          <NumberField label="Mortgage payoff (optional)" prefix="$" value={v.payoff} onChange={set('payoff')} min="0" />
        </>
      }
      results={
        r ? (
          <Results
            items={[
              { label: 'Minimum selling price', value: formatCurrency(r.sellingPrice, { whole: true }), primary: true },
              { label: 'Agent commission', value: formatCurrency(r.commission, { whole: true }) },
              { label: 'Purchase price + improvements', value: formatCurrency(r.totalInvested, { whole: true }) },
              { label: 'Cash to you at closing', value: formatCurrency(r.cashAtClosing, { whole: true }) },
            ]}
          />
        ) : (
          <EmptyResults message="Commission must be below 100%." />
        )
      }
    />
  );
}
