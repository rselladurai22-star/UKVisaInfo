# UKDesk calculator hub — build handoff

## Background
Repo: Next.js 15 (App Router) + React 19 + Tailwind v4, TypeScript. Site: ukvisainfo.co.uk (brand "UKDesk").
Goal: a hub of free, accurate, SEO-strong UK calculators, organised by category. Each category's
calculators follow a single flagship pattern, then are listed in the category hub.

Already DONE (live, on the shared pattern) — do NOT redo:
- Property (13), Insurance (6), Pensions/Savings (6), Tax & Income (13), Loans (6 of 10).

Your job: build the REMAINING calculators (see "Tasks"), one category at a time, to the exact same
pattern, then wire them into the hub. Push per category.

## Architecture & conventions (follow exactly)

### Shared UI kit — `src/components/calc-ui/index.tsx`
Import everything from here. Key exports:
- `CalcShell({ breadcrumb, title, subtitle, calcLabel?, controls?, inputs, results, children })`
  — breadcrumb + H1 + subtitle, 2-col layout (inputs left / sticky results right), a **Calculate
  button that gates the results** (results hidden until pressed), and `children` = the long-form
  guide below. Mobile-first handled here.
- `Guide({ kicker?, title, intro, children })`, `GuideSection({ kicker?, title, children })`,
  `Mistakes({ items: [string,string][] })`, `FAQ({ items: {q,a}[] })`,
  `RelatedTools({ items: {href,label,hint}[] })`.
- Inputs: `Panel({title,icon?,action?,children})`, `Field({label,hint?})`, `MoneyInput`,
  `NumberInput`, `Slider`, `Choice<T>` (radio), `Toggle`.
- Output: `Stat({label,value,sub?,tone?,big?})` (tone: default|primary|accent|dark),
  `Donut({segments,centerLabel?,centerValue?})`, `LineChart({series,labels,format?})`
  (series item `{points:number[],color,label,dashed?,payoffIndex?}`), `BarTrack({segments})`,
  `Callout({tone:'info'|'warn'|'tip', title, children})`.
- Helpers: `gbp(n, dp?)`, `pct(n, dp?)`.

### Tax engine — `src/lib/tax2526.ts`
Reuse for tax/NI/dividends/CGT. Exports: `incomeTax`, `employeeNI`, `class4NI`, `dividendTax`,
`cgt`, `studentLoan`, `personalAllowance`, constants (PA_BASE 12570, BASIC_BAND 37700, …), `gbp`.
Add shared constants here; keep all rates 2025/26.

### Hub data — `src/data/hubTools.ts`
`HUB_TOOLS: Record<CategoryId, HubGroup[]>`. Item: `{ label, href, hint, status:'live'|'soon', xref? }`.
`/category/[category]` and `/tools` render automatically from this — after building a page set its
item `status:'live'` (add it if missing). Group into 2–3 sub-sections per category.

### Page pattern (every calculator)
Two files per slug:
1. `src/app/<slug>/page.tsx` — server: `export const metadata` (title ~60 chars incl "2025/26" +
   "| UKDesk", description, canonical, openGraph) + default returning the client component.
2. `src/app/<slug>/<Name>.tsx` — `'use client'`; `useState`/`useMemo`; returns
   `<CalcShell ... inputs={...} results={...}> <Guide ...>…</Guide> </CalcShell>`.

Chart accents: `const PRIMARY = '#0037b0'; const ACCENT = '#bb0027';`. Otherwise use site design
tokens via Tailwind (`bg-surface`, `text-on-surface`, `text-on-surface-variant`,
`border-outline-variant`, `bg-surface-container-lowest`, `text-primary`, `text-secondary`, …).
No hardcoded hex for layout. No external images.

REBUILDING a bespoke page: keep the slug, rewrite `page.tsx` to import the new component, create the
new component, `rm` the old `*Client.tsx`. Keeps links/sitemap valid.

### Content rules (this is a content site)
- Independently research and use ACCURATE UK 2025/26 figures. Don't trust placeholders.
- Calculator: clear inputs, live `useMemo` results, charts/breakdowns where useful, Calculate button via CalcShell.
- Guide below: ~1500–2500 words, 5–7 `GuideSection`s incl. a worked example, a `Mistakes` list, an
  `FAQ` (4–5), and `RelatedTools`. Plain UK English. Label outputs as estimates. Use `Callout tone="warn"` for traps/deadlines.

### Quality gate & git
- `npx tsc --noEmit` must be clean before committing.
- Commit per category; push to `main`. End commit body with a `Co-Authored-By:` trailer.
- Do not run a dev server/browser to verify — rely on tsc; the user verifies visually.

## Minimal page skeleton
```tsx
// src/app/vat-calculator/Vat.tsx
'use client';
import { useMemo, useState } from 'react';
import { gbp, pct, CalcShell, Panel, Stat, Field, MoneyInput, Choice,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools } from '../../components/calc-ui';

const RELATED = [ /* {href,label,hint} … */ ];

export default function Vat() {
  const [amount, setAmount] = useState(1000);
  const [mode, setMode] = useState<'add'|'remove'>('add');
  const r = useMemo(() => { /* compute */ return {}; }, [amount, mode]);
  return (
    <CalcShell
      breadcrumb={[{label:'Home',href:'/'},{label:'Business',href:'/category/business'},{label:'VAT'}]}
      title="VAT Calculator" subtitle="…" calcLabel="Calculate VAT"
      inputs={<Panel title="Amount">{/* Fields */}</Panel>}
      results={<>{/* Stat, Panel, Callout */}</>}
    >
      <Guide title="VAT explained" intro="…">
        <GuideSection kicker="Basics" title="…">…</GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
```

## Key UK 2025/26 figures (verify, then use)
- Income tax (rUK): PA £12,570 (tapered £1/£2 over £100k, gone £125,140); 20% to £50,270, 40% to £125,140, 45% above.
- Employee NI 8% (£12,570–£50,270) then 2%. Class 4 self-emp 6%/2%. Employer NI 15% (secondary threshold £5,000).
- VAT 20%; registration threshold £90,000.
- Corporation Tax: 19% (≤£50k), 25% (≥£250k), marginal relief between (fraction 3/200).
- Dividend allowance £500; 8.75/33.75/39.35%. CGT allowance £3,000; 18%/24%.
- Business rates: RV × multiplier (small ~49.9p / standard ~55.5p); SBRR 100% under £12,000 RV, tapered to £15,000.
- State Pension full £230.25/wk; ISA £20,000; LISA £4,000 + 25% bonus.
- Statutory pay: SSP £118.75/wk; SMP 90% then £187.18/wk; SPP/ShPP £187.18/wk; redundancy weekly cap £719; NLW £12.21.
- IHT: NRB £325k, RNRB £175k (taper over £2m), 40% (36% with 10% to charity).
Always confirm current figures before shipping.

## Tasks (this order; ~6 per category). Mark each `status:'live'` in hubTools.ts.

### 1. Business & Self-Employed — build 6 NEW
- `vat-calculator` (add/remove 20% VAT; flat-rate note)
- `corporation-tax-calculator` (19/25% + marginal relief)
- `sole-trader-vs-limited` (take-home comparison; tax2526 + dividend + corp tax)
- `employer-cost-calculator` (gross salary → true cost incl employer NI 15% + min pension)
- `salary-vs-dividend-calculator` (optimal director split)
- `business-rates-calculator` (RV × multiplier, small business relief)
Hub xrefs (live): /self-employed-tax, /contractor-ir35, /director-dividend.

### 2. Estate / Wills & Probate — build 5 (Inheritance Tax already live at /inheritance-tax)
- `probate-fee-calculator` (E&W £300 fee if estate >£5,000; solicitor cost note)
- `will-writing-cost` (DIY vs solicitor vs will-writer ranges)
- `power-of-attorney-cost` (LPA £82 per type registration; property & health)
- `estate-value-calculator` (assets − debts = net estate; feeds IHT)
- `gift-iht-calculator` (7-year taper relief on PETs)

### 3. Employment & Salary — REBUILD 6 bespoke onto CalcShell (reuse slugs; delete old *Client.tsx)
- `salary-compare`, `holiday-pay`, `redundancy-pay`, `maternity-pay`, `sick-pay`, `minimum-wage-checker`
- Optionally add: `overtime-pay`, `paternity-pay`, `settlement-agreement-calculator`, `company-car-bik-calculator`.

### 4. Vehicles & Motoring — build 3 NEW (keep ulez-check, mot-check, postcode — API lookups)
- `vehicle-tax-calculator` (VED by CO2/first-year + standard; £40k expensive-car supplement)
- `car-running-costs` (fuel + insurance + tax + maintenance + depreciation)
- `fuel-cost-calculator` (MPG/price → cost per journey/year)
Hub xref: /car-finance-calculator (Loans).

### 5. Energy & Bills — REBUILD energy-bill + build 3
- `energy-bill` (Ofgem price cap; rebuild)
- `solar-panel-roi`, `heat-pump-calculator`, `ev-charging-cost` (new)

### 6. Benefits — REBUILD childcare + build 4
- `childcare-calculator` (rebuild; 15/30 free hours, Tax-Free Childcare)
- `universal-credit-calculator`, `council-tax-support-checker`, `pip-benefit-checker`, `carers-allowance-calculator` (new)

### 7. Family Law — build 4 NEW
- `divorce-cost-calculator` (£593 court fee + legal ranges)
- `financial-settlement-calculator` (asset split estimate)
- `child-maintenance-calculator` (CMS gross-income rates 12/16/19% by # children, shared-care reductions)
- `spousal-maintenance-calculator` (needs-based estimate)

### 8. Loans — finish the 4 soon
- `loan-comparison-calculator`, `balance-transfer-calculator`, `loan-affordability-calculator` (DTI), `loan-early-repayment-calculator`

### 9. Immigration — mostly already live (visa-types, eligibility, tools/cost-calculator,
tools/salary-checker, tools/sponsor-search, tools/refusal-analyzer, ihs-calculator,
skilled-worker-points-check). Bespoke; optional polish onto CalcShell later. Lower priority.

## Definition of done per category
1. All listed pages build; `npx tsc --noEmit` clean.
2. Each new/rebuilt page `status:'live'` in `src/data/hubTools.ts`, grouped sensibly.
3. Old bespoke `*Client.tsx` removed for rebuilt slugs.
4. Committed and pushed to `main`.
