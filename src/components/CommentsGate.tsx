'use client';

import { usePathname } from 'next/navigation';
import Comments from './blog/Comments';

/**
 * Site-wide comments mount (Giscus). Rendered once from AppShell so every
 * content page gets a discussion section without per-page wiring.
 *
 * Excluded: home, index/directory pages and site-meta pages. Blog posts
 * mount their own <Comments> with a slug term, so /blog/[slug] is excluded
 * here to avoid a duplicate.
 */
const EXCLUDE_EXACT = new Set([
  '/', '/tools', '/blog', '/news', '/about', '/contact',
  '/privacy', '/terms', '/sources', '/editorial-policy',
  '/uk-cities', '/salary', '/postcode', '/visa-types',
]);
const EXCLUDE_PREFIX = ['/blog/', '/category/', '/admin'];

export default function CommentsGate() {
  const pathname = usePathname() || '/';
  if (EXCLUDE_EXACT.has(pathname)) return null;
  if (EXCLUDE_PREFIX.some((p) => pathname.startsWith(p))) return null;

  return (
    <div className="container-page pb-16">
      <Comments term={pathname} />
    </div>
  );
}
