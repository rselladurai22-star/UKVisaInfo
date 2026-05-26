import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import SelfAssessmentClient from './SelfAssessmentClient';

export const metadata: Metadata = {
  title: 'Self Assessment Tax Calculator 2025/26 — SA Bill, Payments on Account',
  description: 'HMRC Self Assessment calculator 2025/26. Estimate your SA tax bill from employment, self-employment, rental, dividends and savings — including Payments on Account and Class 4 NI.',
  alternates: { canonical: '/self-assessment-calculator' },
};

export default function SelfAssessmentPage() {
  return (
    <CalcPageShell
      url="/self-assessment-calculator"
      eyebrow="Self Assessment · UK · 2025/26"
      title="What will your Self Assessment bill actually be?"
      deck="Pull together all income sources — employment, self-employment, rental, dividends, savings — add Class 4 NI and Payments on Account, and you have a complete picture of your January bill before HMRC sends a notice."
      verified="gov.uk/self-assessment-tax-returns"
      methodology={{
        summary: "We aggregate all reportable income sources (employment, self-employment, rental, dividends, savings) against 2025/26 HMRC bands: Personal Allowance £12,570 with taper above £100,000; basic 20% to £50,270; higher 40% to £125,140; additional 45% above. Class 4 NI applies at 6% / 2% on self-employed profits. Payments on Account follow the standard 50% × 2 rule when last year's SA bill exceeded £1,000 and less than 80% was collected at source.",
        govUrl: "https://www.gov.uk/self-assessment-tax-returns",
        govLabel: "gov.uk · Self Assessment",
      }}
      faqs={[
        { q: 'Who has to file a Self Assessment tax return?', a: 'You must register if you: are self-employed with gross income above £1,000; are a director of a limited company; have rental income above the £1,000 Property Allowance; earn over £100,000; receive Child Benefit with adjusted net income above £60,000 (HICBC); have savings or investment income above the Personal Savings Allowance; receive untaxed foreign income; or get income from a trust or estate. HMRC writes to people they think need to register, but the obligation falls on you.' },
        { q: 'What are the Self Assessment deadlines?', a: 'Register by 5 October if new to SA. Paper return: 31 October. Online return + balancing payment + first Payment on Account: 31 January. Second Payment on Account: 31 July. Missing the 31 January online deadline triggers an automatic £100 penalty, with further penalties at 3, 6 and 12 months.' },
        { q: 'What are Payments on Account?', a: 'If your SA bill exceeds £1,000 and less than 80% of your tax was collected at source (PAYE), HMRC requires Payments on Account — advance payments of next year\'s estimated bill. Each one is 50% of last year\'s SA tax bill (excluding the CGT element), paid 31 January and 31 July. A balancing payment (or refund) follows on 31 January the next year.' },
        { q: 'Can I reduce my Payments on Account?', a: 'Yes — if you reasonably expect this year\'s SA bill to be lower than last year\'s (lower self-employment profits, fewer dividends, etc.), file form SA303 or use your HMRC online account to request a reduction. If you under-estimate and the actual bill turns out higher, HMRC charges interest on the underpayment but no penalty if the request was reasonable.' },
        { q: 'How is Class 4 NI calculated for sole traders?', a: 'Class 4 NI applies to trading profits (not turnover): 6% on profits between £12,570 and £50,270, then 2% above. It is calculated on your SA return and paid alongside the income tax bill via the same 31 January / 31 July instalments. Class 4 contributions count toward State Pension qualifying years.' },
        { q: 'What income counts for the £100,000 Personal Allowance taper?', a: 'All taxable income before allowances — salary, self-employed profits, dividends, rental, savings interest, etc. — minus pension contributions made via relief at source (grossed up by 1.25) and gift-aid donations (also grossed up). The technical term is "adjusted net income". Every £2 above £100k removes £1 of PA, so PA is fully gone at £125,140.' },
        { q: 'How are dividends taxed via Self Assessment?', a: 'Dividends above the £500 (2025/26) Dividend Allowance are taxed at 8.75% (basic), 33.75% (higher), and 39.35% (additional). They sit on top of other income for band-determination purposes, so a small salary + large dividend income can push the dividends into the higher band even when total income is below £50,270.' },
        { q: 'Do I need to register if I just have a side hustle?', a: 'Below £1,000 gross income from self-employment in a tax year, you can use the Trading Allowance instead of registering — it covers everything at zero tax and zero filing requirement. Above £1,000, you must register, even if your net profit is below the Personal Allowance and no tax is due. Property income has an equivalent £1,000 Property Allowance.' },
        { q: 'Can I claim expenses through Self Assessment?', a: 'Self-employed people claim "wholly and exclusively" business expenses against trading profits. Common ones: travel (not home-to-work commuting), professional subscriptions, business insurance, accounting fees, business use of home (HMRC simplified flat rate or actual-use proportion), and equipment (Annual Investment Allowance up to £1m). Detailed records must be kept for at least 5 years after the relevant 31 January.' },
        { q: 'What happens if I file late?', a: '£100 penalty immediately after 31 January, then daily £10 penalties after 3 months (up to £900), 5% of unpaid tax at 6 months, and another 5% at 12 months. Interest accrues from the original due date on any unpaid tax. The penalties stack — a 12-month late filer can owe £1,600+ in penalties on top of the unpaid tax and interest.' },
      ]}
      sidebar={{
        keyRates: [
          { label: 'Personal Allowance', value: '£12,570', sub: 'Tapers at £100k income' },
          { label: 'Basic rate (20%)', value: '£12,571–£50,270', sub: 'England, Wales & NI' },
          { label: 'Higher rate (40%)', value: '£50,271–£125,140' },
          { label: 'Additional rate (45%)', value: 'Over £125,140' },
          { label: 'Class 4 NI lower rate', value: '6%', sub: '£12,570 – £50,270 profits' },
          { label: 'Class 4 NI upper rate', value: '2%', sub: 'Profits over £50,270' },
          { label: 'Class 2 NI (small profits)', value: '£3.45/wk', sub: 'Profits over £6,845' },
          { label: 'Dividend allowance', value: '£500', sub: '2025/26' },
          { label: 'PSA (basic rate)', value: '£1,000', sub: 'Savings interest, tax-free' },
          { label: 'PSA (higher rate)', value: '£500', sub: 'Savings interest, tax-free' },
        ],
        dates: [
          { date: '5 Oct', desc: 'Register for Self Assessment if new to SA', urgent: false },
          { date: '31 Oct', desc: 'Paper return filing deadline', urgent: false },
          { date: '31 Jan', desc: 'Online return filing + balancing payment due', urgent: true },
          { date: '31 Jan', desc: 'First Payment on Account for next year', urgent: true },
          { date: '31 Jul', desc: 'Second Payment on Account for current year', urgent: false },
        ],
        tips: [
          { heading: 'POA can be reduced', body: 'If your income this year will be lower than last year\'s SA bill suggests, apply to reduce your Payments on Account via your HMRC online account — avoid overpaying.' },
          { heading: 'PA tapers above £100k', body: 'Every £2 of income over £100,000 removes £1 of Personal Allowance, creating an effective 60% marginal rate between £100k and £125,140.' },
          { heading: 'Pension reduces SA bill', body: 'Contributions to a private pension reduce your adjusted net income — potentially dropping you from higher rate to basic rate and reclaiming Personal Allowance.' },
        ],
        govLink: 'gov.uk/self-assessment-tax-returns',
        govLabel: 'gov.uk — Self Assessment',
      }}
      related={[
        { href: '/take-home-pay', title: 'Take-home pay', desc: 'PAYE already collected through your employer.' },
        { href: '/rental-income-tax', title: 'Rental income tax', desc: 'Section 24 impact on your SA bill.' },
        { href: '/salary-sacrifice-calculator', title: 'Salary sacrifice', desc: 'Reduce SA bill via pension sacrifice.' },
      ]}
      educational={[
        { title: 'Who needs to file?', body: 'You must register if: self-employed with >£1,000 income; director of a limited company; rental income above the Property Allowance; income over £100,000; high income Child Benefit recipient; savings/investment income above PSA; or you receive foreign income.' },
        { title: 'Payments on Account', body: 'If your tax bill exceeds £1,000 and less than 80% of your tax was collected at source, HMRC requires Payments on Account. Each payment = 50% of last year\'s SA bill, due 31 Jan and 31 Jul. A balancing payment (or refund) is due 31 Jan the following year.' },
        { title: 'Class 4 NI on profits', body: 'Sole traders and partners pay Class 4 NI on profits (not turnover). The rate is 6% on profits between the lower (£12,570) and upper (£50,270) profit limits, and 2% above. Class 2 is now treated as part of Class 4 for 2024/25 onwards.' },
        { title: 'Dividend taxation', body: 'Dividends are taxed at 8.75% (basic), 33.75% (higher), and 39.35% (additional) after the £500 allowance. They sit on top of other income and can push you into a higher band.' },
        { title: 'Personal Allowance taper', body: 'Between £100,000 and £125,140, your Personal Allowance reduces by £1 for every £2 of income. This creates an effective marginal rate of 60% in that band. Pension contributions can reclaim the allowance.' },
      ]}
    >
      <SelfAssessmentClient />
    </CalcPageShell>
  );
}
