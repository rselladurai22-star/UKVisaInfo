export default function PullQuote({
  content, attribution,
}: { content: string; attribution?: string }) {
  return (
    <figure className="my-12 relative px-2 md:px-0">
      {/* Giant decorative quote mark */}
      <span
        aria-hidden="true"
        className="absolute -top-4 -left-1 md:-left-4 text-[6rem] leading-none text-blue-600 select-none pointer-events-none"
        style={{ fontFamily: 'Georgia, serif', opacity: 0.16, lineHeight: 1 }}
      >
        &ldquo;
      </span>
      <blockquote className="relative pl-6 md:pl-8 pr-3 pt-2 border-l-[3px] border-blue-600">
        <p className="font-display text-[1.25rem] md:text-[1.5rem] font-bold text-slate-900 leading-[1.4] tracking-[-0.015em]">
          {content}
        </p>
        {attribution && (
          <figcaption className="mt-4 flex items-center gap-2.5 font-mono text-[11px] text-slate-500 font-semibold uppercase tracking-[0.12em]">
            <span className="w-8 h-px bg-blue-600" />
            {attribution}
          </figcaption>
        )}
      </blockquote>
    </figure>
  );
}
