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
