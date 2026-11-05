import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';
import { NavTab } from './Navbar';

interface FooterProps {
  onNavigate: (tab: NavTab) => void;
  onOpenJudgeBrief: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenJudgeBrief }) => {
  return (
    <footer className="border-t border-stone-200/90 bg-[#f7f5ef] py-12 text-xs text-stone-600 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-emerald-700 text-white flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-stone-900 text-base font-display">
                Vax<span className="text-emerald-700">Reach</span>
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed max-w-sm">
              &ldquo;Bridging Immunization Gaps, Reaching Every Child.&rdquo; A healthcare decision-support platform 
              designed to identify missed vaccination sessions, address cold-chain logistics, and empower targeted field outreach.
            </p>
            <div className="text-[11px] text-stone-500">
              Developed for College Hackathon Presentation. Built with React, TypeScript &amp; Tailwind CSS.
            </div>
          </div>

          {/* Quick Nav */}
          <div className="space-y-2">
            <div className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">
              Platform Modules
            </div>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-stone-900 transition-colors cursor-pointer">
                  District Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('vaccination-tracker')} className="hover:text-emerald-800 font-semibold transition-colors cursor-pointer">
                  Vaccination Tracker (NIS)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('centre-finder')} className="hover:text-emerald-800 font-semibold transition-colors cursor-pointer">
                  Nearby Centre Finder (OSM Map)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tracker')} className="hover:text-stone-900 transition-colors cursor-pointer">
                  Missed-Session Tracker
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('hotspots')} className="hover:text-stone-900 transition-colors cursor-pointer">
                  Locality Hotspot Map
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('risk-model')} className="hover:text-stone-900 transition-colors cursor-pointer">
                  Explainable Risk Model
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('migration')} className="hover:text-stone-900 transition-colors cursor-pointer">
                  Migration Alerts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('outreach-planner')} className="hover:text-stone-900 transition-colors cursor-pointer">
                  Outreach Plan Generator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('booking')} className="hover:text-stone-900 transition-colors cursor-pointer">
                  Book Vaccination Session
                </button>
              </li>

            </ul>
          </div>

          {/* Official Health Guidelines & References */}
          <div className="space-y-2">
            <div className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">
              Public Health Guidelines
            </div>
            <ul className="space-y-1.5 text-xs text-stone-600">
              <li>
                <a 
                  href="https://www.who.int/teams/immunization-vaccines-and-biologicals/strategies/ia2030" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-emerald-800 transition-colors flex items-center gap-1"
                >
                  <span>WHO Immunization Agenda 2030</span>
                  <ExternalLink className="w-3 h-3 text-stone-400" />
                </a>
              </li>
              <li>
                <a 
                  href="https://nhm.gov.in/index1.php?lang=1&level=2&sublinkid=822&lid=220" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-emerald-800 transition-colors flex items-center gap-1"
                >
                  <span>Universal Immunization Schedule</span>
                  <ExternalLink className="w-3 h-3 text-stone-400" />
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenJudgeBrief}
                  className="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 cursor-pointer pt-1"
                >
                  <span>Open Hackathon Judge Brief</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-stone-200/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <div>
            &copy; 2026 VaxReach. Synthetic demonstration data for academic and evaluation purposes only.
          </div>
          <div className="flex items-center gap-4">
            <span>Logistics Triage Model</span>
            <span aria-hidden="true">·</span>
            <span>Zero Real Patient Identifiers</span>
            <span aria-hidden="true">·</span>
            <span>Non-Clinical Support</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
