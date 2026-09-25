// Images carried over from the WordPress media library, with alt text, and each
// page's WordPress featured image (used as its og:image). Pages whose featured
// image was the site logo, or that had none, fall back to the logo.
import type { ImageMetadata } from 'astro';
import breakEven from '../assets/images/break-even-point-calculator.webp';
import carLoan from '../assets/images/car-loan-calculator.png';
import currentRatio from '../assets/images/current-ratio-calculator.webp';
import emailSubject from '../assets/images/ideal-email-subject-length-tool.webp';
import fantasy from '../assets/images/fantasy-draft-pick-value.webp';
import homeAffordability from '../assets/images/home-affordability-calculator-free.webp';
import homeLoan from '../assets/images/home-loan-calculator.webp';
import homeRenovation from '../assets/images/home-renovation-calculator.webp';
import lifeClock from '../assets/images/life-clock-calculator.webp';
import lifeInsurance from '../assets/images/life-insurance-coverage-calculator.webp';
import mode from '../assets/images/mode-calculator.webp';
import mortgage from '../assets/images/mortgage-calculator.webp';
import onlineCalculator from '../assets/images/online-calculator.png';
import quickRatio from '../assets/images/quick-ratio-calculator.webp';
import randomNumberGenerator from '../assets/images/random-number-generator.png';
import randomNumbers from '../assets/images/random-numbers.png';
import representativeSample from '../assets/images/representative-sample.png';
import retirementFriends from '../assets/images/retirement-friends.webp';
import salesFunnel from '../assets/images/sales-funnel-calculator.png';
import tileFloor from '../assets/images/tile-floor.webp';

export interface SiteImage {
  src: ImageMetadata;
  alt: string;
}

const IMAGES = {
  breakEven: { src: breakEven, alt: 'Hand-drawn break-even analysis chart where the total revenue line crosses total costs' },
  carLoan: { src: carLoan, alt: 'Illustration of a blue car beside an insurance policy clipboard and a green shield with a checkmark' },
  currentRatio: { src: currentRatio, alt: 'Illustrated chart comparing current assets with current liabilities, with coins and a calculator' },
  emailSubject: { src: emailSubject, alt: 'Phone lock screen showing an email notification that asks how long an email subject line should be' },
  fantasy: { src: fantasy, alt: 'The words “Fantasy Football” set in metal letterpress type' },
  homeAffordability: { src: homeAffordability, alt: 'Modern two-story home with glass walls and a pool, lit up at dusk' },
  homeLoan: { src: homeLoan, alt: 'One person handing a small model house to another over a signed document' },
  homeRenovation: { src: homeRenovation, alt: 'Renovated kitchen with a rising bar chart and arrow drawn over it' },
  lifeClock: { src: lifeClock, alt: 'Clock face reading 11:55 over a misty mountain path' },
  lifeInsurance: { src: lifeInsurance, alt: 'Calculator on a desk in front of a framed family photo and a model house' },
  mode: { src: mode, alt: '3D ball-and-stick molecule model on a colorful background' },
  mortgage: { src: mortgage, alt: 'Mortgage paperwork with a pen, a calculator, and a model house' },
  onlineCalculator: { src: onlineCalculator, alt: 'Flat illustration of a calculator with number keys and colored operation keys' },
  quickRatio: { src: quickRatio, alt: 'Infographic explaining the quick ratio, or acid-test ratio, with icons for current assets and liabilities' },
  randomNumberGenerator: { src: randomNumberGenerator, alt: 'Two black dice surrounded by scattered random numbers' },
  randomNumbers: { src: randomNumbers, alt: 'Numbers in black circles mixed with plus, minus, times, and divide signs' },
  representativeSample: { src: representativeSample, alt: 'Icon of a magnifying glass selecting a small group from a crowd of people' },
  retirementFriends: { src: retirementFriends, alt: 'Four retired men sitting together on hay bales in a sunny field' },
  salesFunnel: { src: salesFunnel, alt: 'Sales funnel calculator line chart comparing monthly electronics and software sales' },
  tileFloor: { src: tileFloor, alt: 'Floor tile samples in dark stone, white, yellow, and wood-look finishes' },
} satisfies Record<string, SiteImage>;

const FEATURED: Record<string, keyof typeof IMAGES> = {
  // Hubs
  'financial-calculators-online': 'carLoan',
  'free-business-calculators': 'breakEven',
  'free-online-statistics-calculators': 'randomNumberGenerator',
  'home-calculators-online': 'homeLoan',
  // Calculators
  'free-online-retirement-calculator': 'retirementFriends',
  'quick-ratio-calculator-finance': 'quickRatio',
  'current-ratio-calculator': 'currentRatio',
  'liquidity-ratio-calculator-online': 'currentRatio',
  'life-insurance-coverage-estimator': 'lifeInsurance',
  'ideal-email-subject-length': 'emailSubject',
  'cost-per-lead-calculator': 'salesFunnel',
  'tile-floor-cost-calculator': 'tileFloor',
  'character-count-tool-free': 'onlineCalculator',
  'stock-price-revenue-sale': 'onlineCalculator',
  'quartile-calculator-online-free': 'onlineCalculator',
  'representative-sample-calculator': 'onlineCalculator',
  'online-median-calculator': 'onlineCalculator',
  'sales-calculator-online': 'onlineCalculator',
  'gross-margin-calculator-online': 'onlineCalculator',
  'fair-fantasy-trade-value-draft-picks': 'fantasy',
  'randomly-select-contest-winner-from-list-of-emails': 'randomNumbers',
  'random-number-generator-online-free': 'randomNumberGenerator',
  'retirement-calculator-online': 'homeLoan',
  'closing-costs-calculator': 'homeLoan',
  'mortgage-length-calculator-online': 'homeLoan',
  'home-equity-calculator-online': 'homeLoan',
  'refinance-calculator-online-free': 'homeLoan',
  'home-affordability-calculator': 'homeLoan',
  'home-renovation-roi-calculator': 'homeRenovation',
  'amoritization-schedule-online': 'mortgage',
  'home-selling-price-calculator': 'mortgage',
  'mode-calculator-online': 'mode',
  'modular-home-cost-calculator': 'homeAffordability',
  'life-clock-calculator': 'lifeClock',
};

/** The page's WordPress featured image, if it had one other than the logo. */
export function getFeaturedImage(slug: string): SiteImage | undefined {
  const key = FEATURED[slug];
  return key ? IMAGES[key] : undefined;
}
