import { Info, AlertTriangle, Lightbulb, BookmarkCheck } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Variant = 'info' | 'warning' | 'tip' | 'note';

const STYLES: Record<Variant, {
  border: string; bg: string; text: string; icon: React.ComponentType<{ className?: string }>; label: string;
}> = {
  info:    { border: '#3b82f6', bg: 'rgba(59,130,246,0.06)',  text: '#1e40af', icon: Info,           label: 'Info' },
  warning: { border: '#ef4444', bg: 'rgba(239,68,68,0.05)',   text: '#b91c1c', icon: AlertTriangle,  label: 'Warning' },
  tip:     { border: '#10b981', bg: 'rgba(16,185,129,0.06)',  text: '#047857', icon: Lightbulb,      label: 'Tip' },
  note:    { border: '#6b7280', bg: 'rgba(107,114,128,0.05)', text: '#374151', icon: BookmarkCheck,  label: 'Note' },
};

export default function Callout({ variant, content }: { variant: Variant; content: string }) {
  const s = STYLES[variant];
  const Icon = s.icon;
  return (
    <div
      className="my-8 rounded-2xl p-5 md:p-6 relative overflow-hidden"
      style={{
        background: s.bg,
        boxShadow: `inset 4px 0 0 ${s.border}`,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="inline-flex w-6 h-6 rounded-lg items-center justify-center flex-shrink-0"
          style={{ background: s.border, color: '#fff' }}
        >
          <Icon className="w-3.5 h-3.5" />
        </span>
        <span
          className="text-[10.5px] font-bold uppercase tracking-[0.12em]"
          style={{ color: s.text }}
        >
          {s.label}
        </span>
      </div>
      <div
        className="callout-body text-[15.5px] leading-[1.65]"
        style={{ color: s.text }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            strong: ({ children }) => <strong className="font-bold">{children}</strong>,
            a: ({ href, children }) => (
              <a href={href} className="underline font-semibold hover:opacity-80">{children}</a>
            ),
            code: ({ children }) => (
              <code className="px-1 py-0.5 rounded font-mono text-[0.92em]" style={{ background: 'rgba(255,255,255,0.5)' }}>
                {children}
              </code>
            ),
            ul: ({ children }) => <ul className="my-2 space-y-1 list-disc pl-5">{children}</ul>,
            li: ({ children }) => <li>{children}</li>,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
