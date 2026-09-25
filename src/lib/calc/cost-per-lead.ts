/** Cost per lead = marketing spend ÷ leads. */
export function costPerLead(spend: number, leads: number): number {
  return leads > 0 ? spend / leads : NaN;
}

export interface FunnelInput {
  costPerClick: number;
  /** Percent of clicks that become leads. */
  clickToLeadPct: number;
  /** Percent of leads that become customers. */
  leadToCustomerPct: number;
  customerValue: number;
}

export interface FunnelResult {
  costPerLead: number;
  costPerCustomer: number;
  /** Expected revenue from one click. */
  valuePerClick: number;
  profitPerClick: number;
  /** Highest CPC that still breaks even. */
  breakEvenCpc: number;
  /** Return on ad spend as a percent. */
  roiPct: number;
}

export function adFunnel({ costPerClick, clickToLeadPct, leadToCustomerPct, customerValue }: FunnelInput): FunnelResult {
  const l = clickToLeadPct / 100;
  const c = leadToCustomerPct / 100;
  const valuePerClick = l * c * customerValue;
  return {
    costPerLead: l > 0 ? costPerClick / l : NaN,
    costPerCustomer: l * c > 0 ? costPerClick / (l * c) : NaN,
    valuePerClick,
    profitPerClick: valuePerClick - costPerClick,
    breakEvenCpc: valuePerClick,
    roiPct: costPerClick > 0 ? ((valuePerClick - costPerClick) / costPerClick) * 100 : NaN,
  };
}
