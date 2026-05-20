import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import UlezClient from './UlezClient';

export const metadata: Metadata = {
  title: 'UK ULEZ & Clean Air Zone Checker — Is Your Car Compliant?',
  description: 'Check if your car or van is ULEZ-compliant or charged in UK Clean Air Zones. Covers London ULEZ, Birmingham, Bristol, Sheffield, Tyneside, Bath, Bradford, Portsmouth and Scottish LEZs.',
  alternates: { canonical: '/ulez-check' },
};

export default function UlezPage() {
  return (
    <CalcPageShell
      url="/ulez-check"
      eyebrow="Clean Air Zones · UK · TfL / DEFRA"
      title="Is your vehicle ULEZ-compliant?"
      deck="Pick your fuel and year. We check compliance against London ULEZ, the seven English Clean Air Zones, and all four Scottish Low Emission Zones."
      verified="TfL · DEFRA · Transport Scotland"
      related={[
        { href: '/postcode',          title: 'Postcode lookup',    desc: 'Check which CAZ you live near.' },
        { href: '/cost-of-living-uk', title: 'Cost of living',     desc: 'Transport costs by UK city.' },
        { href: '/take-home-pay',     title: 'Take-home pay',      desc: 'Budget for car costs from net pay.' },
      ]}
      educational={[
        { title: 'Petrol: Euro 4 = compliant', body: 'Almost all petrol cars first registered from January 2006 onwards meet Euro 4 and are ULEZ-compliant. Some 2005-built ones do too. Older petrol cars typically pay the daily charge.' },
        { title: 'Diesel: Euro 6 = compliant', body: 'Diesel cars need Euro 6, which became mandatory from September 2015. Earlier "Euro 5" diesels (2011-2015) are NOT compliant for London ULEZ — a common surprise for owners of late-Euro-5 cars.' },
        { title: 'Electric and hydrogen', body: 'Always compliant, anywhere. Pure EVs and hydrogen fuel-cell vehicles pay zero in every UK CAZ/LEZ, though they still pay TfL\'s congestion charge in central London where applicable.' },
        { title: 'Scottish LEZs are stricter', body: 'Glasgow, Edinburgh, Aberdeen and Dundee LEZs apply the same emissions test but cars ARE included (English class C/B zones often exempt cars). Penalty starts at £60 and doubles for each repeat in the same calendar month.' },
        { title: 'London ULEZ is 24/7 and pan-London', body: 'Since 29 August 2023, ULEZ covers all of Greater London (inside the M25). It applies 24 hours, 365 days. Daily charge is £12.50 for non-compliant cars and vans.' },
        { title: 'How to check officially', body: 'Use TfL\'s ULEZ vehicle checker (tfl.gov.uk/ulez) for London — it queries DVLA by registration. For other CAZs, use gov.uk/clean-air-zones — they all share the same DVLA-backed compliance database.' },
      ]}
    >
      <UlezClient />
    </CalcPageShell>
  );
}
