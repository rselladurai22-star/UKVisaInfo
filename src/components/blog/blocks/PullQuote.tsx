export default function PullQuote({
  content, attribution,
}: { content: string; attribution?: string }) {
  return (
    <figure className="my-14 relative px-2 md:px-0">
      {/* Giant decorative quote mark */}
      <span
        aria-hidden="true"
        className="absolute -top-4 -left-1 md:-left-4 text-[6rem] leading-none text-[#00C4B4] select-none pointer-events-none"
        style={{ fontFamily: 'Georgia, serif', opacity: 0.18, lineHeight: 1 }}
      >
        &ldquo;
      </span>
      <blockquote
        className="relative pl-6 md:pl-8 pr-3 pt-2"
        style={{ borderLeft: '3px solid #00C4B4' }}
      >
        <p
          className="text-[1.3rem] md:text-[1.6rem] font-bold text-[#0A2540] leading-[1.35] tracking-[-0.015em]"
          style={{ fontFamily: 'var(--font-grotesk), sans-serif' }}
        >
          {content}
        </p>
        {attribution && (
          <figcaption
            className="mt-4 flex items-center gap-2.5 text-[11.5px] text-[#7a8195] font-semibold uppercase tracking-[0.12em]"
            style={{ fontFamily: 'var(--font-grotesk), sans-serif' }}
          >
            <span className="w-8 h-px bg-[#00C4B4]" />
            {attribution}
          </figcaption>
        )}
      </blockquote>
    </figure>
  );
}
