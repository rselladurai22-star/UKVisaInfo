'use client';

/** Hero search — the single hydrated island on the home page. */

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, CornerDownLeft } from 'lucide-react';
import { APP_TILES } from '../data/tools';
import s from './HomeSearch.module.css';

interface Item { href: string; title: string; hint: string; group: string; keywords: string[]; }

const INDEX: Item[] = [
  ...APP_TILES.map<Item>((t) => ({
    href: t.href, title: t.label, hint: t.hint, group: 'Tool',
    keywords: t.label.toLowerCase().split(/\s+/),
  })),
  { href: '/postcode', title: 'Postcode super-lookup', hint: 'Council · MP · NHS · police', group: 'Place', keywords: ['postcode'] },
  { href: '/visa-types', title: 'All UK visa routes', hint: '14 routes · 2026 fees', group: 'Visa', keywords: ['visa', 'routes'] },
  { href: '/visa/skilled-worker', title: 'Skilled Worker visa', hint: '£41,700 · sponsored', group: 'Visa', keywords: ['skilled', 'worker'] },
  { href: '/visa/student', title: 'Student visa', hint: '£558 · degree study', group: 'Visa', keywords: ['student'] },
  { href: '/visa/family', title: 'Family visa', hint: '£29,000 income', group: 'Visa', keywords: ['family', 'spouse'] },
  { href: '/eligibility', title: 'Eligibility quiz', hint: 'Match in 60 seconds', group: 'Visa', keywords: ['quiz', 'eligibility'] },
  { href: '/blog', title: 'All guides', hint: 'Long-form articles', group: 'Guide', keywords: ['guides', 'blog'] },
];

export default function HomeSearch() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fn = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); ref.current?.focus(); }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [] as Item[];
    const isPostcode = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(t);
    if (isPostcode) return [{
      href: `/postcode/${t.replace(/\s+/g, '').toUpperCase()}`,
      title: `Look up ${t.toUpperCase()}`, hint: 'Council · MP · NHS · police', group: 'Place', keywords: [],
    }];
    return INDEX.filter((i) =>
      i.title.toLowerCase().includes(t) || i.hint.toLowerCase().includes(t) || i.keywords.some((k) => k.includes(t)),
    ).slice(0, 7);
  }, [q]);

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    if (e.key === 'Enter') { const r = results[active]; if (r) { e.preventDefault(); router.push(r.href); } }
    if (e.key === 'Escape') ref.current?.blur();
  };

  const show = focused && q.trim().length > 0 && results.length > 0;

  return (
    <div className={s.zone}>
      <label htmlFor="uk-q" className={s.sr}>Search UKDesk</label>
      <div className={`${s.search} ${focused ? s.focused : ''}`}>
        <Search className={s.sIcon} size={22} />
        <input
          id="uk-q" ref={ref} value={q} autoComplete="off" type="text"
          role="combobox" aria-expanded={show} aria-controls="uk-results" aria-autocomplete="list"
          onChange={(e) => { setQ(e.target.value); setActive(0); }}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 160)}
          onKeyDown={onKey}
          placeholder="Search a calculator, visa route or postcode…"
        />
        <button type="button" className={s.go} onClick={() => { const r = results[active]; router.push(r ? r.href : '/tools'); }}>Search</button>
      </div>
      {show && (
        <div className={s.results} id="uk-results" role="listbox" aria-label="Suggestions">
          {results.map((r, i) => (
            <Link
              key={r.href} href={r.href} className={s.row} role="option" aria-selected={i === active}
              style={i === active ? { background: '#F7F7FB' } : undefined}
              onMouseEnter={() => setActive(i)}
            >
              <span className={s.rtx}><span className={s.rtt}>{r.title}</span><span className={s.rhint}>{r.hint}</span></span>
              <span className={s.rtag}>{r.group}</span>
              <CornerDownLeft className={s.rkey} size={14} />
            </Link>
          ))}
        </div>
      )}
      <div className={s.chips}>
        <span className={s.lbl}>Popular</span>
        <Link href="/take-home-pay" className={s.chip}>Take-home pay</Link>
        <Link href="/child-benefit-calculator" className={s.chip}>Child benefit</Link>
        <Link href="/stamp-duty-calculator" className={s.chip}>Stamp duty</Link>
        <Link href="/mot-check" className={s.chip}>MOT check</Link>
      </div>
    </div>
  );
}
