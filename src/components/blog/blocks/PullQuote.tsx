export default function PullQuote({
  content, attribution,
}: { content: string; attribution?: string }) {
  return (
    <figure className="my-12 relative">
      {/* Giant decorative quote */}
      <span
        aria-hidden="true"
        className="absolute -top-2 -left-2 md:-left-6 font-display font-bold text-[6rem] md:text-[8rem] leading-none text-[#00C4B4]/10 select-none"
      >&ldquo;</span>

      <blockquote className="relative pl-7 md:pl-10 pr-3 border-l-[3px] border-[#00C4B4]">
        <p className="font-display text-[1.375rem] md:text-[1.75rem] font-bold text-[#0A2540] leading-[1.25] tracking-[-0.015em]">
          {content}
        </p>
        {attribution && (
          <figcaption className="mt-4 flex items-center gap-2 text-[12px] text-[#7a8195] font-medium uppercase tracking-[0.1em]">
            <span className="w-6 h-px bg-[#00C4B4]" />
            {attribution}
          </figcaption>
        )}
      </blockquote>
    </figure>
  );
}
