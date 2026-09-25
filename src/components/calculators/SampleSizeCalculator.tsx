import { useMemo, useState } from 'react';
import { marginOfError, sampleSize, Z_SCORES } from '../../lib/calc/sample-size';
import { formatNumber, parseNumber } from '../../lib/format';
import { CalculatorShell, EmptyResults, NumberField, Results, SelectField } from '../ui/fields';

export default function SampleSizeCalculator() {
  const [confidence, setConfidence] = useState('95');
  const [moe, setMoe] = useState('5');
  const [population, setPopulation] = useState('');
  const [proportion, setProportion] = useState('50');

  const result = useMemo(() => {
    const pop = parseNumber(population);
    const n = sampleSize(confidence, parseNumber(moe), Number.isFinite(pop) ? pop : undefined, parseNumber(proportion));
    return Number.isFinite(n) ? { n, z: Z_SCORES[confidence]!, check: marginOfError(confidence, n, Number.isFinite(pop) ? pop : undefined, parseNumber(proportion)) } : null;
  }, [confidence, moe, population, proportion]);

  return (
    <CalculatorShell
      inputs={
        <>
          <SelectField label="Confidence level" value={confidence} onChange={setConfidence} options={Object.keys(Z_SCORES).map((k) => ({ value: k, label: `${k}%` }))} />
          <NumberField label="Margin of error" suffix="%" value={moe} onChange={setMoe} min="0.1" />
          <NumberField label="Population size (optional)" value={population} onChange={setPopulation} min="1" hint="Leave blank for a very large or unknown population." />
          <NumberField label="Expected proportion" suffix="%" value={proportion} onChange={setProportion} min="1" max="99" hint="50% is the most conservative choice." />
        </>
      }
      results={
        result ? (
          <Results
            items={[
              { label: 'Recommended sample size', value: formatNumber(result.n, 0), primary: true },
              { label: 'z-score', value: formatNumber(result.z, 4) },
              { label: 'Achieved margin of error', value: `±${formatNumber(result.check, 2)}%` },
            ]}
            note={<p>Plan for non-responses: if you expect 20% to reply, invite about {formatNumber(Math.ceil(result.n / 0.2), 0)} people.</p>}
          />
        ) : (
          <EmptyResults message="Enter a margin of error above 0 and a proportion between 1% and 99%." />
        )
      }
    />
  );
}
