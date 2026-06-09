import { TrendingUp } from 'lucide-react';

export default function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <figure className="my-10 relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-ink via-[#00287e] to-[#0037b0] p-7 md:p-10 text-white border border-outline-variant/30 shadow-soft">
      <div
        className="absolute inset-0 opacity-[0.22] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)',
          backgroundSize: '18px 18px',
        }}
      />
      <div className="absolute -right-16 -bottom-16 w-56 h-56 rounded-full bg-primary-soft/20 blur-3xl pointer-events-none" />
      <div className="relative z-10 flex items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-primary-fixed mb-3">
            <TrendingUp className="w-3 h-3" />
            Key figure
          </div>
          <div className="font-display font-bold text-[2.5rem] md:text-[3.5rem] leading-[1] tracking-[-0.03em] tabular-nums text-white">
            {value}
          </div>
          <figcaption className="mt-3 text-primary-fixed/80 text-[14px] md:text-[15px] leading-snug max-w-md">
            {label}
          </figcaption>
        </div>
      </div>
    </figure>
  );
}
