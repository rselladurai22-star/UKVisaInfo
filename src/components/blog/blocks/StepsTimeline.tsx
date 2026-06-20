import type { StepItem } from '../parseSegments';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function StepsTimeline({ items }: { items: StepItem[] }) {
  if (!items.length) return null;
  return (
    <ol className="my-8 relative pl-0">
      {/* connector line behind the badges */}
      <span
        aria-hidden="true"
        className="absolute left-[15px] top-4 bottom-4 w-px bg-slate-200"
      />

      {items.map((step, i) => (
        <li key={i} className="relative pl-12 pb-7 last:pb-0">
          {/* numbered badge */}
          <span
            aria-hidden="true"
            className="absolute left-0 top-0 w-8 h-8 rounded-full bg-blue-600 text-white font-mono font-bold text-[13px] flex items-center justify-center shadow-sm"
          >
            {i + 1}
          </span>
          <h4 className="font-display text-[15px] md:text-[16px] font-bold text-slate-900 leading-tight mb-1">
            {step.title}
          </h4>
          {step.body && (
            <div className="text-slate-600 text-[14.5px] md:text-[15px] leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  strong: ({ children }) => (
                    <strong className="font-bold text-slate-900">{children}</strong>
                  ),
                  a: ({ href, children }) => (
                    <a href={href} className="text-blue-700 underline font-semibold hover:decoration-blue-600">{children}</a>
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
