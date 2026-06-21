# Blog authoring guide

How to write a blog post. **You only ever touch data + markdown — never the layout.**
Every post automatically gets the same shell: hero, sticky right sidebar (auto
table-of-contents → related calculators → related articles → cross-site links),
share rail, ads, comments, and the bottom CTA. Design is identical everywhere;
only the **content, structure, and data** change post to post.

---

## 1. Create the post

Add an entry to [`src/data/blogGuides.ts`](../src/data/blogGuides.ts) (visa posts live in
`blogVisa.ts`). That's the only file you edit to publish.

```ts
{
  slug: 'my-new-post-2025-26',          // URL: /blog/my-new-post-2025-26
  title: 'My New Post Title',
  description: 'One-sentence summary shown in the hero + search results.',
  date: '2026-06-21',                    // ISO, first published
  updated: '2026-06-21',                 // ISO, last touched (drives the "Updated" badge ≤30 days)
  category: 'money',                     // visa | money | property | business | benefits | family | motoring | energy | estate
  tags: ['Income Tax', 'Dividends'],     // first tag also used for related-article matching
  relatedTools: [                        // optional — "Keep going" sidebar cards; falls back to category defaults
    { href: '/dividend-tax-calculator', label: 'Dividend Tax', hint: '2025/26 rates' },
  ],
  body: `...markdown...`,                 // see §2
}
```

**Automatic — do NOT set by hand:**
- `readMinutes` — auto-estimated from the body (~225 wpm). Set it only to override.
- **Table of contents** — auto-built from your `## ` headings (shows when there are 3+).
- Thumbnail, breadcrumb, JSON-LD (Article + Breadcrumb + FAQ), OpenGraph image.

---

## 2. Body: markdown + blocks

The `body` is GitHub-flavoured markdown. On top of normal markdown you have **blocks** —
each one is a `> [!TYPE]` line. Use any blocks, any number, in any order. They all render
on-brand. Post A can be 10 tables + 1 chart; post B can be 2 charts + a flow diagram +
images + bullets. Both look consistent.

### Plain markdown (styled automatically)
```md
## Section heading          → big heading + anchor + appears in the ToC
### Sub-heading
Normal paragraph text with **bold**, *italic*, [a link](/take-home-pay) and `code`.

- bullet point              → blue-dot list
1. numbered step            → numbered badge list

| Band | Rate |               → rounded, scrollable, hover-highlight table
|------|------|
| Basic | 20% |
```

### Callouts
```md
> [!INFO] Quick context note.
> [!TIP] A helpful tip.
> [!WARNING] Something to watch out for.
> [!NOTE] A neutral aside.
```

### Stat card
```md
> [!STAT] £41,700 | Minimum skilled-worker salary 2026
```

### Key takeaways
```md
> [!KEY] What you need to know
> - First key point
> - Second key point
```

### Steps / timeline
```md
> [!STEPS]
> 1. **Check eligibility** — Confirm you meet the salary threshold.
> 2. **Get a CoS** — Your employer assigns a Certificate of Sponsorship.
```

### Checklist (interactive, remembers ticks)
```md
> [!CHECKLIST] documents
> - Passport valid 6 months
> - Certificate of Sponsorship
```

### FAQ accordion (also generates FAQ rich-results)
```md
> [!FAQ]
> Q: Can I switch from a Student visa?
> A: Yes, switching in-country is allowed.
>
> Q: What is the minimum salary?
> A: £41,700 from April 2026.
```

### Pull quote
```md
> [!QUOTE]
> The hardest part is finding a sponsor licence holder.
> — Sarah, immigration solicitor
```

### Charts — rows are `Label :: number :: display` (display optional)
```md
> [!BARS] Salary by role            (horizontal bar chart — compare values)
> Nurse :: 37000 :: £37,000
> Teacher :: 33000 :: £33,000

> [!LINE] Take-home by salary       (trend line — value across a series)
> £20k :: 17920 :: £17,920
> £30k :: 25120 :: £25,120
> £40k :: 32320 :: £32,320

> [!DONUT] Where your £1 goes        (donut / composition split)
> Take-home :: 68 :: 68%
> Income tax :: 22 :: 22%
> NI :: 10 :: 10%
```

### Flow / process diagram — rows are `Label :: detail :: tag` (detail/tag optional)
```md
> [!FLOW] How a sponsored application flows
> Find a sponsor :: Employer holds a licence :: required
> Get a CoS :: Certificate of Sponsorship issued :: 3 months
> Apply online :: Pay the fee + IHS
```

### Image — `src | caption | WIDTHxHEIGHT` (caption + size optional, default 1600×900)
```md
> [!IMAGE] /blog/my-diagram.png | How the tax bands stack up | 1200x800
```
Put the file in `public/blog/`. It's served optimized (`next/image`) with a caption.

---

## 3. Adding a brand-new block type (rare)

If you need a format that doesn't exist yet (e.g. a map, a comparison slider):

1. Add the directive to the regex + a `case` in [`parseSegments.ts`](../src/components/blog/parseSegments.ts).
2. Build the component in `src/components/blog/blocks/`.
3. Wire it into the `switch` in [`ArticleBody.tsx`](../src/components/blog/ArticleBody.tsx).

After that, **every** post can use it from markdown — automatically on-brand.

---

## Where the design lives (don't edit per-post)

| Concern | File |
|---|---|
| Whole-page layout (hero, grid, sidebar, footer, CTA) | `src/components/blog/BlogShell.tsx` |
| Right sidebar (ToC, Keep going, Related, Across site) | `src/components/blog/BlogSidebar.tsx` |
| Auto table of contents | `src/components/blog/BlogToc.tsx` |
| Markdown + block rendering | `src/components/blog/ArticleBody.tsx` |
| Block components | `src/components/blog/blocks/*` |

Change any of these once → every one of the posts updates.
