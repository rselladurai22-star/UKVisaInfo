'use client';

import { useMemo, useState } from 'react';
import {
  pct, CalcShell, Panel, Stat, Field, MoneyInput, NumberInput,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp, incomeTax, employeeNI, dividendTax, PA_BASE } from '../../lib/tax2526';
import { TAX_RELATED } from '../take-home-pay/TakeHome';

function corpTax(profit: number) {
  if (profit <= 0) return 0;
  if (profit <= 50000) return profit * 0.19;
  if (profit >= 250000) return profit * 0.25;
  return profit * 0.25 - (250000 - profit) * 0.015; // marginal relief band
}

export default function ContractorIR35() {
  const [dayRate, setDayRate] = useState(450);
  const [days, setDays] = useState(220);
  const [accountancy, setAccountancy] = useState(1500);

  const r = useMemo(() => {
    const revenue = dayRate * days;

    // Outside IR35 — limited company, low salary + dividends
    const salary = PA_BASE; // £12,570
    const profitBeforeCT = Math.max(0, revenue - accountancy - salary);
    const ct = corpTax(profitBeforeCT);
    const dividends = profitBeforeCT - ct;
    const divTax = dividendTax(salary, dividends);
    const netOutside = salary - incomeTax(salary) - employeeNI(salary) + dividends - divTax;

    // Inside IR35 / umbrella — revenue treated as employment income after employer NI
    const employeeGross = (revenue + 5000 * 0.15) / 1.15; // strip ~15% employer NI (ST £5,000)
    const netInside = employeeGross - incomeTax(employeeGross) - employeeNI(employeeGross);

    return {
      revenue, ct, dividends, netOutside, netInside,
      diff: netOutside - netInside,
      retOut: revenue ? (netOutside / revenue) * 100 : 0,
      retIn: revenue ? (netInside / revenue) * 100 : 0,
    };
  }, [dayRate, days, accountancy]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Tax', href: '/category/tax' }, { label: 'Contractor & IR35' }]}
      title="Contractor IR35 Calculator"
      subtitle="Compare your take-home as a limited-company contractor working outside IR35 versus inside IR35 (or via an umbrella) — and see how much the determination really costs you."
      calcLabel="Compare take-home"
      inputs={
        <Panel title="Your contract">
          <div className="space-y-4">
            <Field label="Day rate"><MoneyInput value={dayRate} onChange={setDayRate} step={25} /></Field>
            <Field label="Billable days per year"><NumberInput value={days} onChange={setDays} suffix="days" /></Field>
            <Field label="Accountancy fees / yr" hint="Ltd company running cost"><MoneyInput value={accountancy} onChange={setAccountancy} step={100} /></Field>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="Outside IR35 (Ltd)" value={gbp(r.netOutside)} sub={`${pct(r.retOut)} kept`} tone="dark" big />
            <Stat label="Inside IR35 / umbrella" value={gbp(r.netInside)} sub={`${pct(r.retIn)} kept`} tone="accent" />
            <Stat label="Difference" value={gbp(Math.abs(r.diff))} sub="outside advantage" />
          </div>
          <Panel title="Side by side (annual)">
            <div className="overflow-x-auto rounded-lg border border-outline-variant">
              <table className="w-full text-sm">
                <thead className="bg-surface-container-low text-left"><tr><th className="px-3 py-2 font-bold"></th><th className="px-3 py-2 font-bold text-right">Outside (Ltd)</th><th className="px-3 py-2 font-bold text-right">Inside / umbrella</th></tr></thead>
                <tbody className="divide-y divide-outline-variant/60">
                  <tr><td className="px-3 py-2 text-on-surface-variant">Gross revenue</td><td className="px-3 py-2 text-right tabular-nums">{gbp(r.revenue)}</td><td className="px-3 py-2 text-right tabular-nums">{gbp(r.revenue)}</td></tr>
                  <tr><td className="px-3 py-2 text-on-surface-variant">Corporation Tax</td><td className="px-3 py-2 text-right tabular-nums">{gbp(r.ct)}</td><td className="px-3 py-2 text-right">—</td></tr>
                  <tr><td className="px-3 py-2 font-bold">Net take-home</td><td className="px-3 py-2 text-right tabular-nums font-bold text-primary">{gbp(r.netOutside)}</td><td className="px-3 py-2 text-right tabular-nums font-bold text-primary">{gbp(r.netInside)}</td></tr>
                </tbody>
              </table>
            </div>
          </Panel>
          <Callout tone="warn" title="An estimate — IR35 is complex">
            Real figures depend on expenses, pension contributions, VAT/flat-rate scheme, umbrella margins and your
            exact status. Outside IR35 must be genuine — wrongly working outside when inside risks back-tax and
            penalties. Take specialist advice and consider a status review (CEST/contract assessment).
          </Callout>
        </>
      }
    >
      <Guide
        title="IR35 and contractor take-home"
        intro="IR35 decides whether you're genuinely in business or a 'disguised employee'. It dramatically changes your take-home. This guide explains the difference and how the numbers work."
      >
        <GuideSection kicker="The basics" title="What IR35 is">
          <p>IR35 (the off-payroll working rules) asks whether, ignoring your limited company, you&apos;d be an employee of the client. If the working relationship looks like employment — control, no right of substitution, mutuality of obligation — you&apos;re <strong>inside IR35</strong> and taxed like an employee. If you&apos;re genuinely in business on your own account, you&apos;re <strong>outside IR35</strong> and can use the tax-efficient salary-plus-dividends model. For most medium and large clients, the client (not you) decides your status.</p>
        </GuideSection>
        <GuideSection kicker="Outside IR35" title="The limited-company model">
          <p>Working outside IR35 through your own company, you typically take a <strong>small salary</strong> (around the £12,570 allowance) and the rest as <strong>dividends</strong> from post-Corporation-Tax profit. This avoids most National Insurance and uses lower dividend tax rates, so your retained income is higher. You also control timing, can pay into a pension from the company, and may use the VAT flat-rate scheme — but you carry the admin and the risk of getting status wrong.</p>
        </GuideSection>
        <GuideSection kicker="Inside IR35" title="Umbrella and PAYE">
          <p>Inside IR35, your fee is treated as <strong>employment income</strong>. Via an umbrella company, the assignment rate must cover <strong>employer&apos;s National Insurance</strong> (15%), the apprenticeship levy and the umbrella&apos;s margin before your gross pay is worked out — then you pay PAYE Income Tax and employee NI on that. The result is materially lower take-home than outside IR35, which is why the determination matters so much. Always check whether a quoted rate is the &quot;assignment rate&quot; (umbrella) or your gross.</p>
          <Callout tone="tip" title="Negotiate a higher inside rate">Because inside-IR35/umbrella work costs you more in tax and employer NI, it&apos;s reasonable to seek a higher day rate for inside roles to offset the difference.</Callout>
        </GuideSection>
        <GuideSection kicker="Status" title="Getting the determination right">
          <p>Status is about the reality of the engagement, not the contract wording alone. Key tests are <strong>control</strong> (how/when/where you work), <strong>substitution</strong> (can you send someone else?), and <strong>mutuality of obligation</strong>. HMRC&apos;s CEST tool gives an indication, but many contractors get an independent contract-and-working-practices review. Operating outside IR35 when you&apos;re really inside can lead to back-taxes, interest and penalties.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Confusing assignment rate with gross pay', 'Umbrella assignment rates include employer NI and margin — your gross is lower.'],
            ['Assuming a contract clause sets status', 'Actual working practices matter more than wording. Get a proper status review.'],
            ['Working outside IR35 without evidence', 'If HMRC disagrees, you face back-tax and penalties. Document genuine business behaviour.'],
            ['Ignoring pension contributions', 'Company pension contributions are very efficient outside IR35 and reduce Corporation Tax.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How much more do I keep outside IR35?', a: 'Often noticeably more — the salary-plus-dividends model avoids most NI and uses lower dividend rates. The exact gap depends on your rate, expenses and pension contributions; the calculator estimates it.' },
            { q: 'Who decides my IR35 status?', a: 'For medium and large private-sector and public-sector clients, the client decides and issues a Status Determination Statement. For small clients, your own company decides.' },
            { q: 'What is an umbrella company?', a: 'An employer that takes your assignment rate, deducts employer NI, levy and a margin, then pays you PAYE. Used for inside-IR35 roles; take-home is lower than a limited company outside IR35.' },
            { q: 'Is this calculator exact?', a: 'No — it&apos;s an estimate excluding VAT, detailed expenses, pension and umbrella margins. Use it to compare scenarios, then get specialist advice.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={TAX_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
