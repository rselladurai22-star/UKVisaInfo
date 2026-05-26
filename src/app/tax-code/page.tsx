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
      methodology={{
        summary: "We decode the structure HMRC publishes in its tax-code guidance (PAYE40000 employer manual): numeric part × 10 + 9 gives the tax-free Personal Allowance for the year; suffix letters (L, M, N, T, BR, D0, D1, NT, 0T, K) carry rate or allowance modifiers; S and C prefixes flag Scottish or Welsh rates; W1/M1/X mark non-cumulative emergency operation. All explanations track HMRC's current 2026/27 rate cards.",
        govUrl: "https://www.gov.uk/tax-codes",
        govLabel: "gov.uk · Tax codes",
      }}
      faqs={[
        { q: 'What does 1257L mean?', a: '1257L is the standard 2026/27 tax code for most UK employees. The "1257" is your Personal Allowance with the last digit removed — multiply by 10 to get £12,570 of tax-free income per year. The "L" tells HMRC and your employer you are entitled to the standard Personal Allowance with no modifications.' },
        { q: 'What does a BR tax code mean?', a: 'BR stands for Basic Rate. All income paid against a BR code is taxed at 20% with no Personal Allowance. It is normally applied to a second job or pension, where the Personal Allowance has already been used against your main employment. If BR appears on your main job, it almost certainly needs HMRC correcting — you will be overpaying.' },
        { q: 'What is a K-code and why do I have one?', a: 'A K-code (e.g. K475) means you have no Personal Allowance and HMRC needs to add extra taxable income to your pay to collect tax you owe. Common reasons: company-car benefit-in-kind larger than your PA, untaxed income (rental), State Pension above your PA, or repayment of tax owed from prior years. HMRC caps K-code deductions at 50% of pay per period.' },
        { q: 'What does the S prefix mean?', a: 'S means Scottish income-tax rates apply — different bands and rates from rUK (England, Wales and NI). S codes are assigned to anyone HMRC has on record as a Scottish resident for income-tax purposes. The C prefix is the equivalent for Welsh residents; current Welsh rates match rUK but the prefix lets HMRC apportion tax correctly between the UK and Welsh governments.' },
        { q: 'What is an emergency tax code (W1, M1, X)?', a: 'These markers mean the code is non-cumulative — each pay period is taxed in isolation rather than against your year-to-date earnings. Most often applied when you start a new job before HMRC has all your details. You may overpay tax in the short term; HMRC normally corrects to a cumulative code within 1–2 pay periods and refunds any overpayment.' },
        { q: 'How is the Marriage Allowance shown on a tax code?', a: 'The transferring partner gets a code ending in N (e.g. 1131N) — Personal Allowance reduced by 10%. The receiving partner gets a code ending in M (e.g. 1383M) — Personal Allowance increased by 10%. The transfer is exactly £1,260 of PA, worth £252/year of tax at 20% basic rate.' },
        { q: 'What does NT mean on a tax code?', a: 'NT stands for No Tax. No income tax is deducted from earnings under an NT code. Rare in practice — usually applies to non-resident actors, sportspeople or workers under specific double-taxation treaty arrangements. If you see NT and have not been told to expect it, contact HMRC immediately.' },
        { q: 'How do I check my tax code?', a: 'HMRC issues a coding notice (form P2) showing how your code was built. You can also see your code anytime in the HMRC app (free, iOS and Android) or via your Personal Tax Account at gov.uk. Your latest payslip and P60 also show the code applied at that point in the tax year.' },
        { q: 'My tax code looks wrong — what should I do?', a: 'Use the HMRC app or your Personal Tax Account to check and update the underlying details (company-car benefit, second job, untaxed income). If the details are wrong, you can correct them online and HMRC will reissue a new code automatically. If the situation is complex, call HMRC on 0300 200 3300 — have your NI number and a recent payslip to hand.' },
        { q: 'What is 0T and when is it used?', a: '0T (zero-T) means no Personal Allowance is given, but unlike BR each tax band still applies. Used when you have used up your PA elsewhere AND your earnings might cross into higher rates (so BR would under-collect). Common after you receive a final pay run from a previous employer or if HMRC has lost track of which employment should hold your PA.' },
      ]}
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
