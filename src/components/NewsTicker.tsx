'use client';

import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const ITEMS = [
  '2025/26 Tax Year — New Scottish Income Tax bands and rates are now active',
  'Stamp Duty — Temporary threshold extensions end March 2026',
  'Savings — ISA allowance remains at £20,000 for the current tax year',
  'Clean Air — Additional UK cities introducing clean air zones this year',
  'Interest Rates — Bank of England base rate updates and mortgage affordability impact',
];

export default function NewsTicker() {
  return (
    <div className="bg-primary border-y border-white/10 overflow-hidden relative">
      <div className="flex items-center">
        <div className="bg-secondary px-4 py-2 flex items-center gap-2 flex-shrink-0 z-10 relative">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white">Latest</span>
        </div>
        <div className="flex-1 overflow-hidden py-2 relative mask-fade">
          <motion.div
            className="flex gap-12 whitespace-nowrap"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
          >
            {[...ITEMS, ...ITEMS].map((item, i) => (
              <span key={i} className="text-white/70 text-xs font-medium tracking-wide">
                <span className="text-secondary mr-3">◆</span>
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
