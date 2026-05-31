import { Sparkles, Check } from 'lucide-react';
import { inlineMd } from '../inlineMd';

// High-visibility "key points" card — the at-a-glance summary readers scan
// before committing to a long section. Tinted gradient + checkmark list.
export default function KeyTakeaways({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="my-8 rounded-2xl border border-[rgba(0,196,180,0.3)] bg-[linear-gradient(135deg,rgba(0,196,180,0.06),rgba(201,161,74,0.05))] p-6 md:p-7">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-[18px] h-[18px] text-[#00897b]" />
        <span className="font-display font-bold text-[#0A2540] text-[0.8rem] uppercase tracking-[0.12em]">
          {title || 'Key takeaways'}
        </span>
      </div>
      <ul className="space-y-2.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-3 text-[#2b3040] text-[1rem] leading-[1.6]">
            <span className="mt-0.5 w-5 h-5 rounded-full bg-[#00C4B4] flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </span>
            <span className="flex-1">{inlineMd(it)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
