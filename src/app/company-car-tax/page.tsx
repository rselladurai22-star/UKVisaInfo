import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import CompanyCarClient from './CompanyCarClient';

export const metadata: Metadata = {
  title: 'Company Car Tax Calculator 2025/26 — BiK Rates, P11D & Class 1A NI',
  description: 'UK company car BiK calculator 2025/26. See taxable benefit-in-kind, Income Tax by band, Class 1A employer NI, fuel benefit, and how EVs compare to petrol or diesel.',
  alternates: { canonical: '/company-car-tax' },
};

export default function CompanyCarPage() {
  return (
    <CalcPageShell
      url="/company-car-tax"
      eyebrow="Company Car BiK · UK · 2025/26"
      title="How much tax is your company car actually costing you?"
      deck="The benefit-in-kind charge is calculated on list price × BiK percentage. EVs start at 3%, PHEVs vary by electric range, petrol/diesel reaches 37%. Add Class 1A NI and fuel benefit and the true cost often surprises people."
      verified="gov.uk/expenses-and-benefits-company-cars"
      sidebar={{
        keyRates: [
          { label: 'EV BiK rate', value: '3%', sub: '2025/26 · rises 1% pa to 2028', accent: '#0F766E' },
          { label: 'Petrol/diesel max', value: '37%', sub: '170+ g/km CO₂' },
          { label: 'RDE2-fail diesel surcharge', value: '+4%', sub: 'Caps at 37%' },
          { label: 'Class 1A employer NI', value: '15%', sub: 'On the taxable BiK value' },
          { label: 'Fuel benefit multiplier', value: '£28,200', sub: '2025/26 · × BiK %' },
          { label: 'PHEV range bonus (>130mi)', value: '−14%', sub: 'vs PHEV <10mi electric' },
        ],
        dates: [
          { date: '6 Jul', desc: 'P11D(b) deadline — employer pays Class 1A NI', urgent: true },
          { date: '19 Jul', desc: 'Class 1A NI payment deadline (22 Jul online)', urgent: false },
          { date: '5 Apr', desc: 'End of tax year — register any new car benefits', urgent: false },
        ],
        tips: [
          { heading: 'EVs are the clear winner', body: 'A £50,000 EV BiK = £1,500. A £50,000 petrol car (150 g/km) BiK = £16,000. At 40% tax the annual difference is £5,800 — plus employer saves Class 1A NI.' },
          { heading: 'Capital contribution reduces P11D', body: 'Up to £5,000 of your own money contributed toward the car\'s purchase reduces the list price used to calculate BiK.' },
          { heading: 'Avoid private fuel benefit', body: 'The fuel benefit charge is nearly always more expensive than reimbursing HMRC\'s advisory fuel rates. Only keep it if you drive 20,000+ private miles.' },
        ],
        govLink: 'gov.uk/expenses-and-benefits-company-cars',
        govLabel: 'gov.uk — Company car BiK',
      }}
      related={[
        { href: '/take-home-pay', title: 'Take-home pay', desc: 'See how the BiK adds to your tax code.' },
        { href: '/mileage-expense-calculator', title: 'Mileage expenses', desc: 'Private car vs company car cost comparison.' },
        { href: '/salary-sacrifice-calculator', title: 'Salary sacrifice', desc: 'Electric car via salary sacrifice beats this.' },
      ]}
      educational={[
        { title: 'How BiK is calculated', body: 'List price (including options, excl. first-reg fee) × BiK percentage for your CO₂ band = Taxable benefit-in-kind. Multiply by your Income Tax rate to find your personal charge. Multiply the same by 15% to find the employer\'s Class 1A NI.' },
        { title: 'CO₂ bands and percentages', body: 'EVs: 3% (2025/26). PHEVs: 2–14% depending on electric range. Petrol/diesel: starts at 16% for cars below 50 g/km and rises 1% per 5 g/km band, capping at 37% for 170 g/km+.' },
        { title: 'Diesel surcharge', body: 'Diesel cars that do not meet the RDE2 (real-world driving emissions) standard attract a 4% surcharge on top of their CO₂-based percentage, capped at 37%.' },
        { title: 'Fuel benefit', body: 'If your employer provides free fuel for private use, the fuel benefit is calculated on £28,200 (2025/26) × the same BiK percentage as the car. This is almost always more expensive than buying fuel yourself.' },
        { title: 'P11D submission', body: 'Your employer must file a P11D form reporting your company car benefit by 6 July after each tax year. HMRC then adjusts your tax code to collect the Income Tax via PAYE — no separate payment needed from you in most cases.' },
      ]}
    >
      <CompanyCarClient />
    </CalcPageShell>
  );
}
