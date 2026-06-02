import type { Metadata } from 'next';
import { Home, Scale, Baby, Building2 } from 'lucide-react';
import CalcLayout from '../../components/calc-shell/CalcLayout';
import type { ArticleSection } from '../../components/calc-shell/CalcArticle';
import type { FaqItem } from '../../components/calc-shell/FaqJsonLd';
import { StatGrid, CompareMatrix, FlowSteps, TipCards } from '../../components/calc-shell/visuals';
import SalarySacrificeClient from './SalarySacrificeClient';

export const metadata: Metadata = {
  title: 'UK Salary Sacrifice Calculator 2026/27 — Pension, EV & Cycle Savings',
  description:
    'Work out the real tax and National Insurance saving from salary sacrifice — pension, electric car lease and Cycle to Work — under 2026/27 rules. See cost to your take-home vs what you gain.',
  alternates: { canonical: '/salary-sacrifice-calculator' },
  openGraph: {
    title: 'UK Salary Sacrifice Calculator 2026/27',
    description: 'The true tax and NI saving from workplace salary sacrifice schemes — pension, EV and cycle.',
    url: 'https://ukvisainfo.co.uk/salary-sacrifice-calculator',
    type: 'website',
  },
};

const FAQS: FaqItem[] = [
  {
    q: 'Does salary sacrifice really save National Insurance?',
    a: 'Yes, and that is the whole point. A normal pension contribution only saves Income Tax. Salary sacrifice lowers your gross pay before NI is worked out, so you also dodge the 8% (or 2% higher up) employee NI on whatever you give up — and many employers add the 13.8% they save too.',
  },
  {
    q: 'Will salary sacrifice hurt my mortgage application?',
    a: 'It can. Lenders look at your reduced gross salary, so sacrificing a large chunk can lower how much you can borrow. If a mortgage is on the horizon, it is worth pausing or trimming the sacrifice for a while, or talking to a broker who understands how your lender treats it.',
  },
  {
    q: 'Is there a limit to how much I can sacrifice?',
    a: 'You cannot sacrifice below the National Minimum Wage — that is a hard legal floor your employer must keep you above. Pensions also have an annual allowance (£60,000 for most people) that caps tax-relieved contributions across the year.',
  },
  {
    q: 'Why is the electric car saving so good?',
    a: 'Because the benefit-in-kind rate on fully electric cars is tiny — 2% for 2026/27 — so you are taxed on almost nothing while paying for the lease out of pre-tax, pre-NI salary. The rate climbs by about a point a year, so the deal slowly gets less generous.',
  },
];

const ARTICLE: ArticleSection[] = [
  {
    id: 'what',
    title: 'What salary sacrifice actually is',
    body: (
      <>
        <p>
          The name is awful and it puts people off, which is a shame, because the idea underneath is simple. You agree to be paid a bit less on paper. In return your employer spends that money on something for you — usually a pension, sometimes an electric car or a bike. Because your official salary is now lower, the taxman sees a smaller number and takes less.
        </p>
        <p>Here is the move on a £50,000 salary giving up £500 a month:</p>
        <FlowSteps items={[
          { label: 'Gross salary', value: '£50,000', op: '', accent: true },
          { label: 'You sacrifice', value: '−£6,000', op: '−' },
          { label: 'Taxed on', value: '£44,000', op: '=', accent: true },
          { label: 'Tax + NI saved', value: '≈ £1,700', op: '→' },
        ]} />
        <p>
          The £6,000 still belongs to you — it has just gone straight into your pension instead of your current account, and it skipped the tax and National Insurance it would normally have walked through. That is the entire trick. Everything else on this page is detail.
        </p>
      </>
    ),
  },
  {
    id: 'vs-normal',
    title: 'Why it beats a normal pension contribution',
    body: (
      <>
        <p>
          Plenty of people already pay into a pension and assume they are getting the best deal going. Often they are not. A standard contribution (the &quot;relief at source&quot; sort most personal pensions use) gives you the Income Tax back but leaves the National Insurance on the table. Salary sacrifice grabs both.
        </p>
        <CompareMatrix
          columns={['', 'Salary sacrifice', 'Normal pension']}
          bestIndex={1}
          rows={[
            { label: 'Income Tax relief', cells: [true, true] },
            { label: 'National Insurance saved', cells: [true, false] },
            { label: 'Employer can add their NI saving', cells: [true, false] },
            { label: 'Higher-rate relief without a tax return', cells: [true, false] },
          ]}
        />
        <p>
          That third row is the quiet winner. When you sacrifice salary, your employer stops paying their 13.8% National Insurance on it too. Decent employers pass some or all of that straight into your pot — free money a normal contribution never touches. Whether you get it depends on your scheme, so ask HR the blunt question: do you add back the employer NI?
        </p>
        <div className="note">
          <span className="noteTitle">The one to watch for higher earners</span>
          <p>
            If you earn over £100,000, sacrificing salary drags your income back under that line and hands you back the Personal Allowance you were losing. In that band a pound sacrificed can be worth closer to 60p of tax saved, not 40p. It is the most efficient pension money you will ever pay in.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'ni',
    title: 'The National Insurance bit people miss',
    body: (
      <>
        <p>
          Income Tax gets all the attention, but National Insurance is where sacrifice quietly earns its keep. These are the rates doing the work in the background.
        </p>
        <StatGrid items={[
          { value: '8%', label: 'Employee NI', sub: 'On pay between £12,570 and £50,270', tone: '#f59e0b' },
          { value: '2%', label: 'Employee NI', sub: 'On pay above £50,270', tone: '#be123c' },
          { value: '13.8%', label: 'Employer NI', sub: 'What your employer can add back', tone: '#10b981' },
        ]} />
        <p>
          So a basic-rate earner sacrificing into a pension saves 20% tax and 8% NI on every pound — 28% before the employer even chips in. A normal contribution would only have saved the 20%. On £6,000 a year that gap alone is worth a few hundred pounds you would otherwise never see.
        </p>
      </>
    ),
  },
  {
    id: 'ev',
    title: 'Electric cars: the big one right now',
    body: (
      <>
        <p>
          The electric car schemes that have spread across UK workplaces lately exist because of one number: the benefit-in-kind rate. When you get a car through your job you normally pay tax on it as a perk, valued as a percentage of the car&apos;s list price. For petrol cars that percentage is brutal. For electric ones, it is almost nothing.
        </p>
        <StatGrid items={[
          { value: '2%', label: 'EV benefit-in-kind', sub: '2026/27 rate on a fully electric car', tone: '#10b981' },
          { value: '+1%', label: 'Rising each year', sub: 'Roughly a point a year from here', tone: '#f59e0b' },
          { value: 'P11D', label: 'Taxed on list price', sub: 'Not on what the lease costs', tone: '#6366f1' },
        ]} />
        <p>
          So you pay for the lease out of gross, pre-NI salary — and the only thing you are taxed on is 2% of the car&apos;s value. On a £45,000 car that is £900 of taxable benefit a year, against a lease you would otherwise fund entirely from taxed income. For a higher-rate taxpayer the maths can be genuinely startling.
        </p>
        <p>
          One honest caveat: that 2% is not staying at 2%. It has been creeping up by about a percentage point a year, so a car you take today gets a little more expensive each April. The calculator works off the rate you enter, so nudge it up if you want to see how a later lease year looks.
        </p>
      </>
    ),
  },
  {
    id: 'cycle',
    title: 'Cycle to Work and the smaller schemes',
    body: (
      <>
        <p>
          Cycle to Work runs on the same engine — give up salary, get a bike and kit, save the tax and NI. For a basic-rate taxpayer that is roughly a quarter off; for a higher-rate one, closer to a third. On a £1,000 bike that is real money.
        </p>
        <p>
          The wrinkle is the end. The bike belongs to the scheme provider during the hire period, and to actually own it afterwards you usually pay a small transfer fee — often around 5%. The calculator knocks that off, so the saving you see is the saving you keep, not a headline that ignores the final bill. Other sacrifice perks — workplace nursery places, the odd tech scheme — work the same way, though the tax treatment varies, so check the specifics before you commit.
        </p>
      </>
    ),
  },
  {
    id: 'catches',
    title: 'Where it can bite you',
    body: (
      <>
        <p>
          Salary sacrifice is not a free lunch, and the downsides are easy to forget because they only show up later. Four worth keeping in mind.
        </p>
        <TipCards items={[
          { icon: Home, title: 'Mortgages get harder', body: 'Lenders see your lower gross salary. A big sacrifice can shrink what you can borrow — pause it before you apply if a house is the plan.' },
          { icon: Scale, title: 'There is a legal floor', body: 'You cannot be sacrificed below the National Minimum Wage. If you are near it, your employer simply will not let you give up as much.' },
          { icon: Baby, title: 'Statutory pay can drop', body: 'Maternity, paternity and sick pay are based on your reduced salary, so a long-running sacrifice can quietly lower them.' },
          { icon: Building2, title: 'Some benefits track salary', body: 'Death-in-service cover and similar perks are sometimes a multiple of gross pay. A lower gross can mean lower cover.' },
        ]} />
        <p>
          None of these are dealbreakers for most people. They are just the sort of thing nobody mentions until you trip over them, so have a five-minute think about which apply to you before you sign anything.
        </p>
      </>
    ),
  },
  {
    id: 'worth-it',
    title: 'So is it worth doing?',
    body: (
      <>
        <p>
          For a pension, almost always yes — assuming you do not need the cash right now and a mortgage application is not imminent. You are getting a better deal on money you were probably saving anyway, and if your employer shares their NI saving it is close to a no-brainer.
        </p>
        <p>
          The electric car is more of a lifestyle call. The tax break is the best it has been in years, but you are committing to a multi-year lease and a slowly rising benefit charge. If you were going to run a car regardless, doing it this way is hard to beat. If you were not, the tax saving alone is not a reason to take one on.
        </p>
        <p>
          Cycle to Work is low stakes and quietly good value — most people who use it just wish they had done it sooner. Whatever you are weighing up, run your real numbers through the calculator above: the gap between what it costs your take-home and what you actually gain is usually wider than people expect.
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
          It runs entirely in your browser. For each scheme it calculates your tax twice — once on your normal salary, once on the reduced one — and compares the two. The difference, minus the cash you actually lose from your take-home, is your saving. For the pension it adds back the share of employer National Insurance you tell it to. For the electric car it adds the benefit-in-kind value back for Income Tax but not National Insurance, which mirrors how HMRC treats it. For Cycle to Work it deducts a typical end-of-scheme transfer fee.
        </p>
        <p>
          It uses 2026/27 thresholds and assumes a single salary with standard arrangements. It will not capture every edge case — unusual pension annual-allowance situations, tapered allowances for very high earners, or scheme-specific quirks your employer might have. Treat the figure as a strong estimate and confirm the specifics with your payroll team or a qualified adviser before you commit.
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

export default function SalarySacrificePage() {
  return (
    <CalcLayout
      crumb={[{ label: 'Home', href: '/' }, { label: 'Tax & Income', href: '/category/tax' }, { label: 'Salary Sacrifice' }]}
      eyebrow="Salary sacrifice · 2026/27"
      title="Salary Sacrifice Calculator"
      deck="See the real saving from sacrificing salary into a pension, an electric car lease or a Cycle to Work bike — what it costs your take-home, and what you gain in return."
      verified="HMRC 2026/27 verified"
      url="/salary-sacrifice-calculator"
      methodology={{
        summary: 'Compares your tax and National Insurance on your full salary against your reduced salary for each scheme, adds back employer NI where shared, and treats electric-car benefit-in-kind the way HMRC does. Based on 2026/27 thresholds.',
        govUrl: 'https://www.gov.uk/guidance/salary-sacrifice-and-the-effects-on-paye',
        govLabel: 'gov.uk · Salary sacrifice',
      }}
      faqs={FAQS}
      article={{
        heading: 'Salary sacrifice, explained without the jargon',
        readingTime: '9 min read · updated May 2026',
        sections: ARTICLE,
      }}
      disclaimer="Estimates based on 2026/27 HMRC thresholds for educational purposes only. Salary sacrifice affects mortgage borrowing, statutory pay and minimum-wage eligibility — this is not regulated financial advice. Check with your payroll team or a qualified adviser."
    >
      <SalarySacrificeClient />
    </CalcLayout>
  );
}
