import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import SalarySacrificeClient from './SalarySacrificeClient';

export const metadata: Metadata = {
  title: 'Salary Sacrifice Calculator 2025/26 — Pension NI Saving, Employee & Employer',
  description: 'UK salary sacrifice pension calculator 2025/26. See how much employee NI (8%) + employer NI (15%) you save versus a personal pension contribution. Instantly shows net cost reduction.',
  alternates: { canonical: '/salary-sacrifice-calculator' },
};

export default function SalarySacrificePage() {
  return (
    <CalcPageShell
      url="/salary-sacrifice-calculator"
      eyebrow="Salary Sacrifice · UK · 2025/26"
      title="Salary sacrifice: the cheapest way to fill your pension."
      deck="Every pound you sacrifice saves Income Tax plus NI — both yours and your employer&rsquo;s. A £1,000 sacrifice into your pension can cost you less than £550 in take-home pay. Here&rsquo;s exactly how much."
      verified="gov.uk/salary-sacrifice-and-the-effects-on-paye"
      related={[
        { href: '/take-home-pay', title: 'Take-home pay', desc: 'See how sacrifice changes your monthly net pay.' },
        { href: '/national-insurance', title: 'National Insurance', desc: 'Understand the NI rates driving the saving.' },
        { href: '/self-assessment-calculator', title: 'Self Assessment estimator', desc: 'Sacrifice can reduce adjusted net income below HICBC thresholds.' },
      ]}
      educational={[
        { title: 'How salary sacrifice works', body: 'You agree with your employer to reduce your gross salary by an amount, and they pay that amount directly into your pension as an employer contribution. Because your gross salary is lower, both you and your employer pay less National Insurance.' },
        { title: 'Savings vs a personal contribution', body: 'A personal pension contribution (Relief At Source or Net Pay Arrangement) saves Income Tax only. Salary sacrifice saves Income Tax AND employee NI (8% basic, 2% higher) AND employer NI (15%). At the basic rate that\'s a combined saving of 43%.' },
        { title: 'Employer NI pass-through', body: 'Many employers are legally required or voluntarily choose to pass their NI saving back into the employee\'s pension pot. Check your employer\'s policy — this can add £150 per £1,000 sacrificed.' },
        { title: 'Minimum wage floor', body: 'Salary sacrifice cannot reduce your gross pay below National Minimum Wage / National Living Wage. Your employer must reject or limit any sacrifice that would breach this.' },
        { title: 'Annual Allowance', body: 'Total pension contributions (yours + employer\'s) cannot exceed £60,000 per year (2025/26) without a tax charge. Salary sacrifice contributions are employer contributions and count toward this limit.' },
      ]}
    >
      <SalarySacrificeClient />
    </CalcPageShell>
  );
}
