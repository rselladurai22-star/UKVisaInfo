'use client';

import { useMemo, useState } from 'react';
import {
  gbp, pct, CalcShell, Panel, AdvancedOptions, Stat, Field, MoneyInput, Slider, Choice,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { PROPERTY_RELATED } from '../ltv-calculator/LtvCalculator';

type Band = 'basic' | 'higher' | 'additional';

const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';
const BAND_RATE: Record<Band, number> = { basic: 0.2, higher: 0.4, additional: 0.45 };
const STRESS = 0.055;

export default function BuyToLet() {
  const [price, setPrice] = useState(200000);
  const [depositPct, setDepositPct] = useState(25);
  const [rent, setRent] = useState(1100);
  const [rate, setRate] = useState(5.3);
  const [mgmtPct, setMgmtPct] = useState(10);
  const [maintPct, setMaintPct] = useState(8);
  const [voidPct, setVoidPct] = useState(5);
  const [insurance, setInsurance] = useState(350);
  const [band, setBand] = useState<Band>('higher');

  const r = useMemo(() => {
    const annualRent = rent * 12;
    const loan = price * (1 - depositPct / 100);
    const deposit = price * (depositPct / 100);
    const interest = loan * (rate / 100);
    const costs = annualRent * (mgmtPct + maintPct + voidPct) / 100 + insurance;

    const grossYield = price ? (annualRent / price) * 100 : 0;
    const netYield = price ? ((annualRent - costs) / price) * 100 : 0;
    const operatingProfit = annualRent - costs - interest;

    // Personal (Section 24): interest not deductible, 20% credit.
    const personalTax = Math.max(0, (annualRent - costs) * BAND_RATE[band] - interest * 0.2);
    const personalNet = operatingProfit - personalTax;

    // SPV company: interest fully deductible, corporation tax.
    const companyProfit = annualRent - costs - interest;
    const ctRate = companyProfit <= 50000 ? 0.19 : 0.25;
    const companyTax = Math.max(0, companyProfit * ctRate);
    const companyNet = companyProfit - companyTax;

    const cashInvested = deposit + price * 0.05 + price * (depositPct < 100 ? 0.05 : 0); // deposit + buying costs + BTL SDLT surcharge approx
    const roi = cashInvested ? (personalNet / cashInvested) * 100 : 0;

    const icr = interest > 0 ? (annualRent / (loan * STRESS)) * 100 : Infinity;
    const icrReq = band === 'basic' ? 125 : 145;

    return {
      annualRent, costs, interest, grossYield, netYield, operatingProfit,
      personalTax, personalNet, companyTax, companyNet, ctRate, roi,
      icr, icrReq, icrPass: icr >= icrReq, deposit,
    };
  }, [price, depositPct, rent, rate, mgmtPct, maintPct, voidPct, insurance, band]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Property', href: '/category/property' }, { label: 'Buy-to-Let' }]}
      title="Buy-to-Let Calculator"
      subtitle="Model a buy-to-let end to end: yield, cash flow, the ICR mortgage stress test, the Section 24 tax hit for individuals, and whether a limited company (SPV) would keep more of your profit."
      inputs={
        <>
          <Panel title="Property & rent">
            <div className="space-y-4">
              <Field label="Purchase price"><MoneyInput value={price} onChange={setPrice} step={5000} /></Field>
              <Field label="Monthly rent"><MoneyInput value={rent} onChange={setRent} step={25} /></Field>
              <Field label={`Deposit — ${depositPct}%`}><Slider value={depositPct} onChange={setDepositPct} min={20} max={100} step={1} /></Field>
              <Field label={`Mortgage rate — ${pct(rate, 2)}`} hint="Interest-only (typical for BTL)"><Slider value={rate} onChange={setRate} min={0} max={10} step={0.05} /></Field>
            </div>
          </Panel>
          <AdvancedOptions label="Costs & tax" hint="Pre-filled with typical figures — adjust to itemise costs and set your tax band">
            <Field label={`Management — ${mgmtPct}%`}><Slider value={mgmtPct} onChange={setMgmtPct} min={0} max={20} step={1} /></Field>
            <Field label={`Maintenance — ${maintPct}%`}><Slider value={maintPct} onChange={setMaintPct} min={0} max={20} step={1} /></Field>
            <Field label={`Voids — ${voidPct}%`}><Slider value={voidPct} onChange={setVoidPct} min={0} max={20} step={1} /></Field>
            <Field label="Insurance / yr"><MoneyInput value={insurance} onChange={setInsurance} step={50} /></Field>
            <Field label="Your income tax band">
              <Choice<Band> name="band" value={band} onChange={setBand} options={[
                { value: 'basic', label: 'Basic (20%)' }, { value: 'higher', label: 'Higher (40%)' }, { value: 'additional', label: 'Additional (45%)' },
              ]} />
            </Field>
          </AdvancedOptions>
        </>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="Gross yield" value={pct(r.grossYield, 2)} tone="dark" />
            <Stat label="Net yield" value={pct(r.netYield, 2)} tone="accent" />
            <Stat label="Monthly cash flow" value={gbp(r.personalNet / 12, 0)} sub="after tax (personal)" />
            <Stat label="ROI" value={pct(r.roi, 1)} sub="cash-on-cash" />
          </div>

          <Panel title="Lender ICR stress test">
            <div className="flex items-center gap-4">
              <div className={`px-4 py-3 rounded-xl font-display font-bold text-lg ${r.icrPass ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{isFinite(r.icr) ? pct(r.icr, 0) : '—'}</div>
              <div className="text-sm">
                <div className={`font-bold ${r.icrPass ? 'text-green-700' : 'text-red-700'}`}>{r.icrPass ? 'Likely to pass' : 'Likely to fail'}</div>
                <div className="text-on-surface-variant text-xs">Needs ≥ {r.icrReq}% at a {pct(STRESS * 100, 1)} stress rate.</div>
              </div>
            </div>
          </Panel>

          <Panel title="Personal vs limited company (SPV)">
              <div className="overflow-x-auto rounded-lg border border-outline-variant">
                <table className="w-full text-sm">
                  <thead className="bg-surface-container-low text-left"><tr><th className="px-3 py-2 font-bold"></th><th className="px-3 py-2 font-bold text-right">Personal</th><th className="px-3 py-2 font-bold text-right">SPV company</th></tr></thead>
                  <tbody className="divide-y divide-outline-variant/60">
                    <tr><td className="px-3 py-2 text-on-surface-variant">Operating profit</td><td className="px-3 py-2 text-right tabular-nums">{gbp(r.operatingProfit)}</td><td className="px-3 py-2 text-right tabular-nums">{gbp(r.operatingProfit)}</td></tr>
                    <tr><td className="px-3 py-2 text-on-surface-variant">Tax</td><td className="px-3 py-2 text-right tabular-nums text-secondary">−{gbp(r.personalTax)}</td><td className="px-3 py-2 text-right tabular-nums text-secondary">−{gbp(r.companyTax)} <span className="text-[10px] text-on-surface-variant">({pct(r.ctRate * 100, 0)})</span></td></tr>
                    <tr><td className="px-3 py-2 font-bold">Net profit</td><td className="px-3 py-2 text-right tabular-nums font-bold text-primary">{gbp(r.personalNet)}</td><td className="px-3 py-2 text-right tabular-nums font-bold text-primary">{gbp(r.companyNet)}</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-[11px] text-on-surface-variant">SPV figure is profit retained in the company before extracting it (dividends/salary are taxed again). BTL company mortgage rates are usually higher. Take accountancy advice.</p>
            </Panel>

          <Callout tone={r.personalNet >= 0 ? 'tip' : 'warn'} title={`Personal net profit: ${gbp(r.personalNet)}/yr`}>
            After Section 24 tax of {gbp(r.personalTax)}. Higher-rate landlords keep less because mortgage interest only earns a 20% credit.
          </Callout>

          <p className="text-[11px] text-on-surface-variant">Estimates only, not tax advice. Excludes purchase SDLT surcharge in the headline figures, CGT on sale, and personal allowances. Verify with an accountant.</p>
        </>
      }
    >
      <Guide
        title="Buy-to-let in 2025/26: yield, tax and structure"
        intro="Buy-to-let can still work, but Section 24, higher rates and the ICR stress test have reshaped the maths. This guide walks through yield, the tax that catches higher-rate landlords, whether to use a company, and the costs people forget."
      >
        <GuideSection kicker="The numbers" title="Yield and cash flow">
          <p>Gross yield is annual rent over the purchase price; net yield subtracts running costs. But the figure that decides whether a property is viable is monthly <strong>cash flow</strong> after the mortgage and tax. With interest-only BTL mortgages at today&apos;s rates, many properties that look fine on gross yield barely break even once costs, interest and tax are counted. Always model the full picture before you buy.</p>
        </GuideSection>
        <GuideSection kicker="Financing" title="The ICR stress test">
          <p>Buy-to-let lenders require the rent to cover a multiple of the mortgage interest at a stressed rate (around 5.5%) — typically <strong>125% for basic-rate</strong> and <strong>145% for higher-rate</strong> landlords. Fail it and you simply won&apos;t get the loan at that level; you&apos;ll need a bigger deposit, higher rent or a cheaper property. Check the ICR before you make an offer.</p>
          <Callout tone="warn" title="ICR uses a notional rate">A cheap fixed deal doesn&apos;t help you pass — lenders stress at their own higher rate regardless of your actual product.</Callout>
        </GuideSection>
        <GuideSection kicker="Tax" title="Section 24 and why higher-rate landlords keep less">
          <p>Since 2020, individual landlords can no longer deduct mortgage interest as an expense. Instead you&apos;re taxed on rent (after other costs) and get only a flat 20% tax credit on the interest. Basic-rate landlords are broadly unaffected; higher and additional-rate landlords pay materially more, and in highly leveraged cases can owe tax on a property that barely breaks even on cash. This single change is why portfolio landlords increasingly use companies.</p>
        </GuideSection>
        <GuideSection kicker="Structure" title="Personal vs limited company (SPV)">
          <p>A special purpose vehicle (SPV) limited company keeps full mortgage-interest deductibility, paying corporation tax (19% up to £50,000 profit, rising to 25%) instead of income tax. For higher-rate or portfolio landlords this often leaves more profit in the business to reinvest. The trade-offs: BTL company mortgage rates are usually higher, there&apos;s annual accountancy cost and admin, and extracting profit (as dividends or salary) is taxed again. It rarely pays for a single basic-rate landlord — take advice.</p>
        </GuideSection>
        <GuideSection kicker="Buying & selling" title="Stamp duty surcharge and CGT">
          <p>Buying an additional property triggers a <strong>5% SDLT surcharge</strong> on every band on top of standard rates. When you sell, gains are taxed under <strong>capital gains tax</strong> at 18% (basic-rate band) and 24% (higher), after the annual exempt amount — higher than the rates on most other assets. Factor both the entry and exit taxes into your return, not just the rental yield.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Quoting gross yield only', 'Costs, voids, interest and tax can turn a 6% gross yield into thin or negative cash flow.'],
            ['Forgetting Section 24', 'Higher-rate landlords can owe tax even when cash flow is barely positive.'],
            ['Skipping the ICR check', 'A purchase that fails the stress test won&apos;t get the mortgage you assumed.'],
            ['Incorporating without advice', 'A company isn&apos;t automatically better — higher rates, costs and extraction tax can outweigh the saving.'],
            ['Ignoring the SDLT surcharge and CGT', 'The 5% surcharge on entry and CGT on exit materially affect the real return.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'Is buy-to-let still worth it?', a: 'It can be, especially in higher-yield areas and with a larger deposit, but Section 24, higher rates and the ICR test have squeezed margins. Model cash flow after tax carefully before buying.' },
            { q: 'Should I buy through a limited company?', a: 'An SPV avoids Section 24 and can suit higher-rate or portfolio landlords, but mortgage rates and admin are higher and extracting profit is taxed again. It rarely benefits a single basic-rate landlord.' },
            { q: 'How is buy-to-let income taxed?', a: 'For individuals, rental profit is taxed at your income-tax rate, with mortgage interest only attracting a 20% credit rather than being deductible. Companies pay corporation tax with interest fully deductible.' },
            { q: 'What stamp duty do I pay on a buy-to-let?', a: 'Standard SDLT plus a 5% surcharge on every band, because it is an additional property. Use the Stamp Duty calculator for the exact figure.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={[
          { href: '/rental-yield-calculator', label: 'Rental Yield', hint: 'Gross/net yield & ICR' },
          { href: '/stamp-duty-calculator', label: 'Stamp Duty', hint: 'Inc. 5% BTL surcharge' },
          { href: '/mortgage-calculator', label: 'Mortgage Calculator', hint: 'Interest-only vs repayment' },
          { href: '/property-cgt-calculator', label: 'Property CGT', hint: 'Tax when you sell' },
          { href: '/buy-vs-rent', label: 'Buy vs Rent', hint: 'Live there instead?' },
          { href: '/category/property', label: 'All Property Tools', hint: 'The full hub' },
        ]} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}

// force rebuild 20260614T221951Z
