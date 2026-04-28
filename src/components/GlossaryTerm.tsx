'use client';

import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GLOSSARY } from '../data/glossary';

/** Inline term with hover/focus tooltip showing plain-English definition. */
export default function GlossaryTerm({ term, children }: { term: string; children?: ReactNode }) {
  const def = GLOSSARY[term];
  const [open, setOpen] = useState(false);
  if (!def) return <>{children ?? term}</>;
  return (
    <span className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
        className="underline decoration-dotted decoration-secondary/60 underline-offset-4 text-inherit hover:text-secondary focus:text-secondary focus:outline-none transition-colors cursor-help"
        aria-describedby={`gloss-${term}`}
      >
        {children ?? term}
      </button>
      <AnimatePresence>
        {open && (
          <motion.span
            role="tooltip"
            id={`gloss-${term}`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute z-[200] left-1/2 -translate-x-1/2 top-full mt-2 w-72 max-w-[80vw] bg-primary text-white text-xs font-normal leading-relaxed p-3 rounded-lg shadow-2xl border border-white/10"
          >
            <span className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">
              {term}
            </span>
            {def}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
