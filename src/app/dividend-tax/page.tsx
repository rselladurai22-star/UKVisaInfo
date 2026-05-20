import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import DividendClient from './DividendClient';

export const metadata: Metadata = {
  title: 'UK Dividend Tax Calculator 2026/27 — £500 Allowance, 8.75% / 33.75% / 39.35%',
  description: 'Free UK dividend tax calculator. Enter your salary and dividend income — see the £500 dividend allowance, basic/higher/additional rate splits and total tax. 2026/27 HMRC rates.',
  alternates: { canonical: '/dividend-tax' },
};

export default function DividendPage() {
  return (
    <CalcPageShell
      url="/dividend-tax"
      eyebrow="Dividend Tax · UK · 2026/27 HMRC rates"
      title="The real tax on your dividends."
      deck="Salary plus dividends, with the £500 dividend allowance and the 8.75% / 33.75% / 39.35% bands applied in order — see exactly how much HMRC takes."
      verified="gov.uk/tax-on-dividends"
      related={[
        { href: '/sole-trader-vs-limited', title: 'Sole trader vs Ltd', desc: 'Compare total tax across both structures at your profit level.' },
        { href: '/take-home-pay', title: 'Take-home pay', desc: 'PAYE side of the picture for a director\'s salary.' },
        { href: '/national-insurance', title: 'National Insurance', desc: 'Why dividends beat extra salary on NI.' },
      ]}
      educational={[
        { title: 'Dividend allowance', body: 'The first £500 of dividends in a tax year is taxed at 0%. Down from £1,000 (2023/24) and £2,000 (pre-2023). Stacks on top of any unused Personal Allowance.' },
        { title: 'How rates apply', body: 'Dividends are taxed AFTER other income. So PAYE salary fills up your Personal Allowance and basic-rate band first, and dividends are taxed at the rates of whichever band they fall into.' },
        { title: 'Basic rate · 8.75%', body: 'On dividend income falling within the basic-rate band (£12,570 – £50,270 of total income).' },
        { title: 'Higher rate · 33.75%', body: 'On dividend income falling between £50,270 and £125,140 of total income.' },
        { title: 'Additional rate · 39.35%', body: 'On dividend income above £125,140 of total income. Personal Allowance is fully tapered out by this point.' },
        { title: 'How to pay', body: 'Through Self Assessment. Register with HMRC by 5 October after the tax year, file by 31 January and pay any tax due by 31 January. Dividends inside an ISA or pension are tax-free.' },
      ]}
    >
      <DividendClient />
    </CalcPageShell>
  );
}
