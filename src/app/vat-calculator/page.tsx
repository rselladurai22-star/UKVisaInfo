import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import VatClient from './VatClient';

export const metadata: Metadata = {
  title: 'UK VAT Calculator — Add or Remove 20%, 5%, 0% VAT',
  description: 'Free UK VAT calculator. Add VAT to a net price or remove VAT from a gross price at 20% standard, 5% reduced or 0% zero rate. HMRC-aligned.',
  alternates: { canonical: '/vat-calculator' },
};

export default function VatPage() {
  return (
    <CalcPageShell
      url="/vat-calculator"
      eyebrow="VAT · UK · HMRC rates"
      title="VAT calculator — add or remove."
      deck="Type any price. Get the net, VAT and gross instantly at 20% standard, 5% reduced or 0% zero rate."
      verified="HMRC VAT Notice 700"
      related={[
        { href: '/take-home-pay',          title: 'Take-home pay',     desc: 'PAYE, NI, student loan, pension — 2026/27 rates.' },
        { href: '/stamp-duty-calculator',  title: 'Stamp Duty',        desc: 'SDLT 2026 with FTB relief and surcharges.' },
        { href: '/mortgage-affordability', title: 'Mortgage affordability', desc: 'How much you can borrow + stress test.' },
      ]}
      educational={[
        { title: 'Standard rate · 20%', body: 'Applies to most goods and services in the UK. Adult clothing, furniture, restaurant meals, alcohol, tobacco and most household items are charged at 20%.' },
        { title: 'Reduced rate · 5%',   body: 'Applies to domestic fuel and power, children\'s car seats, mobility aids for older people, smoking-cessation products, and energy-saving materials installed in residential accommodation.' },
        { title: 'Zero rate · 0%',      body: 'Most food (not catering, alcoholic drinks, confectionery or hot takeaways), books, newspapers, children\'s clothing and shoes, public transport, and prescriptions are zero-rated — VAT-registered, but at 0%.' },
        { title: 'Exempt vs zero',      body: 'Different things. Exempt supplies (financial services, insurance, postal services) are entirely outside VAT. Zero-rated supplies are VAT-able but at 0% — the supplier can still reclaim input VAT.' },
        { title: 'Registration threshold', body: 'A business must register for VAT once taxable turnover exceeds £90,000 in any 12-month rolling period (HMRC, from 1 April 2024). Below that, registration is voluntary.' },
        { title: 'Quick math', body: 'Adding 20%: multiply net by 1.20. Removing 20%: divide gross by 1.20 (not multiply by 0.80 — common mistake). The VAT element of a £120 gross at 20% is £20, not £24.' },
      ]}
    >
      <VatClient />
    </CalcPageShell>
  );
}
