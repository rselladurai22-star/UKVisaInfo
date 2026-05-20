import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import EnergyBillClient from './EnergyBillClient';

export const metadata: Metadata = {
  title: 'UK Energy Bill Calculator 2026 — Ofgem Price Cap Rates (Apr–Jun)',
  description: 'Free UK energy bill estimator using the current Ofgem price cap. Enter your annual gas and electricity kWh to see annual, monthly and vs-typical bills.',
  alternates: { canonical: '/energy-bill' },
};

export default function EnergyBillPage() {
  return (
    <CalcPageShell
      url="/energy-bill"
      eyebrow="Energy · UK · Ofgem cap"
      title="What will your energy bill be?"
      deck="Enter your annual electricity and gas kWh. We apply the current Ofgem price-cap unit rates and standing charges, and compare your bill to Ofgem's typical-use benchmark."
      verified="Ofgem default tariff cap"
      related={[
        { href: '/council-tax-band',  title: 'Council Tax band',  desc: 'Annual council tax estimate.' },
        { href: '/cost-of-living-uk', title: 'Cost of living',    desc: 'Compare any two UK cities.' },
        { href: '/take-home-pay',     title: 'Take-home pay',     desc: 'Net pay to budget against.' },
      ]}
      educational={[
        { title: 'How the price cap works', body: 'Ofgem sets a maximum unit rate (p/kWh) and standing charge (p/day) each quarter — separately for electricity and gas. It applies to standard variable tariffs (default tariffs); fixed-rate deals can be either above or below it.' },
        { title: 'Where to find your kWh', body: 'Check your last annual statement — every supplier shows a 12-month total. Or your in-home display (IHD) for smart meters. Without those, Ofgem\'s typical use is 2,700 kWh electricity and 11,500 kWh gas for a medium gas-heated home.' },
        { title: 'Standing charge is fixed', body: 'You pay the daily standing charge whether you use any energy or not. For a low-use home it can be 30-50% of the total bill — which is why Ofgem has been consulting on rebalancing standing charge vs unit rate.' },
        { title: 'Direct Debit vs Standard Credit', body: 'Direct Debit is the cheapest payment method under the cap. Standard Credit (pay-on-bill) costs more because suppliers absorb the bad-debt risk. Prepayment was rebalanced to roughly match Direct Debit from 1 April 2024.' },
        { title: 'Region matters', body: 'There are 14 regional caps. Our calculator uses a GB average — your actual bill can be ~5% above or below depending on whether you\'re in the cheap regions (East Midlands, Yorkshire) or expensive (Merseyside, North Wales, South Scotland).' },
        { title: 'Beyond the cap', body: 'Some fixed deals from suppliers undercut the cap (great if you can lock in before prices rise). Smart meter time-of-use tariffs (Octopus Agile, EDF GoElectric, etc.) can save significant amounts for households able to shift usage off-peak.' },
      ]}
    >
      <EnergyBillClient />
    </CalcPageShell>
  );
}
