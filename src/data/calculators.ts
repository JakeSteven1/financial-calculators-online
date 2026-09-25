// Single source of truth for hub membership. Hub pages list their calculators
// from here, and each calculator page links back to its hub from here.
// Hub assignments mirror the links on the original WordPress hub pages.

export type HubSlug =
  | 'free-business-calculators'
  | 'financial-calculators-online'
  | 'personal-financial-calculators'
  | 'home-calculators-online'
  | 'free-online-statistics-calculators';

export interface Hub {
  slug: HubSlug;
  name: string;
  navLabel: string;
  /** One-line summary for the homepage. */
  blurb: string;
}

// Order and labels are the site's main navigation.
export const HUBS: Hub[] = [
  { slug: 'financial-calculators-online', name: 'Financial Calculators', navLabel: 'Financial', blurb: 'Interest, loans, investments, retirement, and financial ratios.' },
  { slug: 'free-business-calculators', name: 'Business Calculators', navLabel: 'Business', blurb: 'Pricing, margins, break-even, and marketing metrics.' },
  { slug: 'free-online-statistics-calculators', name: 'Statistics Calculators', navLabel: 'Statistics', blurb: 'Descriptive statistics, sample size, and fair random draws.' },
  { slug: 'home-calculators-online', name: 'Real Estate Calculators', navLabel: 'Homes', blurb: 'Mortgages, refinancing, affordability, equity, and home costs.' },
  { slug: 'personal-financial-calculators', name: 'Personal Finance Calculators', navLabel: 'Personal Finance', blurb: 'Budgeting, pay, everyday loans, and retirement planning.' },
];

export interface CalculatorEntry {
  slug: string;
  name: string;
  hub: HubSlug;
  /** One-line summary used on hub pages. */
  blurb: string;
  category: 'FinanceApplication' | 'BusinessApplication' | 'UtilitiesApplication' | 'EducationalApplication';
}

export const CALCULATORS: CalculatorEntry[] = [
  // Financial
  { slug: 'compound-interest-calculator-online', name: 'Compound Interest Calculator', hub: 'financial-calculators-online', blurb: 'See how savings grow when interest earns interest.', category: 'FinanceApplication' },
  { slug: 'tvm-calculator-online', name: 'TVM Calculator', hub: 'financial-calculators-online', blurb: 'Solve for PV, FV, payment, rate, or periods.', category: 'FinanceApplication' },
  { slug: 'online-calculator-for-interest-plus-principal', name: 'Interest Plus Principal Calculator', hub: 'financial-calculators-online', blurb: 'Total repaid on a simple-interest loan.', category: 'FinanceApplication' },
  { slug: 'liquidity-ratio-calculator-online', name: 'Liquidity Ratio Calculator', hub: 'financial-calculators-online', blurb: 'Current, quick, and cash ratios in one place.', category: 'BusinessApplication' },
  { slug: 'current-ratio-calculator', name: 'Current Ratio Calculator', hub: 'financial-calculators-online', blurb: 'Current assets divided by current liabilities.', category: 'BusinessApplication' },
  { slug: 'quick-ratio-calculator-finance', name: 'Quick Ratio Calculator', hub: 'financial-calculators-online', blurb: 'Acid-test ratio excluding inventory.', category: 'BusinessApplication' },
  { slug: 'effective-annual-interest-rate-calculator-online', name: 'Effective Annual Rate Calculator', hub: 'financial-calculators-online', blurb: 'Convert a nominal rate to its effective annual rate.', category: 'FinanceApplication' },
  { slug: 'car-loan-calculator', name: 'Car Loan Calculator', hub: 'financial-calculators-online', blurb: 'Monthly car payment with down payment and trade-in.', category: 'FinanceApplication' },
  { slug: 'simple-loan-calculator', name: 'Simple Loan Calculator', hub: 'financial-calculators-online', blurb: 'Monthly payment and total interest on a loan.', category: 'FinanceApplication' },
  { slug: 'free-online-retirement-calculator', name: 'Free Retirement Calculator', hub: 'financial-calculators-online', blurb: 'Project your retirement savings balance.', category: 'FinanceApplication' },
  { slug: 'life-insurance-coverage-estimator', name: 'Life Insurance Coverage Estimator', hub: 'financial-calculators-online', blurb: 'Estimate how much life insurance you need.', category: 'FinanceApplication' },
  { slug: 'stock-price-revenue-sale', name: 'Stock Sale Profit Calculator', hub: 'financial-calculators-online', blurb: 'Profit or loss on a stock sale.', category: 'FinanceApplication' },
  { slug: 'our-free-financial-calculator', name: 'Free Financial Calculator', hub: 'financial-calculators-online', blurb: 'An all-in-one calculator for everyday finance math.', category: 'FinanceApplication' },

  // Personal
  { slug: 'life-seconds-calculator', name: 'Life Seconds Calculator', hub: 'personal-financial-calculators', blurb: 'How many seconds, minutes, and days you have lived.', category: 'UtilitiesApplication' },
  { slug: 'life-clock-calculator', name: 'Life Clock Calculator', hub: 'personal-financial-calculators', blurb: 'What time it is on the 24-hour clock of your life.', category: 'UtilitiesApplication' },
  { slug: 'rule-of-72-calculator', name: 'Rule of 72 Calculator', hub: 'personal-financial-calculators', blurb: 'How long it takes money to double.', category: 'FinanceApplication' },
  { slug: 'fair-fantasy-trade-value-draft-picks', name: 'Fantasy Draft Pick Trade Value Calculator', hub: 'personal-financial-calculators', blurb: 'Compare draft-pick trades using the NFL value chart.', category: 'UtilitiesApplication' },
  { slug: 'monthly-loan-calculator', name: 'Monthly Loan Calculator', hub: 'personal-financial-calculators', blurb: 'Monthly payment for any fixed-rate loan.', category: 'FinanceApplication' },
  { slug: 'lifetime-wealth-ratio-calculator', name: 'Lifetime Wealth Ratio Calculator', hub: 'personal-financial-calculators', blurb: 'Net worth compared to lifetime earnings.', category: 'FinanceApplication' },
  { slug: 'hourly-wage-yearly-salary-calculator', name: 'Hourly Wage to Salary Calculator', hub: 'personal-financial-calculators', blurb: 'Convert an hourly wage to a yearly salary.', category: 'FinanceApplication' },
  { slug: 'convert-salary-to-daily-wage', name: 'Salary to Daily Wage Calculator', hub: 'personal-financial-calculators', blurb: 'What you earn per workday.', category: 'FinanceApplication' },
  { slug: 'ai-word-count-calculator', name: 'AI Conversation Length Calculator', hub: 'personal-financial-calculators', blurb: 'Estimate tokens and whether a chat fits the context window.', category: 'UtilitiesApplication' },
  { slug: 'tile-floor-cost-calculator', name: 'Tile Floor Cost Calculator', hub: 'personal-financial-calculators', blurb: 'Tiles needed and total cost for a floor.', category: 'UtilitiesApplication' },
  { slug: 'online-tip-calculator', name: 'Tip Calculator', hub: 'personal-financial-calculators', blurb: 'Tip and per-person split for any bill.', category: 'UtilitiesApplication' },
  { slug: '50-30-20-budget-calculator', name: '50/30/20 Budget Calculator', hub: 'personal-financial-calculators', blurb: 'Split take-home pay into needs, wants, and savings.', category: 'FinanceApplication' },
  { slug: 'retirement-calculator-online', name: 'Retirement Calculator', hub: 'personal-financial-calculators', blurb: 'Will your savings last through retirement?', category: 'FinanceApplication' },

  // Home
  { slug: 'modular-home-cost-calculator', name: 'Modular Home Cost Calculator', hub: 'home-calculators-online', blurb: 'Estimate the all-in cost of a modular home.', category: 'FinanceApplication' },
  { slug: 'mortgage-loan-calculator-online', name: 'Mortgage Loan Calculator', hub: 'home-calculators-online', blurb: 'Monthly mortgage payment with taxes and insurance.', category: 'FinanceApplication' },
  { slug: 'refinance-calculator-online-free', name: 'Refinance Calculator', hub: 'home-calculators-online', blurb: 'Compare your current loan with a refinance.', category: 'FinanceApplication' },
  { slug: 'mortgage-points-calculator-online', name: 'Mortgage Points Calculator', hub: 'home-calculators-online', blurb: 'Is buying down the rate worth it?', category: 'FinanceApplication' },
  { slug: 'mortgage-length-calculator-online', name: 'Mortgage Length Calculator', hub: 'home-calculators-online', blurb: 'How long until your mortgage is paid off.', category: 'FinanceApplication' },
  { slug: 'rent-or-buy-calculator-online-free', name: 'Rent vs Buy Calculator', hub: 'home-calculators-online', blurb: 'Compare the total cost of renting and buying.', category: 'FinanceApplication' },
  { slug: 'home-selling-price-calculator', name: 'Home Selling Price Calculator', hub: 'home-calculators-online', blurb: 'Net proceeds after selling costs and payoff.', category: 'FinanceApplication' },
  { slug: 'home-renovation-roi-calculator', name: 'Home Renovation ROI Calculator', hub: 'home-calculators-online', blurb: 'Return on a remodel or upgrade.', category: 'FinanceApplication' },
  { slug: 'home-affordability-calculator', name: 'Home Affordability Calculator', hub: 'home-calculators-online', blurb: 'How much house your income supports.', category: 'FinanceApplication' },
  { slug: 'closing-costs-calculator', name: 'Closing Costs Calculator', hub: 'home-calculators-online', blurb: 'Estimate closing costs and cash to close.', category: 'FinanceApplication' },
  { slug: 'home-equity-calculator-online', name: 'Home Equity Calculator', hub: 'home-calculators-online', blurb: 'Equity, LTV, and how much you could borrow.', category: 'FinanceApplication' },
  { slug: 'mortgage-refinance-break-even-point-calculator-online-free', name: 'Refinance Break-Even Calculator', hub: 'home-calculators-online', blurb: 'Months until a refinance pays for itself.', category: 'FinanceApplication' },
  { slug: 'amoritization-schedule-online', name: 'Amortization Schedule Calculator', hub: 'home-calculators-online', blurb: 'Full payment-by-payment amortization table.', category: 'FinanceApplication' },
  { slug: 'mortgage-rate-comparison-calculator', name: 'Mortgage Rate Comparison Calculator', hub: 'home-calculators-online', blurb: 'Compare two mortgage offers side by side.', category: 'FinanceApplication' },

  // Business
  { slug: 'sales-calculator-online', name: 'Sales Calculator', hub: 'free-business-calculators', blurb: 'Sale price, discount, and sales tax.', category: 'BusinessApplication' },
  { slug: 'customer-lifetime-value-calculator-online', name: 'Customer Lifetime Value Calculator', hub: 'free-business-calculators', blurb: 'What a customer is worth over the relationship.', category: 'BusinessApplication' },
  { slug: 'break-even-point-calculator', name: 'Break-Even Point Calculator', hub: 'free-business-calculators', blurb: 'Units and revenue needed to cover costs.', category: 'BusinessApplication' },
  { slug: 'gross-margin-calculator-online', name: 'Gross Margin Calculator', hub: 'free-business-calculators', blurb: 'Gross profit and gross margin percentage.', category: 'BusinessApplication' },
  { slug: 'profit-margin-calculator', name: 'Profit Margin Calculator', hub: 'free-business-calculators', blurb: 'Margin, markup, and profit from cost and price.', category: 'BusinessApplication' },
  { slug: 'ideal-email-subject-length', name: 'Email Subject Length Tool', hub: 'free-business-calculators', blurb: 'Check a subject line against inbox limits.', category: 'BusinessApplication' },
  { slug: 'cost-per-lead-calculator', name: 'Cost Per Lead Calculator', hub: 'free-business-calculators', blurb: 'Marketing spend divided by leads generated.', category: 'BusinessApplication' },
  { slug: 'return-on-investment-calculator', name: 'ROI Calculator', hub: 'free-business-calculators', blurb: 'Return on investment, total and annualized.', category: 'FinanceApplication' },
  { slug: 'customer-acquisition-cost', name: 'Customer Acquisition Cost Calculator', hub: 'free-business-calculators', blurb: 'What it costs to win one new customer.', category: 'BusinessApplication' },
  { slug: 'character-count-tool-free', name: 'Character Count Tool', hub: 'free-business-calculators', blurb: 'Count characters, words, and sentences.', category: 'UtilitiesApplication' },

  // Statistics
  { slug: 'randomly-select-contest-winner-from-list-of-emails', name: 'Random Contest Winner Picker', hub: 'free-online-statistics-calculators', blurb: 'Pick fair winners and alternates from a list of emails.', category: 'UtilitiesApplication' },
  { slug: 'randomly-select-emails-for-giveaways', name: 'Random Email Selector for Giveaways', hub: 'free-online-statistics-calculators', blurb: 'Instagram and social giveaway winners, with bonus entries.', category: 'UtilitiesApplication' },
  { slug: 'random-number-generator-online-free', name: 'Random Number Generator', hub: 'free-online-statistics-calculators', blurb: 'Random numbers in any range, with or without repeats.', category: 'UtilitiesApplication' },
  { slug: 'quartile-calculator-online-free', name: 'Quartile Calculator', hub: 'free-online-statistics-calculators', blurb: 'Q1, median, Q3, and interquartile range.', category: 'EducationalApplication' },
  { slug: 'online-median-calculator', name: 'Median Calculator', hub: 'free-online-statistics-calculators', blurb: 'The middle value of a data set.', category: 'EducationalApplication' },
  { slug: 'mean-online-calculator', name: 'Mean Calculator', hub: 'free-online-statistics-calculators', blurb: 'The arithmetic average of a data set.', category: 'EducationalApplication' },
  { slug: 'mode-calculator-online', name: 'Mode Calculator', hub: 'free-online-statistics-calculators', blurb: 'The most frequent value(s) in a data set.', category: 'EducationalApplication' },
  { slug: 'standard-deviation-calculator-online-free', name: 'Standard Deviation Calculator', hub: 'free-online-statistics-calculators', blurb: 'Population and sample standard deviation.', category: 'EducationalApplication' },
  { slug: 'representative-sample-calculator', name: 'Sample Size Calculator', hub: 'free-online-statistics-calculators', blurb: 'Sample size for a confidence level and margin of error.', category: 'EducationalApplication' },
];

export function getCalculator(slug: string): CalculatorEntry {
  const entry = CALCULATORS.find((c) => c.slug === slug);
  if (!entry) throw new Error(`No calculator registered for slug "${slug}"`);
  return entry;
}

export function getHub(slug: HubSlug): Hub {
  const hub = HUBS.find((h) => h.slug === slug);
  if (!hub) throw new Error(`Unknown hub "${slug}"`);
  return hub;
}

/** The hub a page belongs to: the hub itself, or the hub of a calculator. */
export function hubForPath(pathname: string): HubSlug | undefined {
  const slug = pathname.replace(/^\/|\/$/g, '');
  return HUBS.find((h) => h.slug === slug)?.slug ?? CALCULATORS.find((c) => c.slug === slug)?.hub;
}
