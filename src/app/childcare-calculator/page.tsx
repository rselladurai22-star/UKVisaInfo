import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import ChildcareClient from './ChildcareClient';

export const metadata: Metadata = {
  title: 'Childcare Calculator 2025/26 — Free Hours, Tax-Free Childcare, UC 85%',
  description: 'UK childcare cost calculator 2025/26. 15/30 free hours, Tax-Free Childcare £500/quarter top-up, Universal Credit 85% element. See your true monthly cost after all support.',
  alternates: { canonical: '/childcare-calculator' },
};

export default function ChildcarePage() {
  return (
    <CalcPageShell
      url="/childcare-calculator"
      eyebrow="Childcare Costs · UK · 2025/26"
      title="What does childcare actually cost after the government top-ups?"
      deck="Free hours, Tax-Free Childcare, Universal Credit — there are multiple forms of support. See which ones you qualify for and what your true monthly bill looks like after every entitlement is applied."
      verified="gov.uk/free-childcare-education-eligible-children"
      related={[
        { href: '/child-benefit-calculator', title: 'Child Benefit', desc: 'Don\'t forget to also claim Child Benefit.' },
        { href: '/salary-sacrifice-calculator', title: 'Salary sacrifice', desc: 'Some employers offer childcare voucher-style sacrifice schemes.' },
        { href: '/take-home-pay', title: 'Take-home pay', desc: 'See your net pay alongside childcare costs.' },
      ]}
      educational={[
        { title: 'Free hours — who gets what', body: '15 hours/week (38 weeks/year) for all 3–4 year olds. 30 hours for 3–4 year olds with working parents each earning under £100,000. From September 2024: 15 hours extended to children aged 9 months to 3 years (working parents, each earning ≤ £100k).' },
        { title: 'Tax-Free Childcare', body: 'For every £8 you pay into a TFC online account, the government adds £2 — a 20% top-up. Maximum government contribution is £500 per quarter (£2,000/year) per child, or £1,000/quarter (£4,000/year) for disabled children. Not available on Universal Credit or if either parent earns over £100,000.' },
        { title: 'Universal Credit childcare element', body: 'UC covers 85% of eligible registered childcare costs, up to £1,014.63/month for one child or £1,739.37/month for two or more children. Must use a registered provider. Paid in arrears — you must have the cash flow to pay upfront.' },
        { title: 'TFC vs UC — choose one', body: 'You cannot claim both Tax-Free Childcare and Universal Credit at the same time. For most people, if you are on UC, the childcare element is usually more valuable than TFC at lower income levels.' },
        { title: 'Term-time only or year-round?', body: 'Free hours are available 38 weeks/year (term time) at 15 or 30 hours, or 22–24 hours/week stretched over 52 weeks at some providers. Check your local authority — the "stretched offer" means you get the same total hours spread across more weeks.' },
      ]}
    >
      <ChildcareClient />
    </CalcPageShell>
  );
}
