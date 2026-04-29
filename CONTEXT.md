# UK Visa Info — Project Context

> Read this first when resuming work on a new machine or session. It captures
> the current state, key decisions, and pending work so you can pick up cold.

Last updated: **29 April 2026**

---

## Live URLs

- **Production:** https://ukvisainfo.co.uk
- **Vercel fallback:** https://uk-visa-info.vercel.app
- **GitHub:** https://github.com/rselladurai22-star/UKVisaInfo
- **Vercel project:** `erselladurais-projects/uk-visa-info`

## Domain & DNS

- Domain registrar: **Cloudflare** (purchased April 2026)
- DNS: Cloudflare (A `76.76.21.21`, CNAME `cname.vercel-dns.com`)
- Apex (`ukvisainfo.co.uk`) and `www` both attached to Vercel project
- Google Search Console verified with meta tag `pQMCtigbsU9Fme1xW_J9UqPEbmzm0O7ZX7vifV4kgjA`

## Stack

- **Framework:** Next.js 15 App Router (migrated from Vite SPA on 23 April 2026)
- **Runtime:** React 19, Node.js 20+
- **Styling:** Tailwind CSS v4 via `@tailwindcss/postcss`
- **Animation:** motion/react (Framer Motion successor)
- **Markdown:** react-markdown + remark-gfm (used by blog)
- **Analytics:** @vercel/analytics
- **Hosting:** Vercel (auto-deploy from `main` branch)
- **Language:** TypeScript 5.8 (strict mode)

## Scripts

```bash
npm run dev    # localhost:3000
npm run build  # next build (verify before push if uncertain)
npm run lint   # tsc --noEmit (type check only)
```

## Routes (25 prerendered pages)

### Top-level
- `/` — homepage (Hero, AnimatedCounter, NewsTicker, etc.)
- `/visa-types` — directory of visa routes
- `/eligibility` — interactive 4-step quiz
- `/costs` — fee calculator
- `/blog` — article index

### Dynamic (SSG via `generateStaticParams`)
- `/visa/[slug]` — 8 visa detail pages from `src/data/visaDetails.ts`:
  skilled-worker, student, visitor, family, health, talent, graduate, innovator-founder
- `/blog/[slug]` — 9 long-form articles from `src/data/blog.ts`

## Components

`src/components/`:
- `AppShell.tsx` (client wrapper: Header, NewsTicker, Footer, ApplyWizard, ScrollProgress, ScrollToTop)
- `Header.tsx` — desktop + mobile nav with `next/link`, `usePathname`
- `Home.tsx` — homepage; uses `useRouter` for nav
- `VisaTypes.tsx` — visa directory grid
- `EligibilityQuiz.tsx` — 4-step interactive quiz
- `CostCalculator.tsx`
- `ApplyWizard.tsx` — guided modal mapping answers to gov.uk URLs
- `VisaDetailModal.tsx` — modal preview (used inside quiz)
- `CountryAutocomplete.tsx` — reusable combobox
- `GlossaryTerm.tsx` — inline term tooltip; uses `src/data/glossary.ts` (21 terms)
- `NewsTicker.tsx`, `ScrollProgress.tsx`, `ScrollToTop.tsx`, `AnimatedCounter.tsx`, `Footer.tsx`

`src/hooks/`: `useLocalStorage.ts`, `useTheme.ts`, `useRecentVisas.ts` (created but not yet wired into UI)

## Data

- `src/data/visaDetails.ts` — 8 visas (id, title, fee, ihs, eligibility, documents, steps, etc.)
- `src/data/glossary.ts` — 21 immigration term definitions
- `src/data/blog.ts` — 9 articles (slug, title, description, date, body markdown)

## Blog articles (all published)

1. uk-skilled-worker-visa-salary-threshold-2026
2. uk-student-visa-cost-2026-full-breakdown
3. uk-family-visa-minimum-income-2026-what-counts
4. brp-vs-evisa-2026-whats-changing
5. uk-visa-processing-times-2026-by-type-and-country
6. uk-graduate-visa-2026-no-sponsor-needed
7. switch-student-to-skilled-worker-visa-uk-2026
8. uk-ilr-indefinite-leave-to-remain-2026-requirements
9. uk-visitor-visa-refused-top-reasons-2026

## SEO

- `public/sitemap.xml` — 18 URLs, submitted to Google Search Console (status: success)
- `public/robots.txt` — `Sitemap: https://ukvisainfo.co.uk/sitemap.xml`
- Per-page `<title>`, meta description, canonical URL via Next.js Metadata API
- OpenGraph + Twitter card tags on all pages
- JSON-LD structured data:
  - WebSite + Organization in root layout
  - Article on `/visa/[slug]`
  - BlogPosting on `/blog/[slug]`
- `og:locale: en_GB`

## Deployment workflow

- `git push origin main` → Vercel auto-deploys to production (wired 28 April 2026)
- Pull requests → Vercel preview URLs
- Manual fallback: `npx vercel --prod`

## Setup on a new machine

```bash
git clone https://github.com/rselladurai22-star/UKVisaInfo.git
cd UKVisaInfo
npm install
npm run dev

# Optional — link Vercel CLI for manual deploys / log access
npm install -g vercel
vercel link  # pick erselladurais-projects/uk-visa-info
```

## Pending work (in priority order)

### Monetization (next major milestone)
- [ ] Apply for **Google AdSense** — site now meets content bar (9 blog articles, 25 indexable pages)
- [ ] Add AdSense banner slot to blog article pages (between sections / after intro)
- [ ] Add affiliate links: Wise (money transfer), Kaplan/IELTS prep, UK SIM cards
- [ ] Add 1 affiliate per blog post in context (e.g. Wise on family visa post, IELTS on student post)
- [ ] Consider lead-gen form for solicitor referrals (highest £/lead)

### Indexing
- [ ] Manually request indexing in Search Console for the 4 newest blog URLs (rate limit: 10/day)
- [ ] Set up **IndexNow** for Bing/Yandex (free, instant)
- [ ] (Optional) Set up Google Indexing API via service account for Google auto-ping on deploy

### SEO improvements
- [ ] Add internal cross-links between blog posts and visa detail pages (some done)
- [ ] Add FAQ section on each visa detail page with FAQPage JSON-LD
- [ ] Add author bio / E-E-A-T signal pages
- [ ] Add "Last updated" badge on each article (data already in `BLOG_POSTS`)

### Features (deferred from earlier scaffolding)
- [ ] Checklist component (per visa)
- [ ] Compare visas side-by-side
- [ ] Save / share visa results
- [ ] Processing time estimator
- [ ] Dark mode (`useTheme` hook exists, not wired)
- [ ] Cookie consent banner (required for AdSense in UK)
- [ ] Recently viewed (`useRecentVisas` hook exists, not wired)

### Content roadmap
- [ ] 5 more blog articles to reach 14 (target: 20+ by end of Q3 2026)
- [ ] Topic ideas: Health & Care visa, ATAS clearance, ETA scheme for visitors, EUSS late applications, citizenship test prep

## Known constraints / notes

- **Family visa minimum income** is currently £29,000 in 2026; may rise to £34,500 then £38,700 in future. Update `src/data/blog.ts` if/when MAC review concludes.
- **IHS** is £1,035/year (adult) / £776/year (student/dependant/YMS) as of April 2026.
- **Skilled Worker general threshold** is £38,700; new-entrant rate £30,960; ISL rate £30,960.
- The site avoids ALL emoji per code style — never add unless explicitly asked.
- The user wants minimal-token, terse responses; long explanations are not appreciated.
- The `motion/react` package replaces `framer-motion` (do not import from `framer-motion`).

## Historical decisions

- **23 Apr 2026:** Migrated from Vite SPA to Next.js 15 SSR for per-page SEO. Each visa is now a real indexable URL.
- **28 Apr 2026:** Initial commit pushed to GitHub; Vercel ↔ GitHub auto-deploy connected.
- **Old project name:** Was `uk-visa-hub` on Vercel — deleted; replaced with `uk-visa-info` to match domain.
- **Sitemap:** First version included hash-fragment URLs (`/#section`) which Google rejected as "couldn't fetch." Now contains only real route URLs.

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
```
