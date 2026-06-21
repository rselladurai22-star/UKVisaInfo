'use client';

import { useEffect, useRef } from 'react';

/**
 * Giscus comments, GitHub Discussions backed, free, no email harvesting.
 *
 * Setup steps (one-time):
 *   1. Make the GitHub repo public (or use a separate public discussions repo).
 *   2. Install the Giscus app on that repo: https://github.com/apps/giscus
 *   3. Enable Discussions in repo settings, create a "Comments" category.
 *   4. Generate config at https://giscus.app and copy the four IDs into
 *      NEXT_PUBLIC_GISCUS_* env vars (.env.local / Vercel).
 *
 * Without env vars set, the component renders nothing, no broken state.
 */
export default function Comments({ term }: { term: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const repo       = process.env.NEXT_PUBLIC_GISCUS_REPO;
  const repoId     = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const category   = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;
  const configured = repo && repoId && category && categoryId;

  useEffect(() => {
    if (!configured || !ref.current) return;
    // Don't double-inject
    if (ref.current.querySelector('script[data-giscus]')) return;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-giscus', 'true');
    script.setAttribute('data-repo', repo!);
    script.setAttribute('data-repo-id', repoId!);
    script.setAttribute('data-category', category!);
    script.setAttribute('data-category-id', categoryId!);
    script.setAttribute('data-mapping', 'specific');
    script.setAttribute('data-term', term);
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', 'light');
    script.setAttribute('data-lang', 'en');
    script.setAttribute('data-loading', 'lazy');
    ref.current.appendChild(script);

    return () => {
      // Cleanup the embedded iframe on unmount / param change
      const el = ref.current;
      if (el) while (el.firstChild) el.removeChild(el.firstChild);
    };
  }, [term, repo, repoId, category, categoryId, configured]);

  if (!configured) return null;

  return (
    <section className="mt-12 pt-8 border-t border-outline-variant/60">
      <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-on-surface-variant/70 mb-4">
        Discussion
      </div>
      <div ref={ref} className="giscus-container" />
    </section>
  );
}
