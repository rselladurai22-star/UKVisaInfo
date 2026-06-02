import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Sparkles, ChevronDown } from 'lucide-react';
import ContractorIR35Client from './ContractorIR35Client';
import s from '../../components/calc/calc.module.css';

export const metadata: Metadata = {
  title: 'UK Contractor IR35 Calculator 2026/27 — Inside vs Outside vs Perm',
  description:
    'Free contractor IR35 calculator. Compare your net take-home pay across Inside IR35 (Umbrella), Outside IR35 (Ltd Company), and Permanent employment. Audit your day rates.',
  alternates: { canonical: '/contractor-ir35' },
  openGraph: {
    title: 'UK Contractor IR35 Calculator 2026/27 — Inside vs Outside vs Perm',
    description: 'Determine your true earnings. Compare Inside vs Outside IR35 and permanent employee equivalents under 2026/27 tax rates.',
    url: 'https://ukvisainfo.co.uk/contractor-ir35',
    type: 'website',
  },
};

export default function ContractorIR35Page() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What does Inside IR35 mean?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Inside IR35 means that you are considered an employee of your client for tax purposes. You must pay tax and National Insurance at standard PAYE rates, usually calculated and deducted by an umbrella company. You do not receive the tax advantages of a limited company.'
        }
      },
      {
        '@type': 'Question',
        name: 'What does Outside IR35 mean?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Outside IR35 means that you are operating as a genuine independent business entity. You can pay yourself a combination of low salary and dividends from your limited company, deduct legitimate business expenses before tax, and manage your corporate taxation, keeping a significantly higher proportion of your day rate.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the corporate tax rate for Outside IR35 contractors?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For the 2026/27 tax year, limited companies pay Corporation Tax at 19% on profits up to £50,000. Profits above £250,000 are taxed at 25%. Profit levels between £50,000 and £250,000 are subject to a marginal relief rate of 26.5%, leading to an effective rate that scales between 19% and 25%.'
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
          <span>Contractor IR35 Comparator</span>
        </div>

        <div className={s.toolHead}>
          <div className={s.pillWrapper} style={{ marginBottom: '12px' }}>
            <span className={s.tag}>
              <Sparkles size={11} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Contracting &amp; IR35 · 2026/27
            </span>
          </div>
          <h1 className={s.h1}>Contractor &amp; IR35 Comparator</h1>
          <p className={s.intro}>
            Audit your contract offers. Perform a three-way comparison between Inside IR35 (Umbrella), Outside IR35 (Ltd Company), and Permanent employee positions.
          </p>
          <span className={s.trust}>
            <ShieldCheck size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            HMRC 2026/27 Rules · Corp Tax &amp; Dividends Integrated · Standalone browser sandbox
          </span>
        </div>

        <ContractorIR35Client />

        <details className={s.seoAccordion} style={{ marginTop: '48px', border: '1px solid #e2e8f0', borderRadius: '16px', background: '#ffffff', overflow: 'hidden' }}>
          <summary className={s.seoSummary} style={{ padding: '20px', fontSize: '15.5px', fontWeight: 800, color: '#1e293b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', listStyle: 'none', background: '#f8fafc' }}>
            <span>Tax Guide &amp; Reference (Detailed Handbook)</span>
            <ChevronDown size={18} style={{ color: '#64748b' }} />
          </summary>
          <div style={{ padding: '24px 32px', borderTop: '1px solid #e2e8f0' }}>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-6">
              Decoding IR35: Inside vs. Outside and the Real Value of Your Day Rate
            </h2>

            <div className="space-y-8 text-slate-700 leading-relaxed text-sm md:text-base">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  What is IR35? The Legislative Reality
                </h3>
                <p className="mb-4">
                  IR35, or the "off-payroll working rules," is a piece of UK tax legislation designed to identify "disguised employees" — individuals who work through an intermediary (typically their own Personal Service Company, or PSC) but who would be treated as employees if they were hired directly by the end client.
                </p>
                <p className="mb-4">
                  HMRC introduced these rules to prevent tax avoidance. Under a standard limited company structure, a contractor can pay themselves a minimal salary (reducing income tax and NI) and draw the remainder as dividends (which carry lower tax rates and are completely exempt from National Insurance). If HMRC determines that the relationship behaves like employment, the contractor is deemed "Inside IR35" and must pay taxes at standard PAYE rates.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  Inside IR35: Understanding the Umbrella Deduction Stack
                </h3>
                <p className="mb-4">
                  When you accept an Inside IR35 contract, you typically contract through an intermediary known as an <strong>umbrella company</strong>. The umbrella company becomes your legal employer. They invoice the agency or end client for your day rate and run payroll for you.
                </p>
                <p className="mb-4">
                  The assignment rate (your gross day rate) is not your gross salary. The assignment rate must cover all employer costs. Before your gross taxable salary is calculated on your payslip, the umbrella company deducts:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2 text-sm">
                  <li><strong>Employer National Insurance:</strong> 13.8% on earnings above £9,100 per year.</li>
                  <li><strong>Apprenticeship Levy:</strong> A 0.5% government tax on payrolls over £3m (passed down to you by almost all umbrellas).</li>
                  <li><strong>Umbrella Margin:</strong> The weekly or monthly fee the umbrella charges to process your payroll (typically £15 to £30 per week).</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  Outside IR35: Ltd Company Tax Optimisation
                </h3>
                <p className="mb-4">
                  Being Outside IR35 means you are operating a genuine business-to-business transaction. Your Limited Company invoices the client, and the revenue belongs to the company. This provides substantial tax planning flexibility.
                </p>
                <p className="mb-4">
                  The standard Outside IR35 extraction strategy is:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-3 text-sm">
                  <li>
                    <strong>Low Salary:</strong> Pay yourself a director's salary at the Primary Threshold (£12,570) to build a qualifying year for your state pension without paying NI. This salary is a tax-deductible expense for the company.
                  </li>
                  <li>
                    <strong>Corporation Tax:</strong> The company pays Corporation Tax on its remaining profits. The rate is 19% on profits under £50,000, 25% on profits over £250,000, and a marginal relief rate of 26.5% in the middle.
                  </li>
                  <li>
                    <strong>Dividends:</strong> The remaining profit after Corporation Tax is distributed to you as dividends. Dividends carry lower tax rates and are exempt from National Insurance, creating massive tax savings compared to employment.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  The Permanent Job Equivalent: What is your Day Rate Truly Worth?
                </h3>
                <p className="mb-4">
                  To compare a contracting offer with a permanent job offer, you must look beyond the raw numbers. Permanent employment includes a range of benefits that have a direct cash value:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2 text-sm">
                  <li><strong>Paid Annual Leave:</strong> A permanent employee receives a minimum of 28 days of paid holiday (including bank holidays). A contractor only gets paid for the days they work.</li>
                  <li><strong>Sick Pay:</strong> Permanent jobs usually include company sick pay, whereas contractors receive zero pay if they are unable to work.</li>
                  <li><strong>Pension Employer Contributions:</strong> Employers must contribute at least 3% under auto-enrolment.</li>
                  <li><strong>Other Perks:</strong> Health insurance, life cover, and annual performance bonuses.</li>
                </ul>
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
