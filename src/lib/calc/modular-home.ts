import { monthlyPayment } from './loan';

export const MODULAR_COST_ITEMS = [
  { key: 'land', label: 'Land', group: 'site' },
  { key: 'landPrep', label: 'Land preparation', group: 'site' },
  { key: 'transport', label: 'Transportation', group: 'site' },
  { key: 'permits', label: 'Building permits', group: 'site' },
  { key: 'water', label: 'Water line or well', group: 'utilities' },
  { key: 'septic', label: 'Septic or sewer', group: 'utilities' },
  { key: 'electrical', label: 'Electrical hookup', group: 'utilities' },
  { key: 'foundation', label: 'Foundation', group: 'structure' },
  { key: 'modules', label: 'Home modules', group: 'structure' },
  { key: 'setup', label: 'Setup and finishing', group: 'structure' },
  { key: 'driveway', label: 'Driveway and landscaping', group: 'extras' },
  { key: 'custom', label: 'Custom features', group: 'extras' },
] as const;

export type ModularCostKey = (typeof MODULAR_COST_ITEMS)[number]['key'];
export type ModularGroup = (typeof MODULAR_COST_ITEMS)[number]['group'];

export interface ModularHomeResult {
  total: number;
  byGroup: Record<ModularGroup, number>;
  /** Total cost excluding land, per square foot. */
  costPerSqFtExLand: number;
  /** Site, utility, and extras spending as a percent of structure cost. */
  siteToStructurePct: number;
  loanAmount: number;
  monthlyPayment: number;
  cashNeeded: number;
}

export function modularHomeCost(
  costs: Partial<Record<ModularCostKey, number>>,
  sqFt: number,
  loan: { downPayment: number; ratePct: number; years: number },
): ModularHomeResult {
  const byGroup: Record<ModularGroup, number> = { site: 0, utilities: 0, structure: 0, extras: 0 };
  for (const item of MODULAR_COST_ITEMS) byGroup[item.group] += costs[item.key] ?? 0;
  const total = byGroup.site + byGroup.utilities + byGroup.structure + byGroup.extras;
  const land = costs.land ?? 0;
  const loanAmount = Math.max(0, total - loan.downPayment);
  return {
    total,
    byGroup,
    costPerSqFtExLand: sqFt > 0 ? (total - land) / sqFt : NaN,
    siteToStructurePct: byGroup.structure > 0 ? ((total - land - byGroup.structure) / byGroup.structure) * 100 : NaN,
    loanAmount,
    monthlyPayment: loanAmount > 0 ? monthlyPayment(loanAmount, loan.ratePct, loan.years * 12) : 0,
    cashNeeded: Math.min(total, loan.downPayment),
  };
}
