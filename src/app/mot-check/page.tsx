import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import MotCheckClient from './MotCheckClient';

export const metadata: Metadata = {
  title: 'UK MOT & Tax Check by Reg Plate — When Is Your MOT Due?',
  description: 'Enter any UK reg plate to validate it, see the vehicle\'s registration era, and go straight to gov.uk to check MOT history and tax status — official DVSA + DVLA data, free.',
  alternates: { canonical: '/mot-check' },
};

export default function MotCheckPage() {
  return (
    <CalcPageShell
      url="/mot-check"
      eyebrow="MOT & Tax · UK · DVSA / DVLA"
      title="Check MOT and tax for any UK vehicle."
      deck="Type a UK reg plate. We validate it, infer the registration era, and link you straight into the official gov.uk DVSA + DVLA checkers."
      verified="DVSA MOT History Service · DVLA"
      related={[
        { href: '/ulez-check',          title: 'ULEZ & CAZ checker', desc: 'Is your car compliant in UK low-emission zones?' },
        { href: '/postcode',            title: 'Postcode lookup',    desc: 'Council, MP, NHS, police force.' },
        { href: '/cost-of-living-uk',   title: 'Cost of living',     desc: 'Transport costs by city.' },
      ]}
      educational={[
        { title: 'When does a car need its first MOT?', body: 'Cars and motorcycles need their first MOT on the third anniversary of first registration. After that, annually. Some classic and historic vehicles (over 40 years old) are exempt.' },
        { title: 'Driving without a valid MOT', body: 'Illegal except to drive to a pre-booked MOT test. Penalty is up to £1,000 (£2,500 if the vehicle is in a dangerous condition) and the insurance is normally invalidated. ANPR cameras flag expired MOTs automatically.' },
        { title: 'You can MOT a month early', body: 'You can have an MOT done up to one month minus a day before the current MOT expires and keep the same renewal date. Helpful for spreading the cost — and avoiding a panic the day before expiry.' },
        { title: 'The cost is capped', body: 'DVSA caps MOT fees: £54.85 for a car, £29.65 for a motorcycle. Garages can charge less but never more. Watch out for upselling on advisories — they don\'t need to be fixed unless they\'re classified Major or Dangerous.' },
        { title: 'Tax (VED) is separate from MOT', body: 'Vehicle tax (VED) needs renewing annually (or 6-monthly). DVLA sends a reminder. You can\'t tax a vehicle that has no MOT or no insurance — both must be valid first.' },
        { title: 'Continuous Insurance Enforcement', body: 'Even when a car is parked off-road, it must either be insured or formally declared SORN (Statutory Off-Road Notification). Failing to do so means an automatic fine.' },
      ]}
    >
      <MotCheckClient />
    </CalcPageShell>
  );
}
