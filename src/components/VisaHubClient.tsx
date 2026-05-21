'use client';

/**
 * VisaHubClient — interactive visa directory for /visa-types
 *
 * Features:
 *  1. Tab navigation: Work | Study | Family | Visit | Settlement | Citizenship | Special
 *  2. Full card grid for every UK visa route (~35 routes)
 *  3. Inline advanced cost calculator (fee + IHS + priority)
 *  4. Country selector (TB test, visa requirement, VAC info)
 *  5. Settlement pathway visual (Visa → ILR → Citizenship)
 *  6. Eligibility CTA strip
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Briefcase, GraduationCap, Plane, Users, ShieldCheck, Crown, Star,
  Calculator, ArrowRight, ArrowUpRight, CheckCircle2, XCircle,
  Globe, Clock, Sparkles, Target, Plus, Minus,
  Heart, Building2, Leaf, BookOpen, Zap, MapPin,
  Flag, Baby, User, Home, ChevronDown, ChevronUp,
} from 'lucide-react';

/* ─── TYPES ─── */
type TabId = 'work' | 'study' | 'family' | 'visit' | 'settlement' | 'citizenship' | 'special';

interface VisaRoute {
  id: string;
  title: string;
  blurb: string;
  fee: string;
  baseFee: number;
  ihsPerYear: number;
  duration: string;
  toILR: string | null;
  accent: string;
  icon: React.ComponentType<{ className?: string }>;
  tab: TabId;
  badge?: string;
  href: string;
}

interface Country {
  flag: string;
  name: string;
  code: string;
  tbTest: boolean;
  visaRequired: boolean;
  vacCities: string;
}

/* ─── TABS ─── */
const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }>; accent: string }[] = [
  { id: 'work',        label: 'Work',        icon: Briefcase,     accent: '#00C4B4' },
  { id: 'study',       label: 'Study',       icon: GraduationCap, accent: '#2563EB' },
  { id: 'family',      label: 'Family',      icon: Heart,         accent: '#E11D48' },
  { id: 'visit',       label: 'Visit',       icon: Plane,         accent: '#C9A14A' },
  { id: 'settlement',  label: 'Settlement',  icon: ShieldCheck,   accent: '#10B981' },
  { id: 'citizenship', label: 'Citizenship', icon: Crown,         accent: '#7C3AED' },
  { id: 'special',     label: 'Special',     icon: Star,          accent: '#F59E0B' },
];

/* ─── VISA ROUTES ─── */
const ROUTES: VisaRoute[] = [
  /* WORK */
  { id:'skilled-worker',   title:'Skilled Worker',           blurb:'Employer-sponsored employment at any eligible SOC occupation. Most common route to ILR.',        fee:'from £610',              baseFee:610,   ihsPerYear:1035, duration:'3–5 yr',    toILR:'5 years',                      accent:'#00C4B4', icon:Briefcase,    tab:'work',        badge:'Popular', href:'/visa/skilled-worker'    },
  { id:'health-care',      title:'Health & Care Worker',     blurb:'NHS, eligible social care and domiciliary care roles. IHS waived for all applicants.',            fee:'from £247',              baseFee:247,   ihsPerYear:0,    duration:'3 yr',      toILR:'5 years',                      accent:'#10B981', icon:Building2,    tab:'work',        badge:'IHS Waived', href:'/visa/health-and-care' },
  { id:'global-talent',    title:'Global Talent',            blurb:'Endorsed leaders in digital tech, arts, science or academia. No employer sponsor required.',      fee:'£167 + endorsement',     baseFee:167,   ihsPerYear:1035, duration:'Flexible',  toILR:'3–5 years',                    accent:'#7C3AED', icon:Star,         tab:'work',        href:'/visa/global-talent'     },
  { id:'innovator-founder',title:'Innovator Founder',        blurb:'Endorsed founders with an innovative, viable, scalable business plan approved by an endorser.',   fee:'£1,357',                 baseFee:1357,  ihsPerYear:1035, duration:'3 yr',      toILR:'3 years',                      accent:'#F59E0B', icon:Zap,          tab:'work',        href:'/visa/innovator-founder' },
  { id:'scale-up',         title:'Scale-up Worker',          blurb:'Fast-growing companies. Unsponsored after 6 months — no Certificate of Sponsorship needed.',      fee:'from £610',              baseFee:610,   ihsPerYear:1035, duration:'2 yr',      toILR:'5 years',                      accent:'#2563EB', icon:Target,       tab:'work',        href:'/visa/scale-up'          },
  { id:'ict-senior',       title:'Senior / Specialist (ICT)',blurb:'Intra-company transfers for established employees in senior or specialist roles.',                 fee:'from £610',              baseFee:610,   ihsPerYear:1035, duration:'Up to 9 yr',toILR:'5 yr (switch to SW)',           accent:'#0EA5E9', icon:Building2,    tab:'work',        href:'/visa/ict'               },
  { id:'grad-trainee',     title:'Graduate Trainee (ICT)',   blurb:'Intra-company transfer for graduate trainees on a structured programme.',                         fee:'from £247',              baseFee:247,   ihsPerYear:1035, duration:'1 yr',      toILR:null,                           accent:'#0EA5E9', icon:GraduationCap,tab:'work',        href:'/visa/ict'               },
  { id:'seasonal',         title:'Seasonal Worker',          blurb:'Horticulture, food processing and poultry via licensed scheme operators. No IHS required.',       fee:'£298',                   baseFee:298,   ihsPerYear:0,    duration:'Up to 6 m', toILR:null,                           accent:'#84CC16', icon:Leaf,         tab:'work',        href:'/visa/seasonal'          },
  { id:'sportsperson',     title:'Sportsperson',             blurb:'Elite athletes and coaches at the highest level of their sport, endorsed by a governing body.',   fee:'£298',                   baseFee:298,   ihsPerYear:1035, duration:'3 yr',      toILR:null,                           accent:'#F59E0B', icon:Target,       tab:'work',        href:'/visa/sportsperson'      },
  { id:'minister-rel',     title:'Minister of Religion',     blurb:'Religious workers and members of religious orders sponsored by a UK religious organisation.',     fee:'£298',                   baseFee:298,   ihsPerYear:1035, duration:'3 yr',      toILR:'5 years',                      accent:'#A78BFA', icon:Star,         tab:'work',        href:'/visa/minister-of-religion'},
  { id:'intl-agreement',   title:'International Agreement',  blurb:'Workers under international treaties (GATS/CETA) or private servants of diplomats.',             fee:'£298',                   baseFee:298,   ihsPerYear:0,    duration:'Varies',    toILR:null,                           accent:'#6B7280', icon:Globe,        tab:'work',        href:'/visa/international-agreement'},

  /* STUDY */
  { id:'student',          title:'Student Visa',             blurb:'Degree-level and above at a UKVI-licensed sponsor. Up to 20 hrs/wk term-time work allowed.',     fee:'£363 outside / £490 in-UK',baseFee:363,  ihsPerYear:776,  duration:'1–5 yr',    toILR:null,                           accent:'#2563EB', icon:GraduationCap,tab:'study',       badge:'Popular', href:'/visa/student'           },
  { id:'child-student',    title:'Child Student',            blurb:'Independent school study for children aged 4–17 on a sponsored place at a licensed school.',     fee:'£363',                   baseFee:363,   ihsPerYear:776,  duration:'Up to 6 yr',toILR:null,                           accent:'#0EA5E9', icon:Baby,         tab:'study',       href:'/visa/child-student'     },
  { id:'short-study',      title:'Short-term Study',         blurb:'English language study up to 6 months (11 months with academic qualification).',                 fee:'£200',                   baseFee:200,   ihsPerYear:0,    duration:'Up to 11 m',toILR:null,                           accent:'#60A5FA', icon:BookOpen,     tab:'study',       href:'/visa/short-term-study'  },
  { id:'graduate',         title:'Graduate Visa',            blurb:'Stay and work 2 years (3 for PhD) after graduating from a UK university. No sponsor needed.',    fee:'£822',                   baseFee:822,   ihsPerYear:1035, duration:'2–3 yr',    toILR:null,                           accent:'#6366F1', icon:GraduationCap,tab:'study',       href:'/visa/graduate'          },

  /* FAMILY */
  { id:'spouse-partner',   title:'Spouse / Partner',         blurb:'Join a British citizen or settled person. Income req £29,000 (Apr 2024+). 5 yrs to ILR.',      fee:'£1,846 outside',         baseFee:1846,  ihsPerYear:1035, duration:'2.5 yr',    toILR:'5 years',                      accent:'#E11D48', icon:Heart,        tab:'family',      badge:'Popular', href:'/visa/family'            },
  { id:'fiancee',          title:'Fiancé(e)',                blurb:'Marry or register a civil partnership within 6 months, then switch to Spouse visa.',             fee:'£1,846',                 baseFee:1846,  ihsPerYear:0,    duration:'6 months',  toILR:'5 yr (after switch)',           accent:'#F43F5E', icon:Heart,        tab:'family',      href:'/visa/family'            },
  { id:'child-dep',        title:'Child Joining Parents',    blurb:'Children under 18 joining both parents (or a lone parent) who are British or settled.',          fee:'£1,846',                 baseFee:1846,  ihsPerYear:1035, duration:'2.5 yr',    toILR:'5 years',                      accent:'#FB923C', icon:Baby,         tab:'family',      href:'/visa/family'            },
  { id:'parent-brit',      title:'Parent of British Child',  blurb:'Parent of a British or settled child under 18, with sole responsibility for the child.',         fee:'£1,846',                 baseFee:1846,  ihsPerYear:1035, duration:'2.5 yr',    toILR:'5 years',                      accent:'#FBBF24', icon:Users,        tab:'family',      href:'/visa/family'            },
  { id:'adult-dep',        title:'Adult Dependent Relative', blurb:'For elderly or incapacitated relatives needing long-term personal care from a settled person.',  fee:'£3,250',                 baseFee:3250,  ihsPerYear:1035, duration:'2.5 yr',    toILR:'5 years',                      accent:'#D97706', icon:Users,        tab:'family',      href:'/visa/family'            },

  /* VISIT */
  { id:'visitor-std',      title:'Standard Visitor',         blurb:'Tourism, family visit, medical treatment or business meetings. Up to 6 months per visit.',       fee:'from £115 (6m) to £963 (10yr)',baseFee:115,ihsPerYear:0, duration:'6m – 10yr', toILR:null,                           accent:'#C9A14A', icon:Plane,        tab:'visit',       badge:'Popular', href:'/visa/visitor'           },
  { id:'marriage-visitor', title:'Marriage Visitor',         blurb:'Visit specifically to marry or register a civil partnership. Cannot later switch in-UK.',        fee:'£115',                   baseFee:115,   ihsPerYear:0,    duration:'6 months',  toILR:null,                           accent:'#F97316', icon:Heart,        tab:'visit',       href:'/visa/visitor'           },
  { id:'ppe-visitor',      title:'Permitted Paid Engagement',blurb:'Up to 1 month for specific paid work (academic lecturing, creative, sport). No switch.',         fee:'£115',                   baseFee:115,   ihsPerYear:0,    duration:'1 month',   toILR:null,                           accent:'#EAB308', icon:Briefcase,    tab:'visit',       href:'/visa/visitor'           },
  { id:'transit',          title:'Direct Airside Transit',   blurb:'Pass through a UK airport without going through UK border control.',                             fee:'£64',                    baseFee:64,    ihsPerYear:0,    duration:'Transit',   toILR:null,                           accent:'#6B7280', icon:Plane,        tab:'visit',       href:'/visa/visitor'           },

  /* SETTLEMENT */
  { id:'ilr-5yr',          title:'ILR — 5-Year Route',       blurb:'Indefinite Leave to Remain after 5 yrs on Skilled Worker, Global Talent, Family or other.',     fee:'£2,885',                 baseFee:2885,  ihsPerYear:0,    duration:'Permanent', toILR:'This IS ILR',                  accent:'#10B981', icon:ShieldCheck,  tab:'settlement',  badge:'Popular', href:'/settlement'             },
  { id:'ilr-10yr',         title:'ILR — Long Residence (10yr)',blurb:'10 continuous years of lawful UK residence — any combination of visa categories counts.',      fee:'£2,885',                 baseFee:2885,  ihsPerYear:0,    duration:'Permanent', toILR:'This IS ILR',                  accent:'#059669', icon:Clock,        tab:'settlement',  href:'/settlement'             },
  { id:'ilr-family',       title:'ILR — Family Route',       blurb:'Settlement after 5 years on a Family (spouse / partner / child) visa.',                         fee:'£2,885',                 baseFee:2885,  ihsPerYear:0,    duration:'Permanent', toILR:'This IS ILR',                  accent:'#EC4899', icon:Heart,        tab:'settlement',  href:'/settlement'             },
  { id:'euss-settled',     title:'EU Settlement — Settled',  blurb:'EU/EEA/Swiss citizens with 5+ years UK residence before 31 Dec 2020. Equivalent to ILR.',      fee:'Free',                   baseFee:0,     ihsPerYear:0,    duration:'Permanent', toILR:'Equivalent to ILR',            accent:'#2563EB', icon:Flag,         tab:'settlement',  badge:'Free',    href:'/settlement'             },
  { id:'euss-presettled',  title:'EU Settlement — Pre-settled',blurb:'Under 5 years residence before cut-off. Must switch to Settled Status within 5 years.',       fee:'Free',                   baseFee:0,     ihsPerYear:0,    duration:'5 yr',      toILR:'Switch to Settled after 5 yr', accent:'#3B82F6', icon:Flag,         tab:'settlement',  badge:'Free',    href:'/settlement'             },

  /* CITIZENSHIP */
  { id:'naturalisation',   title:'British Naturalisation',   blurb:'British citizenship after ILR + 12 months residence. Life in the UK test + English req.',       fee:'£1,500',                 baseFee:1500,  ihsPerYear:0,    duration:'Permanent', toILR:'Citizenship',                  accent:'#7C3AED', icon:Crown,        tab:'citizenship', badge:'Popular', href:'/settlement'             },
  { id:'reg-child',        title:'Registration — Child',     blurb:'Children under 18 who are British by descent or have a British parent. Fee waivable in hardship.',fee:'£1,214',               baseFee:1214,  ihsPerYear:0,    duration:'Permanent', toILR:'Citizenship',                  accent:'#8B5CF6', icon:Baby,         tab:'citizenship', href:'/settlement'             },
  { id:'reg-adult',        title:'Registration — Adult',     blurb:'UK-born adults who are stateless, or British under special transitional or historic provisions.', fee:'£1,500',               baseFee:1500,  ihsPerYear:0,    duration:'Permanent', toILR:'Citizenship',                  accent:'#A78BFA', icon:User,         tab:'citizenship', href:'/settlement'             },
  { id:'bno-citizenship',  title:'BN(O) Pathway',            blurb:'HK BN(O) holders: 5yr residency → ILR → naturalisation → British passport in 6+ years.',        fee:'£180 → £2,885 → £1,500', baseFee:180,  ihsPerYear:1035, duration:'6+ yr',     toILR:'5 years (ILR) + 12m (citizenship)', accent:'#EC4899', icon:Flag, tab:'citizenship', href:'/settlement' },
  { id:'british-passport', title:'British Passport',         blurb:'Once naturalised or registered as British, apply for your British passport (10-year adult).',    fee:'£82.50 online',          baseFee:82,    ihsPerYear:0,    duration:'10 yr',     toILR:null,                           accent:'#DC2626', icon:ShieldCheck,  tab:'citizenship', badge:'Final step', href:'/settlement' },

  /* SPECIAL */
  { id:'uk-ancestry',      title:'UK Ancestry',              blurb:'Commonwealth citizens with a UK-born grandparent. 5 yr unrestricted work — leads to ILR.',       fee:'£632',                   baseFee:632,   ihsPerYear:1035, duration:'5 yr',      toILR:'5 years',                      accent:'#F59E0B', icon:Star,         tab:'special',     href:'/visa/ancestry'          },
  { id:'bno-visa',         title:'Hong Kong BN(O)',          blurb:'BN(O) status holders and close family. Work and live freely for 5yr, then ILR + citizenship.',   fee:'£180 (2yr) / £250 (5yr)',baseFee:180,   ihsPerYear:1035, duration:'5 yr',      toILR:'5 years',                      accent:'#EC4899', icon:Flag,         tab:'special',     badge:'New route', href:'/visa/bno'              },
  { id:'youth-mobility',   title:'Youth Mobility Scheme',    blurb:'18–30 from eligible countries (Australia, NZ, Canada, Japan etc.). 2yr open work. No sponsor.',  fee:'£298',                   baseFee:298,   ihsPerYear:1035, duration:'2 yr',      toILR:null,                           accent:'#06B6D4', icon:Plane,        tab:'special',     href:'/visa/youth-mobility'    },
  { id:'hpi',              title:'High Potential Individual',blurb:'Graduates of top 50 global universities (within 5 years). 2yr open work in the UK. No sponsor.', fee:'£822',                   baseFee:822,   ihsPerYear:1035, duration:'2 yr',      toILR:null,                           accent:'#8B5CF6', icon:Zap,          tab:'special',     href:'/visa/hpi'               },
  { id:'ukraine-family',   title:'Ukraine Family Scheme',    blurb:'Immediate or extended family of British nationals in Ukraine. Indefinite permission to stay.',    fee:'Free',                   baseFee:0,     ihsPerYear:0,    duration:'3 yr',      toILR:null,                           accent:'#F59E0B', icon:Heart,        tab:'special',     badge:'Free',    href:'/visa/ukraine'           },
  { id:'homes-ukraine',    title:'Homes for Ukraine',        blurb:'Ukrainian individuals with a named sponsor host in the UK.',                                       fee:'Free',                   baseFee:0,     ihsPerYear:0,    duration:'3 yr',      toILR:null,                           accent:'#3B82F6', icon:Home,         tab:'special',     badge:'Free',    href:'/visa/ukraine'           },
];

/* ─── COUNTRIES ─── */
interface Country { flag: string; name: string; code: string; tbTest: boolean; visaRequired: boolean; vacCities: string; }
const COUNTRIES: Country[] = [
  { flag:'🇮🇳', name:'India',         code:'india',        tbTest:true,  visaRequired:true,  vacCities:'Delhi, Mumbai, Chennai, Kolkata, Hyderabad, Pune, Chandigarh' },
  { flag:'🇳🇬', name:'Nigeria',       code:'nigeria',      tbTest:true,  visaRequired:true,  vacCities:'Lagos, Abuja' },
  { flag:'🇵🇰', name:'Pakistan',      code:'pakistan',     tbTest:true,  visaRequired:true,  vacCities:'Islamabad, Karachi, Lahore' },
  { flag:'🇵🇭', name:'Philippines',   code:'philippines',  tbTest:true,  visaRequired:true,  vacCities:'Manila, Cebu' },
  { flag:'🇧🇩', name:'Bangladesh',    code:'bangladesh',   tbTest:true,  visaRequired:true,  vacCities:'Dhaka, Sylhet' },
  { flag:'🇨🇳', name:'China',         code:'china',        tbTest:true,  visaRequired:true,  vacCities:'Beijing, Shanghai, Guangzhou, Chengdu' },
  { flag:'🇰🇪', name:'Kenya',         code:'kenya',        tbTest:true,  visaRequired:true,  vacCities:'Nairobi' },
  { flag:'🇬🇭', name:'Ghana',         code:'ghana',        tbTest:true,  visaRequired:true,  vacCities:'Accra' },
  { flag:'🇱🇰', name:'Sri Lanka',     code:'sri-lanka',    tbTest:true,  visaRequired:true,  vacCities:'Colombo' },
  { flag:'🇳🇵', name:'Nepal',         code:'nepal',        tbTest:true,  visaRequired:true,  vacCities:'Kathmandu' },
  { flag:'🇿🇼', name:'Zimbabwe',      code:'zimbabwe',     tbTest:true,  visaRequired:true,  vacCities:'Harare' },
  { flag:'🇹🇿', name:'Tanzania',      code:'tanzania',     tbTest:true,  visaRequired:true,  vacCities:'Dar es Salaam' },
  { flag:'🇹🇷', name:'Turkey',        code:'turkey',       tbTest:true,  visaRequired:true,  vacCities:'Istanbul, Ankara' },
  { flag:'🇪🇬', name:'Egypt',         code:'egypt',        tbTest:true,  visaRequired:true,  vacCities:'Cairo' },
  { flag:'🇺🇸', name:'USA',           code:'usa',          tbTest:false, visaRequired:false, vacCities:'Online only (no biometrics for visitors)' },
  { flag:'🇨🇦', name:'Canada',        code:'canada',       tbTest:false, visaRequired:false, vacCities:'Online only (visitors)' },
  { flag:'🇦��', name:'Australia',     code:'australia',    tbTest:false, visaRequired:false, vacCities:'Online only (visitors)' },
  { flag:'🇭🇰', name:'Hong Kong',     code:'hong-kong',    tbTest:false, visaRequired:false, vacCities:'Hong Kong' },
  { flag:'🇿🇦', name:'South Africa',  code:'south-africa', tbTest:false, visaRequired:false, vacCities:'Cape Town, Johannesburg' },
  { flag:'🇧��', name:'Brazil',        code:'brazil',       tbTest:false, visaRequired:false, vacCities:'Online only (visitors)' },
  { flag:'🇺🇦', name:'Ukraine',       code:'ukraine',      tbTest:false, visaRequired:false, vacCities:'Online' },
  { flag:'🇯🇵', name:'Japan',         code:'japan',        tbTest:false, visaRequired:false, vacCities:'Tokyo, Osaka' },
];

/* ─── HELPER ─── */
function fmt(n: number) { return '£' + n.toLocaleString('en-GB'); }

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function VisaHubClient() {
  const [activeTab,          setActiveTab]          = useState<TabId>('work');
  const [selectedCountry,    setSelectedCountry]    = useState<Country | null>(null);
  const [calcVisaId,         setCalcVisaId]         = useState('skilled-worker');
  const [calcDependants,     setCalcDependants]     = useState(0);
  const [calcYears,          setCalcYears]          = useState(3);
  const [calcPriority,       setCalcPriority]       = useState(false);
  const [calcSuperPriority,  setCalcSuperPriority]  = useState(false);
  const [showCalc,           setShowCalc]           = useState(false);
  const [showCountries,      setShowCountries]      = useState(false);

  const tabRoutes = useMemo(() => ROUTES.filter(r => r.tab === activeTab), [activeTab]);
  const activeTabMeta = TABS.find(t => t.id === activeTab)!;

  /* Cost calc */
  const calcResult = useMemo(() => {
    const route = ROUTES.find(r => r.id === calcVisaId);
    if (!route) return null;
    const isStudent = calcVisaId === 'student' || calcVisaId === 'child-student';
    const ihsRate = isStudent ? 776 : route.ihsPerYear;
    const mainFee   = route.baseFee;
    const depFee    = route.baseFee * calcDependants;
    const ihs       = ihsRate * calcYears * (1 + calcDependants);
    const priority  = calcPriority ? 500 : 0;
    const superprio = calcSuperPriority ? 800 : 0;
    const total     = mainFee + depFee + ihs + priority + superprio;
    return { mainFee, depFee, ihs, priority, superprio, total, ihsWaived: ihsRate === 0 };
  }, [calcVisaId, calcDependants, calcYears, calcPriority, calcSuperPriority]);

  return (
    <div className="bg-white">

      {/* ── HERO ── */}
      <section className="bg-[#0A2540] text-white py-16 md:py-20 relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage:'linear-gradient(to right,rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.4) 1px,transparent 1px)', backgroundSize:'56px 56px' }} />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5EEAD9] mb-4" style={{fontFamily:'Inter,sans-serif'}}>
              <Globe className="inline w-3 h-3 mr-1.5 -mt-0.5" />
              Complete UK visa directory &middot; gov.uk verified &middot; 2026
            </p>
            <h1 className="font-bold tracking-[-0.025em] leading-[1.1]" style={{fontFamily:'"Plus Jakarta Sans",Inter,sans-serif', fontSize:'clamp(2rem,5vw,3.25rem)'}}>
              Every UK visa route.<br className="hidden sm:block" /> One place.
            </h1>
            <p className="mt-5 text-[15.5px] md:text-[17px] text-[#bcc5e9] leading-[1.6] max-w-2xl" style={{fontFamily:'Inter,sans-serif'}}>
              35+ routes covering work, study, family, settlement and British citizenship &mdash; with an interactive cost calculator and country-specific guidance.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/eligibility" className="inline-flex items-center gap-2 bg-[#00C4B4] hover:bg-[#00d4c3] text-[#0A2540] text-[14px] font-bold px-5 py-3 rounded-xl transition-colors" style={{fontFamily:'Inter,sans-serif'}}>
                <Target className="w-4 h-4" /> Find my visa route
              </Link>
              <button onClick={() => { setShowCalc(true); document.getElementById('calc-section')?.scrollIntoView({behavior:'smooth'}); }} className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[14px] font-semibold px-5 py-3 rounded-xl transition-colors" style={{fontFamily:'Inter,sans-serif'}}>
                <Calculator className="w-4 h-4" /> Calculate costs
              </button>
              <button onClick={() => { setShowCountries(true); document.getElementById('country-section')?.scrollIntoView({behavior:'smooth'}); }} className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[14px] font-semibold px-5 py-3 rounded-xl transition-colors" style={{fontFamily:'Inter,sans-serif'}}>
                <MapPin className="w-4 h-4" /> Applying from my country
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-10 md:mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 border-t border-white/15">
            {[
              { n:'35+',    l:'Visa routes' },
              { n:'270',    l:'SOC codes' },
              { n:'126,530',l:'Licensed sponsors' },
              { n:'100%',   l:'gov.uk sourced' },
            ].map(s => (
              <div key={s.l}>
                <div className="font-bold tabular-nums tracking-[-0.02em]" style={{fontFamily:'"Plus Jakarta Sans",Inter,sans-serif', fontSize:'clamp(1.4rem,3vw,2rem)'}}>{s.n}</div>
                <div className="text-[12.5px] text-[#8ba3c2] mt-0.5" style={{fontFamily:'Inter,sans-serif'}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TAB NAV ── */}
      <div className="sticky top-[68px] z-20 bg-white/95 backdrop-blur-sm border-b border-[#E5E7EB] shadow-[0_1px_8px_-2px_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-2.5 overflow-x-auto">
            {TABS.map(t => {
              const TIcon = t.icon;
              const active = activeTab === t.id;
              const count = ROUTES.filter(r => r.tab === t.id).length;
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-semibold transition-all duration-100 ${active ? 'text-white shadow-sm' : 'text-[#45464d] hover:bg-[#f3f4f5]'}`}
                  style={active ? {background: t.accent, fontFamily:'Inter,sans-serif'} : {fontFamily:'Inter,sans-serif'}}
                >
                  <TIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.label}</span>
                  <span className="sm:hidden">{t.label.split(' ')[0]}</span>
                  <span className={`text-[11px] font-normal tabular-nums ${active ? 'opacity-70' : 'text-[#a5a6ad]'}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── VISA GRID ── */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-7">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#76777e] mb-1.5" style={{fontFamily:'Inter,sans-serif'}}>
                {(() => { const TabIcon = activeTabMeta.icon; return <TabIcon className="inline w-3 h-3 mr-1 -mt-0.5" />; })()}
                {activeTabMeta.label} routes
              </p>
              <h2 className="font-bold text-[#0A2540] tracking-[-0.015em]" style={{fontFamily:'"Plus Jakarta Sans",Inter,sans-serif', fontSize:'clamp(1.4rem,3vw,1.875rem)', lineHeight:'1.15'}}>
                {tabRoutes.length} {activeTabMeta.label.toLowerCase()} visa{tabRoutes.length !== 1 ? 's' : ''} & routes
              </h2>
            </div>
            <Link href="/eligibility" className="hidden md:inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0A2540] hover:underline" style={{fontFamily:'Inter,sans-serif'}}>
              Not sure which? Take the quiz <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            {tabRoutes.map(route => <VisaCard key={route.id} r={route} />)}
          </div>

          {(activeTab === 'work' || activeTab === 'family' || activeTab === 'study') && (
            <div className="mt-6 p-4 bg-[#fafbfc] border border-[#E5E7EB] rounded-xl flex flex-wrap items-center justify-between gap-3">
              <p className="text-[13px] text-[#45464d]" style={{fontFamily:'Inter,sans-serif'}}>
                <strong className="text-[#0A2540]">Not sure which route fits?</strong> Our 60-second eligibility quiz asks about your job, nationality and situation.
              </p>
              <Link href="/eligibility" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white bg-[#0A2540] hover:bg-[#1a3a5c] px-4 py-2 rounded-lg transition-colors" style={{fontFamily:'Inter,sans-serif'}}>
                Take the quiz <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── COST CALCULATOR ── */}
      <section id="calc-section" className="py-14 md:py-18 bg-[#fafbfc] border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#76777e] mb-2" style={{fontFamily:'Inter,sans-serif'}}>
                <Calculator className="inline w-3 h-3 mr-1.5 -mt-0.5" />
                Advanced cost calculator
              </p>
              <h2 className="font-bold text-[#0A2540] tracking-[-0.015em]" style={{fontFamily:'"Plus Jakarta Sans",Inter,sans-serif', fontSize:'clamp(1.4rem,3vw,1.875rem)', lineHeight:'1.15'}}>
                Total visa cost — fee + IHS + extras.
              </h2>
              <p className="mt-2 text-[14px] text-[#76777e]" style={{fontFamily:'Inter,sans-serif'}}>
                Home Office fees, Immigration Health Surcharge and priority services. All 2026 rates.
              </p>
            </div>
            <Link href="/tools/cost-calculator" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0A2540] hover:underline" style={{fontFamily:'Inter,sans-serif'}}>
              Full cost calculator <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Inputs */}
            <div className="lg:col-span-3 bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-8 space-y-6">

              {/* Visa selector */}
              <div>
                <label className="block text-[12px] font-bold uppercase tracking-[0.08em] text-[#76777e] mb-2" style={{fontFamily:'Inter,sans-serif'}}>Visa route</label>
                <div className="relative">
                  <select value={calcVisaId} onChange={e => setCalcVisaId(e.target.value)}
                    className="w-full appearance-none bg-[#f9fafb] border border-[#E5E7EB] rounded-xl px-4 py-3 text-[14px] font-semibold text-[#0A2540] outline-none focus:border-[#0A2540] pr-10"
                    style={{fontFamily:'Inter,sans-serif'}}>
                    {TABS.map(tab => (
                      <optgroup key={tab.id} label={tab.label.toUpperCase()}>
                        {ROUTES.filter(r => r.tab === tab.id).map(r => (
                          <option key={r.id} value={r.id}>{r.title}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#76777e] pointer-events-none" />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-[12px] font-bold uppercase tracking-[0.08em] text-[#76777e] mb-2" style={{fontFamily:'Inter,sans-serif'}}>Visa duration (years)</label>
                <div className="flex gap-2 flex-wrap">
                  {[1,2,3,5].map(y => (
                    <button key={y} onClick={() => setCalcYears(y)}
                      className={`px-4 py-2.5 rounded-xl text-[13.5px] font-semibold border transition-colors ${calcYears === y ? 'bg-[#0A2540] text-white border-[#0A2540]' : 'bg-white text-[#45464d] border-[#E5E7EB] hover:border-[#0A2540]'}`}
                      style={{fontFamily:'Inter,sans-serif'}}>
                      {y} yr
                    </button>
                  ))}
                </div>
              </div>

              {/* Dependants */}
              <div>
                <label className="block text-[12px] font-bold uppercase tracking-[0.08em] text-[#76777e] mb-2" style={{fontFamily:'Inter,sans-serif'}}>Dependants (partners + children)</label>
                <div className="flex items-center gap-4">
                  <button onClick={() => setCalcDependants(d => Math.max(0, d-1))} className="w-9 h-9 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#0A2540] hover:bg-[#f3f4f5] transition-colors"><Minus className="w-3.5 h-3.5" /></button>
                  <span className="w-8 text-center font-bold text-[18px] text-[#0A2540] tabular-nums" style={{fontFamily:'"Plus Jakarta Sans",Inter,sans-serif'}}>{calcDependants}</span>
                  <button onClick={() => setCalcDependants(d => Math.min(6, d+1))} className="w-9 h-9 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#0A2540] hover:bg-[#f3f4f5] transition-colors"><Plus className="w-3.5 h-3.5" /></button>
                  {calcDependants > 0 && <span className="text-[12.5px] text-[#76777e]" style={{fontFamily:'Inter,sans-serif'}}>{calcDependants} person{calcDependants > 1 ? 's' : ''} included</span>}
                </div>
              </div>

              {/* Add-ons */}
              <div>
                <label className="block text-[12px] font-bold uppercase tracking-[0.08em] text-[#76777e] mb-3" style={{fontFamily:'Inter,sans-serif'}}>Optional add-ons</label>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={calcPriority} onChange={e => { setCalcPriority(e.target.checked); if(e.target.checked) setCalcSuperPriority(false); }} className="w-4 h-4 accent-[#0A2540]" />
                    <div>
                      <span className="text-[13.5px] font-semibold text-[#0A2540]" style={{fontFamily:'Inter,sans-serif'}}>Priority service</span>
                      <span className="ml-2 text-[12px] text-[#76777e]">+£500 · 5 working days</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={calcSuperPriority} onChange={e => { setCalcSuperPriority(e.target.checked); if(e.target.checked) setCalcPriority(false); }} className="w-4 h-4 accent-[#0A2540]" />
                    <div>
                      <span className="text-[13.5px] font-semibold text-[#0A2540]" style={{fontFamily:'Inter,sans-serif'}}>Super priority service</span>
                      <span className="ml-2 text-[12px] text-[#76777e]">+£800 · next working day</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-2 bg-[#0A2540] text-white rounded-2xl p-6 md:p-8 flex flex-col">
              <div className="text-[11.5px] font-bold uppercase tracking-[0.1em] text-[#5EEAD9] mb-5" style={{fontFamily:'Inter,sans-serif'}}>
                Cost breakdown
              </div>

              {calcResult ? (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <CostRow label="Main applicant fee"    value={fmt(calcResult.mainFee)} />
                    {calcDependants > 0 && <CostRow label={`Dependant fees (×${calcDependants})`} value={fmt(calcResult.depFee)} />}
                    <CostRow
                      label={calcResult.ihsWaived ? 'IHS — waived ✓' : `IHS (${calcYears}yr × ${1+calcDependants} person${calcDependants>0?'s':''})`}
                      value={calcResult.ihsWaived ? '£0' : fmt(calcResult.ihs)}
                      note={calcResult.ihsWaived ? 'Health & Care route' : undefined}
                    />
                    {calcResult.priority > 0   && <CostRow label="Priority service"       value={fmt(calcResult.priority)}   />}
                    {calcResult.superprio > 0  && <CostRow label="Super priority service" value={fmt(calcResult.superprio)}  />}
                  </div>

                  <div className="mt-6 pt-5 border-t border-white/15">
                    <div className="flex items-end justify-between">
                      <span className="text-[13px] text-[#8ba3c2]" style={{fontFamily:'Inter,sans-serif'}}>Estimated total</span>
                    </div>
                    <div className="font-bold tabular-nums tracking-[-0.02em] mt-1" style={{fontFamily:'"Plus Jakarta Sans",Inter,sans-serif', fontSize:'clamp(1.8rem,4vw,2.5rem)'}}>
                      {fmt(calcResult.total)}
                    </div>
                    <p className="text-[11.5px] text-[#8ba3c2] mt-2 leading-snug" style={{fontFamily:'Inter,sans-serif'}}>
                      Estimate only. Biometric fee (£19.20/person), courier, translation and legal costs not included.
                    </p>
                    <Link href="/tools/cost-calculator" className="mt-5 inline-flex w-full items-center justify-center gap-2 text-[13.5px] font-semibold text-[#0A2540] bg-[#5EEAD9] hover:bg-[#7BEFE0] px-4 py-2.5 rounded-xl transition-colors" style={{fontFamily:'Inter,sans-serif'}}>
                      Full cost calculator <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-[#8ba3c2] text-[13px]">Select a visa route above</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── SETTLEMENT PATHWAY ── */}
      <section className="py-14 md:py-18">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#76777e] mb-2" style={{fontFamily:'Inter,sans-serif'}}>
              <ShieldCheck className="inline w-3 h-3 mr-1.5 -mt-0.5" />
              The settlement pathway
            </p>
            <h2 className="font-bold text-[#0A2540] tracking-[-0.015em]" style={{fontFamily:'"Plus Jakarta Sans",Inter,sans-serif', fontSize:'clamp(1.4rem,3vw,1.875rem)', lineHeight:'1.15'}}>
              From visa to British passport.
            </h2>
          </div>

          <div className="overflow-x-auto pb-3">
            <div className="flex items-stretch gap-0 min-w-[640px]">
              {[
                { step:'1', title:'Entry visa', desc:'Skilled Worker, Student, Family, BN(O) or other qualifying route', accent:'#00C4B4', icon:Plane },
                { step:'2', title:'5 years (most routes)', desc:'Continuous lawful residence. Annual salary must stay above threshold.', accent:'#2563EB', icon:Clock },
                { step:'3', title:'ILR — Settlement', desc:'Indefinite Leave to Remain. Permanent right to live and work in the UK.', accent:'#10B981', icon:ShieldCheck },
                { step:'4', title:'12 months with ILR', desc:'Continue to live in the UK. Language & Life in the UK test required.', accent:'#7C3AED', icon:Star },
                { step:'5', title:'British Citizenship', desc:'Naturalisation or registration. Apply for British passport (10 yr).', accent:'#C9A14A', icon:Crown },
              ].map((s, i) => (
                <div key={s.step} className="flex items-stretch gap-0 flex-1 min-w-0">
                  <div className="flex-1 bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col gap-3 relative">
                    <span className="inline-flex w-9 h-9 rounded-xl items-center justify-center flex-shrink-0" style={{background:`${s.accent}14`, color:s.accent}}>
                      <s.icon className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#76777e] mb-0.5" style={{fontFamily:'Inter,sans-serif'}}>Step {s.step}</div>
                      <h3 className="font-bold text-[14px] text-[#0A2540] leading-snug" style={{fontFamily:'"Plus Jakarta Sans",Inter,sans-serif'}}>{s.title}</h3>
                      <p className="mt-1 text-[12px] text-[#76777e] leading-snug" style={{fontFamily:'Inter,sans-serif'}}>{s.desc}</p>
                    </div>
                  </div>
                  {i < 4 && (
                    <div className="flex items-center px-2 flex-shrink-0">
                      <ArrowRight className="w-4 h-4 text-[#a5a6ad]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/settlement" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0A2540] hover:underline" style={{fontFamily:'Inter,sans-serif'}}>
              Settlement comparison guide <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/ihs-calculator" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#76777e] hover:text-[#0A2540] hover:underline" style={{fontFamily:'Inter,sans-serif'}}>
              IHS calculator <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── COUNTRY SECTION ── */}
      <section id="country-section" className="py-14 md:py-18 bg-[#fafbfc] border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#76777e] mb-2" style={{fontFamily:'Inter,sans-serif'}}>
                <MapPin className="inline w-3 h-3 mr-1.5 -mt-0.5" />
                By nationality
              </p>
              <h2 className="font-bold text-[#0A2540] tracking-[-0.015em]" style={{fontFamily:'"Plus Jakarta Sans",Inter,sans-serif', fontSize:'clamp(1.4rem,3vw,1.875rem)', lineHeight:'1.15'}}>
                Applying from your country.
              </h2>
              <p className="mt-2 text-[14px] text-[#76777e]" style={{fontFamily:'Inter,sans-serif'}}>
                TB test requirement, VAC locations and country-specific notes.
              </p>
            </div>
            <Link href="/from" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0A2540] hover:underline" style={{fontFamily:'Inter,sans-serif'}}>
              All country guides <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-5">
            {COUNTRIES.map(c => (
              <button key={c.code} onClick={() => setSelectedCountry(selectedCountry?.code === c.code ? null : c)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all ${selectedCountry?.code === c.code ? 'bg-[#0A2540] text-white border-[#0A2540]' : 'bg-white border-[#E5E7EB] hover:border-[#0A2540] text-[#0A2540]'}`}>
                <span className="text-[18px] leading-none flex-shrink-0">{c.flag}</span>
                <span className="text-[12.5px] font-semibold truncate" style={{fontFamily:'Inter,sans-serif'}}>{c.name}</span>
              </button>
            ))}
          </div>

          {selectedCountry && (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[2.5rem] leading-none">{selectedCountry.flag}</span>
                  <div>
                    <h3 className="font-bold text-[#0A2540] text-[18px]" style={{fontFamily:'"Plus Jakarta Sans",Inter,sans-serif'}}>{selectedCountry.name}</h3>
                    <p className="text-[12.5px] text-[#76777e]" style={{fontFamily:'Inter,sans-serif'}}>Country-specific visa notes</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoPill
                    ok={!selectedCountry.visaRequired}
                    label={selectedCountry.visaRequired ? 'Visitor visa required' : 'Visa-free visiting'}
                    desc={selectedCountry.visaRequired ? 'Apply for Standard Visitor visa before travelling.' : 'No visa needed for short visits (up to 6 months).'}
                  />
                  <InfoPill
                    ok={!selectedCountry.tbTest}
                    label={selectedCountry.tbTest ? 'TB test required' : 'No TB test required'}
                    desc={selectedCountry.tbTest ? 'Book a UK-approved TB test at an approved clinic before applying.' : 'No tuberculosis test needed for your application.'}
                  />
                </div>
              </div>
              <div className="bg-[#fafbfc] rounded-xl p-5 border border-[#E5E7EB]">
                <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#76777e] mb-3" style={{fontFamily:'Inter,sans-serif'}}>VAC / Application centres</div>
                <p className="text-[13px] text-[#0A2540] leading-relaxed font-medium" style={{fontFamily:'Inter,sans-serif'}}>{selectedCountry.vacCities}</p>
                <Link href={`/from/${selectedCountry.code}`} className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#00C4B4] hover:underline" style={{fontFamily:'Inter,sans-serif'}}>
                  Full {selectedCountry.name} guide <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
          {!selectedCountry && (
            <p className="text-[13px] text-[#a5a6ad] text-center py-4" style={{fontFamily:'Inter,sans-serif'}}>Select a country above to see TB test requirement, visa rules and VAC locations.</p>
          )}
        </div>
      </section>

      {/* ── TOOLS STRIP ── */}
      <section className="py-14 md:py-18">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#76777e] mb-2" style={{fontFamily:'Inter,sans-serif'}}>
            <Sparkles className="inline w-3 h-3 mr-1.5 -mt-0.5" />
            Visa tools
          </p>
          <h2 className="font-bold text-[#0A2540] tracking-[-0.015em] mb-8" style={{fontFamily:'"Plus Jakarta Sans",Inter,sans-serif', fontSize:'clamp(1.4rem,3vw,1.875rem)', lineHeight:'1.15'}}>
            Run the numbers on your route.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {[
              { href:'/eligibility',             accent:'#00C4B4', icon:Target,     title:'Eligibility quiz',            desc:'Answer 5 questions — get your matched visa route in 60 seconds.' },
              { href:'/tools/cost-calculator',   accent:'#C9A14A', icon:Calculator, title:'Visa cost calculator',        desc:'Home Office fees + IHS + priority service for any route.' },
              { href:'/tools/salary-checker',    accent:'#2563EB', icon:Briefcase,  title:'SOC salary checker',          desc:'Going rates for all 270 SOC occupations used by Skilled Worker.' },
              { href:'/tools/sponsor-search',    accent:'#0A2540', icon:Building2,  title:'Sponsor licence search',      desc:'126,530 licensed UK employers. Search by name, sector, postcode.' },
              { href:'/ihs-calculator',          accent:'#E11D48', icon:ShieldCheck,title:'IHS calculator',              desc:'Immigration Health Surcharge: standard £1,035/yr or £776/yr (students).' },
              { href:'/skilled-worker-points-check', accent:'#7C3AED', icon:Star,   title:'Skilled Worker points check', desc:'70-point test: salary, job type, English, shortage occupation.' },
            ].map(t => (
              <Link key={t.href} href={t.href}
                className="group bg-white border border-[#E5E7EB] rounded-xl p-5 hover:border-[#0A2540] hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-8px_rgba(16,26,54,0.15)] transition-all duration-150">
                <span className="inline-flex w-11 h-11 rounded-xl items-center justify-center mb-4" style={{background:`${t.accent}14`,color:t.accent}}>
                  <t.icon className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-[#0A2540] text-[15px] tracking-[-0.005em]" style={{fontFamily:'"Plus Jakarta Sans",Inter,sans-serif'}}>{t.title}</h3>
                <p className="mt-1.5 text-[12.5px] text-[#45464d] leading-snug" style={{fontFamily:'Inter,sans-serif'}}>{t.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#0A2540] group-hover:gap-2 transition-[gap] duration-100" style={{fontFamily:'Inter,sans-serif'}}>
                  Open <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ELIGIBILITY CTA ── */}
      <section className="py-14 md:py-16 border-t border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#0A2540] to-[#13325F] rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
            <div aria-hidden="true" className="absolute inset-0 opacity-[0.10] pointer-events-none" style={{backgroundImage:'linear-gradient(to right,rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.4) 1px,transparent 1px)',backgroundSize:'56px 56px'}} />
            <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5EEAD9] mb-3" style={{fontFamily:'Inter,sans-serif'}}>
                  <Sparkles className="inline w-3 h-3 mr-1 -mt-0.5" /> 60-second quiz
                </p>
                <h2 className="font-bold tracking-[-0.015em] leading-[1.15]" style={{fontFamily:'"Plus Jakarta Sans",Inter,sans-serif', fontSize:'clamp(1.5rem,3.2vw,2.1rem)'}}>
                  Not sure which visa? The quiz finds your route.
                </h2>
                <p className="mt-3 text-[14.5px] text-[#bcc5e9] leading-[1.6] max-w-xl" style={{fontFamily:'Inter,sans-serif'}}>
                  Tell us your nationality, what you want to do in the UK, and whether you have a job offer. We&rsquo;ll match you to the right route and link the gov.uk reference.
                </p>
              </div>
              <Link href="/eligibility" className="inline-flex items-center justify-center gap-2 text-[14px] font-semibold text-[#0A2540] bg-[#5EEAD9] hover:bg-[#7BEFE0] px-6 py-3.5 rounded-xl active:scale-[0.98] transition-all duration-100 flex-shrink-0 whitespace-nowrap" style={{fontFamily:'Inter,sans-serif'}}>
                Start eligibility quiz <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── SUBCOMPONENTS ── */

function VisaCard({ r }: { r: VisaRoute }) {
  const Icon = r.icon;
  const badgeColors: Record<string, string> = {
    'Popular':    '#F59E0B',
    'IHS Waived': '#10B981',
    'Free':       '#10B981',
    'New route':  '#7C3AED',
    'Final step': '#DC2626',
  };
  const badgeColor = r.badge ? (badgeColors[r.badge] ?? '#6B7280') : null;
  return (
    <Link href={r.href}
      className="group relative bg-white border border-[#E5E7EB] rounded-xl p-5 hover:border-[#0A2540] hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-8px_rgba(16,26,54,0.15)] transition-all duration-150 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <span className="inline-flex w-11 h-11 rounded-xl items-center justify-center flex-shrink-0" style={{background:`${r.accent}14`,color:r.accent}}>
          <Icon className="w-5 h-5" />
        </span>
        {r.badge && badgeColor && (
          <span className="inline-flex items-center text-[9.5px] font-bold uppercase tracking-[0.07em] px-2 py-0.5 rounded-full flex-shrink-0" style={{background:`${badgeColor}14`,color:badgeColor,fontFamily:'Inter,sans-serif'}}>
            {r.badge}
          </span>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-[#0A2540] text-[15px] md:text-[15.5px] tracking-[-0.005em] leading-snug" style={{fontFamily:'"Plus Jakarta Sans",Inter,sans-serif'}}>{r.title}</h3>
        <p className="mt-1.5 text-[12px] text-[#45464d] leading-[1.5]" style={{fontFamily:'Inter,sans-serif'}}>{r.blurb}</p>
      </div>
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#F3F4F6]">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#76777e]" style={{fontFamily:'Inter,sans-serif'}}>Fee</span>
          <div className="font-bold text-[13px] text-[#0A2540] tabular-nums" style={{fontFamily:'"Plus Jakarta Sans",Inter,sans-serif'}}>{r.fee}</div>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#76777e]" style={{fontFamily:'Inter,sans-serif'}}>ILR path</span>
          <div className="font-semibold text-[12px] text-[#0A2540]" style={{fontFamily:'Inter,sans-serif'}}>{r.toILR ?? '—'}</div>
        </div>
      </div>
      <span className="mt-1 inline-flex items-center gap-1 text-[12px] font-semibold group-hover:gap-2 transition-[gap] duration-100" style={{color:r.accent,fontFamily:'Inter,sans-serif'}}>
        View route <ArrowRight className="w-3.5 h-3.5" />
      </span>
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-t-xl" style={{background:r.accent}} />
    </Link>
  );
}

function CostRow({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <span className="text-[13px] text-white/80" style={{fontFamily:'Inter,sans-serif'}}>{label}</span>
        {note && <div className="text-[10.5px] text-[#5EEAD9] mt-0.5" style={{fontFamily:'Inter,sans-serif'}}>{note}</div>}
      </div>
      <span className="font-bold text-[14px] text-white tabular-nums flex-shrink-0" style={{fontFamily:'"Plus Jakarta Sans",Inter,sans-serif'}}>{value}</span>
    </div>
  );
}

function InfoPill({ ok, label, desc }: { ok: boolean; label: string; desc: string }) {
  return (
    <div className={`rounded-xl p-4 border ${ok ? 'bg-[#f0fdf4] border-[#86efac]' : 'bg-[#fef9ec] border-[#fcd34d]'}`}>
      <div className="flex items-center gap-2 mb-1">
        {ok ? <CheckCircle2 className="w-4 h-4 text-[#16a34a] flex-shrink-0" /> : <XCircle className="w-4 h-4 text-[#d97706] flex-shrink-0" />}
        <span className="text-[13px] font-bold text-[#0A2540]" style={{fontFamily:'"Plus Jakarta Sans",Inter,sans-serif'}}>{label}</span>
      </div>
      <p className="text-[12px] text-[#45464d] leading-snug pl-6" style={{fontFamily:'Inter,sans-serif'}}>{desc}</p>
    </div>
  );
}
