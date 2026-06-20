import { Info, AlertTriangle, Lightbulb, BookmarkCheck } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Variant = 'info' | 'warning' | 'tip' | 'note';

const STYLES: Record<Variant, {
  wrap: string;
  icon: string;
  link: string;
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
}> = {
  info: {
    wrap: 'border-blue-200 bg-blue-50/70',
    icon: 'text-blue-600',
    link: 'text-blue-800',
    Icon: Info,
    label: 'Good to know',
  },
  warning: {
    wrap: 'border-amber-200 bg-amber-50/70',
    icon: 'text-amber-600',
    link: 'text-amber-800',
    Icon: AlertTriangle,
    label: 'Watch out',
  },
  tip: {
    wrap: 'border-emerald-200 bg-emerald-50/70',
    icon: 'text-emerald-600',
    link: 'text-emerald-800',
    Icon: Lightbulb,
    label: 'Tip',
  },
  note: {
    wrap: 'border-slate-200 bg-slate-50',
    icon: 'text-slate-500',
    link: 'text-slate-800',
    Icon: BookmarkCheck,
    label: 'Note',
  },
};

export default function Callout({ variant, content }: { variant: Variant; content: string }) {
  const s = STYLES[variant];
  const { Icon } = s;
  return (
    <div className={`my-6 rounded-2xl border px-5 py-4 ${s.wrap}`}>
      <p className={`flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.1em] ${s.icon}`}>
        <Icon className={`h-4 w-4 ${s.icon}`} /> {s.label}
      </p>
      <div className="mt-2 text-[14.5px] md:text-[15px] leading-relaxed text-slate-700">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            strong: ({ children }) => <strong className="font-bold text-slate-900">{children}</strong>,
            a: ({ href, children }) => (
              <a href={href} className={`font-semibold underline ${s.link}`}>{children}</a>
            ),
            code: ({ children }) => (
              <code className="px-1.5 py-0.5 rounded font-mono text-[0.88em] bg-white/70 border border-slate-200 text-slate-700">
                {children}
              </code>
            ),
            ul: ({ children }) => <ul className="my-2 space-y-1.5 list-disc pl-5 marker:text-slate-400">{children}</ul>,
            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
