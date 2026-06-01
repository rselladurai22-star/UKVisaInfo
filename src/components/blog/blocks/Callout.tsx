import { Info, AlertTriangle, Lightbulb, BookmarkCheck } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Variant = 'info' | 'warning' | 'tip' | 'note';

const STYLES: Record<Variant, {
  accent: string;
  bg: string;
  headerBg: string;
  text: string;
  bodyText: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}> = {
  info: {
    accent: '#2563eb',
    bg: 'rgba(239,246,255,0.8)',
    headerBg: 'rgba(37,99,235,0.07)',
    text: '#1d4ed8',
    bodyText: '#1e3a6e',
    icon: Info,
    label: 'Info',
  },
  warning: {
    accent: '#dc2626',
    bg: 'rgba(255,243,243,0.9)',
    headerBg: 'rgba(220,38,38,0.07)',
    text: '#b91c1c',
    bodyText: '#5a1a1a',
    icon: AlertTriangle,
    label: 'Warning',
  },
  tip: {
    accent: '#059669',
    bg: 'rgba(240,253,249,0.9)',
    headerBg: 'rgba(5,150,105,0.07)',
    text: '#047857',
    bodyText: '#1a3d32',
    icon: Lightbulb,
    label: 'Tip',
  },
  note: {
    accent: '#475569',
    bg: 'rgba(248,249,252,0.95)',
    headerBg: 'rgba(71,85,105,0.06)',
    text: '#334155',
    bodyText: '#1e2a3a',
    icon: BookmarkCheck,
    label: 'Note',
  },
};

export default function Callout({ variant, content }: { variant: Variant; content: string }) {
  const s = STYLES[variant];
  const Icon = s.icon;
  return (
    <div
      className="my-8 rounded-2xl overflow-hidden"
      style={{
        background: s.bg,
        border: `1px solid ${s.accent}22`,
        boxShadow: `0 2px 12px ${s.accent}12`,
      }}
    >
      {/* Accent header strip */}
      <div
        className="flex items-center gap-2.5 px-5 py-3"
        style={{ background: s.headerBg, borderBottom: `1px solid ${s.accent}18` }}
      >
        <span
          className="inline-flex w-6 h-6 rounded-md items-center justify-center flex-shrink-0"
          style={{ background: s.accent }}
        >
          <Icon className="w-3.5 h-3.5 text-white" />
        </span>
        <span
          className="text-[11px] font-bold uppercase tracking-[0.14em]"
          style={{ color: s.text, fontFamily: 'var(--font-grotesk), sans-serif' }}
        >
          {s.label}
        </span>
      </div>

      {/* Body */}
      <div
        className="px-5 md:px-6 py-4"
        style={{
          color: s.bodyText,
          fontSize: '15.5px',
          lineHeight: '1.7',
          fontFamily: 'var(--font-lora), Georgia, serif',
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-2.5 last:mb-0">{children}</p>,
            strong: ({ children }) => <strong className="font-bold" style={{ color: s.text }}>{children}</strong>,
            a: ({ href, children }) => (
              <a href={href} className="underline font-semibold hover:opacity-80">{children}</a>
            ),
            code: ({ children }) => (
              <code
                className="px-1.5 py-0.5 rounded font-mono text-[0.88em]"
                style={{ background: `${s.accent}15`, color: s.text, fontFamily: 'var(--font-jetbrains), monospace' }}
              >
                {children}
              </code>
            ),
            ul: ({ children }) => <ul className="my-2.5 space-y-1.5 list-disc pl-5">{children}</ul>,
            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
