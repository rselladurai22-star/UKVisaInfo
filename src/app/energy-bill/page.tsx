import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import EnergyBillClient from './EnergyBillClient';
import { CAP } from '../../lib/energy/calc';

export const metadata: Metadata = {
  title: `UK Energy Bill Calculator 2026 — Ofgem Price Cap, Unit Rates & Standing Charges`,
  description:
    'Free UK energy bill estimator using the current Ofgem price cap. Enter your annual gas and electricity kWh to see your annual, monthly, and vs-typical-household bill. Includes standing charge breakdown and advice on reducing costs.',
  alternates: { canonical: '/energy-bill' },
  openGraph: {
    title: 'UK Energy Bill Calculator — Ofgem Price Cap 2026',
    description:
      'Estimate your annual energy bill using Ofgem price cap rates. Compare to the Ofgem typical household and see where your costs come from.',
    url: 'https://ukvisainfo.co.uk/energy-bill',
  },
};

const FAQS = [
  {
    q: 'What is the Ofgem price cap and how does it work?',
    a: 'The Ofgem price cap limits the maximum unit rate (pence per kWh) and daily standing charge (pence per day) that energy suppliers can charge domestic customers on standard variable (default) tariffs. It does not cap the total annual bill — a household that uses more energy pays more. Ofgem sets the cap quarterly based on wholesale energy market prices, supplier operating costs, network charges, and policy levies. The cap currently applies separately to electricity and gas, with different rates for Direct Debit, Standard Credit, and Prepayment meter customers.',
  },
  {
    q: 'What are the current Ofgem price cap unit rates?',
    a: `The rates in our calculator are for the cap window starting ${CAP.windowLabel}. For electricity: ${CAP.electricity.unitPence}p per kWh unit rate and ${CAP.electricity.standingPence}p per day standing charge. For gas: ${CAP.gas.unitPence}p per kWh unit rate and ${CAP.gas.standingPence}p per day standing charge. These are GB-average Direct Debit rates. Regional rates vary by up to ~5%. Ofgem publishes new rates approximately 6 weeks before each quarter begins — check ofgem.gov.uk for the latest.`,
  },
  {
    q: 'What is the Ofgem typical household energy consumption?',
    a: 'Ofgem\'s Typical Domestic Consumption Values (TDCV) for a medium-sized gas-heated UK home are 2,700 kWh of electricity and 11,500 kWh of gas per year. The annual bill for a typical household at current cap rates is approximately £1,750–£1,850 depending on region. Your usage may be very different: a flat without gas heating may use only 1,500–2,000 kWh of electricity; a large gas-heated house may use 15,000+ kWh of gas.',
  },
  {
    q: 'What is a standing charge and can I avoid it?',
    a: 'A standing charge is a fixed daily cost you pay regardless of how much energy you use. It covers network maintenance, metering, and supplier operating costs. For electricity it is currently around 53–61p per day (approximately £195–£225 per year) and for gas around 29–33p per day (approximately £106–£120 per year). You cannot avoid standing charges on any standard tariff — they are built into the cap structure. Some specialist tariffs (e.g. Octopus Zero Standing Charge) eliminate the daily charge but have higher unit rates. For low-use homes, a zero-standing-charge tariff may be cheaper; for higher-use homes, a low-unit-rate tariff typically wins.',
  },
  {
    q: 'Is it worth fixing my energy tariff?',
    a: 'Fixed-rate tariffs lock in a price per kWh for a set period (typically 12–24 months) regardless of what happens to the price cap. Whether fixing is worthwhile depends on: (1) whether the fixed rate is above or below the current cap; (2) your view of future energy prices; and (3) exit fees if you want to switch early. When wholesale prices are expected to rise, fixing can save money. When prices are expected to fall, sticking with a standard variable tariff exposes you to lower rates. Energy price forecasting is notoriously unreliable — always compare the total annual cost of the fixed deal against the current cap before committing.',
  },
  {
    q: 'Are prepayment meters more expensive than Direct Debit?',
    a: 'From 1 April 2024 Ofgem rebalanced prepayment meter (PPM) cap rates to be roughly equal to Direct Debit rates — ending the previous "poverty premium" where PPM customers paid more. However, in practice some smaller difference remains and PPM customers have less flexibility in supplier choice. If you are on a PPM and struggling with bills, Ofgem\'s Priority Services Register and the Energy Company Obligation (ECO4) scheme may provide insulation and energy-efficiency upgrades.',
  },
  {
    q: 'How do I find out how many kWh I use per year?',
    a: 'Your annual energy statement (sent by your supplier at least annually) shows your 12-month consumption in kWh. If you have a smart meter, your in-home display (IHD) shows real-time and historical usage. If you have neither: read your gas and electricity meters now and 12 months ago (your supplier stores historical reads in your account) and subtract. Without any records, use Ofgem\'s TDCV benchmarks: 2,700 kWh electricity and 11,500 kWh gas for a medium gas-heated home.',
  },
  {
    q: 'Can I get help with my energy bills?',
    a: 'Several schemes exist: (1) Warm Home Discount — a one-off annual rebate (£150 in 2025/26) for eligible low-income households on certain benefits; (2) Energy Company Obligation (ECO4) — free insulation and heating upgrades for eligible households; (3) Great British Insulation Scheme — additional insulation for homes in energy efficiency bands D–G; (4) Priority Services Register — free support services (advance notice of disruptions, accessible bills, annual gas safety checks) for eligible customers including those with medical needs, disabilities, or those with children under 5. Apply via your supplier.',
  },
  {
    q: 'What can I do to reduce my energy bill?',
    a: 'The most impactful reductions: (1) Loft insulation — reduces heat loss significantly and has a payback of 2–4 years; (2) Reducing heating by 1°C — saves approximately 10% on heating bills; (3) Smart meter with IHD — awareness alone typically reduces usage by 3–5%; (4) Replacing old gas boiler with a heat pump — very high upfront cost but low running cost, especially with cheap overnight electricity tariffs; (5) Solar panels — payback of 8–12 years on current costs; (6) Draught-proofing — low cost, high impact. The Microgeneration Certification Scheme (MCS) and government grants are available for heat pumps and solar.',
  },
  {
    q: 'What are time-of-use tariffs and who should consider them?',
    a: 'Time-of-use tariffs charge different unit rates at different times of day. Examples include Octopus Agile (half-hourly pricing following wholesale markets), Octopus Go (very cheap overnight rate for EV charging), and EDF\'s GoElectric. These can produce significant savings for households that can shift usage to off-peak times — charging an EV overnight, running dishwashers and washing machines at night, or using a smart battery storage system. For households with flexible demand and a smart meter, savings of 20–40% on electricity costs are achievable. For households with fixed usage patterns, a flat unit-rate tariff is simpler.',
  },
];

export default function EnergyBillPage() {
  return (
    <CalcPageShell
      url="/energy-bill"
      eyebrow={`Energy · UK · Ofgem cap · ${CAP.windowLabel}`}
      title="UK Energy Bill Calculator — Ofgem price cap unit rates, standing charges and how to reduce your bill"
      deck="Enter your annual gas and electricity kWh to see your bill at current Ofgem cap rates, with a comparison against the typical UK household. Updated quarterly as Ofgem publishes new cap levels."
      verified="Ofgem default tariff cap · quarterly update"
      editorVerified="May 2026"
      methodology={{
        summary: `Unit rates and standing charges use Ofgem's published GB-average Direct Debit rates for ${CAP.windowLabel}: electricity ${CAP.electricity.unitPence}p/kWh and ${CAP.electricity.standingPence}p/day standing charge; gas ${CAP.gas.unitPence}p/kWh and ${CAP.gas.standingPence}p/day standing charge. Annual bill = (kWh × unit rate / 100) + (365 × standing charge / 100) for each fuel. The typical household comparison uses Ofgem's published Typical Domestic Consumption Values: 2,700 kWh electricity and 11,500 kWh gas. These rates are updated each quarter when Ofgem announces the new cap level — verify the current rates at ofgem.gov.uk.`,
        govUrl: 'https://www.ofgem.gov.uk/information-for-household-consumers/energy-price-cap',
        govLabel: 'Ofgem — Energy price cap',
      }}
      faqs={FAQS}
      sidebar={{
        keyRates: [
          { label: 'Electricity unit rate', value: `${CAP.electricity.unitPence}p/kWh`, sub: `GB average DD — ${CAP.windowLabel}`, accent: '#F59E0B' },
          { label: 'Electricity standing charge', value: `${CAP.electricity.standingPence}p/day`, sub: '~£196/year regardless of usage' },
          { label: 'Gas unit rate', value: `${CAP.gas.unitPence}p/kWh`, sub: 'GB average DD — Direct Debit' },
          { label: 'Gas standing charge', value: `${CAP.gas.standingPence}p/day`, sub: '~£119/year regardless of usage' },
          { label: 'Typical annual bill', value: '~£1,800', sub: 'Medium gas-heated home at current cap' },
        ],
        dates: [
          { date: 'Q3 2026', desc: 'Next Ofgem cap quarter (Jul–Sep 2026) — announced ~6 weeks before', urgent: false },
          { date: 'Q4 2026', desc: 'Oct–Dec 2026 cap — typically announced September', urgent: false },
          { date: 'Annual', desc: 'Warm Home Discount applied to bills — check eligibility each October', urgent: false },
        ],
        tips: [
          { heading: 'Compare deals when cap falls', body: 'Fixed tariffs are worth considering when wholesale prices are expected to rise. When falling, stay on variable. Check Energy comparison sites (Uswitch, MoneySuperMarket) against the cap before fixing.' },
          { heading: 'Check Warm Home Discount eligibility', body: 'The Warm Home Discount is a £150 annual credit for eligible households. If you receive certain means-tested benefits and your supplier participates, you may receive it automatically.' },
          { heading: 'Smart meter + IHD reduces usage', body: 'Awareness of real-time usage typically cuts consumption by 3–5%. Smart meters also enable access to time-of-use tariffs for EV charging at very low overnight rates.' },
          { heading: 'Standing charges are unavoidable', body: 'Even a household using zero energy pays ~£315/year in combined standing charges. For very low-use homes, a zero-standing-charge tariff with higher unit rates may be cheaper overall.' },
        ],
        govLink: 'ofgem.gov.uk/information-for-household-consumers/energy-price-cap',
        govLabel: 'Ofgem — Price cap information',
      }}
      related={[
        { href: '/council-tax-band', title: 'Council Tax band calculator', desc: 'Estimate annual council tax alongside your energy costs.' },
        { href: '/cost-of-living-uk', title: 'Cost of living UK', desc: 'Compare total household costs between UK cities.' },
        { href: '/take-home-pay', title: 'Take-home pay calculator', desc: 'Model your net income against household bills.' },
      ]}
      educational={[
        {
          title: 'How the Ofgem price cap works — and what it does not limit',
          body: 'The Ofgem price cap is widely described as a cap on annual energy bills, but this is a simplification that causes confusion. What Ofgem actually caps:\n\n**Capped:** The unit rate (p/kWh) for electricity and gas, and the standing charge (p/day) for each fuel. These are the maximum rates suppliers can charge on standard variable (default) tariffs.\n\n**Not capped:** The total amount you pay. If you use twice as much energy as the "typical" household, you pay twice as much. The cap limits the rate, not the quantity.\n\n**What "typical" means:** Ofgem uses a benchmark — 2,700 kWh of electricity and 11,500 kWh of gas — to illustrate what a "typical medium household" pays. This number appears in headlines as "the energy bill cap." In reality, your bill depends entirely on your consumption.\n\n**Payment method matters:** The cap has slightly different rates for Direct Debit (cheapest), Standard Credit (slightly higher), and Prepayment meters (roughly aligned with DD since April 2024). Always compare rates for your specific payment method.\n\n**Regional variation:** There are 14 regional electricity networks in Great Britain. The cap sets different rates for each region, though they typically vary only by ±3–5%. Our calculator uses GB-average rates.',
        },
        {
          title: 'Standing charges — the fixed cost you pay regardless of usage',
          body: 'The standing charge is a daily fixed cost for each fuel, covering network infrastructure, meter reading, and supplier operating costs. At current cap rates:\n\n- Electricity standing charge: ~53–61p/day = **£195–£225 per year**\n- Gas standing charge: ~29–33p/day = **£106–£120 per year**\n- **Combined annual standing charge cost: ~£300–£345**\n\nFor a household using very little energy (a small flat with no gas), standing charges can represent 40–60% of the total annual bill. This is why low-energy-use households often find their bill uncomfortably high relative to actual consumption.\n\n**Zero standing charge tariffs:** Some providers offer tariffs with no daily standing charge — Octopus Energy\'s "Agile Octopus" zero standing charge product, for example. The trade-off is higher unit rates. Whether this saves money depends on your usage pattern:\n- Very low usage (under ~1,500 kWh electricity, no gas): zero standing charge may be cheaper\n- Average or high usage: a flat-rate tariff with lower unit rates typically wins\n\n**Ofgem consultation on standing charges:** Ofgem has been consulting on rebalancing the standing charge and unit rate structure. Future quarters may see the balance shift — check ofgem.gov.uk for updates.',
        },
        {
          title: 'Direct Debit vs prepayment vs Standard Credit — cost differences',
          body: 'Your payment method affects how much you pay under the cap:\n\n**Direct Debit (cheapest):** Monthly payment from bank account. Our calculator uses DD rates. Suppliers spread the estimated annual cost over 12 months. You typically pay based on estimated usage — over or under payments are reconciled at the end of each year via a statement.\n\n**Prepayment meters (PPM):** Payment before use via top-up key, card, or app. From 1 April 2024 Ofgem aligned PPM rates with DD rates, ending the historic "poverty premium." PPM customers now pay approximately the same as DD customers per unit. However, PPM customers cannot always access the best fixed deals and have less supplier choice.\n\n**Standard Credit (pay-on-bill):** Receive a quarterly or monthly bill and pay it. Higher unit rates under the cap than DD, because suppliers price in the risk of late or non-payment. For a typical household, paying by Standard Credit can cost £80–£130 more per year than paying by Direct Debit.\n\n**Practical tip:** If you are on Standard Credit and able to switch to Direct Debit, the switch is usually straightforward and saves money immediately.',
        },
        {
          title: 'Fixed tariffs — when to fix and when to stay variable',
          body: 'Fixed-rate energy tariffs lock in a unit rate for a set period. They can be cheaper or more expensive than the variable cap rate — it depends on timing.\n\n**When to consider fixing:**\n- When wholesale energy prices are rising and fixed rates are below the forecast cap level\n- When you want budget certainty and cannot easily absorb bill spikes\n- When the fixed rate is 5–10% below the current cap and analysts forecast rises\n\n**When to stay variable:**\n- When fixed rates are higher than the current cap\n- When wholesale prices are falling and the cap is expected to reduce\n- When you may want to switch supplier or tariff during the fixed period (exit fees apply)\n\n**Exit fees:** Most fixed deals include an exit fee of £20–£50 per fuel if you leave before the end of the contract. This adds to the cost of switching if the market moves against your fixed rate.\n\n**How to compare:** Use comparison sites (Uswitch, MoneySuperMarket, Energy Guide) to see all available deals against the current cap. Enter your actual kWh usage for an accurate comparison — the headline "average household saving" figures use standard benchmarks that may not match your consumption.\n\nImportant: you can always switch from a variable tariff without penalty. The cap exists specifically so that consumers on variable tariffs are protected.',
        },
        {
          title: 'Time-of-use tariffs and smart meters — the future of energy pricing',
          body: 'Traditional energy tariffs charge the same rate 24 hours a day. Time-of-use (TOU) tariffs charge different rates at different times, reflecting the true cost of generating and distributing electricity.\n\n**Key TOU tariff types:**\n- **Octopus Agile:** Half-hourly pricing based on wholesale market. Cheap overnight (occasionally free or negative), expensive during peak evening hours (5–8pm). Suits flexible households or those with home batteries.\n- **Octopus Go / EDF GoElectric:** Very cheap overnight rate (2–5p/kWh from midnight to 5am or similar) for EV charging. Higher daytime rate. Works well for EV owners who charge overnight.\n- **Economy 7 / Economy 10:** Legacy off-peak tariffs (7 or 10 hours of cheap overnight electricity). Designed for storage heaters and night-storage hot water tanks. Less suited to modern EV charging than purpose-built EV tariffs.\n\n**Requirements for TOU tariffs:** You must have a smart meter installed. The meter measures consumption in half-hour intervals and transmits data to the supplier. Without a smart meter, time-of-use billing is not possible.\n\n**Savings potential:** For households with flexible demand (EVs, batteries, smart appliances), TOU savings of 20–40% on electricity costs are achievable. For households with fixed demand patterns (you use the same electricity regardless of time), a flat tariff is simpler and often comparable in cost.',
        },
      ]}
    >
      <EnergyBillClient />
    </CalcPageShell>
  );
}
