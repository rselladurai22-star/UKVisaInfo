import { ArrowRight } from 'lucide-react';

export interface FlowItem {
  label: string;
  detail: string;
  tag?: string;
}

// Reusable vertical flow / process diagram (gross→net, application stages,
// decision pipeline). Connector line links the numbered nodes.
// Authored as:
//   > [!FLOW] How a sponsored application flows
//   > Find a sponsor :: Employer holds a licence :: required
//   > Get a CoS :: Certificate of Sponsorship issued :: 3 months
//   > Apply online :: Pay fee + IHS
export default function FlowDiagram({ title, items }: { title: string; items: FlowItem[] }) {
  return (
    <figure className="my-8 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white shadow-cs">
      {title && (
        <figcaption className="flex items-center gap-2 border-b border-slate-100 bg-white/60 px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
          <ArrowRight className="h-4 w-4 text-blue-600" /> {title}
        </figcaption>
      )}
      <ol className="px-5 py-6 sm:px-6">
        {items.map((s, i) => (
          <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
            {i < items.length - 1 && (
              <span aria-hidden className="absolute left-[15px] top-9 h-[calc(100%-1.5rem)] w-px bg-slate-200" />
            )}
            <span className="relative z-10 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-blue-600 font-mono text-[13px] font-bold text-white shadow-sm">
              {i + 1}
            </span>
            <div className="flex flex-1 flex-wrap items-center justify-between gap-2 pt-0.5">
              <div className="min-w-0">
                <p className="text-[15px] font-bold text-slate-900">{s.label}</p>
                {s.detail && <p className="text-[13px] text-slate-500">{s.detail}</p>}
              </div>
              {s.tag && (
                <span className="rounded-full bg-blue-50 px-2.5 py-1 font-mono text-[11px] font-bold text-blue-700">
                  {s.tag}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}
