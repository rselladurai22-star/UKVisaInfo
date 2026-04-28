# UK Visa Info

Live at **[ukvisainfo.co.uk](https://ukvisainfo.co.uk)** — Next.js 15 SSR site with up-to-date 2026 UK visa guidance.

## Stack

- Next.js 15 (App Router) + React 19
- Tailwind CSS v4 (`@tailwindcss/postcss`)
- TypeScript 5.8
- motion/react for animations
- react-markdown + remark-gfm for blog content
- Vercel hosting + analytics
- Cloudflare DNS for `ukvisainfo.co.uk`

## Routes (25 prerendered pages)

- `/` — homepage
- `/visa-types` — directory of visa routes
- `/eligibility` — interactive 4-step quiz
- `/costs` — fee calculator
- `/visa/[slug]` — 8 detail pages (skilled-worker, student, visitor, family, health, talent, graduate, innovator-founder)
- `/blog` — article index
- `/blog/[slug]` — 9 long-form articles

## Local development

```bash
npm install
npm run dev   # http://localhost:3000
npm run build
npm run lint  # tsc --noEmit
```

## Deploy

Connected to Vercel — pushing to `main` triggers a production deploy.

Manual deploy (fallback):
```bash
npx vercel --prod
```

## SEO

- Sitemap: `public/sitemap.xml` (submitted to Google Search Console)
- robots.txt: `public/robots.txt`
- Per-page metadata via Next.js Metadata API
- BlogPosting + Article JSON-LD on detail pages
- WebSite + Organization JSON-LD in root layout

## Status

Indexable pages: 25 · Blog articles: 9 · Monetization: not yet wired
