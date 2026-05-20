import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import TaxCodeClient from './TaxCodeClient';

export const metadata: Metadata = {
  title: 'UK Tax Code Decoder 2026/27 — What Does Your Tax Code Mean?',
  description: 'Free UK tax-code decoder. Decode any HMRC tax code (1257L, K475, BR, D0, NT, S1257L, W1/M1 emergency). Shows your Personal Allowance and what it means in plain English.',
  alternates: { canonical: '/tax-code' },
};

export default function TaxCodePage() {
  return (
    <CalcPageShell
      url="/tax-code"
      eyebrow="Tax code · UK · HMRC 2026/27"
      title="Decode your UK tax code."
      deck="Paste any tax code — 1257L, K475, BR, D0, NT, S1257L W1 — and we'll explain it in plain English, with your effective Personal Allowance."
      verified="HMRC tax-code guidance"
      related={[
        { href: '/take-home-pay',       title: 'Take-home pay',     desc: 'See net pay after PAYE, NI, student loan, pension.' },
        { href: '/vat-calculator',      title: 'VAT calculator',    desc: 'Add or remove 20%, 5%, 0% VAT.' },
        { href: '/holiday-pay',         title: 'Holiday pay',       desc: 'Statutory 5.6 weeks · pro-rata · irregular hours.' },
      ]}
      educational={[
        { title: 'The number × 10 is your PA', body: '1257L means HMRC has given you a tax-free Personal Allowance of about £12,570 for the year (the number is shown without the last digit; PA = number × 10 + 9 in HMRC\'s rules).' },
        { title: 'The letter is the situation', body: 'L = standard PA. M = received Marriage Allowance from spouse (+10%). N = transferred it (-10%). T = under review. 0T = no PA. BR = all 20%. D0 = all 40%. D1 = all 45%. NT = no tax.' },
        { title: 'Prefixes S and C', body: 'An S prefix means Scottish income-tax rates apply. A C prefix means Welsh — though the Welsh rates currently match rUK, the prefix lets HMRC apportion tax correctly.' },
        { title: 'W1 / M1 / X — emergency', body: 'These mean your code is non-cumulative: tax is worked out each pay period in isolation, not against your year-to-date earnings. Common when you change jobs mid-year before HMRC has all your details.' },
        { title: 'K-codes mean negative PA', body: 'A code starting with K (e.g. K475) means there\'s no PA and an extra amount is added to your taxable pay (often for company-car benefits, state pension, or tax owed from prior years). Up to 50% of pay can be deducted via PAYE in any one period.' },
        { title: 'Where to check', body: 'HMRC sends a Coding Notice (form P2) explaining how your code was built. You can also check your code anytime in the HMRC app or via your Personal Tax Account on gov.uk.' },
      ]}
    >
      <TaxCodeClient />
    </CalcPageShell>
  );
}
