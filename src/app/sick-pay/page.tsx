import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import SspClient from './SspClient';
import { SSP_WEEKLY, LEL_WEEKLY, WAITING_DAYS, MAX_WEEKS, RATES_TAX_YEAR } from '../../lib/ssp/calc';

export const metadata: Metadata = {
  title: `UK Statutory Sick Pay (SSP) Calculator ${RATES_TAX_YEAR} — £${SSP_WEEKLY}/week, Eligibility & ESA Bridge`,
  description: `Free UK SSP calculator for ${RATES_TAX_YEAR}. Statutory Sick Pay is £${SSP_WEEKLY}/week paid by your employer after ${WAITING_DAYS} waiting days, for up to ${MAX_WEEKS} weeks. Check eligibility from the £${LEL_WEEKLY}/week Lower Earnings Limit, model occupational sick pay, and see what happens when SSP runs out.`,
  alternates: { canonical: '/sick-pay' },
  openGraph: {
    title: `Statutory Sick Pay (SSP) Calculator ${RATES_TAX_YEAR}`,
    description: `Calculate your SSP entitlement, see the waiting-day rule, and understand the ESA bridge when SSP ends.`,
    url: 'https://ukvisainfo.co.uk/sick-pay',
  },
};

const FAQS = [
  {
    q: `How much is Statutory Sick Pay in ${RATES_TAX_YEAR}?`,
    a: `Statutory Sick Pay (SSP) is £${SSP_WEEKLY} per week in ${RATES_TAX_YEAR}. It is paid by your employer through your normal payroll and is taxed via PAYE just like wages, with National Insurance deducted if earnings are above the threshold. The daily rate is £${SSP_WEEKLY} divided by the number of qualifying days in your working week — for a 5-day worker that is £${(SSP_WEEKLY / 5).toFixed(2)} per day.`,
  },
  {
    q: 'Who qualifies for Statutory Sick Pay?',
    a: `To qualify for SSP you must: (1) be classed as an employee — not self-employed; (2) earn on average at least £${LEL_WEEKLY} per week gross (the Lower Earnings Limit); (3) be sick for at least 4 consecutive qualifying days (the first 3 are unpaid "waiting days"); and (4) have told your employer you are sick within their notification requirements (usually within 7 days). Agency workers and zero-hours employees typically qualify if their average pay meets the LEL.`,
  },
  {
    q: 'What are the 3 waiting days and do they apply to every new spell of sickness?',
    a: `Yes — the first ${WAITING_DAYS} qualifying days of any new period of incapacity are unpaid waiting days. SSP starts on the 4th qualifying day. However, if you have a second sickness spell within 8 weeks (56 days) of returning from the first, both periods are "linked" and treated as a single period of incapacity — meaning you do not serve another set of waiting days for the linked spell.`,
  },
  {
    q: 'How long does SSP last?',
    a: `SSP is payable for up to ${MAX_WEEKS} weeks (196 qualifying days) in a single period of incapacity. Once you have received SSP for 28 weeks, your employer must issue you an SSP1 form explaining that SSP has ended. At that point you may be able to claim Employment and Support Allowance (ESA) or Universal Credit (UC) from DWP.`,
  },
  {
    q: 'What if my employer pays contractual sick pay — does SSP still apply?',
    a: 'If your employment contract includes a contractual sick pay scheme paying more than SSP (e.g. "full pay for 3 months"), SSP is included within it — your employer does not pay SSP on top. If at any point your contractual sick pay drops to less than the SSP rate, your employer must make up the difference to at least SSP level. Contractual sick pay is always a floor-or-above arrangement relative to SSP.',
  },
  {
    q: 'Can I self-certify for sick leave or do I always need a fit note?',
    a: 'For the first 7 calendar days of sickness, you can self-certify using a Self-Certification (SC2) form or a company equivalent — no medical evidence is needed. After 7 calendar days you must provide a fit note (previously called a sick note or Statement of Fitness for Work) from a qualifying healthcare professional: your GP, hospital doctor, nurse, pharmacist, physiotherapist, or occupational therapist.',
  },
  {
    q: 'What happens when SSP ends after 28 weeks?',
    a: 'When SSP ends, your employer must give you an SSP1 form. You can then claim Employment and Support Allowance (ESA) or Universal Credit (UC) from DWP. ESA has two components: a "Work-Related Activity Group" (WRAG) and a "Support Group" for more severe incapacity. You can also claim Personal Independence Payment (PIP) separately from ESA if your illness or disability affects daily living or mobility — PIP is not means-tested and is not affected by income.',
  },
  {
    q: 'Do I accrue holiday entitlement while on sick leave?',
    a: 'Yes — you continue to accrue statutory holiday entitlement (5.6 weeks per year) during sickness absence, regardless of how long you are off. If you cannot take holiday because of illness, the first 4 weeks of statutory holiday can be carried over into the next leave year. When you return, you should discuss taking accrued leave with your employer.',
  },
  {
    q: 'Can my employer dismiss me while I am on sick leave?',
    a: 'Dismissal during sick leave is not automatically unfair, but employers must follow a fair process. If the absence is long-term, they must: obtain medical evidence about prognosis, consider reasonable adjustments, consult with you, and follow the statutory dismissal procedure. Dismissing for short-term, persistent absence also requires fair process. If you are dismissed while on sick leave without fair process, you may have an Unfair Dismissal claim (if employed for 2+ years) or a disability discrimination claim if your illness constitutes a disability under the Equality Act 2010.',
  },
  {
    q: 'What if I am self-employed and too sick to work?',
    a: 'Self-employed workers are not entitled to SSP — it is paid by employers to employees only. Instead, self-employed people who are unable to work due to illness or disability can claim Employment and Support Allowance (ESA) from DWP if they have paid sufficient National Insurance Class 2 or Class 4 contributions. Universal Credit is also available as a means-tested alternative. Some self-employed people also take out income protection insurance policies that pay a percentage of their income during prolonged illness.',
  },
];

export default function SspPage() {
  return (
    <CalcPageShell
      url="/sick-pay"
      eyebrow={`Statutory Sick Pay · ${RATES_TAX_YEAR}`}
      title={`Statutory Sick Pay (SSP) ${RATES_TAX_YEAR} — £${SSP_WEEKLY}/week, waiting days and what happens next`}
      deck={`£${SSP_WEEKLY}/week, paid by your employer from day 4 of illness, for up to ${MAX_WEEKS} weeks. If your contract has better sick pay, SSP is the legal floor. When SSP runs out, ESA or Universal Credit may apply.`}
      verified="gov.uk/statutory-sick-pay"
      editorVerified="May 2026"
      methodology={{
        summary: `SSP entitlement uses HMRC's published rate of £${SSP_WEEKLY}/week for ${RATES_TAX_YEAR}. Eligibility requires average weekly earnings ≥ £${LEL_WEEKLY} (Lower Earnings Limit). The daily rate is £${SSP_WEEKLY} ÷ qualifying days per week. The first ${WAITING_DAYS} qualifying days are unpaid. Maximum entitlement is ${MAX_WEEKS} weeks (${MAX_WEEKS * 7} qualifying days at 5 days/week). Linked spells within 8 weeks (56 days) are treated as a single period. Figures verified against gov.uk/statutory-sick-pay, April 2025.`,
        govUrl: 'https://www.gov.uk/statutory-sick-pay',
        govLabel: 'gov.uk — Statutory Sick Pay',
      }}
      faqs={FAQS}
      sidebar={{
        keyRates: [
          { label: 'SSP weekly rate', value: `£${SSP_WEEKLY}/wk`, sub: `${RATES_TAX_YEAR} — from day 4 of illness`, accent: '#0F766E' },
          { label: 'Daily rate (5-day week)', value: `£${(SSP_WEEKLY / 5).toFixed(2)}/day`, sub: `£${SSP_WEEKLY} ÷ 5` },
          { label: 'Waiting days (unpaid)', value: `${WAITING_DAYS} days`, sub: 'SSP starts on day 4' },
          { label: 'Lower Earnings Limit', value: `£${LEL_WEEKLY}/wk`, sub: 'Must earn this to qualify for SSP' },
          { label: 'Maximum duration', value: `${MAX_WEEKS} weeks`, sub: 'Then SSP1 form → DWP (ESA/UC)' },
        ],
        dates: [
          { date: '7 days', desc: 'Self-certify for the first 7 calendar days — no fit note needed', urgent: false },
          { date: 'Day 8+', desc: 'Fit note required from GP, nurse, pharmacist or physiotherapist', urgent: false },
          { date: '28 weeks', desc: 'SSP exhausted — employer issues SSP1 form; claim ESA or UC from DWP', urgent: true },
        ],
        tips: [
          { heading: 'Linked spells — no second waiting period', body: 'If you return to work and go off sick again within 8 weeks (56 days), the periods are "linked" — you do not serve another 3 unpaid waiting days.' },
          { heading: 'SSP is taxed via PAYE', body: 'SSP counts as income. Tax and National Insurance are deducted by your employer just as from normal wages. It is not a benefit payment.' },
          { heading: 'You still accrue holiday on sick leave', body: 'Statutory holiday (5.6 weeks/year) continues to accrue during sickness absence. Unused leave from a sick period can be carried forward to the next leave year.' },
          { heading: 'Check your contract first', body: 'Many employers offer enhanced sick pay — full pay for weeks or months. SSP is the legal minimum. Always check your staff handbook or employment contract before assuming you will only receive SSP.' },
        ],
        govLink: 'gov.uk/statutory-sick-pay',
        govLabel: 'gov.uk — Statutory Sick Pay',
      }}
      related={[
        { href: '/take-home-pay', title: 'Take-home pay calculator', desc: 'See your normal net pay for comparison with the SSP rate.' },
        { href: '/maternity-pay', title: 'Maternity pay calculator', desc: 'Other statutory pay your employer must provide.' },
        { href: '/redundancy-pay', title: 'Redundancy pay calculator', desc: 'Statutory entitlement if your job ends after long-term sick leave.' },
      ]}
      educational={[
        {
          title: 'How SSP works — the basic mechanics',
          body: `Statutory Sick Pay is a government-mandated minimum that all qualifying employees must receive when ill. In ${RATES_TAX_YEAR} it is £${SSP_WEEKLY} per week — this is not a state benefit but a statutory obligation on your employer, run through normal payroll.\n\n**Qualifying days:** SSP is paid for "qualifying days" — the days you are contractually expected to work. If you work Monday to Friday, your qualifying days are Monday to Friday. If you work Tuesday, Thursday and Saturday, those are your qualifying days. The daily rate is simply £${SSP_WEEKLY} ÷ your qualifying days per week.\n\n**The 3 waiting days:** The first 3 qualifying days of any sickness spell are unpaid waiting days. SSP begins on the 4th qualifying day. For a 5-day worker sick Monday to Friday: Monday, Tuesday and Wednesday are unpaid; Thursday and Friday are paid SSP days.\n\n**Linked spells:** If you return and go off sick again within 8 weeks (56 days), the periods link together — one period of incapacity in law. No further waiting days apply for the linked spell. This is important for workers with recurring conditions.`,
        },
        {
          title: 'Who qualifies — the eligibility tests',
          body: `To receive SSP you must pass all four tests:\n\n**1. Employee status:** You must be an employee, not a self-employed contractor. Agency workers and zero-hours staff can qualify if the other tests are met — the label on the contract is not decisive; the reality of the working relationship determines status.\n\n**2. Average weekly earnings:** Your average weekly earnings must be at least £${LEL_WEEKLY} (the Lower Earnings Limit for ${RATES_TAX_YEAR}). Average weekly earnings are calculated over the 8 weeks before the sickness starts (or since the start of employment if less than 8 weeks). Include salary, regular bonuses, overtime, and commission — but not expenses or discretionary one-off bonuses.\n\n**3. Duration:** You must be sick for at least 4 consecutive qualifying days (the first 3 are unpaid waiting days).\n\n**4. Notification:** You must notify your employer of your sickness within their own deadline — usually within 7 calendar days. If you miss the deadline, your employer can legally delay SSP payment (but cannot ultimately refuse it if you were genuinely ill).\n\nIf you do not qualify for SSP, your employer must give you an SSP1 form within 7 days of you going off sick, so you can claim Universal Credit or ESA instead.`,
        },
        {
          title: 'Occupational sick pay — what your contract may give you',
          body: `Many employers offer occupational (contractual) sick pay that is more generous than SSP. This is not legally required but is extremely common in larger employers and public sector organisations. Typical occupational sick pay schemes:\n\n- **Full pay for 1–3 months, then half pay for 1–3 months:** Common in NHS, local government, and many large private firms\n- **Progressive sick pay based on service:** e.g. 1 month full + 1 month half in year 1, increasing to 6 months full + 6 months half after 5 years\n- **Income protection insurance:** Some employers fund insurance that pays 50–75% of salary for 2+ years for long-term incapacity\n\nImportant rules:\n1. Contractual sick pay is always at least SSP — your employer cannot use occupational sick pay to pay you less than the statutory rate\n2. Occupational sick pay may be conditional on following the company's absence management procedures (fit notes, return-to-work interviews)\n3. If your contractual sick pay scheme runs out before 28 weeks, your employer must continue paying SSP up to the 28-week maximum\n\nAlways check your staff handbook or employment contract before assuming you will only receive SSP.`,
        },
        {
          title: 'When SSP runs out — the ESA and Universal Credit bridge',
          body: `After 28 weeks of SSP, your employer's obligation ends. They must issue you an SSP1 form. At this point there are several options:\n\n**Employment and Support Allowance (ESA):**\nESA is a DWP benefit for those unable to work due to illness or disability. It is assessed by a Work Capability Assessment. There are two groups:\n- *Work-Related Activity Group (WRAG):* For those who may be able to work in future — lower payment, expected to prepare for employment\n- *Support Group:* For those with severe incapacity — higher payment, no work expectations\n\nNew-style ESA requires National Insurance credits from the last 2 to 3 tax years. It is not means-tested.\n\n**Universal Credit (UC):**\nMeans-tested benefit that includes a limited capability for work element. If you have savings above £16,000 or a partner in full-time work, UC may be reduced or unavailable. UC replaces many legacy benefits including old-style ESA.\n\n**Personal Independence Payment (PIP):**\nFor those whose illness or disability affects daily living or mobility. PIP is not means-tested, not linked to employment status, and is not affected by ESA or UC. Many people with long-term illness who exhaust SSP qualify for PIP separately — always apply if your condition meets the criteria.\n\n**Long-COVID:**\nLong-COVID is treated as any other long-term illness for SSP and ESA purposes. If symptoms have persisted for 12+ weeks post-infection and prevent work, the normal SSP → ESA pathway applies. NICE guidance confirms long-COVID is a recognised condition for fit notes.`,
        },
        {
          title: 'Your rights during and after sick leave',
          body: `**During sick leave:**\n- You accrue holiday entitlement (5.6 weeks/year statutory) — which can be carried over to the next leave year if you cannot take it during illness\n- You continue to build up pension entitlement under auto-enrolment (contributions based on SSP or contractual pay, depending on scheme rules)\n- You cannot be required to attend the workplace while on sick leave, though reasonable contact (e.g. occasional welfare check calls) is permissible\n- Disciplinary action taken specifically because of illness-related absence may constitute disability discrimination if the illness qualifies under the Equality Act 2010 (which it will if it has a substantial long-term effect on normal day-to-day activities)\n\n**Return to work:**\n- Employers must consider reasonable adjustments for disabled workers returning from sick leave (phased return, reduced hours, adjusted duties)\n- A fit note may say "may be fit for work" with recommended adjustments — your employer can accept or reject these, but rejection does not invalidate the fit note for SSP purposes\n\n**Dismissal during sick leave:**\n- Not automatically unfair, but requires fair process: medical evidence sought, consideration of reasonable adjustments, meaningful consultation, and following the statutory dismissal procedure\n- Failure to follow fair process gives grounds for an Unfair Dismissal claim if you have 2+ years' service, or a disability discrimination claim if the illness is a qualifying disability (no minimum service required for discrimination claims)`,
        },
      ]}
    >
      <SspClient />
    </CalcPageShell>
  );
}
