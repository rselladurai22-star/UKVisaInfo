import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import CompanyCarClient from './CompanyCarClient';

export const metadata: Metadata = {
  title: 'Company Car Tax Calculator 2025/26 — BiK, CO2, Employee & Employer Cost',
  description: 'UK company car benefit-in-kind tax calculator 2025/26. Enter list price and CO2 emissions — get employee Income Tax cost and employer Class 1A NI. Compare electric vs petrol vs diesel.',
  alternates: { canonical: '/company-car-tax' },
};

export default function CompanyCarPage() {
  return (
    <CalcPageShell
      url="/company-car-tax"
      eyebrow="Company Car Tax · UK · 2025/26 HMRC rates"
      title="What does your company car really cost?"
      deck="Benefit-in-Kind tax means your employer pays you a perk — and HMRC charges both of you. Enter the list price and CO2 to see the true annual cost in Income Tax and employer NI."
      verified="gov.uk/guidance/company-car-benefit-the-appropriate-percentage"
      related={[
        { href: '/salary-sacrifice-calculator', title: 'Salary sacrifice', desc: 'An EV via salary sacrifice can be far cheaper than a company car.' },
        { href: '/take-home-pay', title: 'Take-home pay', desc: 'See how the BiK charge feeds through to your net pay.' },
        { href: '/mileage-expense-calculator', title: 'Mileage expenses', desc: 'Using your own car? Claim AMAP rates instead.' },
      ]}
      educational={[
        { title: 'What is Benefit-in-Kind?', body: 'When your employer provides a company car for private use, HMRC treats it as employment income. The taxable value is the car\'s list price multiplied by an "appropriate percentage" based on CO2 emissions.' },
        { title: 'Electric cars — 3% in 2025/26', body: 'Pure electric vehicles have an appropriate percentage of just 3%, rising 1% per year to a maximum of 5% by 2027/28. This makes an EV company car extremely tax-efficient versus a petrol equivalent at 25–37%.' },
        { title: 'Diesel surcharge', body: 'Diesel cars that do not meet the Real Driving Emissions 2 (RDE2) standard face a 4% surcharge on top of the CO2-based percentage, capped at 37% overall.' },
        { title: 'Employer Class 1A NI', body: 'Your employer pays Class 1A National Insurance at 15% on the BiK value — a real cost to the business that can influence how employers structure packages.' },
        { title: 'Capital contribution', body: 'If you contribute up to £5,000 toward the car\'s purchase price, the list price for BiK purposes is reduced by that amount, saving tax for both you and your employer.' },
      ]}
    >
      <CompanyCarClient />
    </CalcPageShell>
  );
}
