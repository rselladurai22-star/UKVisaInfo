'use client';

import Link from 'next/link';
import {
  ChevronRight,
  ArrowRight,
  Briefcase,
  HeartPulse,
  GraduationCap,
  Award,
  Users,
  Lightbulb,
  Flag,
  TrendingUp,
  Plane,
  Calculator,
  CheckCircle2,
  BadgePoundSterling,
  Search,
  Calendar,
  LandmarkIcon,
  ShieldCheck,
  Globe,
  UserPlus,
  Clock,
  ArrowUpRight,
  Layers,
} from 'lucide-react';

export default function ImmigrationHub() {
  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* Breadcrumbs & Title Section */}
      <section className="container-page pt-10 pb-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <Link href="/tools" className="hover:text-primary transition-colors">All Tools</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <span className="text-primary font-bold">Immigration</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-on-surface">
          Immigration & Visas Hub
        </h1>
        <p className="mt-3 text-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Navigate the UK immigration landscape with precision. Access route hubs, eligibility parameters, fee calculators, and sponsor validation resources.
        </p>
      </section>

      {/* Hero Section: Visa Eligibility Quiz */}
      <section className="container-page pb-12">
        <div className="relative rounded-2xl overflow-hidden h-[400px] flex items-center shadow-lg border border-outline-variant/50">
          <img
            alt="Immigration Hub"
            className="absolute inset-0 w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMnKTIfTqMpVsNEd94jf8daByEHR3VXI_PO4lp9GETn0jP2XjuYVND6zBBqScD39Hkc_qAMareZkefTt4x-bBhxo3jWDEtsKH6Ni5v2JQ9cHJRoXs-wRT4EqUAbc8xXZdagxEalSl-Z0lk7iQOZYVq44hV4dt7JTzaWVB20uMNS_KCpN95cjmrfIEwD-bmGK1F8KZzEh_G3Ec8IBc2pNjEi616LX0R5YS3A3PE6USjBwmmxPnHI6WDXDJqv4l20KqWXo6zM1qcSck"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-on-surface/90 via-on-surface/70 to-transparent"></div>
          <div className="relative z-10 px-8 md:px-12 max-w-2xl text-white">
            <span className="bg-[#006c49] text-white px-3 py-1 rounded-full font-bold text-[10px] tracking-wider mb-4 inline-block uppercase">
              GOV.UK DATA INTEGRATED
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Visa Eligibility Quiz
            </h2>
            <p className="text-base text-gray-200/90 mb-8 leading-relaxed">
              Find the most suitable visa route for your professional or personal journey. Answer a few questions about your destination, nationality, and circumstances.
            </p>
            <Link
              href="/eligibility"
              className="inline-flex items-center gap-2 bg-[#0037b0] hover:bg-[#1d4ed8] text-white px-6 py-3.5 rounded-lg font-bold transition-all group shadow-md"
            >
              Start Eligibility Quiz
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Route Hubs (Bento Layout) */}
      <section className="container-page pb-12">
        <h3 className="text-xl sm:text-2xl font-display font-extrabold mb-6 flex items-center gap-2 border-b border-outline-variant pb-4">
          <Layers className="h-6 w-6 text-primary" />
          Route Hubs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Featured Skilled Worker Card (Col span 2) */}
          <div className="col-span-1 md:col-span-2 bg-surface-container-low p-6 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all border border-outline-variant/60 group">
            <div>
              <div className="flex justify-between items-start mb-6">
                <span className="p-3 bg-primary/10 rounded-xl text-primary border border-primary-soft/35">
                  <Briefcase className="h-6 w-6" />
                </span>
                <span className="text-[10px] font-bold text-[#747686] uppercase tracking-widest bg-white border border-[#c4c5d7]/50 px-2 py-0.5 rounded">
                  Official Source
                </span>
              </div>
              <h4 className="font-display text-2xl font-bold mb-2">Skilled Worker</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed max-w-md">
                The primary route for qualified professionals with a job offer from a licensed sponsor in the UK.
              </p>
            </div>
            <Link
              href="/visa/skilled-worker"
              className="mt-8 flex items-center text-primary font-bold text-sm tracking-wider uppercase group-hover:text-primary-container transition-colors"
            >
              EXPLORE ROUTE <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Health & Care */}
          <RouteCard
            title="Health & Care"
            description="Fast-track entry for eligible medical and health professionals."
            badge="Gov.uk Data"
            href="/visa/health-care-worker"
            Icon={HeartPulse}
            colorClass="text-secondary bg-secondary/10 border-secondary/20"
          />

          {/* Student */}
          <RouteCard
            title="Student"
            description="For international students enrolled in eligible UK institutions."
            badge="Gov.uk Data"
            href="/visa/student"
            Icon={GraduationCap}
            colorClass="text-tertiary bg-tertiary/10 border-tertiary/20"
          />

          {/* Graduate */}
          <RouteCard
            title="Graduate"
            description="2-3 year post-study work visa for UK graduates."
            href="/visa/graduate"
            Icon={Award}
          />

          {/* Family */}
          <RouteCard
            title="Family"
            description="Join a partner, spouse, parent or family member in the UK."
            href="/visa/family"
            Icon={Users}
          />

          {/* Global Talent */}
          <RouteCard
            title="Global Talent"
            description="For leaders and promising talent in science, research, tech or arts."
            href="/visa/global-talent"
            Icon={Award}
          />

          {/* Innovator Founder */}
          <RouteCard
            title="Innovator Founder"
            description="For entrepreneurs starting an innovative business in the UK."
            href="/visa/innovator-founder"
            Icon={Lightbulb}
          />

          {/* Ancestry */}
          <RouteCard
            title="Ancestry"
            description="Commonwealth citizens with at least one UK grandparent."
            href="/visa/ancestry"
            Icon={Globe}
          />

          {/* BNO */}
          <RouteCard
            title="BNO"
            description="British National (Overseas) citizens from Hong Kong."
            href="/visa/bno"
            Icon={Flag}
          />

          {/* Scale-up */}
          <RouteCard
            title="Scale-up"
            description="For individuals with high-skilled job offers at fast-growing companies."
            href="/visa/scale-up"
            Icon={TrendingUp}
          />

          {/* High Potential Individual */}
          <RouteCard
            title="High Potential"
            description="Graduates from prestigious top-tier global universities."
            href="/visa/high-potential-individual"
            Icon={Award}
          />

          {/* Visit */}
          <RouteCard
            title="Visit"
            description="Short-term tourism, family visits, or business transit."
            href="/visa/visitor"
            Icon={Plane}
          />
        </div>
      </section>

      {/* Precision Tools Section */}
      <section className="container-page pb-12">
        <h3 className="text-xl sm:text-2xl font-display font-extrabold mb-6 flex items-center gap-2 border-b border-outline-variant pb-4">
          <Calculator className="h-6 w-6 text-primary" />
          Precision Tools
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ToolCard
            title="Cost Calculator"
            description="Aggregate all application fees, priority services, and biometric costs."
            badge="Popular"
            href="/tools/cost-calculator"
            Icon={Calculator}
            badgeColor="bg-secondary/10 text-secondary"
          />
          <ToolCard
            title="IHS Calculator"
            description="Calculate the exact Immigration Health Surcharge payment for your stay."
            badge="Official"
            href="/ihs-calculator"
            Icon={HeartPulse}
            badgeColor="bg-[#f0f3ff] text-[#434655]"
          />
          <ToolCard
            title="SW Points Check"
            description="Validate if your attributes meet the mandatory 70-point threshold."
            badge="Verified"
            href="/skilled-worker-points-check"
            Icon={CheckCircle2}
            badgeColor="bg-[#f0f3ff] text-[#434655]"
          />
          <ToolCard
            title="Salary Checker"
            description="Verify minimum salary thresholds by occupation code (SOC)."
            href="/tools/salary-checker"
            Icon={BadgePoundSterling}
          />
          <ToolCard
            title="Sponsor Search"
            description="Search licensed companies authorized to sponsor foreign workers."
            href="/tools/sponsor-search"
            Icon={Search}
          />
          <ToolCard
            title="ILR Calculator"
            description="Calculate qualifying periods and continuous residence absences."
            href="/immigration"
            Icon={Calendar}
          />
          <ToolCard
            title="Naturalisation Checker"
            description="Determine eligibility timeline for British Citizenship."
            href="/immigration"
            Icon={LandmarkIcon}
          />
          <ToolCard
            title="Absence Calculator"
            description="Log and count travel days spent outside the UK."
            href="/immigration"
            Icon={Calendar}
          />
          <ToolCard
            title="Family Income Check"
            description="Verify sponsor financial threshold calculations."
            href="/immigration"
            Icon={Users}
          />
          <ToolCard
            title="Right to Work Share"
            description="Verify or generate Home Office right to work shares."
            href="/immigration"
            Icon={ShieldCheck}
          />
          <ToolCard
            title="English Test SELT"
            description="Locate approved test providers and verify CEFR requirements."
            href="/immigration"
            Icon={Globe}
          />
          <ToolCard
            title="Dependant Visa Cost"
            description="Model expenses for accompanying spouse or children."
            href="/immigration"
            Icon={UserPlus}
          />
          <ToolCard
            title="Processing SLA"
            description="Estimated Home Office response timelines by route."
            href="/immigration"
            Icon={Clock}
          />
        </div>
      </section>

      {/* Critical Guides Section */}
      <section className="container-page pb-20">
        <h3 className="text-xl sm:text-2xl font-display font-extrabold mb-6">Critical Guides</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-surface-container-high/40 border border-outline-variant/50 p-6 rounded-2xl h-[240px] flex flex-col justify-end hover:shadow-md transition-all cursor-pointer">
            <h4 className="text-lg font-display font-bold text-on-surface mb-1">Eligibility Parameters</h4>
            <p className="text-sm text-on-surface-variant mb-4">General requirements for entering and staying in the UK.</p>
            <Link href="/eligibility" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
              READ GUIDE <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="bg-surface-container-high/40 border border-outline-variant/50 p-6 rounded-2xl h-[240px] flex flex-col justify-end hover:shadow-md transition-all cursor-pointer">
            <h4 className="text-lg font-display font-bold text-on-surface mb-1">Visa Switching Rules</h4>
            <p className="text-sm text-on-surface-variant mb-4">Conditions for switching visa categories from within the UK.</p>
            <Link href="/visa-switching" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
              READ GUIDE <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="bg-surface-container-high/40 border border-outline-variant/50 p-6 rounded-2xl h-[240px] flex flex-col justify-end hover:shadow-md transition-all cursor-pointer">
            <h4 className="text-lg font-display font-bold text-on-surface mb-1">Immigration Solicitors</h4>
            <p className="text-sm text-on-surface-variant mb-4">Directory of OISC-regulated legal representation professionals.</p>
            <Link href="/contact" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
              FIND ADVICE <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Guide with image: ILR Requirements */}
          <div className="relative rounded-2xl overflow-hidden h-[240px] group border border-outline-variant/50 hover:shadow-md transition-all">
            <img
              alt="ILR Requirements"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNIQG9olpHZLb7GyciMNyhidHbNzPPPQNN_PoDbvO_zg4purzNtTk2pRCGHDTvSIjdE3qIwBeGqyTgW_wk53S7PDzusUxSSxa8ZG0dDObSrgCy_imWcaZDiokIAMYL7ou98AjIAIcYZyNZLexGPG4_z5iWbJ9GMDXA0hhU6CJEZyks4dv1aDMEPDLYQEby2iqYl7qRAaX_Bd0dfV-DV4WQFs5bI4UuGRMGOjqNzWK4LsyV0VXxWX8_sLoS1xGgGisGRFCfwau7hI0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white flex flex-col justify-end">
              <h4 className="text-lg font-display font-bold mb-1">ILR Requirements</h4>
              <p className="text-xs text-gray-300 mb-3">Learn about Indefinite Leave to Remain settlement pathways.</p>
              <Link href="/blog" className="text-xs font-bold text-white/90 flex items-center gap-1 hover:text-white hover:underline self-start">
                READ DETAILS <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Guide with image: Visa Refusal Reasons */}
          <div className="relative rounded-2xl overflow-hidden h-[240px] group border border-outline-variant/50 hover:shadow-md transition-all">
            <img
              alt="Visa Refusal Reasons"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAo8q9gPQmZzugFb6J4SfTJOSDHOlMXezAxwoIeZbPb4YDMX1BCD8z6dD7ZVqgu0BYgO3rBLcMxFBImMu_skXiMgdCARt7dR_AnlPZqTxZxxXmhn4xwQGcu7Jr7h024TqW_-jdjLUhzk2bIXI1T_nPnKO-JYGPtf3TAlwCSc-DppmQZDQGGfFeKOChE0o2JMHD0O-bybaFcnjW3u9xB_JqDEjGEnrG_j61ZM77arJA23k2H_7gOgau4ZbTUU4CnsV_UkM_0e9d8v9g"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white flex flex-col justify-end">
              <h4 className="text-lg font-display font-bold mb-1">Visa Refusal Reasons</h4>
              <p className="text-xs text-gray-300 mb-3">Avoid common mistakes. Top reasons for visa refusals analysed.</p>
              <Link href="/blog" className="text-xs font-bold text-white/90 flex items-center gap-1 hover:text-white hover:underline self-start">
                READ DETAILS <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

interface RouteCardProps {
  title: string;
  description: string;
  badge?: string;
  href: string;
  Icon: typeof Briefcase;
  colorClass?: string;
}

function RouteCard({ title, description, badge, href, Icon, colorClass }: RouteCardProps) {
  const bgClass = colorClass || 'text-primary bg-primary/10 border-primary-soft/20';

  return (
    <Link
      href={href}
      className="bg-white p-6 rounded-2xl border border-outline-variant/60 hover:border-primary transition-all flex flex-col justify-between group shadow-sm hover:shadow-soft"
    >
      <div>
        <span className={`p-3 rounded-xl inline-block border ${bgClass} mb-4`}>
          <Icon className="h-5 w-5" />
        </span>
        <h4 className="text-base font-display font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-xs text-on-surface-variant leading-relaxed mb-4">{description}</p>
      </div>
      <div className="flex justify-between items-center mt-auto pt-3 border-t border-outline-variant/10">
        <span className="text-[10px] font-bold text-primary group-hover:underline flex items-center gap-0.5">
          EXPLORE <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </span>
        {badge && (
          <span className="bg-surface-container-highest text-on-surface-variant text-[9px] font-bold px-2 py-0.5 rounded uppercase">
            {badge}
          </span>
        )}
      </div>
    </Link>
  );
}

interface ToolCardProps {
  title: string;
  description: string;
  badge?: string;
  href: string;
  Icon: typeof Briefcase;
  badgeColor?: string;
}

function ToolCard({ title, description, badge, href, Icon, badgeColor }: ToolCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-outline-variant/60 flex flex-col h-full hover:shadow-md transition-all relative">
      <div className="flex justify-between items-start mb-4">
        <span className="p-3 bg-primary/5 rounded-xl text-primary border border-primary-soft/10">
          <Icon className="h-5 w-5" />
        </span>
        {badge && (
          <span className={`${badgeColor || 'bg-surface-container-highest text-on-surface-variant'} px-2.5 py-0.5 rounded font-bold text-[9px] uppercase tracking-widest`}>
            {badge}
          </span>
        )}
      </div>
      <h4 className="text-base font-display font-bold text-on-surface mb-1">{title}</h4>
      <p className="text-xs text-on-surface-variant leading-relaxed mb-6 flex-grow">{description}</p>
      <Link
        href={href}
        className="w-full py-2.5 bg-surface-container text-primary font-bold text-xs rounded-xl hover:bg-primary hover:text-white transition-all duration-200 flex items-center justify-center gap-1 shadow-sm mt-auto"
      >
        Launch Tool
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
