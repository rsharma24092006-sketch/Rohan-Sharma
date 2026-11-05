import React, { useState } from 'react';
import { 
  ShieldCheck, 
  HelpCircle, 
  Sliders, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { computeExplainableRisk } from '../data/syntheticData';
import { PriorityLevel } from '../types';
import { NavTab } from './Navbar';

interface ExplainableRiskModelProps {
  onNavigate: (tab: NavTab) => void;
}

export const ExplainableRiskModel: React.FC<ExplainableRiskModelProps> = ({ onNavigate }) => {
  // Simulator state
  const [missedSessions, setMissedSessions] = useState<number>(2);
  const [daysOverdue, setDaysOverdue] = useState<number>(95);
  const [distanceKm, setDistanceKm] = useState<number>(14.5);
  const [isMigrated, setIsMigrated] = useState<boolean>(true);
  const [hesitancyReported, setHesitancyReported] = useState<boolean>(false);

  // Compute live explainable risk
  const simulatedResult = computeExplainableRisk({
    missedSessionsCount: missedSessions,
    daysOverdue,
    distanceKm,
    isMigrated,
    hesitancyReported
  });

  const handleReset = () => {
    setMissedSessions(1);
    setDaysOverdue(45);
    setDistanceKm(6.5);
    setIsMigrated(false);
    setHesitancyReported(false);
  };

  return (
    <div className="space-y-8 py-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <span>Algorithmic Transparency</span>
            <span aria-hidden="true">·</span>
            <span>Decision Support Model</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Explainable Risk Ranking Model
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Clear, auditable logistics factors determining field outreach triage priority.
          </p>
        </div>

        <button
          onClick={() => onNavigate('outreach-planner')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start md:self-auto"
        >
          <span>Apply to Outreach Plan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Strict Ethical & Non-Clinical Boundary Banner */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-200/90 rounded-2xl flex items-start gap-3 text-xs text-emerald-950">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-emerald-900">Ethical Framework &amp; Clinical Non-Interference</div>
          <p className="text-emerald-800 leading-relaxed">
            This model ranks <strong>logistics and follow-up urgency</strong>, NOT medical certainty or diagnosis. 
            It prioritizes which households frontline health workers should visit first based on distance, elapsed delay, 
            and migration barriers. It never overrides clinical assessment or determines vaccine safety.
          </p>
        </div>
      </div>

      {/* Model Weights Architecture & Interactive Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Model Weights & Transparent Equation */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Evaluation Weights &amp; Rationale
            </h2>
            <p className="text-xs text-stone-500">
              Deterministic, transparent weights designed with community health officers.
            </p>
          </div>

          <div className="space-y-4">
            
            {/* Factor 1 */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-900">Consecutive Missed Sessions</span>
                <span className="font-mono font-bold text-emerald-800">35% Weight</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Represents repeated failure of standard village health day reminders. Multiple missed sessions correlate 
                with high zero-dose or incomplete protection probability.
              </p>
            </div>

            {/* Factor 2 */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-900">Days Overdue Since Last Dose</span>
                <span className="font-mono font-bold text-emerald-800">25% Weight</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Linear scaling up to 180 days past scheduled antigen window. Long lapses increase disease vulnerability 
                window for Measles, DPT, and Hib.
              </p>
            </div>

            {/* Factor 3 */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-900">Distance from Cold-Chain PHC</span>
                <span className="font-mono font-bold text-emerald-800">20% Weight</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Addresses geographical barriers: river crossings, unpaved forest trails, and lack of sub-center refrigeration 
                drastically reduce spontaneous clinic attendance.
              </p>
            </div>

            {/* Factor 4 */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-900">Recent Migration Flag</span>
                <span className="font-mono font-bold text-emerald-800">15% Weight</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Circular migrants (brick kiln, construction, pastoral labor) lose contact with original registries and 
                require active re-enrollment.
              </p>
            </div>

            {/* Factor 5 */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-900">Caregiver Hesitance Reported</span>
                <span className="font-mono font-bold text-emerald-800">5% Weight</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Flags mild anxiety (post-injection fever fears) triggering prioritized empathetic counselling rather than 
                punitive action.
              </p>
            </div>

          </div>
        </div>

        {/* Right: Live Interactive Simulator */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-700" />
                <span>Interactive Risk Simulator</span>
              </h2>
              <p className="text-xs text-stone-500">
                Adjust synthetic variables to test real-time score calculation and explainable output.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>

          {/* Controls */}
          <div className="space-y-5 bg-stone-50/80 p-5 rounded-2xl border border-stone-200/80">
            
            {/* Slider 1: Missed sessions */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <label htmlFor="missed-sessions-slider" className="text-stone-800">Missed Sessions Count:</label>
                <span className="font-mono font-bold text-stone-900">{missedSessions} session(s)</span>
              </div>
              <input
                id="missed-sessions-slider"
                type="range"
                min={0}
                max={4}
                step={1}
                value={missedSessions}
                onChange={(e) => setMissedSessions(parseInt(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>0 (None)</span>
                <span>1 Session</span>
                <span>2 Sessions</span>
                <span>3 Sessions</span>
                <span>4+ (Chronic)</span>
              </div>
            </div>

            {/* Slider 2: Days overdue */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <label htmlFor="days-overdue-slider" className="text-stone-800">Days Elapsed Since Scheduled Window:</label>
                <span className="font-mono font-bold text-stone-900">{daysOverdue} days</span>
              </div>
              <input
                id="days-overdue-slider"
                type="range"
                min={0}
                max={200}
                step={5}
                value={daysOverdue}
                onChange={(e) => setDaysOverdue(parseInt(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>0 days (On Track)</span>
                <span>60 days</span>
                <span>120 days</span>
                <span>200+ days</span>
              </div>
            </div>

            {/* Slider 3: Distance */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <label htmlFor="distance-slider" className="text-stone-800">Distance to Nearest Cold-Chain Centre:</label>
                <span className="font-mono font-bold text-stone-900">{distanceKm} km</span>
              </div>
              <input
                id="distance-slider"
                type="range"
                min={1}
                max={25}
                step={0.5}
                value={distanceKm}
                onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>1 km (Walkable)</span>
                <span>10 km</span>
                <span>20 km</span>
                <span>25 km (Remote)</span>
              </div>
            </div>

            {/* Toggle Switches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-stone-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isMigrated}
                  onChange={(e) => setIsMigrated(e.target.checked)}
                  className="w-4 h-4 rounded-sm accent-emerald-700"
                />
                <div className="text-xs">
                  <div className="font-semibold text-stone-900">Recent Migration Flag</div>
                  <div className="text-[11px] text-stone-500">Cross-block transit</div>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-stone-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hesitancyReported}
                  onChange={(e) => setHesitancyReported(e.target.checked)}
                  className="w-4 h-4 rounded-sm accent-emerald-700"
                />
                <div className="text-xs">
                  <div className="font-semibold text-stone-900">Caregiver Hesitance</div>
                  <div className="text-[11px] text-stone-500">Post-fever anxiety</div>
                </div>
              </label>
            </div>

          </div>

          {/* Real-Time Result Box */}
          <div className={`p-6 rounded-2xl border transition-all ${
            simulatedResult.priority === 'High'
              ? 'bg-red-50/70 border-red-200'
              : simulatedResult.priority === 'Medium'
                ? 'bg-amber-50/70 border-amber-200'
                : 'bg-emerald-50/70 border-emerald-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/10">
              <div>
                <div className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  Calculated Outreach Priority
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-2xl font-bold ${
                    simulatedResult.priority === 'High' 
                      ? 'text-red-700' 
                      : simulatedResult.priority === 'Medium' 
                        ? 'text-amber-700' 
                        : 'text-emerald-700'
                  }`}>
                    {simulatedResult.priority} Priority
                  </span>
                  <span className="font-mono text-sm px-2.5 py-0.5 rounded-full bg-white/80 border font-semibold tabular-nums text-stone-800">
                    Score: {simulatedResult.score} / 100
                  </span>
                </div>
              </div>

              <div className="text-xs text-stone-600 text-right">
                <span className="block font-medium">Recommended Action:</span>
                <span className="font-bold text-stone-900">
                  {simulatedResult.priority === 'High' 
                    ? 'Immediate Doorstep Health Worker Visit (within 48h)' 
                    : simulatedResult.priority === 'Medium' 
                      ? 'Next Village Nutrition Day (VHND) Session' 
                      : 'Routine SMS Reminder & Sub-center Walk-in'}
                </span>
              </div>
            </div>

            {/* Generated Human Explainable Rationale */}
            <div className="pt-4 space-y-2">
              <div className="text-xs font-semibold text-stone-800">
                Explainable Rationale Factors:
              </div>
              {simulatedResult.reasons.length === 0 ? (
                <div className="text-xs text-stone-600">Child is currently adhering to routine timeline.</div>
              ) : (
                <ul className="space-y-1.5 text-xs text-stone-700">
                  {simulatedResult.reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${
                        simulatedResult.priority === 'High' ? 'text-red-600' : 'text-emerald-700'
                      }`} />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
