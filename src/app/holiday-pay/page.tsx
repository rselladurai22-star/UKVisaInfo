import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import HolidayPayClient from './HolidayPayClient';

export const metadata: Metadata = {
  title: 'UK Holiday Pay Calculator 2026 — 5.6 Weeks, 12.07%, Pro-Rata & Rolled-Up Pay',
  description:
    'Free UK holiday entitlement calculator. Statutory 5.6 weeks for regular-hours workers, 12.07% accrual for irregular hours, zero-hours and part-year workers (Harpur Trust reform, April 2024). Includes pay value, bank holiday rules and carry-over.',
  alternates: { canonical: '/holiday-pay' },
  openGraph: {
    title: 'UK Holiday Pay Calculator 2026',
    description:
      'Calculate statutory leave entitlement for any work pattern — full-time, part-time, zero-hours and part-year workers.',
    url: 'https://ukvisainfo.co.uk/holiday-pay',
  },
};

const FAQS = [
  {
    q: 'How much statutory holiday am I entitled to in the UK?',
    a: 'All workers are entitled to 5.6 weeks of paid holiday per year under the Working Time Regulations 1998. For a 5-day-per-week worker this equals 28 days (5 × 5.6). This is the statutory minimum — your employer can offer more in your contract. Part-time workers receive the same 5.6 weeks but proportional to the days they work: a 3-day week worker gets 16.8 days per year.',
  },
  {
    q: 'What is the 12.07% holiday pay rule and who does it apply to?',
    a: 'The 12.07% method is used to calculate accrued holiday entitlement for workers with irregular or variable hours — zero-hours, part-year, and agency workers. Holiday accrues at 12.07% of hours actually worked in each pay period. This percentage derives from 5.6 ÷ (52 − 5.6) = 12.07%. From 1 April 2024, following the Harpur Trust v Brazel Supreme Court case and subsequent legislative reform, this method was reinstated as the correct approach for irregular-hours and part-year workers.',
  },
  {
    q: 'What did the Harpur Trust v Brazel ruling change?',
    a: 'The Supreme Court ruled in Harpur Trust v Brazel [2022] that the 12.07% method was unlawful for part-year workers who worked a fixed pattern (e.g. term-time only teachers). The ruling required employers to calculate holiday based on average pay over 52 weeks, which produced proportionally more leave for part-year workers. Parliament subsequently legislated (from 1 April 2024) to reinstate the 12.07% accrual method specifically for irregular-hours and part-year workers under TUPE-style "worker" contracts — effectively reversing the practical outcome for most irregular-hours workers.',
  },
  {
    q: 'Are bank holidays included in the 28-day entitlement?',
    a: 'Statutory entitlement of 28 days is inclusive of bank holidays — there is no legal right to bank holidays on top. In England and Wales there are 8 bank holidays per year. Many employment contracts grant 20 days annual leave plus 8 bank holidays = 28 days, which happens to match the statutory minimum. If your contract says "20 days plus bank holidays" you are entitled to 28 days. If it says "28 days inclusive of bank holidays" the same applies. Some employers offer 25+ days plus bank holidays — that is a contractual benefit above the statutory floor.',
  },
  {
    q: 'How is holiday pay calculated for variable-pay workers?',
    a: 'For workers with variable pay (overtime, commission, regular bonuses), holiday pay must reflect "normal remuneration" — not just basic salary. Since the Employment Tribunal judgment in Bear Scotland v Fulton [2014], overtime that is regular and part of normal working must be included in holiday pay. The method: average the 52 weeks of actual pay immediately before the leave is taken (or the last 52 weeks in which pay was earned). Non-guaranteed overtime, regular commission, and shift allowances are all typically included.',
  },
  {
    q: 'What is rolled-up holiday pay and is it legal?',
    a: 'Rolled-up holiday pay means paying an additional percentage (12.07%) on top of each payslip to cover future holiday entitlement, rather than paying when leave is actually taken. From 1 April 2024, rolled-up holiday pay is legal again for irregular-hours and part-year workers. It must: (1) be a genuine addition, not hidden within the basic hourly rate; (2) be clearly itemised on each payslip; and (3) only be used for irregular-hours or part-year workers — not regular, fixed-hours employees.',
  },
  {
    q: 'Can I carry over unused holiday from one year to the next?',
    a: 'Carry-over rules are complex. The first 4 weeks (EU Working Time Directive entitlement) can only be carried over if you could not take it due to sickness, family leave, or statutory reasons — and even then, limits apply. The additional 1.6 weeks (UK-only entitlement) can be carried forward by written agreement with your employer. Any contractual leave above 5.6 weeks is governed entirely by your contract. Most "use it or lose it" clauses are legally enforceable for contractual leave above the statutory minimum.',
  },
  {
    q: 'What happens to untaken holiday when I leave a job?',
    a: 'When employment ends, you are entitled to a payment in lieu of accrued but untaken statutory holiday (holiday pay in lieu). The amount is: (proportion of year worked × 5.6 weeks × weekly pay rate). If you have taken more holiday than you have accrued, your employer can deduct the excess from your final pay — if the contract allows it. Holiday should be calculated pro-rata from your start date to your leaving date.',
  },
  {
    q: 'Can my employer make me take holiday on specific days?',
    a: 'Yes. Employers can require workers to take holiday at specific times by giving notice of at least twice the length of leave required (e.g. 2 weeks\' notice to take 1 week\'s leave). This is commonly used to require workers to take leave during a factory shutdown or Christmas period. Conversely, an employer can refuse a holiday request if proper notice is given to the worker.',
  },
  {
    q: 'Do self-employed and genuinely freelance workers get holiday pay?',
    a: 'No. Only "workers" and "employees" under the Working Time Regulations are entitled to statutory holiday. Genuinely self-employed contractors with no obligation of personal service typically do not qualify. However, if a tribunal finds a contractor is actually a "worker" in law (based on the reality of the working relationship, not the label on the contract), they will be entitled to backdated statutory holiday pay — potentially for several years.',
  },
];

export default function HolidayPayPage() {
  return (
    <CalcPageShell
      url="/holiday-pay"
      eyebrow="Holiday Pay · UK · 2026"
      title="UK Holiday Entitlement Calculator — 5.6 weeks, 12.07% and rolled-up pay explained"
      deck="Every UK worker is entitled to 5.6 weeks of paid leave per year. For irregular hours and zero-hours workers, the 12.07% accrual method applies from April 2024. Enter your work pattern to see your exact entitlement and pay value."
      verified="gov.uk · Working Time Regulations"
      editorVerified="May 2026"
      methodology={{
        summary:
          'For regular-hours workers, entitlement = working days per week × 5.6, capped at 28 days. For irregular-hours and part-year workers, entitlement accrues at 12.07% of hours worked, following the method reinstated by the Employment Rights (Amendment, Revocation and Transitional Provision) Regulations 2023 from 1 April 2024. Holiday pay value uses the lower of the default calculation (annual salary ÷ 52 × 5.6) and the statutory "normal remuneration" 52-week average where variable pay applies. All rules reference the Working Time Regulations 1998 (SI 1998/1833) as amended.',
        govUrl: 'https://www.gov.uk/holiday-entitlement-rights',
        govLabel: 'gov.uk — Holiday entitlement and pay',
      }}
      faqs={FAQS}
      sidebar={{
        keyRates: [
          { label: 'Statutory minimum', value: '5.6 weeks', sub: '28 days for a 5-day week worker', accent: '#0F766E' },
          { label: 'Irregular hours accrual', value: '12.07%', sub: 'Of hours actually worked per pay period' },
          { label: 'Bank holidays (England)', value: '8 days', sub: 'Usually inclusive of the 28-day total' },
          { label: 'Carry-over (EU entitlement)', value: '4 weeks', sub: 'Only if unable to take due to sickness/family leave' },
          { label: 'Maximum statutory leave', value: '28 days', sub: 'Full-time cap; no upper limit for contractual leave' },
        ],
        dates: [
          { date: '1 Apr 2024', desc: 'Harpur Trust reform in force — 12.07% restored for irregular-hours workers', urgent: false },
          { date: 'Leave year', desc: 'Most run 1 Jan–31 Dec or 1 Apr–31 Mar — check your contract', urgent: false },
          { date: '18 months', desc: 'Maximum carry-over for COVID/long-term sickness leave', urgent: false },
        ],
        tips: [
          { heading: 'Request your holiday balance in writing', body: 'Ask HR for your accrued leave balance in writing, especially before resigning. Disputes over entitlement are much easier to resolve with a paper trail.' },
          { heading: 'Rolled-up pay must be itemised', body: 'If your employer pays holiday "rolled up" in your regular payslip, it must be clearly labelled as a holiday pay element — not blended into your hourly rate.' },
          { heading: 'Sick leave accrues holiday', body: 'You continue to accrue statutory holiday entitlement while on sick leave. You can carry over untaken holiday from a sick-leave period into the next leave year.' },
          { heading: 'Variable pay — check your payslips', body: 'If you regularly work overtime or receive commission, your holiday pay should include those elements. If it does not, you may have a claim via an Employment Tribunal.' },
        ],
        govLink: 'gov.uk/holiday-entitlement-rights',
        govLabel: 'gov.uk — Holiday entitlement',
      }}
      related={[
        { href: '/take-home-pay', title: 'Take-home pay calculator', desc: 'See your net pay alongside your leave entitlement.' },
        { href: '/redundancy-pay', title: 'Redundancy pay calculator', desc: 'Holiday pay in lieu is owed on termination — see the full entitlement.' },
        { href: '/maternity-pay', title: 'Maternity pay calculator', desc: 'Holiday accrues during maternity leave — model the full entitlement.' },
      ]}
      educational={[
        {
          title: '5.6 weeks — the statutory minimum and how it is calculated',
          body: 'The Working Time Regulations 1998 (as amended) guarantee every worker in the UK a minimum of 5.6 weeks of paid annual leave per year. For a worker who works 5 days per week, 5.6 weeks × 5 = 28 days. This is the legal cap — you cannot receive more than 28 days of statutory leave regardless of how many days you work per week.\n\nFor part-time workers the same 5.6-week formula applies, just with fewer days per week:\n- 4 days/week: 4 × 5.6 = 22.4 days\n- 3 days/week: 3 × 5.6 = 16.8 days\n- 2 days/week: 2 × 5.6 = 11.2 days\n\nEmployers must not offer less than the statutory minimum, but can offer more — many large employers give 25 or 30 days annual leave, which is entirely above the floor.\n\nImportant: the statutory minimum includes bank holidays (there is no automatic right to bank holidays on top of 5.6 weeks). Most employment contracts specify whether bank holidays are included or additional.',
        },
        {
          title: 'Irregular hours — the 12.07% method and the Harpur Trust case',
          body: 'For workers whose hours are not fixed — zero-hours contracts, part-year workers, agency and casual staff — holiday entitlement cannot be calculated as "5.6 weeks times days per week" because there are no fixed days per week.\n\nThe solution is accrual at **12.07% of hours actually worked**. This percentage comes from:\n\n5.6 ÷ (52 − 5.6) = 5.6 ÷ 46.4 = 12.07%\n\nIn plain terms: for every 100 hours you work, you accrue 12 hours and 4 minutes of holiday entitlement.\n\n**The Harpur Trust v Brazel case (2022):** The Supreme Court ruled that the 12.07% method was unlawful for part-year, fixed-pattern workers (like term-time school staff). The ruling produced higher leave entitlement for part-year workers.\n\n**April 2024 legislative reform:** Parliament subsequently passed regulations reinstating 12.07% specifically for "irregular hours" and "part-year workers" as defined in the amended Working Time Regulations. This effectively restored the 12.07% method for zero-hours and genuine part-year contracts from 1 April 2024 — but the specific definition of who is a "part-year worker" vs a "term-time fixed-pattern worker" remains in development.',
        },
        {
          title: 'Holiday pay rate — what should be included?',
          body: 'Holiday pay must reflect your "normal remuneration" — not just your basic rate. The Employment Tribunal in Bear Scotland v Fulton [2014] established that regular overtime must be included. The ECJ in Williams v British Airways [2011] confirmed that "intrinsically linked" allowances must be included.\n\n**What is typically included:**\n- Basic salary or hourly rate\n- Regular non-guaranteed overtime (if worked regularly)\n- Regular commission (if forming part of normal pay)\n- Shift premium allowances (if regularly worked)\n- Some standby/on-call allowances\n\n**What is typically excluded:**\n- Purely discretionary bonuses\n- Reimbursement of expenses\n- Overtime that is genuinely occasional and non-habitual\n\n**How to calculate it:** Average your earnings over the 52 weeks immediately before your leave (only counting weeks in which you were actually paid). This 52-week reference period was introduced by the Employment Rights (Employment Particulars and Paid Annual Leave) Regulations 2018.\n\nIf your employer pays only basic salary during holiday and you regularly earn more than your basic rate, you may have an underpaid holiday pay claim — potentially recoverable for several years via an Employment Tribunal.',
        },
        {
          title: 'Rolled-up holiday pay — legal for irregular workers from April 2024',
          body: 'Rolled-up holiday pay means incorporating holiday pay into every payslip as an additional percentage, rather than paying it separately when leave is taken. Workers who receive rolled-up pay effectively get an uplift on each payment instead of a separate leave payment.\n\n**Before April 2024:** Rolled-up holiday pay was unlawful following the ECJ ruling in Robinson-Steele v RD Retail Services [2006] — it was considered a method of making workers choose between taking leave and receiving pay.\n\n**From 1 April 2024:** The Employment Rights (Amendment, Revocation and Transitional Provision) Regulations 2023 re-legalised rolled-up holiday pay, but only for:\n- Irregular-hours workers\n- Part-year workers\n\nConditions for valid rolled-up pay:\n1. Must be a genuine addition — not absorbed into the hourly rate\n2. Must be clearly itemised on every payslip as "holiday pay"\n3. The percentage must be at least 12.07% of basic pay\n4. Cannot be used for regular fixed-hours employees\n\nIf you are a fixed-hours employee and your employer is paying rolled-up pay, this is unlawful — your employer must pay you when you take leave.',
        },
        {
          title: 'Carry-over, use-it-or-lose-it, and leaving your job',
          body: '**The two tiers of holiday:**\n\n*Reg. 13 leave (4 weeks / EU entitlement):* Can only be carried over in specific circumstances — long-term sickness, parental leave, or where the employer prevented the worker from taking it. Carry-over must happen in the same leave year or up to 18 months post-illness.\n\n*Reg. 13A leave (1.6 extra weeks / UK-only entitlement):* Can be carried over by written agreement between employer and worker. Many contracts allow this.\n\n*Contractual leave above 5.6 weeks:* Governed entirely by the employment contract — carry-over terms are whatever you and your employer agree.\n\n**Use-it-or-lose-it:** Employers can enforce "use it or lose it" for contractual leave above the statutory minimum, as long as they genuinely allow opportunity to take it. If an employer refuses holiday requests throughout the year and then claws back unused leave at year-end, this is likely unlawful.\n\n**On leaving a job:** You are entitled to a payment in lieu of all accrued but untaken statutory holiday (5.6 weeks × proportion of year worked). If you have taken more holiday than accrued, the contract may allow your employer to deduct the difference from your final pay.',
        },
      ]}
    >
      <HolidayPayClient />
    </CalcPageShell>
  );
}
