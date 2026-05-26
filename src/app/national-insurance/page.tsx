import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import NiClient from './NiClient';

export const metadata: Metadata = {
  title: 'UK National Insurance Calculator 2026/27 — Employee, Employer, Self-Employed',
  description: 'Free UK National Insurance calculator. Class 1 employee (8% / 2%), employer (15% from £5k from April 2025), Class 4 self-employed (6% / 2%). All NI category letters explained.',
  alternates: { canonical: '/national-insurance' },
};

export default function NiPage() {
  return (
    <CalcPageShell
      url="/national-insurance"
      eyebrow="National Insurance · UK · 2026/27"
      title="Every flavour of National Insurance, calculated."
      deck="Employee Class 1, employer Class 1 (15% from April 2025), and self-employed Class 4 (6% / 2%) — pick a side and see the NI bill, by band, with the right category letter applied."
      verified="gov.uk/national-insurance-rates-letters"
      methodology={{
        summary: "Class 1 employee NI: 8% between the £12,570 Primary Threshold and £50,270 Upper Earnings Limit, 2% above. Class 1 employer NI: 15% above the £5,000 Secondary Threshold (April 2025 rate, Autumn Budget 2024). Class 4 self-employed NI: 6% between £12,570 and £50,270, 2% above (Spring Budget 2024 cut from 8%). Class 2 abolished from 6 April 2024.",
        govUrl: "https://www.gov.uk/national-insurance-rates-letters",
        govLabel: "gov.uk · NI rates and letters",
      }}
      related={[
        { href: '/take-home-pay', title: 'Take-home pay', desc: 'Full PAYE picture — tax, NI, student loan, pension.' },
        { href: '/dividend-tax',  title: 'Dividend tax', desc: 'Why dividends beat extra salary on NI.' },
        { href: '/sole-trader-vs-limited', title: 'Sole trader vs Ltd', desc: 'Compare total tax + NI across both structures.' },
      ]}
      educational={[
        { title: 'Class 1 — Employee', body: '8% on earnings between £12,570 (PT) and £50,270 (UEL). 2% on earnings above the UEL. Deducted automatically via PAYE.' },
        { title: 'Class 1 — Employer', body: '15% on earnings above the £5,000 Secondary Threshold (Autumn Budget 2024 — effective from 6 April 2025). Up from 13.8% above £9,100 previously.' },
        { title: 'Employment Allowance', body: 'Most eligible employers can offset up to £10,500/year of employer NI (raised from £5,000 in April 2025). Doesn\'t apply to single-director limited companies.' },
        { title: 'Class 2 — Self-employed', body: 'Mandatory Class 2 NI (£3.45/week) was abolished from 6 April 2024. Still available voluntarily for years with low profits, to protect State Pension entitlement.' },
        { title: 'Class 4 — Self-employed profits', body: '6% on profits between £12,570 and £50,270 (cut from 8% in April 2024). 2% on profits above £50,270. Paid through Self Assessment in January and July.' },
        { title: 'NI category letters', body: 'A = standard adult. M = under 21 (employer NI free up to UEL). H = apprentice under 25 (same employer NI relief). V = veteran first year. C = over State Pension age — no employee NI.' },
      ]}
    >
      <NiClient />
    </CalcPageShell>
  );
}
