// "Related calculators" shown at the bottom of each calculator page. Lists are
// ordered by relevance; getRelated() then puts same-hub calculators first.
import { getCalculator, type CalculatorEntry } from './calculators';

export const RELATED: Record<string, string[]> = {
  // Financial
  'compound-interest-calculator-online': ['tvm-calculator-online', 'effective-annual-interest-rate-calculator-online', 'free-online-retirement-calculator', 'rule-of-72-calculator', 'retirement-calculator-online'],
  'tvm-calculator-online': ['compound-interest-calculator-online', 'effective-annual-interest-rate-calculator-online', 'online-calculator-for-interest-plus-principal', 'rule-of-72-calculator', 'amoritization-schedule-online'],
  'online-calculator-for-interest-plus-principal': ['simple-loan-calculator', 'compound-interest-calculator-online', 'tvm-calculator-online', 'monthly-loan-calculator'],
  'liquidity-ratio-calculator-online': ['current-ratio-calculator', 'quick-ratio-calculator-finance', 'break-even-point-calculator', 'gross-margin-calculator-online'],
  'current-ratio-calculator': ['quick-ratio-calculator-finance', 'liquidity-ratio-calculator-online', 'break-even-point-calculator', 'profit-margin-calculator'],
  'quick-ratio-calculator-finance': ['current-ratio-calculator', 'liquidity-ratio-calculator-online', 'gross-margin-calculator-online', 'return-on-investment-calculator'],
  'effective-annual-interest-rate-calculator-online': ['compound-interest-calculator-online', 'tvm-calculator-online', 'online-calculator-for-interest-plus-principal', 'mortgage-rate-comparison-calculator', 'rule-of-72-calculator'],
  'car-loan-calculator': ['simple-loan-calculator', 'online-calculator-for-interest-plus-principal', 'monthly-loan-calculator', 'amoritization-schedule-online', '50-30-20-budget-calculator'],
  'simple-loan-calculator': ['car-loan-calculator', 'online-calculator-for-interest-plus-principal', 'our-free-financial-calculator', 'monthly-loan-calculator', 'amoritization-schedule-online'],
  'free-online-retirement-calculator': ['compound-interest-calculator-online', 'life-insurance-coverage-estimator', 'retirement-calculator-online', 'rule-of-72-calculator', 'lifetime-wealth-ratio-calculator'],
  'life-insurance-coverage-estimator': ['free-online-retirement-calculator', 'retirement-calculator-online', '50-30-20-budget-calculator', 'lifetime-wealth-ratio-calculator', 'mortgage-loan-calculator-online'],
  'stock-price-revenue-sale': ['compound-interest-calculator-online', 'effective-annual-interest-rate-calculator-online', 'return-on-investment-calculator', 'rule-of-72-calculator', 'profit-margin-calculator'],
  'our-free-financial-calculator': ['simple-loan-calculator', 'compound-interest-calculator-online', 'tvm-calculator-online', 'mortgage-loan-calculator-online', 'home-equity-calculator-online'],

  // Personal finance
  'life-seconds-calculator': ['life-clock-calculator', 'lifetime-wealth-ratio-calculator', 'retirement-calculator-online'],
  'life-clock-calculator': ['life-seconds-calculator', 'retirement-calculator-online', 'lifetime-wealth-ratio-calculator', 'life-insurance-coverage-estimator'],
  'rule-of-72-calculator': ['retirement-calculator-online', 'compound-interest-calculator-online', 'effective-annual-interest-rate-calculator-online', 'tvm-calculator-online'],
  'fair-fantasy-trade-value-draft-picks': ['random-number-generator-online-free', 'randomly-select-contest-winner-from-list-of-emails', 'mean-online-calculator'],
  'monthly-loan-calculator': ['50-30-20-budget-calculator', 'simple-loan-calculator', 'car-loan-calculator', 'amoritization-schedule-online', 'mortgage-loan-calculator-online'],
  'lifetime-wealth-ratio-calculator': ['retirement-calculator-online', 'hourly-wage-yearly-salary-calculator', '50-30-20-budget-calculator', 'compound-interest-calculator-online', 'free-online-retirement-calculator'],
  'hourly-wage-yearly-salary-calculator': ['convert-salary-to-daily-wage', '50-30-20-budget-calculator', 'online-tip-calculator', 'lifetime-wealth-ratio-calculator'],
  'convert-salary-to-daily-wage': ['hourly-wage-yearly-salary-calculator', '50-30-20-budget-calculator', 'lifetime-wealth-ratio-calculator'],
  'ai-word-count-calculator': ['character-count-tool-free', 'ideal-email-subject-length', 'life-seconds-calculator'],
  'tile-floor-cost-calculator': ['home-renovation-roi-calculator', 'modular-home-cost-calculator', '50-30-20-budget-calculator', 'home-equity-calculator-online'],
  'online-tip-calculator': ['hourly-wage-yearly-salary-calculator', '50-30-20-budget-calculator', 'sales-calculator-online'],
  '50-30-20-budget-calculator': ['hourly-wage-yearly-salary-calculator', 'convert-salary-to-daily-wage', 'monthly-loan-calculator', 'retirement-calculator-online', 'home-affordability-calculator'],
  'retirement-calculator-online': ['rule-of-72-calculator', 'lifetime-wealth-ratio-calculator', '50-30-20-budget-calculator', 'free-online-retirement-calculator', 'compound-interest-calculator-online'],

  // Home (real estate)
  'modular-home-cost-calculator': ['home-affordability-calculator', 'mortgage-loan-calculator-online', 'closing-costs-calculator', 'tile-floor-cost-calculator'],
  'mortgage-loan-calculator-online': ['home-affordability-calculator', 'closing-costs-calculator', 'amoritization-schedule-online', 'refinance-calculator-online-free', 'mortgage-rate-comparison-calculator'],
  'refinance-calculator-online-free': ['mortgage-refinance-break-even-point-calculator-online-free', 'mortgage-loan-calculator-online', 'closing-costs-calculator', 'mortgage-points-calculator-online', 'mortgage-rate-comparison-calculator'],
  'mortgage-points-calculator-online': ['mortgage-rate-comparison-calculator', 'mortgage-refinance-break-even-point-calculator-online-free', 'closing-costs-calculator', 'mortgage-loan-calculator-online'],
  'mortgage-length-calculator-online': ['amoritization-schedule-online', 'mortgage-loan-calculator-online', 'refinance-calculator-online-free', 'monthly-loan-calculator'],
  'rent-or-buy-calculator-online-free': ['home-affordability-calculator', 'mortgage-loan-calculator-online', 'closing-costs-calculator', 'home-selling-price-calculator'],
  'home-selling-price-calculator': ['home-equity-calculator-online', 'home-renovation-roi-calculator', 'rent-or-buy-calculator-online-free', 'closing-costs-calculator'],
  'home-renovation-roi-calculator': ['home-equity-calculator-online', 'home-selling-price-calculator', 'tile-floor-cost-calculator', 'return-on-investment-calculator'],
  'home-affordability-calculator': ['mortgage-loan-calculator-online', 'closing-costs-calculator', 'rent-or-buy-calculator-online-free', 'refinance-calculator-online-free', '50-30-20-budget-calculator'],
  'closing-costs-calculator': ['mortgage-loan-calculator-online', 'home-affordability-calculator', 'refinance-calculator-online-free', 'mortgage-points-calculator-online'],
  'home-equity-calculator-online': ['home-selling-price-calculator', 'refinance-calculator-online-free', 'home-renovation-roi-calculator', 'our-free-financial-calculator'],
  'mortgage-refinance-break-even-point-calculator-online-free': ['refinance-calculator-online-free', 'closing-costs-calculator', 'mortgage-points-calculator-online', 'mortgage-rate-comparison-calculator'],
  'amoritization-schedule-online': ['mortgage-loan-calculator-online', 'mortgage-length-calculator-online', 'refinance-calculator-online-free', 'simple-loan-calculator', 'monthly-loan-calculator'],
  'mortgage-rate-comparison-calculator': ['mortgage-points-calculator-online', 'mortgage-loan-calculator-online', 'refinance-calculator-online-free', 'effective-annual-interest-rate-calculator-online'],

  // Business
  'sales-calculator-online': ['profit-margin-calculator', 'gross-margin-calculator-online', 'break-even-point-calculator', 'online-tip-calculator'],
  'customer-lifetime-value-calculator-online': ['customer-acquisition-cost', 'cost-per-lead-calculator', 'return-on-investment-calculator', 'profit-margin-calculator'],
  'break-even-point-calculator': ['profit-margin-calculator', 'gross-margin-calculator-online', 'sales-calculator-online', 'current-ratio-calculator'],
  'gross-margin-calculator-online': ['profit-margin-calculator', 'sales-calculator-online', 'break-even-point-calculator', 'quick-ratio-calculator-finance'],
  'profit-margin-calculator': ['gross-margin-calculator-online', 'sales-calculator-online', 'break-even-point-calculator', 'return-on-investment-calculator'],
  'ideal-email-subject-length': ['character-count-tool-free', 'cost-per-lead-calculator', 'ai-word-count-calculator'],
  'cost-per-lead-calculator': ['customer-acquisition-cost', 'customer-lifetime-value-calculator-online', 'return-on-investment-calculator', 'ideal-email-subject-length'],
  'return-on-investment-calculator': ['profit-margin-calculator', 'customer-lifetime-value-calculator-online', 'stock-price-revenue-sale', 'home-renovation-roi-calculator', 'compound-interest-calculator-online'],
  'customer-acquisition-cost': ['customer-lifetime-value-calculator-online', 'cost-per-lead-calculator', 'return-on-investment-calculator', 'break-even-point-calculator'],
  'character-count-tool-free': ['ideal-email-subject-length', 'ai-word-count-calculator', 'cost-per-lead-calculator'],

  // Statistics
  'randomly-select-contest-winner-from-list-of-emails': ['randomly-select-emails-for-giveaways', 'random-number-generator-online-free', 'representative-sample-calculator'],
  'randomly-select-emails-for-giveaways': ['randomly-select-contest-winner-from-list-of-emails', 'random-number-generator-online-free', 'representative-sample-calculator'],
  'random-number-generator-online-free': ['randomly-select-contest-winner-from-list-of-emails', 'randomly-select-emails-for-giveaways', 'representative-sample-calculator', 'fair-fantasy-trade-value-draft-picks'],
  'quartile-calculator-online-free': ['online-median-calculator', 'standard-deviation-calculator-online-free', 'mean-online-calculator', 'mode-calculator-online'],
  'online-median-calculator': ['mean-online-calculator', 'mode-calculator-online', 'quartile-calculator-online-free', 'standard-deviation-calculator-online-free'],
  'mean-online-calculator': ['online-median-calculator', 'mode-calculator-online', 'standard-deviation-calculator-online-free', 'quartile-calculator-online-free'],
  'mode-calculator-online': ['mean-online-calculator', 'online-median-calculator', 'quartile-calculator-online-free', 'standard-deviation-calculator-online-free'],
  'standard-deviation-calculator-online-free': ['mean-online-calculator', 'quartile-calculator-online-free', 'online-median-calculator', 'representative-sample-calculator'],
  'representative-sample-calculator': ['standard-deviation-calculator-online-free', 'mean-online-calculator', 'random-number-generator-online-free', 'randomly-select-contest-winner-from-list-of-emails'],
};

/** Related calculators for a page: same hub first, then cross-hub, each group in relevance order. */
export function getRelated(slug: string): CalculatorEntry[] {
  const hub = getCalculator(slug).hub;
  const entries = (RELATED[slug] ?? []).map(getCalculator);
  return [...entries.filter((c) => c.hub === hub), ...entries.filter((c) => c.hub !== hub)];
}
