import { useMemo, useState } from 'react';
import { customerLifetimeValue, type ClvMode } from '../../lib/calc/clv';
import { formatCurrency, formatNumber, parseNumber } from '../../lib/format';
import { CalculatorShell, EmptyResults, NumberField, Results, SelectField, type ResultItem } from '../ui/fields';

export default function ClvCalculator() {
  const [apv, setApv] = useState('50');
  const [freq, setFreq] = useState('4');
  const [margin, setMargin] = useState('100');
  const [mode, setMode] = useState<ClvMode>('lifespan');
  const [lifespan, setLifespan] = useState('3');
  const [retention, setRetention] = useState('70');
  const [discount, setDiscount] = useState('0');
  const [cac, setCac] = useState('');

  const result = useMemo(() => {
    const nums = [apv, freq, margin].map(parseNumber);
    if (!nums.every(Number.isFinite)) return null;
    return customerLifetimeValue({
      avgPurchaseValue: nums[0]!,
      purchasesPerYear: nums[1]!,
      grossMargin: nums[2]!,
      mode,
      lifespanYears: parseNumber(lifespan),
      retentionRate: parseNumber(retention),
      discountRate: parseNumber(discount) || 0,
      acquisitionCost: parseNumber(cac),
    });
  }, [apv, freq, margin, mode, lifespan, retention, discount, cac]);

  const items: ResultItem[] = result
    ? [
        { label: 'Customer lifetime value', value: formatCurrency(result.clv), primary: true },
        { label: 'Value per customer per year', value: formatCurrency(result.annualValue) },
        { label: 'Expected customer lifespan', value: `${formatNumber(result.expectedLifespanYears, 1)} years` },
        ...(Number.isFinite(result.netClv)
          ? [
              { label: 'CLV after acquisition cost', value: formatCurrency(result.netClv) },
              { label: 'CLV : CAC ratio', value: `${formatNumber(result.clvToCac, 1)} : 1` },
            ]
          : []),
      ]
    : [];

  return (
    <CalculatorShell
      inputs={
        <>
          <NumberField label="Average purchase value" prefix="$" value={apv} onChange={setApv} min="0" />
          <NumberField label="Purchases per customer per year" value={freq} onChange={setFreq} min="0" />
          <NumberField label="Gross margin" suffix="%" value={margin} onChange={setMargin} hint="Use 100% for revenue-based CLV, or your margin for profit-based CLV." />
          <SelectField
            label="Estimate customer lifespan from"
            value={mode}
            onChange={setMode}
            options={[
              { value: 'lifespan', label: 'Average lifespan in years' },
              { value: 'retention', label: 'Annual retention rate' },
            ]}
          />
          {mode === 'lifespan' ? (
            <NumberField label="Customer lifespan" suffix="years" value={lifespan} onChange={setLifespan} min="0" />
          ) : (
            <NumberField label="Annual retention rate" suffix="%" value={retention} onChange={setRetention} min="0" max="99.9" />
          )}
          <NumberField label="Discount rate (optional)" suffix="%" value={discount} onChange={setDiscount} min="0" hint="Converts future revenue to today's dollars." />
          <NumberField label="Customer acquisition cost (optional)" prefix="$" value={cac} onChange={setCac} min="0" />
        </>
      }
      results={
        result ? (
          <Results
            items={items}
            note={Number.isFinite(result.clvToCac) ? <p>A CLV:CAC ratio of 3:1 or better is a common benchmark for a healthy business.</p> : undefined}
          />
        ) : (
          <EmptyResults message={mode === 'retention' ? 'Retention must be between 0% and 99.9%.' : undefined} />
        )
      }
    />
  );
}
