'use client';

import { useState } from 'react';
import { Plus, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { FaqItem } from '../parseSegments';

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  if (!items.length) return null;

  return (
    <section className="my-10">
      <div className="flex items-center gap-2.5 mb-5">
        <span className="inline-flex w-9 h-9 rounded-xl bg-[rgba(37,99,235,0.08)] items-center justify-center text-[#2563eb]">
          <HelpCircle className="w-4 h-4" />
        </span>
        <h3 className="font-display text-[1.25rem] font-bold text-[#0a1530] leading-tight">
          Frequently asked
        </h3>
      </div>

      <ul className="divide-y divide-[rgba(14,20,36,0.07)] border-y border-[rgba(14,20,36,0.07)]">
        {items.map((it, i) => {
          const open = openIdx === i;
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => setOpenIdx(open ? null : i)}
                aria-expanded={open}
                className="w-full flex items-start gap-4 py-5 text-left group"
              >
                <span className="flex-1 font-display text-[15.5px] md:text-[16.5px] font-bold text-[#0a1530] leading-snug pr-3">
                  {it.q}
                </span>
                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-full bg-[#f3f5fb] flex items-center justify-center text-[#52596e] transition-[transform,background-color] duration-200 group-hover:bg-[#d9152b] group-hover:text-white ${
                    open ? 'rotate-45 bg-[#d9152b] text-white' : ''
                  }`}
                >
                  <Plus className="w-4 h-4" strokeWidth={2.5} />
                </span>
              </button>

              {/* CSS grid trick — animate to natural height with no JS measurement */}
              <div
                className={`grid transition-[grid-template-rows] duration-250 ease-out ${
                  open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="pb-6 pr-12 text-[15px] leading-[1.7] text-[#1a2240]">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                        strong: ({ children }) => <strong className="font-semibold text-[#0a1530]">{children}</strong>,
                        a: ({ href, children }) => (
                          <a href={href} className="text-[#d9152b] underline decoration-[#d9152b]/35 hover:decoration-[#d9152b] font-medium">{children}</a>
                        ),
                      }}
                    >
                      {it.a}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
