import type { Metadata } from 'next';
import { PiggyBank, Users, Scale } from 'lucide-react';
import CalcLayout from '../../components/calc-shell/CalcLayout';
import type { ArticleSection } from '../../components/calc-shell/CalcArticle';
import type { FaqItem } from '../../components/calc-shell/FaqJsonLd';
import { StatGrid, FlowSteps, TipCards } from '../../components/calc-shell/visuals';
import ChildBenefitClient from './ChildBenefitClient';

export const metadata: Metadata = {
  title: 'Child Benefit Tax Trap Calculator 2026/27 — HICBC & Pension Escape',
  description:
    'Work out the High Income Child Benefit Charge (HICBC) on your household and see exactly how much pension contribution reclaims it. 2026/27 £60k–£80k taper.',
  alternates: { canonical: '/child-benefit-trap' },
  openGraph: {
    title: 'Child Benefit Tax Trap Calculator 2026/27',
    description: 'How much Child Benefit the HICBC claws back — and how to get it back with a pension.',
    url: 'https://ukvisainfo.co.uk/child-benefit-trap',
    type: 'website',
  },
};

const FAQS: FaqItem[] = [
  {
    q: 'At what income does the Child Benefit charge start?',
    a: 'It begins once the higher earner in the household has an adjusted net income over £60,000, and removes the benefit entirely by £80,000. Below £60,000 there is no charge at all.',
  },
  {
    q: 'Is the charge based on our joint income?',
    a: 'No — and this catches people out. It only looks at the single highest earner. A couple each earning £55,000 (£110,000 between them) pays nothing, while a single earner on £70,000 is hit. It is one of the quirks of the system.',
  },
  {
    q: 'How does a pension contribution get my Child Benefit back?',
    a: 'The charge is based on adjusted net income, which is your income after pension contributions. Paying enough into a pension to drop the higher earner back under £60,000 cancels the charge completely — and you get tax relief on the contribution too.',
  },
  {
    q: 'Should I just stop claiming to avoid the hassle?',
    a: 'You can opt out of the cash, but keep the claim registered — especially in the name of a non-working partner. It awards National Insurance credits that protect their State Pension, which is worth far more than the admin you are avoiding.',
  },
];

const ARTICLE: ArticleSection[] = [
  {
    id: 'what',
    title: 'What the Child Benefit trap actually is',
    body: (
      <>
        <p>
          Child Benefit is paid to anyone raising a child. The catch arrived in the form of a clawback — the High Income Child Benefit Charge, or HICBC — which quietly takes the money back through the tax system once you earn too much. It is not means-tested in the usual sense; it is a tax charge bolted on to the higher earner&apos;s bill.
        </p>
        <FlowSteps items={[
          { label: 'Under £60k', value: 'Keep it all', op: '', accent: true },
          { label: '£60k–£80k', value: 'Tapered away', op: '→' },
          { label: 'Over £80k', value: 'Gone', op: '→' },
        ]} />
        <p>
          Between £60,000 and £80,000 the benefit is withdrawn gradually — you lose 1% of it for every £200 you earn over £60,000. Hit £80,000 and the charge equals the entire benefit, so you are handed the money and then taxed the exact same amount back. At that point claiming the cash is purely paperwork.
        </p>
      </>
    ),
  },
  {
    id: 'single-earner',
    title: 'The unfairness nobody warns you about',
    body: (
      <>
        <p>
          Here is the bit that genuinely annoys people, and rightly so. The charge looks only at the single highest earner in the house — not what the household earns together. Sit with that for a second, because the consequences are odd.
        </p>
        <StatGrid items={[
          { value: '£0', label: 'Two earners on £55k each', sub: '£110k household — no charge', tone: '#10b981' },
          { value: 'Full charge', label: 'One earner on £70k', sub: '£70k household — hit hard', tone: '#be123c' },
          { value: '£60k', label: 'The line that matters', sub: 'Per person, not combined', tone: '#6366f1' },
        ]} />
        <p>
          A couple pulling in £110,000 between them can keep every penny, while a single-income family on £70,000 loses a big slice. There is no fixing the unfairness itself — it is how the rule is written — but if your income is flexible (bonuses, dividends, pension timing), there is often room to manage which side of the line you land on.
        </p>
      </>
    ),
  },
  {
    id: 'escape',
    title: 'The pension escape route',
    body: (
      <>
        <p>
          This is where the calculator earns its keep. The charge is based on your <em>adjusted</em> net income — your income after pension contributions are taken off. So paying into a pension does two things at once: it gets you tax relief, and it can pull you back under £60,000 to wipe out the charge entirely.
        </p>
        <p>
          Say the higher earner is on £67,000. A £7,000 pension contribution drops their adjusted income to £60,000. That reclaims the whole Child Benefit, and the contribution itself attracts higher-rate tax relief. You are effectively being paid to save for retirement — the combined return on that £7,000 is enormous once you count the reclaimed benefit and the tax saved.
        </p>
        <div className="note">
          <span className="noteTitle">Why this is one of the best deals in UK tax</span>
          <p>
            In the £60k–£80k band, a pension contribution can give you higher-rate tax relief <em>and</em> restore Child Benefit at the same time. For a family with two or three kids, the effective return on that money can run well past 60% — there is almost nothing else like it.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'claim',
    title: 'Should you even keep claiming?',
    body: (
      <>
        <p>
          A lot of higher earners decide the charge makes Child Benefit pointless and stop claiming. That is usually a mistake — not because of the cash, but because of what the claim quietly does in the background.
        </p>
        <TipCards items={[
          { icon: Users, title: 'Keep the claim alive', body: 'You can tick the box to receive £0 cash but stay registered. That avoids the tax charge without losing the other benefits of claiming.' },
          { icon: Scale, title: 'Protect a pension', body: 'A claim in a non-working parent’s name awards NI credits that count towards their State Pension — easily worth thousands over a lifetime.' },
          { icon: PiggyBank, title: 'It also secures the number', body: 'Your child automatically gets a National Insurance number at 16 if a claim exists. Skip claiming and that becomes a manual chore later.' },
        ]} />
        <p>
          So the move for most affected families is: register the claim (ideally in the lower earner&apos;s name), then either take the cash and pay the charge, or opt out of the payments if you would rather not deal with it. Either way you keep the bits that matter.
        </p>
      </>
    ),
  },
  {
    id: 'method',
    title: 'How this calculator works',
    body: (
      <>
        <p>
          It takes the higher of the two salaries you enter, works out the Child Benefit your household is entitled to based on the number of children, and applies the HICBC taper between £60,000 and £80,000. When you model a pension contribution, it recalculates the charge on your reduced adjusted income and shows how much benefit you reclaim.
        </p>
        <p>
          It uses 2026/27 Child Benefit rates and the £60,000–£80,000 thresholds. It assumes standard adjusted-net-income treatment and does not capture every adjustment (Gift Aid, certain reliefs, or unusual income types) that can also move the line. For a complex situation, treat the figure as a strong guide and confirm with HMRC or an accountant.
        </p>
      </>
    ),
  },
  {
    id: 'faq',
    title: 'Frequently asked questions',
    body: (
      <>
        {FAQS.map((f) => (
          <div key={f.q}>
            <h4>{f.q}</h4>
            <p>{f.a}</p>
          </div>
        ))}
      </>
    ),
  },
];

export default function ChildBenefitTrapPage() {
  return (
    <CalcLayout
      crumb={[{ label: 'Home', href: '/' }, { label: 'Tax & Income', href: '/category/tax' }, { label: 'Child Benefit Trap' }]}
      eyebrow="Child Benefit · 2026/27"
      title="Child Benefit Tax Trap Calculator"
      deck="See how much Child Benefit the High Income Child Benefit Charge claws back from your household — and exactly how big a pension contribution it takes to get it back."
      verified="HMRC 2026/27 verified"
      url="/child-benefit-trap"
      methodology={{
        summary: 'Takes the higher earner’s adjusted net income, applies the HICBC taper between £60,000 and £80,000 against your household Child Benefit entitlement, and recalculates after any pension contribution. 2026/27 rates.',
        govUrl: 'https://www.gov.uk/child-benefit-tax-charge',
        govLabel: 'gov.uk · Child Benefit tax charge',
      }}
      faqs={FAQS}
      article={{
        heading: 'The Child Benefit trap, and how to climb out',
        readingTime: '8 min read · updated May 2026',
        sections: ARTICLE,
      }}
      disclaimer="Estimates based on 2026/27 Child Benefit rates and HICBC thresholds for educational purposes only. This is not regulated financial advice; other adjustments can affect your adjusted net income. Confirm with HMRC or an accountant."
    >
      <ChildBenefitClient />
    </CalcLayout>
  );
}
