/**
 * Shared slug helpers for programmatic-SEO routes.
 * Stable conversion used by both server (generateStaticParams) and
 * client (link generation) so URLs stay consistent.
 */

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')   // strip diacritics
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s-]/g, '')      // drop punctuation
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/** Compose a SOC slug as "<code>-<title-slug>" for SEO-friendly URLs. */
export function socSlug(code: string, title: string): string {
  return `${code}-${slugify(title)}`;
}

/** Reverse: extract the SOC code prefix from a slug. */
export function parseSocSlug(slug: string): string | null {
  const m = slug.match(/^(\d{4})(?:-|$)/);
  return m ? m[1] : null;
}
