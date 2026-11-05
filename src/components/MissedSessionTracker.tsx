import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronRight, 
  AlertCircle, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  UserCheck, 
  Plus, 
  Calendar,
  X,
  FileText,
  Share2
} from 'lucide-react';
import { ChildRecord, PriorityLevel, FollowUpNote } from '../types';
import { LOCALITIES_DATA } from '../data/syntheticData';
import { NavTab } from './Navbar';

interface MissedSessionTrackerProps {
  childrenRecords: ChildRecord[];
  onUpdateRecord: (updated: ChildRecord) => void;
  onNavigate: (tab: NavTab) => void;
  onBookForChild?: (child: ChildRecord) => void;
}

export const MissedSessionTracker: React.FC<MissedSessionTrackerProps> = ({
  childrenRecords,
  onUpdateRecord,
  onNavigate,
  onBookForChild
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'All' | PriorityLevel>('All');
  const [localityFilter, setLocalityFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<'daysOverdue' | 'riskScore' | 'ageMonths' | 'localityName'>('daysOverdue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Selected child modal state
  const [selectedChild, setSelectedChild] = useState<ChildRecord | null>(null);
  const [showAddNote, setShowAddNote] = useState(false);
  const [noteCategory, setNoteCategory] = useState<FollowUpNote['category']>('Doorstep Visit Scheduled');
  const [noteContent, setNoteContent] = useState('');
  const [workerNameInput, setWorkerNameInput] = useState('Ananya Sen (Staff Nurse)');

  // Filtered and sorted children
  const filteredChildren = useMemo(() => {
    return childrenRecords.filter((child) => {
      // Search
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !query ||
        child.id.toLowerCase().includes(query) ||
        child.anonymizedAlias.toLowerCase().includes(query) ||
        child.localityName.toLowerCase().includes(query) ||
        child.missedAntigens.some(antigen => antigen.toLowerCase().includes(query));

      // Priority
      const matchesPriority = priorityFilter === 'All' || child.priority === priorityFilter;

      // Locality
      const matchesLocality = localityFilter === 'All' || child.localityId === localityFilter;

      return matchesSearch && matchesPriority && matchesLocality;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortField === 'daysOverdue') comparison = a.daysOverdue - b.daysOverdue;
      else if (sortField === 'riskScore') comparison = a.riskScore - b.riskScore;
      else if (sortField === 'ageMonths') comparison = a.ageMonths - b.ageMonths;
      else if (sortField === 'localityName') comparison = a.localityName.localeCompare(b.localityName);

      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [childrenRecords, searchQuery, priorityFilter, localityFilter, sortField, sortOrder]);

  const handleSortToggle = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChild || !noteContent.trim()) return;

    const newNote: FollowUpNote = {
      id: `NOTE-${Date.now().toString().slice(-4)}`,
      childId: selectedChild.id,
      date: new Date().toISOString().split('T')[0],
      category: noteCategory,
      noteText: noteContent.trim(),
      workerName: workerNameInput.trim() || 'Health Worker'
    };

    const updatedChild: ChildRecord = {
      ...selectedChild,
      followUpNotes: [newNote, ...selectedChild.followUpNotes],
      status: noteCategory === 'Doorstep Visit Scheduled' ? 'Scheduled for Visit' : selectedChild.status
    };

    onUpdateRecord(updatedChild);
    setSelectedChild(updatedChild);
    setNoteContent('');
    setShowAddNote(false);
  };

  return (
    <div className="space-y-6 py-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <span>Surveillance Roster</span>
            <span aria-hidden="true">·</span>
            <span>Follow-up Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Missed-Session Tracker
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Identify children with overdue doses, inspect risk factors, and log field follow-ups.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('outreach-planner')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Generate Field Route</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Child ID, Locality, or Vaccine (e.g. MR-1, VR-2024)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-600 focus:bg-white"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Priority Filter */}
          <div className="md:col-span-3 flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl text-xs">
            {(['All', 'High', 'Medium', 'Low'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`flex-1 py-1.5 font-medium rounded-lg transition-colors cursor-pointer text-center ${
                  priorityFilter === p
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Locality Filter Dropdown */}
          <div className="md:col-span-4 flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-400 shrink-0" />
            <select
              value={localityFilter}
              onChange={(e) => setLocalityFilter(e.target.value)}
              className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 font-medium focus:outline-hidden focus:ring-1 focus:ring-emerald-600 cursor-pointer"
            >
              <option value="All">All Localities</option>
              {LOCALITIES_DATA.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Results Count & Quick Metrics */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div>
            Showing <strong className="text-stone-900 font-mono">{filteredChildren.length}</strong> of{' '}
            <span className="font-mono">{childrenRecords.length}</span> children with overdue doses
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-red-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              High Priority (Urgent)
            </span>
            <span className="flex items-center gap-1 text-amber-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Medium Priority
            </span>
            <span className="flex items-center gap-1 text-stone-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-stone-400" />
              Low Priority
            </span>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Child Identifier</th>
                <th className="py-3 px-4">
                  <button 
                    onClick={() => handleSortToggle('localityName')}
                    className="flex items-center gap-1 hover:text-stone-900 cursor-pointer"
                  >
                    <span>Locality</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-4">Missed Antigens</th>
                <th className="py-3 px-4 text-right">
                  <button 
                    onClick={() => handleSortToggle('daysOverdue')}
                    className="flex items-center gap-1 ml-auto hover:text-stone-900 cursor-pointer"
                  >
                    <span>Days Overdue</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-4 text-center">
                  <button 
                    onClick={() => handleSortToggle('riskScore')}
                    className="flex items-center gap-1 mx-auto hover:text-stone-900 cursor-pointer"
                  >
                    <span>Risk Score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-4">Follow-up Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredChildren.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-500">
                    <AlertCircle className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                    <p className="font-medium text-stone-800">No children match the selected filters.</p>
                    <p className="text-xs text-stone-400 mt-1">Try resetting the search query or priority filters.</p>
                  </td>
                </tr>
              ) : (
                filteredChildren.map((child) => {
                  const isHighPriority = child.priority === 'High';
                  const isMediumPriority = child.priority === 'Medium';
                  return (
                    <tr 
                      key={child.id}
                      onClick={() => setSelectedChild(child)}
                      className={`hover:bg-emerald-50/40 transition-colors cursor-pointer ${
                        isHighPriority ? 'bg-red-50/20' : ''
                      }`}
                    >
                      {/* ID and Age */}
                      <td className="py-3.5 px-4 font-mono font-medium text-stone-900">
                        <div className="font-semibold text-emerald-900">{child.id}</div>
                        <div className="text-[11px] text-stone-500 font-sans">{child.anonymizedAlias}</div>
                      </td>

                      {/* Locality */}
                      <td className="py-3.5 px-4 text-stone-700">
                        <div className="font-medium text-stone-900">{child.localityName}</div>
                        <div className="text-[11px] text-stone-500">
                          {child.riskFactors.distanceToPHCKm} km to PHC
                          {child.riskFactors.isMigrated && ' · Migrant'}
                        </div>
                      </td>

                      {/* Missed antigens */}
                      <td className="py-3.5 px-4">
                        <div className="text-stone-800 font-medium">
                          {child.missedAntigens.join(', ')}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          Last dose: {child.lastVaccineDate}
                        </div>
                      </td>

                      {/* Days Overdue */}
                      <td className="py-3.5 px-4 text-right">
                        <div className={`font-mono tabular-nums font-bold text-sm ${
                          child.daysOverdue > 100 
                            ? 'text-red-700' 
                            : child.daysOverdue > 45 
                              ? 'text-amber-700' 
                              : 'text-stone-800'
                        }`}>
                          +{child.daysOverdue}d
                        </div>
                        <div className="text-[11px] text-stone-400">over schedule</div>
                      </td>

                      {/* Priority and Score */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            isHighPriority 
                              ? 'bg-red-600' 
                              : isMediumPriority 
                                ? 'bg-amber-500' 
                                : 'bg-stone-400'
                          }`} />
                          <span className="font-semibold text-stone-900">{child.priority}</span>
                          <span className="font-mono text-stone-500 tabular-nums text-[11px]">
                            ({child.riskScore})
                          </span>
                        </div>
                      </td>

                      {/* Follow-up Status */}
                      <td className="py-3.5 px-4 text-stone-700">
                        <div className="text-xs font-medium text-stone-800">{child.status}</div>
                        {child.followUpNotes.length > 0 && (
                          <div className="text-[11px] text-emerald-800 truncate max-w-[160px]">
                            {child.followUpNotes[0].workerName}: {child.followUpNotes[0].category}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedChild(child)}
                            className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                            title="Inspect Child Record & Risk Breakdown"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Child Detail Modal */}
      {selectedChild && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl p-6 sm:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  <span>Anonymized Child Record</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{selectedChild.id}</span>
                </div>
                <h2 className="text-xl font-bold text-stone-900 mt-1">
                  {selectedChild.anonymizedAlias} · {selectedChild.localityName}
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Guardian Contact Alias: {selectedChild.guardianContactAlias}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedChild(null);
                  setShowAddNote(false);
                }}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Priority & Risk Rationale Card */}
            <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
              selectedChild.priority === 'High' 
                ? 'bg-red-50/60 border-red-200 text-red-950' 
                : 'bg-stone-50 border-stone-200 text-stone-900'
            }`}>
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <span>Explainable Priority Assessment: {selectedChild.priority} Priority (Risk Score: {selectedChild.riskScore}/100)</span>
                </span>
                <span className="font-mono">+{selectedChild.daysOverdue} Days Overdue</span>
              </div>
              <p className="text-stone-700 leading-relaxed">
                <strong>Logistics Factor:</strong> {selectedChild.riskFactors.primaryReason}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-stone-600 pt-1 border-t border-stone-200/60">
                <span>Distance: {selectedChild.riskFactors.distanceToPHCKm} km</span>
                <span>Missed Sessions: {selectedChild.riskFactors.missedSessionsCount}</span>
                <span>Migration Status: {selectedChild.riskFactors.isMigrated ? 'Displaced / In-Transit' : 'Resident'}</span>
                <span>Caregiver Hesitance: {selectedChild.riskFactors.hesitancyReported ? 'Reported' : 'None'}</span>
              </div>
            </div>

            {/* Vaccine History & Missed Antigen Comparison */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Vaccination Status &amp; Missing Doses
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                
                <div className="p-3 bg-red-50/60 border border-red-100 rounded-xl space-y-1.5">
                  <div className="font-semibold text-red-900 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span>DUE / MISSED DOSES</span>
                  </div>
                  <ul className="space-y-1 text-red-800">
                    {selectedChild.missedAntigens.map((antigen, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <span>{antigen}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl space-y-1.5">
                  <div className="font-semibold text-emerald-900 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-700" />
                    <span>ADMINISTERED DOSES</span>
                  </div>
                  <div className="text-emerald-800 text-[11px] leading-relaxed">
                    {selectedChild.administeredAntigens.join(', ') || 'No prior doses logged.'}
                  </div>
                </div>

              </div>
            </div>

            {/* Follow-up Notes History */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Field Follow-up Notes ({selectedChild.followUpNotes.length})</span>
                </h3>
                <button
                  onClick={() => setShowAddNote(!showAddNote)}
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Note</span>
                </button>
              </div>

              {/* Add Note Form */}
              {showAddNote && (
                <form onSubmit={handleAddNoteSubmit} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div className="text-xs font-semibold text-stone-800">Log Field Observation</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-stone-600 font-medium mb-1">Observation Category:</label>
                      <select
                        value={noteCategory}
                        onChange={(e: any) => setNoteCategory(e.target.value)}
                        className="w-full p-2 bg-white border border-stone-200 rounded-lg text-xs"
                      >
                        <option value="Doorstep Visit Scheduled">Doorstep Visit Scheduled</option>
                        <option value="Schedule Awareness Needed">Schedule Awareness Needed</option>
                        <option value="Medical Officer Conversation Required">Medical Officer Conversation Required</option>
                        <option value="Recent Migration Reported">Recent Migration Reported</option>
                        <option value="Vaccine Hesitancy Addressed">Vaccine Hesitancy Addressed</option>
                        <option value="General Note">General Note</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-stone-600 font-medium mb-1">Worker Name / Role:</label>
                      <input
                        type="text"
                        value={workerNameInput}
                        onChange={(e) => setWorkerNameInput(e.target.value)}
                        className="w-full p-2 bg-white border border-stone-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Note Details:</label>
                    <textarea
                      rows={2}
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="e.g. Discussed with mother; confirmed visit date for mobile team rotation..."
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-700 focus:outline-hidden"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddNote(false)}
                      className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer"
                    >
                      Save Observation
                    </button>
                  </div>
                </form>
              )}

              {/* Notes List */}
              {selectedChild.followUpNotes.length === 0 ? (
                <div className="text-xs text-stone-400 italic p-3 bg-stone-50 rounded-xl">
                  No field notes recorded yet for this child.
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedChild.followUpNotes.map((note) => (
                    <div key={note.id} className="p-3 bg-stone-50 border border-stone-200/80 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between text-stone-500">
                        <span className="font-semibold text-emerald-900">{note.category}</span>
                        <span className="font-mono text-[11px]">{note.date}</span>
                      </div>
                      <p className="text-stone-700">{note.noteText}</p>
                      <div className="text-[11px] text-stone-400">Logged by: {note.workerName}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-stone-500">
                Status: <span className="font-semibold text-stone-800">{selectedChild.status}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const childToBook = selectedChild;
                    setSelectedChild(null);
                    if (onBookForChild) {
                      onBookForChild(childToBook);
                    } else {
                      onNavigate('booking');
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Appointment for Child</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
