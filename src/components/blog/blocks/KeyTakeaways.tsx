import { Sparkles, Check } from 'lucide-react';
import { inlineMd } from '../inlineMd';

export default function KeyTakeaways({ title, items }: { title: string; items: string[] }) {
  return (
    <div
      className="my-10 rounded-2xl overflow-hidden"
      style={{
        border: '1px solid rgba(0,196,180,0.25)',
        boxShadow: '0 4px 24px rgba(0,196,180,0.08), 0 1px 4px rgba(10,37,64,0.05)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2.5 px-6 py-3.5"
        style={{
          background: 'linear-gradient(to right, rgba(0,196,180,0.12), rgba(0,196,180,0.06))',
          borderBottom: '1px solid rgba(0,196,180,0.18)',
        }}
      >
        <Sparkles className="w-4 h-4 text-[#00897b]" />
        <span
          className="font-bold text-[#005f58] text-[11px] uppercase tracking-[0.14em]"
          style={{ fontFamily: 'var(--font-grotesk), sans-serif' }}
        >
          {title || 'Key takeaways'}
        </span>
      </div>

      {/* Items */}
      <div className="px-6 py-5 bg-white">
        <ul className="space-y-3.5">
          {items.map((it, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span
                className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{ background: '#00C4B4', boxShadow: '0 0 0 3px rgba(0,196,180,0.15)' }}
              >
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </span>
              <span
                className="flex-1 text-[#1e2a42] text-[1rem] md:text-[1.0625rem] leading-[1.7]"
                style={{ fontFamily: 'var(--font-lora), Georgia, serif' }}
              >
                {inlineMd(it)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
