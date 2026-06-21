import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import CouncilTaxClient from './CouncilTaxClient';

export const metadata: Metadata = {
  title: 'UK Council Tax Band Calculator 2026, All Bands by Postcode',
  description: 'Enter any UK postcode to see your council and estimated Council Tax bill for every band (A-H). Uses regional averages, override with your own Band D figure for accuracy.',
  alternates: { canonical: '/council-tax-band' },
};

export default function CouncilTaxPage() {
  return (
    <CalcPageShell
      url="/council-tax-band"
      eyebrow="Council Tax · UK 2026"
      title="Council Tax by band, for any UK postcode."
      deck="Enter your postcode to see the council, regional Band D average, and the calculated annual / monthly / weekly bill for every band."
      verified="gov.uk Council Tax statistics"
      related={[
        { href: '/postcode',             title: 'Full postcode dashboard', desc: 'Council, MP, NHS, police force and more.' },
        { href: '/mortgage-affordability', title: 'Mortgage affordability',  desc: 'Budget your move before you commit.' },
        { href: '/stamp-duty-calculator', title: 'Stamp Duty calculator',   desc: 'What you\'ll pay on completion.' },
      ]}
      educational={[
        { title: 'How bands work', body: 'England and Scotland use eight bands (A-H) based on the property\'s value at a specific reference date. Wales uses nine bands (A-I) with a 2003 reference date.' },
        { title: 'Band ratios', body: 'All bands are fixed multiples of Band D, A=6/9, B=7/9, C=8/9, D=9/9, E=11/9, F=13/9, G=15/9, H=18/9. So Band A pays 67% of Band D, Band H pays 200%.' },
        { title: 'Band D is the anchor', body: 'Councils set the Band D rate annually. All other bands are derived from it. Our default uses the 2025-26 regional averages from gov.uk, but check your actual council\'s figure for accuracy.' },
        { title: 'Northern Ireland', body: 'NI uses Domestic Rates instead of Council Tax, they\'re calculated on capital value, not banded. Check nidirect.gov.uk for your bill.' },
        { title: 'Discounts and exemptions', body: 'Single occupants get 25% off. Students, severely mentally impaired, diplomats and a few other categories may pay nothing. Empty properties may attract a 100% surcharge after 1-2 years.' },
        { title: 'Can you challenge your band?', body: 'Yes, via the Valuation Office Agency (England + Wales) or the Scottish Assessors\' Association. If your home is over-valued relative to neighbours, a challenge can reduce your bill, but it can also INCREASE bands of nearby homes.' },
      ]}
    >
      <CouncilTaxClient />
    </CalcPageShell>
  );
}
