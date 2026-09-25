import { useMemo, useState } from 'react';
import { returnOnInvestment } from '../../lib/calc/roi';
import { formatCurrency, formatPercent, parseNumber } from '../../lib/format';
import { CalculatorShell, EmptyResults, NumberField, Results } from '../ui/fields';

export default function RoiCalculator() {
  const [initial, setInitial] = useState('10000');
  const [final, setFinal] = useState('15000');
  const [years, setYears] = useState('3');
  const r = useMemo(() => returnOnInvestment(parseNumber(initial), parseNumber(final), parseNumber(years)), [initial, final, years]);

  return (
    <CalculatorShell
      inputs={
        <>
          <NumberField label="Amount invested" prefix="$" value={initial} onChange={setInitial} min="0" />
          <NumberField label="Final value (including dividends and interest)" prefix="$" value={final} onChange={setFinal} min="0" />
          <NumberField label="Holding period (optional)" suffix="years" value={years} onChange={setYears} min="0" />
        </>
      }
      results={
        r && Number.isFinite(r.roiPct) ? (
          <Results
            items={[
              { label: 'Return on investment', value: formatPercent(r.roiPct), primary: true },
              { label: r.gain >= 0 ? 'Gain' : 'Loss', value: formatCurrency(Math.abs(r.gain)) },
              ...(Number.isFinite(r.annualizedPct) ? [{ label: 'Annualized return', value: formatPercent(r.annualizedPct) }] : []),
            ]}
          />
        ) : (
          <EmptyResults message="Enter an amount invested above zero and a final value." />
        )
      }
    />
  );
}
