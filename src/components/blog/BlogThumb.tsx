'use client';

import Image from 'next/image';
import type { ComponentType } from 'react';

/* Deterministic hash from a string, stable across renders/SSR. */
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/* Categories that have an AI-generated image pool in /public/blog
   (`{category}-1.webp` … `{category}-N.webp`). Posts are mapped to one
   deterministically by slug so cards in a category don't all repeat. */
const IMAGE_POOLS: Record<string, number> = {
  visa: 3, money: 3, property: 3, business: 3, benefits: 3,
  family: 3, motoring: 3, energy: 3, estate: 3,
};

function pooledImage(category: string, slug: string): string | null {
  const n = IMAGE_POOLS[category];
  if (!n) return null;
  return `/blog/${category}-${(hashStr(slug) % n) + 1}.webp`;
}

/* Slugs that have custom, individual high-quality thumbnails generated in /public/blog/thumbs/ */
const CUSTOM_THUMBS = new Set([
  'uk-skilled-worker-visa-salary-threshold-2026',
  'brp-vs-evisa-2026-whats-changing',
  'uk-student-visa-cost-2026-full-breakdown',
  'uk-family-visa-minimum-income-2026-what-counts',
  'uk-graduate-visa-2026-no-sponsor-needed',
  'stamp-duty-by-price-table-2025-26',
  'how-much-mortgage-can-i-borrow-by-salary-table-2025-26',
  'dividend-tax-by-amount-table-2025-26',
  'pension-pot-for-retirement-income-table-2025-26',
  'uk-salary-after-tax-take-home-table-2025-26',
  'universal-credit-taper-explained-2025-26',
  'ofgem-energy-price-cap-explained-2025-26',
]);

/**
 * Blog card thumbnail. Renders the post's real (AI-generated) image when one
 * is available, an explicit `image` override, a custom post thumbnail, or a 
 * category pool image. Falls back to a generated SVG illustration if none exists.
 */
export default function BlogThumb({
  slug,
  category,
  accent,
  Icon,
  image,
  iconSize = 96,
  priority = false,
  sizes = '(max-width: 768px) 100vw, 33vw',
}: {
  slug: string;
  category: string;
  accent: string;
  Icon: ComponentType<{ className?: string; style?: Record<string, unknown> }>;
  image?: string;
  iconSize?: number;
  priority?: boolean;
  sizes?: string;
}) {
  const src = image ?? (CUSTOM_THUMBS.has(slug) ? `/blog/thumbs/${slug}.jpg` : pooledImage(category, slug));

  if (src) {
    return (
      <>
        <Image
          src={src}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover z-0 transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {/* subtle wash for badge/text legibility over the photo */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/35 via-black/0 to-black/10 pointer-events-none" />
      </>
    );
  }

  /* ---- SVG fallback (no image pool for this category) ---- */
  const hue = hashStr(slug) % 360;
  const c1 = `hsl(${hue}, 62%, 44%)`;
  const c2 = `hsl(${(hue + 38) % 360}, 68%, 30%)`;
  const gid = `bt-grad-${slug}`;
  const pid = `bt-dots-${slug}`;

  return (
    <>
      <svg
        viewBox="0 0 400 200"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full z-0 transition-transform duration-500 ease-out group-hover:scale-105"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>
          <pattern id={pid} width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="rgba(255,255,255,0.35)" />
          </pattern>
        </defs>
        <rect width="400" height="200" fill={`url(#${gid})`} />
        <rect width="400" height="200" fill={accent} opacity="0.22" />
        <circle cx="60" cy="40" r="120" fill="rgba(255,255,255,0.10)" />
        <circle cx="340" cy="180" r="140" fill="rgba(0,0,0,0.14)" />
        <circle cx="320" cy="46" r="46" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
        <circle cx="320" cy="46" r="26" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
        <rect width="400" height="200" fill={`url(#${pid})`} opacity="0.5" />
      </svg>
      <Icon
        className="absolute -right-4 -bottom-4 text-white opacity-20 transform rotate-12 pointer-events-none transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 z-[1]"
        style={{ width: iconSize, height: iconSize }}
      />
    </>
  );
}
