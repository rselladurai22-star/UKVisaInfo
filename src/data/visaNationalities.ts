// Curated nationality dataset for visa application guide
// Used by ApplicationGuide to surface TB test / VAC / nationality-specific notes.

export interface Nationality {
  code: string;
  name: string;
  flag: string;
  tbTest: boolean;
  vacCities: string;
  processingWeeks: string;
  visitorVisaRequired: boolean;
  note?: string;
}

export const NATIONALITIES: Nationality[] = [
  { code: 'india',        name: 'India',        flag: '🇮🇳', tbTest: true,  vacCities: 'Delhi, Mumbai, Chennai, Kolkata, Hyderabad, Pune, Chandigarh', processingWeeks: '3 to 8 wks',  visitorVisaRequired: true,  note: 'High-demand VAC, book biometrics early.' },
  { code: 'pakistan',     name: 'Pakistan',     flag: '🇵🇰', tbTest: true,  vacCities: 'Islamabad, Karachi, Lahore',                                  processingWeeks: '3 to 8 wks',  visitorVisaRequired: true,  note: 'TB test at approved IOM clinic mandatory.' },
  { code: 'bangladesh',   name: 'Bangladesh',   flag: '🇧🇩', tbTest: true,  vacCities: 'Dhaka, Sylhet',                                               processingWeeks: '4 to 8 wks',  visitorVisaRequired: true,  note: 'Biometrics via TLScontact.' },
  { code: 'nigeria',      name: 'Nigeria',      flag: '🇳🇬', tbTest: true,  vacCities: 'Lagos, Abuja',                                                processingWeeks: '4 to 10 wks', visitorVisaRequired: true,  note: 'Additional financial evidence often requested.' },
  { code: 'philippines',  name: 'Philippines',  flag: '🇵🇭', tbTest: true,  vacCities: 'Manila, Cebu',                                                processingWeeks: '3 to 6 wks',  visitorVisaRequired: true,  note: 'TB test at approved IOM centre required.' },
  { code: 'china',        name: 'China',        flag: '🇨🇳', tbTest: true,  vacCities: 'Beijing, Shanghai, Guangzhou, Chengdu',                       processingWeeks: '3 to 6 wks',  visitorVisaRequired: true,  note: 'TB test at Home Office approved hospitals.' },
  { code: 'sri-lanka',    name: 'Sri Lanka',    flag: '🇱🇰', tbTest: true,  vacCities: 'Colombo',                                                     processingWeeks: '3 to 6 wks',  visitorVisaRequired: true,  note: 'TB test at Colombo IOM clinic mandatory.' },
  { code: 'nepal',        name: 'Nepal',        flag: '🇳🇵', tbTest: true,  vacCities: 'Kathmandu',                                                   processingWeeks: '3 to 8 wks',  visitorVisaRequired: true,  note: 'Book VAC appointment early, slots fill fast.' },
  { code: 'kenya',        name: 'Kenya',        flag: '🇰🇪', tbTest: true,  vacCities: 'Nairobi',                                                     processingWeeks: '3 to 6 wks',  visitorVisaRequired: true,  note: 'TB test at Nairobi IOM clinic.' },
  { code: 'ghana',        name: 'Ghana',        flag: '🇬🇭', tbTest: true,  vacCities: 'Accra',                                                       processingWeeks: '3 to 6 wks',  visitorVisaRequired: true,  note: 'TB test at approved Accra clinic.' },
  { code: 'zimbabwe',     name: 'Zimbabwe',     flag: '🇿🇼', tbTest: true,  vacCities: 'Harare',                                                      processingWeeks: '3 to 6 wks',  visitorVisaRequired: true,  note: 'Ancestry visa may apply if grandparent UK-born.' },
  { code: 'south-africa', name: 'South Africa', flag: '🇿🇦', tbTest: false, vacCities: 'Cape Town, Johannesburg',                                     processingWeeks: '3 to 5 wks',  visitorVisaRequired: false, note: 'No TB test. Ancestry route open to qualifying applicants.' },
  { code: 'turkey',       name: 'Turkey',       flag: '🇹🇷', tbTest: true,  vacCities: 'Istanbul, Ankara',                                            processingWeeks: '3 to 6 wks',  visitorVisaRequired: true,  note: 'TB test mandatory for stays over 6 months.' },
  { code: 'egypt',        name: 'Egypt',        flag: '🇪🇬', tbTest: true,  vacCities: 'Cairo',                                                       processingWeeks: '3 to 6 wks',  visitorVisaRequired: true,  note: 'Applications submitted via VFS Global.' },
  { code: 'usa',          name: 'United States', flag: '🇺🇸', tbTest: false, vacCities: 'Online application, biometrics at US Application Support Centres', processingWeeks: '3 to 4 wks',  visitorVisaRequired: false, note: 'No TB test. Visa-free visits up to 6 months.' },
  { code: 'canada',       name: 'Canada',       flag: '🇨🇦', tbTest: false, vacCities: 'Online application, biometrics across Canadian centres',     processingWeeks: '3 to 5 wks',  visitorVisaRequired: false, note: 'No TB test. Visa-free visits up to 6 months.' },
  { code: 'australia',    name: 'Australia',    flag: '🇦🇺', tbTest: false, vacCities: 'Online application, biometrics at Australian centres',      processingWeeks: '3 to 5 wks',  visitorVisaRequired: false, note: 'No TB test. Visa-free visits up to 6 months.' },
  { code: 'japan',        name: 'Japan',        flag: '🇯🇵', tbTest: false, vacCities: 'Tokyo, Osaka',                                                processingWeeks: '3 to 5 wks',  visitorVisaRequired: false, note: 'No TB test. Visa-free visits up to 6 months.' },
  { code: 'hong-kong',    name: 'Hong Kong',    flag: '🇭🇰', tbTest: false, vacCities: 'Hong Kong VAC',                                                processingWeeks: '3 to 5 wks',  visitorVisaRequired: false, note: 'BN(O) status holders may use the BN(O) route.' },
  { code: 'brazil',       name: 'Brazil',       flag: '🇧🇷', tbTest: false, vacCities: 'Online application, biometrics at Brazilian centres',        processingWeeks: '3 to 5 wks',  visitorVisaRequired: false, note: 'No TB test. Visa-free visits up to 6 months.' },
  { code: 'ukraine',      name: 'Ukraine',      flag: '🇺🇦', tbTest: false, vacCities: 'Online, UK schemes are free and fast-tracked',                processingWeeks: '1 to 3 wks',  visitorVisaRequired: false, note: 'Ukraine Schemes are free; standard processes also available.' },
  { code: 'other',        name: 'Other / not listed', flag: '🌍', tbTest: false, vacCities: 'Nearest UK VAC in your region', processingWeeks: '3 to 8 wks', visitorVisaRequired: true, note: 'Check gov.uk/check-uk-visa for your nationality.' },
];
