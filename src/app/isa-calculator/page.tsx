import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import IsaClient from './IsaClient';

export const metadata: Metadata = {
  title: 'ISA Calculator 2026/27 — £20,000 Allowance, Compound Growth & LISA Bonus',
  description:
    'Free UK ISA calculator for 2026/27. Project Cash ISA, Stocks & Shares ISA, Lifetime ISA (25% bonus) and Junior ISA compound growth over up to 30 years. Compares all four ISA types side-by-side. Instant results, no sign-up.',
  alternates: { canonical: '/isa-calculator' },
  openGraph: {
    title: 'ISA Calculator 2026/27 — All 4 ISA Types',
    description:
      'Model 5, 10, 20 or 30 years of tax-free compound growth across Cash, Stocks & Shares, Lifetime and Junior ISAs.',
    url: 'https://ukvisainfo.co.uk/isa-calculator',
  },
};

const FAQS = [
  {
    q: 'What is the ISA allowance for 2026/27?',
    a: 'The annual ISA allowance remains £20,000 per adult for 2026/27 — unchanged since 2017/18. You can split the £20,000 across different ISA types in any combination (e.g. £10,000 in a Cash ISA and £10,000 in a Stocks & Shares ISA) as long as the total does not exceed £20,000. The Lifetime ISA has its own sub-limit of £4,000 per year, which counts toward the £20,000 total. Unused allowance does not carry over — it expires on 5 April each year.',
  },
  {
    q: 'How many ISAs can I have and how many can I pay into each year?',
    a: 'You can hold as many ISAs as you like across your lifetime. However, since April 2024 you can pay into multiple ISAs of the same type in the same tax year — previously you were limited to one of each type per year. This means you could, for example, split your £20,000 across three different Stocks & Shares ISAs simultaneously. The one rule that does not change: you can still only hold one Lifetime ISA at a time, and the combined total paid into all ISAs in a single tax year must not exceed £20,000.',
  },
  {
    q: 'What is the difference between a Cash ISA and a Stocks & Shares ISA?',
    a: 'A Cash ISA holds cash deposits and earns interest — much like a savings account, but without Income Tax on the interest. Returns are predictable but typically track the Bank of England base rate. A Stocks & Shares ISA holds investments (funds, shares, bonds, ETFs) — returns are not guaranteed but have historically averaged 6–8% per year over long periods (20+ years) for diversified global equity funds. For money needed within 5 years, a Cash ISA avoids market risk. For money you will not need for 10+ years, a Stocks & Shares ISA has typically produced much higher real returns than cash.',
  },
  {
    q: 'How does compound growth work inside an ISA?',
    a: 'Compound growth means your returns are reinvested to earn their own returns the following year. At 6% annual growth on £10,000 invested: Year 1 earns £600 (total £10,600); Year 2 earns £636 on the larger balance (total £11,236); Year 10 is worth £17,908; Year 20 is worth £32,071 — more than triple your money without adding a penny. Inside an ISA, every penny of growth is tax-free. Outside an ISA, you would pay Income Tax on interest and CGT on gains above the £3,000 annual allowance. Over 20+ years the ISA tax shelter is often worth more than the investment itself.',
  },
  {
    q: 'Can I withdraw from an ISA whenever I want?',
    a: 'For Cash ISAs and Stocks & Shares ISAs, yes — most are flexible and allow withdrawals at any time (though some fixed-rate cash ISAs restrict access during the fixed period). Flexible ISAs allow you to replace withdrawn money in the same tax year without it counting as a new contribution. Lifetime ISAs have withdrawal restrictions: penalty-free only for first home purchase (property ≤ £450,000) or from age 60 for retirement. Withdrawing for any other reason incurs a 25% HMRC penalty on the full withdrawal amount — which can erode your own contributions. Junior ISAs cannot be accessed at all until the child turns 18.',
  },
  {
    q: 'Is a Cash ISA worth it if I have the Personal Savings Allowance?',
    a: 'Basic-rate taxpayers have a £1,000 Personal Savings Allowance (PSA) — interest below this is tax-free already. Higher-rate taxpayers have a £500 PSA. If your savings interest is comfortably below your PSA, a Cash ISA adds no immediate tax benefit. But if interest rates remain high (4–5%) and your savings grow, you can quickly exceed the PSA. A £50,000 cash balance at 4.5% generates £2,250 of interest — taxable above the PSA at your marginal rate. Once money is inside an ISA, all future interest is permanently sheltered, even as balances grow.',
  },
  {
    q: 'What is a Lifetime ISA (LISA) and who should use one?',
    a: 'The Lifetime ISA adds a 25% government bonus (up to £1,000 per year) to contributions up to £4,000 per year. It is best suited for: (1) first-time buyers saving for a home costing £450,000 or less — the bonus is effectively free money for the deposit; and (2) self-employed people or basic-rate taxpayers building retirement savings alongside or instead of a workplace pension. Higher-rate taxpayers usually find personal pensions more efficient (40% tax relief vs 25% bonus) unless buying their first home.',
  },
  {
    q: 'What is a Junior ISA (JISA) and how much can I put in?',
    a: 'A Junior ISA is a tax-free savings or investment account for a child under 18 opened by a parent or guardian. The 2026/27 JISA limit is £9,000 per year — separate from the adult £20,000 ISA allowance. The child cannot access the money until they turn 18, when the JISA automatically converts to an adult ISA. Either a Cash JISA or a Stocks & Shares JISA can be held simultaneously, as long as the combined contributions do not exceed £9,000. Parents, grandparents, and anyone else can contribute up to the annual limit.',
  },
  {
    q: 'How much could I have if I max out my ISA for 20 years?',
    a: 'At the full £20,000 annual contribution with a 6% assumed return, after 20 years the ISA pot would be approximately £735,000 — total contributions of £400,000 plus roughly £335,000 of tax-free growth. At 8% assumed return for the same 20 years: approximately £916,000. These projections assume contributions are made at the start of each year. All figures are illustrative — investment returns are not guaranteed — but they illustrate the compounding power of regular tax-free investing over time.',
  },
  {
    q: 'Can I transfer an ISA to a different provider?',
    a: 'Yes — you can transfer an existing ISA to a different provider at any time without losing the tax-free status or the allowance already used. Cash-to-Cash and Stocks-to-Stocks transfers are straightforward. Cash-to-Stocks & Shares transfers are also allowed. However, you cannot transfer a Lifetime ISA to a non-LISA provider without triggering the 25% withdrawal penalty. When transferring, always use the official ISA transfer process — withdrawing and reinvesting counts as a new contribution and may use up allowance you no longer have available.',
  },
];

export default function IsaPage() {
  return (
    <CalcPageShell
      url="/isa-calculator"
      eyebrow="ISA Calculator · UK · 2026/27"
      title="How much will your ISA be worth? Model 30 years of tax-free growth"
      deck="The £20,000 ISA allowance is use-it-or-lose-it every 5 April. Whether you hold cash, global equities, or a Lifetime ISA with 25% bonus, compound growth inside a tax shelter is one of the most powerful wealth-building tools available."
      verified="gov.uk/individual-savings-accounts"
      editorVerified="May 2026"
      methodology={{
        summary:
          'Projections use the standard compound interest formula: FV = P × ((1 + r)^n − 1) / r, where P is the annual contribution (paid at start of year), r is the assumed annual growth rate, and n is the number of years. For the Lifetime ISA, the 25% government bonus (£1 for every £4 contributed, up to £1,000/year) is added to the pot at the start of each contribution year and compounded with the same assumed rate. The ISA annual allowance (£20,000) and LISA sub-limit (£4,000) use 2026/27 HMRC figures. Projections are illustrative — investment returns are not guaranteed.',
        govUrl: 'https://www.gov.uk/individual-savings-accounts',
        govLabel: 'gov.uk — ISAs',
      }}
      faqs={FAQS}
      sidebar={{
        keyRates: [
          { label: 'Adult ISA allowance', value: '£20,000/yr', sub: 'All ISA types combined — 2026/27', accent: '#0F766E' },
          { label: 'Lifetime ISA sub-limit', value: '£4,000/yr', sub: 'Counts toward the £20,000 total', accent: '#6366F1' },
          { label: 'LISA government bonus', value: '25%', sub: 'Up to £1,000 bonus per year' },
          { label: 'Junior ISA (JISA)', value: '£9,000/yr', sub: 'Separate from adult allowance' },
          { label: 'Tax on ISA gains/income', value: '£0', sub: 'No Income Tax, no CGT, no declaration' },
        ],
        dates: [
          { date: '6 Apr', desc: 'New tax year — allowance resets, unused allowance is lost', urgent: true },
          { date: '5 Apr', desc: 'Last day to use 2025/26 £20,000 ISA allowance', urgent: true },
          { date: '39', desc: 'Age limit to open a Lifetime ISA (can contribute to age 50)', urgent: false },
        ],
        tips: [
          { heading: 'Allowance resets every 6 April', body: 'Unused ISA allowance cannot be rolled over. If you miss 2025/26, that £20,000 slot is permanently gone. Consider standing orders in April.' },
          { heading: 'Flexible ISAs let you re-deposit withdrawals', body: 'Many providers offer Flexible ISAs — you can withdraw and re-deposit in the same tax year without it counting as a new contribution toward your allowance.' },
          { heading: 'You can now split across multiple ISAs of the same type', body: 'Since April 2024 you can pay into multiple Cash ISAs or multiple Stocks & Shares ISAs simultaneously — compare rates across providers without restriction.' },
          { heading: 'LISA beats pension for first-time buyers', body: 'For a first home purchase up to £450,000, the 25% LISA bonus is free money regardless of your tax rate — no employer contribution needed and no lock-in at retirement age.' },
        ],
        govLink: 'gov.uk/individual-savings-accounts',
        govLabel: 'gov.uk — Individual Savings Accounts',
      }}
      related={[
        { href: '/lifetime-isa-calculator', title: 'Lifetime ISA calculator', desc: 'Model the 25% bonus and first-home purchase timeline in detail.' },
        { href: '/dividend-tax', title: 'Dividend tax calculator', desc: 'See why holding dividend shares inside an ISA saves tax.' },
        { href: '/overpayment-mortgage', title: 'Mortgage overpayment', desc: 'Compare ISA compound returns against the guaranteed saving of overpaying your mortgage.' },
      ]}
      educational={[
        {
          title: 'The four ISA types — which is right for you?',
          body: '**Cash ISA** — Holds cash and earns interest, completely free of Income Tax. Typically earns the Bank of England base rate minus a small margin. Best for: short-term savings (under 5 years), emergency funds, risk-averse savers, or those who have already used their Personal Savings Allowance.\n\n**Stocks & Shares ISA** — Holds investments (shares, funds, bonds, ETFs). Growth, dividends and capital gains are all tax-free. Returns are not guaranteed but have historically averaged 6–8% per year over 15+ years for global equity index funds. Best for: long-term wealth-building (10+ year horizon), supplementing a pension, or sheltering dividend income from higher-rate tax.\n\n**Lifetime ISA (LISA)** — Contributes up to £4,000/year and receives a 25% government bonus (max £1,000/year). Tax-free if used for a first home (≤ £450,000) or retirement from age 60. Penalty applies for other withdrawals. Best for: first-time buyers or self-employed people without workplace pensions.\n\n**Junior ISA (JISA)** — Available to children under 18. Annual limit: £9,000 (separate from adult allowance). Cannot be accessed until the child turns 18. Best for: long-term savings for a child\'s future — university, first home deposit, or investment seed.',
        },
        {
          title: 'Why the tax shelter matters more than the rate',
          body: 'Consider two investors, each investing £10,000 per year for 20 years at a 6% return:\n\n**Inside an ISA:**\nAll growth compounds without deduction. After 20 years: ~£367,000. Zero tax ever.\n\n**Outside an ISA (higher-rate taxpayer):**\nCapital gains tax at 24% on gains above £3,000. Income Tax at 40% on dividends above £500 and interest above £500. Even at exactly the same 6% gross return, the effective after-tax return might be only 3.5–4% once CGT and income tax are modelled annually. After 20 years: ~£286,000.\n\nThe ISA difference: approximately £81,000 — on the same investments, at the same gross return. This is purely from the tax shelter, not from picking better funds or timing the market.\n\nThe lesson: maximising your ISA allowance every year — even in a modest tracker fund — consistently outperforms a larger unsheltered portfolio in a taxable account.',
        },
        {
          title: 'Compound growth worked example — the power of starting early',
          body: 'Assume two investors both plan to retire at 65 and both invest £5,000 per year in a Stocks & Shares ISA at 6% annual return:\n\n**Alice starts at 25:**\n- 40 years of contributions: £200,000 total\n- ISA pot at 65: approximately £820,000\n\n**Bob starts at 35:**\n- 30 years of contributions: £150,000 total\n- ISA pot at 65: approximately £420,000\n\nAlice invested only £50,000 more than Bob but ends up with £400,000 more — purely from starting 10 years earlier. The first decade of compounding is the most powerful because those early pounds have the longest time to compound.\n\nThis is why even small ISA contributions in your 20s — even if you cannot max out the £20,000 — are disproportionately valuable. Time in the market, protected from tax, is the most reliable wealth-building strategy available.',
        },
        {
          title: 'ISA vs pension — which should you prioritise?',
          body: 'This is one of the most common personal finance questions. The answer depends on your tax rate and circumstances:\n\n**Always take employer pension contributions first.** If your employer matches salary sacrifice, every unmatched pound is leaving your payslip unclaimed. This beats any ISA return.\n\n**After employer matching:**\n- *Higher-rate taxpayer:* Pension contributions attract 40% tax relief (government adds £66 for every £100 you save). An ISA has no relief on contributions. Pension wins for pure tax efficiency — though the pension is locked until 57+.\n- *Basic-rate taxpayer:* Pension gets 20% relief. ISA gets none but allows flexible access. If you might need the money before retirement, ISAs win on flexibility.\n- *LISA (self-employed or first-time buyer):* The 25% bonus beats basic-rate pension relief and the money can access earlier (first home or age 60). For basic-rate taxpayers who cannot access a workplace pension, a LISA can be more valuable.\n\n**Rule of thumb:** Max employer pension contributions, then max ISA, then top up pension for higher-rate relief. Revisit annually as income changes.',
        },
        {
          title: 'ISA transfers — moving without losing tax-free status',
          body: 'You can transfer an ISA to a different provider at any time. Transfers preserve your tax-free status — the transferred amount does not count as a new contribution. Always use the official transfer process:\n\n1. Apply to the new provider directly — they initiate the transfer.\n2. Never withdraw and redeposit — that counts as a new contribution (you may not have allowance left).\n3. Transfer timescales: Cash ISA to Cash ISA ≤ 15 working days; Stocks & Shares ISA transfers may take longer as investments need to be sold or re-registered.\n\nSince April 2024 you can also pay into multiple ISAs of the same type simultaneously. This means you no longer need to transfer to a competitor to earn their rates — you can split contributions across multiple providers within the same year.\n\n**LISA caution:** A LISA can only be transferred to another LISA provider. Transferring to a non-LISA ISA triggers the 25% withdrawal penalty on the full LISA balance — avoid this unless you have exhausted other options.',
        },
      ]}
    >
      <IsaClient />
    </CalcPageShell>
  );
}
