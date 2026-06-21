'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { FaqItem } from '../parseSegments';

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  if (!items.length) return null;

  return (
    <section className="my-10">
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">Questions</p>
      <h2 className="mt-2 mb-5 font-display text-[clamp(22px,3.4vw,30px)] font-extrabold leading-tight tracking-[-0.025em] text-slate-900">
        Frequently asked questions
      </h2>

      <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-cs">
        {items.map((it, i) => {
          const open = openIdx === i;
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => setOpenIdx(open ? null : i)}
                aria-expanded={open}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left group"
              >
                <span className="flex-1 text-[15px] font-semibold text-slate-900 leading-snug">
                  {it.q}
                </span>
                <ChevronRight
                  className={`h-4 w-4 flex-none text-slate-400 transition-transform duration-200 ${open ? 'rotate-90 text-blue-600' : ''}`}
                />
              </button>

              {/* CSS grid trick, animate to natural height */}
              <div
                className={`grid transition-[grid-template-rows] duration-250 ease-out ${
                  open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 text-[14.5px] leading-relaxed text-slate-600">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => <p className="mb-2.5 last:mb-0">{children}</p>,
                        strong: ({ children }) => (
                          <strong className="font-bold text-slate-900">{children}</strong>
                        ),
                        a: ({ href, children }) => (
                          <a href={href} className="text-blue-700 underline font-semibold hover:decoration-blue-600">{children}</a>
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
