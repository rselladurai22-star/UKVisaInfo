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
      <div className="flex items-center gap-3 mb-6">
        <span className="inline-flex w-9 h-9 rounded-xl items-center justify-center text-on-surface bg-surface-container">
          <HelpCircle className="w-4 h-4" />
        </span>
        <h3
          className="text-[1.1875rem] md:text-[1.3rem] font-bold text-on-surface leading-tight"
          style={{ fontFamily: 'var(--font-grotesk), sans-serif' }}
        >
          Frequently asked questions
        </h3>
      </div>

      <ul className="rounded-2xl overflow-hidden border border-outline-variant bg-surface-container-lowest shadow-soft">
        {items.map((it, i) => {
          const open = openIdx === i;
          return (
            <li key={i} style={{ borderTop: i > 0 ? '1px solid var(--color-outline-variant)' : undefined }}>
              <button
                type="button"
                onClick={() => setOpenIdx(open ? null : i)}
                aria-expanded={open}
                className={`w-full flex items-start gap-4 px-5 py-5 md:px-6 text-left group transition-colors duration-150 ${open ? 'bg-surface-container-low/50' : 'bg-surface-container-lowest hover:bg-surface-container-low/30'}`}
              >
                <span
                  className="flex-1 text-[15.5px] md:text-[16px] font-bold text-on-surface leading-snug pr-3 pt-0.5"
                  style={{ fontFamily: 'var(--font-grotesk), sans-serif' }}
                >
                  {it.q}
                </span>
                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-[transform,background,color] duration-200 ${
                    open
                      ? 'rotate-45 bg-primary text-white'
                      : 'bg-surface-container text-on-surface-variant group-hover:bg-primary group-hover:text-white'
                  }`}
                >
                  <Plus className="w-4 h-4" strokeWidth={2.5} />
                </span>
              </button>

              {/* CSS grid trick — animate to natural height */}
              <div
                className={`grid transition-[grid-template-rows] duration-250 ease-out ${
                  open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <div
                    className="px-5 md:px-6 pb-6 pr-12 text-[15.5px] leading-[1.75] text-on-surface-variant/90"
                    style={{
                      fontFamily: 'var(--font-lora), Georgia, serif',
                      borderTop: '1px solid var(--color-outline-variant)',
                      background: 'var(--color-surface-container-lowest)',
                      paddingTop: '1.25rem',
                    }}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                        strong: ({ children }) => (
                          <strong
                            className="font-bold text-on-surface"
                            style={{ background: 'var(--color-primary-soft)', padding: '0 3px', borderRadius: '3px' }}
                          >{children}</strong>
                        ),
                        a: ({ href, children }) => (
                          <a href={href} className="text-primary underline decoration-primary/40 hover:text-primary-strong font-semibold">{children}</a>
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
