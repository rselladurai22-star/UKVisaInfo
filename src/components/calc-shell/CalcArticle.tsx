'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { BookOpen } from 'lucide-react';
import a from './calcArticle.module.css';

export interface ArticleSection {
  id: string;
  title: string;
  body: ReactNode;
}

export default function CalcArticle({ heading, readingTime, sections }: {
  heading: string;
  readingTime?: string;
  sections: ArticleSection[];
}) {
  const [active, setActive] = useState(sections[0]?.id ?? '');

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(`art-${s.id}`))
      .filter((el): el is HTMLElement => Boolean(el));
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((x, y) => x.boundingClientRect.top - y.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id.replace('art-', ''));
      },
      { rootMargin: '-120px 0px -70% 0px', threshold: 0 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sections]);

  return (
    <section className={a.wrap}>
      <header className={a.header}>
        <span className={a.eyebrow}><BookOpen size={13} /> In-depth guide</span>
        <h2 className={a.heading}>{heading}</h2>
        {readingTime && <p className={a.meta}>{readingTime}</p>}
      </header>

      <div className={a.layout}>
        <aside className={a.tocCol}>
          <nav className={a.toc} aria-label="On this page">
            <span className={a.tocLabel}>On this page</span>
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#art-${s.id}`}
                className={`${a.tocLink} ${active === s.id ? a.tocLinkActive : ''}`}
              >
                {s.title}
              </a>
            ))}
          </nav>
        </aside>

        <div className={a.prose}>
          {sections.map((s, i) => (
            <article key={s.id} id={`art-${s.id}`} className={a.section}>
              <div className={a.sectionTitleRow}>
                <span className={a.sectionNum}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className={a.sectionTitle}>{s.title}</h3>
              </div>
              {s.body}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
