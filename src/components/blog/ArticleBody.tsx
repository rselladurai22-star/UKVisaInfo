import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link as LinkIcon } from 'lucide-react';
import { parseSegments } from './parseSegments';
import { headingSlug } from './slug';
import Reveal from './Reveal';
import Callout from './blocks/Callout';
import StatCard from './blocks/StatCard';
import StepsTimeline from './blocks/StepsTimeline';
import Checklist from './blocks/Checklist';
import FaqAccordion from './blocks/FaqAccordion';
import PullQuote from './blocks/PullQuote';
import KeyTakeaways from './blocks/KeyTakeaways';
import BarChart from './blocks/BarChart';
import GlossaryTerm from '../GlossaryTerm';
import { GLOSSARY } from '../../data/glossary';

/* Build a single regex for all glossary terms, longest first to avoid
   partial matches (e.g. "ILR" vs "Indefinite Leave to Remain"). */
const GLOSSARY_KEYS = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const GLOSSARY_RE = GLOSSARY_KEYS.length
  ? new RegExp(`\\b(${GLOSSARY_KEYS.map(escapeRe).join('|')})\\b`, 'g')
  : null;

/**
 * Walk a string and wrap the first occurrence of each glossary term in
 * a <GlossaryTerm> tooltip. Tracking via a Set prevents wrapping the
 * same term twice in the same block.
 */
function glossify(text: string, seen: Set<string>): React.ReactNode {
  if (!GLOSSARY_RE) return text;
  GLOSSARY_RE.lastIndex = 0;
  const parts: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = GLOSSARY_RE.exec(text)) !== null) {
    const term = m[1];
    if (seen.has(term)) continue;
    seen.add(term);
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <GlossaryTerm key={`${term}-${m.index}`} term={term}>{term}</GlossaryTerm>
    );
    last = m.index + term.length;
  }
  if (last === 0) return text;
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function processChildren(children: React.ReactNode, seen: Set<string>): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (typeof child === 'string') return glossify(child, seen);
    return child;
  });
}

interface Props { body: string; articleSlug: string }

export default function ArticleBody({ body, articleSlug }: Props) {
  const segments = parseSegments(body);

  return (
    <div className="article-body max-w-[720px]">
      {segments.map((seg, i) => {
        switch (seg.type) {
          case 'markdown':
            return <MarkdownChunk key={i} content={seg.content} />;
          case 'callout':
            return <Reveal key={i}><Callout variant={seg.variant} content={seg.content} /></Reveal>;
          case 'stat':
            return <Reveal key={i}><StatCard value={seg.value} label={seg.label} /></Reveal>;
          case 'steps':
            return <Reveal key={i}><StepsTimeline items={seg.items} /></Reveal>;
          case 'checklist':
            return <Reveal key={i}><Checklist name={seg.name} items={seg.items} slug={articleSlug} /></Reveal>;
          case 'faq':
            return <Reveal key={i}><FaqAccordion items={seg.items} /></Reveal>;
          case 'quote':
            return <Reveal key={i}><PullQuote content={seg.content} attribution={seg.attribution} /></Reveal>;
          case 'key':
            return <Reveal key={i}><KeyTakeaways title={seg.title} items={seg.items} /></Reveal>;
          case 'bars':
            return <Reveal key={i}><BarChart title={seg.title} items={seg.items} /></Reveal>;
          default:
            return null;
        }
      })}

      {/* Scoped reading-experience polish: list markers (fixes ordered lists
          that previously rendered dots instead of numbers), table striping,
          balanced line wrapping. */}
      <style>{`
        .article-body p { text-wrap: pretty; }
        .article-body h2, .article-body h3 { text-wrap: balance; }

        .article-body .md-ul { list-style: none; padding-left: 0; }
        .article-body .md-ul > li { position: relative; padding-left: 1.6rem; }
        .article-body .md-ul > li::before {
          content: ''; position: absolute; left: 0.2rem; top: 0.72em;
          width: 7px; height: 7px; border-radius: 9999px; background: #00C4B4;
        }
        .article-body .md-ol { list-style: none; counter-reset: li; padding-left: 0; }
        .article-body .md-ol > li { position: relative; padding-left: 2.4rem; counter-increment: li; min-height: 1.65rem; }
        .article-body .md-ol > li::before {
          content: counter(li); position: absolute; left: 0; top: 0.05em;
          width: 1.65rem; height: 1.65rem; border-radius: 9999px;
          background: rgba(0,196,180,0.12); color: #0A2540;
          font-weight: 700; font-size: 0.82rem;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display, sans-serif);
        }

        .article-body table tbody tr:nth-child(even) { background: rgba(14,20,36,0.025); }
        .article-body table tbody tr:hover { background: rgba(0,196,180,0.06); }
      `}</style>
    </div>
  );
}

function MarkdownChunk({ content }: { content: string }) {
  // First-occurrence tracking is per-chunk (good balance: glossary
  // tooltips help readers without overwhelming the page).
  const seen = new Set<string>();
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: ({ children }) => {
          const text = childrenToText(children);
          const id = headingSlug(text);
          return (
            <h2 id={id} className="group relative font-display text-[1.5rem] md:text-[1.875rem] font-bold text-[#0A2540] mt-14 mb-5 leading-tight tracking-[-0.015em] scroll-mt-28">
              <a
                href={`#${id}`}
                aria-label="Anchor link"
                className="absolute -left-7 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-[#00C4B4] hidden md:inline-flex"
              >
                <LinkIcon className="w-4 h-4" />
              </a>
              {children}
            </h2>
          );
        },
        h3: ({ children }) => (
          <h3 className="font-display text-[1.125rem] md:text-[1.3125rem] font-bold text-[#0A2540] mt-10 mb-3 leading-snug tracking-[-0.01em] flex items-center gap-2.5">
            <span className="w-1 h-5 bg-[#00C4B4] rounded-full flex-shrink-0" aria-hidden="true" />
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="text-[#1a2240] text-[1.0625rem] md:text-[1.15rem] leading-[1.8] mb-6">
            {processChildren(children, seen)}
          </p>
        ),
        ul: ({ children }) => <ul className="md-ul my-6 space-y-2.5">{children}</ul>,
        ol: ({ children }) => <ol className="md-ol my-6 space-y-2.5">{children}</ol>,
        li: ({ children }) => (
          <li className="text-[#1a2240] text-[1.0625rem] md:text-[1.1rem] leading-[1.7]">
            {processChildren(children, seen)}
          </li>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-[#00C4B4] underline decoration-[#00C4B4]/35 decoration-[1.5px] hover:decoration-[#00C4B4] underline-offset-[3px] font-medium transition-[text-decoration-color]"
          >
            {children}
          </a>
        ),
        strong: ({ children }) => (
          <strong className="font-bold text-[#0A2540]">{children}</strong>
        ),
        table: ({ children }) => (
          <div className="my-9 -mx-3 sm:mx-0 overflow-x-auto rounded-2xl border border-[rgba(14,20,36,0.09)] bg-white shadow-[0_2px_12px_rgba(10,37,64,0.04)]">
            <table className="w-full text-[14px]">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-[#f7f9fd] border-b border-[rgba(14,20,36,0.09)]">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="text-left px-4 py-3 font-bold text-[#0A2540] text-[11px] uppercase tracking-[0.08em] whitespace-nowrap">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-3.5 border-t border-[rgba(14,20,36,0.05)] text-[#1a2240] text-[14.5px] leading-relaxed">
            {children}
          </td>
        ),
        blockquote: ({ children }) => (
          <blockquote className="my-8 relative bg-gradient-to-br from-[#f7f9fd] to-white border-l-[3px] border-[#00C4B4] rounded-r-xl p-5 md:p-6">
            <span
              aria-hidden="true"
              className="absolute top-2 right-4 font-display font-bold text-[3.5rem] leading-none text-[#00C4B4]/15 select-none"
            >&ldquo;</span>
            <div className="relative text-[#0A2540] text-[1.0625rem] md:text-[1.125rem] leading-[1.65] italic font-medium">
              {children}
            </div>
          </blockquote>
        ),
        code: ({ children }) => (
          <code className="bg-[#f3f5fb] text-[#00C4B4] px-1.5 py-0.5 rounded-md text-[0.875em] font-mono border border-[rgba(14,20,36,0.07)] tabular-nums">
            {children}
          </code>
        ),
        hr: () => (
          <div className="my-12 flex items-center justify-center gap-2" aria-hidden="true">
            <span className="w-1 h-1 rounded-full bg-[#00C4B4]" />
            <span className="w-1 h-1 rounded-full bg-[#0A2540]/20" />
            <span className="w-1 h-1 rounded-full bg-[#00C4B4]" />
          </div>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

function childrenToText(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(childrenToText).join('');
  if (children && typeof children === 'object' && 'props' in children) {
    const c = (children as { props?: { children?: React.ReactNode } }).props?.children;
    return childrenToText(c);
  }
  return '';
}
