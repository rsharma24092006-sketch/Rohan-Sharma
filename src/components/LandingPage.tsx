import React from 'react';
import { 
  ArrowRight, 
  MapPin, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  Compass, 
  ThermometerSnowflake, 
  ShieldCheck, 
  ArrowUpRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { NavTab } from './Navbar';

interface LandingPageProps {
  onNavigate: (tab: NavTab) => void;
  onOpenJudgeBrief: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenJudgeBrief }) => {
  return (
    <div className="space-y-16 py-8">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-stone-200/80 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[580px]">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Quiet unboxed kicker */}
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 tracking-wide uppercase">
                <span>Public Health Decision Support</span>
                <span aria-hidden="true">·</span>
                <span>Vaccine Equity Logistics</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 leading-[1.15] text-balance">
                Bridging Immunization Gaps,{' '}
                <span className="text-emerald-700">Reaching Every Child.</span>
              </h1>

              {/* Body */}
              <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl">
                VaxReach empowers community health officers and field workers to proactively identify missed 
                vaccination sessions, analyze geographic and migratory barriers, and orchestrate targeted doorstep 
                outreach for vulnerable children in underserved communities.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm shadow-xs transition-colors cursor-pointer"
                >
                  <span>Explore Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('vaccination-tracker')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold text-sm hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Vaccination Tracker</span>
                </button>
                <button
                  onClick={() => onNavigate('centre-finder')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-sm transition-colors cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>Find Nearby Centres</span>
                </button>
                <button
                  onClick={() => onNavigate('booking')}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-stone-700 hover:text-stone-900 font-medium text-sm transition-colors cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  <span>Book Session</span>
                </button>
              </div>

            </div>

            {/* Micro stats banner */}
            <div className="pt-8 mt-8 border-t border-stone-100 grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-stone-900 tabular-nums">2,009</div>
                <div className="text-xs text-stone-500 mt-0.5">Children Monitored</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-700 tabular-nums">68.2%</div>
                <div className="text-xs text-stone-500 mt-0.5">Average Cohort Coverage</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-700 tabular-nums">190</div>
                <div className="text-xs text-stone-500 mt-0.5">High Priority Gaps</div>
              </div>
            </div>

          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-5 relative bg-stone-100 min-h-[320px] lg:min-h-full">
            <img
              src="/src/assets/images/hero_community_health_1793860768971.jpg"
              alt="Community healthcare worker with vaccine cold carrier consulting with mother and child"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {/* Soft overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent lg:hidden" />
            
            {/* Floating verification badge */}
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:bottom-6 sm:right-auto bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-stone-200/80 shadow-md max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <ThermometerSnowflake className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-stone-900">Cold-Chain Aware</div>
                  <div className="text-[11px] text-stone-500">Route planning factoring vaccine thermal viability</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Problem Context Banner */}
      <section className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Public Health Dilemma</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
              Why do children miss routine immunization sessions?
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Vaccination dropouts are rarely intentional refusals. Frontline data demonstrates that the primary drivers are{' '}
              <strong>seasonal migration</strong>, <strong>extreme travel distances (10-18 km)</strong> over river and forest terrain,{' '}
              <strong>unaddressed caregiver anxieties</strong> over mild post-vaccine fever, and <strong>paper-based tracking fragmentation</strong>.
            </p>
          </div>
          <button
            onClick={() => onNavigate('risk-model')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0"
          >
            <span>Inspect Risk Model</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 4 Core Pillars of VaxReach */}
      <section className="space-y-6">
        <div>
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Modular Platform Capabilities</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Engineered for Frontline Health Workers &amp; Program Managers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div 
            onClick={() => onNavigate('tracker')}
            className="group p-6 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                Missed Session Tracker
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Automated registry cross-checks tracking overdue days, missing antigens (Pentavalent, MR, Polio), and priority sorting.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
              <span>View Roster</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 2 */}
          <div 
            onClick={() => onNavigate('risk-model')}
            className="group p-6 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                Explainable Risk Triage
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Transparent multi-factor ranking factoring missed sessions, duration, distance, and transit. No black box; no medical diagnosis.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-amber-700">
              <span>Test Simulator</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 3 */}
          <div 
            onClick={() => onNavigate('hotspots')}
            className="group p-6 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                Locality Hotspot Map
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Interactive geographic mapping distinguishing well-served zones from remote riverine and tribal sectors with low coverage.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-teal-700">
              <span>Inspect Sectors</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 4 */}
          <div 
            onClick={() => onNavigate('outreach-planner')}
            className="group p-6 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                Outreach Plan Generator
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Generates clustered field itinerary lists for ASHA and mobile health teams, with printable route sheets and CSV export.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-700">
              <span>Generate Route</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

        </div>
      </section>

      {/* Direct Booking System Spotlight (User Requested Feature) */}
      <section className="bg-white border border-stone-200 rounded-3xl p-8 sm:p-12 overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-100 text-emerald-900 text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              <span>Interactive Booking Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
              Direct Community &amp; Healthcare Worker Session Booking
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Parents, guardians, or local ASHA workers can schedule a dedicated appointment directly through VaxReach. 
              Choose between <strong>Doorstep Outreach Visits</strong> by visiting health workers, or guaranteed slots at the local 
              <strong>Primary Health Centre</strong> with cold-chain refrigeration.
            </p>
            <ul className="space-y-2.5 text-xs text-stone-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Custom time slot selection matching caregiver work shifts (e.g. dawn or evening sessions)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Special needs flags: boat transit, interpreter assistance, or post-vaccine fever counselling</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant confirmation pass generation with unique booking reference code</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('booking')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer"
              >
                <span>Book a Child Vaccination Session</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-sm bg-stone-50">
              <img
                src="/src/assets/images/field_vaccine_coldchain_1793860785826.jpg"
                alt="Frontline healthcare clinic desk with digital record tablet and vaccine carrier"
                referrerPolicy="no-referrer"
                className="w-full h-72 sm:h-80 object-cover"
              />
              <div className="p-4 bg-stone-50 text-xs text-stone-500 border-t border-stone-200 flex items-center justify-between">
                <span>Field Cold-Chain Log &amp; Mobile Tablet Terminal</span>
                <span className="font-mono">Temp: 4.8°C (Optimal)</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Ethical & Governance Notice */}
      <section className="rounded-2xl border border-stone-200 bg-stone-50/80 p-6 text-stone-600 space-y-3">
        <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Ethics, Clinical Boundaries, and Privacy Architecture</span>
        </div>
        <p className="text-xs leading-relaxed">
          <strong>Decision Support Only:</strong> VaxReach assists public health logistics, spatial allocation, and field worker scheduling. 
          It does not generate medical diagnoses, prescribe vaccines, or determine clinical suitability. Any vaccine administration requires direct clinical evaluation 
          by an accredited nurse, medical officer, or licensed healthcare practitioner.
        </p>
        <p className="text-xs leading-relaxed">
          <strong>Data Privacy &amp; Anonymization:</strong> All records presented in this demonstration are strictly synthetic and anonymized. 
          Real-world deployment mandates federated record matching, role-based encryption, explicit parental consent, and compliance with national digital health standards.
        </p>
      </section>

    </div>
  );
};
