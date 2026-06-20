import { CheckCircle2 } from 'lucide-react';
import { inlineMd } from '../inlineMd';

export default function KeyTakeaways({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="my-10">
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">The short version</p>
      <h2 className="mt-2 font-display text-[clamp(20px,3vw,26px)] font-extrabold leading-tight tracking-[-0.02em] text-slate-900">
        {title || 'Key takeaways'}
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((it, i) => (
          <li
            key={i}
            className="flex gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-blue-600" />
            <span className="text-[14px] leading-snug text-slate-700">{inlineMd(it)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
