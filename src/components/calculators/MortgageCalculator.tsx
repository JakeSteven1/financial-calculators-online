import { useMemo, useState } from 'react';
import { amortize } from '../../lib/calc/loan';
import { mortgagePayment } from '../../lib/calc/mortgage';
import { formatCurrency, formatPercent, parseNumber } from '../../lib/format';
import { AmortizationTable } from '../ui/AmortizationTable';
import { CalculatorShell, EmptyResults, NumberField, Results, SelectField } from '../ui/fields';

export default function MortgageCalculator() {
  const [price, setPrice] = useState('400000');
  const [down, setDown] = useState('20');
  const [downUnit, setDownUnit] = useState<'pct' | 'usd'>('pct');
  const [rate, setRate] = useState('6.5');
  const [years, setYears] = useState('30');
  const [tax, setTax] = useState('4800');
  const [insurance, setInsurance] = useState('1800');
  const [hoa, setHoa] = useState('0');
  const [pmi, setPmi] = useState('0.5');

  const result = useMemo(() => {
    const homePrice = parseNumber(price);
    const d = parseNumber(down);
    const r = parseNumber(rate);
    const y = parseNumber(years);
    if (![homePrice, d, r, y].every(Number.isFinite)) return null;
    const downPayment = downUnit === 'pct' ? (homePrice * d) / 100 : d;
    const m = mortgagePayment({
      homePrice, downPayment, ratePct: r, years: y,
      propertyTaxYearly: parseNumber(tax) || 0, insuranceYearly: parseNumber(insurance) || 0,
      hoaMonthly: parseNumber(hoa) || 0, pmiRatePct: parseNumber(pmi) || 0,
    });
    return m && { ...m, schedule: amortize(m.loanAmount, r, Math.round(y * 12)) };
  }, [price, down, downUnit, rate, years, tax, insurance, hoa, pmi]);

  return (
    <div>
      <CalculatorShell
        inputs={
          <>
            <NumberField label="Home price" prefix="$" value={price} onChange={setPrice} min="0" />
            <div className="grid grid-cols-[1fr_7rem] gap-3">
              <NumberField label="Down payment" prefix={downUnit === 'usd' ? '$' : undefined} suffix={downUnit === 'pct' ? '%' : undefined} value={down} onChange={setDown} min="0" />
              <SelectField label="Unit" value={downUnit} onChange={setDownUnit} options={[{ value: 'pct', label: '%' }, { value: 'usd', label: '$' }]} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <NumberField label="Interest rate" suffix="%" value={rate} onChange={setRate} min="0" />
              <SelectField label="Loan term" value={years} onChange={setYears} options={['30', '25', '20', '15', '10'].map((v) => ({ value: v, label: `${v} years` }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <NumberField label="Property tax per year" prefix="$" value={tax} onChange={setTax} min="0" />
              <NumberField label="Home insurance per year" prefix="$" value={insurance} onChange={setInsurance} min="0" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <NumberField label="HOA per month" prefix="$" value={hoa} onChange={setHoa} min="0" />
              <NumberField label="PMI rate (if < 20% down)" suffix="%" value={pmi} onChange={setPmi} min="0" />
            </div>
          </>
        }
        results={
          result ? (
            <Results
              items={[
                { label: 'Total monthly payment', value: formatCurrency(result.totalMonthly), primary: true },
                { label: 'Principal and interest', value: formatCurrency(result.principalAndInterest) },
                { label: 'Property tax', value: formatCurrency(result.propertyTax) },
                { label: 'Home insurance', value: formatCurrency(result.insurance) },
                ...(result.hoa ? [{ label: 'HOA', value: formatCurrency(result.hoa) }] : []),
                ...(result.pmi ? [{ label: 'PMI', value: formatCurrency(result.pmi) }] : []),
                { label: 'Loan amount', value: formatCurrency(result.loanAmount, { whole: true }) },
                { label: 'Down payment', value: formatPercent(result.downPaymentPct, 1) },
                { label: 'Total interest over the loan', value: formatCurrency(result.totalInterest, { whole: true }) },
              ]}
            />
          ) : (
            <EmptyResults message="Check the home price and down payment." />
          )
        }
      />
      {result && result.schedule.rows.length > 0 && <AmortizationTable rows={result.schedule.rows} />}
    </div>
  );
}
