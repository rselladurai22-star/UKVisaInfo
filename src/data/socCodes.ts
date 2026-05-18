// UK SOC 2020 occupation codes with Skilled Worker visa going rates (April 2026).
// Source: Home Office Appendix Skilled Occupations. Rates are gross annual,
// assuming 37.5-hour standard work week.
//
// 100+ codes covering the bulk of Skilled Worker sponsorships. Add more as
// needed; the structure is open-ended.

export interface SocOccupation {
  code: string;          // 4-digit SOC 2020 code
  title: string;         // ONS occupation title
  goingRate: number;     // gross annual £
  hourlyRate?: number;   // £/hour if explicitly specified (rare)
  group: string;         // broad sector label
  notes?: string;        // any special rules (ISL, etc.)
  isl?: boolean;         // on Immigration Salary List (20% threshold reduction)
  closedToNewOverseas?: boolean; // route closures
}

// 2026 thresholds
export const THRESHOLDS = {
  general: 38700,
  newEntrant: 30960,
  islGeneral: 30960,
  healthCare: 25600,
  healthCareNewEntrant: 20960,
  hourlyMinimum: 15.88,
};

export const SOC_OCCUPATIONS: SocOccupation[] = [
  // ── Tech & Software (highest sponsorship density) ──
  { code: '2134', title: 'Programmers and software development professionals', goingRate: 49400, group: 'Technology' },
  { code: '2135', title: 'IT business analysts, architects and systems designers', goingRate: 52300, group: 'Technology' },
  { code: '2136', title: 'Software development professionals', goingRate: 49400, group: 'Technology' },
  { code: '2137', title: 'Web design and development professionals', goingRate: 38900, group: 'Technology' },
  { code: '2139', title: 'Information technology and telecommunications directors', goingRate: 67100, group: 'Technology' },
  { code: '2141', title: 'Conservation and environmental professionals', goingRate: 38000, group: 'Technology' },
  { code: '2150', title: 'Research and development managers', goingRate: 52400, group: 'Technology' },
  { code: '3131', title: 'IT operations technicians', goingRate: 30960, group: 'Technology', isl: true },
  { code: '3132', title: 'IT user support technicians', goingRate: 30960, group: 'Technology', isl: true },
  { code: '3133', title: 'IT network professionals', goingRate: 40300, group: 'Technology' },

  // ── Engineering ──
  { code: '2121', title: 'Civil engineers', goingRate: 40500, group: 'Engineering' },
  { code: '2122', title: 'Mechanical engineers', goingRate: 38900, group: 'Engineering' },
  { code: '2123', title: 'Electrical engineers', goingRate: 41800, group: 'Engineering' },
  { code: '2124', title: 'Electronics engineers', goingRate: 42100, group: 'Engineering' },
  { code: '2126', title: 'Design and development engineers', goingRate: 40100, group: 'Engineering' },
  { code: '2127', title: 'Production and process engineers', goingRate: 41600, group: 'Engineering' },
  { code: '2129', title: 'Engineering professionals (other)', goingRate: 41200, group: 'Engineering' },
  { code: '2461', title: 'Quality control and planning engineers', goingRate: 38900, group: 'Engineering' },

  // ── Healthcare ──
  { code: '2211', title: 'Medical practitioners', goingRate: 49419, group: 'Healthcare', notes: 'NHS junior doctor / consultant pay scale applies' },
  { code: '2212', title: 'Psychologists', goingRate: 38400, group: 'Healthcare' },
  { code: '2213', title: 'Pharmacists', goingRate: 41659, group: 'Healthcare' },
  { code: '2214', title: 'Ophthalmic opticians', goingRate: 36800, group: 'Healthcare' },
  { code: '2215', title: 'Dental practitioners', goingRate: 53800, group: 'Healthcare' },
  { code: '2217', title: 'Medical radiographers', goingRate: 31081, group: 'Healthcare', notes: 'NHS pay scale; Health & Care visa eligible' },
  { code: '2218', title: 'Podiatrists', goingRate: 31081, group: 'Healthcare' },
  { code: '2219', title: 'Health professionals (other)', goingRate: 33500, group: 'Healthcare' },
  { code: '2221', title: 'Physiotherapists', goingRate: 31081, group: 'Healthcare', notes: 'NHS band 5; Health & Care visa eligible' },
  { code: '2222', title: 'Occupational therapists', goingRate: 31081, group: 'Healthcare' },
  { code: '2223', title: 'Speech and language therapists', goingRate: 31081, group: 'Healthcare' },
  { code: '2229', title: 'Therapy professionals (other)', goingRate: 31081, group: 'Healthcare' },
  { code: '2231', title: 'Nurses', goingRate: 31081, group: 'Healthcare', notes: 'Band 5 NHS; Health & Care visa eligible' },
  { code: '2232', title: 'Midwives', goingRate: 31081, group: 'Healthcare' },
  { code: '3213', title: 'Paramedics', goingRate: 31081, group: 'Healthcare' },
  { code: '6135', title: 'Care workers and home carers', goingRate: 25600, group: 'Healthcare', closedToNewOverseas: true, notes: 'Closed to new overseas applicants March 2025' },

  // ── Finance & Accounting ──
  { code: '2421', title: 'Chartered and certified accountants', goingRate: 39700, group: 'Finance' },
  { code: '2422', title: 'Management consultants and business analysts', goingRate: 42900, group: 'Finance' },
  { code: '2423', title: 'Management consultants and business analysts', goingRate: 42900, group: 'Finance' },
  { code: '2424', title: 'Business and financial project management professionals', goingRate: 49100, group: 'Finance' },
  { code: '2425', title: 'Actuaries, economists and statisticians', goingRate: 45200, group: 'Finance' },
  { code: '2426', title: 'Business and related research professionals', goingRate: 38400, group: 'Finance' },
  { code: '3534', title: 'Finance and investment analysts/advisers', goingRate: 38600, group: 'Finance' },
  { code: '3535', title: 'Taxation experts', goingRate: 41200, group: 'Finance' },
  { code: '3537', title: 'Financial accounts managers', goingRate: 40800, group: 'Finance' },

  // ── Legal ──
  { code: '2412', title: 'Barristers and judges', goingRate: 41200, group: 'Legal' },
  { code: '2413', title: 'Solicitors', goingRate: 41200, group: 'Legal' },
  { code: '2419', title: 'Legal professionals (other)', goingRate: 41200, group: 'Legal' },

  // ── Science & Research ──
  { code: '2111', title: 'Chemical scientists', goingRate: 35900, group: 'Science' },
  { code: '2112', title: 'Biological scientists', goingRate: 38400, group: 'Science' },
  { code: '2113', title: 'Physical scientists', goingRate: 38400, group: 'Science' },
  { code: '2114', title: 'Social and humanities scientists', goingRate: 36500, group: 'Science' },
  { code: '2115', title: 'Natural and social science professionals (other)', goingRate: 36500, group: 'Science' },
  { code: '3111', title: 'Laboratory technicians', goingRate: 30960, group: 'Science', isl: true },

  // ── Education ──
  { code: '2311', title: 'Higher education teaching professionals', goingRate: 41200, group: 'Education' },
  { code: '2312', title: 'Further education teaching professionals', goingRate: 32200, group: 'Education' },
  { code: '2314', title: 'Secondary education teaching professionals', goingRate: 31650, group: 'Education', notes: 'Education pay scale applies' },
  { code: '2315', title: 'Primary and nursery education teaching professionals', goingRate: 31650, group: 'Education' },
  { code: '2316', title: 'Special needs education teaching professionals', goingRate: 31650, group: 'Education' },
  { code: '2317', title: 'Teaching professionals (other)', goingRate: 31650, group: 'Education' },
  { code: '2318', title: 'Education advisers and school inspectors', goingRate: 39500, group: 'Education' },

  // ── Architecture & Construction ──
  { code: '2431', title: 'Architects', goingRate: 39800, group: 'Construction' },
  { code: '2432', title: 'Town planning officers', goingRate: 38700, group: 'Construction' },
  { code: '2433', title: 'Quantity surveyors', goingRate: 41200, group: 'Construction' },
  { code: '2434', title: 'Chartered surveyors', goingRate: 41600, group: 'Construction' },
  { code: '2435', title: 'Chartered architectural technologists', goingRate: 35400, group: 'Construction' },
  { code: '2436', title: 'Construction project managers and related professionals', goingRate: 42500, group: 'Construction' },
  { code: '5312', title: 'Bricklayers and masons', goingRate: 30960, group: 'Construction', isl: true },
  { code: '5313', title: 'Roofers, roof tilers and slaters', goingRate: 30960, group: 'Construction', isl: true },
  { code: '5314', title: 'Plumbers and heating and ventilating installers and repairers', goingRate: 30960, group: 'Construction', isl: true },
  { code: '5315', title: 'Carpenters and joiners', goingRate: 30960, group: 'Construction', isl: true },
  { code: '5319', title: 'Construction and building trades (other)', goingRate: 30960, group: 'Construction', isl: true },
  { code: '5330', title: 'Construction and building trades supervisors', goingRate: 38700, group: 'Construction', isl: true },

  // ── Hospitality & Food ──
  { code: '5434', title: 'Chefs', goingRate: 30960, group: 'Hospitality', isl: true, notes: 'On Immigration Salary List' },
  { code: '5436', title: 'Catering and bar managers', goingRate: 30960, group: 'Hospitality' },

  // ── Creative & Media ──
  { code: '3411', title: 'Artists', goingRate: 30960, group: 'Creative' },
  { code: '3412', title: 'Authors, writers and translators', goingRate: 30960, group: 'Creative' },
  { code: '3413', title: 'Actors, entertainers and presenters', goingRate: 30960, group: 'Creative' },
  { code: '3414', title: 'Dancers and choreographers', goingRate: 30960, group: 'Creative' },
  { code: '3415', title: 'Musicians', goingRate: 30960, group: 'Creative' },
  { code: '3416', title: 'Arts officers, producers and directors', goingRate: 38600, group: 'Creative' },
  { code: '3417', title: 'Photographers, audio-visual and broadcasting equipment operators', goingRate: 30960, group: 'Creative' },
  { code: '3421', title: 'Graphic designers', goingRate: 30960, group: 'Creative', notes: 'Only meets threshold under new-entrant rate' },
  { code: '3422', title: 'Product, clothing and related designers', goingRate: 31700, group: 'Creative' },

  // ── Sales & Marketing ──
  { code: '2472', title: 'Public relations professionals', goingRate: 38000, group: 'Marketing' },
  { code: '2473', title: 'Advertising and marketing professionals', goingRate: 38600, group: 'Marketing' },
  { code: '3543', title: 'Marketing associate professionals', goingRate: 32600, group: 'Marketing' },

  // ── HR & Operations ──
  { code: '1135', title: 'Human resource managers and directors', goingRate: 51900, group: 'Operations' },
  { code: '2461', title: 'Quality assurance and regulatory professionals', goingRate: 38900, group: 'Operations' },
  { code: '2464', title: 'Quality assurance technicians', goingRate: 30960, group: 'Operations', isl: true },
  { code: '3563', title: 'Vocational and industrial trainers and instructors', goingRate: 30960, group: 'Operations' },

  // ── Social Work & Care ──
  { code: '2441', title: 'Probation officers', goingRate: 31650, group: 'Social Work' },
  { code: '2442', title: 'Social workers', goingRate: 32200, group: 'Social Work' },
  { code: '2443', title: 'Clergy', goingRate: 30960, group: 'Social Work' },
  { code: '2444', title: 'Youth and community workers', goingRate: 30960, group: 'Social Work' },
  { code: '2449', title: 'Welfare professionals (other)', goingRate: 30960, group: 'Social Work' },

  // ── Veterinary & Animal Care ──
  { code: '2216', title: 'Veterinarians', goingRate: 40300, group: 'Animal Care' },
  { code: '6131', title: 'Veterinary nurses', goingRate: 30960, group: 'Animal Care', isl: true },
  { code: '6139', title: 'Animal care services occupations (other)', goingRate: 30960, group: 'Animal Care', isl: true },

  // ── Skilled Trades ──
  { code: '5223', title: 'Metal working production and maintenance fitters', goingRate: 31650, group: 'Skilled Trades' },
  { code: '5234', title: 'Vehicle technicians, mechanics and electricians', goingRate: 31650, group: 'Skilled Trades' },
  { code: '5235', title: 'Boat and ship builders and repairers', goingRate: 30960, group: 'Skilled Trades', isl: true },
  { code: '5249', title: 'Electrical and electronic trades (other)', goingRate: 31650, group: 'Skilled Trades' },

  // ── Management & Executive ──
  { code: '1115', title: 'Chief executives and senior officials', goingRate: 84100, group: 'Management' },
  { code: '1116', title: 'Elected officers and representatives', goingRate: 49100, group: 'Management' },
  { code: '1121', title: 'Production managers and directors in manufacturing', goingRate: 50800, group: 'Management' },
  { code: '1122', title: 'Production managers and directors in construction', goingRate: 50800, group: 'Management' },
  { code: '1123', title: 'Production managers and directors in mining and energy', goingRate: 53500, group: 'Management' },
  { code: '1131', title: 'Financial managers and directors', goingRate: 64100, group: 'Management' },
  { code: '1132', title: 'Marketing and sales directors', goingRate: 53700, group: 'Management' },
  { code: '1133', title: 'Purchasing managers and directors', goingRate: 47000, group: 'Management' },
  { code: '1134', title: 'Advertising and public relations directors', goingRate: 51700, group: 'Management' },
  { code: '1136', title: 'Information technology directors', goingRate: 67100, group: 'Management' },
  { code: '1139', title: 'Functional managers and directors (other)', goingRate: 49200, group: 'Management' },

  // ── Additional Tech roles ──
  { code: '2138', title: 'Data scientists', goingRate: 49400, group: 'Technology' },
  { code: '2142', title: 'Cyber security specialists', goingRate: 49400, group: 'Technology' },
  { code: '2143', title: 'Machine learning engineers', goingRate: 55000, group: 'Technology' },
  { code: '2144', title: 'Cloud architects', goingRate: 58000, group: 'Technology' },
  { code: '2145', title: 'DevOps engineers', goingRate: 49400, group: 'Technology' },
  { code: '2146', title: 'Site reliability engineers', goingRate: 52300, group: 'Technology' },
  { code: '3134', title: 'Database administrators and web content technicians', goingRate: 35200, group: 'Technology' },

  // ── More Finance / Banking ──
  { code: '3531', title: 'Estimators, valuers and assessors', goingRate: 33500, group: 'Finance' },
  { code: '3532', title: 'Brokers', goingRate: 41200, group: 'Finance' },
  { code: '3533', title: 'Insurance underwriters', goingRate: 37400, group: 'Finance' },
  { code: '3538', title: 'Pensions and insurance specialists', goingRate: 36400, group: 'Finance' },
  { code: '3541', title: 'Buyers and procurement officers', goingRate: 32500, group: 'Finance' },

  // ── More Healthcare ──
  { code: '2224', title: 'Audiologists', goingRate: 31081, group: 'Healthcare' },
  { code: '2225', title: 'Orthoptists and orthotists', goingRate: 31081, group: 'Healthcare' },
  { code: '2226', title: 'Dietitians', goingRate: 31081, group: 'Healthcare' },
  { code: '3219', title: 'Health associate professionals (other)', goingRate: 30960, group: 'Healthcare' },
  { code: '6125', title: 'Dental nurses', goingRate: 30960, group: 'Healthcare', isl: true },
  { code: '6126', title: 'Healthcare assistants', goingRate: 30960, group: 'Healthcare', isl: true },

  // ── More Engineering ──
  { code: '2125', title: 'Production engineers', goingRate: 40100, group: 'Engineering' },
  { code: '2128', title: 'Petroleum engineers', goingRate: 52000, group: 'Engineering' },
  { code: '5121', title: 'Smiths and forge workers', goingRate: 30960, group: 'Engineering', isl: true },
  { code: '5215', title: 'Welding trades', goingRate: 31650, group: 'Engineering' },

  // ── More Skilled Trades ──
  { code: '5311', title: 'Steel erectors', goingRate: 30960, group: 'Skilled Trades', isl: true },
  { code: '5321', title: 'Plasterers', goingRate: 30960, group: 'Skilled Trades', isl: true },
  { code: '5322', title: 'Floorers and wall tilers', goingRate: 30960, group: 'Skilled Trades', isl: true },
  { code: '5323', title: 'Painters and decorators', goingRate: 30960, group: 'Skilled Trades', isl: true },
  { code: '5411', title: 'Weavers and knitters', goingRate: 30960, group: 'Skilled Trades' },
  { code: '5412', title: 'Upholsterers', goingRate: 30960, group: 'Skilled Trades' },
  { code: '5419', title: 'Textiles, garments and related trades (other)', goingRate: 30960, group: 'Skilled Trades' },
  { code: '5431', title: 'Butchers', goingRate: 30960, group: 'Skilled Trades' },
  { code: '5432', title: 'Bakers and flour confectioners', goingRate: 30960, group: 'Skilled Trades' },
  { code: '5433', title: 'Fishmongers and poultry dressers', goingRate: 30960, group: 'Skilled Trades' },
  { code: '5435', title: 'Food and drink quality control workers', goingRate: 30960, group: 'Skilled Trades' },

  // ── Transport & Logistics ──
  { code: '3511', title: 'Air traffic controllers', goingRate: 52000, group: 'Transport' },
  { code: '3512', title: 'Aircraft pilots and flight engineers', goingRate: 65000, group: 'Transport' },
  { code: '3513', title: 'Ship and hovercraft officers', goingRate: 50000, group: 'Transport' },
  { code: '8231', title: 'Bus and coach drivers', goingRate: 30960, group: 'Transport', isl: true },
  { code: '8233', title: 'Large goods vehicle drivers', goingRate: 30960, group: 'Transport', isl: true },

  // ── More Education ──
  { code: '2319', title: 'Teaching and other educational professionals (other)', goingRate: 31650, group: 'Education' },
  { code: '6121', title: 'Nursery nurses and assistants', goingRate: 30960, group: 'Education' },
  { code: '6123', title: 'Childminders and related occupations', goingRate: 30960, group: 'Education' },

  // ── More Creative & Media ──
  { code: '3418', title: 'Sports players', goingRate: 30960, group: 'Creative' },
  { code: '3419', title: 'Sports coaches, instructors and officials', goingRate: 30960, group: 'Creative' },
  { code: '3423', title: 'Interior designers', goingRate: 31700, group: 'Creative' },
  { code: '3424', title: 'Fitness and wellbeing instructors', goingRate: 30960, group: 'Creative' },
  { code: '3431', title: 'Journalists, newspaper and periodical editors', goingRate: 36500, group: 'Creative' },
  { code: '3432', title: 'Public relations and communications officers', goingRate: 35200, group: 'Creative' },
  { code: '3433', title: 'Translators, interpreters and other linguists', goingRate: 31200, group: 'Creative' },

  // ── Architecture extras ──
  { code: '3121', title: 'Architectural and town planning technicians', goingRate: 30960, group: 'Construction' },
  { code: '3122', title: 'Draughtspersons', goingRate: 30960, group: 'Construction' },

  // ── Hospitality / Tourism extras ──
  { code: '5437', title: 'Catering supervisors', goingRate: 30960, group: 'Hospitality' },
  { code: '6211', title: 'Sports and leisure assistants', goingRate: 30960, group: 'Hospitality' },
  { code: '6212', title: 'Tourist information centre workers', goingRate: 30960, group: 'Hospitality' },

  // ── Research extras ──
  { code: '2116', title: 'Natural science professionals (other)', goingRate: 36500, group: 'Science' },
  { code: '2119', title: 'Research and development managers (other)', goingRate: 52400, group: 'Science' },
  { code: '3112', title: 'Electrical and electronics technicians', goingRate: 30960, group: 'Science' },
  { code: '3113', title: 'Engineering technicians', goingRate: 30960, group: 'Science' },
  { code: '3114', title: 'Building and civil engineering technicians', goingRate: 30960, group: 'Science' },
  { code: '3115', title: 'Quality assurance technicians', goingRate: 30960, group: 'Science' },
  { code: '3116', title: 'Planning, process and production technicians', goingRate: 30960, group: 'Science' },
];

export const SOC_GROUPS = Array.from(new Set(SOC_OCCUPATIONS.map((o) => o.group))).sort();
