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
    <div className="article-body w-full text-slate-900 antialiased">
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

      {/* Scoped reading-experience polish — flagship (Clean Slate) typography */}
      <style>{`
        .article-body h2,
        .article-body h3,
        .article-body h4 {
          font-family: var(--font-display), ui-sans-serif, sans-serif;
          text-wrap: balance;
        }
        .article-body p { text-wrap: pretty; }

        /* Unordered list — blue dot */
        .article-body .md-ul { list-style: none; padding-left: 0; }
        .article-body .md-ul > li { position: relative; padding-left: 1.6rem; }
        .article-body .md-ul > li::before {
          content: ''; position: absolute; left: 0.3rem; top: 0.72em;
          width: 6px; height: 6px; border-radius: 9999px;
          background: #2563eb;
        }

        /* Ordered list — numbered slate badge */
        .article-body .md-ol { list-style: none; counter-reset: li; padding-left: 0; }
        .article-body .md-ol > li { position: relative; padding-left: 2.5rem; counter-increment: li; }
        .article-body .md-ol > li::before {
          content: counter(li); position: absolute; left: 0; top: 0.05em;
          width: 1.7rem; height: 1.7rem; border-radius: 8px;
          background: #eff6ff; color: #2563eb; font-weight: 800; font-size: 0.78rem;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid #dbeafe;
          font-family: var(--font-mono), monospace;
        }

        /* Tables — flagship rounded card + blue row hover */
        .article-body .md-table-wrap {
          background:
            linear-gradient(to right, #ffffff 30%, rgba(255,255,255,0)) left center,
            linear-gradient(to left, #ffffff 30%, rgba(255,255,255,0)) right center,
            radial-gradient(farthest-side at 0 50%, rgba(15,23,42,0.12), rgba(15,23,42,0)) left center,
            radial-gradient(farthest-side at 100% 50%, rgba(15,23,42,0.12), rgba(15,23,42,0)) right center;
          background-repeat: no-repeat;
          background-size: 42px 100%, 42px 100%, 16px 100%, 16px 100%;
          background-attachment: local, local, scroll, scroll;
          -webkit-overflow-scrolling: touch;
        }
        .article-body table tbody tr { transition: background-color .15s ease; }
        .article-body table tbody tr:hover { background: #eff6ff; }
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
            <h2
              id={id}
              className="group relative font-display text-[clamp(22px,3.4vw,30px)] font-extrabold leading-tight tracking-[-0.025em] text-slate-900 mt-14 mb-4 scroll-mt-24"
            >
              <a
                href={`#${id}`}
                aria-label="Anchor link"
                className="absolute -left-7 top-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-blue-600 hidden md:inline-flex"
              >
                <LinkIcon className="w-4 h-4" />
              </a>
              {children}
            </h2>
          );
        },
        h3: ({ children }) => (
          <h3 className="font-display text-[1.0625rem] md:text-[1.25rem] font-bold text-slate-900 mt-8 mb-2.5 leading-snug tracking-[-0.01em]">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="font-display text-[1rem] md:text-[1.0625rem] font-bold text-slate-900 mt-6 mb-2">
            {children}
          </h4>
        ),
        p: ({ children }) => (
          <p className="text-slate-700 text-[16.5px] md:text-[17px] leading-relaxed mb-5">
            {processChildren(children, seen)}
          </p>
        ),
        ul: ({ children }) => <ul className="md-ul my-5 space-y-2.5">{children}</ul>,
        ol: ({ children }) => <ol className="md-ol my-5 space-y-2.5">{children}</ol>,
        li: ({ children }) => (
          <li className="text-slate-700 text-[16px] md:text-[16.5px] leading-relaxed">
            {processChildren(children, seen)}
          </li>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-blue-700 font-semibold underline decoration-blue-300 decoration-[1.5px] underline-offset-[3px] hover:decoration-blue-600 transition-colors"
          >
            {children}
          </a>
        ),
        strong: ({ children }) => (
          <strong className="font-bold text-slate-900">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-slate-600">{children}</em>
        ),
        table: ({ children }) => (
          <div className="md-table-wrap my-8 -mx-3 sm:mx-0 overflow-x-auto rounded-2xl border border-slate-200 shadow-cs">
            <table className="w-full min-w-[34rem] border-collapse text-[14px]">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-slate-100 text-left">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="text-left px-3 sm:px-4 py-3 font-semibold text-slate-700 text-[11px] sm:text-[12px] uppercase tracking-[0.06em] whitespace-nowrap">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-3 sm:px-4 py-2.5 sm:py-3 border-t border-slate-100 text-slate-600 text-[0.8125rem] sm:text-[0.9375rem] leading-relaxed tabular-nums">
            {children}
          </td>
        ),
        blockquote: ({ children }) => (
          <figure className="my-8 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
            <div className="text-slate-700 text-[16px] leading-relaxed italic">
              {children}
            </div>
          </figure>
        ),
        code: ({ children }) => (
          <code className="text-blue-700 px-1.5 py-0.5 rounded-md text-[0.875em] font-mono tabular-nums bg-slate-100 border border-slate-200">
            {children}
          </code>
        ),
        hr: () => <hr className="my-12 border-0 border-t border-slate-200" />,
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
