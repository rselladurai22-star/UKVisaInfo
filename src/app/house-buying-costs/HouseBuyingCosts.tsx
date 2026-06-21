'use client';

import { useMemo, useState } from 'react';
import {
  gbp, CalcShell, Panel, Stat, Field, MoneyInput, Choice, Donut,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { PROPERTY_RELATED } from '../ltv-calculator/LtvCalculator';

type Buyer = 'ftb' | 'mover' | 'additional';
type Survey = 'none' | 'condition' | 'homebuyer' | 'building';

const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';
const SURVEY_COST: Record<Survey, number> = { none: 0, condition: 400, homebuyer: 650, building: 950 };
const SURVEY_LABEL: Record<Survey, string> = { none: 'None', condition: 'Condition (Level 1)', homebuyer: 'HomeBuyer (Level 2)', building: 'Building (Level 3)' };

function sdlt(price: number, buyer: Buyer): number {
  const ftb = buyer === 'ftb' && price <= 500000;
  const bands: [number, number, number][] = ftb
    ? [[0, 300000, 0], [300000, 500000, 0.05]]
    : [[0, 125000, 0], [125000, 250000, 0.02], [250000, 925000, 0.05], [925000, 1500000, 0.1], [1500000, Infinity, 0.12]];
  const sur = buyer === 'additional' ? 0.05 : 0;
  let t = 0;
  for (const [f, to, rt] of bands) { if (price <= f) break; t += (Math.min(price, to) - f) * (rt + sur); }
  return t;
}

function landRegistry(price: number): number {
  if (price <= 100000) return 20;
  if (price <= 200000) return 40;
  if (price <= 500000) return 100;
  if (price <= 1000000) return 150;
  return 295;
}

export default function HouseBuyingCosts() {
  const [price, setPrice] = useState(300000);
  const [deposit, setDeposit] = useState(45000);
  const [buyer, setBuyer] = useState<Buyer>('mover');
  const [survey, setSurvey] = useState<Survey>('homebuyer');
  const [legal, setLegal] = useState(1500);
  const [mortgageFee, setMortgageFee] = useState(999);
  const [removals, setRemovals] = useState(900);

  const r = useMemo(() => {
    const tax = sdlt(price, buyer);
    const searches = 350;
    const valuation = 0; // usually free / included
    const lr = landRegistry(price);
    const items = [
      { label: 'Deposit', value: deposit, color: '#475569' },
      { label: 'Stamp duty (SDLT)', value: tax, color: PRIMARY },
      { label: 'Conveyancing / legal', value: legal, color: ACCENT },
      { label: 'Survey', value: SURVEY_COST[survey], color: '#0a7d4f' },
      { label: 'Mortgage fees', value: mortgageFee, color: '#7c3aed' },
      { label: 'Searches', value: searches, color: '#0ea5e9' },
      { label: 'Land Registry', value: lr, color: '#f59e0b' },
      { label: 'Removals', value: removals, color: '#ec4899' },
    ];
    const fees = tax + legal + SURVEY_COST[survey] + mortgageFee + searches + valuation + lr + removals;
    const totalCash = deposit + fees;
    return { items, fees, totalCash, tax };
  }, [price, deposit, buyer, survey, legal, mortgageFee, removals]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Property', href: '/category/property' }, { label: 'House Buying Costs' }]}
      title="House Buying Costs Calculator"
      subtitle="The deposit is only part of it. Add up every upfront cost of buying a home in England or Northern Ireland, stamp duty, legal fees, survey, searches and more, so you know the real cash you need."
      inputs={
        <>
          <Panel title="Purchase">
            <div className="space-y-4">
              <Field label="Property price"><MoneyInput value={price} onChange={setPrice} step={5000} /></Field>
              <Field label="Deposit"><MoneyInput value={deposit} onChange={setDeposit} step={1000} /></Field>
              <Field label="Buyer type">
                <Choice<Buyer> name="buyer" value={buyer} onChange={setBuyer} options={[
                  { value: 'ftb', label: 'First-time buyer' },
                  { value: 'mover', label: 'Home mover' },
                  { value: 'additional', label: 'Additional property / BTL' },
                ]} />
              </Field>
            </div>
          </Panel>
          <Panel title="Fees">
            <div className="space-y-4">
              <Field label="Survey type">
                <Choice<Survey> name="survey" value={survey} onChange={setSurvey} options={(['none', 'condition', 'homebuyer', 'building'] as Survey[]).map((s) => ({ value: s, label: `${SURVEY_LABEL[s]}${SURVEY_COST[s] ? ` · ~${gbp(SURVEY_COST[s])}` : ''}` }))} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Conveyancing"><MoneyInput value={legal} onChange={setLegal} step={100} /></Field>
                <Field label="Mortgage fees"><MoneyInput value={mortgageFee} onChange={setMortgageFee} step={100} /></Field>
              </div>
              <Field label="Removals"><MoneyInput value={removals} onChange={setRemovals} step={100} /></Field>
            </div>
          </Panel>
        </>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Total cash needed" value={gbp(r.totalCash)} sub="deposit + all fees" tone="dark" big />
            <Stat label="Fees & costs" value={gbp(r.fees)} sub="excluding deposit" tone="accent" />
          </div>

          <Panel title="Cost breakdown">
            <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
              <Donut centerLabel="Total cash" centerValue={gbp(r.totalCash)} segments={r.items.filter((x) => x.value > 0).map((x) => ({ value: x.value, color: x.color, label: x.label }))} />
              <div className="flex-1 space-y-2 text-sm w-full">
                {r.items.map((it) => (
                  <div key={it.label} className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-on-surface-variant"><span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: it.color }} />{it.label}</span>
                    <span className="font-semibold tabular-nums">{gbp(it.value)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-outline-variant font-bold"><span>Total</span><span className="tabular-nums">{gbp(r.totalCash)}</span></div>
              </div>
            </div>
          </Panel>

          <Callout tone="info" title="Stamp duty is the big variable">
            On this purchase, SDLT is <strong>{gbp(r.tax)}</strong>. First-time buyers pay nothing up to £300,000; additional
            properties carry a 5% surcharge. Use the Stamp Duty calculator for the full band breakdown.
          </Callout>

          <p className="text-[11px] text-on-surface-variant">Estimates based on typical UK figures; your quotes will vary. SDLT shown is for England & NI, Scotland (LBTT) and Wales (LTT) differ.</p>
        </>
      }
    >
      <Guide
        title="The true cost of buying a home"
        intro="Most buyers budget for the deposit and are then blindsided by thousands in extra costs at completion. This guide breaks down every upfront cost of buying in the UK, with typical figures and where you can save."
      >
        <GuideSection kicker="The big one" title="Stamp Duty Land Tax">
          <p>SDLT is usually the largest cost after the deposit. In England and Northern Ireland it&apos;s charged in slices: nothing up to £125,000, then 2%, 5%, 10% and 12% on higher portions. First-time buyers pay nothing up to £300,000 (and 5% to £500,000), while anyone buying an additional property pays a 5% surcharge on every band. Scotland and Wales have their own equivalents (LBTT and LTT).</p>
        </GuideSection>
        <GuideSection kicker="Legal" title="Conveyancing and searches">
          <p>A conveyancer or solicitor handles the legal transfer, typically charging <strong>£1,000 to £2,000</strong> including their fee and disbursements. On top sit local authority and other <strong>searches</strong> (around £250 to £450) and the <strong>Land Registry</strong> fee, which scales with price. Buying a leasehold property usually costs a little more in legal work.</p>
        </GuideSection>
        <GuideSection kicker="Due diligence" title="Surveys">
          <p>A survey is optional but strongly advised. A <strong>Level 1 (condition)</strong> report suits new or modern homes (~£400); a <strong>Level 2 (HomeBuyer)</strong> report is the common choice for standard properties (~£600 to £700); and a <strong>Level 3 (building/structural)</strong> survey is best for older, larger or unusual homes (~£900+). Skipping a survey to save a few hundred pounds can cost thousands in undiscovered defects.</p>
          <Callout tone="tip" title="A survey can pay for itself">Findings from a survey are powerful negotiating leverage, buyers often recover the survey cost many times over by renegotiating the price or asking the seller to fix issues.</Callout>
        </GuideSection>
        <GuideSection kicker="Mortgage" title="Lender and valuation fees">
          <p>Many deals carry a <strong>product/arrangement fee</strong> (commonly £999 to £1,499), which you can pay upfront or add to the loan (paying interest on it for the term). Lenders run their own <strong>valuation</strong>, often free on residential deals, occasionally chargeable. Factor the product fee into any rate comparison, as a low rate with a big fee can be worse than a slightly higher fee-free rate.</p>
        </GuideSection>
        <GuideSection kicker="Moving" title="Removals and the rest">
          <p>Removals run from a few hundred pounds for a small flat to over £1,500 for a larger home with packing. Add the smaller extras: notice on your rental, mail redirection, new furniture and immediate repairs. It&apos;s wise to keep a contingency fund after completion rather than spending every last pound on the deposit.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Budgeting only for the deposit', 'Fees can add several thousand pounds. Total the full cash needed before you offer.'],
            ['Skipping the survey', 'A few hundred saved now can mean thousands in undiscovered repairs later.'],
            ['Forgetting stamp duty is cash', 'SDLT is due within 14 days of completion and usually cannot be added to the mortgage.'],
            ['Ignoring the additional-property surcharge', 'If you&apos;ll own two homes at completion, the 5% surcharge applies to the whole price.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How much are the total costs of buying a house?', a: 'Beyond the deposit, expect anywhere from a couple of thousand pounds to tens of thousands, driven mostly by stamp duty. On a typical £300,000 purchase, fees often total £3,000 to £6,000 plus any SDLT.' },
            { q: 'Can any of these costs be added to the mortgage?', a: 'Generally only the mortgage product fee. Stamp duty, legal fees and the survey must be paid in cash, usually around completion.' },
            { q: 'Do first-time buyers pay less?', a: 'Yes, first-time buyers benefit from stamp duty relief (nothing up to £300,000) and sometimes cheaper or incentivised mortgage deals, but still pay legal, survey and moving costs.' },
            { q: 'Is a survey really necessary?', a: 'It is not legally required, but it is highly recommended. The lender&apos;s valuation is not a survey and won&apos;t flag defects that could cost you dearly.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={PROPERTY_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
