import { ExternalLink, Tag } from 'lucide-react';
import { pickAffiliates } from '../data/affiliates';

/**
 * Renders 1–2 contextually relevant affiliate offers based on the article's
 * tags. Marked with `rel="sponsored nofollow"` to comply with Google's
 * advertising-link guidelines and UK ASA disclosure rules.
 */
export default function AffiliateCallouts({ tags }: { tags: string[] }) {
  const offers = pickAffiliates(tags, 2);
  if (offers.length === 0) return null;

  return (
    <aside className="mt-12 pt-8 border-t border-outline-variant/30">
      <div className="flex items-center gap-2 mb-4">
        <Tag className="w-4 h-4 text-secondary" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
          Recommended tools — sponsored
        </h3>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {offers.map((o) => (
          <a
            key={o.id}
            href={o.url}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="block bg-surface-container-lowest border border-outline-variant/30 hover:border-secondary/60 rounded-2xl p-5 transition-colors group"
          >
            <div className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
              {o.name}
              <ExternalLink className="w-3.5 h-3.5 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
              {o.blurb}
            </p>
            <span className="text-xs font-semibold text-secondary group-hover:underline">
              {o.cta} →
            </span>
          </a>
        ))}
      </div>
      <p className="text-[10px] text-on-surface-variant/60 mt-3 italic">
        Some links are affiliate links — we may earn a small commission if you
        sign up, at no extra cost to you. This never influences our editorial.
      </p>
    </aside>
  );
}
