import { Sparkles, Check } from 'lucide-react';
import { inlineMd } from '../inlineMd';

export default function KeyTakeaways({ title, items }: { title: string; items: string[] }) {
  return (
    <div
      className="my-10 rounded-2xl overflow-hidden border border-outline-variant shadow-soft"
    >
      {/* Header */}
      <div
        className="flex items-center gap-2.5 px-6 py-3.5"
        style={{
          background: 'var(--color-primary-soft)',
          borderBottom: '1px solid var(--color-outline-variant)',
        }}
      >
        <Sparkles className="w-4 h-4 text-primary" />
        <span
          className="font-bold text-primary text-[11px] uppercase tracking-[0.14em]"
          style={{ fontFamily: 'var(--font-grotesk), sans-serif' }}
        >
          {title || 'Key takeaways'}
        </span>
      </div>

      {/* Items */}
      <div className="px-6 py-5 bg-surface-container-lowest">
        <ul className="space-y-3.5">
          {items.map((it, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span
                className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'var(--color-primary)', boxShadow: '0 0 0 3px var(--color-primary-soft)' }}
              >
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </span>
              <span
                className="flex-1 text-on-surface text-[1rem] md:text-[1.0625rem] leading-[1.7]"
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
