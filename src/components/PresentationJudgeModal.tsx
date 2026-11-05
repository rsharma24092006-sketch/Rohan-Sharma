import React, { useState } from 'react';
import { 
  Award, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  MapPin, 
  Calendar, 
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { NavTab } from './Navbar';

interface PresentationJudgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavTab) => void;
}

export const PresentationJudgeModal: React.FC<PresentationJudgeModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: '01. The Healthcare Challenge',
      kicker: 'Problem Statement & Motivation',
      icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
      content: (
        <div className="space-y-4 text-xs text-stone-600 leading-relaxed">
          <p className="text-sm text-stone-800 font-medium">
            Over 14 million children globally fail to receive even a single dose of routine immunization (&ldquo;zero-dose children&rdquo;), 
            and millions more drop out before completing their primary series.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80">
              <strong className="text-stone-900 block mb-1">1. Geographical &amp; Cold-Chain Barriers</strong>
              Remote riverine communities and forest hamlets lack reliable cold-chain refrigeration and struggle with 10–18 km transit bottlenecks.
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80">
              <strong className="text-stone-900 block mb-1">2. Circular Migration Displacement</strong>
              Daily-wage and seasonal migrant workers move across block/district lines, breaking continuity of care in paper records.
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80">
              <strong className="text-stone-900 block mb-1">3. Dropouts Post 14 Weeks</strong>
              A massive drop occurs between Pentavalent-3 (14 weeks) and MR-1 (9 months) due to the long lag and mild fever anxiety.
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80">
              <strong className="text-stone-900 block mb-1">4. Frontline Workload Strain</strong>
              Community health officers spend hours manually parsing paper registers rather than executing targeted field outreach.
            </div>
          </div>
        </div>
      )
    },
    {
      title: '02. The VaxReach Solution Architecture',
      kicker: 'End-to-End Decision Support System',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-700" />,
      content: (
        <div className="space-y-4 text-xs text-stone-600 leading-relaxed">
          <p className="text-sm text-stone-800 font-medium">
            VaxReach transforms static immunization records into actionable frontline logistics and citizen engagement.
          </p>
          <div className="space-y-2.5">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-xs">
                A
              </div>
              <div>
                <strong className="text-stone-900">Gap Surveillance Engine:</strong> Continuously monitors registered child cohorts, calculates elapsed overdue days, and highlights missed scheduled doses.
              </div>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-xs">
                B
              </div>
              <div>
                <strong className="text-stone-900">Explainable Multi-Factor Risk Model:</strong> Deterministic 5-factor scoring (missed sessions, overdue days, distance, migration, hesitancy) without black-box clinical assertions.
              </div>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-xs">
                C
              </div>
              <div>
                <strong className="text-stone-900">Frontline Outreach &amp; Booking Integration:</strong> Generates cold-chain compliant field route itineraries, printable route sheets, CSV export, and citizen self-booking.
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '03. Key Features & Live Prototype Demo',
      kicker: 'Interactive Modules Built & Validated',
      icon: <Award className="w-6 h-6 text-purple-600" />,
      content: (
        <div className="space-y-3 text-xs text-stone-600">
          <p className="text-sm text-stone-800 font-medium">
            Every module of this prototype is fully functional, interactive, and grounded in realistic synthetic demonstration data:
          </p>
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={() => { onClose(); onNavigate('dashboard'); }}
              className="p-3 text-left rounded-xl bg-stone-50 hover:bg-emerald-50 border border-stone-200 transition-colors"
            >
              <div className="font-bold text-stone-900">1. Coverage Dashboard</div>
              <div className="text-[11px] text-stone-500 mt-0.5">Recharts waterfall &amp; locality comparisons</div>
            </button>
            <button
              onClick={() => { onClose(); onNavigate('tracker'); }}
              className="p-3 text-left rounded-xl bg-stone-50 hover:bg-emerald-50 border border-stone-200 transition-colors"
            >
              <div className="font-bold text-stone-900">2. Missed Session Tracker</div>
              <div className="text-[11px] text-stone-500 mt-0.5">Searchable, sortable table &amp; child detail drawer</div>
            </button>
            <button
              onClick={() => { onClose(); onNavigate('risk-model'); }}
              className="p-3 text-left rounded-xl bg-stone-50 hover:bg-emerald-50 border border-stone-200 transition-colors"
            >
              <div className="font-bold text-stone-900">3. Explainable Risk Model</div>
              <div className="text-[11px] text-stone-500 mt-0.5">Interactive sliders with dynamic weight scoring</div>
            </button>
            <button
              onClick={() => { onClose(); onNavigate('hotspots'); }}
              className="p-3 text-left rounded-xl bg-stone-50 hover:bg-emerald-50 border border-stone-200 transition-colors"
            >
              <div className="font-bold text-stone-900">4. Locality Hotspot Map</div>
              <div className="text-[11px] text-stone-500 mt-0.5">Interactive coordinate canvas &amp; cold chain radius</div>
            </button>
            <button
              onClick={() => { onClose(); onNavigate('outreach-planner'); }}
              className="p-3 text-left rounded-xl bg-stone-50 hover:bg-emerald-50 border border-stone-200 transition-colors"
            >
              <div className="font-bold text-stone-900">5. Outreach Route Generator</div>
              <div className="text-[11px] text-stone-500 mt-0.5">Clustering, CSV export &amp; printable route sheet</div>
            </button>
            <button
              onClick={() => { onClose(); onNavigate('vaccination-tracker'); }}
              className="p-3 text-left rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors"
            >
              <div className="font-bold text-emerald-900">7. Personal Vaccination Tracker</div>
              <div className="text-[11px] text-emerald-700 mt-0.5">NIS schedule, DOB calculator &amp; push reminders</div>
            </button>
            <button
              onClick={() => { onClose(); onNavigate('centre-finder'); }}
              className="p-3 text-left rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors"
            >
              <div className="font-bold text-emerald-900">8. Nearby Centre Finder</div>
              <div className="text-[11px] text-emerald-700 mt-0.5">Leaflet OSM map, GPS distance &amp; Google navigation</div>
            </button>
          </div>
        </div>

      )
    },
    {
      title: '04. Privacy, Safety & Ethical Guardrails',
      kicker: 'Compliance & Responsible Health Tech',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-700" />,
      content: (
        <div className="space-y-3 text-xs text-stone-600 leading-relaxed">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 space-y-2">
            <div className="font-bold text-sm">Key Ethical Pillars Built Into VaxReach:</div>
            <ul className="space-y-1.5 list-disc list-inside text-xs text-emerald-900">
              <li><strong>Strict Logistics Boundary:</strong> Does not prescribe medications or diagnose children; supports scheduling and geographic routing only.</li>
              <li><strong>Zero Real Patient Records:</strong> Utilizes 100% synthetic, anonymized demonstration identifiers (e.g. VR-2024-0104).</li>
              <li><strong>Cross-District Privacy:</strong> Cross-locality record reconciliation specifies role-based encryption and explicit caregiver authorization.</li>
              <li><strong>Empathetic Follow-ups:</strong> Flags caregiver hesitancy for supportive conversations with trained community nurses, avoiding punitive measures.</li>
            </ul>
          </div>
          <p className="text-[11px] text-stone-500">
            Complies with digital public health guidelines, Universal Immunization Programme (UIP) standards, and WHO Immunization Agenda 2030 recommendations.
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-stone-200 max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              {slides[currentSlide].icon}
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
                {slides[currentSlide].kicker}
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                {slides[currentSlide].title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Content Viewport */}
        <div className="min-h-[280px]">
          {slides[currentSlide].content}
        </div>

        {/* Slide Controls & Dots */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === i ? 'w-6 bg-emerald-700' : 'w-2 bg-stone-200'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
              disabled={currentSlide === 0}
              className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (currentSlide < slides.length - 1) {
                  setCurrentSlide(prev => prev + 1);
                } else {
                  onClose();
                  onNavigate('dashboard');
                }
              }}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>{currentSlide === slides.length - 1 ? 'Start Live Demo' : 'Next Slide'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
