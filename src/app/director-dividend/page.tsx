import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Sparkles, ChevronDown } from 'lucide-react';
import DirectorDividendClient from './DirectorDividendClient';
import s from '../../components/calc/calc.module.css';

export const metadata: Metadata = {
  title: 'UK Director Salary & Dividend Calculator 2026/27 — Optimise Split',
  description:
    'Free Ltd Company Director salary and dividend calculator. Calculate the optimal extraction ratio to minimise Corporation Tax and Personal Tax under 2026/27 rules.',
  alternates: { canonical: '/director-dividend' },
  openGraph: {
    title: 'UK Director Salary & Dividend Calculator 2026/27 — Optimise Split',
    description: 'Find the sweet spot for your director salary and dividend extraction under 2026/27 tax rates.',
    url: 'https://ukvisainfo.co.uk/director-dividend',
    type: 'website',
  },
};

export default function DirectorDividendPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the optimal director salary in the UK for 2026/27?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For the 2026/27 tax year, the optimal salary for a sole director of a limited company is £12,570. This matches the Primary National Insurance threshold and personal allowance, meaning no employee or employer National Insurance is due, while giving the director a qualifying year towards the state pension and providing a corporation tax deduction.'
        }
      },
      {
        '@type': 'Question',
        name: 'How are dividends taxed in the UK for 2026/27?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For 2026/27, dividends are subject to a £500 tax-free allowance. Above this, they are taxed based on your tax band: 8.75% for Basic Rate, 33.75% for Higher Rate, and 39.35% for Additional Rate taxpayers.'
        }
      }
    ]
  };

  return (
    <div className={s.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className={s.wrap}>
        <div className={s.crumb}>
          <Link href="/">Home</Link><span className={s.sep}>›</span>
          <Link href="/">Calculators</Link><span className={s.sep}>›</span>
          <span>Director Salary &amp; Dividend Split</span>
        </div>

        <div className={s.toolHead}>
          <div className={s.pillWrapper} style={{ marginBottom: '12px' }}>
            <span className={s.tag}>
              <Sparkles size={11} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Director Optimisation · 2026/27
            </span>
          </div>
          <h1 className={s.h1}>Director Salary &amp; Dividend Split</h1>
          <p className={s.intro}>
            Find the sweet spot. Calculate the optimal split between salary and dividend extraction from your UK Limited Company to minimise Corporation Tax and Personal Tax.
          </p>
          <span className={s.trust}>
            <ShieldCheck size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            HMRC 2026/27 Rules · Corp Tax &amp; Dividend Bands Integrated · Standalone browser sandbox
          </span>
        </div>

        <DirectorDividendClient />

        <details className={s.seoAccordion} style={{ marginTop: '48px', border: '1px solid #e2e8f0', borderRadius: '16px', background: '#ffffff', overflow: 'hidden' }}>
          <summary className={s.seoSummary} style={{ padding: '20px', fontSize: '15.5px', fontWeight: 800, color: '#1e293b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', listStyle: 'none', background: '#f8fafc' }}>
            <span>Tax Guide &amp; Reference (Detailed Handbook)</span>
            <ChevronDown size={18} style={{ color: '#64748b' }} />
          </summary>
          <div style={{ padding: '24px 32px', borderTop: '1px solid #e2e8f0' }}>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-6">
              Director Tax Extraction Guide: Optimising Salary and Dividends
            </h2>

            <div className="space-y-8 text-slate-700 leading-relaxed text-sm md:text-base">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  The Dual-Tax Extraction Mechanism
                </h3>
                <p className="mb-4">
                  Operating a UK Limited Company allows directors to extract business profits through a combination of a Director's Salary (which is a tax-deductible expense for the company) and Dividends (which are paid from post-Corporation Tax profits). 
                </p>
                <p className="mb-4">
                  By balancing these two components, you can significantly reduce your combined corporate and personal tax liabilities. A salary reduces the profit subject to Corporation Tax, while dividends are completely exempt from National Insurance contributions and carry lower income tax rates than standard employment earnings.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  Why £12,570 is the Default Director Sweet Spot
                </h3>
                <p className="mb-4">
                  For the 2026/27 tax year, the standard Personal Allowance is £12,570. In addition:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2 text-sm">
                  <li><strong>Secondary NI Threshold:</strong> The point at which employers pay NI on employees' wages is £9,100.</li>
                  <li><strong>Primary NI Threshold:</strong> The point at which employees pay National Insurance is £12,570.</li>
                </ul>
                <p className="mb-4">
                  If you pay a salary of £12,570, you pay zero employee NI. However, because £12,570 is above the £9,100 secondary threshold, the company must pay 13.8% Employer NI on the excess (£3,470), which amounts to £479. 
                  However, the entire £12,570 salary plus the £479 employer NI are tax-deductible expenses, saving the company Corporation Tax (at 19% or 25%). This corp tax saving outweighs the NI cost, making £12,570 the primary optimum point for most single-director businesses.
                </p>
              </div>
            </div>
          </div>
        </details>

        <div className={s.disclaimer} style={{ marginTop: '32px' }}>
          Calculations are based on the latest HMRC UK tax thresholds for the 2026/27 tax year. Results are generated for educational purposes and do not constitute formal regulated financial advice. Tax rules depend on your individual circumstances and may change.
        </div>
      </div>
    </div>
  );
}
