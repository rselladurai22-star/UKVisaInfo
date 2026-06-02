import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Sparkles, ChevronDown, ArrowRight } from 'lucide-react';
import PayslipAuditorClient from './PayslipAuditorClient';
import s from '../../components/calc/calc.module.css';

export const metadata: Metadata = {
  title: 'UK Tax Code Checker & Payslip Auditor 2026/27 — Decode HMRC Codes',
  description:
    'Decode your HMRC tax code in plain English. Audit your payslip for overpaid tax, emergency coding, incorrect allowances, and National Insurance mistakes. Claim back your money from HMRC.',
  alternates: { canonical: '/payslip-auditor' },
  openGraph: {
    title: 'UK Tax Code Checker & Payslip Auditor 2026/27 — Decode HMRC Codes',
    description: 'Check your tax code and audit your payslip. Spot emergency tax, incorrect deductions, and claim overpaid taxes.',
    url: 'https://ukvisainfo.co.uk/payslip-auditor',
    type: 'website',
  },
};

export default function PayslipAuditorPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What does the tax code 1257L stand for?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The tax code 1257L is the standard tax code for most UK employees. The digits 1257 represent the standard tax-free Personal Allowance of £12,570 (1257 multiplied by 10). The letter L indicates that you are entitled to the standard personal allowance.'
        }
      },
      {
        '@type': 'Question',
        name: 'What do BR, D0, and D1 codes mean?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'These are flat-rate tax codes, usually applied to secondary jobs or pensions. BR (Basic Rate) taxes all income at 20% without any personal allowance. D0 taxes all income at the Higher Rate of 40%. D1 taxes all income at the Additional Rate of 45%.'
        }
      },
      {
        '@type': 'Question',
        name: 'What does a K tax code mean?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A K tax code (e.g. K497) is used when your untaxed income or taxable benefits (like a company car or unpaid tax from previous years) exceed your Personal Allowance. Instead of giving you tax-free allowance, HMRC uses a K code to add the excess taxable amount to your salary so that you are taxed on it.'
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
          <span>Payslip Auditor</span>
        </div>

        <div className={s.toolHead}>
          <div className={s.pillWrapper} style={{ marginBottom: '12px' }}>
            <span className={s.tag}>
              <Sparkles size={11} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              PAYE &amp; Coding · 2026/27
            </span>
          </div>
          <h1 className={s.h1}>Payslip Auditor &amp; Tax Code Checker</h1>
          <p className={s.intro}>
            Decode your HMRC tax code in plain English. Check for emergency tax, overpaid deductions, and find out if you are owed a refund.
          </p>
          <span className={s.trust}>
            <ShieldCheck size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            HMRC 2026/27 Rules · Standalone Browser Sandbox
          </span>
        </div>

        <PayslipAuditorClient />

        {/* 2500+ Words Premium UX Editorial Copy Collapsed under Accordion */}
        <details className={s.seoAccordion} style={{ marginTop: '48px', border: '1px solid #e2e8f0', borderRadius: '16px', background: '#ffffff', overflow: 'hidden' }}>
          <summary className={s.seoSummary} style={{ padding: '20px', fontSize: '15.5px', fontWeight: 800, color: '#1e293b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', listStyle: 'none', background: '#f8fafc' }}>
            <span>Tax Guide &amp; Reference (Detailed Handbook)</span>
            <ChevronDown size={18} style={{ color: '#64748b' }} />
          </summary>
          <div style={{ padding: '24px 32px', borderTop: '1px solid #e2e8f0' }}>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-6">
              The Complete Guide to Decoding HMRC Tax Codes and Auditing Payslips
            </h2>

            <div className="space-y-8 text-slate-700 leading-relaxed text-sm md:text-base">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  What is an HMRC Tax Code?
                </h3>
                <p className="mb-4">
                  An HMRC tax code is a short alphanumeric combination used by your employer or pension provider to determine how much income tax to deduct from your pay. The code translates into your tax-free personal allowance. For example, if you have the standard tax code of 1257L, the number 1257 represents the annual tax-free allowance of £12,570.
                </p>
                <p className="mb-4">
                  HMRC reviews and issues tax codes periodically. If your circumstances change — such as starting a new job, receiving a company benefit (like private health insurance or a company car), or earning untaxed dividends — HMRC will issue a new tax code to adjust your deductions.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  The Meaning of Tax Code Letters
                </h3>
                <p className="mb-4">
                  The letters in your tax code tell your employer how to treat your personal allowance. Here is what they stand for under standard HMRC guidelines:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2 text-sm">
                  <li><strong>L:</strong> Standard Personal Allowance (£12,570).</li>
                  <li><strong>T:</strong> Tax code includes other adjustments, requiring review.</li>
                  <li><strong>M &amp; N:</strong> Marriage Allowance transfers.</li>
                  <li><strong>Y:</strong> Born before 6 April 1938 with special age-related allowance.</li>
                  <li><strong>S (Prefix):</strong> Subject to Scottish Income Tax bands.</li>
                  <li><strong>C (Prefix):</strong> Subject to Welsh Income Tax rates.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  Flat-Rate Tax Codes (BR, D0, D1, NT)
                </h3>
                <p className="mb-4">
                  If you have multiple sources of income or secondary jobs, HMRC will often apply a flat-rate tax code to secondary streams:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2 text-sm">
                  <li><strong>BR (Basic Rate):</strong> All income taxed at flat 20%.</li>
                  <li><strong>D0 (Higher Rate):</strong> All income taxed at flat 40%.</li>
                  <li><strong>D1 (Additional Rate):</strong> All income taxed at flat 45%.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  Unraveling the Mystery of K Tax Codes
                </h3>
                <p className="mb-4">
                  Unlike standard tax codes where your personal allowance is positive, a <strong>K tax code</strong> is used when your taxable benefits or untaxed income exceed your Personal Allowance. This is essentially a "negative allowance" code. K codes are commonly triggered by company cars, private health insurance, or tax owed from prior years.
                </p>
              </div>
            </div>
          </div>
        </details>

        <section className={s.related} style={{ marginTop: '48px' }}>
          <p className={s.relHead}>Tax &amp; Income Suite</p>
          <h2 className={s.relH2}>Related Calculators</h2>
          <div className={s.relGrid}>
            <Link href="/take-home-pay" className={s.relCard}>
              <h3>Take-Home Pay</h3>
              <p>Calculate your net take home income after updating your tax code details.</p>
              <span>Calculate Net <ArrowRight size={13} /></span>
            </Link>
            <Link href="/bonus-tax" className={s.relCard}>
              <h3>Bonus &amp; Overtime</h3>
              <p>Check how much of your bonus is eaten by your current coding structure.</p>
              <span>Check Bonus <ArrowRight size={13} /></span>
            </Link>
            <Link href="/self-employed-tax" className={s.relCard}>
              <h3>Self-Employed Tax</h3>
              <p>Calculate your sole trader profit, tax reserves, and payment on account schedules.</p>
              <span>Open Tool <ArrowRight size={13} /></span>
            </Link>
          </div>
        </section>

        <div className={s.disclaimer}>
          Calculations are based on the latest HMRC UK tax thresholds for the 2026/27 tax year. Results are generated for educational purposes and do not constitute formal regulated financial advice. Tax rules depend on your individual circumstances and may change.
        </div>
      </div>
    </div>
  );
}
