import { useMemo, useState } from 'react';
import { liquidityRatios, rateRatio } from '../../lib/calc/liquidity';
import { formatCurrency, formatNumber, parseNumber } from '../../lib/format';
import { CalculatorShell, EmptyResults, NumberField } from '../ui/fields';
import { RatioBadge } from '../ui/RatioBadge';

export default function LiquidityRatioCalculator() {
  const [ca, setCa] = useState('300000');
  const [cl, setCl] = useState('150000');
  const [inv, setInv] = useState('100000');
  const [prepaid, setPrepaid] = useState('0');
  const [cash, setCash] = useState('50000');
  const [securities, setSecurities] = useState('25000');

  const result = useMemo(() => {
    const currentAssets = parseNumber(ca);
    const currentLiabilities = parseNumber(cl);
    if (!Number.isFinite(currentAssets) || !(currentLiabilities > 0)) return null;
    const opt = (s: string) => parseNumber(s) || 0;
    return liquidityRatios({ currentAssets, currentLiabilities, inventory: opt(inv), prepaidExpenses: opt(prepaid), cash: opt(cash), marketableSecurities: opt(securities) });
  }, [ca, cl, inv, prepaid, cash, securities]);

  const rows = result
    ? ([
        ['Current ratio', result.current, rateRatio('current', result.current), 'Healthy: 1.5 or higher'],
        ['Quick (acid-test) ratio', result.quick, rateRatio('quick', result.quick), 'Healthy: 1.0 or higher'],
        ['Cash ratio', result.cash, rateRatio('cash', result.cash), 'Typical: 0.5 or higher'],
      ] as const)
    : [];

  return (
    <CalculatorShell
      inputs={
        <>
          <NumberField label="Total current assets" prefix="$" value={ca} onChange={setCa} min="0" />
          <NumberField label="Total current liabilities" prefix="$" value={cl} onChange={setCl} min="0" />
          <NumberField label="Inventory" prefix="$" value={inv} onChange={setInv} min="0" />
          <NumberField label="Prepaid expenses" prefix="$" value={prepaid} onChange={setPrepaid} min="0" />
          <NumberField label="Cash" prefix="$" value={cash} onChange={setCash} min="0" />
          <NumberField label="Cash equivalents and marketable securities" prefix="$" value={securities} onChange={setSecurities} min="0" />
        </>
      }
      results={
        result ? (
          <div className="space-y-4">
            {rows.map(([label, value, health, note]) => (
              <div key={label} className="border-b border-brand-100 pb-3">
                <p className="text-sm text-gray-600">{label}</p>
                <p className="text-4xl font-bold tracking-tight text-gray-900 tabular-nums">{formatNumber(value, 2)}<RatioBadge health={health} /></p>
                <p className="text-xs text-gray-600">{note}</p>
              </div>
            ))}
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Working capital</span>
              <span className="font-semibold text-gray-900">{formatCurrency(result.workingCapital)}</span>
            </div>
          </div>
        ) : (
          <EmptyResults message="Enter current assets and current liabilities greater than zero." />
        )
      }
    />
  );
}
