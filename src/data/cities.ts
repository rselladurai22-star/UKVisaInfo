/**
 * UK city guides for immigrants, destination-side companion to the
 * /from/[country] origin pages. Targets long-tail queries like
 * "London for Indian immigrants", "Manchester cost of living visa".
 *
 * Each guide combines: cost-of-living context, top sectors hiring,
 * neighbourhoods, sponsor activity, and immigration-relevant notes.
 */

export interface CityGuide {
  code: string;            // URL slug
  name: string;
  region: string;
  tagline: string;
  intro: string;
  /** Approx monthly cost of living for a single adult, GBP */
  monthlyCost: { rent1bed: number; transport: number; groceries: number; utilities: number; total: number };
  /** Top hiring sectors with sponsor activity */
  topSectors: { sector: string; reason: string }[];
  /** Popular neighbourhoods for immigrants/newcomers */
  neighbourhoods: { name: string; vibe: string }[];
  /** Specific notes useful for new arrivals */
  notes: string[];
  status: 'full' | 'stub';
}

export const CITIES: Record<string, CityGuide> = {
  london: {
    code: 'london', name: 'London', region: 'Greater London',
    tagline: 'The UK\'s largest job market and biggest sponsor concentration, but the highest cost of living.',
    intro: `London is where most Skilled Worker visas land. Over 60% of sponsored job postings sit inside the M25, especially in tech (Shoreditch, King's Cross), finance (the City, Canary Wharf) and healthcare (NHS trusts across all boroughs). The trade-off is cost: London is the most expensive UK city, with one-bed rents averaging £1,800/month inside zones 1-3 and falling closer to £1,400 in zones 4-6. Public transport is excellent and your visa entitles you to apply for an Oyster/contactless cap of around £150/month within Zones 1-2.`,
    monthlyCost: { rent1bed: 1750, transport: 160, groceries: 280, utilities: 180, total: 2370 },
    topSectors: [
      { sector: 'Technology',  reason: 'King\'s Cross, Shoreditch and South Bank, Google, Meta, fintech scale-ups, AI labs.' },
      { sector: 'Finance',     reason: 'The City and Canary Wharf, banks, insurance, asset management.' },
      { sector: 'Healthcare',  reason: 'NHS trusts (Guy\'s & St Thomas\', UCLH, Royal London) sponsor heavily.' },
      { sector: 'Consulting',  reason: 'All Big 4 + tier-1 strategy firms headquartered here.' },
      { sector: 'Legal',       reason: 'Magic Circle and US firms in the City.' },
    ],
    neighbourhoods: [
      { name: 'Stratford / Walthamstow', vibe: 'Affordable, well-connected, growing migrant communities.' },
      { name: 'Wembley / Harrow',        vibe: 'Large Indian community, family-friendly, Zone 4 prices.' },
      { name: 'Tooting / Balham',        vibe: 'Southwest, good transport, mid-range rents.' },
      { name: 'Canary Wharf / Limehouse',vibe: 'Finance workers, modern flats, riverside.' },
      { name: 'Hounslow / Southall',     vibe: 'Heathrow corridor, very strong South Asian community.' },
    ],
    notes: [
      'You can start renting on a visa as soon as you have your BRP/eVisa, landlords are required to do a Right to Rent check.',
      'Council Tax bands push up monthly costs by £120-£200 depending on the borough.',
      'TfL travel cards are free for under-18s; adults benefit most from monthly contactless caps.',
      'Most NHS GP surgeries register new arrivals within 24-48 hours, bring your passport and proof of address.',
    ],
    status: 'full',
  },

  manchester: {
    code: 'manchester', name: 'Manchester', region: 'North West',
    tagline: 'The UK\'s second tech hub, half the cost of London with a fast-growing sponsor base.',
    intro: `Manchester is the largest UK city outside London for Skilled Worker sponsorship, with a particularly strong tech, media and healthcare scene. The cost of living is roughly half of London's: one-bed flats average £950/month in central postcodes (M1, M2, M3) and lower in suburbs. The MediaCity UK complex in Salford hosts the BBC and ITV; the Northern Quarter is dense with startups. Major NHS trusts (Manchester Royal Infirmary, Wythenshawe) sponsor extensively.`,
    monthlyCost: { rent1bed: 950, transport: 75, groceries: 240, utilities: 160, total: 1425 },
    topSectors: [
      { sector: 'Technology',  reason: 'Northern Quarter + Spinningfields, fintech, AI, ecommerce.' },
      { sector: 'Media',       reason: 'MediaCity UK (Salford), BBC, ITV, production companies.' },
      { sector: 'Healthcare',  reason: 'Manchester University NHS Foundation Trust, one of the biggest in the UK.' },
      { sector: 'Education',   reason: 'University of Manchester + Manchester Met sponsor academic and research roles.' },
    ],
    neighbourhoods: [
      { name: 'Northern Quarter',         vibe: 'Creative, cafe-heavy, central.' },
      { name: 'Didsbury / Withington',    vibe: 'Family-friendly south, near universities.' },
      { name: 'Salford Quays',            vibe: 'Modern flats near MediaCity.' },
      { name: 'Rusholme / Fallowfield',   vibe: 'Strong South Asian community ("Curry Mile").' },
    ],
    notes: [
      'Trams (Metrolink) are the main intra-city transport; monthly passes ~£75.',
      'NHS GP registration is similar to London, bring passport and proof of address.',
      'Manchester Airport has direct flights to most major Asian, African and European cities.',
    ],
    status: 'full',
  },

  birmingham: {
    code: 'birmingham', name: 'Birmingham', region: 'West Midlands',
    tagline: 'Big-city diversity at a lower cost, finance, healthcare and HS2-driven growth.',
    intro: `Birmingham is the UK\'s second-most populous city and has a long tradition of welcoming immigrants, over 40% of residents identify as a minority ethnic group. Cost of living sits between Manchester and the smaller northern cities. Major sponsors include HSBC UK (HQ at Centenary Square), the NHS trusts, and Big 4 firms.`,
    monthlyCost: { rent1bed: 850, transport: 70, groceries: 230, utilities: 155, total: 1305 },
    topSectors: [
      { sector: 'Finance', reason: 'HSBC UK HQ, Deutsche Bank back office, several insurers.' },
      { sector: 'Healthcare', reason: 'University Hospitals Birmingham NHS Trust, one of the largest in Europe.' },
      { sector: 'Manufacturing', reason: 'Jaguar Land Rover and supply-chain employers.' },
    ],
    neighbourhoods: [
      { name: 'Jewellery Quarter', vibe: 'Trendy central, converted warehouses.' },
      { name: 'Edgbaston',         vibe: 'Quieter, near university.' },
      { name: 'Sparkhill / Small Heath', vibe: 'Strong South Asian community.' },
    ],
    notes: [
      'HS2 (London-Birmingham high-speed rail) is set to open in 2029-2033, reshaping commuter belts.',
      'Trains to London take 80 minutes today on Avanti West Coast.',
    ],
    status: 'stub',
  },

  edinburgh: {
    code: 'edinburgh', name: 'Edinburgh', region: 'Scotland',
    tagline: 'Strong finance and tech scene with Scotland\'s separate healthcare and council-tax system.',
    intro: `Edinburgh is Scotland\'s capital and one of the UK\'s biggest financial centres outside London. Major sponsors include Royal Bank of Scotland, Standard Life Aberdeen, and the booming tech sector around the BioQuarter and Quartermile. As Scotland operates separate NHS Scotland and council-tax systems, some procedures differ from England.`,
    monthlyCost: { rent1bed: 1100, transport: 75, groceries: 260, utilities: 170, total: 1605 },
    topSectors: [
      { sector: 'Finance', reason: 'NatWest Group, abrdn, FNZ headquartered or based here.' },
      { sector: 'Technology', reason: 'Skyscanner, FanDuel, FreeAgent, strong startup ecosystem.' },
      { sector: 'Healthcare', reason: 'NHS Lothian, Royal Infirmary and BioQuarter cluster.' },
    ],
    neighbourhoods: [
      { name: 'Leith', vibe: 'Trendy, foodie, near the water.' },
      { name: 'Marchmont / Bruntsfield', vibe: 'Student/young-professional belt.' },
    ],
    notes: [
      'NHS Scotland uses a separate registration system; book a GP via NHS24 once you have a Scottish address.',
      'Council tax bands are slightly cheaper than in England.',
    ],
    status: 'stub',
  },
};

export function getCity(slug: string): CityGuide | undefined {
  return CITIES[slug];
}
