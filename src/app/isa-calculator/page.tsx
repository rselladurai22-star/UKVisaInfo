import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import IsaClient from './IsaClient';

export const metadata: Metadata = {
  title: 'ISA Calculator 2025/26 — £20,000 Allowance, LISA Bonus, Compound Growth',
  description: 'UK ISA calculator 2025/26. Project Cash ISA, Stocks & Shares ISA, Lifetime ISA (25% bonus), and JISA growth. See compound growth over time with the £20,000 annual allowance.',
  alternates: { canonical: '/isa-calculator' },
};

export default function IsaPage() {
  return (
    <CalcPageShell
      url="/isa-calculator"
      eyebrow="ISA Calculator · UK · 2025/26"
      title="How much will your ISA be worth?"
      deck="Tax-free growth every year. Use your full £20,000 allowance, pick an assumed return, and see how compounding builds wealth over 5, 10, 20 or 30 years — completely free of Income Tax and CGT."
      verified="gov.uk/individual-savings-accounts"
      related={[
        { href: '/lifetime-isa-calculator', title: 'Lifetime ISA', desc: '25% government bonus on LISA contributions — first home or retirement.' },
        { href: '/dividend-tax', title: 'Dividend tax', desc: 'Why holding dividend shares in an ISA saves tax.' },
        { href: '/overpayment-mortgage', title: 'Mortgage overpayment', desc: 'Compare ISA returns vs guaranteed mortgage overpayment saving.' },
      ]}
      educational={[
        { title: 'ISA types and allowances', body: 'Total ISA limit: £20,000/year (Cash, Stocks & Shares, Innovative Finance, or Lifetime ISA). Lifetime ISA: max £4,000/year (counts toward the £20k). Junior ISA: £9,000/year (separate allowance).' },
        { title: 'Tax advantages', body: 'All growth, interest and dividends inside an ISA are completely free of Income Tax and Capital Gains Tax — and you never need to declare them on a tax return. The compounding effect over decades is substantial.' },
        { title: 'Cash vs Stocks & Shares', body: 'Cash ISAs offer certainty but currently earn around 4–5%. Stocks & Shares ISAs have historically returned 6–8% per year over long periods, but with volatility. For 5+ year horizons, equities have typically outpaced inflation more reliably.' },
        { title: 'LISA for first-time buyers', body: 'If you\'re saving for your first home (up to £450,000) or retirement, the Lifetime ISA adds 25% to your contributions (up to £1,000/year bonus). Use the separate LISA calculator for a detailed projection.' },
        { title: 'ISA allowances reset on 6 April', body: 'Unused allowance does NOT carry forward to the next year. If you miss a year, that £20,000 is gone permanently. Consider setting up a standing order to maximise each year.' },
      ]}
    >
      <IsaClient />
    </CalcPageShell>
  );
}
