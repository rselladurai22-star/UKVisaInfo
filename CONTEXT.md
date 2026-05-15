# UK Visa Info — Project Context

> Read this first when resuming work on a new machine or session. It captures
> the current state, key decisions, and pending work so you can pick up cold.

Last updated: **15 May 2026**

---

## Live URLs

- **Production:** https://ukvisainfo.co.uk
- **Vercel fallback:** https://uk-visa-info.vercel.app
- **GitHub:** https://github.com/rselladurai22-star/UKVisaInfo
- **Vercel project:** `erselladurais-projects/uk-visa-info`
- **GitHub auto-deploy:** wired — `git push origin main` triggers production build

## Accounts & credentials

- **Domain registrar / DNS:** Cloudflare — domain `ukvisainfo.co.uk`
- **Email:** Cloudflare Email Routing → forwards to `rselladurai22@gmail.com`
  - `contact@ukvisainfo.co.uk` → working
  - `privacy@ukvisainfo.co.uk` → working
- **Google AdSense:** publisher ID `ca-pub-9854912596289421`
  - Status: **Site verified, under review** (submitted ~Apr 28, 2026)
  - CMP: Google Funding Choices configured (3-choice EU/UK consent)
- **Google Search Console:** verified with meta tag `pQMCtigbsU9Fme1xW_J9UqPEbmzm0O7ZX7vifV4kgjA`
  - Sitemap: **success** status; auto-updates on each deploy
- **Vercel Analytics:** enabled

## Vercel environment variables

Set on production env (`vercel env ls` to confirm):
- `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-9854912596289421`

## Stack

- **Framework:** Next.js 15 App Router (migrated from Vite SPA on 23 April 2026)
- **Runtime:** React 19, Node.js 20+
- **Styling:** Tailwind CSS v4 via `@tailwindcss/postcss`
- **Animation:** motion/react (Framer Motion successor — do NOT import from `framer-motion`)
- **Markdown:** react-markdown + remark-gfm (used by blog)
- **Analytics:** @vercel/analytics
- **Hosting:** Vercel (auto-deploy from `main` branch)
- **Language:** TypeScript 5.8 (strict mode)

## Design system (post 14 May redesign)

- **Typefaces:** Inter (body) + Space Grotesk (display headlines) via Google Fonts
- **Palette:** modern UK-themed — deep ink primary `#0a1530`, richer red secondary `#d9152b`, warm gold accent `#ffbf47`
- **Color tokens in `src/app/globals.css`** (Tailwind v4 `@theme` block)
- **Effects:** mesh-bg, aurora, glass nav, layered shadows (`shadow-soft`, `shadow-card`, `shadow-glow`)
- **Mobile-first:** auto-44px tap targets on touch devices, sliding drawer nav, mesh hero (no Unsplash image)

## Scripts

```bash
npm run dev    # localhost:3000
npm run build  # next build (also runs type-check)
npm run lint   # tsc --noEmit (type check only)
```

## Routes (37 prerendered pages)

### Top-level
- `/` — homepage (modern bento-grid design)
- `/visa-types` — directory with sticky filter pills
- `/eligibility` — interactive 4-step quiz
- `/costs` — fee calculator
- `/blog` — article index (featured + grid)
- `/about` — about page (AdSense requirement)
- `/privacy` — privacy policy (AdSense requirement)
- `/terms` — terms of use

### Dynamic (SSG via `generateStaticParams`)
- `/visa/[slug]` — 8 visa detail pages with FAQ schema, related blog cross-links
  - skilled-worker, student, visitor, family, health, talent, graduate, innovator-founder
- `/blog/[slug]` — 16 long-form articles (~100,000 words total)

### Static files
- `public/sitemap.xml` — 25 URLs, kept in sync with new posts
- `public/robots.txt` — points to sitemap
- `public/ads.txt` — AdSense ownership confirmation

## Components

`src/components/`:
- `AppShell.tsx` — client wrapper: Header, Footer, ApplyWizard, CookieBanner, ScrollProgress, ScrollToTop
- `Header.tsx` — modern glass nav, scroll-aware, slide-in mobile drawer
- `Footer.tsx` — modern dark footer with crown logo + dot pattern
- `Home.tsx` — homepage with mesh hero + bento grids
- `VisaTypes.tsx` — directory page with sticky filter pills (Work/Study/Family/Visit)
- `EligibilityQuiz.tsx` — 4-step interactive quiz
- `CostCalculator.tsx`
- `ApplyWizard.tsx` — guided modal mapping answers to gov.uk URLs
- `VisaDetailModal.tsx` — quick-preview modal
- `VisaFaqSection.tsx` — accordion FAQ block, rendered on each visa page
- `RelatedPosts.tsx` — blog → blog cross-links by tag overlap
- `RelatedBlogToVisa.tsx` — visa page → relevant blog articles
- `AffiliateCallouts.tsx` — auto-rendered affiliate offers on blog posts
- `CountryAutocomplete.tsx` — reusable combobox
- `GlossaryTerm.tsx` — inline term tooltip
- `CookieBanner.tsx` — custom UK GDPR consent banner (also Google CMP via AdSense)
- `AdSenseScript.tsx` — server-rendered raw script in `<head>` (driven by env var)
- `NewsTicker.tsx`, `ScrollProgress.tsx`, `ScrollToTop.tsx`, `AnimatedCounter.tsx` (NewsTicker no longer rendered in AppShell)

`src/hooks/`: `useLocalStorage.ts`, `useTheme.ts`, `useRecentVisas.ts` (created but not yet wired into UI)

## Data files (`src/data/`)

- `visaDetails.ts` — 8 visa definitions
- `glossary.ts` — 21 immigration term definitions
- `blog.ts` — 16 article objects (slug, title, description, date, body markdown, tags, readMinutes)
- `visaFaqs.ts` — 5 FAQs per visa, used for visible FAQ section + FAQPage JSON-LD
- `affiliates.ts` — affiliate offer registry, matched to articles by tag

## Blog articles (16 published)

1. uk-skilled-worker-visa-salary-threshold-2026
2. uk-student-visa-cost-2026-full-breakdown
3. uk-family-visa-minimum-income-2026-what-counts
4. brp-vs-evisa-2026-whats-changing
5. uk-visa-processing-times-2026-by-type-and-country
6. uk-graduate-visa-2026-no-sponsor-needed
7. switch-student-to-skilled-worker-visa-uk-2026
8. uk-ilr-indefinite-leave-to-remain-2026-requirements
9. uk-visitor-visa-refused-top-reasons-2026
10. uk-health-care-worker-visa-2026-complete-guide
11. uk-dependant-visa-rules-2026-spouse-children
12. uk-visa-english-language-requirement-2026
13. uk-eta-electronic-travel-authorisation-2026
14. uk-innovator-founder-visa-2026-endorsement-guide
15. uk-visit-visa-documents-checklist-2026
16. uk-skilled-worker-sponsor-licence-how-to-find-2026

## SEO setup

- Per-page `<title>`, meta description, canonical URL via Next.js Metadata API
- OpenGraph + Twitter card tags on all pages
- JSON-LD structured data:
  - WebSite + Organization in root layout
  - Article on each `/visa/[slug]` page
  - **FAQPage on each visa page** (rich results eligible)
  - **BlogPosting on each `/blog/[slug]`** page
- `og:locale: en_GB`
- Cross-links: blog ↔ blog (tag overlap), blog ↔ visa pages

## Monetization

### AdSense
- Publisher ID: `ca-pub-9854912596289421`
- Script in `<head>` via `AdSenseScript.tsx` (env-var driven)
- ads.txt at `/ads.txt` with correct line
- Google CMP configured for UK/EU consent

### Affiliates (`src/data/affiliates.ts`)
Pre-wired callouts on every blog post (tag-matched). Replace URL with real tracking link once each programme is approved:

- **Wise** — https://wise.com/affiliates (NOT YET SIGNED UP)
- **Magoosh IELTS** — https://magoosh.com/affiliates/ (NOT YET SIGNED UP)
- **Kaplan English** — via Awin (NOT YET SIGNED UP)
- **Currensea** — via Awin (NOT YET SIGNED UP)

Currently all links go to public landing pages with `utm_source=ukvisainfo` — no commission until signup.

## Deployment workflow

1. Edit code locally
2. `git add -A && git commit -m "..."`
3. `git push origin main`
4. Vercel auto-deploys to production (~45 seconds)
5. Cloudflare cache may take 5–10 min to invalidate on edge

Manual fallback: `npx vercel --prod`

## Setup on a new machine

```bash
# 1. Clone the repo
git clone https://github.com/rselladurai22-star/UKVisaInfo.git
cd UKVisaInfo

# 2. Install dependencies
npm install

# 3. Run dev server
npm run dev   # http://localhost:3000

# 4. (Optional) Link Vercel CLI for deploys / log access
npm install -g vercel
vercel link       # pick erselladurais-projects/uk-visa-info
vercel env pull   # downloads env vars to .env.local

# 5. Authenticate git for push (one-time)
#    Recommended: GitHub CLI (`gh auth login`) or SSH keys
#    DO NOT reuse the old PAT (ghp_F4uG...) — it was shared in chat
#    and should already be revoked. Create a fresh one if needed:
#    https://github.com/settings/tokens
```

## Pending work (in priority order)

### Highest-ROI next features (decision pending — last conversation)
- [ ] **SOC code salary checker** — searchable database of ~400 UK SOC 2020 codes with going rates + threshold check (1 day; highest SEO ROI)
- [ ] **Sponsor licence search tool** — searchable wrapper around Home Office register (2 days; massive monetization potential)
- [ ] **Document checklist PDF generator** — email-capture for downloadable per-visa checklist (2 days)
- [ ] **Visa fee calculator upgrade** — multi-year IHS, dependants, currency conversion (1 day)

### Monetization completion
- [ ] Wait for AdSense approval (estimated 3–14 days from 28 Apr submission)
- [ ] Once approved: add ad slot components inside blog articles (between sections, after intro)
- [ ] Sign up to **Wise affiliate** → swap URL in `src/data/affiliates.ts`
- [ ] Sign up to **Magoosh affiliate** → swap URL
- [ ] Consider Awin (covers Kaplan + Currensea + many others in one account)

### Indexing
- [ ] Manually request indexing in Search Console for the 4 newest blog URLs
- [ ] Set up **IndexNow** for Bing/Yandex (free, instant push on deploy)
- [ ] (Optional) Google Indexing API via service account JSON for auto-ping on deploy

### Content roadmap
- Target: 30+ articles by end Q3 2026
- Topic ideas: Health & Care visa specifics, ATAS clearance, UK ETA scheme, EUSS late applications, citizenship test prep, UK family visa cohabitation evidence

### Features (deferred / not started)
- [ ] Comparison tool (visa A vs visa B)
- [ ] Processing time tracker (weekly-updated dashboard)
- [ ] Visa expiry email reminder service
- [ ] Newsletter signup (Substack or Buttondown)
- [ ] AI visa assistant (chatbot via Vercel AI Gateway)
- [ ] Forum / Q&A board
- [ ] Multi-language support (Hindi, Urdu, Punjabi, Bengali, Tagalog)
- [ ] Dark mode (`useTheme` hook exists, not wired)
- [ ] Recently viewed visas (`useRecentVisas` hook exists, not wired)

## Known constraints / notes

- **Family visa minimum income** is currently £29,000 in 2026; may rise to £34,500 then £38,700 in future MAC review. Update `src/data/blog.ts` and `visaFaqs.ts` if changes.
- **IHS** is £1,035/year (adult) / £776/year (student/dependant/YMS) as of April 2026.
- **Skilled Worker general threshold** is £38,700; new-entrant rate £30,960; ISL rate £30,960.
- The site avoids ALL emoji per code style — never add unless explicitly asked.
- The user wants minimal-token, terse responses; long explanations are not appreciated.
- The `motion/react` package replaces `framer-motion` (do not import from `framer-motion`).
- **Tailwind v4 syntax:** uses `@theme` block in globals.css, NOT tailwind.config.js. Color tokens defined as `--color-*` CSS variables.
- The **Zscaler firewall on the user's Royal Mail work laptop** blocks ad-related URLs (ads.txt etc) — test from phone or personal device.

## Historical decisions & milestones

- **23 Apr 2026:** Migrated from Vite SPA to Next.js 15 SSR for per-page SEO. Each visa now a real indexable URL.
- **28 Apr 2026:** Initial commit pushed to GitHub; Vercel ↔ GitHub auto-deploy connected; AdSense application submitted; Cloudflare Email Routing live.
- **29 Apr 2026:** AdSense site verified; Google CMP configured. Site fully under AdSense review.
- **14 May 2026:** Major UI redesign — modern bento grids, glass nav, mesh hero, mobile-first responsive overhaul. New typography (Inter + Space Grotesk). Refreshed palette.
- **15 May 2026:** Decision pending on next feature build (SOC salary checker / sponsor licence search / document checklists).
- **Old project name:** Was `uk-visa-hub` on Vercel — deleted; replaced with `uk-visa-info` to match domain.
- **Sitemap:** First version had hash-fragment URLs (`/#section`) which Google rejected. Now contains only real route URLs.

## Useful commands reference

```bash
# View recent deployments
npx vercel ls

# Inspect a specific deployment
npx vercel inspect <deployment-url>

# Tail production logs
npx vercel logs <deployment-url>

# Pull production env vars to .env.local
npx vercel env pull

# Add a new env var (production)
npx vercel env add NAME production

# Force a redeploy
npx vercel --prod --yes
```
