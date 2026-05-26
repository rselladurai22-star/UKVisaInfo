import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import MarriageAllowanceClient from './MarriageAllowanceClient';

export const metadata: Metadata = {
  title: 'Marriage Allowance Calculator 2026/27 — £252/yr + 4-Year Backdate up to £1,260',
  description:
    'Free UK Marriage Allowance calculator for 2026/27. Transfer £1,260 of Personal Allowance to your basic-rate-tax partner and save £252 per year. Backdate up to 4 years for a one-off £1,260 windfall. Instant eligibility check.',
  alternates: { canonical: '/marriage-allowance-calculator' },
  openGraph: {
    title: 'Marriage Allowance Calculator 2026/27',
    description:
      'Check eligibility, calculate the £252 annual saving and model a 4-year backdate. Free, instant, no sign-up.',
    url: 'https://ukvisainfo.co.uk/marriage-allowance-calculator',
  },
};

const FAQS = [
  {
    q: 'What is Marriage Allowance?',
    a: 'Marriage Allowance lets a lower-earning spouse or civil partner transfer £1,260 of their unused Personal Allowance to their partner. This reduces the higher earner\'s Income Tax bill by £252 per year (£1,260 × 20% basic rate). It is a permanent benefit that auto-renews each tax year once set up — you apply once via gov.uk/marriage-allowance.',
  },
  {
    q: 'How much can I save with Marriage Allowance in 2026/27?',
    a: 'The fixed saving is £252 per year in 2026/27. The transfer amount is £1,260 (10% of the Personal Allowance of £12,570, rounded to the nearest £10), and the saving is that amount multiplied by the 20% basic rate. If you backdate 4 prior years you can collect up to £1,260 as a one-off payment on top of the annual saving.',
  },
  {
    q: 'Who qualifies for Marriage Allowance?',
    a: 'Three conditions must all be met: (1) you are married or in a registered civil partnership; (2) the lower earner\'s income is below the Personal Allowance of £12,570 for the year in question; and (3) the higher earner\'s income is between £12,571 and £50,270, meaning they pay only basic-rate Income Tax. If the higher earner pays higher or additional rate tax (income above £50,270), they do not qualify — but they may qualify for the older Married Couple\'s Allowance.',
  },
  {
    q: 'Can I backdate a Marriage Allowance claim?',
    a: 'Yes. HMRC allows you to backdate to any of the 4 prior tax years in which you both met the eligibility criteria. For a claim made in 2026/27 you can backdate to 2022/23, 2023/24, 2024/25 and 2025/26, in addition to the current year. Each backdated year adds £252 to your refund. A full 4-year backdate plus the current year equals £1,260. HMRC pays backdated amounts by cheque or bank transfer — they do not adjust prior tax codes.',
  },
  {
    q: 'How do I apply for Marriage Allowance?',
    a: 'The lower earner applies via gov.uk/apply-marriage-allowance using their Government Gateway account — it takes around 10 minutes. HMRC then adjusts the higher earner\'s PAYE tax code automatically (their code gains an "M" suffix). There is no need to file a Self Assessment return just to claim Marriage Allowance, though if you already file one you can include the claim there.',
  },
  {
    q: 'What if my circumstances change — can I cancel the transfer?',
    a: 'Yes. If the lower earner\'s income rises above £12,570 mid-year, or the higher earner starts paying higher-rate tax, you should cancel for the next tax year. The current year\'s transfer runs to 5 April regardless. To cancel, the lower earner contacts HMRC via their Personal Tax Account or calls 0300 200 3300. The higher earner\'s tax code then reverts at the start of the new tax year.',
  },
  {
    q: 'Does Marriage Allowance apply to civil partnerships?',
    a: 'Yes, fully. The rules are identical for civil partners. Unmarried couples who cohabit but are neither married nor in a civil partnership do not qualify, regardless of how long they have lived together.',
  },
  {
    q: 'What is the difference between Marriage Allowance and Married Couple\'s Allowance?',
    a: 'They are entirely separate benefits. Marriage Allowance is for couples of any age where one earner is below the Personal Allowance. Married Couple\'s Allowance (MCA) is an older, higher-value relief available only where at least one partner was born before 6 April 1935. MCA gives a minimum 10% tax reducer of £4,280 (2026/27), worth up to £428 per year — much more than Marriage Allowance. You cannot claim both in the same year.',
  },
  {
    q: 'Can both partners work and still claim Marriage Allowance?',
    a: 'Yes — the lower earner can have a job as long as their total taxable income (salary, interest, rental income) stays below £12,570 for the year. This commonly applies to part-time workers, carers, students, and those with small self-employment income. The lower earner\'s income cannot be negative — if they have a trading loss it does not create additional allowance to transfer.',
  },
  {
    q: 'What if my spouse has died — can I still claim?',
    a: 'Yes. A surviving spouse can backdate a Marriage Allowance claim on behalf of a deceased partner for all qualifying years, up to the 4-year backdating limit. The refund is paid to the surviving spouse\'s estate or directly to them. HMRC may require evidence of the marriage and the deceased partner\'s income for each backdated year.',
  },
];

export default function MarriageAllowancePage() {
  return (
    <CalcPageShell
      url="/marriage-allowance-calculator"
      eyebrow="Marriage Allowance · UK · 2026/27"
      title="Is the £252 Marriage Allowance worth claiming?"
      deck="If one partner earns below £12,570 and the other pays only basic-rate tax, you can transfer £1,260 of Personal Allowance — saving £252 a year. Backdate up to 4 prior tax years for a one-off refund of up to £1,260 on top."
      verified="gov.uk/marriage-allowance"
      editorVerified="May 2026"
      methodology={{
        summary:
          'The annual saving is calculated by multiplying the statutory transfer amount (£1,260 — 10% of the Personal Allowance rounded to the nearest £10) by the 20% basic rate of Income Tax, giving £252. Eligibility thresholds use the 2026/27 Personal Allowance (£12,570) and basic-rate limit (£50,270) published by HMRC. Backdated savings use the transfer amount and rate applicable in each prior tax year — all four qualifying years (2022/23–2025/26) currently share the same £252 saving, so a full 4-year backdate yields £1,008.',
        govUrl: 'https://www.gov.uk/marriage-allowance',
        govLabel: 'gov.uk — Marriage Allowance',
      }}
      faqs={FAQS}
      sidebar={{
        keyRates: [
          { label: 'Annual saving', value: '£252', sub: '£1,260 × 20% basic rate', accent: '#0F766E' },
          { label: 'Maximum transfer', value: '£1,260', sub: '10% of Personal Allowance £12,570' },
          { label: 'Lower earner income cap', value: '£12,570', sub: 'Must earn below Personal Allowance' },
          { label: 'Higher earner band', value: '£12,571–£50,270', sub: 'Basic-rate only — higher rate disqualifies' },
          { label: 'Max backdate saving', value: '£1,008', sub: '4 prior years × £252 (plus current = £1,260)' },
        ],
        dates: [
          { date: '31 Jan', desc: 'Self Assessment deadline if claiming backdate via SA return', urgent: true },
          { date: '5 Apr', desc: 'Apply before year-end to include that year in the claim', urgent: false },
          { date: '4 yrs', desc: 'Maximum backdate — to 2022/23 from a 2026/27 claim', urgent: false },
        ],
        tips: [
          { heading: 'Apply online in under 10 minutes', body: 'Apply at gov.uk/apply-marriage-allowance using your Government Gateway account. HMRC adjusts the higher earner\'s tax code automatically — nothing further to do.' },
          { heading: 'It auto-renews every year', body: 'Once set up, the transfer continues each tax year without reapplying. You only need to act if circumstances change (e.g. income rises above £12,570).' },
          { heading: 'Civil partnerships qualify equally', body: 'The rules are identical for married couples and civil partners. Cohabiting couples do not qualify unless they marry or form a civil partnership.' },
          { heading: 'Backdated refunds arrive by cheque', body: 'HMRC pays backdated Marriage Allowance as a one-off payment to the higher earner — typically within 4–8 weeks of a successful claim.' },
        ],
        govLink: 'gov.uk/marriage-allowance',
        govLabel: 'gov.uk — Marriage Allowance',
      }}
      related={[
        { href: '/take-home-pay', title: 'Take-home pay calculator', desc: 'See both partners\' net salary after tax and NI.' },
        { href: '/self-assessment-calculator', title: 'Self Assessment estimator', desc: 'Model backdated Marriage Allowance on your SA return.' },
        { href: '/salary-sacrifice-calculator', title: 'Salary sacrifice calculator', desc: 'Reduce income below £12,570 to qualify as the lower earner.' },
      ]}
      educational={[
        {
          title: 'What is Marriage Allowance and how does the £252 work?',
          body: 'Every UK taxpayer gets a Personal Allowance — the amount of income they can earn before paying Income Tax. In 2026/27 that is £12,570. If one partner earns less than this, they have unused allowance sitting idle. Marriage Allowance lets them "donate" £1,260 of that unused allowance to their partner.\n\nWhen the higher earner receives the extra £1,260 allowance, their taxable income falls by £1,260 — and since they pay basic rate (20%) on that income, their tax bill falls by £252 (£1,260 × 20%). That is the fixed annual saving. It does not matter whether the higher earner earns £15,000 or £50,000 — the saving is always exactly £252 per year, because the transfer amount and the rate are both fixed.',
        },
        {
          title: 'Who qualifies — the three eligibility tests',
          body: '**Test 1 — relationship:** You must be married or in a registered civil partnership. Cohabiting couples, regardless of how long they have been together or whether they have children, do not qualify.\n\n**Test 2 — lower earner\'s income:** Their total taxable income (salary, self-employment profit, rental income, savings interest, dividends) must be below £12,570 for the tax year. Part-time workers, carers, students, and those who have retired or taken a career break typically meet this test.\n\n**Test 3 — higher earner\'s Income Tax rate:** They must pay only basic-rate Income Tax. Their income must be between £12,571 and £50,270. If they earn more than £50,270 they become a higher-rate taxpayer and are excluded from Marriage Allowance — but they will almost certainly qualify for the higher-value Married Couple\'s Allowance if either partner was born before 6 April 1935.',
        },
        {
          title: 'Backdating — how to claim up to £1,008 in one go',
          body: 'Many couples who met the eligibility criteria for years never knew Marriage Allowance existed. HMRC allows you to backdate claims to any of the 4 prior tax years in which you both qualified.\n\n| Tax year | Max saving |\n|---|---|\n| 2022/23 | £252 |\n| 2023/24 | £252 |\n| 2024/25 | £252 |\n| 2025/26 | £252 |\n| 2026/27 (current) | £252 |\n| **Full backdate + current year** | **£1,260** |\n\nBackdated amounts do not go through the higher earner\'s tax code. Instead, HMRC pays the refund directly to the higher earner — typically by cheque or bank transfer within 4–8 weeks. You can claim via the online form or include it on a Self Assessment return if you file one.\n\nImportant: both partners must have met the income criteria in each year being backdated. If the lower earner had a job paying above £12,570 in 2022/23 but was below it from 2023/24 onwards, only the qualifying years can be claimed.',
        },
        {
          title: 'Worked example: dual working couple',
          body: 'Emma earns £9,000 a year from a part-time job. Her husband Daniel earns £35,000. Both are basic-rate taxpayers — Daniel pays Income Tax, Emma does not (her income is below the £12,570 Personal Allowance).\n\n- Emma transfers £1,260 of her Personal Allowance to Daniel\n- Daniel\'s effective Personal Allowance rises from £12,570 to £13,830\n- Daniel\'s taxable income falls from £22,430 to £21,170\n- Daniel\'s Income Tax falls by £252\n\nEmma\'s Income Tax: still £0 (her remaining allowance of £11,310 still covers her £9,000 income). They apply in 2026/27 and backdate 4 years — total one-off refund = £1,008, plus £252 per year going forward.',
        },
        {
          title: 'Should you claim if the higher earner earns close to £50,270?',
          body: 'Yes — right up to £50,270. The key question is whether any income falls above £50,270. If Daniel\'s income is £49,000, he is a basic-rate taxpayer and qualifies. If a bonus pushes him to £51,000 in one year, Marriage Allowance cannot be claimed for that year (or must be cancelled if already set up).\n\nFor those who hover near £50,270, it is worth watching your P60 carefully each year. If your income fluctuates, you may qualify in some years but not others. HMRC allows you to cancel the transfer for any future year if circumstances change.',
        },
        {
          title: 'Marriage Allowance vs Married Couple\'s Allowance — which applies to you?',
          body: 'These are two entirely separate, mutually exclusive reliefs:\n\n**Marriage Allowance** — available to all married couples and civil partners where the income eligibility criteria are met. Saves £252 per year. No age restriction. Applies from 2015/16 onwards.\n\n**Married Couple\'s Allowance (MCA)** — only available where at least one spouse or civil partner was born before 6 April 1935. Far more valuable: minimum tax reducer of £428 per year (10% of £4,280 in 2026/27), with a maximum of £1,108. The higher earner can transfer unused MCA to their partner at 10% of the amount.\n\nIf one partner was born before 6 April 1935, claim MCA instead — it is worth at least £176 more per year than Marriage Allowance. You cannot claim both.',
        },
        {
          title: 'What happens after you apply — and when to cancel',
          body: 'Once HMRC processes your application (usually within 1–2 weeks), the higher earner\'s PAYE tax code changes. Their code gains an "M" suffix (e.g. 1383M instead of 1257L), reflecting the extra £1,260 of Personal Allowance. Their employer applies the new code automatically — no action needed.\n\nThe transfer auto-renews each April unless you cancel. Cancel if:\n- The lower earner\'s income rises above £12,570\n- The higher earner starts earning above £50,270 or moves to higher-rate tax\n- You divorce or dissolve a civil partnership\n\nCancel via the lower earner\'s Personal Tax Account or by calling HMRC on 0300 200 3300. Cancellation takes effect from the start of the next tax year.',
        },
      ]}
    >
      <MarriageAllowanceClient />
    </CalcPageShell>
  );
}
