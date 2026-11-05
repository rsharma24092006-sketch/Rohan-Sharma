import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Layers, 
  ShieldCheck, 
  ThermometerSnowflake, 
  Truck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Eye,
  ExternalLink,
  Calendar
} from 'lucide-react';
import { LOCALITIES_DATA } from '../data/syntheticData';
import { LocalityData } from '../types';
import { NavTab } from './Navbar';

interface LocalityHotspotMapProps {
  onNavigate: (tab: NavTab) => void;
  selectedLocalityId?: string;
  onSelectLocality?: (localityId: string) => void;
}

export const LocalityHotspotMap: React.FC<LocalityHotspotMapProps> = ({
  onNavigate,
  selectedLocalityId,
  onSelectLocality
}) => {
  const [activeLocality, setActiveLocality] = useState<LocalityData>(
    LOCALITIES_DATA.find(l => l.id === selectedLocalityId) || LOCALITIES_DATA[0]
  );
  const [mapLayer, setMapLayer] = useState<'coverage' | 'terrain' | 'coldchain'>('coverage');

  const handleLocalityClick = (loc: LocalityData) => {
    setActiveLocality(loc);
    if (onSelectLocality) onSelectLocality(loc.id);
  };

  return (
    <div className="space-y-6 py-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <span>Geospatial Coverage Surveillance</span>
            <span aria-hidden="true">·</span>
            <span>Terrain &amp; Cold-Chain Radius</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Locality Hotspot &amp; Accessibility Map
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Visualize vaccination coverage disparities, difficult terrain bottlenecks, and cold-chain hubs.
          </p>
        </div>

        {/* Map View Layer Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl text-xs self-start md:self-auto">
          <button
            onClick={() => setMapLayer('coverage')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer ${
              mapLayer === 'coverage' 
                ? 'bg-white text-stone-900 shadow-2xs font-semibold' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Coverage Heatmap
          </button>
          <button
            onClick={() => setMapLayer('terrain')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer ${
              mapLayer === 'terrain' 
                ? 'bg-white text-stone-900 shadow-2xs font-semibold' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Terrain &amp; Access
          </button>
          <button
            onClick={() => setMapLayer('coldchain')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer ${
              mapLayer === 'coldchain' 
                ? 'bg-white text-stone-900 shadow-2xs font-semibold' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Cold-Chain Viability
          </button>
        </div>
      </div>

      {/* Main Map View Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Visual Interactive Map Canvas */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-700">District Sector Coordinate Canvas</span>
            <div className="flex items-center gap-4 text-[11px] text-stone-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                &ge;80% High Coverage
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                65-79% Moderate
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                &lt;65% Critical Gap Pocket
              </span>
            </div>
          </div>

          {/* SVG Map Container */}
          <div className="relative w-full aspect-[16/10] bg-[#f7f5ef] rounded-2xl border border-stone-200/80 overflow-hidden select-none">
            
            {/* Topographic Contours / River / Forest stylized SVG background */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ebe7dc" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Stylized River Path across Kaveri sector */}
              <path 
                d="M 50 100 Q 65 60 70 0" 
                fill="none" 
                stroke="#bae6fd" 
                strokeWidth="18" 
                strokeLinecap="round" 
              />
              <path 
                d="M 50 100 Q 65 60 70 0" 
                fill="none" 
                stroke="#7dd3fc" 
                strokeWidth="6" 
                strokeLinecap="round" 
              />
              <text x="66%" y="45%" fill="#0284c7" fontSize="10" fontStyle="italic" opacity="0.6">
                Kaveri River Branch
              </text>

              {/* Hill contour circles around Malkangiri */}
              <circle cx="18%" cy="72%" r="55" fill="#fef3c7" fillOpacity="0.4" stroke="#fcd34d" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="18%" cy="72%" r="35" fill="#fed7aa" fillOpacity="0.3" stroke="#f97316" strokeWidth="0.8" />

              {/* Forest area around Bhilwara */}
              <path 
                d="M 20 20 Q 35 15 48 30 Q 40 55 25 45 Z" 
                fill="#dcfce7" 
                fillOpacity="0.5" 
                stroke="#86efac" 
                strokeWidth="1" 
              />
              <text x="32%" y="24%" fill="#166534" fontSize="10" opacity="0.6">
                Reserve Forest Zone
              </text>

              {/* Central District PHC Hub Marker */}
              <circle cx="82%" cy="22%" r="22" fill="#d1fae5" fillOpacity="0.6" stroke="#059669" strokeWidth="1.5" />
              <circle cx="82%" cy="22%" r="4" fill="#047857" />
              <text x="80%" y="15%" fill="#047857" fontSize="11" fontWeight="bold">
                Civil Hospital &amp; Cold Hub
              </text>

              {/* Route lines from PHC to localities */}
              <line x1="82%" y1="22%" x2="74%" y2="38%" stroke="#059669" strokeWidth="2" strokeDasharray="4 2" opacity="0.6" />
              <line x1="82%" y1="22%" x2="42%" y2="78%" stroke="#059669" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.5" />
              <line x1="82%" y1="22%" x2="62%" y2="68%" stroke="#0284c7" strokeWidth="2" strokeDasharray="6 3" opacity="0.8" />
              <line x1="82%" y1="22%" x2="34%" y2="35%" stroke="#d97706" strokeWidth="1.5" strokeDasharray="2 3" opacity="0.7" />
              <line x1="82%" y1="22%" x2="18%" y2="72%" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.7" />
            </svg>

            {/* Interactive Pins for each Locality */}
            {LOCALITIES_DATA.map((loc) => {
              const isSelected = activeLocality.id === loc.id;
              const isCrit = loc.coverageRate < 65;
              const isMod = loc.coverageRate >= 65 && loc.coverageRate < 80;

              const pinColor = isCrit ? 'bg-red-600' : isMod ? 'bg-amber-500' : 'bg-emerald-600';
              const ringColor = isCrit ? 'ring-red-300' : isMod ? 'ring-amber-200' : 'ring-emerald-200';

              return (
                <div
                  key={loc.id}
                  onClick={() => handleLocalityClick(loc)}
                  style={{ left: `${loc.coordinates.x}%`, top: `${loc.coordinates.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10 transition-transform hover:scale-110"
                >
                  {/* Pin Circle */}
                  <div className={`relative flex items-center justify-center ${
                    isSelected ? 'ring-4 ring-stone-900/40 scale-110' : ''
                  }`}>
                    <div className={`w-9 h-9 rounded-full ${pinColor} text-white flex items-center justify-center shadow-md ring-2 ${ringColor}`}>
                      <MapPin className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-stone-900 rounded-full border-2 border-white" />
                    )}
                  </div>

                  {/* Pin Label Box */}
                  <div className={`mt-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap shadow-xs text-center border ${
                    isSelected 
                      ? 'bg-stone-900 text-white border-stone-900' 
                      : 'bg-white/95 text-stone-800 border-stone-200/80 group-hover:bg-white'
                  }`}>
                    {loc.name.split(' ')[0]} ({loc.coverageRate}%)
                  </div>
                </div>
              );
            })}

            {/* In-canvas Legend */}
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-stone-200 text-[11px] text-stone-600 space-y-1 shadow-xs">
              <div className="font-semibold text-stone-900">Map Legend:</div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-emerald-600" />
                <span>Paved Road Transit</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-blue-500" />
                <span>River Boat Crossing Route</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-red-500 border-dashed" />
                <span>Unpaved Forest / Hill Footpath</span>
              </div>
            </div>

          </div>

          <div className="text-xs text-stone-500 flex items-center justify-between pt-1">
            <span>Click any locality pin to inspect field logistics, cold-chain transport limits, and overdue rosters.</span>
            <span className="font-mono text-[11px]">Grid: WGS-84 Local District UTM</span>
          </div>
        </div>

        {/* Right Locality Detail Inspector Card */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-emerald-800">
              <span>{activeLocality.type}</span>
              <span className="font-mono text-stone-500">{activeLocality.id}</span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 mt-1">
              {activeLocality.name}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Nearest Medical Post: {activeLocality.nearestCenter}
            </p>
          </div>

          {/* Coverage & Status Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-stone-600">Vaccination Coverage Rate:</span>
              <span className={`font-mono text-sm font-bold ${
                activeLocality.coverageRate < 65 ? 'text-red-700' : 'text-emerald-700'
              }`}>
                {activeLocality.coverageRate}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  activeLocality.coverageRate < 65 ? 'bg-red-600' : activeLocality.coverageRate < 80 ? 'bg-amber-500' : 'bg-emerald-600'
                }`}
                style={{ width: `${activeLocality.coverageRate}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-stone-400">
              <span>0%</span>
              <span>Target: 90%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Key Locality Logistics Stats */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
              <div className="text-stone-500 text-[11px]">Total Cohort &lt; 5</div>
              <div className="text-lg font-bold text-stone-900 font-mono mt-0.5">
                {activeLocality.totalChildren}
              </div>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
              <div className="text-stone-500 text-[11px]">Children Overdue</div>
              <div className="text-lg font-bold text-amber-700 font-mono mt-0.5">
                {activeLocality.missedCount}
              </div>
            </div>
            <div className="p-3 bg-red-50/60 rounded-xl border border-red-100">
              <div className="text-red-700 text-[11px] font-semibold">High Priority Gaps</div>
              <div className="text-lg font-bold text-red-800 font-mono mt-0.5">
                {activeLocality.highRiskCount}
              </div>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
              <div className="text-stone-500 text-[11px]">Active Health Workers</div>
              <div className="text-lg font-bold text-stone-900 font-mono mt-0.5">
                {activeLocality.activeFieldWorkers} Teams
              </div>
            </div>
          </div>

          {/* Road Access & Cold-Chain Specs */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-stone-900">
              <Truck className="w-4 h-4 text-emerald-700" />
              <span>Physical Transit Profile</span>
            </div>
            <div className="text-stone-600 space-y-1">
              <div><strong>Road Access:</strong> {activeLocality.roadAccess}</div>
              <div><strong>Distance to PHC:</strong> {activeLocality.distanceToPHCKm} km</div>
              <div><strong>Cold-Chain Window:</strong> {activeLocality.distanceToPHCKm > 12 ? '4-hour carrier ice-pack limit' : 'Standard 8-hour carrier'}</div>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed pt-2 border-t border-stone-200">
              {activeLocality.description}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => onNavigate('outreach-planner')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Generate Route for {activeLocality.name}</span>
            </button>
            <button
              onClick={() => onNavigate('booking')}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 font-medium text-xs transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>Schedule Session in this Locality</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
