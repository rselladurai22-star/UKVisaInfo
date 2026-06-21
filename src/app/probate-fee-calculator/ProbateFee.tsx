'use client';

import { useMemo, useState } from 'react';
import {
  CalcShell, Panel, Stat, Field, MoneyInput, NumberInput, Choice,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp } from '../../lib/tax2526';

const COURT_FEE = 300;       // E&W application fee if estate > £5,000
const FEE_THRESHOLD = 5000;
const COPY_FEE = 1.50;

type Route = 'diy' | 'grant' | 'full';

const RELATED = [
  { href: '/estate-value-calculator', label: 'Estate Value', hint: 'Net estate for IHT' },
  { href: '/inheritance-tax', label: 'Inheritance Tax', hint: 'Full IHT calculation' },
  { href: '/will-writing-cost', label: 'Will Writing Cost', hint: 'DIY vs solicitor' },
  { href: '/power-of-attorney-cost', label: 'Power of Attorney', hint: 'LPA fees & process' },
];

export default function ProbateFee() {
  const [estate, setEstate] = useState(350000);
  const [route, setRoute] = useState<Route>('diy');
  const [copies, setCopies] = useState(3);

  const r = useMemo(() => {
    const courtFee = estate > FEE_THRESHOLD ? COURT_FEE : 0;
    const copyFees = copies * COPY_FEE;

    let solicitorLow = 0;
    let solicitorHigh = 0;
    if (route === 'grant') {
      solicitorLow = 900;
      solicitorHigh = 2000;
    } else if (route === 'full') {
      // typical full estate administration: ~1%, 5% of estate value (+ VAT), with a floor
      solicitorLow = Math.max(1500, estate * 0.01);
      solicitorHigh = Math.max(3000, estate * 0.05);
    }

    const totalLow = courtFee + copyFees + solicitorLow;
    const totalHigh = courtFee + copyFees + solicitorHigh;

    return { courtFee, copyFees, solicitorLow, solicitorHigh, totalLow, totalHigh };
  }, [estate, route, copies]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Estate', href: '/category/estate' }, { label: 'Probate Fees' }]}
      title="Probate Fee Calculator"
      subtitle="Estimate the cost of probate in England & Wales for 2025/26, the £300 court fee plus solicitor costs if you use one."
      calcLabel="Estimate Probate Cost"
      inputs={
        <Panel title="The Estate">
          <div className="space-y-4">
            <Field label="Estate value"><MoneyInput value={estate} onChange={setEstate} step={10000} /></Field>
            <Field label="Who handles the probate?">
              <Choice<Route>
                name="route"
                value={route}
                onChange={setRoute}
                options={[
                  { value: 'diy', label: 'Do it yourself', desc: 'Apply directly, just the court fee' },
                  { value: 'grant', label: 'Solicitor: grant only', desc: 'Fixed fee to obtain the grant' },
                  { value: 'full', label: 'Solicitor: full administration', desc: 'They handle the whole estate' },
                ]}
              />
            </Field>
            <Field label="Extra copies of the grant" hint="£1.50 each, banks often need one each">
              <NumberInput value={copies} onChange={setCopies} min={0} step={1} />
            </Field>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Estimated Total" value={route === 'diy' ? gbp(r.totalLow) : `${gbp(r.totalLow)}, ${gbp(r.totalHigh)}`} sub="Including court fee" tone="dark" big />
            <Stat label="Court Fee" value={gbp(r.courtFee)} sub={estate > FEE_THRESHOLD ? 'Estate over £5,000' : 'Estate under £5,000, free'} tone="primary" />
            <Stat label="Extra Copies" value={gbp(r.copyFees)} sub={`${copies} × £1.50`} tone="accent" />
            <Stat label="Solicitor Fees" value={route === 'diy' ? '£0' : `${gbp(r.solicitorLow)}, ${gbp(r.solicitorHigh)}`} sub={route === 'full' ? 'Full administration' : route === 'grant' ? 'Grant only' : 'None, DIY'} />
          </div>

          {route === 'diy' && (
            <Callout tone="tip" title="DIY can be very cheap">
              If the estate is straightforward, a valid will, no inheritance tax and cooperative beneficiaries, many people apply for probate themselves for just the £300 court fee.
            </Callout>
          )}
          {route === 'full' && (
            <Callout tone="warn" title="Percentage fees add up fast">
              Some solicitors and banks charge 1%, 5% of the estate <em>plus</em> an hourly rate. On a £350,000 estate that can mean £3,500 to £17,500. Always get a fixed-fee quote and compare.
            </Callout>
          )}

          <p className="text-[11px] text-on-surface-variant">Estimate for England & Wales, 2025/26. Scotland (confirmation) and Northern Ireland have different fees. Solicitor ranges are indicative, get written quotes.</p>
        </>
      }
    >
      <Guide
        title="Probate fees and costs explained (2025/26)"
        intro="Probate is the legal right to deal with someone's estate after they die. In England and Wales the court application itself is cheap, a flat £300, but professional fees can run into thousands. This guide explains what you'll pay and how to keep costs down."
      >
        <GuideSection kicker="The court fee" title="A flat £300 application fee">
          <p>The probate application fee in England and Wales is <strong>£300</strong> for estates worth more than £5,000. Estates of £5,000 or less pay <strong>nothing</strong>. The fee is the same whether you apply yourself or through a solicitor, and is paid to HM Courts &amp; Tribunals Service.</p>
          <p>You can order extra official copies of the grant for <strong>£1.50 each</strong>, useful because banks, registrars and share registrars each usually want to see one.</p>
        </GuideSection>

        <GuideSection kicker="Doing it yourself" title="The cheapest route">
          <p>For a straightforward estate, a clear, valid will, no inheritance tax to pay and no disputes, you can apply for probate yourself online. Your only outlay is the £300 fee plus copies. This suits many estates where one person inherits or the family is in agreement.</p>
        </GuideSection>

        <GuideSection kicker="Using a professional" title="Solicitor and bank fees">
          <p>If the estate is complex you may use a solicitor or probate specialist. Costs vary widely:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Grant-only ("grant of probate") service:</strong> a fixed fee, typically £900 to £2,000, where the solicitor obtains the grant and you do the rest.</li>
            <li><strong>Full estate administration:</strong> the solicitor handles everything. Fees are often 1%, 5% of the estate value, sometimes plus an hourly rate and VAT.</li>
            <li><strong>Banks:</strong> some banks offer probate services but tend to be among the most expensive.</li>
          </ul>
          <Callout tone="warn" title="Percentage fees are negotiable">
            A 2%, 5% charge on a large estate can be tens of thousands of pounds for work that doesn't scale with estate size. Always ask for a fixed-fee alternative.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Worked example" title="A £350,000 estate, DIY vs solicitor">
          <p>On a £350,000 estate with no IHT, the DIY route costs £300 plus, say, three copies (£4.50), about £304.50. A grant-only solicitor might add £900 to £2,000. A full-administration solicitor charging 2% could cost around £7,000 plus the court fee. The work involved, not the estate size, should drive which route you choose.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common probate cost mistakes">
          <Mistakes items={[
            ['Defaulting to the bank', 'Bank probate services are often the priciest option; shop around first.'],
            ['Paying a % fee for simple estates', 'A straightforward estate rarely justifies a percentage charge, ask for a fixed fee.'],
            ['Ordering too few copies', 'Each institution wants its own copy; at £1.50 each, order enough up front to avoid delays.'],
            ['Assuming probate is always needed', 'Small estates and assets held jointly often pass without a grant at all.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'Is probate always required?', a: 'Not always. Jointly-owned assets usually pass to the survivor automatically, and many banks release small balances (often up to £20,000 to £50,000) without a grant.' },
            { q: 'How long does probate take?', a: 'Once submitted, the grant typically takes 8 to 16 weeks. Administering the whole estate can take 6 to 12 months or longer.' },
            { q: 'Does the £300 fee depend on estate size?', a: 'No. It is a flat £300 for any estate over £5,000, with no fee below that. There is no sliding scale in England and Wales.' },
            { q: 'Can I get help with the fee?', a: 'Fee remission (Help with Fees) may be available if the estate has very limited assets and the applicant is on a low income or certain benefits.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
