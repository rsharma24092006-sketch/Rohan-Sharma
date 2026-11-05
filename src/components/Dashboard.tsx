import React, { useState, useMemo } from 'react';
import { 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Flame, 
  MapPin, 
  Filter, 
  ArrowRight, 
  Info,
  Calendar,
  Building2,
  TrendingDown,
  Navigation
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  LineChart, 
  Line, 
  AreaChart, 
  Area 
} from 'recharts';
import { LOCALITIES_DATA, VACCINE_DROPOUT_DATA, COVERAGE_COMPARISON_DATA } from '../data/syntheticData';
import { NavTab } from './Navbar';

interface DashboardProps {
  onNavigate: (tab: NavTab) => void;
  onSelectLocality?: (localityId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onSelectLocality }) => {
  const [selectedLocalityFilter, setSelectedLocalityFilter] = useState<string>('all');
  const [coverageBenchmark, setCoverageBenchmark] = useState<number>(70); // 70% threshold

  // Derived filtered locality statistics
  const filteredLocalities = useMemo(() => {
    if (selectedLocalityFilter === 'all') return LOCALITIES_DATA;
    return LOCALITIES_DATA.filter(loc => loc.id === selectedLocalityFilter);
  }, [selectedLocalityFilter]);

  const totalRegistered = useMemo(() => 
    filteredLocalities.reduce((acc, l) => acc + l.totalChildren, 0), [filteredLocalities]);
  
  const totalImmunized = useMemo(() => 
    filteredLocalities.reduce((acc, l) => acc + l.fullyImmunized, 0), [filteredLocalities]);

  const totalMissed = useMemo(() => 
    filteredLocalities.reduce((acc, l) => acc + l.missedCount, 0), [filteredLocalities]);

  const totalHighRisk = useMemo(() => 
    filteredLocalities.reduce((acc, l) => acc + l.highRiskCount, 0), [filteredLocalities]);

  const overallCoverageRate = totalRegistered > 0 ? ((totalImmunized / totalRegistered) * 100).toFixed(1) : '0';

  const lowCoverageLocalities = useMemo(() => 
    LOCALITIES_DATA.filter(l => l.coverageRate < coverageBenchmark), [coverageBenchmark]);

  return (
    <div className="space-y-8 py-6">
      
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <span>District Immunization Intelligence</span>
            <span aria-hidden="true">·</span>
            <span className="text-stone-500 font-normal">Active Surveillance Cycle</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Immunization Coverage &amp; Gap Dashboard
          </h1>
        </div>

        {/* Locality Selector filter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-stone-200 text-xs shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-stone-500" />
            <label htmlFor="locality-select" className="text-stone-600 font-medium">Filter Locality:</label>
            <select
              id="locality-select"
              value={selectedLocalityFilter}
              onChange={(e) => setSelectedLocalityFilter(e.target.value)}
              className="bg-transparent font-medium text-stone-900 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All 6 Localities (Full Cohort)</option>
              {LOCALITIES_DATA.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.type})
                </option>
              ))}
            </select>
          </div>
          {selectedLocalityFilter !== 'all' && (
            <button
              onClick={() => setSelectedLocalityFilter('all')}
              className="text-xs text-emerald-700 hover:text-emerald-900 underline font-medium cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Synthetic Demonstration Data Callout */}
      <div className="bg-stone-100/90 border border-stone-200 rounded-xl p-3.5 flex items-center justify-between text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            <strong>SYNTHETIC DEMONSTRATION DATA:</strong> Simulating 2,009 registered children under 5 across 6 geographical sectors. 
            Used strictly for public health logistics and operational gap triage.
          </span>
        </div>
        <span className="font-mono text-[11px] text-stone-500 hidden sm:inline">Cohort ID: SYN-DIST-2024</span>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Registered Cohort</span>
            <Users className="w-4 h-4 text-stone-400" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-bold text-stone-900 tabular-nums">
              {totalRegistered.toLocaleString()}
            </div>
            <div className="text-xs text-stone-500 mt-1">Children &lt; 5 years monitored</div>
          </div>
          <div className="text-[11px] text-stone-400 pt-2 border-t border-stone-100">
            6 geographic clusters
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-emerald-700 font-medium">
            <span>Fully Immunized</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-bold text-emerald-700 tabular-nums">
              {totalImmunized.toLocaleString()}
            </div>
            <div className="text-xs text-stone-600 mt-1">
              <strong className="text-emerald-800">{overallCoverageRate}%</strong> coverage rate
            </div>
          </div>
          <div className="text-[11px] text-stone-400 pt-2 border-t border-stone-100">
            National target: &gt; 90.0%
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-amber-700 font-medium">
            <span>Missed Sessions</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-bold text-amber-700 tabular-nums">
              {totalMissed.toLocaleString()}
            </div>
            <div className="text-xs text-stone-600 mt-1">
              <strong className="text-amber-800">
                {totalRegistered > 0 ? (((totalMissed / totalRegistered) * 100).toFixed(1)) : 0}%
              </strong>{' '}
              with ≥1 missed dose
            </div>
          </div>
          <div className="text-[11px] text-stone-400 pt-2 border-t border-stone-100">
            Eligible for catch-up round
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-red-700 font-medium">
            <span>High Priority Gaps</span>
            <Flame className="w-4 h-4 text-red-600" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-bold text-red-700 tabular-nums">
              {totalHighRisk.toLocaleString()}
            </div>
            <div className="text-xs text-stone-600 mt-1">
              Multi-missed or severely overdue
            </div>
          </div>
          <div className="text-[11px] text-stone-400 pt-2 border-t border-stone-100">
            Urgent doorstep follow-up
          </div>
        </div>

        {/* Metric 5 */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Underserved Pockets</span>
            <MapPin className="w-4 h-4 text-stone-400" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-bold text-stone-900 tabular-nums">
              {lowCoverageLocalities.length} / {LOCALITIES_DATA.length}
            </div>
            <div className="text-xs text-stone-600 mt-1">
              Below {coverageBenchmark}% coverage benchmark
            </div>
          </div>
          <div className="text-[11px] text-stone-400 pt-2 border-t border-stone-100">
            Requires mobile camp deployment
          </div>
        </div>

      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Chart 1: Locality Immunization Coverage Comparison */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Immunization Coverage Breakdown by Locality
              </h2>
              <p className="text-xs text-stone-500">
                Comparing fully immunized children against missed sessions and in-transit records (%)
              </p>
            </div>
            <button
              onClick={() => onNavigate('hotspots')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={COVERAGE_COMPARISON_DATA}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ede6" vertical={false} />
                <XAxis 
                  dataKey="locality" 
                  tick={{ fontSize: 11, fill: '#57534e' }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#78716c' }} 
                  unit="%" 
                  domain={[0, 100]} 
                />
                <Tooltip 
                  formatter={(value: any, name: any) => [`${value}%`, name]}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e7e5e4', fontSize: '12px' }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} 
                />
                <Bar dataKey="fullyImmunized" name="Fully Immunized (%)" fill="#047857" radius={[4, 4, 0, 0]} />
                <Bar dataKey="missedSessions" name="Missed Sessions (%)" fill="#d97706" radius={[4, 4, 0, 0]} />
                <Bar dataKey="inTransit" name="In-Transit / Unverified (%)" fill="#a8a29e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              <strong>Equity Insight:</strong> Urban sub-centers (Shastri Nagar) reach 89.4% coverage, while remote hill and forest hamlets (Malkangiri, Bhilwara) 
              hover below 55%, primarily due to boat/footpath access limits and seasonal grazing migration.
            </span>
          </div>
        </div>

        {/* Chart 2: Vaccine Dropout Waterfall Along Child Lifecycle */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Lifecycle Dropout Waterfall
            </h2>
            <p className="text-xs text-stone-500">
              Administered rate vs. cumulative dropout from Birth to 24 Months
            </p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={VACCINE_DROPOUT_DATA}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ede6" vertical={false} />
                <XAxis 
                  dataKey="antigen" 
                  tick={{ fontSize: 10, fill: '#57534e' }}
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fontSize: 11, fill: '#78716c' }} unit="%" domain={[0, 100]} />
                <Tooltip 
                  formatter={(value: any, name: any) => [`${value}%`, name]}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e7e5e4', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="administeredRate" 
                  name="Completion Rate (%)" 
                  stroke="#0f766e" 
                  fill="#ccfbf1" 
                  fillOpacity={0.6}
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="dropoutRate" 
                  name="Cumulative Dropout (%)" 
                  stroke="#dc2626" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-red-50/70 border border-red-100 rounded-xl text-xs text-stone-700">
            <strong>Critical Gap Point:</strong> The largest single drop-off occurs between <strong>Pentavalent-3 (14 weeks)</strong> and <strong>MR-1 (9 months)</strong>, 
            where 7.9% of children fail to return due to long interval between clinic visits.
          </div>
        </div>

      </div>

      {/* Underserved Localities Roster & Operational Action List */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="p-6 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Locality Profiles &amp; Terrain Accessibility Status
            </h2>
            <p className="text-xs text-stone-500">
              Comparative logistics indicators across surveyed administrative sectors
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('outreach-planner')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Generate Route for Hotspots</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Locality Name</th>
                <th className="py-3 px-4">Terrain Category</th>
                <th className="py-3 px-4 text-right">Cohort Size</th>
                <th className="py-3 px-4 text-right">Coverage Rate</th>
                <th className="py-3 px-4 text-right">Missed Sessions</th>
                <th className="py-3 px-4 text-right">Distance to PHC</th>
                <th className="py-3 px-4">Road Access</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {LOCALITIES_DATA.map((loc) => {
                const isUnderperforming = loc.coverageRate < 65;
                return (
                  <tr key={loc.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-stone-900">
                      <div>{loc.name}</div>
                      <div className="text-[11px] text-stone-500 font-normal">{loc.nearestCenter}</div>
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">
                      <span>{loc.type}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-stone-800">
                      {loc.totalChildren}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={`font-mono tabular-nums font-bold ${
                        isUnderperforming ? 'text-red-600' : 'text-emerald-700'
                      }`}>
                        {loc.coverageRate}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-stone-800">
                      <span className="font-semibold text-amber-700">{loc.missedCount}</span>
                      <span className="text-stone-400 text-[11px]"> ({loc.highRiskCount} high)</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-stone-800">
                      {loc.distanceToPHCKm} km
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[11px] font-medium ${
                        loc.roadAccess === 'Boat/Footpath Only' 
                          ? 'text-red-700 font-semibold' 
                          : loc.roadAccess === 'Seasonal Dirt Track' 
                            ? 'text-amber-700' 
                            : 'text-stone-600'
                      }`}>
                        {loc.roadAccess}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => {
                          if (onSelectLocality) onSelectLocality(loc.id);
                          onNavigate('hotspots');
                        }}
                        className="text-emerald-700 hover:text-emerald-900 font-semibold text-xs inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Focus</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
