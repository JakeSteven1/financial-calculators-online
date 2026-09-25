import { useMemo, useState } from 'react';
import { breakEven } from '../../lib/calc/break-even';
import { formatCurrency, formatNumber, formatPercent, parseNumber } from '../../lib/format';
import { CalculatorShell, EmptyResults, NumberField, Results } from '../ui/fields';

function BreakEvenChart({ fixed, price, variable, units }: { fixed: number; price: number; variable: number; units: number }) {
  const w = 640;
  const h = 260;
  const pad = { l: 72, r: 12, t: 12, b: 36 };
  const maxUnits = Math.max(1, units * 2);
  const maxY = Math.max(price * maxUnits, fixed + variable * maxUnits);
  const x = (u: number) => pad.l + (u / maxUnits) * (w - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - v / maxY) * (h - pad.t - pad.b);
  return (
    <figure className="mt-6">
      <svg viewBox={`0 0 ${w} ${h}`} className="mx-auto h-auto w-full max-w-3xl" role="img" aria-label="Break-even chart of revenue and total cost">
        <line x1={pad.l} y1={y(0)} x2={w - pad.r} y2={y(0)} stroke="#cbd5e1" />
        <line x1={pad.l} y1={pad.t} x2={pad.l} y2={y(0)} stroke="#cbd5e1" />
        <line x1={x(0)} y1={y(fixed)} x2={x(maxUnits)} y2={y(fixed + variable * maxUnits)} stroke="#b91c1c" strokeWidth="3" />
        <line x1={x(0)} y1={y(0)} x2={x(maxUnits)} y2={y(price * maxUnits)} stroke="#1f7a45" strokeWidth="3" />
        <circle cx={x(units)} cy={y(price * units)} r="6" fill="#124b2e" />
        <text x={x(units)} y={h - 12} textAnchor="middle" fontSize="14" fill="#334155">{formatNumber(units, 0)} units</text>
        <text x={pad.l - 6} y={y(price * units) + 5} textAnchor="end" fontSize="14" fill="#334155">{formatCurrency(price * units, { whole: true })}</text>
      </svg>
      <figcaption className="mt-2 flex gap-4 text-sm text-slate-600">
        <span className="inline-flex items-center gap-2"><span className="h-1 w-4 bg-[#1f7a45]" />Revenue</span>
        <span className="inline-flex items-center gap-2"><span className="h-1 w-4 bg-[#b91c1c]" />Total cost</span>
      </figcaption>
    </figure>
  );
}

export default function BreakEvenCalculator() {
  const [fixed, setFixed] = useState('10000');
  const [price, setPrice] = useState('50');
  const [variable, setVariable] = useState('30');
  const [profit, setProfit] = useState('0');

  const inputs = [fixed, price, variable].map(parseNumber) as [number, number, number];
  const result = useMemo(() => {
    if (!inputs.every(Number.isFinite)) return null;
    return breakEven({ fixedCosts: inputs[0], pricePerUnit: inputs[1], variableCostPerUnit: inputs[2], targetProfit: parseNumber(profit) || 0 });
  }, [fixed, price, variable, profit]);
  const goal = parseNumber(profit) || 0;

  return (
    <div>
      <CalculatorShell
        inputs={
          <>
            <NumberField label="Fixed costs" prefix="$" value={fixed} onChange={setFixed} min="0" hint="Rent, salaries, insurance: costs that don't change with volume." />
            <NumberField label="Selling price per unit" prefix="$" value={price} onChange={setPrice} min="0" />
            <NumberField label="Variable cost per unit" prefix="$" value={variable} onChange={setVariable} min="0" hint="Materials, shipping, commissions: costs per unit sold." />
            <NumberField label="Profit goal (optional)" prefix="$" value={profit} onChange={setProfit} min="0" />
          </>
        }
        results={
          result ? (
            <Results
              items={[
                { label: goal > 0 ? 'Units to reach profit goal' : 'Break-even units', value: formatNumber(result.unitsWhole, 0), primary: true },
                { label: goal > 0 ? 'Revenue to reach profit goal' : 'Break-even revenue', value: formatCurrency(result.revenue) },
                { label: 'Contribution margin per unit', value: formatCurrency(result.contributionMargin) },
                { label: 'Contribution margin ratio', value: formatPercent(result.contributionMarginRatio) },
              ]}
            />
          ) : (
            <EmptyResults message="Price per unit must be higher than variable cost per unit." />
          )
        }
      />
      {result && goal === 0 && result.units > 0 && <BreakEvenChart fixed={inputs[0]} price={inputs[1]} variable={inputs[2]} units={result.units} />}
    </div>
  );
}
