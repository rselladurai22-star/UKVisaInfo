'use client';

/**
 * VisaHubClient — UK Visa Hub mini-site
 *
 * Layout: sticky section nav → active section rendered below.
 * Sections: Routes | Eligibility | Calculator | Settlement | Countries
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Briefcase, GraduationCap, Plane, Users, ShieldCheck, Crown, Star,
  Calculator, ArrowRight, ArrowUpRight, CheckCircle2, XCircle,
  Globe, Clock, Sparkles, Target, Plus, Minus,
  Heart, Building2, Leaf, BookOpen, Zap, MapPin,
  Flag, Baby, User, Home as HomeIcon, ChevronDown,
  ChevronRight, FileText,
} from 'lucide-react';

/* ─── TYPES ─── */
type TabId     = 'work' | 'study' | 'family' | 'visit' | 'settlement' | 'citizenship' | 'special';
type SectionId = 'routes' | 'eligibility' | 'calculator' | 'settlement' | 'countries';

interface VisaRoute {
  id: string; title: string; blurb: string;
  fee: string; baseFee: number; ihsPerYear: number;
  duration: string; toILR: string | null;
  accent: string; icon: React.ComponentType<{ className?: string }>;
  tab: TabId; badge?: string; href: string;
}
interface Country {
  flag: string; name: string; code: string;
  tbTest: boolean; visaRequired: boolean; vacCities: string;
  processingWeeks: string;
  popularRoutes: TabId[];
  notes: string[];
}

/* ─── SECTION NAV ─── */
const SECTIONS: { id: SectionId; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
  { id: 'routes',      label: 'Visa Routes',     icon: Plane,       desc: '35+ routes' },
  { id: 'eligibility', label: 'Eligibility',     icon: Target,      desc: 'Find your route' },
  { id: 'calculator',  label: 'Cost Calculator', icon: Calculator,  desc: 'Fees + IHS' },
  { id: 'settlement',  label: 'Settlement',      icon: ShieldCheck, desc: 'ILR → Citizenship' },
  { id: 'countries',   label: 'By Country',      icon: Globe,       desc: '22 countries' },
];

/* ─── VISA TABS ─── */
const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }>; accent: string }[] = [
  { id: 'work',        label: 'Work',        icon: Briefcase,     accent: '#635BFF' },
  { id: 'study',       label: 'Study',       icon: GraduationCap, accent: '#1E3A8A' },
  { id: 'family',      label: 'Family',      icon: Heart,         accent: '#E11D48' },
  { id: 'visit',       label: 'Visit',       icon: Plane,         accent: '#5851DB' },
  { id: 'settlement',  label: 'Settlement',  icon: ShieldCheck,   accent: '#10B981' },
  { id: 'citizenship', label: 'Citizenship', icon: Crown,         accent: '#7C3AED' },
  { id: 'special',     label: 'Special',     icon: Star,          accent: '#F59E0B' },
];

/* ─── VISA ROUTES DATA ─── */
const ROUTES: VisaRoute[] = [
  /* WORK */
  { id:'skilled-worker',   title:'Skilled Worker',             blurb:'Employer-sponsored at any eligible SOC occupation. Most common route to ILR.',          fee:'from £610',              baseFee:610,   ihsPerYear:1035, duration:'3–5 yr',    toILR:'5 years',                      accent:'#635BFF', icon:Briefcase,    tab:'work',        badge:'Most popular', href:'/visa/skilled-worker'    },
  { id:'health-care',      title:'Health & Care Worker',       blurb:'NHS and eligible social care roles. IHS fully waived for all applicants.',               fee:'from £247',              baseFee:247,   ihsPerYear:0,    duration:'3 yr',      toILR:'5 years',                      accent:'#10B981', icon:Building2,    tab:'work',        badge:'IHS waived',  href:'/visa/health-and-care'   },
  { id:'global-talent',    title:'Global Talent',              blurb:'Endorsed leaders in digital tech, arts, science or academia. No sponsor needed.',        fee:'£167 + endorsement',     baseFee:167,   ihsPerYear:1035, duration:'Flexible',  toILR:'3–5 years',                    accent:'#7C3AED', icon:Star,         tab:'work',        href:'/visa/global-talent'     },
  { id:'innovator-founder',title:'Innovator Founder',          blurb:'Endorsed founders with innovative, viable and scalable business plan.',                  fee:'£1,357',                 baseFee:1357,  ihsPerYear:1035, duration:'3 yr',      toILR:'3 years',                      accent:'#F59E0B', icon:Zap,          tab:'work',        href:'/visa/innovator-founder' },
  { id:'scale-up',         title:'Scale-up Worker',            blurb:'Fast-growing companies. Unsponsored after 6 months of initial approval.',                fee:'from £610',              baseFee:610,   ihsPerYear:1035, duration:'2 yr',      toILR:'5 years',                      accent:'#1E3A8A', icon:Target,       tab:'work',        href:'/visa/scale-up'          },
  { id:'ict-senior',       title:'Senior / Specialist (ICT)',  blurb:'Intra-company transfers for established employees in specialist or senior roles.',        fee:'from £610',              baseFee:610,   ihsPerYear:1035, duration:'Up to 9 yr',toILR:'5 yr (switch to SW)',           accent:'#0EA5E9', icon:Building2,    tab:'work',        href:'/visa/ict'               },
  { id:'grad-trainee',     title:'Graduate Trainee (ICT)',     blurb:'Intra-company transfer for graduate trainees on a structured programme.',                 fee:'from £247',              baseFee:247,   ihsPerYear:1035, duration:'1 yr',      toILR:null,                           accent:'#0EA5E9', icon:GraduationCap,tab:'work',        href:'/visa/ict'               },
  { id:'seasonal',         title:'Seasonal Worker',            blurb:'Horticulture, food processing and poultry via licensed scheme operators. No IHS.',        fee:'£298',                   baseFee:298,   ihsPerYear:0,    duration:'Up to 6 m', toILR:null,                           accent:'#84CC16', icon:Leaf,         tab:'work',        href:'/visa/seasonal'          },
  { id:'sportsperson',     title:'Sportsperson',               blurb:'Elite athletes and coaches endorsed by a UK governing body.',                             fee:'£298',                   baseFee:298,   ihsPerYear:1035, duration:'3 yr',      toILR:null,                           accent:'#F59E0B', icon:Target,       tab:'work',        href:'/visa/sportsperson'      },
  { id:'minister-rel',     title:'Minister of Religion',       blurb:'Religious workers sponsored by a UK religious organisation.',                             fee:'£298',                   baseFee:298,   ihsPerYear:1035, duration:'3 yr',      toILR:'5 years',                      accent:'#A78BFA', icon:Star,         tab:'work',        href:'/visa/minister-of-religion'},
  { id:'intl-agreement',   title:'International Agreement',    blurb:'Workers under GATS/CETA treaties or private servants of diplomats.',                     fee:'£298',                   baseFee:298,   ihsPerYear:0,    duration:'Varies',    toILR:null,                           accent:'#475569', icon:Globe,        tab:'work',        href:'/visa/international-agreement'},
  /* STUDY */
  { id:'student',          title:'Student Visa',               blurb:'Degree-level+ at UKVI-licensed sponsor. Up to 20 hrs/wk work in term time.',            fee:'£363 outside / £490 in-UK',baseFee:363,  ihsPerYear:776,  duration:'1–5 yr',    toILR:null,                           accent:'#1E3A8A', icon:GraduationCap,tab:'study',       badge:'Popular',     href:'/visa/student'           },
  { id:'child-student',    title:'Child Student',              blurb:'Independent school study for children aged 4–17 at a licensed school.',                  fee:'£363',                   baseFee:363,   ihsPerYear:776,  duration:'Up to 6 yr',toILR:null,                           accent:'#0EA5E9', icon:Baby,         tab:'study',       href:'/visa/child-student'     },
  { id:'short-study',      title:'Short-term Study',           blurb:'English language study up to 6 months (11 months with academic qualification).',         fee:'£200',                   baseFee:200,   ihsPerYear:0,    duration:'Up to 11 m',toILR:null,                           accent:'#60A5FA', icon:BookOpen,     tab:'study',       href:'/visa/short-term-study'  },
  { id:'graduate',         title:'Graduate Visa',              blurb:'Stay and work 2 years (3 for PhD) after graduating. No sponsor needed.',                 fee:'£822',                   baseFee:822,   ihsPerYear:1035, duration:'2–3 yr',    toILR:null,                           accent:'#6366F1', icon:GraduationCap,tab:'study',       href:'/visa/graduate'          },
  /* FAMILY */
  { id:'spouse-partner',   title:'Spouse / Partner',           blurb:'Join a British citizen or settled person. Min income £29,000. 5 yrs to ILR.',           fee:'£1,846 outside',         baseFee:1846,  ihsPerYear:1035, duration:'2.5 yr',    toILR:'5 years',                      accent:'#E11D48', icon:Heart,        tab:'family',      badge:'Popular',     href:'/visa/family'            },
  { id:'fiancee',          title:'Fiancé(e)',                  blurb:'Marry or register civil partnership within 6 months, then switch to Spouse visa.',       fee:'£1,846',                 baseFee:1846,  ihsPerYear:0,    duration:'6 months',  toILR:'5 yr (after switch)',           accent:'#F43F5E', icon:Heart,        tab:'family',      href:'/visa/family'            },
  { id:'child-dep',        title:'Child Joining Parents',      blurb:'Children under 18 joining both parents or a lone parent who are settled.',               fee:'£1,846',                 baseFee:1846,  ihsPerYear:1035, duration:'2.5 yr',    toILR:'5 years',                      accent:'#FB923C', icon:Baby,         tab:'family',      href:'/visa/family'            },
  { id:'parent-brit',      title:'Parent of British Child',    blurb:'Parent of a British or settled child under 18, with sole responsibility.',               fee:'£1,846',                 baseFee:1846,  ihsPerYear:1035, duration:'2.5 yr',    toILR:'5 years',                      accent:'#FBBF24', icon:Users,        tab:'family',      href:'/visa/family'            },
  { id:'adult-dep',        title:'Adult Dependent Relative',   blurb:'Elderly or incapacitated relatives needing personal care from a settled person.',        fee:'£3,250',                 baseFee:3250,  ihsPerYear:1035, duration:'2.5 yr',    toILR:'5 years',                      accent:'#5851DB', icon:Users,        tab:'family',      href:'/visa/family'            },
  /* VISIT */
  { id:'visitor-std',      title:'Standard Visitor',           blurb:'Tourism, family visit, medical treatment or business meetings. Up to 6 months.',         fee:'from £115 (6m) to £963 (10yr)',baseFee:115,ihsPerYear:0, duration:'6m – 10yr', toILR:null,                           accent:'#5851DB', icon:Plane,        tab:'visit',       badge:'Popular',     href:'/visa/visitor'           },
  { id:'marriage-visitor', title:'Marriage Visitor',           blurb:'Visit to marry or register a civil partnership. Cannot switch in-UK.',                   fee:'£115',                   baseFee:115,   ihsPerYear:0,    duration:'6 months',  toILR:null,                           accent:'#F97316', icon:Heart,        tab:'visit',       href:'/visa/visitor'           },
  { id:'ppe-visitor',      title:'Permitted Paid Engagement',  blurb:'Up to 1 month for specific paid work (academic, creative, sport).',                      fee:'£115',                   baseFee:115,   ihsPerYear:0,    duration:'1 month',   toILR:null,                           accent:'#EAB308', icon:Briefcase,    tab:'visit',       href:'/visa/visitor'           },
  { id:'transit',          title:'Direct Airside Transit',     blurb:'Pass through a UK airport without going through UK border control.',                     fee:'£64',                    baseFee:64,    ihsPerYear:0,    duration:'Transit',   toILR:null,                           accent:'#475569', icon:Plane,        tab:'visit',       href:'/visa/visitor'           },
  /* SETTLEMENT */
  { id:'ilr-5yr',          title:'ILR — 5-Year Route',         blurb:'Indefinite Leave to Remain after 5 yrs on Skilled Worker, Global Talent, Family etc.',  fee:'£2,885',                 baseFee:2885,  ihsPerYear:0,    duration:'Permanent', toILR:'This IS ILR',                  accent:'#10B981', icon:ShieldCheck,  tab:'settlement',  badge:'Popular',     href:'/settlement'             },
  { id:'ilr-10yr',         title:'ILR — Long Residence (10yr)',blurb:'10 continuous years of lawful UK residence — any visa combination counts.',             fee:'£2,885',                 baseFee:2885,  ihsPerYear:0,    duration:'Permanent', toILR:'This IS ILR',                  accent:'#059669', icon:Clock,        tab:'settlement',  href:'/settlement'             },
  { id:'ilr-family',       title:'ILR — Family Route',         blurb:'Settlement after 5 years on a Spouse, Partner or Child visa.',                          fee:'£2,885',                 baseFee:2885,  ihsPerYear:0,    duration:'Permanent', toILR:'This IS ILR',                  accent:'#EC4899', icon:Heart,        tab:'settlement',  href:'/settlement'             },
  { id:'euss-settled',     title:'EU Settlement — Settled',    blurb:'EU/EEA/Swiss citizens with 5+ years UK residence before Dec 2020. Equivalent to ILR.',  fee:'Free',                   baseFee:0,     ihsPerYear:0,    duration:'Permanent', toILR:'Equivalent to ILR',            accent:'#1E3A8A', icon:Flag,         tab:'settlement',  badge:'Free',        href:'/settlement'             },
  { id:'euss-presettled',  title:'EU Settlement — Pre-settled',blurb:'Under 5 years residence before cut-off. Switch to Settled Status within 5 years.',      fee:'Free',                   baseFee:0,     ihsPerYear:0,    duration:'5 yr',      toILR:'Switch to Settled after 5 yr', accent:'#3B82F6', icon:Flag,         tab:'settlement',  badge:'Free',        href:'/settlement'             },
  /* CITIZENSHIP */
  { id:'naturalisation',   title:'British Naturalisation',     blurb:'British citizenship after ILR + 12 months. Life in the UK test + English required.',    fee:'£1,500',                 baseFee:1500,  ihsPerYear:0,    duration:'Permanent', toILR:'Citizenship',                  accent:'#7C3AED', icon:Crown,        tab:'citizenship', badge:'Popular',     href:'/settlement'             },
  { id:'reg-child',        title:'Registration — Child',       blurb:'Children under 18 who are British by descent or have a British parent.',                 fee:'£1,214',                 baseFee:1214,  ihsPerYear:0,    duration:'Permanent', toILR:'Citizenship',                  accent:'#8B5CF6', icon:Baby,         tab:'citizenship', href:'/settlement'             },
  { id:'reg-adult',        title:'Registration — Adult',       blurb:'UK-born adults who are stateless or British under transitional provisions.',             fee:'£1,500',                 baseFee:1500,  ihsPerYear:0,    duration:'Permanent', toILR:'Citizenship',                  accent:'#A78BFA', icon:User,         tab:'citizenship', href:'/settlement'             },
  { id:'bno-citizenship',  title:'BN(O) Pathway',              blurb:'HK BN(O) holders: 5yr → ILR → naturalisation → British passport in 6+ years.',          fee:'£180 → £2,885 → £1,500', baseFee:180,   ihsPerYear:1035, duration:'6+ yr',     toILR:'5 yr + 12m',                   accent:'#EC4899', icon:Flag,         tab:'citizenship', href:'/settlement'             },
  { id:'british-passport', title:'British Passport',           blurb:'Once naturalised or registered as British, apply for your British passport (10 yr).',    fee:'£82.50 online',          baseFee:82,    ihsPerYear:0,    duration:'10 yr',     toILR:null,                           accent:'#DC2626', icon:ShieldCheck,  tab:'citizenship', badge:'Final step',  href:'/settlement'             },
  /* SPECIAL */
  { id:'uk-ancestry',      title:'UK Ancestry',                blurb:'Commonwealth citizens with a UK-born grandparent. 5 yr unrestricted work → ILR.',        fee:'£632',                   baseFee:632,   ihsPerYear:1035, duration:'5 yr',      toILR:'5 years',                      accent:'#F59E0B', icon:Star,         tab:'special',     href:'/visa/ancestry'          },
  { id:'bno-visa',         title:'Hong Kong BN(O)',             blurb:'BN(O) status holders and close family. Work and live freely for 5yr then ILR + citizenship.',fee:'£180 (2yr) / £250 (5yr)',baseFee:180,   ihsPerYear:1035, duration:'5 yr',      toILR:'5 years',                      accent:'#EC4899', icon:Flag,         tab:'special',     badge:'New route',   href:'/visa/bno'               },
  { id:'youth-mobility',   title:'Youth Mobility Scheme',      blurb:'18–30 from eligible countries (AU, NZ, CA, JP etc.). 2yr open work, no sponsor.',        fee:'£298',                   baseFee:298,   ihsPerYear:1035, duration:'2 yr',      toILR:null,                           accent:'#06B6D4', icon:Plane,        tab:'special',     href:'/visa/youth-mobility'    },
  { id:'hpi',              title:'High Potential Individual',  blurb:'Graduates of top 50 global universities within 5 years. 2yr open work, no sponsor.',     fee:'£822',                   baseFee:822,   ihsPerYear:1035, duration:'2 yr',      toILR:null,                           accent:'#8B5CF6', icon:Zap,          tab:'special',     href:'/visa/hpi'               },
  { id:'ukraine-family',   title:'Ukraine Family Scheme',      blurb:'Immediate or extended family of British nationals in Ukraine. Indefinite permission.',   fee:'Free',                   baseFee:0,     ihsPerYear:0,    duration:'3 yr',      toILR:null,                           accent:'#F59E0B', icon:Heart,        tab:'special',     badge:'Free',        href:'/visa/ukraine'           },
  { id:'homes-ukraine',    title:'Homes for Ukraine',          blurb:'Ukrainian individuals with a named sponsor host in the UK.',                              fee:'Free',                   baseFee:0,     ihsPerYear:0,    duration:'3 yr',      toILR:null,                           accent:'#3B82F6', icon:HomeIcon,     tab:'special',     badge:'Free',        href:'/visa/ukraine'           },
];

const COUNTRIES: Country[] = [
  { flag:'🇮🇳', name:'India',        code:'india',        tbTest:true,  visaRequired:true,  vacCities:'Delhi, Mumbai, Chennai, Kolkata, Hyderabad, Pune, Chandigarh',  processingWeeks:'3–8 wks',  popularRoutes:['work','study','family','settlement'] as TabId[], notes:['High-demand VAC — book appointment early','Skilled Worker is most common route','Students need CAS from sponsor institution'] },
  { flag:'🇳🇬', name:'Nigeria',      code:'nigeria',      tbTest:true,  visaRequired:true,  vacCities:'Lagos, Abuja',                                                  processingWeeks:'4–10 wks', popularRoutes:['work','family','study'] as TabId[],               notes:['Additional financial documents often requested','TB test required for stays over 6 months','Priority service available for Work/Study'] },
  { flag:'🇵🇰', name:'Pakistan',     code:'pakistan',     tbTest:true,  visaRequired:true,  vacCities:'Islamabad, Karachi, Lahore',                                    processingWeeks:'3–8 wks',  popularRoutes:['family','work','settlement'] as TabId[],           notes:['Family visa is the most common route','Sponsor must meet £29,000 income threshold','TB test at approved IOM clinic mandatory'] },
  { flag:'🇵🇭', name:'Philippines',  code:'philippines',  tbTest:true,  visaRequired:true,  vacCities:'Manila, Cebu',                                                  processingWeeks:'3–6 wks',  popularRoutes:['work','family','study'] as TabId[],               notes:['Health & Care visa popular (IHS waived)','Skilled Worker requires licensed UK sponsor','TB test at approved IOM centre required'] },
  { flag:'🇧🇩', name:'Bangladesh',   code:'bangladesh',   tbTest:true,  visaRequired:true,  vacCities:'Dhaka, Sylhet',                                                 processingWeeks:'4–8 wks',  popularRoutes:['work','family','study'] as TabId[],               notes:['Family and Work routes most common','Biometric at TLScontact','TB test mandatory at Dhaka IOM clinic'] },
  { flag:'🇨🇳', name:'China',        code:'china',        tbTest:true,  visaRequired:true,  vacCities:'Beijing, Shanghai, Guangzhou, Chengdu',                         processingWeeks:'3–6 wks',  popularRoutes:['study','work','visit'] as TabId[],                notes:['Student visa most common route','Multiple VAC locations in major cities','TB test at approved hospitals required'] },
  { flag:'🇰🇪', name:'Kenya',        code:'kenya',        tbTest:true,  visaRequired:true,  vacCities:'Nairobi',                                                       processingWeeks:'3–6 wks',  popularRoutes:['work','family','study'] as TabId[],               notes:['Skilled Worker and Health & Care are common','TB test at Nairobi IOM clinic','Priority processing available'] },
  { flag:'🇬🇭', name:'Ghana',        code:'ghana',        tbTest:true,  visaRequired:true,  vacCities:'Accra',                                                         processingWeeks:'3–6 wks',  popularRoutes:['work','family','study'] as TabId[],               notes:['Health sector workers often use Health & Care visa','TB test at approved Accra clinic','Sponsor letter required for all routes'] },
  { flag:'🇱🇰', name:'Sri Lanka',    code:'sri-lanka',    tbTest:true,  visaRequired:true,  vacCities:'Colombo',                                                       processingWeeks:'3–6 wks',  popularRoutes:['work','family','study'] as TabId[],               notes:['Work and Family are most common routes','TB test at Colombo IOM clinic mandatory','Priority reduces processing to ~5 working days'] },
  { flag:'🇳🇵', name:'Nepal',        code:'nepal',        tbTest:true,  visaRequired:true,  vacCities:'Kathmandu',                                                     processingWeeks:'3–8 wks',  popularRoutes:['work','family','study'] as TabId[],               notes:['Skilled Worker and Student are popular','TB test at Kathmandu IOM clinic','Book VAC appointment early as slots fill fast'] },
  { flag:'��🇼', name:'Zimbabwe',     code:'zimbabwe',     tbTest:true,  visaRequired:true,  vacCities:'Harare',                                                        processingWeeks:'3–6 wks',  popularRoutes:['work','family','special'] as TabId[],             notes:['UK Ancestry visa available with UK-born grandparent','Health & Care visa: IHS waived for qualifying workers','TB test at Harare approved clinic'] },
  { flag:'🇹🇿', name:'Tanzania',     code:'tanzania',     tbTest:true,  visaRequired:true,  vacCities:'Dar es Salaam',                                                 processingWeeks:'3–6 wks',  popularRoutes:['work','family','study'] as TabId[],               notes:['Work and Family routes most common','TB test at Dar es Salaam IOM clinic required','Apply with sufficient lead time'] },
  { flag:'🇹🇷', name:'Turkey',       code:'turkey',       tbTest:true,  visaRequired:true,  vacCities:'Istanbul, Ankara',                                              processingWeeks:'3–6 wks',  popularRoutes:['work','study','visit'] as TabId[],                notes:['Student visa popular for postgraduate study','Skilled Worker requires UKVI-licensed employer','TB test mandatory for stays over 6 months'] },
  { flag:'🇪🇬', name:'Egypt',        code:'egypt',        tbTest:true,  visaRequired:true,  vacCities:'Cairo',                                                         processingWeeks:'3–6 wks',  popularRoutes:['work','family','study'] as TabId[],               notes:['Work and Family routes most common','TB test at Cairo IOM clinic','Applications via VFS Global'] },
  { flag:'🇺🇸', name:'USA',          code:'usa',          tbTest:false, visaRequired:false, vacCities:'Online only (no biometrics for short visits)',                  processingWeeks:'3–4 wks',  popularRoutes:['work','study','visit','special'] as TabId[],      notes:['No visitor visa needed for stays up to 6 months','Youth Mobility Scheme available for 18-30 year olds','Work and Study applications fully online'] },
  { flag:'🇨🇦', name:'Canada',       code:'canada',       tbTest:false, visaRequired:false, vacCities:'Online only (visitors)',                                        processingWeeks:'3–5 wks',  popularRoutes:['work','study','visit','special'] as TabId[],      notes:['Visa-free visiting up to 6 months','Youth Mobility Scheme available','All visa applications made online'] },
  { flag:'🇦🇺', name:'Australia',    code:'australia',    tbTest:false, visaRequired:false, vacCities:'Online only (visitors)',                                        processingWeeks:'3–5 wks',  popularRoutes:['work','study','visit','special'] as TabId[],      notes:['Visa-free visiting up to 6 months','Youth Mobility Scheme (18-30) available','All applications made online'] },
  { flag:'🇭🇰', name:'Hong Kong',    code:'hong-kong',    tbTest:false, visaRequired:false, vacCities:'Hong Kong',                                                     processingWeeks:'3–5 wks',  popularRoutes:['special','work','study','settlement'] as TabId[], notes:['BN(O) Visa available for BN(O) status holders','BN(O) pathway: ILR after 5 yrs, citizenship after 6+','No TB test or visitor visa required'] },
  { flag:'🇿🇦', name:'South Africa', code:'south-africa', tbTest:false, visaRequired:false, vacCities:'Cape Town, Johannesburg',                                       processingWeeks:'3–5 wks',  popularRoutes:['work','family','special'] as TabId[],             notes:['UK Ancestry visa if you have UK-born grandparent','Skilled Worker is common route','Visa-free visits; no TB test required'] },
  { flag:'��🇷', name:'Brazil',       code:'brazil',       tbTest:false, visaRequired:false, vacCities:'Online only (visitors)',                                        processingWeeks:'3–5 wks',  popularRoutes:['work','study','visit'] as TabId[],                notes:['Visa-free visiting up to 6 months','Work and Study applications fully online','No TB test required'] },
  { flag:'🇺🇦', name:'Ukraine',      code:'ukraine',      tbTest:false, visaRequired:false, vacCities:'Online',                                                        processingWeeks:'1–3 wks',  popularRoutes:['special','work','family'] as TabId[],             notes:['Ukraine Schemes (Family & Homes for Ukraine) are free and fast-tracked','No TB test or visitor visa required','BRP collected in the UK after arrival'] },
  { flag:'🇯🇵', name:'Japan',        code:'japan',        tbTest:false, visaRequired:false, vacCities:'Tokyo, Osaka',                                                  processingWeeks:'3–5 wks',  popularRoutes:['work','study','visit','special'] as TabId[],      notes:['Visa-free for visits up to 6 months','Youth Mobility Scheme available for 18-30 year olds','Work and Study applications online'] },
];

function fmt(n: number) { return '£' + n.toLocaleString('en-GB'); }

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function VisaHubClient() {
  const [activeSection,     setActiveSection]     = useState<SectionId>('routes');
  const [activeTab,         setActiveTab]         = useState<TabId>('work');
  const [selectedCountry,   setSelectedCountry]   = useState<Country | null>(null);
  const [calcVisaId,        setCalcVisaId]        = useState('skilled-worker');
  const [calcDependants,    setCalcDependants]    = useState(0);
  const [calcYears,         setCalcYears]         = useState(3);
  const [calcPriority,      setCalcPriority]      = useState(false);
  const [calcSuperPriority, setCalcSuperPriority] = useState(false);

  const tabRoutes      = useMemo(() => ROUTES.filter(r => r.tab === activeTab), [activeTab]);
  const activeTabMeta  = TABS.find(t => t.id === activeTab)!;

  const calcResult = useMemo(() => {
    const route = ROUTES.find(r => r.id === calcVisaId);
    if (!route) return null;
    const ihsRate   = (calcVisaId === 'student' || calcVisaId === 'child-student') ? 776 : route.ihsPerYear;
    const mainFee   = route.baseFee;
    const depFee    = route.baseFee * calcDependants;
    const ihs       = ihsRate * calcYears * (1 + calcDependants);
    const priority  = calcPriority ? 500 : 0;
    const superprio = calcSuperPriority ? 800 : 0;
    return { mainFee, depFee, ihs, priority, superprio, total: mainFee + depFee + ihs + priority + superprio, ihsWaived: ihsRate === 0 };
  }, [calcVisaId, calcDependants, calcYears, calcPriority, calcSuperPriority]);

  return (
    <div className="min-h-screen" style={{ background: '#FFFFFF', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ══════════════════════════════════════
          PAGE HEADER — Editorial Premium hero
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-[100px] md:pt-[120px] pb-12 md:pb-16" style={{ background: '#FFFFFF' }}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="pb-7">
            <div className="flex items-center gap-2 text-[12px]" style={{ color: '#475569' }}>
              <Link href="/" className="transition-colors flex items-center gap-1"
                    style={{ color: '#475569' }}>
                <HomeIcon className="w-3 h-3" />
                UKDesk
              </Link>
              <ChevronRight className="w-3 h-3" style={{ color: '#94908A' }} />
              <span style={{ color: '#635BFF', fontWeight: 600 }}>UK Visa Hub</span>
            </div>
          </div>

          {/* Title row */}
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
                   style={{ background: 'rgba(99,91,255,0.08)', border: '1px solid rgba(99,91,255,0.18)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#635BFF' }} />
                <span className="text-[10.5px] font-bold uppercase" style={{ color: '#635BFF', letterSpacing: '0.18em' }}>
                  gov.uk verified · 2026
                </span>
              </div>
              <h1 style={{
                fontFamily: '"Inter Tight", Inter, sans-serif',
                fontWeight: 600,
                fontSize: 'clamp(1.75rem, 4.5vw, 2.875rem)',
                lineHeight: 0.98,
                letterSpacing: '-0.025em',
                color: '#1A1F36',
                textWrap: 'balance' as React.CSSProperties['textWrap'],
              }}>
                UK Visa <span style={{ fontStyle: 'italic', color: '#635BFF' }}>hub.</span>
              </h1>
              <p className="mt-5 text-[16px] md:text-[18px] leading-[1.6]" style={{ color: '#475569' }}>
                35+ visa routes · advanced cost calculator · settlement pathway · country guidance.
                All verified against gov.uk, HMRC and ONS.
              </p>
            </div>

            {/* Quick stats — paper white cards */}
            <div className="flex items-center gap-3 flex-wrap">
              {[
                { n: '35+',  l: 'Routes' },
                { n: '22',   l: 'Countries' },
                { n: '£0',   l: 'To use' },
              ].map(s => (
                <div key={s.l} className="px-5 py-3 rounded-xl text-center"
                     style={{ background: '#FFFFFF', border: '1px solid rgba(26,31,54,0.08)', minWidth: 88 }}>
                  <div className="tabular-nums"
                       style={{ fontFamily: '"Inter Tight", Inter, sans-serif', fontWeight: 700,
                                fontSize: 22, letterSpacing: '-0.03em', color: '#1A1F36', lineHeight: 1 }}>
                    {s.n}
                  </div>
                  <div className="text-[11px] mt-1.5 font-medium" style={{ color: '#94908A' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STICKY SECTION NAV ── */}
      <div className="sticky z-30"
           style={{
             top: 72,
             background: 'rgba(250,250,247,0.92)',
             backdropFilter: 'blur(20px) saturate(180%)',
             WebkitBackdropFilter: 'blur(20px) saturate(180%)',
             borderBottom: '1px solid rgba(26,31,54,0.08)',
           }}
           role="navigation" aria-label="Visa hub sections">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center overflow-x-auto gap-0 no-scrollbar">
            {SECTIONS.map(s => {
              const SIcon = s.icon;
              const active = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className="group flex-shrink-0 flex items-center gap-2 px-4 py-3.5 text-[13px] font-semibold relative transition-colors duration-100"
                  style={{ color: active ? '#1A1F36' : '#475569', borderBottom: active ? '2.5px solid #1A1F36' : '2.5px solid transparent', marginBottom: '-1px' }}
                  onMouseOver={e => { if (!active) (e.currentTarget as HTMLElement).style.color = '#1A1F36'; }}
                  onMouseOut={e => { if (!active) (e.currentTarget as HTMLElement).style.color = '#475569'; }}
                >
                  <span style={{ color: active ? '#635BFF' : '#94908A' }}>
                    <SIcon className="w-3.5 h-3.5" />
                  </span>
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">

        {/* ── SECTION: ROUTES ── */}
        {activeSection === 'routes' && (
          <div>
            {/* Visa type switcher */}
            <div className="bg-white border border-[#E5E7EB] rounded-lg mb-6 overflow-hidden">
              {/* Switcher label row */}
              <div className="px-5 pt-4 pb-0 flex items-center justify-between gap-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9CA3AF]">Browse by category</span>
                <Link href="/visa-switching"
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#635BFF] hover:underline">
                  <ChevronRight className="w-3 h-3" /> Already in UK? Switching guide
                </Link>
              </div>
              {/* Type tabs */}
              <div className="px-4 pt-2 pb-0 border-b border-[#F3F4F6]">
                <div className="flex items-center gap-0 overflow-x-auto pb-0">
                  {TABS.map(t => {
                    const TIcon = t.icon;
                    const isActive = activeTab === t.id;
                    const count = ROUTES.filter(r => r.tab === t.id).length;
                    return (
                      <button key={t.id} onClick={() => setActiveTab(t.id)}
                        className="group flex-shrink-0 flex items-center gap-1.5 px-3.5 pt-2 pb-3 text-[13px] font-semibold relative transition-colors duration-100"
                        style={{ color: isActive ? t.accent : '#475569', borderBottom: isActive ? `2.5px solid ${t.accent}` : '2.5px solid transparent', marginBottom: '-1px' }}>
                        <TIcon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{t.label}</span>
                        <span className="sm:hidden">{t.label.slice(0, 4)}</span>
                        <span className="text-[10.5px] font-normal tabular-nums" style={{ color: isActive ? t.accent : '#94908A', opacity: 0.8 }}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active type subtitle */}
              <div className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-2"
                style={{ background: `linear-gradient(90deg, ${activeTabMeta.accent}08 0%, transparent 50%)` }}>
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex w-7 h-7 rounded-lg items-center justify-center flex-shrink-0"
                    style={{ background: `${activeTabMeta.accent}18`, color: activeTabMeta.accent }}>
                    {(() => { const TIcon = activeTabMeta.icon; return <TIcon className="w-3.5 h-3.5" />; })()}
                  </span>
                  <span className="font-bold text-[#1A1F36] text-[14.5px]" style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}>
                    {activeTabMeta.label} Visas
                  </span>
                  <span className="text-[12px] text-[#9CA3AF]">— {tabRoutes.length} route{tabRoutes.length !== 1 ? 's' : ''}</span>
                </div>
                <button onClick={() => setActiveSection('calculator')}
                  className="inline-flex items-center gap-1 text-[12px] font-semibold transition-colors"
                  style={{ color: activeTabMeta.accent }}
                  onMouseOver={e => (e.currentTarget as HTMLElement).style.textDecoration = 'underline'}
                  onMouseOut={e => (e.currentTarget as HTMLElement).style.textDecoration = 'none'}>
                  <Calculator className="w-3 h-3" /> Calculate costs
                </button>
              </div>
            </div>

            {/* Visa cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {tabRoutes.map(route => <VisaCard key={route.id} r={route} />)}
            </div>

            {/* Switch hint */}
            <div className="mt-6 flex flex-wrap gap-3">
              {TABS.filter(t => t.id !== activeTab).map(t => {
                const TIcon = t.icon;
                const count = ROUTES.filter(r => r.tab === t.id).length;
                return (
                  <button key={t.id} onClick={() => setActiveTab(t.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold border border-[#E5E7EB] bg-white hover:border-[#1A1F36] transition-colors"
                    style={{ color: '#1A1F36' }}>
                    <span style={{ color: t.accent }}>{(() => { const AccentIcon = t.icon; return <AccentIcon className="w-3 h-3" />; })()}</span>
                    {t.label} <span className="text-[#9CA3AF] font-normal">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── SECTION: ELIGIBILITY ── */}
        {activeSection === 'eligibility' && (
          <div className="max-w-4xl">
            <div className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden mb-6">
              <div className="px-6 py-5 border-b border-[#F3F4F6]"
                style={{ background: 'linear-gradient(90deg, rgba(0,196,180,0.07) 0%, transparent 60%)' }}>
                <div className="flex items-center gap-3">
                  <span className="inline-flex w-10 h-10 rounded-xl items-center justify-center flex-shrink-0"
                    style={{ background: '#635BFF14', color: '#635BFF' }}>
                    <Target className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="font-bold text-[#1A1F36] text-[18px]" style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}>
                      Find your visa route
                    </h2>
                    <p className="text-[13px] text-[#76777e]">Answer a few questions — get matched in 60 seconds</p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-6 text-center">
                <p className="text-[15px] text-[#45464d] leading-relaxed max-w-xl mx-auto mb-6">
                  Tell us your nationality, what you want to do in the UK, and whether you have a job offer. We&rsquo;ll match you to the correct route and link the official gov.uk reference.
                </p>
                <Link href="/eligibility"
                  className="inline-flex items-center gap-2 text-[14.5px] font-bold px-7 py-3.5 rounded-xl text-white transition-all duration-150"
                  style={{ background: 'linear-gradient(135deg, #635BFF 0%, #064E3B 100%)', boxShadow: '0 4px 16px -2px rgba(0,196,180,0.40)' }}>
                  <Sparkles className="w-4 h-4" />
                  Start the eligibility quiz
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Quick guide by goal */}
            <div className="mb-2">
              <h3 className="font-bold text-[#1A1F36] text-[16px] mb-4" style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}>
                Or — pick your goal:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: Briefcase, accent: '#635BFF', title: 'I have a UK job offer', desc: 'Skilled Worker, Health & Care, Sportsperson or International Agreement', tab: 'work' as TabId },
                  { icon: GraduationCap, accent: '#1E3A8A', title: 'I want to study in the UK', desc: 'Student Visa (degree+), Child Student, Short-term Study or Graduate visa after', tab: 'study' as TabId },
                  { icon: Heart, accent: '#E11D48', title: 'I want to join family', desc: 'Spouse/Partner, Fiancé, Child joining parents, Parent of British child', tab: 'family' as TabId },
                  { icon: Plane, accent: '#5851DB', title: 'I just want to visit', desc: 'Standard Visitor up to 6 months. 10-year multi-entry available.', tab: 'visit' as TabId },
                  { icon: ShieldCheck, accent: '#10B981', title: 'I want to settle permanently', desc: 'ILR after 5 years (most routes) or 10-year long residence route', tab: 'settlement' as TabId },
                  { icon: Crown, accent: '#7C3AED', title: 'I want British citizenship', desc: 'Naturalisation (ILR + 12m), Registration for children, BN(O) pathway', tab: 'citizenship' as TabId },
                  { icon: Star, accent: '#F59E0B', title: 'I have a UK grandparent / young / exceptional', desc: 'UK Ancestry, Youth Mobility, High Potential Individual, BN(O)', tab: 'special' as TabId },
                ].map(item => {
                  const IIcon = item.icon;
                  return (
                    <button key={item.tab}
                      onClick={() => { setActiveSection('routes'); setActiveTab(item.tab); }}
                      className="group flex items-start gap-4 p-4 bg-white border border-[#E5E7EB] rounded-xl text-left hover:border-[#1A1F36] transition-all duration-100"
                      style={{ boxShadow: '0 1px 3px rgba(16,26,54,0.04)' }}
                      onMouseOver={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px -4px rgba(16,26,54,0.12)'}
                      onMouseOut={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(16,26,54,0.04)'}>
                      <span className="inline-flex w-10 h-10 rounded-xl items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: `${item.accent}14`, color: item.accent }}>
                        <IIcon className="w-5 h-5" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[14.5px] text-[#1A1F36] leading-tight" style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}>{item.title}</div>
                        <p className="mt-1 text-[12.5px] text-[#6B7280] leading-snug">{item.desc}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: item.accent }} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION: CALCULATOR ── */}
        {activeSection === 'calculator' && (
          <div>
            <div className="mb-6">
              <h2 className="font-bold text-[#1A1F36] text-[22px] tracking-[-0.015em]" style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}>
                Advanced cost calculator
              </h2>
              <p className="mt-1 text-[14px] text-[#6B7280]">Home Office fees + Immigration Health Surcharge + priority services · gov.uk 2026 rates</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              {/* Inputs panel */}
              <div className="lg:col-span-3 bg-white border border-[#E5E7EB] rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-[#F3F4F6]"
                  style={{ background: 'linear-gradient(90deg, rgba(201,161,74,0.07) 0%, transparent 60%)' }}>
                  <div className="flex items-center gap-2.5">
                    <Calculator className="w-5 h-5" style={{ color: '#5851DB' }} />
                    <span className="font-bold text-[#1A1F36] text-[15px]" style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}>Configure your application</span>
                  </div>
                </div>
                <div className="px-6 py-6 space-y-7">
                  {/* Visa selector */}
                  <div>
                    <label className="block text-[11.5px] font-bold uppercase tracking-[0.1em] text-[#6B7280] mb-2.5">Visa route</label>
                    <div className="relative">
                      <select value={calcVisaId} onChange={e => setCalcVisaId(e.target.value)}
                        className="w-full appearance-none bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3 text-[14px] font-semibold text-[#1A1F36] outline-none pr-10 transition-colors"
                        style={{ fontFamily: 'Inter,sans-serif' }}
                        onFocus={e => (e.target as HTMLElement).style.borderColor = '#1A1F36'}
                        onBlur={e => (e.target as HTMLElement).style.borderColor = 'rgba(26,31,54,0.08)'}>
                        {TABS.map(tab => (
                          <optgroup key={tab.id} label={`── ${tab.label.toUpperCase()} ──`}>
                            {ROUTES.filter(r => r.tab === tab.id).map(r => (
                              <option key={r.id} value={r.id}>{r.title}</option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-[11.5px] font-bold uppercase tracking-[0.1em] text-[#6B7280] mb-2.5">Visa duration (years)</label>
                    <div className="flex gap-2 flex-wrap">
                      {[1, 2, 3, 5].map(y => (
                        <button key={y} onClick={() => setCalcYears(y)}
                          className="px-5 py-2.5 rounded-xl text-[13.5px] font-semibold border transition-all duration-100"
                          style={{
                            background: calcYears === y ? '#1A1F36' : '#fff',
                            color: calcYears === y ? '#fff' : '#1A1F36',
                            borderColor: calcYears === y ? '#1A1F36' : 'rgba(26,31,54,0.08)',
                            boxShadow: calcYears === y ? '0 2px 8px rgba(26,31,54,0.20)' : 'none',
                          }}>
                          {y} yr
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dependants */}
                  <div>
                    <label className="block text-[11.5px] font-bold uppercase tracking-[0.1em] text-[#6B7280] mb-2.5">Dependants</label>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setCalcDependants(d => Math.max(0, d - 1))}
                        className="w-10 h-10 rounded-xl border border-[#E5E7EB] flex items-center justify-center text-[#1A1F36] hover:bg-[#F3F4F6] transition-colors">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center font-bold text-[20px] text-[#1A1F36] tabular-nums"
                        style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}>{calcDependants}</span>
                      <button onClick={() => setCalcDependants(d => Math.min(6, d + 1))}
                        className="w-10 h-10 rounded-xl border border-[#E5E7EB] flex items-center justify-center text-[#1A1F36] hover:bg-[#F3F4F6] transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[13px] text-[#9CA3AF]">
                        {calcDependants === 0 ? 'No dependants' : `${calcDependants} person${calcDependants > 1 ? 's' : ''} included`}
                      </span>
                    </div>
                  </div>

                  {/* Add-ons */}
                  <div>
                    <label className="block text-[11.5px] font-bold uppercase tracking-[0.1em] text-[#6B7280] mb-2.5">Optional services</label>
                    <div className="space-y-3">
                      {[
                        { id: 'priority', label: 'Priority service', note: '+£500 · 5 working days', state: calcPriority, set: (v: boolean) => { setCalcPriority(v); if (v) setCalcSuperPriority(false); } },
                        { id: 'super', label: 'Super priority service', note: '+£800 · next working day', state: calcSuperPriority, set: (v: boolean) => { setCalcSuperPriority(v); if (v) setCalcPriority(false); } },
                      ].map(opt => (
                        <label key={opt.id} className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl border border-[#F3F4F6] hover:border-[#E5E7EB] transition-colors">
                          <input type="checkbox" checked={opt.state} onChange={e => opt.set(e.target.checked)}
                            className="w-4 h-4 rounded" style={{ accentColor: '#1A1F36' }} />
                          <div>
                            <span className="text-[13.5px] font-semibold text-[#1A1F36]">{opt.label}</span>
                            <span className="ml-2 text-[12px] text-[#9CA3AF]">{opt.note}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Results panel */}
              <div className="lg:col-span-2 rounded-lg overflow-hidden flex flex-col"
                style={{ background: '#1A1F36' }}>
                <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <span className="text-[11.5px] font-bold uppercase tracking-[0.1em]" style={{ color: '#A7F3D0' }}>
                    Cost breakdown
                  </span>
                </div>
                <div className="flex-1 flex flex-col px-6 py-6">
                  {calcResult ? (
                    <>
                      <div className="space-y-3.5 flex-1">
                        <CostRow label="Main applicant fee" value={fmt(calcResult.mainFee)} />
                        {calcDependants > 0 && (
                          <CostRow label={`Dependant fees (×${calcDependants})`} value={fmt(calcResult.depFee)} />
                        )}
                        <CostRow
                          label={calcResult.ihsWaived ? 'IHS — waived ✓' : `IHS (${calcYears}yr × ${1 + calcDependants} person${calcDependants > 0 ? 's' : ''})`}
                          value={calcResult.ihsWaived ? '£0' : fmt(calcResult.ihs)}
                          note={calcResult.ihsWaived ? 'Health & Care route' : undefined}
                        />
                        {calcResult.priority > 0 && <CostRow label="Priority service" value={fmt(calcResult.priority)} />}
                        {calcResult.superprio > 0 && <CostRow label="Super priority service" value={fmt(calcResult.superprio)} />}
                      </div>
                      <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}>
                        <div className="text-[12.5px] mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>Estimated total</div>
                        <div className="font-bold tabular-nums text-white tracking-[-0.025em]"
                          style={{ fontFamily: '"Inter Tight", Inter, sans-serif', fontSize: 'clamp(1.5rem, 3.8vw, 2.25rem)' }}>
                          {fmt(calcResult.total)}
                        </div>
                        <p className="text-[11.5px] mt-2 leading-snug" style={{ color: 'rgba(255,255,255,0.40)' }}>
                          Biometric fee (£19.20/person), courier, translation and legal costs not included.
                        </p>
                        <Link href="/tools/cost-calculator"
                          className="mt-5 inline-flex w-full items-center justify-center gap-2 text-[13.5px] font-bold px-4 py-2.5 rounded-xl transition-colors"
                          style={{ background: '#A7F3D0', color: '#1A1F36' }}>
                          Full cost calculator <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-[13px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      Select a visa route
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Info footer */}
            <div className="mt-4 p-4 bg-white border border-[#E5E7EB] rounded-xl flex flex-wrap items-center gap-4">
              {[
                { icon: CheckCircle2, text: 'All fees gov.uk verified', color: '#10B981' },
                { icon: FileText, text: 'IHS rates: £1,035/yr standard · £776/yr students', color: '#1E3A8A' },
                { icon: Clock, text: 'Rates correct as of April 2026', color: '#5851DB' },
              ].map(item => {
                const IIcon = item.icon;
                return (
                  <div key={item.text} className="flex items-center gap-1.5 text-[12.5px] text-[#6B7280]">
                    <IIcon className="w-3.5 h-3.5" style={{ color: item.color }} />
                    {item.text}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── SECTION: SETTLEMENT ── */}
        {activeSection === 'settlement' && (
          <div>
            <div className="mb-6">
              <h2 className="font-bold text-[#1A1F36] text-[22px] tracking-[-0.015em]" style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}>
                Settlement & Citizenship pathways
              </h2>
              <p className="mt-1 text-[14px] text-[#6B7280]">All routes to ILR, naturalisation and British passport</p>
            </div>

            {/* Pathway timeline */}
            <div className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden mb-6">
              <div className="px-5 py-4 border-b border-[#F3F4F6]"
                style={{ background: 'linear-gradient(90deg, rgba(16,185,129,0.06) 0%, transparent 50%)' }}>
                <h3 className="font-bold text-[#1A1F36] text-[15px] flex items-center gap-2" style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}>
                  <ShieldCheck className="w-4.5 h-4.5 text-[#10B981]" />
                  Standard pathway: Visa → ILR → British Citizenship
                </h3>
              </div>
              <div className="p-5 overflow-x-auto">
                <div className="flex items-stretch gap-0 min-w-[600px]">
                  {[
                    { step: '1', title: 'Entry Visa',        desc: 'Skilled Worker, Family, Student, BN(O) or other qualifying route',       accent: '#635BFF', icon: Plane,      dur: 'Day 1' },
                    { step: '2', title: '5 Years (most)',    desc: 'Continuous lawful residence. Salary must stay above threshold.',           accent: '#1E3A8A', icon: Clock,      dur: '~5 yr' },
                    { step: '3', title: 'Apply for ILR',     desc: 'Indefinite Leave to Remain. Permanent right to live and work in the UK.', accent: '#10B981', icon: ShieldCheck,dur: '£2,885' },
                    { step: '4', title: '12 Months with ILR',desc: 'Continue UK residence. Life in the UK test + English language required.',  accent: '#7C3AED', icon: Star,       dur: '12 m' },
                    { step: '5', title: 'British Citizenship',desc: 'Naturalisation or registration. Then apply for British passport.',        accent: '#5851DB', icon: Crown,      dur: '£1,500' },
                  ].map((s, i) => (
                    <div key={s.step} className="flex items-stretch flex-1 min-w-0">
                      <div className="flex-1 rounded-xl border border-[#E5E7EB] p-4 flex flex-col gap-2.5 relative overflow-hidden"
                        style={{ background: `linear-gradient(145deg, ${s.accent}05 0%, transparent 70%)` }}>
                        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: s.accent, opacity: 0.7 }} />
                        <span className="inline-flex w-8 h-8 rounded-lg items-center justify-center mt-1"
                          style={{ background: `${s.accent}18`, color: s.accent }}>
                          {(() => { const SIcon = s.icon; return <SIcon className="w-4 h-4" />; })()}
                        </span>
                        <div>
                          <div className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF] mb-0.5">Step {s.step}</div>
                          <div className="font-bold text-[13.5px] text-[#1A1F36] leading-snug" style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}>{s.title}</div>
                          <p className="mt-1 text-[11.5px] text-[#6B7280] leading-snug">{s.desc}</p>
                        </div>
                        <div className="mt-auto inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold self-start"
                          style={{ background: `${s.accent}14`, color: s.accent }}>{s.dur}</div>
                      </div>
                      {i < 4 && (
                        <div className="flex items-center px-1.5 flex-shrink-0">
                          <ArrowRight className="w-3.5 h-3.5 text-[#CBD5E1]" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Settlement routes cards */}
            <div className="mb-6">
              <h3 className="font-bold text-[#1A1F36] text-[15.5px] mb-3" style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}>
                ILR routes (Settlement)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {ROUTES.filter(r => r.tab === 'settlement').map(r => <VisaCard key={r.id} r={r} />)}
              </div>
            </div>

            {/* Citizenship routes */}
            <div className="mb-6">
              <h3 className="font-bold text-[#1A1F36] text-[15.5px] mb-3" style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}>
                Citizenship & British passport
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {ROUTES.filter(r => r.tab === 'citizenship').map(r => <VisaCard key={r.id} r={r} />)}
              </div>
            </div>

            {/* CTA row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <Link href="/settlement"
                className="flex items-center justify-between gap-3 p-5 bg-white border border-[#E5E7EB] rounded-xl hover:border-[#1A1F36] transition-all group"
                style={{ boxShadow: '0 1px 3px rgba(16,26,54,0.04)' }}
                onMouseOver={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px -4px rgba(16,26,54,0.12)'}
                onMouseOut={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(16,26,54,0.04)'}>
                <div>
                  <div className="font-bold text-[14.5px] text-[#1A1F36]" style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}>Settlement comparison guide</div>
                  <div className="text-[12.5px] text-[#6B7280] mt-0.5">Side-by-side fees, time-to-ILR and English requirements</div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#1A1F36] transition-colors flex-shrink-0" />
              </Link>
              <button onClick={() => setActiveSection('calculator')}
                className="flex items-center justify-between gap-3 p-5 bg-white border border-[#E5E7EB] rounded-xl hover:border-[#1A1F36] transition-all group text-left"
                style={{ boxShadow: '0 1px 3px rgba(16,26,54,0.04)' }}
                onMouseOver={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px -4px rgba(16,26,54,0.12)'}
                onMouseOut={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(16,26,54,0.04)'}>
                <div>
                  <div className="font-bold text-[14.5px] text-[#1A1F36]" style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}>Calculate ILR fees</div>
                  <div className="text-[12.5px] text-[#6B7280] mt-0.5">£2,885 ILR + £1,500 citizenship + biometric fees</div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#1A1F36] transition-colors flex-shrink-0" />
              </button>
            </div>
          </div>
        )}

        {/* ── SECTION: COUNTRIES ── */}
        {activeSection === 'countries' && (
          <div>
            <div className="mb-6">
              <h2 className="font-bold text-[#1A1F36] text-[22px] tracking-[-0.015em]" style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}>
                Applying from your country
              </h2>
              <p className="mt-1 text-[14px] text-[#6B7280]">TB test requirement · VAC locations · visa requirement · country-specific notes</p>
            </div>

            {/* Country grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-5">
              {COUNTRIES.map(c => {
                const isSelected = selectedCountry?.code === c.code;
                return (
                  <button key={c.code}
                    onClick={() => setSelectedCountry(isSelected ? null : c)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all duration-100"
                    style={{
                      background: isSelected ? '#1A1F36' : '#fff',
                      borderColor: isSelected ? '#1A1F36' : 'rgba(26,31,54,0.08)',
                      boxShadow: isSelected ? '0 4px 12px rgba(26,31,54,0.20)' : 'none',
                    }}
                    onMouseOver={e => { if (!isSelected) { (e.currentTarget as HTMLElement).style.borderColor = '#1A1F36'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(26,31,54,0.08)'; } }}
                    onMouseOut={e => { if (!isSelected) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(26,31,54,0.08)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; } }}>
                    <span className="text-[24px] leading-none">{c.flag}</span>
                    <span className="text-[12px] font-semibold leading-tight" style={{ color: isSelected ? '#fff' : '#1A1F36' }}>{c.name}</span>
                    {c.tbTest && !isSelected && (
                      <span className="text-[9.5px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 font-semibold">TB req</span>
                    )}
                    {!c.visaRequired && !isSelected && (
                      <span className="text-[9.5px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold">Visa-free</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected country detail */}
            {selectedCountry ? (
              <div className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 border-b border-[#F3F4F6]"
                  style={{ background: 'linear-gradient(90deg, rgba(26,31,54,0.04) 0%, transparent 60%)' }}>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[2.5rem] leading-none">{selectedCountry.flag}</span>
                      <div>
                        <h3 className="font-bold text-[#1A1F36] text-[20px]" style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}>
                          Applying to the UK from {selectedCountry.name}
                        </h3>
                        <p className="text-[12.5px] text-[#6B7280]">gov.uk verified · typical processing {selectedCountry.processingWeeks}</p>
                      </div>
                    </div>
                    <Link href={`/from/${selectedCountry.code}`}
                      className="inline-flex items-center gap-1.5 text-[13px] font-bold px-4 py-2 rounded-xl border border-[#1A1F36] text-[#1A1F36] hover:bg-[#1A1F36] hover:text-white transition-all">
                      Full {selectedCountry.name} guide <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Key facts row */}
                <div className="px-6 pt-5 pb-4 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-[#F3F4F6]">
                  <InfoPill
                    ok={!selectedCountry.visaRequired}
                    label={selectedCountry.visaRequired ? 'Visitor visa required' : 'Visa-free visiting'}
                    desc={selectedCountry.visaRequired
                      ? 'Apply for Standard Visitor visa on gov.uk before travelling.'
                      : 'No visa needed for short visits (up to 6 months).'}
                  />
                  <InfoPill
                    ok={!selectedCountry.tbTest}
                    label={selectedCountry.tbTest ? 'TB test required' : 'No TB test required'}
                    desc={selectedCountry.tbTest
                      ? 'Book UK-approved TB test at an approved IOM clinic before applying.'
                      : 'No tuberculosis test needed for your application.'}
                  />
                  <div className="rounded-xl p-4 border" style={{ background: '#FFFFFF', borderColor: 'rgba(26,31,54,0.08)' }}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <MapPin className="w-4 h-4 text-[#2563EB] flex-shrink-0" />
                      <span className="text-[13px] font-bold text-[#1A1F36]" style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}>VAC / Application centre</span>
                    </div>
                    <p className="text-[12.5px] text-[#374151] leading-relaxed font-medium">{selectedCountry.vacCities}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#6B7280]" />
                      <span className="text-[11.5px] text-[#6B7280]">Typical: {selectedCountry.processingWeeks}</span>
                    </div>
                  </div>
                </div>

                {/* Popular visas from this country */}
                <div className="px-6 pt-5 pb-4 border-b border-[#F3F4F6]">
                  <h4 className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF] mb-3">
                    Popular visa types from {selectedCountry.name}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCountry.popularRoutes.map(tabId => {
                      const tab = TABS.find(t => t.id === tabId);
                      if (!tab) return null;
                      const count = ROUTES.filter(r => r.tab === tabId).length;
                      const TIcon = tab.icon;
                      return (
                        <button key={tabId}
                          onClick={() => { setActiveSection('routes'); setActiveTab(tabId); }}
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-[13px] font-semibold transition-all duration-100 hover:shadow-sm"
                          style={{ background: `${tab.accent}0c`, borderColor: `${tab.accent}30`, color: '#1A1F36' }}
                          onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = tab.accent; (e.currentTarget as HTMLElement).style.background = `${tab.accent}18`; }}
                          onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = `${tab.accent}30`; (e.currentTarget as HTMLElement).style.background = `${tab.accent}0c`; }}>
                          <span style={{ color: tab.accent }}><TIcon className="w-3.5 h-3.5" /></span>
                          {tab.label}
                          <span className="text-[11px] font-normal text-[#9CA3AF]">{count} routes</span>
                          <ArrowRight className="w-3 h-3 text-[#9CA3AF]" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Country-specific notes */}
                <div className="px-6 py-5">
                  <h4 className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF] mb-3">
                    Key notes for {selectedCountry.name} applicants
                  </h4>
                  <ul className="space-y-2">
                    {selectedCountry.notes.map((note, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                        <span className="text-[13px] text-[#374151] leading-snug">{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-[#E5E7EB] rounded-lg p-10 text-center">
                <Globe className="w-10 h-10 mx-auto mb-3" style={{ color: '#D8D5CA' }} />
                <p className="text-[15px] font-semibold text-[#374151] mb-1">Select a country above</p>
                <p className="text-[13px] text-[#9CA3AF]">See applicable visa types, TB test, VAC locations and country-specific tips.</p>
              </div>
            )}

            <div className="mt-4 text-center">
              <Link href="/from"
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1A1F36] hover:underline">
                View all 22 country guides <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

      </div>

      {/* ── TOOLS FOOTER STRIP ── */}
      <div className="border-t border-[#E5E7EB] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-[13px] font-semibold text-[#374151]">Related visa tools:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { href: '/eligibility',               label: 'Eligibility quiz',       accent: '#635BFF' },
                { href: '/tools/cost-calculator',     label: 'Cost calculator',        accent: '#5851DB' },
                { href: '/tools/salary-checker',      label: 'SOC salary check',       accent: '#1E3A8A' },
                { href: '/tools/sponsor-search',      label: 'Sponsor search',         accent: '#1A1F36' },
                { href: '/ihs-calculator',            label: 'IHS calculator',         accent: '#E11D48' },
                { href: '/settlement',                label: 'Settlement guide',       accent: '#10B981' },
              ].map(t => (
                <Link key={t.href} href={t.href}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FCFCFD] border border-[#E5E7EB] hover:border-[#1A1F36] text-[12.5px] font-semibold text-[#374151] transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.accent }} />
                  {t.label}
                </Link>
              ))}
            </div>
            <Link href="/"
              className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#6B7280] hover:text-[#1A1F36] transition-colors">
              ← Back to all tools
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}

/* ─── SUBCOMPONENTS ─── */

function VisaCard({ r }: { r: VisaRoute }) {
  const Icon = r.icon;
  const badgeColors: Record<string, string> = {
    'Most popular': '#F59E0B', 'Popular': '#F59E0B', 'IHS waived': '#10B981',
    'Free': '#10B981', 'New route': '#7C3AED', 'Final step': '#DC2626',
  };
  const badgeColor = r.badge ? (badgeColors[r.badge] ?? '#475569') : null;
  return (
    <Link href={r.href}
      className="group relative bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col gap-3 transition-all duration-150"
      style={{ boxShadow: '0 1px 3px rgba(16,26,54,0.04)' }}
      onMouseOver={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 32px -6px rgba(16,26,54,0.16), 0 0 0 1.5px rgba(26,31,54,0.12)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
      onMouseOut={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(16,26,54,0.04)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] rounded-t-xl"
        style={{ background: `linear-gradient(90deg, ${r.accent} 0%, ${r.accent}60 100%)`, opacity: 0.6 }} />
      <div className="flex items-start justify-between gap-2 mt-1">
        <span className="inline-flex w-10 h-10 rounded-xl items-center justify-center flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${r.accent}1e 0%, ${r.accent}0a 100%)`, color: r.accent }}>
          <Icon className="w-5 h-5" />
        </span>
        {r.badge && badgeColor && (
          <span className="inline-flex items-center text-[9.5px] font-bold uppercase tracking-[0.06em] px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ background: `${badgeColor}14`, color: badgeColor }}>
            {r.badge}
          </span>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-[#1A1F36] text-[14.5px] tracking-[-0.005em] leading-snug"
          style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}>{r.title}</h3>
        <p className="mt-1.5 text-[12px] text-[#6B7280] leading-[1.5]">{r.blurb}</p>
      </div>
      <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-[#F3F4F6]">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#9CA3AF] mb-0.5">Fee</div>
          <div className="font-bold text-[12.5px] text-[#1A1F36] tabular-nums"
            style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}>{r.fee}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#9CA3AF] mb-0.5">To ILR</div>
          <div className="font-semibold text-[12px] text-[#374151]">{r.toILR ?? '—'}</div>
        </div>
      </div>
      <span className="inline-flex items-center gap-1 text-[12px] font-semibold group-hover:gap-2 transition-[gap] duration-100"
        style={{ color: r.accent }}>
        View route <ArrowRight className="w-3.5 h-3.5" />
      </span>
    </Link>
  );
}

function CostRow({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
      <div>
        <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.72)' }}>{label}</span>
        {note && <div className="text-[10.5px] text-[#A7F3D0] mt-0.5">{note}</div>}
      </div>
      <span className="font-bold text-[14px] text-white tabular-nums flex-shrink-0"
        style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}>{value}</span>
    </div>
  );
}

function InfoPill({ ok, label, desc }: { ok: boolean; label: string; desc: string }) {
  return (
    <div className="rounded-xl p-4 border" style={{
      background: ok ? 'rgba(99,91,255,0.08)' : '#FBF6E7',
      borderColor: ok ? 'rgba(99,91,255,0.30)' : 'rgba(88,81,219,0.30)',
    }}>
      <div className="flex items-center gap-2 mb-1.5">
        {ok
          ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#635BFF' }} />
          : <XCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#5851DB' }} />
        }
        <span className="text-[13px] font-bold text-[#1A1F36]" style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}>{label}</span>
      </div>
      <p className="text-[12px] text-[#374151] leading-snug pl-6">{desc}</p>
    </div>
  );
}
