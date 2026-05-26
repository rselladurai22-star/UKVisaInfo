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
      faqs={[
        { q: 'How much National Insurance do employees pay in 2026/27?', a: 'Employees on Class 1 NI pay 8% on earnings between the £12,570 Primary Threshold and the £50,270 Upper Earnings Limit, then 2% on every pound above the UEL. NI is calculated per pay period (week or month), not annually — so a one-off bonus can push a single period into the 2% band without affecting the rest of the year.' },
        { q: 'What is the employer NI rate from April 2025?', a: 'Employer Class 1 NI is 15% on earnings above the £5,000 Secondary Threshold (down from £9,100 the year before). Announced in the Autumn Budget 2024 and effective 6 April 2025, this is a significant increase from the previous 13.8% rate and a major operating-cost shift for UK employers — particularly those with many part-time staff.' },
        { q: 'What happened to Class 2 NI?', a: 'Mandatory Class 2 National Insurance (£3.45 per week for self-employed people with profits above £12,570) was abolished from 6 April 2024. Self-employed people with profits below the Small Profits Threshold (£6,725) can still pay it voluntarily to maintain their State Pension qualifying years and contribution-based benefit entitlements.' },
        { q: 'What is Class 4 NI and who pays it?', a: 'Class 4 NI is paid by sole traders and partners on their trading profits via Self Assessment. The rate was cut from 9% to 8% in Jan 2024 and again to 6% from April 2024 (Spring Budget 2024). It is 6% on profits between £12,570 and £50,270, and 2% on profits above the upper threshold. Paid in two instalments alongside the SA bill — 31 January and 31 July.' },
        { q: 'What are NI category letters?', a: 'NI category letters tell HMRC which contribution rate applies. A is the standard adult rate. M applies to employees under 21 — the employer pays no NI on their earnings up to the UEL. H applies to apprentices under 25 with the same employer-NI relief. V is for veterans in their first year of civilian employment. C applies to employees over State Pension age — they pay no employee NI but the employer still pays employer NI.' },
        { q: 'Does NI count toward my State Pension?', a: 'Yes — each tax year where you pay (or are credited with) enough NI is a qualifying year. You need 10 qualifying years to get any State Pension and 35 qualifying years for the full new State Pension (£221.20/week in 2024/25, uprated annually). Class 1, Class 2 (where still paid) and certain credits all count.' },
        { q: 'Can I top up missing NI years?', a: 'Yes. You can voluntarily pay Class 3 NI contributions (£17.45 per missing week in 2024/25) to fill gaps and increase your State Pension. Normally only the previous 6 years can be topped up, but until 5 April 2025 a temporary extension allowed back-filling from 6 April 2006 — making this one of the most cost-effective UK retirement plays for many people.' },
        { q: 'What is the Employment Allowance?', a: 'A government scheme letting eligible employers reduce their annual Class 1 employer NI by up to £10,500 (raised from £5,000 in April 2025). Most small employers qualify; sole-director limited companies do not. The allowance is claimed via PAYE and applied against the employer NI liability month by month until used up.' },
        { q: 'Do directors pay NI differently?', a: 'Yes — company directors use an "annual earnings period" rather than a per-pay-period basis. NI is calculated cumulatively across the tax year on total earnings, which means a director taking a one-off year-end bonus pays NI at exactly the same blended rate as if it had been spread across the year. This prevents directors from manipulating salary timing to dodge NI.' },
        { q: 'How does NI work for the self-employed in 2026?', a: 'Self-employed people pay only Class 4 NI on their profits — Class 2 has been abolished. The calculation runs at 6% between £12,570 and £50,270, then 2% above. Paid through Self Assessment in two instalments (31 Jan with the balancing payment and Payment on Account; 31 Jul with the second Payment on Account). Class 4 does count as a qualifying year for State Pension purposes.' },
      ]}
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
