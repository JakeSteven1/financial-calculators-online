import { useMemo, useState } from 'react';
import { quickRatio, rateRatio } from '../../lib/calc/liquidity';
import { formatNumber, parseNumber } from '../../lib/format';
import { CalculatorShell, EmptyResults, NumberField } from '../ui/fields';
import { RatioBadge } from '../ui/RatioBadge';

export default function QuickRatioCalculator() {
  const [assets, setAssets] = useState('250000');
  const [inventory, setInventory] = useState('80000');
  const [prepaid, setPrepaid] = useState('10000');
  const [liabilities, setLiabilities] = useState('125000');
  const ratio = useMemo(
    () => quickRatio(parseNumber(assets), parseNumber(inventory) || 0, parseNumber(liabilities), parseNumber(prepaid) || 0),
    [assets, inventory, prepaid, liabilities],
  );

  return (
    <CalculatorShell
      inputs={
        <>
          <NumberField label="Current assets" prefix="$" value={assets} onChange={setAssets} min="0" />
          <NumberField label="Inventory" prefix="$" value={inventory} onChange={setInventory} min="0" />
          <NumberField label="Prepaid expenses" prefix="$" value={prepaid} onChange={setPrepaid} min="0" />
          <NumberField label="Current liabilities" prefix="$" value={liabilities} onChange={setLiabilities} min="0" />
        </>
      }
      results={
        Number.isFinite(ratio) ? (
          <div>
            <p className="text-sm text-gray-600">Quick ratio (acid test)</p>
            <p className="text-4xl font-bold tracking-tight text-gray-900">{formatNumber(ratio, 2)}<RatioBadge health={rateRatio('quick', ratio)} /></p>
            <p className="mt-3 text-gray-700">{ratio >= 1 ? 'Liquid assets cover current liabilities without selling inventory.' : 'Liquid assets alone would not cover current liabilities.'}</p>
          </div>
        ) : (
          <EmptyResults message="Current liabilities must be greater than zero." />
        )
      }
    />
  );
}
