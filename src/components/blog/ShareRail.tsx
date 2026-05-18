'use client';

import { useEffect, useState } from 'react';
import { Link2, Twitter, Linkedin, Printer, Check, ArrowUp } from 'lucide-react';

export default function ShareRail({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  const btn =
    'group w-10 h-10 flex items-center justify-center rounded-full bg-white border border-[rgba(14,20,36,0.08)] text-[#52596e] hover:text-[#0a1530] hover:border-[rgba(14,20,36,0.18)] hover:shadow-[0_4px_14px_rgba(10,21,48,0.08)] transition-[color,border-color,box-shadow] duration-150';

  return (
    <div className="flex flex-col gap-2">
      <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9aa3b8] mb-1">
        Share
      </div>

      <button
        type="button"
        onClick={copyLink}
        aria-label={copied ? 'Link copied' : 'Copy link'}
        className={btn}
      >
        {copied
          ? <Check className="w-[15px] h-[15px] text-[#059669]" />
          : <Link2 className="w-[15px] h-[15px]" />}
      </button>

      <a
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X / Twitter"
        className={btn}
      >
        <Twitter className="w-[15px] h-[15px]" />
      </a>

      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className={btn}
      >
        <Linkedin className="w-[15px] h-[15px]" />
      </a>

      <button
        type="button"
        onClick={() => window.print()}
        aria-label="Print article"
        className={btn}
      >
        <Printer className="w-[15px] h-[15px]" />
      </button>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        className={`${btn} transition-opacity duration-200 ${showTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <ArrowUp className="w-[15px] h-[15px]" />
      </button>
    </div>
  );
}
