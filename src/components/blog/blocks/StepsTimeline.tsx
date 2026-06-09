import type { StepItem } from '../parseSegments';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function StepsTimeline({ items }: { items: StepItem[] }) {
  if (!items.length) return null;
  return (
    <ol className="my-10 relative pl-0">
      {/* connector line behind the badges */}
      <span
        aria-hidden="true"
        className="absolute left-[15px] top-3 bottom-3 w-px bg-gradient-to-b from-primary/40 via-outline-variant/30 to-primary/40"
      />

      {items.map((step, i) => (
        <li key={i} className="relative pl-12 pb-8 last:pb-0">
          {/* numbered badge */}
          <span
            aria-hidden="true"
            className="absolute left-0 top-0 w-[32px] h-[32px] rounded-full bg-white border-2 border-primary text-primary font-display font-bold text-[13px] flex items-center justify-center shadow-soft"
          >
            {i + 1}
          </span>
          <h4 className="font-display text-[1.0625rem] md:text-[1.1875rem] font-bold text-on-surface leading-tight mb-1.5">
            {step.title}
          </h4>
          {step.body && (
            <div
              className="text-on-surface-variant text-[15.5px] leading-[1.75]"
              style={{ fontFamily: 'var(--font-lora), Georgia, serif' }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  strong: ({ children }) => (
                    <strong
                      className="font-bold text-on-surface"
                      style={{ background: 'var(--color-primary-soft)', padding: '0 3px', borderRadius: '3px' }}
                    >{children}</strong>
                  ),
                  a: ({ href, children }) => (
                    <a href={href} className="text-primary underline decoration-primary/40 hover:text-primary-strong font-semibold">{children}</a>
                  ),
                }}
              >
                {step.body}
              </ReactMarkdown>
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
