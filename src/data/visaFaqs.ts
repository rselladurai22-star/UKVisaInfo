// Frequently-asked questions per visa, rendered as a visible FAQ block plus
// FAQPage JSON-LD on each visa detail page. Eligible for Google rich
// results (the "People also ask" style answer expansions).

export interface FAQ {
  question: string;
  answer: string;
}

export const VISA_FAQS: Record<string, FAQ[]> = {
  'skilled-worker': [
    {
      question: 'What is the minimum salary for a UK Skilled Worker visa in 2026?',
      answer:
        'The general minimum is £38,700 per year. New entrants (under 26, recent graduates, or switching from Student/Graduate visas) qualify for £30,960. Roles on the Immigration Salary List have a £30,960 minimum. You must also meet your occupation\'s going rate and £15.88 per hour minimum, whichever is highest.',
    },
    {
      question: 'How long does a Skilled Worker visa last?',
      answer:
        'You can apply for up to 5 years initially, then extend. After 5 years of continuous lawful residence you can apply for Indefinite Leave to Remain. Most applicants choose 3-year initial visas to minimise upfront IHS, then extend at year 3.',
    },
    {
      question: 'Can my spouse and children join me on a Skilled Worker visa?',
      answer:
        'Yes. Spouses, civil partners, unmarried partners (2+ years cohabitation) and children under 18 can apply as dependants. Each pays the application fee (£827–£1,636) and IHS (£1,035/year adult, £776/year child). Dependants can work in any job without sponsorship.',
    },
    {
      question: 'How much does a Skilled Worker visa cost in total?',
      answer:
        'For a 3-year visa applied for outside the UK: £827 application fee + £3,105 IHS = £3,932 minimum. A 5-year visa costs around £6,811 including IHS. Many employers cover all or part of these costs. Optional priority service adds £500.',
    },
    {
      question: 'Can I switch employers on a Skilled Worker visa?',
      answer:
        'Yes, but you need a new Certificate of Sponsorship from the new employer and must submit a change-of-employment application. The new role must also meet salary and skill thresholds. You can start the new role only after the application is approved unless specific conditions apply.',
    },
  ],

  student: [
    {
      question: 'How much money do I need to show for a UK Student visa?',
      answer:
        'You need to prove first-year tuition (minus any paid) plus 9 months of maintenance: £1,483/month in London, £1,136/month elsewhere. So a London student with £28,000 tuition (£5,000 paid) needs to show £36,347 in savings or via a sponsor letter for 28 consecutive days.',
    },
    {
      question: 'Can I work while on a UK Student visa?',
      answer:
        'Yes — up to 20 hours per week during term, full-time during vacations, if you\'re on a degree-level course at a Higher Education Provider with a track record of compliance. You cannot be self-employed, work as a professional sportsperson, or work as a doctor/dentist in training (except on a recognised foundation programme).',
    },
    {
      question: 'Can I bring my spouse on a Student visa in 2026?',
      answer:
        'Almost certainly no. Since January 2024 most master\'s and undergraduate Student visa holders cannot bring dependants. Exceptions: government-sponsored students on courses 6+ months, and PhD or research doctorate students.',
    },
    {
      question: 'How much does a UK Student visa cost in 2026?',
      answer:
        'Application fee: £524. IHS: £776 per year for students (lower than the £1,035 standard rate). For a typical 3-year undergraduate visa: £524 + £3,104 IHS = £3,628 plus optional priority service £500. Tuition, maintenance and living costs are separate.',
    },
    {
      question: 'Can I switch from a Student visa to a Skilled Worker visa?',
      answer:
        'Yes, from inside the UK, provided you have a job offer from a licensed sponsor, the role meets salary thresholds, and you apply before your Student visa expires. The new-entrant discount drops the minimum salary to £30,960. The course completion rule has timing catches — see our switching guide for the details.',
    },
  ],

  visitor: [
    {
      question: 'How long can I stay in the UK on a Visit visa?',
      answer:
        'Standard Visit visas allow up to 6 months per visit. Long-term Visit visas (2, 5 or 10 years) allow multiple visits of up to 6 months each within the validity period, but no more than 6 months in any 12-month period as a general rule.',
    },
    {
      question: 'Can I work on a UK Visit visa?',
      answer:
        'No. You cannot take employment, do paid or unpaid work for a UK business, or run a business in the UK on a Visit visa. You can attend meetings, conferences, training, interviews and short-term business activities under permitted activity rules.',
    },
    {
      question: 'Do I need a UK ETA or a Visit visa?',
      answer:
        'Nationals of the EU/EEA, US, Canada, Australia, Japan, Gulf states and many other non-visa countries need an Electronic Travel Authorisation (ETA) — a £10 digital pre-authorisation valid 2 years. Visa nationals (India, China, Pakistan, Nigeria, etc.) still need a full Visit visa (£127, 3-week processing).',
    },
    {
      question: 'Why was my UK Visit visa refused?',
      answer:
        'The most common reasons are: insufficient ties to home country (the Home Office doubts you\'ll leave), inconsistent or insufficient bank statements, weak sponsor documents, thin travel history, and not addressing a previous refusal. Refusal letters cite the specific Immigration Rules paragraph — see our guide on visit visa refusals.',
    },
    {
      question: 'Can I extend a Visit visa from inside the UK?',
      answer:
        'Standard Visitor visas cannot be extended beyond 6 months from inside the UK in most cases. Exceptions: medical treatment extensions, academic visitor extensions, and certain compassionate grounds. Most applicants must leave and reapply.',
    },
  ],

  family: [
    {
      question: 'What is the minimum income for a UK Family visa?',
      answer:
        'In 2026 the minimum is £29,000 per year for the UK-based sponsor. This applies to spouse, partner, fiancé(e) and unmarried partner applications. It does not apply to parent-of-British-child applications or sponsors receiving certain disability benefits — those use the adequate maintenance test instead.',
    },
    {
      question: 'Can I use savings instead of income for a Family visa?',
      answer:
        'Yes. Cash savings of £88,500+ held for 6+ months by the sponsor, applicant, or jointly meets the threshold without any income. You can also combine: if you earn £20,000, the required savings drop to £38,500. Locked-in pensions, property equity, and gifts received within 6 months do not count.',
    },
    {
      question: 'How long does the Family visa route to ILR take?',
      answer:
        'Most applicants reach Indefinite Leave to Remain after 5 years on the Family visa route: 30 months initial + 30 months extension + ILR application. You must meet income, accommodation, English (A1 then A2 then B1) and Life in the UK Test requirements throughout.',
    },
    {
      question: 'How much does a UK Family visa cost?',
      answer:
        'Application fee: £1,938 (out of UK) or £1,321 (in-UK extension). IHS: £1,035/year. For a 30-month initial visa: £1,938 + £3,105 IHS = £5,043. Plus optional priority service £573–£1,000. Family route total to ILR (initial + extension + ILR) is around £15,000 over 5 years for a single applicant.',
    },
    {
      question: 'Can my UK partner sponsor me if they work overseas?',
      answer:
        'Generally no for fresh entry — the sponsor must be in the UK or returning to the UK with the applicant. If returning, you need evidence of the sponsor\'s firm plans to live in the UK plus a job offer or business plan meeting the income test once back. Returning Resident applications are a separate scheme.',
    },
  ],

  health: [
    {
      question: 'What is the minimum salary for the Health and Care Worker visa?',
      answer:
        'The general minimum is £25,600 per year (or £20,960 for new entrants), or the going rate for your occupation, whichever is higher. NHS roles follow the Agenda for Change pay bands which usually exceed these thresholds — for example, registered nurse band 5 is £31,081.',
    },
    {
      question: 'Is the Health and Care visa exempt from the IHS?',
      answer:
        'Yes. The main applicant is fully exempt from the Immigration Health Surcharge. This saves £1,035 per year compared to a standard Skilled Worker visa. Dependants are NOT exempt — they pay IHS at the dependant rate.',
    },
    {
      question: 'Can care workers still apply for the Health and Care visa?',
      answer:
        'New overseas applicants for standard care worker roles (SOC 6135) have been blocked since March 2025 following widespread sponsor abuse. Senior care worker roles remain open. Registered nurses, doctors, midwives, paramedics and allied health professionals are unaffected.',
    },
    {
      question: 'How long does the Health and Care visa take to process?',
      answer:
        'Standard processing is 3 weeks for out-of-UK applications. Priority service (5 working days) costs £500. NHS roles are typically processed quickly given the licensed sponsor\'s established track record. Care home sponsors can sometimes be slower due to additional compliance checks.',
    },
    {
      question: 'Can Health and Care visa holders bring dependants?',
      answer:
        'Most can — registered nurses, doctors, midwives and allied health professionals can bring spouse and children. Care workers cannot bring dependants on new applications since January 2024 (this is separate from the March 2025 closure for the main role).',
    },
  ],

  talent: [
    {
      question: 'Do I need a job offer for the Global Talent visa?',
      answer:
        'No. The Global Talent visa requires endorsement by an approved body (Royal Society, British Academy, Tech Nation\'s successor bodies, Arts Council, etc.) — not a job offer. You can work for any employer, switch freely, or be self-employed once on the visa.',
    },
    {
      question: 'How long is the Global Talent visa valid?',
      answer:
        'You can apply for up to 5 years and choose any duration from 1 to 5 years. ILR is available after 3 years for "exceptional talent" endorsement holders, or 5 years for "exceptional promise" endorsement holders, depending on the endorsing body.',
    },
    {
      question: 'What does "endorsement" mean for Global Talent?',
      answer:
        'An approved UK body (specific to your field) reviews your CV, achievements and supporting evidence and confirms you meet their criteria for exceptional talent or exceptional promise. The endorsement letter is then submitted with your Home Office visa application.',
    },
    {
      question: 'Which fields qualify for Global Talent?',
      answer:
        'Science and research (Royal Society, British Academy, Royal Academy of Engineering), digital technology (Tech Nation successor route), arts and culture (Arts Council England), film and TV (BFI), fashion design (British Fashion Council), and academia / research. Each has its own bar and evidence requirements.',
    },
    {
      question: 'How much does Global Talent cost?',
      answer:
        'Two-stage fee: £561 endorsement application + £161 visa application = £722 plus IHS (£1,035/year). For a 5-year visa: £722 + £5,175 IHS = £5,897. No employer or sponsor required, so no Skills Charge.',
    },
  ],

  graduate: [
    {
      question: 'How long is the Graduate visa?',
      answer:
        'Bachelor\'s and Master\'s graduates get 18 months. PhD and other doctoral qualifications get 3 years. The duration cannot be extended — you must switch to another route or leave the UK before it ends.',
    },
    {
      question: 'Do I need a job offer to apply for the Graduate visa?',
      answer:
        'No. You apply on the basis of having successfully completed an eligible UK course. You can work in any job, at any salary, for any employer once on the visa. No sponsorship needed.',
    },
    {
      question: 'Does Graduate visa time count towards ILR?',
      answer:
        'No. Years on the Graduate visa do not count towards the 5 years needed for Indefinite Leave to Remain. You must switch to a qualifying route (Skilled Worker, Health and Care, etc.) and start the 5-year clock from there.',
    },
    {
      question: 'How much does the Graduate visa cost?',
      answer:
        'Application fee: £880. IHS: £1,035/year × visa duration. So 18-month visa = £880 + £2,070 IHS = £2,950 total. PhD graduates pay £880 + £3,105 IHS = £3,985 for 3 years.',
    },
    {
      question: 'Can I bring dependants on a Graduate visa?',
      answer:
        'Only if they were already on your Student visa as dependants. New dependants cannot be added at the Graduate visa stage. This catches out students who married during their UK studies.',
    },
  ],

  'innovator-founder': [
    {
      question: 'Is there a minimum investment for the Innovator Founder visa?',
      answer:
        'No. The £50,000 minimum investment requirement was scrapped in April 2023. You need a credible business plan, founder skills, and endorsement from an approved body — investment level is now an ILR criterion (£50k+ invested), not an entry requirement.',
    },
    {
      question: 'Who can endorse my Innovator Founder application?',
      answer:
        'As of 2026, four approved bodies: Envestors Limited, UK Endorsement Services Limited, Innovator International, and the Global Entrepreneurs Programme (GEP). Each has its own application portal, fee (£500–£3,000), and assessment process. Approval rates are typically 30–40%.',
    },
    {
      question: 'How fast can I get ILR on the Innovator Founder visa?',
      answer:
        'In as little as 3 years — the fastest non-Global-Talent route. You must demonstrate the business has met at least 2 of 7 ILR criteria (investment, jobs, revenue, foreign customers, R&D, institutional investment, profitability/taxes).',
    },
    {
      question: 'Can I work for another employer while on Innovator Founder?',
      answer:
        'Yes. Unlike its predecessor (the old Innovator visa), the Innovator Founder visa allows full work rights. You can take other employment alongside running the business, useful in the early stages before the business generates founder salary.',
    },
    {
      question: 'What kind of business idea qualifies?',
      answer:
        'It must be innovative, viable and scalable. Endorsers look for novel products, business models or market approaches with potential to scale beyond a single locality and generate jobs. Generic restaurants, retail stores, franchises and standard consultancies typically do not qualify.',
    },
  ],

  'ilr': [
    { question: 'How long do I need to be in the UK before ILR?', answer: '5 years on a qualifying route (Skilled Worker, Health & Care, Family, Global Talent, etc.). Innovator Founder and Global Talent allow 3 years in some cases. Time on Student, Graduate, Visit visas does NOT count.' },
    { question: 'How much does ILR cost?', answer: '£3,029 application fee. Optional super priority service £800. Life in the UK Test £50. There is no IHS at ILR stage. Family applicants each apply separately at full fee.' },
    { question: 'What is the absence rule for ILR?', answer: 'You must not have been absent from the UK for more than 180 days in any rolling 12-month period during your 5-year qualifying residence. The rule is rolling, not calendar — Home Office checks every possible 12-month window.' },
    { question: 'Can I lose ILR?', answer: 'Yes. ILR can be lost by 2+ years of continuous absence from the UK, or revoked for serious criminal conduct or deception. It does not lapse from short absences.' },
    { question: 'When can I apply for British citizenship after ILR?', answer: '12 months after holding ILR (or immediately if married to a British citizen). Final 12 months absences must be under 90 days.' },
  ],

  'citizenship': [
    { question: 'How long after ILR can I apply for citizenship?', answer: '12 months from the date your ILR was granted. If you are married to a British citizen, you can apply immediately after ILR with no 12-month wait.' },
    { question: 'How much does citizenship cost?', answer: '£1,500 application fee + £80 citizenship ceremony fee = £1,580 total. British passport (separate) is around £88.50 for adults.' },
    { question: 'What is the absence rule for citizenship?', answer: 'No more than 450 days outside UK in the last 5 years, AND no more than 90 days in the final 12 months before application.' },
    { question: 'Will I lose my original citizenship?', answer: 'The UK allows dual citizenship. However your country of birth may not — India, China, and some others require renunciation. Check your home country\'s rules before applying.' },
    { question: 'Can my children become British?', answer: 'Children born in the UK to a parent with ILR are British at birth automatically. Children born abroad to British citizens are usually British by descent. Adopted children have a separate registration process.' },
  ],

  'euss': [
    { question: 'Can I still apply for EUSS in 2026?', answer: 'Yes — late applications are still accepted with reasonable grounds. The original deadline was 30 June 2021 but the Home Office continues to consider late applications where there is a credible explanation.' },
    { question: 'What is the difference between pre-settled and settled status?', answer: 'Pre-settled status is granted to those with less than 5 years of UK residence and lasts 5 years. Settled status is granted after 5 years and is permanent — equivalent to ILR.' },
    { question: 'Does EUSS cost anything?', answer: 'No, EUSS applications are completely free. There is no application fee, no IHS, and no biometrics fee.' },
    { question: 'Can my non-EU partner join me?', answer: 'Yes, family members of EUSS holders can apply for EU Settlement Scheme Family Permits (out of UK) or EUSS status (in UK). Non-EU partners married before 31 Dec 2020 have stronger rights.' },
    { question: 'How long does EUSS take?', answer: 'Most straightforward applications are decided within 30 days. Complex cases or those with insufficient residence evidence take longer.' },
  ],

  'bno': [
    { question: 'Who qualifies for the BNO visa?', answer: 'Anyone who holds British National (Overseas) status (registered before 1997) and is ordinarily resident in Hong Kong or the UK. Spouse, partner and dependent children can also apply as dependants.' },
    { question: 'How much does the BNO visa cost?', answer: '£180 for 2.5 years or £298 for 5 years, plus IHS of £1,035/year per adult and £776/year per child. A family of 4 on 5-year visas can expect £15,000–£20,000 total upfront.' },
    { question: 'Is there an English language requirement?', answer: 'No, not at initial application stage. English is only required at ILR (after 5 years) — typically passed via the Life in the UK Test and one of the standard B1 routes.' },
    { question: 'Can BNO visa holders bring children born after 1997?', answer: 'Yes, dependent children under 18 can be included even if they don\'t have BNO status themselves, as long as one parent holds BNO status. Adult children (18+) face stricter eligibility rules.' },
    { question: 'How fast can I get British citizenship via BNO?', answer: '5 years on BNO visa → ILR → 12 months → citizenship application. Total minimum: 6 years from arrival to citizenship (one of the fastest civilian routes).' },
  ],

  'long-residence': [
    { question: 'How is "10 years continuous residence" calculated?', answer: 'Every day of the 10 years must have been on a valid visa or leave to remain. Even a single day of overstaying breaks continuity. The 28-day grace period for late applications was effectively removed in 2024.' },
    { question: 'What is the absence limit for long residence ILR?', answer: '540 days total outside the UK across the 10 years, AND no single trip exceeding 184 days. Both limits must be met.' },
    { question: 'Does time on Student visa count?', answer: 'Yes — Student visa time fully counts toward the 10-year long residence clock, unlike for the standard 5-year ILR routes where Student time is not qualifying.' },
    { question: 'Should I use 5-year ILR or 10-year long residence?', answer: 'Always 5-year ILR if you qualify — it\'s faster, cleaner, and more reliably approved. 10-year long residence is for those who don\'t fit a single 5-year route (e.g. switched between non-qualifying visas).' },
    { question: 'What documents do I need?', answer: 'All passports for 10 years, all previous BRPs/decision letters, full HMRC tax records, council tax bills, utility bills, complete absence log, Life in the UK Test pass, and B1 English evidence.' },
  ],

  'ancestry': [
    { question: 'Who qualifies for the UK Ancestry visa?', answer: 'Commonwealth citizens aged 17 or over with at least one grandparent born in the UK, Channel Islands or Isle of Man. You must be able to work and intend to work in the UK.' },
    { question: 'How do I prove my UK grandparent?', answer: 'Get a copy of the grandparent\'s UK birth certificate from the General Register Office (£11). You also need birth certificates linking through your parent — if names changed via marriage, include those certificates too.' },
    { question: 'Is there a salary or job offer requirement?', answer: 'No — unlike Skilled Worker, you don\'t need a job offer or to meet a salary threshold. You can work in any role, run a business, or be self-employed once granted the visa.' },
    { question: 'How much does the UK Ancestry visa cost?', answer: '£637 application fee + 5 × £1,035 IHS = £5,812 total for the 5-year visa. Plus optional priority service.' },
    { question: 'What countries are "Commonwealth"?', answer: 'The 56 member states of the Commonwealth of Nations, including Australia, Canada, New Zealand, India, South Africa, Nigeria, Pakistan, Jamaica, Kenya, Singapore, Malaysia and many others. Full list at thecommonwealth.org.' },
  ],
};
