import { useMemo, useState } from 'react';
import { currentRatio, rateRatio } from '../../lib/calc/liquidity';
import { formatCurrency, formatNumber, parseNumber } from '../../lib/format';
import { CalculatorShell, EmptyResults, NumberField } from '../ui/fields';
import { RatioBadge } from '../ui/RatioBadge';

export default function CurrentRatioCalculator() {
  const [assets, setAssets] = useState('250000');
  const [liabilities, setLiabilities] = useState('125000');
  const a = parseNumber(assets);
  const l = parseNumber(liabilities);
  const ratio = useMemo(() => currentRatio(a, l), [a, l]);

  return (
    <CalculatorShell
      inputs={
        <>
          <NumberField label="Current assets" prefix="$" value={assets} onChange={setAssets} min="0" hint="Cash, receivables, inventory, and other assets convertible within a year." />
          <NumberField label="Current liabilities" prefix="$" value={liabilities} onChange={setLiabilities} min="0" hint="Payables, short-term debt, and other obligations due within a year." />
        </>
      }
      results={
        Number.isFinite(ratio) ? (
          <div>
            <p className="text-sm text-gray-600">Current ratio</p>
            <p className="text-4xl font-bold tracking-tight text-gray-900">{formatNumber(ratio, 2)}<RatioBadge health={rateRatio('current', ratio)} /></p>
            <p className="mt-3 text-gray-700">You have {formatCurrency(ratio)} of current assets for every $1 of current liabilities.</p>
            <p className="mt-2 text-sm text-gray-600">Working capital: {formatCurrency(a - l, { whole: true })}</p>
          </div>
        ) : (
          <EmptyResults message="Current liabilities must be greater than zero." />
        )
      }
    />
  );
}
