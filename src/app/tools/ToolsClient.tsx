'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronRight,
  Search,
  X,
  HomeIcon,
  Shield,
  LandmarkIcon,
  Plane,
  PiggyBank,
  Wallet,
  Building2,
  FileText,
  Users,
  Zap,
  Briefcase,
  Car,
  Gift,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { APP_TILES, CATEGORIES, type CategoryId } from '../../data/tools';
import { VISA_TOOLS } from '../../lib/categoryMeta';

const TOTAL = APP_TILES.length + VISA_TOOLS.length;

function hexToRgba(hex: string, a: number) {
  const m = hex.replace('#', '');
  const v = m.length === 3 ? m.split('').map((c) => c + c).join('') : m;
  const n = parseInt(v, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

const BENTO_CARDS = [
  {
    id: 'property',
    title: 'Mortgages & Property',
    icon: HomeIcon,
    color: '#0037b0',
    count: '18 Tools',
    hubHref: '/property',
    tools: [
      { label: '✅ Stamp Duty (SDLT)', href: '/stamp-duty-calculator' },
      { label: '✅ Mortgage Affordability', href: '/mortgage-affordability' },
      { label: 'Buy-to-Let Yield', href: '/rental-yield-calculator' },
    ],
  },
  {
    id: 'insurance',
    title: 'Insurance',
    isNew: true,
    icon: Shield,
    color: '#006c49',
    count: '12 Tools',
    hubHref: '/insurance',
    tools: [
      { label: '✅ Life Cover Premium', href: '/insurance' },
      { label: '✅ Critical Illness', href: '/insurance' },
      { label: 'Public Liability 🆕', href: '/insurance' },
    ],
  },
  {
    id: 'loans',
    title: 'Loans & Credit',
    isNew: true,
    icon: LandmarkIcon,
    color: '#ba1a1a',
    count: '15 Tools',
    hubHref: '/loans',
    tools: [
      { label: '✅ Debt Consolidation', href: '/loans' },
      { label: '✅ Credit Card Interest', href: '/loans' },
      { label: 'APR Comparison 🆕', href: '/loans' },
    ],
  },
  {
    id: 'immigration',
    title: 'Immigration & Visas',
    icon: Plane,
    color: '#0037b0',
    count: '9 Tools',
    hubHref: '/immigration',
    tools: [
      { label: '✅ Skilled Worker', href: '/visa/skilled-worker' },
      { label: '✅ IHS Surcharge', href: '/ihs-calculator' },
      { label: 'Indefinite Leave 🆕', href: '/immigration' },
    ],
  },
  {
    id: 'savings',
    title: 'Pensions & Savings',
    icon: PiggyBank,
    color: '#623c00',
    count: '20 Tools',
    hubHref: '/savings',
    tools: [
      { label: '✅ SIPP Contribution', href: '/savings' },
      { label: '✅ Compound Interest', href: '/savings' },
      { label: 'ISA Allowance 🆕', href: '/isa-calculator' },
    ],
  },
  {
    id: 'tax',
    title: 'Tax & Income',
    icon: Wallet,
    color: '#0037b0',
    count: '14 Tools',
    hubHref: '/tax',
    tools: [
      { label: '✅ UK Salary Tax', href: '/take-home-pay' },
      { label: '✅ VAT & Sales Tax', href: '/tax' },
      { label: 'Self-Assessment 🆕', href: '/self-employed-tax' },
    ],
  },
  {
    id: 'business',
    title: 'Business Hub',
    isNew: true,
    icon: Building2,
    color: '#006c49',
    count: '11 Tools',
    hubHref: '/business',
    tools: [
      { label: '✅ Ltd Co Dividend', href: '/director-dividend' },
      { label: '✅ IR35 Status', href: '/contractor-ir35' },
      { label: 'Capital Gains 🆕', href: '/cgt-calculator' },
    ],
  },
  {
    id: 'estate',
    title: 'Wills & Probate',
    isNew: true,
    icon: FileText,
    color: '#623c00',
    count: '7 Tools',
    hubHref: '/estate',
    tools: [
      { label: '✅ Inheritance Tax', href: '/inheritance-tax' },
      { label: '✅ Intestacy Rules', href: '/estate' },
      { label: 'Probate Fees 🆕', href: '/estate' },
    ],
  },
  {
    id: 'family-law',
    title: 'Divorce & Family',
    isNew: true,
    icon: Users,
    color: '#ba1a1a',
    count: '8 Tools',
    hubHref: '/family-law',
    tools: [
      { label: '✅ Child Maintenance', href: '/family-law' },
      { label: '✅ Asset Division', href: '/family-law' },
      { label: 'Legal Aid 🆕', href: '/family-law' },
    ],
  },
  {
    id: 'energy',
    title: 'Energy & Bills',
    isNew: true,
    icon: Zap,
    color: '#006c49',
    count: '10 Tools',
    hubHref: '/energy',
    tools: [
      { label: '✅ Price Cap Impact', href: '/energy-bill' },
      { label: '✅ Council Tax', href: '/council-tax-band' },
      { label: 'Water Rates 🆕', href: '/energy' },
    ],
  },
  {
    id: 'employment',
    title: 'Employment Hub',
    icon: Briefcase,
    color: '#0037b0',
    count: '13 Tools',
    hubHref: '/employment',
    tools: [
      { label: '✅ Redundancy Pay', href: '/redundancy-pay' },
      { label: '✅ Holiday Entitlement', href: '/holiday-pay' },
      { label: 'Minimum Wage 🆕', href: '/minimum-wage-checker' },
    ],
  },
  {
    id: 'vehicles',
    title: 'Vehicles & Motoring',
    icon: Car,
    color: '#0037b0',
    count: '16 Tools',
    hubHref: '/vehicles',
    tools: [
      { label: '✅ MOT & Tax Check', href: '/mot-check' },
      { label: '✅ Company Car Tax', href: '/vehicles' },
      { label: 'Fuel Economy 🆕', href: '/vehicles' },
    ],
  },
  {
    id: 'benefits',
    title: 'Benefits & Support',
    icon: Gift,
    color: '#0037b0',
    count: '11 Tools',
    hubHref: '/benefits',
    tools: [
      { label: '✅ Universal Credit', href: '/benefits' },
      { label: '✅ Childcare Costs', href: '/childcare-calculator' },
      { label: 'PIP Eligibility 🆕', href: '/benefits' },
    ],
  },
];

export default function ToolsIndex() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut CMD+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredTools = useMemo(() => {
    if (!q) return [];
    const pool = [
      ...APP_TILES.map((t) => ({
        href: t.href,
        label: t.label,
        hint: t.hint,
        icon: t.icon,
        accent: t.accent,
        category: t.category,
      })),
      ...VISA_TOOLS.map((t) => ({
        href: t.href,
        label: t.title,
        hint: t.hint,
        icon: t.icon,
        accent: t.accent,
        category: 'immigration' as CategoryId,
      })),
    ];
    return pool.filter(
      (t) =>
        t.label.toLowerCase().includes(q) ||
        t.hint.toLowerCase().includes(q)
    );
  }, [q]);

  return (
    <main className="min-h-screen bg-[#f9f9ff] text-[#151c27] font-sans pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 py-10">
        
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 text-sm font-semibold uppercase tracking-wider text-[#434655] opacity-80">
          <Link href="/" className="hover:text-[#0037b0] transition-colors flex items-center gap-1">
            <HomeIcon className="h-3.5 w-3.5" /> Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <span className="text-[#0037b0] font-bold">All Tools</span>
        </nav>

        {/* Header Section */}
        <section className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#151c27]">
                Browse all calculators
              </h1>
              <p className="text-[#434655] text-lg max-w-2xl leading-relaxed">
                Every free UK calculator and lookup — money, property, visas and more.
                Verified against GOV.UK, HMRC and ONS.
              </p>
            </div>
            {/* Trust Badge */}
            <div className="flex items-center gap-4 bg-[#006c49]/5 border border-[#006c49]/20 p-4 rounded-xl shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#6cf8bb] flex items-center justify-center text-[#00714d]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-[#00714d] uppercase tracking-widest leading-none mb-1">Trust Protocol</div>
                <div className="text-sm font-semibold text-[#006c49]">{TOTAL}+ Verified Hubs</div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Discovery Center */}
        <section className="mb-14">
          <div className="bg-[#f0f3ff]/80 p-8 rounded-2xl border border-[#c4c5d7]/30 shadow-sm">
            <div className="relative max-w-3xl mx-auto group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#0037b0] h-6 w-6 group-focus-within:scale-110 transition-transform" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find a specific tool or calculator..."
                className="w-full pl-16 pr-24 py-4 rounded-xl border border-[#c4c5d7]/30 shadow-md text-lg focus:ring-4 focus:ring-[#0037b0]/10 focus:border-[#0037b0]/20 outline-none bg-white transition-all placeholder:text-[#747686]/40 text-[#151c27]"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <kbd className="px-2 py-1 bg-[#f0f3ff] rounded text-[10px] font-mono text-[#747686] border border-[#c4c5d7]/50">CMD</kbd>
                <kbd className="px-2 py-1 bg-[#f0f3ff] rounded text-[10px] font-mono text-[#747686] border border-[#c4c5d7]/50">K</kbd>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-[#747686] uppercase tracking-widest mr-1">Quick Filter:</span>
              <button
                type="button"
                onClick={() => setQuery('Mortgage')}
                className="px-3.5 py-1 rounded-full bg-[#0037b0]/5 text-[#0037b0] text-xs font-semibold hover:bg-[#0037b0]/10 transition-colors border border-[#0037b0]/10 animate-fade-in"
              >
                Mortgage
              </button>
              <button
                type="button"
                onClick={() => setQuery('Tax')}
                className="px-3.5 py-1 rounded-full bg-[#0037b0]/5 text-[#0037b0] text-xs font-semibold hover:bg-[#0037b0]/10 transition-colors border border-[#0037b0]/10 animate-fade-in"
              >
                Income Tax
              </button>
              <button
                type="button"
                onClick={() => setQuery('new')}
                className="px-3.5 py-1 rounded-full bg-[#0037b0]/5 text-[#0037b0] text-xs font-semibold hover:bg-[#0037b0]/10 transition-colors border border-[#0037b0]/10 animate-fade-in"
              >
                New Tools 🆕
              </button>
              <button
                type="button"
                onClick={() => setQuery('Visa')}
                className="px-3.5 py-1 rounded-full bg-[#0037b0]/5 text-[#0037b0] text-xs font-semibold hover:bg-[#0037b0]/10 transition-colors border border-[#0037b0]/10 animate-fade-in"
              >
                Visas
              </button>
            </div>
          </div>
        </section>

        {/* Tools Results or Bento Grid */}
        {q ? (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#151c27]">
                Search Results for &ldquo;{query}&rdquo;
              </h2>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
              >
                Clear Search <X className="h-4 w-4" />
              </button>
            </div>
            {filteredTools.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-[#c4c5d7]/40 bg-white px-8 py-20 text-center shadow-sm max-w-lg mx-auto">
                <p className="text-base font-semibold text-[#151c27]">No tools match &ldquo;{query}&rdquo;.</p>
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="mt-3 text-sm font-semibold text-[#0037b0] hover:underline"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool) => {
                  const Icon = tool.icon;
                  const cat = CATEGORIES.find((c) => c.id === tool.category);
                  return (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="block bg-white p-5 rounded-2xl border border-[#c4c5d7]/20 transition-all duration-300 shadow-sm hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,55,176,0.06)] flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl"
                            style={{ backgroundColor: `${tool.accent}15`, color: tool.accent }}
                          >
                            <Icon className="h-5 w-5" />
                          </span>
                          {cat && (
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#f0f3ff] text-[#434655] uppercase tracking-wider">
                              {cat.label}
                            </span>
                          )}
                        </div>
                        <h3 className="text-[16px] font-bold text-[#151c27] mb-1 group-hover:text-[#0037b0] transition-colors">{tool.label}</h3>
                        <p className="text-xs text-[#434655] leading-relaxed mb-4">{tool.hint}</p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-[#c4c5d7]/10 text-[#0037b0] font-bold text-xs mt-auto uppercase tracking-wider group-hover:text-primary transition-colors">
                        <span>Launch Tool</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {BENTO_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  className="bg-white p-6 rounded-2xl border border-[#c4c5d7]/20 flex flex-col h-full transition-all duration-300 shadow-sm hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,55,176,0.06)]"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${card.color}15`, color: card.color }}
                    >
                      <Icon className="h-5.5 w-5.5" />
                    </div>
                    <h2 className="text-[16px] font-bold text-[#151c27] flex items-center gap-1.5 leading-snug">
                      {card.title}
                      {card.isNew && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                          NEW
                        </span>
                      )}
                    </h2>
                  </div>
                  <ul className="space-y-2 flex-grow mb-6">
                    {card.tools.map((t, idx) => (
                      <li key={idx}>
                        <Link
                          href={t.href}
                          className="group flex items-center justify-between text-sm text-[#434655] hover:text-[#0037b0] transition-colors py-0.5 leading-relaxed"
                        >
                          <span>{t.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#c4c5d7]/10">
                    <span className="text-[10px] font-bold text-[#747686] uppercase tracking-wider">{card.count}</span>
                    <Link
                      href={card.hubHref}
                      className="py-1.5 px-3.5 rounded-lg font-bold text-[11px] transition-all uppercase tracking-widest flex items-center gap-1"
                      style={{
                        backgroundColor: `${card.color}10`,
                        color: card.color,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = card.color;
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = `${card.color}10`;
                        e.currentTarget.style.color = card.color;
                      }}
                    >
                      Hub <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* Stats Section */}
        <section className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 bg-[#e2e8f8]/30 rounded-xl border border-[#c4c5d7]/20 flex items-center gap-4 shadow-sm">
            <TrendingUp className="h-6 w-6 text-[#0037b0]" />
            <div>
              <div className="text-2xl font-bold text-[#151c27]">{TOTAL}+</div>
              <div className="text-[10px] font-bold text-[#747686] uppercase tracking-wider">Active Tools</div>
            </div>
          </div>
          <div className="p-5 bg-[#e2e8f8]/30 rounded-xl border border-[#c4c5d7]/20 flex items-center gap-4 shadow-sm">
            <RefreshCw className="h-6 w-6 text-[#006c49]" />
            <div>
              <div className="text-2xl font-bold text-[#151c27]">Hourly</div>
              <div className="text-[10px] font-bold text-[#747686] uppercase tracking-wider">Rate Sync</div>
            </div>
          </div>
          <div className="p-5 bg-[#e2e8f8]/30 rounded-xl border border-[#c4c5d7]/20 flex items-center gap-4 shadow-sm">
            <CheckCircle2 className="h-6 w-6 text-[#623c00]" />
            <div>
              <div className="text-2xl font-bold text-[#151c27]">100%</div>
              <div className="text-[10px] font-bold text-[#747686] uppercase tracking-wider">Logic Verified</div>
            </div>
          </div>
          <div className="p-5 bg-[#e2e8f8]/30 rounded-xl border border-[#c4c5d7]/20 flex items-center gap-4 shadow-sm">
            <ShieldCheck className="h-6 w-6 text-[#ba1a1a]" />
            <div>
              <div className="text-2xl font-bold text-[#151c27]">Secure</div>
              <div className="text-[10px] font-bold text-[#747686] uppercase tracking-wider">Private Data</div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
