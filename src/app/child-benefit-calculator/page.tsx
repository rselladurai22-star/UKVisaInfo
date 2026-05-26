import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import ChildBenefitClient from './ChildBenefitClient';

export const metadata: Metadata = {
  title: 'Child Benefit Calculator 2025/26 — HICBC Taper, Opt-Out & NI Credits',
  description:
    'Free UK Child Benefit calculator. Find your weekly and annual entitlement, see how the HICBC £60,000–£80,000 taper claws it back, and model pension contributions to reduce or eliminate the charge. Instant results, no sign-up.',
  alternates: { canonical: '/child-benefit-calculator' },
  openGraph: {
    title: 'Child Benefit Calculator — HICBC, Pension Reduction & Opt-Out Tool',
    description:
      'Calculate your net Child Benefit after the High Income Charge and see whether pension sacrifice can wipe out the clawback.',
    url: 'https://ukvisainfo.co.uk/child-benefit-calculator',
  },
};

const FAQS = [
  {
    q: 'How much is Child Benefit in 2025/26?',
    a: 'Child Benefit pays £25.60 per week for the eldest or only qualifying child (£1,331.20 per year) and £16.95 per week for each additional qualifying child (£881.40 per year). So a family with two children receives £42.55 per week, or £2,212.60 per year. Rates are usually uprated each April in line with September\'s Consumer Prices Index (CPI) figure.',
  },
  {
    q: 'What is the High Income Child Benefit Charge (HICBC)?',
    a: 'The HICBC is a Self Assessment Income Tax charge levied on whichever partner in a household has the higher adjusted net income if that income exceeds £60,000. The charge tapers in at 1% of the Child Benefit received for every £200 of income above £60,000. At £80,000 of adjusted net income the charge equals 100% of the gross benefit — the family effectively receives nothing net. Above £80,000 the charge is capped at the benefit amount; it never exceeds what you receive.',
  },
  {
    q: 'Should I opt out of Child Benefit if I earn over £80,000?',
    a: 'If your adjusted net income is firmly above £80,000 and is unlikely to fall below that threshold this year, opting out of the payment removes the Self Assessment compliance burden. However, you should still register for Child Benefit (claim it but select the opt-out option). Registering protects National Insurance credits for any carer who is not working or has no other NI contributions — each credit year counts toward your State Pension.',
  },
  {
    q: 'What is adjusted net income (ANI) for HICBC purposes?',
    a: 'Adjusted net income is not the same as your P60 salary. It is your total taxable income (salary, bonus, dividends, rental profit, savings interest) minus: gross pension contributions (including salary sacrifice), Gift Aid donations grossed up by ×1.25, and trading losses. The most powerful lever is pension contributions — a £10,000 pension contribution reduces ANI by £10,000, potentially shifting you from 100% clawback to 50% or eliminating the charge entirely.',
  },
  {
    q: 'How can pension contributions reduce my Child Benefit charge?',
    a: 'Pension contributions — whether via salary sacrifice, Relief at Source personal contributions to a SIPP, or employer scheme — directly reduce your adjusted net income for HICBC purposes. Example: your gross income is £70,000 and you pay £10,000 into a pension. ANI falls to £60,000 — the HICBC threshold — and your charge drops from 50% to 0%. You save the Child Benefit you were losing AND receive the pension tax relief. Our calculator models this: enter your pension contribution in "Pension contribution (gross)" to see the instant effect on the clawback percentage.',
  },
  {
    q: 'What NI credits does registering for Child Benefit provide?',
    a: 'Registering for Child Benefit (even while opting out of payment) automatically awards Specified Adult Childcare credits — a full Class 3 NI credit — for each week you are the main carer of a child under 12 and do not have another qualifying NI contribution that week. Each credit year counts exactly the same as a year of paid employment for New State Pension purposes. With 35 qualifying years needed for the full State Pension (£230.25/week in 2025/26), missing years due to a career break can be extremely costly. Many parents who opt out of Child Benefit payments forget to register at all — this is a common and expensive mistake.',
  },
  {
    q: 'Does the HICBC apply if both parents earn over £60,000?',
    a: 'Yes. The charge applies to whichever partner has the higher adjusted net income, regardless of whether the other also earns above the threshold. If Partner A earns £75,000 and Partner B earns £65,000, Partner A bears the HICBC on the full Child Benefit claimed. The household cannot split the charge between them — it falls entirely on the higher earner. This means that in a household where both earn above £80,000, the family receives zero net benefit.',
  },
  {
    q: 'Can I backdate a Child Benefit claim?',
    a: 'Yes. HMRC allows claims to be backdated by up to 3 months. This means if your child was born (or came to live with you) in January, you can claim from the following October at the earliest if you apply in January of the next year. Unlike Marriage Allowance, there is no 4-year backdate for Child Benefit — so it is important to claim promptly after a qualifying event.',
  },
  {
    q: 'Who can claim Child Benefit and for how long?',
    a: 'Any person responsible for a qualifying child can claim — the child must normally live with you or you must be contributing to the child\'s financial upkeep. The child must be under 16, or under 20 if they are in approved education or training (full-time non-advanced courses such as A-levels, Scottish Highers, or NVQ Level 1–3). Child Benefit stops on the 31 August following the child\'s 16th birthday unless they remain in approved education.',
  },
  {
    q: 'Is Child Benefit taxable income?',
    a: 'Child Benefit itself is not taxable income — you do not pay Income Tax directly on it. The HICBC is a separate Income Tax charge paid through Self Assessment; it is not a deduction from the benefit payment itself. This is an important distinction: if you receive Child Benefit and your ANI exceeds £60,000, you must register for Self Assessment by 5 October after the end of the tax year and pay the HICBC by 31 January.',
  },
];

export default function ChildBenefitPage() {
  return (
    <CalcPageShell
      url="/child-benefit-calculator"
      eyebrow="Child Benefit · UK · 2025/26"
      title="How much Child Benefit are you actually keeping after HICBC?"
      deck="Child Benefit pays £25.60/week for the eldest child and £16.95 for each additional child. If either partner earns above £60,000, the High Income Charge tapers it back — wiping it out entirely at £80,000. Pension contributions can eliminate the charge."
      verified="gov.uk/child-benefit"
      editorVerified="May 2026"
      methodology={{
        summary:
          'Weekly benefit rates use HMRC\'s published 2024/25 Child Benefit rates (£25.60 eldest, £16.95 additional) multiplied by 52 for annual figures. The HICBC taper uses the thresholds in force from 6 April 2024 (lower: £60,000, upper: £80,000) as legislated in Finance Act 2024. The clawback percentage is computed as the floor of (adjusted net income − £60,000) ÷ 200, capped at 100. Adjusted net income deducts gross pension contributions and Gift Aid donations (grossed up at ×1.25) from total taxable income, following HMRC\'s EIM22000 guidance. Rates are updated each April — verify current rates at gov.uk/child-benefit/what-youll-get.',
        govUrl: 'https://www.gov.uk/child-benefit',
        govLabel: 'gov.uk — Child Benefit',
      }}
      faqs={FAQS}
      sidebar={{
        keyRates: [
          { label: 'First / only child', value: '£25.60/wk', sub: '£1,331.20 per year', accent: '#0F766E' },
          { label: 'Each additional child', value: '£16.95/wk', sub: '£881.40 per year', accent: '#0F766E' },
          { label: 'HICBC taper starts', value: '£60,000', sub: 'Adjusted net income (ANI)' },
          { label: 'Full clawback at', value: '£80,000', sub: '1% per £200 above £60k' },
          { label: 'Taper window', value: '£20,000', sub: 'From £60k → £80k over 100 steps' },
        ],
        dates: [
          { date: '5 Oct', desc: 'Register for Self Assessment if HICBC applies to you this year', urgent: false },
          { date: '31 Jan', desc: 'Pay HICBC via Self Assessment — same deadline as tax return', urgent: true },
          { date: '3 mths', desc: 'Maximum Child Benefit backdate from application date', urgent: false },
        ],
        tips: [
          { heading: 'Pension contributions reduce HICBC', body: 'Salary sacrifice or personal pension contributions reduce your adjusted net income directly — potentially dropping you below £60k and eliminating the charge entirely, while also getting pension tax relief.' },
          { heading: 'Always register, even if opting out', body: 'Claiming Child Benefit (selecting opt-out of payment) protects your NI credits as a carer — each credit year counts toward the 35 years needed for the full State Pension.' },
          { heading: 'HICBC goes on a Self Assessment return', body: 'If your ANI exceeds £60,000, you must file a Self Assessment return and pay the charge by 31 January. Failure attracts late-filing penalties even if your employer already deducts your income tax via PAYE.' },
          { heading: 'Gift Aid donations also reduce ANI', body: 'Every £1 of Gift Aid cash donations is grossed up by ×1.25 when reducing adjusted net income, so a £1,000 Gift Aid donation reduces your ANI by £1,250 — an additional lever alongside pension contributions.' },
        ],
        govLink: 'gov.uk/child-benefit',
        govLabel: 'gov.uk — Child Benefit',
      }}
      related={[
        { href: '/take-home-pay', title: 'Take-home pay calculator', desc: 'Confirm your adjusted net income and see your full net salary.' },
        { href: '/salary-sacrifice-calculator', title: 'Salary sacrifice calculator', desc: 'Model pension sacrifice to bring adjusted net income below £60,000.' },
        { href: '/self-assessment-calculator', title: 'Self Assessment estimator', desc: 'Declare and pay the HICBC via your Self Assessment return.' },
      ]}
      educational={[
        {
          title: 'How Child Benefit works and who can claim',
          body: 'Child Benefit is a universal payment from HMRC to anyone responsible for a qualifying child — it does not depend on employment, tax status, or National Insurance history. You are eligible if a child under 16 (or under 20 in approved education or training) normally lives with you or you pay toward their upkeep.\n\nFor 2024/25 the weekly rates are £25.60 for the eldest or only qualifying child and £16.95 for each additional child. A family with three children therefore receives £25.60 + £16.95 + £16.95 = £59.50 per week (£3,094 per year). Claims can be backdated up to 3 months, so it is important to register promptly after a birth, adoption, or a child coming to live with you.\n\nEither parent in a couple can claim — the payment is made to the named claimant, but the High Income Child Benefit Charge (HICBC), if applicable, falls on whichever partner has the higher adjusted net income.',
        },
        {
          title: 'The HICBC taper — the £252-per-£200 clawback mechanic',
          body: 'The High Income Child Benefit Charge is one of the most misunderstood features of the UK tax system. Here is the precise mechanic:\n\n1. HICBC applies to whichever partner has the higher **adjusted net income** (ANI) if ANI exceeds **£60,000**.\n2. The charge is **1% of Child Benefit received for every £200 of income above £60,000**.\n3. At £80,000, the charge reaches 100% — no net benefit.\n4. Above £80,000, the charge cannot exceed the gross benefit received.\n\n**Example — family with 2 children, higher earner ANI £72,000:**\n- Gross annual benefit: £25.60 + £16.95 = £42.55/week × 52 = £2,212.60\n- ANI above threshold: £72,000 − £60,000 = £12,000\n- Clawback steps: £12,000 ÷ £200 = 60\n- HICBC: 60% of £2,212.60 = £1,327.56 — declared via Self Assessment\n- Net benefit kept: £2,212.60 − £1,327.56 = £885.04\n\nThe family still comes out ahead — £885 net is better than nothing. Opting out would save the SA filing but sacrifice £885.',
        },
        {
          title: 'Pension contributions: the most powerful lever against HICBC',
          body: 'Your adjusted net income for HICBC purposes is your gross taxable income minus:\n- Gross pension contributions (including both employee contributions and salary sacrifice)\n- Gift Aid donations grossed up at ×1.25\n- Trading losses\n\nThis makes pension contributions an extraordinarily powerful tool. Every £1 you put into a pension reduces your ANI by £1 — potentially shifting you down the taper or out of it entirely.\n\n**Worked example:**\n- Higher earner gross income: £68,000\n- Without pension contributions: ANI = £68,000 → HICBC at 40% of gross benefit\n- Pension contribution of £8,000: ANI falls to £60,000 → HICBC = £0\n\nThe family eliminates the clawback AND gains higher-rate pension tax relief on the contribution (effective cost to take-home pay is only £4,800 for an £8,000 gross pension contribution at 40% tax). This is a scenario where pension sacrifice is, effectively, free money.\n\nUse our **Salary Sacrifice Calculator** to model the take-home impact before adjusting your pension contribution.',
        },
        {
          title: 'NI credits — why you should always register, even if opting out',
          body: 'This is the most commonly missed piece of advice for high-earning parents:\n\n**If either parent is not working or is earning below the Lower Earnings Limit (£6,396 in 2024/25), registering for Child Benefit — even while opting out of the payment — automatically awards them National Insurance credits.**\n\nThese are called Specified Adult Childcare credits (for family members caring for a child while the parent works) or simply Child Benefit NI credits. Each credit year counts identically to a year of paid employment toward the 35 qualifying years required for the full New State Pension (£230.25/week in 2025/26).\n\nThe value of each missed NI credit year at State Pension age:\n- A full qualifying year adds 1/35 of the full State Pension\n- That is £230.25 ÷ 35 = **£6.58 per week for life** — or around **£342 per year**\n- Over a 20-year retirement, one missed NI credit year costs approximately **£6,800**\n\nFamilies where one parent takes time out of work to care for children and does not register for Child Benefit can lose many thousands of pounds of State Pension entitlement — far more than the HICBC ever cost them. The fix is simple: claim Child Benefit, tick the opt-out box, never make a payment.',
        },
        {
          title: 'Opt-in vs opt-out decision guide',
          body: 'Here is a simple decision framework:\n\n**ANI below £60,000 (either partner):** Claim and receive payment. No HICBC. No SA filing required just for Child Benefit.\n\n**ANI £60,001–£79,999:** Claim and receive payment. Pay HICBC via Self Assessment. You still retain a net positive benefit — the family receives between 1% and 99% of gross Child Benefit as net income. Pension sacrifice may reduce or eliminate the charge.\n\n**ANI £80,000+ and you hate SA admin:** Consider opting out of the payment (no HICBC, no SA needed for Child Benefit). BUT still register to protect NI credits for the non-working or lower-earning partner.\n\n**ANI £80,000+ and you want to model each year:** Claim and pay the full HICBC. Net benefit = £0. Value = NI credits only. Decide each year whether it is worth the SA compliance.\n\n**Key rule:** Never fail to register entirely. Registering costs nothing, protects NI credits, and allows you to start receiving payments immediately if ANI drops below £60,000 in a future year.',
        },
        {
          title: 'Adjusted net income — what counts and what does not',
          body: 'Adjusted net income (ANI) is used for several HMRC calculations — HICBC, personal allowance tapering (above £100,000), and pension annual allowance tapering (above £260,000). For most Child Benefit claimants the relevant components are:\n\n**Included in ANI (increases it):**\n- Employment income (P60 gross pay including benefits in kind)\n- Self-employment profit\n- Dividends received (including dividends from your own company)\n- Rental profit\n- Savings interest above the Personal Savings Allowance\n- State benefits that are taxable (e.g. the state pension)\n\n**Deducted from ANI (reduces it):**\n- Gross employee pension contributions (Relief at Source: gross up your net payment by ÷0.8)\n- Salary sacrifice pension contributions (already excluded from gross pay)\n- Gift Aid donations × 1.25\n- Trading losses\n\n**Not deducted from ANI:**\n- Employer pension contributions (these never count as your income anyway)\n- ISA withdrawals (non-taxable)\n- Tax-free elements of salary (e.g. first 25% pension drawdown)\n\nOur calculator lets you enter salary, pension contributions, and Gift Aid to compute ANI and the resulting HICBC automatically.',
        },
      ]}
    >
      <ChildBenefitClient />
    </CalcPageShell>
  );
}
