import React, { useState, useMemo } from 'react';
import { 
  Printer, 
  Download, 
  Users, 
  Calendar, 
  CheckSquare, 
  Square, 
  MapPin, 
  Navigation, 
  ThermometerSnowflake, 
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { ChildRecord, PriorityLevel } from '../types';
import { LOCALITIES_DATA } from '../data/syntheticData';
import { NavTab } from './Navbar';

interface OutreachPlanGeneratorProps {
  childrenRecords: ChildRecord[];
  onNavigate: (tab: NavTab) => void;
}

export const OutreachPlanGenerator: React.FC<OutreachPlanGeneratorProps> = ({
  childrenRecords,
  onNavigate
}) => {
  const [selectedLocality, setSelectedLocality] = useState<string>('LOC-01'); // Malkangiri default
  const [priorityThreshold, setPriorityThreshold] = useState<'All' | 'HighOnly' | 'HighMedium'>('HighMedium');
  const [outreachDate, setOutreachDate] = useState<string>('2024-11-15');
  const [teamLead, setTeamLead] = useState<string>('Sunita Nayak (Auxiliary Nurse Midwife)');
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  // Filter children for the generated plan
  const planChildren = useMemo(() => {
    return childrenRecords.filter(child => {
      const matchLocality = selectedLocality === 'all' || child.localityId === selectedLocality;
      let matchPriority = true;
      if (priorityThreshold === 'HighOnly') matchPriority = child.priority === 'High';
      else if (priorityThreshold === 'HighMedium') matchPriority = child.priority === 'High' || child.priority === 'Medium';

      return matchLocality && matchPriority;
    }).sort((a, b) => {
      // Prioritize High first, then highest risk score
      if (a.priority === 'High' && b.priority !== 'High') return -1;
      if (b.priority === 'High' && a.priority !== 'High') return 1;
      return b.riskScore - a.riskScore;
    });
  }, [childrenRecords, selectedLocality, priorityThreshold]);

  const activeLocalityData = LOCALITIES_DATA.find(l => l.id === selectedLocality);

  const toggleCheck = (childId: string) => {
    setCompletedItems(prev => ({ ...prev, [childId]: !prev[childId] }));
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Stop Sequence',
      'Child ID',
      'Child Alias',
      'Age (Months)',
      'Locality',
      'Priority',
      'Risk Score',
      'Days Overdue',
      'Due Antigens',
      'Guardian Contact',
      'Recommended Action',
      'Logistics Rationale'
    ];

    const rows = planChildren.map((child, idx) => [
      idx + 1,
      child.id,
      `"${child.anonymizedAlias}"`,
      child.ageMonths,
      `"${child.localityName}"`,
      child.priority,
      child.riskScore,
      child.daysOverdue,
      `"${child.missedAntigens.join(', ')}"`,
      `"${child.guardianContactAlias}"`,
      `"${child.priority === 'High' ? 'Doorstep Visit & Vaccine Admin' : 'Village Camp Referral'}"`,
      `"${child.riskFactors.primaryReason}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VaxReach_Outreach_Plan_${activeLocalityData?.name.replace(/\s+/g, '_') || 'District'}_${outreachDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 py-6">
      
      {/* Header (Hidden in print) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200 no-print">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <span>Operational Dispatch</span>
            <span aria-hidden="true">·</span>
            <span>Route Clustering</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Outreach Plan Generator
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Auto-cluster overdue children into structured field routes with cold-chain carrier instructions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Field Sheet</span>
          </button>
        </div>
      </div>

      {/* Generator Configuration Controls (Hidden in print) */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4 no-print">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          {/* Locality Selector */}
          <div>
            <label className="block text-stone-600 font-medium mb-1">Target Locality / Sector:</label>
            <select
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900 focus:outline-hidden"
            >
              <option value="all">All Localities Combined</option>
              {LOCALITIES_DATA.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name} ({loc.type})</option>
              ))}
            </select>
          </div>

          {/* Priority Threshold */}
          <div>
            <label className="block text-stone-600 font-medium mb-1">Priority Triage Filter:</label>
            <select
              value={priorityThreshold}
              onChange={(e: any) => setPriorityThreshold(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900 focus:outline-hidden"
            >
              <option value="HighMedium">High &amp; Medium Priority ({childrenRecords.filter(c => c.priority !== 'Low').length})</option>
              <option value="HighOnly">High Priority Only ({childrenRecords.filter(c => c.priority === 'High').length})</option>
              <option value="All">All Overdue Children ({childrenRecords.length})</option>
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-stone-600 font-medium mb-1">Outreach Mission Date:</label>
            <input
              type="date"
              value={outreachDate}
              onChange={(e) => setOutreachDate(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900 focus:outline-hidden"
            />
          </div>

          {/* Assigned Worker / Team Lead */}
          <div>
            <label className="block text-stone-600 font-medium mb-1">Assigned Team Lead (ANM/ASHA):</label>
            <input
              type="text"
              value={teamLead}
              onChange={(e) => setTeamLead(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900 focus:outline-hidden"
            />
          </div>

        </div>
      </div>

      {/* Printable Field Itinerary Document */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6 print:border-none print:shadow-none print:p-0">
        
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              VaxReach · Frontline Immunization Outreach Itinerary
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
              {activeLocalityData ? activeLocalityData.name : 'Combined District Sectors'} Field Route Sheet
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600 mt-1">
              <span>Date: <strong>{outreachDate}</strong></span>
              <span>Team Lead: <strong>{teamLead}</strong></span>
              <span>Target Stops: <strong>{planChildren.length} Households</strong></span>
            </div>
          </div>

          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs space-y-1 max-w-xs shrink-0">
            <div className="flex items-center gap-1.5 font-bold text-stone-900">
              <ThermometerSnowflake className="w-4 h-4 text-emerald-700" />
              <span>Cold-Chain Carrier Checklist</span>
            </div>
            <div className="text-[11px] text-stone-600">
              • 4 conditioned ice packs loaded (0°C to +8°C)<br />
              • Check vaccine vial monitor (VVM) stage<br />
              • Diluent pre-cooled for MR vaccines
            </div>
          </div>
        </div>

        {/* List of Household Outreach Stops */}
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Prioritized Household Itinerary ({planChildren.length} Children)
          </div>

          {planChildren.length === 0 ? (
            <div className="py-12 text-center text-stone-500 bg-stone-50 rounded-2xl border border-stone-200">
              <AlertCircle className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="font-semibold text-stone-800">No overdue children match the chosen criteria.</p>
              <p className="text-xs text-stone-400 mt-1">Try selecting another locality or broadening the priority filter.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {planChildren.map((child, index) => {
                const isChecked = !!completedItems[child.id];
                const isHigh = child.priority === 'High';

                return (
                  <div
                    key={child.id}
                    onClick={() => toggleCheck(child.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isChecked 
                        ? 'bg-emerald-50/50 border-emerald-300 opacity-80' 
                        : isHigh 
                          ? 'bg-red-50/20 border-stone-200 hover:border-red-300' 
                          : 'bg-stone-50/50 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      
                      {/* Checkbox button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCheck(child.id);
                        }}
                        className="mt-0.5 text-stone-400 hover:text-emerald-700 cursor-pointer"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 text-emerald-700" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>

                      {/* Content */}
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-stone-900">
                              #{index + 1} · {child.id}
                            </span>
                            <span className="text-xs text-stone-800 font-semibold">
                              {child.anonymizedAlias}
                            </span>
                            <span className="text-[11px] text-stone-500">
                              ({child.ageMonths} months old)
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                              isHigh ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {child.priority} Priority (+{child.daysOverdue}d overdue)
                            </span>
                          </div>
                        </div>

                        {/* Due Antigens and Rationale */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1 text-stone-700">
                          <div>
                            <strong className="text-stone-900">Due Antigens:</strong>{' '}
                            <span className="text-emerald-900 font-medium">
                              {child.missedAntigens.join(', ')}
                            </span>
                          </div>
                          <div>
                            <strong className="text-stone-900">Guardian Contact:</strong>{' '}
                            <span className="font-mono text-stone-600">{child.guardianContactAlias}</span>
                          </div>
                        </div>

                        <div className="text-xs text-stone-600 pt-1">
                          <strong>Operational Reason:</strong> {child.riskFactors.primaryReason}
                        </div>

                        {/* Sign-off / Field Worker Note Line for physical print */}
                        <div className="pt-2 text-[11px] text-stone-400 flex items-center justify-between border-t border-stone-100/80 print:flex hidden">
                          <span>Action Taken: [ ] Administered  [ ] Family Migrated  [ ] Refusal Counselling Needed</span>
                          <span>Worker Signature: __________________</span>
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Print Sign-off Box */}
        <div className="pt-6 border-t border-stone-200 grid grid-cols-2 gap-8 text-xs text-stone-600">
          <div>
            <div className="font-semibold text-stone-800">Team Leader Signoff:</div>
            <div className="mt-8 border-b border-stone-300 w-48" />
            <div className="text-[11px] text-stone-400 mt-1">{teamLead}</div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-stone-800">Medical Officer Verification:</div>
            <div className="mt-8 border-b border-stone-300 w-48 ml-auto" />
            <div className="text-[11px] text-stone-400 mt-1">Primary Health Centre Stamp &amp; Date</div>
          </div>
        </div>

      </div>

    </div>
  );
};
