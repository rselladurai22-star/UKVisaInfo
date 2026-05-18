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
        className="absolute left-[15px] top-3 bottom-3 w-px bg-gradient-to-b from-[#d9152b]/40 via-[#0a1530]/15 to-[#d9152b]/40"
      />

      {items.map((step, i) => (
        <li key={i} className="relative pl-12 pb-8 last:pb-0">
          {/* numbered badge */}
          <span
            aria-hidden="true"
            className="absolute left-0 top-0 w-[32px] h-[32px] rounded-full bg-white border-2 border-[#d9152b] text-[#d9152b] font-display font-bold text-[13px] flex items-center justify-center shadow-[0_2px_8px_rgba(217,21,43,0.18)]"
          >
            {i + 1}
          </span>
          <h4 className="font-display text-[1.0625rem] md:text-[1.1875rem] font-bold text-[#0a1530] leading-tight mb-1.5">
            {step.title}
          </h4>
          {step.body && (
            <div className="text-[#52596e] text-[15px] leading-[1.65]">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => <p>{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold text-[#0a1530]">{children}</strong>,
                  a: ({ href, children }) => (
                    <a href={href} className="text-[#d9152b] underline decoration-[#d9152b]/35 hover:decoration-[#d9152b] font-medium">{children}</a>
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
