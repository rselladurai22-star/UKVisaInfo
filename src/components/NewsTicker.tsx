'use client';

import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const ITEMS = [
  'April 2026 — Skilled Worker minimum salary rises to £41,700',
  'May 2025 White Paper — English language requirement B2 for new applicants',
  'Graduate Visa reduced to 18 months (3 years for PhD)',
  'Care Worker route (SOC 6135/6136) closed to new overseas recruits from 22 July 2025',
  'All visas issued as eVisas from 2026 — no more physical BRP cards',
  'ETA scheme rollout complete — £16 Electronic Travel Authorisation for visa-exempt nationals',
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
