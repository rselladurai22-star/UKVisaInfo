import { TrendingUp } from 'lucide-react';

export default function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <figure className="my-10 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a1530] via-[#13204a] to-[#1c2c63] p-7 md:p-10 text-white">
      <div
        className="absolute inset-0 opacity-[0.22] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,191,71,0.5) 1px, transparent 0)',
          backgroundSize: '18px 18px',
        }}
      />
      <div className="absolute -right-16 -bottom-16 w-56 h-56 rounded-full bg-[#d9152b]/25 blur-3xl pointer-events-none" />
      <div className="relative z-10 flex items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#ffbf47] mb-3">
            <TrendingUp className="w-3 h-3" />
            Key figure
          </div>
          <div className="font-display font-bold text-[2.5rem] md:text-[3.5rem] leading-[1] tracking-[-0.03em] tabular-nums bg-gradient-to-r from-[#ffbf47] to-[#ff9f43] bg-clip-text text-transparent">
            {value}
          </div>
          <figcaption className="mt-3 text-white/55 text-[14px] md:text-[15px] leading-snug max-w-md">
            {label}
          </figcaption>
        </div>
      </div>
    </figure>
  );
}
