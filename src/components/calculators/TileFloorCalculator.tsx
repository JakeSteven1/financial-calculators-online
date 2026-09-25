import { useMemo, useState } from 'react';
import { TILE_MATERIALS, tileFloorCost } from '../../lib/calc/tile-floor';
import { formatCurrency, parseNumber } from '../../lib/format';
import { CalculatorShell, EmptyResults, NumberField, Results, SelectField } from '../ui/fields';

export default function TileFloorCalculator() {
  const [length, setLength] = useState('12');
  const [width, setWidth] = useState('10');
  const [material, setMaterial] = useState('ceramic');
  const [waste, setWaste] = useState('10');
  const [labor, setLabor] = useState('7');
  const [opts, setOpts] = useState({ labor: true, supplies: true, equipment: false, removal: false, disposal: false });
  const toggle = (k: keyof typeof opts) => setOpts((o) => ({ ...o, [k]: !o[k] }));

  const r = useMemo(() => {
    const price = TILE_MATERIALS.find((m) => m.key === material)!.pricePerSqFt;
    return tileFloorCost({
      areaSqFt: (parseNumber(length) || 0) * (parseNumber(width) || 0),
      materialPricePerSqFt: price,
      wastePct: parseNumber(waste) || 0,
      laborPerSqFt: opts.labor ? parseNumber(labor) || 0 : 0,
      supplies: opts.supplies, equipment: opts.equipment, removal: opts.removal, disposal: opts.disposal,
    });
  }, [length, width, material, waste, labor, opts]);

  const checkbox = (k: keyof typeof opts, label: string) => (
    <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={opts[k]} onChange={() => toggle(k)} />{label}</label>
  );

  return (
    <CalculatorShell
      inputs={
        <>
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="Room length" suffix="ft" value={length} onChange={setLength} min="0" />
            <NumberField label="Room width" suffix="ft" value={width} onChange={setWidth} min="0" />
          </div>
          <SelectField label="Tile material" value={material} onChange={setMaterial} options={TILE_MATERIALS.map((m) => ({ value: m.key, label: `${m.label} ($${m.pricePerSqFt}/sq ft)` }))} />
          <NumberField label="Waste allowance" suffix="%" value={waste} onChange={setWaste} min="0" hint="10% for straight layouts, 15% for diagonal or patterned." />
          {checkbox('labor', 'Include professional installation')}
          {opts.labor && <NumberField label="Labor cost per sq ft" prefix="$" value={labor} onChange={setLabor} min="0" />}
          {checkbox('supplies', 'Installation supplies (thinset, grout, spacers)')}
          {checkbox('equipment', 'Equipment rental (tile saw, etc.)')}
          {checkbox('removal', 'Remove existing flooring')}
          {checkbox('disposal', 'Debris disposal')}
        </>
      }
      results={
        r ? (
          <div>
            <Results items={[{ label: 'Estimated total cost', value: formatCurrency(r.total, { whole: true }), primary: true }, { label: 'Cost per square foot', value: formatCurrency(r.perSqFt) }]} />
            <ul className="mt-4 space-y-1 border-t border-brand-100 pt-3 text-sm">
              {r.lines.map((l) => <li key={l.label} className="flex justify-between gap-3"><span className="text-gray-600">{l.label}</span><span className="tabular-nums">{formatCurrency(l.amount, { whole: true })}</span></li>)}
            </ul>
          </div>
        ) : (
          <EmptyResults message="Enter the room's length and width." />
        )
      }
    />
  );
}
