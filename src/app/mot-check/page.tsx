import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import MotCheckClient from './MotCheckClient';

export const metadata: Metadata = {
  title: 'UK MOT Check by Reg Plate 2026 — MOT Due Date, History & Tax Status',
  description:
    'Enter any UK registration plate to validate it, see the vehicle registration era, check MOT due date, and access official DVSA MOT history and DVLA tax status. Free tool linking to official gov.uk data — no account needed.',
  alternates: { canonical: '/mot-check' },
  openGraph: {
    title: 'UK MOT & Tax Check by Reg Plate',
    description:
      'Validate any UK reg, see registration era, and jump straight to official DVSA MOT history and DVLA vehicle tax checker.',
    url: 'https://ukvisainfo.co.uk/mot-check',
  },
};

const FAQS = [
  {
    q: 'When does a car need its first MOT in the UK?',
    a: 'Cars and motorcycles need their first MOT on the third anniversary of the date they were first registered. After that, an MOT is required annually. For example, a car registered on 15 June 2022 would need its first MOT on or before 15 June 2025 and every year after. Classic and historic vehicles first registered before 1 January 1980 are exempt from MOT testing — though many owners still test them voluntarily.',
  },
  {
    q: 'How much does an MOT cost in 2026?',
    a: 'DVSA sets a maximum fee that garages cannot exceed: £54.85 for a car and £29.65 for a standard motorcycle (Category A). Garages can and often do charge less — many national chains run promotional prices. MOT testing stations cannot exceed the statutory cap, but they can charge separately for any repairs needed to pass the test. Get a few quotes for repair work; MOT testing itself is highly regulated but repair pricing is not.',
  },
  {
    q: 'Can I drive without a valid MOT?',
    a: 'No — it is a criminal offence to use a vehicle on a public road without a valid MOT (unless driving to a pre-booked MOT appointment). The fixed penalty is £1,000, rising to £2,500 if the vehicle is in a dangerous condition. More practically, your insurance is almost certainly invalidated without a valid MOT, meaning any accident could leave you personally liable for all costs. ANPR cameras across the UK automatically flag vehicles with expired MOTs.',
  },
  {
    q: 'Can I get an MOT done early without losing the renewal date?',
    a: 'Yes — this is one of the most useful MOT facts. You can have your MOT done up to one calendar month minus one day before the current MOT expires and the new certificate will be dated from the original expiry date, not from the test date. Example: your MOT expires 15 June. You can test from 15 May onwards. If you pass, the new MOT runs from 15 June next year. This lets you book at a convenient time rather than rushing at the last minute.',
  },
  {
    q: 'What is the difference between a Major, Minor, Dangerous, and Advisory failure?',
    a: 'Since May 2018, MOT results use four categories: (1) Dangerous — the vehicle has a direct and immediate risk to road safety or the environment. Must be fixed before driving. (2) Major — a significant defect likely to cause danger or have a serious environmental impact. Causes an immediate MOT failure. (3) Minor — a defect that has no significant effect on safety or environment. Noted on the certificate but does not cause a failure. (4) Advisory — something to monitor that may become an issue in future. Items marked Dangerous or Major cause a failure; Minor and Advisory items do not, and do not need to be fixed before driving away.',
  },
  {
    q: 'What are the most common MOT failure reasons?',
    a: 'According to DVSA data, the most common MOT failure categories are: (1) Lighting and signalling — 30% of failures, mostly blown bulbs; (2) Suspension — worn shock absorbers, springs, or ball joints; (3) Brakes — worn pads or discs, brake fluid leaks; (4) Tyres — below the 1.6mm legal minimum tread depth across the central 75% of the tyre; (5) Bodywork — sharp edges or structural corrosion; (6) Wipers and washers — ineffective clearing. Many of these can be checked and fixed cheaply before the test. A pre-MOT check at a reputable garage often costs nothing and can prevent a fail.',
  },
  {
    q: 'How do I check MOT history for a car I am thinking of buying?',
    a: 'Use the free DVSA MOT History checker at check.mot.api.gov.uk. Enter the registration number and you will see: all MOT results for the vehicle going back to 2005, mileage recorded at each test, any failures and the reason, and advisories from previous tests. Compare the mileage between tests to spot if an odometer may have been wound back (a form of fraud called "clocking"). A car with a history of repeated brake or suspension failures may be expensive to maintain.',
  },
  {
    q: 'What is a SORN and when do I need one?',
    a: 'A Statutory Off-Road Notification (SORN) tells DVLA that a vehicle is not being used on public roads. Once a SORN is in place, no road tax is needed and no MOT is required — but the vehicle must be kept off the public road. You can declare a SORN online at gov.uk/make-a-sorn in minutes. If you leave a vehicle uninsured and not SORNed, you face automatic fines and potentially a court summons. SORN is indefinite — it continues until you tax the vehicle again.',
  },
  {
    q: 'Does my vehicle need an MOT if it is electric?',
    a: 'Yes — electric cars need an annual MOT once they are three years old, just like petrol and diesel vehicles. The test covers most of the same elements (lights, brakes, steering, suspension, tyres, bodywork) but does not include the exhaust emission test, since EVs have no exhaust. Battery condition and charge are checked as part of the electrical safety assessment.',
  },
  {
    q: 'What is Vehicle Excise Duty (VED/road tax) and is it linked to the MOT?',
    a: 'Vehicle Excise Duty (VED), colloquially "road tax," is an annual or 6-monthly tax on vehicles used on public roads. Rates depend on the vehicle\'s CO2 emissions (for post-March 2001 registration) and size. Zero-emission electric vehicles currently pay zero-rate VED until 2025, after which rates change. Crucially, you cannot tax a vehicle that has an expired or invalid MOT — DVLA checks the MOT status automatically when you renew VED. If your MOT expires before your VED, sort the MOT first.',
  },
];

export default function MotCheckPage() {
  return (
    <CalcPageShell
      url="/mot-check"
      eyebrow="MOT & Tax · UK · DVSA / DVLA"
      title="UK MOT Check — validate any reg, see MOT due date, history and tax status"
      deck="Enter any UK registration plate. We validate it, infer the registration era, and link you to official DVSA MOT history and DVLA vehicle tax data — no account, no sign-up, completely free."
      verified="DVSA MOT History Service · DVLA Vehicle Enquiry"
      editorVerified="May 2026"
      methodology={{
        summary:
          'Registration plate validation uses the current-format two-letter area code (AA–YY), two-digit year identifier, and three random letters — following DVLA\'s format introduced September 2001. Pre-2001 format plates (prefix and suffix systems) are validated against known historical patterns. MOT due dates are inferred from registration date + 3 years for first test, then annually. This tool links to official DVSA and DVLA API services for live MOT history and tax status data.',
        govUrl: 'https://www.check.mot.api.gov.uk',
        govLabel: 'DVSA MOT History checker',
      }}
      faqs={FAQS}
      sidebar={{
        keyRates: [
          { label: 'MOT fee cap (car)', value: '£54.85', sub: 'Maximum per DVSA — garages can charge less', accent: '#0F766E' },
          { label: 'MOT fee cap (motorcycle)', value: '£29.65', sub: 'Category A motorcycles' },
          { label: 'No-MOT penalty', value: '£1,000', sub: 'Up to £2,500 if dangerous condition' },
          { label: 'First MOT due', value: '3 years', sub: 'From date of first registration' },
          { label: 'Early test window', value: '1 month − 1 day', sub: 'Test early, keep original renewal date' },
        ],
        dates: [
          { date: '3 yrs', desc: 'First MOT required — then annually', urgent: false },
          { date: '1 mth', desc: 'Earliest you can test early without losing the renewal date', urgent: false },
          { date: 'Pre-1980', desc: 'Historic vehicles (pre-1 Jan 1980) are MOT exempt', urgent: false },
        ],
        tips: [
          { heading: 'Book 4–6 weeks in advance', body: 'Popular test centres fill up quickly, especially before Easter and summer. Booking early gives you time to fix failures before the expiry date.' },
          { heading: 'Check MOT history before buying', body: 'Free DVSA MOT history checker shows all passes, failures, mileage, and advisories. Mileage drops between tests can indicate a clocked odometer.' },
          { heading: 'Pre-MOT checks save money', body: 'Check tyres (1.6mm minimum), lights, wipers, and windscreen chips before the test. These are the most common Minor/Major failures and are cheap to fix yourself.' },
          { heading: 'Advisories are warnings, not failures', body: 'Advisory items do not fail the MOT. They are things to watch. Major and Dangerous items cause failure — Dangerous means do not drive until fixed.' },
        ],
        govLink: 'gov.uk/check-mot-history',
        govLabel: 'gov.uk — MOT history checker',
      }}
      related={[
        { href: '/ulez-check', title: 'ULEZ & CAZ checker', desc: 'Is your vehicle compliant in UK low-emission zones?' },
        { href: '/cost-of-living-uk', title: 'Cost of living UK', desc: 'Compare transport and running costs by city.' },
        { href: '/postcode', title: 'Postcode lookup', desc: 'Find your local council, MP, NHS trust and police force.' },
      ]}
      educational={[
        {
          title: 'What the MOT tests — and what it does not',
          body: 'The MOT (Ministry of Transport) test is a standardised annual inspection of vehicle safety and environmental compliance. It covers:\n\n**Safety checks:**\n- Lights (headlights, indicators, brake lights, fog lights, reversing lights)\n- Steering and suspension\n- Brakes (performance measured on a roller brake tester)\n- Tyres (minimum 1.6mm tread depth across the central 75% of the tyre width, 180° around the circumference)\n- Windscreen, wipers and washers\n- Horn\n- Seatbelts and airbag warning light\n- Bodywork — no sharp edges or structural corrosion compromising safety\n- Seats and mirrors\n\n**Environmental checks:**\n- Exhaust emissions (carbon monoxide, hydrocarbons — not tested on electric vehicles)\n- Catalytic converter (must be present if originally fitted)\n\n**What the MOT does NOT check:**\n- Engine condition\n- Clutch\n- Gearbox\n- Air conditioning\n- General service items (oil, coolant, filters)\n\nA car can pass an MOT and still need immediate servicing. The MOT is a roadworthiness snapshot, not a guarantee of mechanical reliability.',
        },
        {
          title: 'Understanding the new MOT categories — Major, Minor, Dangerous, Advisory',
          body: 'Since May 2018, MOT testers use four categories that determine whether a vehicle passes or fails:\n\n**Dangerous (red):** An immediate risk to road safety or the environment. Examples: severely worn or damaged tyres, binding brakes, steering failure. The vehicle must not be driven until repaired. If an item is classified Dangerous, the MOT fails and you may not legally drive the car except in certain limited circumstances.\n\n**Major (amber):** A significant defect likely to cause danger or have a serious environmental impact. Causes MOT failure. Must be repaired before the vehicle can be retested. Examples: a lamp that is not working, a brake imbalance above threshold.\n\n**Minor (green):** A defect that has no significant effect on safety. Does not cause a failure. The vehicle can be driven away but the item should be monitored and repaired promptly.\n\n**Advisory (blue):** Something to keep an eye on that is not currently a defect but may become one. Common advisories include slightly worn brake pads, surface rust on brake discs, or a small chip in the windscreen. Advisories accumulate on the DVSA history — repeated advisories on the same item over several years may indicate a developing problem.\n\nPractical tip: when buying a used car, read the MOT history. Multiple consecutive advisories on suspension, brakes, or tyres often indicate deferred maintenance.',
        },
        {
          title: 'Common MOT failures — what to check before your test',
          body: 'DVSA publishes national failure statistics annually. The most common reasons for MOT failure are surprisingly mundane and often preventable with a 20-minute pre-test check:\n\n**1. Lighting and signalling (~30% of failures):** Check every external light — headlights (main beam and dipped), indicators (front, rear, and side), brake lights, fog lights (front and rear), reversing lights, numberplate lights. A single blown bulb causes a Major failure. Bulbs cost £1–5; test them all.\n\n**2. Tyres:** Minimum legal tread depth is 1.6mm across the central 75% of the tyre width, continuously around the full circumference. Use a 20p coin — if the rim of the coin disappears into the tread groove, you are above 1.6mm. Below this is a Major failure and a £2,500 penalty if caught by police. Also check for sidewall bulges or cuts.\n\n**3. Brakes:** Pads below minimum thickness, seized callipers, or significant brake imbalance (one side braking harder than the other). Get your brakes checked if pedal travel has increased or the car pulls to one side.\n\n**4. Suspension:** Worn shock absorbers (bouncing after road bumps), worn ball joints, failed anti-roll bar links, corroded springs.\n\n**5. Wipers and washers:** Wipers that smear rather than clear cause a failure. Replace blades — they cost £5–20 and take 5 minutes to fit.',
        },
        {
          title: 'MOT history — what to look for when buying a used car',
          body: 'The free DVSA MOT history checker (check.mot.api.gov.uk) is one of the most useful tools for used-car buyers. Every MOT result since 2005 is publicly visible — free, no registration needed.\n\n**What to check:**\n\n**Mileage consistency:** Each MOT record shows the mileage at the time of test. Plot them over time — mileage should increase consistently. A drop in mileage between tests (called "clocking") is odometer fraud and a criminal offence under the Fraud Act 2006. A high-mileage car whose odometer has been wound back is a significant financial risk.\n\n**Pattern of failures:** Repeated failures on the same item (e.g. suspension, brakes) over several tests may indicate chronic deferred maintenance or a structural problem.\n\n**Gap in testing history:** If a car has no MOT records for 1–2 years and appears later with a fresh test, query the seller about where it was during those years. It may have been stored, off-road, or driven illegally.\n\n**Advisory accumulation:** 5–6 consecutive years of the same advisory (e.g. "slight play in nearside front wheel bearing") means the item has never been fixed. It may be one advisory away from becoming a Major failure.\n\n**Number of attempts to pass in one year:** Multiple tests in a short period sometimes indicate a last-minute scramble to get a vehicle through — check for same-day retests that suggest rushed or superficial repairs.',
        },
        {
          title: 'Vehicle tax (VED), SORN, and what happens if you let them lapse',
          body: 'Vehicle Excise Duty (VED) — commonly called "road tax" — is separate from the MOT but the two are linked:\n\n**You cannot tax a vehicle without a valid MOT.** When you renew VED online, DVLA automatically checks the MOT database. If your MOT has expired, VED cannot be renewed until you have a new MOT certificate.\n\n**VED rates (2026):** Zero-emission electric vehicles moved to a flat rate of £195/year for 2025/26 and 2026/27 after the zero-rate exemption ended. Petrol and diesel rates depend on CO2 emissions — high-emission vehicles can pay £500–£2,745/year. Vehicles registered after 1 April 2017 with a list price above £40,000 pay an additional annual "luxury car supplement" for years 2–6.\n\n**Continuous Insurance Enforcement (CIE):** The Motor Insurers\' Bureau checks the Motor Insurance Database continuously. If your car is not insured and not SORNed, you will receive an automatic fine and potentially a court summons. This applies even if the car is sitting on a private driveway — unless a valid SORN has been declared.\n\n**How to declare a SORN:** Online at gov.uk/make-a-sorn in minutes. Takes effect immediately. VED is cancelled and any unused full months are refunded. No MOT required while SORNed. The SORN is indefinite — it continues until you tax the vehicle again.',
        },
      ]}
    >
      <MotCheckClient />
    </CalcPageShell>
  );
}
