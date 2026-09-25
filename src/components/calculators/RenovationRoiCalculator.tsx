import { useMemo, useState } from 'react';
import { renovationRoi } from '../../lib/calc/renovation-roi';
import { formatCurrency, formatPercent, parseNumber } from '../../lib/format';
import { CalculatorShell, EmptyResults, NumberField, Results } from '../ui/fields';

export default function RenovationRoiCalculator() {
  const [cost, setCost] = useState('30000');
  const [increase, setIncrease] = useState('24000');
  const r = useMemo(() => renovationRoi(parseNumber(cost), parseNumber(increase)), [cost, increase]);

  return (
    <CalculatorShell
      inputs={
        <>
          <NumberField label="Renovation cost" prefix="$" value={cost} onChange={setCost} min="0" />
          <NumberField label="Estimated increase in home value" prefix="$" value={increase} onChange={setIncrease} hint="Ask an agent or appraiser, or compare recent sales of updated homes." />
        </>
      }
      results={
        r ? (
          <Results
            items={[
              { label: 'Return on investment', value: formatPercent(r.roiPct, 1), primary: true },
              { label: 'Cost recovered at sale', value: formatPercent(r.costRecoveredPct, 1) },
              { label: r.netGain >= 0 ? 'Net gain' : 'Net cost', value: formatCurrency(Math.abs(r.netGain), { whole: true }) },
            ]}
            note={<p>Most remodels recover less than 100% of their cost at sale; the rest is the value of enjoying the upgrade while you live there.</p>}
          />
        ) : (
          <EmptyResults message="Enter a renovation cost above zero." />
        )
      }
    />
  );
}
