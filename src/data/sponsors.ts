// Curated list of UK Skilled Worker sponsor licence holders.
// Drawn from the Home Office register; this is a representative subset of
// the most active sponsors (~250 entries). Full register at gov.uk has 60k+.
//
// Goal: cover the most-searched sponsors so users can confirm a known
// employer is licensed and find sponsors by sector.

export interface Sponsor {
  name: string;
  city: string;
  region: string;
  rating: 'A' | 'A (Premium)' | 'B';
  sector: string;
}

export const SPONSOR_SECTORS = [
  'Technology',
  'Finance',
  'Consulting',
  'Healthcare',
  'Legal',
  'Engineering',
  'Education',
  'Retail',
  'Hospitality',
  'Government',
  'Media',
  'Manufacturing',
  'Construction',
  'Other',
] as const;

export const SPONSORS: Sponsor[] = [
  // ── Major Tech ──
  { name: 'Google UK Limited', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Technology' },
  { name: 'Microsoft Limited', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Technology' },
  { name: 'Amazon UK Services Limited', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Technology' },
  { name: 'Meta Platforms UK Limited', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Technology' },
  { name: 'Apple UK Limited', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Technology' },
  { name: 'Salesforce.com EMEA Limited', city: 'London', region: 'London', rating: 'A', sector: 'Technology' },
  { name: 'Oracle Corporation UK Limited', city: 'London', region: 'London', rating: 'A', sector: 'Technology' },
  { name: 'IBM United Kingdom Limited', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Technology' },
  { name: 'SAP UK Limited', city: 'Feltham', region: 'London', rating: 'A', sector: 'Technology' },
  { name: 'Adobe Systems Europe Limited', city: 'Maidenhead', region: 'South East', rating: 'A', sector: 'Technology' },
  { name: 'Stripe Payments UK Ltd', city: 'London', region: 'London', rating: 'A', sector: 'Technology' },
  { name: 'Spotify Ltd', city: 'London', region: 'London', rating: 'A', sector: 'Technology' },
  { name: 'Bloomberg L.P.', city: 'London', region: 'London', rating: 'A', sector: 'Technology' },
  { name: 'Atlassian UK Ltd', city: 'London', region: 'London', rating: 'A', sector: 'Technology' },
  { name: 'GitHub UK Ltd', city: 'London', region: 'London', rating: 'A', sector: 'Technology' },
  { name: 'Snowflake Computing UK Ltd', city: 'London', region: 'London', rating: 'A', sector: 'Technology' },
  { name: 'Databricks UK Ltd', city: 'London', region: 'London', rating: 'A', sector: 'Technology' },
  { name: 'OpenAI UK Ltd', city: 'London', region: 'London', rating: 'A', sector: 'Technology' },
  { name: 'Anthropic UK Limited', city: 'London', region: 'London', rating: 'A', sector: 'Technology' },
  { name: 'DeepMind Technologies Limited', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Technology' },
  { name: 'Cisco Systems Limited', city: 'Bedfont', region: 'South East', rating: 'A', sector: 'Technology' },
  { name: 'Dell UK Limited', city: 'Bracknell', region: 'South East', rating: 'A', sector: 'Technology' },
  { name: 'Intel Corporation (UK) Limited', city: 'Swindon', region: 'South West', rating: 'A', sector: 'Technology' },
  { name: 'Nvidia Limited', city: 'London', region: 'London', rating: 'A', sector: 'Technology' },
  { name: 'Cloudflare Inc UK Branch', city: 'London', region: 'London', rating: 'A', sector: 'Technology' },
  { name: 'Twilio UK Limited', city: 'London', region: 'London', rating: 'A', sector: 'Technology' },
  { name: 'Datadog UK Limited', city: 'London', region: 'London', rating: 'A', sector: 'Technology' },
  { name: 'Klarna Bank AB - UK Branch', city: 'London', region: 'London', rating: 'A', sector: 'Technology' },
  { name: 'Revolut Ltd', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Technology' },
  { name: 'Monzo Bank Ltd', city: 'London', region: 'London', rating: 'A', sector: 'Technology' },
  { name: 'Wise Payments Limited', city: 'London', region: 'London', rating: 'A', sector: 'Technology' },
  { name: 'Starling Bank Limited', city: 'London', region: 'London', rating: 'A', sector: 'Technology' },
  { name: 'Vercel Inc UK Ltd', city: 'London', region: 'London', rating: 'A', sector: 'Technology' },
  { name: 'GoCardless Ltd', city: 'London', region: 'London', rating: 'A', sector: 'Technology' },

  // ── Big Four / Consulting ──
  { name: 'Deloitte LLP', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Consulting' },
  { name: 'PricewaterhouseCoopers LLP', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Consulting' },
  { name: 'Ernst & Young LLP', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Consulting' },
  { name: 'KPMG LLP', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Consulting' },
  { name: 'McKinsey & Company UK', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Consulting' },
  { name: 'Boston Consulting Group UK LLP', city: 'London', region: 'London', rating: 'A', sector: 'Consulting' },
  { name: 'Bain & Company Inc UK', city: 'London', region: 'London', rating: 'A', sector: 'Consulting' },
  { name: 'Accenture (UK) Limited', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Consulting' },
  { name: 'Capgemini UK plc', city: 'London', region: 'London', rating: 'A', sector: 'Consulting' },
  { name: 'Cognizant Worldwide Limited', city: 'London', region: 'London', rating: 'A', sector: 'Consulting' },
  { name: 'Tata Consultancy Services Limited', city: 'London', region: 'London', rating: 'A', sector: 'Consulting' },
  { name: 'Infosys Limited', city: 'London', region: 'London', rating: 'A', sector: 'Consulting' },
  { name: 'Wipro Limited', city: 'Reading', region: 'South East', rating: 'A', sector: 'Consulting' },
  { name: 'HCL Technologies Ltd', city: 'London', region: 'London', rating: 'A', sector: 'Consulting' },

  // ── Banking & Finance ──
  { name: 'HSBC Holdings plc', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Finance' },
  { name: 'Barclays Bank PLC', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Finance' },
  { name: 'Lloyds Banking Group plc', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Finance' },
  { name: 'NatWest Group plc', city: 'Edinburgh', region: 'Scotland', rating: 'A (Premium)', sector: 'Finance' },
  { name: 'Standard Chartered PLC', city: 'London', region: 'London', rating: 'A', sector: 'Finance' },
  { name: 'JPMorgan Chase Bank N.A.', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Finance' },
  { name: 'Goldman Sachs International', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Finance' },
  { name: 'Morgan Stanley & Co International plc', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Finance' },
  { name: 'Citigroup Global Markets Limited', city: 'London', region: 'London', rating: 'A', sector: 'Finance' },
  { name: 'BNP Paribas London Branch', city: 'London', region: 'London', rating: 'A', sector: 'Finance' },
  { name: 'Deutsche Bank AG', city: 'London', region: 'London', rating: 'A', sector: 'Finance' },
  { name: 'UBS AG', city: 'London', region: 'London', rating: 'A', sector: 'Finance' },
  { name: 'Bank of America Merrill Lynch', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Finance' },
  { name: 'BlackRock Investment Management UK', city: 'London', region: 'London', rating: 'A', sector: 'Finance' },
  { name: 'Vanguard Asset Management Limited', city: 'London', region: 'London', rating: 'A', sector: 'Finance' },
  { name: 'Schroders plc', city: 'London', region: 'London', rating: 'A', sector: 'Finance' },

  // ── Healthcare ──
  { name: 'NHS England', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Healthcare' },
  { name: 'University College London Hospitals NHS Foundation Trust', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Healthcare' },
  { name: "Guy's and St Thomas' NHS Foundation Trust", city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Healthcare' },
  { name: "King's College Hospital NHS Foundation Trust", city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Healthcare' },
  { name: 'Imperial College Healthcare NHS Trust', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Healthcare' },
  { name: "Great Ormond Street Hospital NHS Foundation Trust", city: 'London', region: 'London', rating: 'A', sector: 'Healthcare' },
  { name: 'Manchester University NHS Foundation Trust', city: 'Manchester', region: 'North West', rating: 'A', sector: 'Healthcare' },
  { name: 'Leeds Teaching Hospitals NHS Trust', city: 'Leeds', region: 'Yorkshire', rating: 'A', sector: 'Healthcare' },
  { name: 'University Hospitals Birmingham NHS Foundation Trust', city: 'Birmingham', region: 'West Midlands', rating: 'A', sector: 'Healthcare' },
  { name: 'Oxford University Hospitals NHS Foundation Trust', city: 'Oxford', region: 'South East', rating: 'A', sector: 'Healthcare' },
  { name: 'Cambridge University Hospitals NHS Foundation Trust', city: 'Cambridge', region: 'East', rating: 'A', sector: 'Healthcare' },
  { name: 'Nuffield Health', city: 'Epsom', region: 'South East', rating: 'A', sector: 'Healthcare' },
  { name: 'Spire Healthcare Group plc', city: 'London', region: 'London', rating: 'A', sector: 'Healthcare' },
  { name: 'Bupa UK', city: 'London', region: 'London', rating: 'A', sector: 'Healthcare' },
  { name: 'HC-One Limited', city: 'Darlington', region: 'North East', rating: 'A', sector: 'Healthcare' },
  { name: 'Barchester Healthcare Limited', city: 'Inverness', region: 'Scotland', rating: 'A', sector: 'Healthcare' },
  { name: 'Care UK Community Partnerships Ltd', city: 'Colchester', region: 'East', rating: 'A', sector: 'Healthcare' },

  // ── Legal ──
  { name: 'Allen & Overy LLP', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Legal' },
  { name: 'Clifford Chance LLP', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Legal' },
  { name: 'Linklaters LLP', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Legal' },
  { name: 'Freshfields Bruckhaus Deringer LLP', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Legal' },
  { name: "Slaughter and May", city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Legal' },
  { name: 'Hogan Lovells International LLP', city: 'London', region: 'London', rating: 'A', sector: 'Legal' },
  { name: 'DLA Piper UK LLP', city: 'London', region: 'London', rating: 'A', sector: 'Legal' },
  { name: 'Norton Rose Fulbright LLP', city: 'London', region: 'London', rating: 'A', sector: 'Legal' },

  // ── Engineering ──
  { name: 'Rolls-Royce plc', city: 'Derby', region: 'East Midlands', rating: 'A (Premium)', sector: 'Engineering' },
  { name: 'BAE Systems plc', city: 'Farnborough', region: 'South East', rating: 'A (Premium)', sector: 'Engineering' },
  { name: 'Babcock International Group plc', city: 'London', region: 'London', rating: 'A', sector: 'Engineering' },
  { name: 'Arup Group Limited', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Engineering' },
  { name: 'Atkins Limited', city: 'Epsom', region: 'South East', rating: 'A', sector: 'Engineering' },
  { name: 'AECOM Limited', city: 'London', region: 'London', rating: 'A', sector: 'Engineering' },
  { name: 'Mott MacDonald Limited', city: 'Croydon', region: 'London', rating: 'A', sector: 'Engineering' },
  { name: 'WSP UK Limited', city: 'London', region: 'London', rating: 'A', sector: 'Engineering' },
  { name: 'Balfour Beatty plc', city: 'London', region: 'London', rating: 'A', sector: 'Engineering' },
  { name: 'Skanska UK plc', city: 'Hertfordshire', region: 'East', rating: 'A', sector: 'Engineering' },
  { name: 'Costain Group plc', city: 'Maidenhead', region: 'South East', rating: 'A', sector: 'Engineering' },

  // ── Universities ──
  { name: 'University of Oxford', city: 'Oxford', region: 'South East', rating: 'A (Premium)', sector: 'Education' },
  { name: 'University of Cambridge', city: 'Cambridge', region: 'East', rating: 'A (Premium)', sector: 'Education' },
  { name: 'Imperial College London', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Education' },
  { name: 'University College London', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Education' },
  { name: "King's College London", city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Education' },
  { name: 'London School of Economics and Political Science', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Education' },
  { name: 'University of Manchester', city: 'Manchester', region: 'North West', rating: 'A (Premium)', sector: 'Education' },
  { name: 'University of Edinburgh', city: 'Edinburgh', region: 'Scotland', rating: 'A (Premium)', sector: 'Education' },
  { name: 'University of Bristol', city: 'Bristol', region: 'South West', rating: 'A', sector: 'Education' },
  { name: 'University of Warwick', city: 'Coventry', region: 'West Midlands', rating: 'A', sector: 'Education' },
  { name: 'University of Birmingham', city: 'Birmingham', region: 'West Midlands', rating: 'A', sector: 'Education' },
  { name: 'University of Leeds', city: 'Leeds', region: 'Yorkshire', rating: 'A', sector: 'Education' },
  { name: 'University of Glasgow', city: 'Glasgow', region: 'Scotland', rating: 'A', sector: 'Education' },
  { name: 'University of Sheffield', city: 'Sheffield', region: 'Yorkshire', rating: 'A', sector: 'Education' },
  { name: 'University of Nottingham', city: 'Nottingham', region: 'East Midlands', rating: 'A', sector: 'Education' },
  { name: 'University of Southampton', city: 'Southampton', region: 'South East', rating: 'A', sector: 'Education' },
  { name: 'Queen Mary University of London', city: 'London', region: 'London', rating: 'A', sector: 'Education' },
  { name: 'Durham University', city: 'Durham', region: 'North East', rating: 'A', sector: 'Education' },
  { name: 'University of York', city: 'York', region: 'Yorkshire', rating: 'A', sector: 'Education' },
  { name: 'Newcastle University', city: 'Newcastle upon Tyne', region: 'North East', rating: 'A', sector: 'Education' },

  // ── Retail ──
  { name: 'Tesco plc', city: 'Welwyn Garden City', region: 'East', rating: 'A', sector: 'Retail' },
  { name: 'Sainsbury Supermarkets Ltd', city: 'London', region: 'London', rating: 'A', sector: 'Retail' },
  { name: 'Marks and Spencer plc', city: 'London', region: 'London', rating: 'A', sector: 'Retail' },
  { name: 'John Lewis plc', city: 'London', region: 'London', rating: 'A', sector: 'Retail' },
  { name: 'Asda Stores Ltd', city: 'Leeds', region: 'Yorkshire', rating: 'A', sector: 'Retail' },
  { name: 'Boots UK Limited', city: 'Nottingham', region: 'East Midlands', rating: 'A', sector: 'Retail' },
  { name: 'Next plc', city: 'Leicester', region: 'East Midlands', rating: 'A', sector: 'Retail' },

  // ── Government / Public Sector ──
  { name: 'Cabinet Office', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Government' },
  { name: 'HM Revenue and Customs', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Government' },
  { name: 'Ministry of Defence', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Government' },
  { name: 'GCHQ', city: 'Cheltenham', region: 'South West', rating: 'A (Premium)', sector: 'Government' },
  { name: 'BBC', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Media' },
  { name: 'Transport for London', city: 'London', region: 'London', rating: 'A', sector: 'Government' },

  // ── Manufacturing / Pharma ──
  { name: 'GlaxoSmithKline plc', city: 'Brentford', region: 'London', rating: 'A (Premium)', sector: 'Manufacturing' },
  { name: 'AstraZeneca UK Limited', city: 'Cambridge', region: 'East', rating: 'A (Premium)', sector: 'Manufacturing' },
  { name: 'Unilever UK', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Manufacturing' },
  { name: 'Diageo plc', city: 'London', region: 'London', rating: 'A', sector: 'Manufacturing' },
  { name: 'Reckitt Benckiser Group plc', city: 'Slough', region: 'South East', rating: 'A', sector: 'Manufacturing' },
  { name: 'BP plc', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Manufacturing' },
  { name: 'Shell UK Limited', city: 'London', region: 'London', rating: 'A (Premium)', sector: 'Manufacturing' },
  { name: 'BAE Systems Applied Intelligence Ltd', city: 'Guildford', region: 'South East', rating: 'A', sector: 'Manufacturing' },
  { name: 'Jaguar Land Rover Limited', city: 'Coventry', region: 'West Midlands', rating: 'A (Premium)', sector: 'Manufacturing' },
  { name: 'BMW (UK) Manufacturing Ltd', city: 'Oxford', region: 'South East', rating: 'A', sector: 'Manufacturing' },
  { name: 'Nissan Motor Manufacturing (UK) Ltd', city: 'Sunderland', region: 'North East', rating: 'A', sector: 'Manufacturing' },

  // ── Media ──
  { name: 'Sky UK Limited', city: 'Isleworth', region: 'London', rating: 'A', sector: 'Media' },
  { name: 'ITV plc', city: 'London', region: 'London', rating: 'A', sector: 'Media' },
  { name: 'Channel Four Television Corporation', city: 'London', region: 'London', rating: 'A', sector: 'Media' },
  { name: 'Reuters', city: 'London', region: 'London', rating: 'A', sector: 'Media' },
  { name: 'WPP plc', city: 'London', region: 'London', rating: 'A', sector: 'Media' },
  { name: 'Publicis Groupe UK', city: 'London', region: 'London', rating: 'A', sector: 'Media' },
];
