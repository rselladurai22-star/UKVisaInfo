/**
 * Shared shell used by all UK calculator pages.
 * Ensures consistent typography, spacing and trust badge across:
 *   /take-home-pay, /stamp-duty-calculator, /mortgage-affordability,
 *   /council-tax-band, /cost-of-living-uk.
 *
 * Pure server component — pass children to slot the calculator body.
 */
import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface Props {
  eyebrow: string;
  title: string;
  deck: string;
  verified?: string;
  url?: string;
  related?: { href: string; title: string; desc: string }[];
  educational?: { title: string; body: string }[];
  children: React.ReactNode;
}

export default function CalcPageShell({
  eyebrow, title, deck, verified = 'gov.uk / HMRC verified', url, related, educational, children,
}: Props) {
  const jsonLd = url ? {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: title,
    description: deck,
    url: `https://ukvisainfo.co.uk${url}`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    inLanguage: 'en-GB',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
    provider: { '@type': 'Organization', name: 'UKDesk', url: 'https://ukvisainfo.co.uk' },
  } : null;

  return (
    <div className="bg-white min-h-screen relative">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {/* Subtle dot pattern over hero */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[420px] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(118,119,126,0.18) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '-12px -12px',
          opacity: 0.14,
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
        }}
      />

      <div className="relative max-w-[1280px] mx-auto px-4 md:px-10 pt-[100px] md:pt-[120px] pb-20">
        <header className="text-center max-w-3xl mx-auto pb-10 md:pb-14">
          <span
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full bg-[#f3f4f5] text-[#45464d] mb-5"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {eyebrow}
          </span>
          <h1
            className="font-bold text-[#101a36] tracking-[-0.025em]"
            style={{
              fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
              fontSize: 'clamp(2.25rem, 6vw, 3.5rem)',
              lineHeight: '1.05',
              textWrap: 'balance' as React.CSSProperties['textWrap'],
            }}
          >
            {title}
          </h1>
          <p
            className="mt-5 text-[16px] md:text-[18px] text-[#45464d] leading-[1.55] max-w-2xl mx-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {deck}
          </p>
          <div
            className="mt-6 inline-flex items-center gap-2 text-[12.5px] font-semibold text-[#15803d]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            {verified} · Free · No signup
          </div>
        </header>

        {children}

        {related && related.length > 0 && (
          <section className="mt-16 md:mt-20">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e] mb-2"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Related tools
            </p>
            <h2
              className="font-bold text-[#101a36] tracking-[-0.015em] mb-6"
              style={{
                fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
                fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
              }}
            >
              What you might calculate next
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="group block bg-white border border-[#E5E7EB] rounded-xl p-5 hover:border-[#101a36] transition-colors duration-100 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.04)]"
                >
                  <h3
                    className="font-semibold text-[15px] text-[#101a36] leading-tight mb-1.5"
                    style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
                  >
                    {r.title}
                  </h3>
                  <p
                    className="text-[12.5px] text-[#45464d] leading-[1.55] mb-3"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {r.desc}
                  </p>
                  <span
                    className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#101a36] group-hover:gap-2 transition-[gap] duration-100"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Open <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {educational && educational.length > 0 && (
          <section className="mt-12 bg-white border border-[#E5E7EB] rounded-xl p-6 md:p-8 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.04)]">
            <h2
              className="font-bold text-[#101a36] text-[18px] md:text-[20px] mb-4"
              style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
            >
              How it works
            </h2>
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 text-[14px] text-[#45464d] leading-[1.65]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {educational.map((b) => (
                <div key={b.title}>
                  <h3
                    className="font-semibold text-[#101a36] mb-1.5"
                    style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
                  >
                    {b.title}
                  </h3>
                  <p>{b.body}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
