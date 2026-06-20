'use client';

import { useState } from 'react';
import { Link2, Twitter, Linkedin, Facebook, Printer, Check } from 'lucide-react';

/**
 * Horizontal social share row, shown near the top of every blog post.
 * Flagship Clean Slate styling.
 */
export default function ShareRail({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== 'undefined' ? window.location.href : '';

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* noop */ }
  };

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  const btn =
    'inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:text-blue-700 hover:border-blue-300 hover:shadow-sm transition-all duration-150';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Share</span>

      <button type="button" onClick={copyLink} aria-label={copied ? 'Link copied' : 'Copy link'} className={btn}>
        {copied ? <Check className="h-[15px] w-[15px] text-emerald-600" /> : <Link2 className="h-[15px] w-[15px]" />}
      </button>

      <a href={tweetUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on X / Twitter" className={btn}>
        <Twitter className="h-[15px] w-[15px]" />
      </a>

      <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" className={btn}>
        <Linkedin className="h-[15px] w-[15px]" />
      </a>

      <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" className={btn}>
        <Facebook className="h-[15px] w-[15px]" />
      </a>

      <button type="button" onClick={() => window.print()} aria-label="Print article" className={btn}>
        <Printer className="h-[15px] w-[15px]" />
      </button>
    </div>
  );
}
