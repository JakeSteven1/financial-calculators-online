import { useMemo, useState } from 'react';
import { adFunnel, costPerLead } from '../../lib/calc/cost-per-lead';
import { formatCurrency, formatPercent, parseNumber } from '../../lib/format';
import { CalculatorShell, EmptyResults, NumberField, Results, SelectField } from '../ui/fields';

type Mode = 'simple' | 'funnel';

export default function CostPerLeadCalculator() {
  const [mode, setMode] = useState<Mode>('simple');
  const [spend, setSpend] = useState('5000');
  const [leads, setLeads] = useState('200');
  const [cpc, setCpc] = useState('2');
  const [toLead, setToLead] = useState('10');
  const [toCustomer, setToCustomer] = useState('20');
  const [value, setValue] = useState('500');

  const simple = useMemo(() => costPerLead(parseNumber(spend), parseNumber(leads)), [spend, leads]);
  const funnel = useMemo(() => {
    const vals = [cpc, toLead, toCustomer, value].map(parseNumber);
    if (!vals.every(Number.isFinite)) return null;
    return adFunnel({ costPerClick: vals[0]!, clickToLeadPct: vals[1]!, leadToCustomerPct: vals[2]!, customerValue: vals[3]! });
  }, [cpc, toLead, toCustomer, value]);

  return (
    <CalculatorShell
      inputs={
        <>
          <SelectField label="Calculate from" value={mode} onChange={setMode} options={[{ value: 'simple', label: 'Total spend and leads' }, { value: 'funnel', label: 'Cost per click and conversion rates' }]} />
          {mode === 'simple' ? (
            <>
              <NumberField label="Total marketing spend" prefix="$" value={spend} onChange={setSpend} min="0" />
              <NumberField label="Leads generated" value={leads} onChange={setLeads} min="0" step="1" />
            </>
          ) : (
            <>
              <NumberField label="Cost per click" prefix="$" value={cpc} onChange={setCpc} min="0" />
              <NumberField label="Clicks that become leads" suffix="%" value={toLead} onChange={setToLead} min="0" max="100" />
              <NumberField label="Leads that become customers" suffix="%" value={toCustomer} onChange={setToCustomer} min="0" max="100" />
              <NumberField label="Customer lifetime value" prefix="$" value={value} onChange={setValue} min="0" />
            </>
          )}
        </>
      }
      results={
        mode === 'simple' ? (
          Number.isFinite(simple) ? <Results items={[{ label: 'Cost per lead', value: formatCurrency(simple), primary: true }]} /> : <EmptyResults message="Enter spend and a number of leads above zero." />
        ) : funnel ? (
          <Results
            items={[
              { label: 'Cost per lead', value: formatCurrency(funnel.costPerLead), primary: true },
              { label: 'Cost per customer', value: formatCurrency(funnel.costPerCustomer) },
              { label: 'Revenue per click', value: formatCurrency(funnel.valuePerClick) },
              { label: 'Profit per click', value: formatCurrency(funnel.profitPerClick) },
              { label: 'Break-even cost per click', value: formatCurrency(funnel.breakEvenCpc) },
              { label: 'Return on ad spend', value: formatPercent(funnel.roiPct, 0) },
            ]}
            note={<p>{funnel.profitPerClick >= 0 ? 'This campaign is profitable at the current cost per click.' : 'This campaign loses money: lower your cost per click or improve conversion rates.'}</p>}
          />
        ) : (
          <EmptyResults />
        )
      }
    />
  );
}
