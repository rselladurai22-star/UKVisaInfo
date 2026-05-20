import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import PensionAllowanceClient from './PensionAllowanceClient';

export const metadata: Metadata = {
  title: 'UK Pension Annual Allowance Calculator 2026/27 — Tapered + MPAA',
  description: 'Free UK pension annual allowance calculator. Standard £60,000, MPAA £10,000 if flexibly accessed, tapered for high earners over £260,000 adjusted income. With carry-forward.',
  alternates: { canonical: '/pension-allowance' },
};

export default function PensionAllowancePage() {
  return (
    <CalcPageShell
      eyebrow="Pension AA · UK 2026/27"
      title="How much can you contribute pre-tax?"
      deck="Work out your Annual Allowance — including taper for high earners and MPAA after flexible access — plus carry-forward from prior years."
      verified="HMRC PTM055000"
      related={[
        { href: '/take-home-pay',     title: 'Take-home pay',     desc: 'Net salary, including pension impact.' },
        { href: '/cgt-calculator',    title: 'Capital Gains Tax', desc: '£3,000 AEA · 18%/24% rates.' },
        { href: '/state-pension',     title: 'State Pension forecast', desc: 'Project from your NI years.' },
      ]}
      educational={[
        { title: 'Standard £60,000', body: 'Most people can contribute up to £60,000 of "relievable" pension contributions in a tax year (employee + employer + salary sacrifice combined). Personal contributions are also capped at your annual relevant UK earnings.' },
        { title: 'Tapered for high earners', body: 'If adjusted income exceeds £260,000 AND threshold income exceeds £200,000, the £60,000 reduces by £1 for every £2 over £260,000 — down to a floor of £10,000 at adjusted income £360,000.' },
        { title: 'Adjusted vs threshold income', body: 'Threshold income ≈ total taxable income minus personal pension contributions. Adjusted income adds back employer contributions and salary-sacrificed pension. BOTH thresholds must be breached for the taper to bite.' },
        { title: 'MPAA — £10,000', body: 'Once you flexibly access a defined-contribution pot (e.g. drawdown beyond the tax-free lump sum, or UFPLS), your money-purchase contributions are capped at £10,000 a year — no carry-forward against this cap.' },
        { title: 'Carry-forward', body: 'Up to 3 prior years\' unused AA can be carried forward, used oldest first. You must have been a member of a UK pension scheme in those years, even if you contributed nothing.' },
        { title: 'Exceed the allowance?', body: 'You pay an Annual Allowance Charge: the excess is added to your income and taxed at your marginal rate. "Scheme Pays" can sometimes pay it from the pension itself.' },
      ]}
    >
      <PensionAllowanceClient />
    </CalcPageShell>
  );
}
