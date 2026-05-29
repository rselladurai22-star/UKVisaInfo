import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import LifetimeIsaClient from './LifetimeIsaClient';

export const metadata: Metadata = {
  title: 'Lifetime ISA Calculator 2026/27 — 25% Bonus, First Home & Penalty Trap Explained',
  description:
    'Free UK Lifetime ISA calculator for 2026/27. Model the 25% government bonus (up to £1,000/year), project growth for a first home (≤ £450,000) or retirement from 60, and see exactly what the 25% penalty costs for other withdrawals. Instant results.',
  alternates: { canonical: '/lifetime-isa-calculator' },
  openGraph: {
    title: 'Lifetime ISA Calculator — 25% Bonus + Penalty Trap Tool',
    description:
      'Project LISA growth, calculate total government bonuses, and see the true cost of withdrawing early.',
    url: 'https://ukvisainfo.co.uk/lifetime-isa-calculator',
  },
};

const FAQS = [
  {
    q: 'What is a Lifetime ISA (LISA) and how does the 25% bonus work?',
    a: 'A Lifetime ISA is a government-backed savings account for adults aged 18 to 39. You can contribute up to £4,000 per year and the government adds a 25% bonus — up to £1,000 per tax year. The bonus is paid monthly (into Stocks & Shares LISAs) or at the end of the tax year (into some Cash LISAs). The bonus itself earns the same investment returns as your contributions, compounding over time. It can only be used penalty-free for a first home purchase (property ≤ £450,000) or from age 60 for retirement.',
  },
  {
    q: 'Who can open a Lifetime ISA?',
    a: 'You must be aged between 18 and 39 to open a LISA. Once open, you can continue contributing until your 50th birthday — after which no new contributions (and therefore no new bonuses) are allowed. The account remains open and continues to grow after 50, and can still be accessed penalty-free from age 60 for retirement.',
  },
  {
    q: 'Can I use a Lifetime ISA to buy my first home?',
    a: 'Yes — the LISA can be used toward a first home purchase subject to these rules: (1) the property must cost £450,000 or less; (2) you must be a first-time buyer; (3) the LISA must have been open for at least 12 months before you use it; (4) it must be used alongside a repayment mortgage — you cannot use it for a cash purchase; and (5) the LISA funds are paid directly to your conveyancer. Both partners in a couple can each use their own LISA on the same property, potentially combining up to £2,000 of bonus money if both have contributed the full £4,000.',
  },
  {
    q: 'What happens if I withdraw from a Lifetime ISA for another reason?',
    a: 'If you withdraw for any reason other than a qualifying first home purchase or retirement from age 60 (or terminal illness), HMRC charges a 25% penalty on the full withdrawal amount — not just the bonus. This is the "penalty trap": on a £5,000 pot (£4,000 contributions + £1,000 bonus), a 25% penalty = £1,250, leaving you with only £3,750. You lose the bonus AND £250 of your own money. This 25% penalty is effectively a clawback of more than just the bonus at normal contribution levels.',
  },
  {
    q: 'Why does the penalty take more than just the bonus?',
    a: 'The maths is counter-intuitive. The LISA bonus effectively inflates the pot: every £4 you put in becomes £5 (with bonus). The penalty is 25% of the inflated pot — not 25% of what you put in. So: £4 contribution + £1 bonus = £5. Penalty = 25% of £5 = £1.25. You get back £5 − £1.25 = £3.75, having put in £4. The penalty exceeds the bonus by 25p per £4 contributed. This asymmetry is why the LISA should only be opened if you are confident of using it for a first home or retirement.',
  },
  {
    q: 'Is a Lifetime ISA better than a pension for retirement?',
    a: 'It depends on your tax rate and circumstances. For a basic-rate taxpayer with no employer pension: the LISA bonus (25%) matches the basic-rate pension relief (20% on contributions, grossing up to 25% of net pay). However, pensions have employer contributions via auto-enrolment — you get free money from your employer that a LISA never provides. For a higher-rate taxpayer: pensions attract 40% tax relief, making them far more efficient than the LISA\'s 25% bonus. For the self-employed (no employer): LISA vs pension is much closer — both get 25% government top-up at basic rate.',
  },
  {
    q: 'Can I have both a Lifetime ISA and a pension?',
    a: 'Yes — you can have both simultaneously. Many people use a workplace pension for employer contributions + tax relief and a LISA for a first-home purchase, or use a LISA to supplement a pension in retirement. There is no rule against both. However, a LISA contribution of £4,000 counts toward your £20,000 annual ISA allowance, and pension contributions toward your £60,000 Annual Allowance — these are separate calculations.',
  },
  {
    q: 'What if the property I want to buy costs more than £450,000?',
    a: 'If the property costs more than £450,000, you cannot use the LISA for that purchase. The LISA remains in your account and continues to grow — you can still access it at age 60 for retirement. You do not lose the account; you simply cannot use it for this particular purchase. Many people in London or expensive areas face this — the LISA is better suited to buyers outside the most expensive markets.',
  },
  {
    q: 'Can I transfer my Help to Buy ISA into a Lifetime ISA?',
    a: 'The Help to Buy ISA closed to new applications in November 2019. If you have a legacy HTB ISA, you can transfer the balance into a LISA. The transfer amount does not count as a new contribution for LISA purposes — you can transfer the full HTB balance (up to the LISA contribution limit for that year). You then receive the 25% LISA bonus on the transferred amount and any additional contributions, with the LISA\'s £450,000 property price limit and first-12-months rule applying.',
  },
  {
    q: 'What happens to a Lifetime ISA when I die?',
    a: 'On death, the LISA can be paid to your estate without the 25% withdrawal penalty. The funds form part of your estate for Inheritance Tax purposes (if applicable). The HMRC 25% charge is only triggered by a living account holder withdrawing for a non-qualifying reason — death is explicitly exempt from the penalty.',
  },
];

export default function LifetimeIsaPage() {
  return (
    <CalcPageShell
      url="/lifetime-isa-calculator"
      eyebrow="Lifetime ISA · UK · 2026/27"
      title="The government adds 25% to your LISA — but there is a penalty trap to understand"
      deck="Up to £1,000 free government bonus per year for your first home (≤ £450,000) or retirement from 60. Open before 40, contribute until 50. The 25% withdrawal penalty is steeper than most people realise — understand it before you open one."
      verified="gov.uk/lifetime-isa"
      editorVerified="May 2026"
      methodology={{
        summary:
          'Projections use the compound interest formula FV = P × ((1 + r)^n − 1) / r, where P is annual contribution plus bonus (£4,000 + £1,000 = £5,000 at full contribution), r is the assumed annual growth rate, and n is the number of contributing years. The penalty calculation uses HMRC\'s 25% charge on the full withdrawal amount: penalty = total pot × 0.25; net received = total pot × 0.75. LISA rules (contribution limit, age restrictions, property price cap, 12-month access rule) reflect current HMRC guidance at gov.uk/lifetime-isa. Investment returns are not guaranteed.',
        govUrl: 'https://www.gov.uk/lifetime-isa',
        govLabel: 'gov.uk — Lifetime ISA',
      }}
      faqs={FAQS}
      sidebar={{
        keyRates: [
          { label: 'Annual contribution limit', value: '£4,000/yr', sub: 'Counts toward £20,000 ISA allowance', accent: '#6366F1' },
          { label: 'Government bonus', value: '25%', sub: 'Up to £1,000 per tax year', accent: '#0F766E' },
          { label: 'Maximum lifetime bonus', value: '£33,000', sub: '33 years × £1,000 (ages 18–50)' },
          { label: 'Property price cap', value: '£450,000', sub: 'First home only — not second home' },
          { label: 'Withdrawal penalty', value: '25%', sub: 'On full pot — claws back bonus + own money' },
        ],
        dates: [
          { date: '39', desc: 'Age limit to open a LISA — must open before your 40th birthday', urgent: true },
          { date: '50', desc: 'Age at which contributions and bonuses stop', urgent: false },
          { date: '12 mths', desc: 'LISA must have been open for 12 months before using for first home', urgent: false },
          { date: '60', desc: 'Minimum age for penalty-free retirement access', urgent: false },
        ],
        tips: [
          { heading: 'Open ASAP if under 40', body: 'Even opening a LISA with £1 before your 40th birthday preserves the option. You can contribute later. Once past 40, the window closes permanently.' },
          { heading: 'The penalty is worse than most expect', body: 'Withdrawing early returns you less than you paid in — not just losing the bonus. £4,000 in, £1,000 bonus, 25% penalty on £5,000 = £3,750 back. You lose £250 of your own money.' },
          { heading: 'Both partners can use LISAs on one property', body: 'Two first-time buyers purchasing together can each use their own LISA, combining up to £2,000 of bonus toward the deposit in a single year.' },
          { heading: 'LISA vs Help to Buy ISA', body: 'HTB ISA is closed to new applicants. If you have an existing HTB ISA, you can transfer it into a LISA to access the 25% bonus rate (vs HTB\'s 25% on final withdrawal). Consider transferring.' },
        ],
        govLink: 'gov.uk/lifetime-isa',
        govLabel: 'gov.uk — Lifetime ISA',
      }}
      related={[
        { href: '/isa-calculator', title: 'ISA calculator', desc: 'Full ISA allowance and compound growth projection across all four ISA types.' },
        { href: '/pension-drawdown-calculator', title: 'Pension drawdown', desc: 'Compare LISA retirement pot vs a pension in drawdown.' },
        { href: '/overpayment-mortgage', title: 'Mortgage overpayment', desc: 'Compare LISA first-home savings vs overpaying your current mortgage.' },
      ]}
      educational={[
        {
          title: 'How the 25% bonus is calculated — and why it is worth up to £33,000',
          body: 'The LISA bonus is straightforward: for every £4 you contribute, the government adds £1 — a 25% top-up. At the maximum £4,000 per year, the bonus is £1,000. This bonus is added to your LISA pot and invested alongside your own contributions, compounding over time.\n\nIf you open a LISA at 18 and contribute the maximum £4,000 every year until 50 (32 contribution years), you receive:\n- Your contributions: 32 × £4,000 = £128,000\n- Government bonuses: 32 × £1,000 = **£32,000 free**\n- Plus investment growth on the combined pot over 40+ years\n\nAt 5% growth, opening at 18 and accessing at 60 with full contributions: the pot could reach approximately £650,000 — of which £32,000 came entirely from the government bonus, and hundreds of thousands from compounding that free money over 42 years.',
        },
        {
          title: 'The penalty trap — the precise mathematics of withdrawing early',
          body: 'The LISA withdrawal penalty is one of the most misunderstood features in UK personal finance. Many people assume the penalty just "claws back the bonus." It does not — it takes more.\n\n**Why the 25% penalty erodes your own money:**\n\nThe LISA inflates your pot: £4 in → £5 with bonus. The 25% penalty applies to the inflated £5, not your £4.\n- Penalty = £5 × 25% = £1.25\n- You receive: £5 − £1.25 = £3.75\n- You put in: £4.00\n- Net loss on your own money: **−£0.25 per £4 contributed**\n\nAt the maximum £5,000 per year (£4,000 contribution + £1,000 bonus), withdrawing the whole pot incurs a £1,250 penalty. You receive £3,750 despite having put in £4,000.\n\n**The rule:** Only open a LISA if you are confident of using it for a qualifying first home purchase or retirement. If there is significant chance you will need the money for something else, a standard ISA or emergency fund is safer.',
        },
        {
          title: 'LISA for first-time buyers — the full rules',
          body: 'The Lifetime ISA is one of the best first-home buying tools in the UK, but only within its constraints:\n\n**Qualifying conditions:**\n1. Property price ≤ £450,000 (applies to the share price in shared ownership)\n2. You must be a first-time buyer (never owned a home anywhere in the world)\n3. LISA must have been open for at least 12 calendar months\n4. Purchase must use a repayment mortgage (not cash purchase)\n5. Funds go directly to your solicitor/conveyancer — you do not receive them\n\n**For couples:** Both partners can use their own LISA on the same property. Each must be a first-time buyer. This can be a powerful combined deposit: two people × £5,000/year (including bonuses) = £10,000/year toward the deposit pot.\n\n**If the purchase falls through:** The LISA money is returned to your account. You do not lose the bonus just because a sale falls through before completion.\n\n**The £450,000 ceiling:** Properties over this price mean the LISA is inaccessible for that purchase — it stays in your account for retirement (age 60). This is a significant constraint in London and the South East where average prices exceed £500,000.',
        },
        {
          title: 'LISA vs pension — a structured comparison',
          body: '| Factor | Lifetime ISA | Workplace Pension | Personal Pension (SIPP) |\n|---|---|---|---|\n| Government contribution | 25% bonus | 20%/40% tax relief | 20%/40% tax relief |\n| Employer contribution | None | Yes (auto-enrolment) | None |\n| Access age | 60+ or first home | 57+ (from 2028) | 57+ (from 2028) |\n| Contribution limit | £4,000/year | £60,000/year | £60,000/year |\n| Annual allowance used | No | Yes | Yes |\n| Tax on withdrawal | Tax-free | Subject to income tax | Subject to income tax |\n| Penalty for early access | 25% charge | Unauthorised payment (55%) | Unauthorised payment (55%) |\n\n**Verdict:**\n- *Take employer pension contributions first* — free money beats everything\n- *Basic-rate taxpayer, no employer contributions:* LISA and SIPP are roughly equivalent; LISA wins on flexibility (first home access)\n- *Higher-rate taxpayer:* SIPP wins on 40% relief\n- *Self-employed first-time buyer:* LISA is excellent — 25% bonus + potential first-home use',
        },
        {
          title: 'Worked example — £4,000/year from 25 to 35, used for first home at 35',
          body: '**Scenario:** Sarah opens a LISA at 25 and contributes £4,000/year until 35 (10 years), then uses the pot toward a flat purchase at 35.\n\n**Contributions:** 10 × £4,000 = £40,000\n**Government bonuses:** 10 × £1,000 = **£10,000 free**\n**Total pot before growth:** £50,000\n**At 5% annual growth for 10 years (from year 1):** approximately **£62,900**\n\nOf the £62,900 pot:\n- Sarah contributed £40,000\n- Government contributed £10,000\n- Investment growth: £12,900\n\nSarah uses the full £62,900 as part of her first home deposit — all tax-free, no penalty. The government effectively contributed £10,000 to her home purchase, plus the compounding return on that £10,000 (approximately £2,900 in growth).\n\nIf she needed to withdraw for another reason, the penalty on £62,900 would be £15,725 — she would receive only £47,175. This illustrates why the LISA should only be used when you are confident of a qualifying withdrawal.',
        },
      ]}
    >
      <LifetimeIsaClient />
    </CalcPageShell>
  );
}
