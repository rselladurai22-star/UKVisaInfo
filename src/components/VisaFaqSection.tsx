'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import type { FAQ } from '../data/visaFaqs';

export default function VisaFaqSection({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (faqs.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-outline-variant/30">
      <div className="flex items-center gap-2 mb-5">
        <HelpCircle className="w-5 h-5 text-secondary" />
        <h2 className="text-2xl font-bold text-primary">
          Frequently asked questions
        </h2>
      </div>
      <ul className="space-y-3">
        {faqs.map((faq, i) => (
          <li
            key={i}
            className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              aria-expanded={openIndex === i}
              className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-surface-container-low transition-colors"
            >
              <span className="text-sm font-bold text-primary">
                {faq.question}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-secondary flex-shrink-0 transition-transform ${
                  openIndex === i ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === i && (
              <div className="px-5 pb-4 text-sm text-on-surface leading-relaxed">
                {faq.answer}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
