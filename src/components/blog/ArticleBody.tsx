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
        .article-body .md-ul > li { position: relative; padding-left: 1.75rem; }
        .article-body .md-ul > li::before {
          content: ''; position: absolute; left: 0.25rem; top: 0.7em;
          width: 8px; height: 8px; border-radius: 9999px;
          background: linear-gradient(135deg, #00C4B4, #C9A14A);
        }
        .article-body .md-ol { list-style: none; counter-reset: li; padding-left: 0; }
        .article-body .md-ol > li { position: relative; padding-left: 2.6rem; counter-increment: li; min-height: 1.8rem; }
        .article-body .md-ol > li::before {
          content: counter(li); position: absolute; left: 0; top: 0.1em;
          width: 1.75rem; height: 1.75rem; border-radius: 9999px;
          background: linear-gradient(135deg, rgba(0,196,180,0.18), rgba(0,196,180,0.08));
          color: #007a72; font-weight: 800; font-size: 0.8rem;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display, sans-serif);
          border: 1px solid rgba(0,196,180,0.25);
        }

        .article-body table tbody tr:nth-child(even) { background: rgba(14,20,36,0.02); }
        .article-body table tbody tr:hover { background: rgba(0,196,180,0.05); }
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
            <h2 id={id} className="group relative font-display text-[1.5rem] md:text-[2rem] font-bold text-[#0A2540] mt-16 mb-6 leading-[1.15] tracking-[-0.02em] scroll-mt-28">
              {/* decorative accent line above heading */}
              <span aria-hidden="true" className="block w-8 h-[3px] rounded-full bg-gradient-to-r from-[#00C4B4] to-[#C9A14A] mb-3" />
              <a
                href={`#${id}`}
                aria-label="Anchor link"
                className="absolute -left-7 top-8 opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-[#00C4B4] hidden md:inline-flex"
              >
                <LinkIcon className="w-4 h-4" />
              </a>
              {children}
            </h2>
          );
        },
        h3: ({ children }) => (
          <h3 className="font-display text-[1.125rem] md:text-[1.375rem] font-bold text-[#0A2540] mt-11 mb-4 leading-snug tracking-[-0.01em]">
            <span className="inline-flex items-center gap-2.5">
              <span className="w-[3px] h-[1.2em] bg-[#00C4B4] rounded-full flex-shrink-0 inline-block align-middle" aria-hidden="true" />
              {children}
            </span>
          </h3>
        ),
        p: ({ children }) => (
          <p className="text-[#1f2a45] text-[1.0625rem] md:text-[1.1875rem] leading-[1.85] mb-7 font-[390]">
            {processChildren(children, seen)}
          </p>
        ),
        ul: ({ children }) => <ul className="md-ul my-7 space-y-3">{children}</ul>,
        ol: ({ children }) => <ol className="md-ol my-7 space-y-3">{children}</ol>,
        li: ({ children }) => (
          <li className="text-[#1f2a45] text-[1.0625rem] md:text-[1.125rem] leading-[1.75]">
            {processChildren(children, seen)}
          </li>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-[#007a72] underline decoration-[#00C4B4]/40 decoration-[1.5px] hover:text-[#00C4B4] hover:decoration-[#00C4B4] underline-offset-[4px] font-[500] transition-colors duration-100"
          >
            {children}
          </a>
        ),
        strong: ({ children }) => (
          <strong className="font-[700] text-[#0A2540] bg-[rgba(201,161,74,0.12)] px-[3px] py-[1px] rounded-[3px]">{children}</strong>
        ),
        table: ({ children }) => (
          <div className="my-10 -mx-3 sm:mx-0 overflow-x-auto rounded-2xl border border-[rgba(14,20,36,0.09)] bg-white shadow-[0_2px_16px_rgba(10,37,64,0.06)]">
            <table className="w-full text-[14.5px]">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-gradient-to-r from-[#f7f9fd] to-[#eef1f8] border-b-2 border-[rgba(14,20,36,0.08)]">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="text-left px-5 py-3.5 font-bold text-[#0A2540] text-[11px] uppercase tracking-[0.1em] whitespace-nowrap">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-5 py-4 border-t border-[rgba(14,20,36,0.05)] text-[#1f2a45] text-[14.5px] leading-relaxed">
            {children}
          </td>
        ),
        blockquote: ({ children }) => (
          <blockquote className="my-10 relative overflow-hidden rounded-2xl p-6 md:p-8" style={{ background: 'linear-gradient(135deg, rgba(0,196,180,0.07) 0%, rgba(201,161,74,0.05) 100%)', boxShadow: 'inset 0 0 0 1px rgba(0,196,180,0.2)' }}>
            <span
              aria-hidden="true"
              className="absolute -top-2 -left-1 font-display font-black text-[6rem] leading-none text-[#00C4B4]/10 select-none pointer-events-none"
            >&ldquo;</span>
            <div className="relative text-[#0A2540] text-[1.125rem] md:text-[1.25rem] leading-[1.7] italic font-[500] tracking-[-0.005em]">
              {children}
            </div>
          </blockquote>
        ),
        code: ({ children }) => (
          <code className="bg-[#eef6f5] text-[#007a72] px-1.5 py-0.5 rounded-md text-[0.875em] font-mono border border-[#00C4B4]/20 tabular-nums font-[500]">
            {children}
          </code>
        ),
        hr: () => (
          <div className="my-14 flex items-center gap-0" aria-hidden="true">
            <span className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(14,20,36,0.1)] to-transparent" />
            <span className="mx-4 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#00C4B4]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A14A]" />
              <span className="w-1 h-1 rounded-full bg-[#00C4B4]" />
            </span>
            <span className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(14,20,36,0.1)] to-transparent" />
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
