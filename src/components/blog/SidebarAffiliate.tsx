import { ExternalLink } from 'lucide-react';
import { pickAffiliates } from '../../data/affiliates';

/**
 * Sidebar-sized affiliate card for the blog right rail. Shows the single
 * highest-priority offer matching the post's tags. Marked as
 * sponsored + nofollow per Google's link-attribute guidance.
 */
export default function SidebarAffiliate({ tags }: { tags: string[] }) {
  const offers = pickAffiliates(tags, 1);
  const offer = offers[0];
  if (!offer) return null;

  return (
    <aside aria-label="Sponsored offer" className="rounded-2xl bg-white border border-[rgba(14,20,36,0.07)] p-4 shadow-[0_2px_12px_rgba(10,21,48,0.04)]">
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9aa3b8] mb-3">
        Sponsored
      </div>
      <a
        href={offer.url}
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
        className="group block"
      >
        <div className="font-display font-bold text-[14.5px] text-[#0a1530] leading-tight mb-1.5 group-hover:text-[#d9152b] transition-colors duration-100">
          {offer.name}
        </div>
        <p className="text-[11.5px] text-[#52596e] leading-snug mb-3 line-clamp-4">
          {offer.blurb}
        </p>
        <div className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#d9152b] group-hover:gap-2.5 transition-[gap] duration-100">
          {offer.cta}
          <ExternalLink className="w-3 h-3" />
        </div>
      </a>
    </aside>
  );
}
