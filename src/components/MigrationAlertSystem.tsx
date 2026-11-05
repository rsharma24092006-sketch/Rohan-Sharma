import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  FileText, 
  Lock, 
  RefreshCw,
  Search,
  ExternalLink,
  UserCheck
} from 'lucide-react';
import { MigrationRecord } from '../types';
import { INITIAL_MIGRATION_ALERTS } from '../data/syntheticData';
import { NavTab } from './Navbar';

interface MigrationAlertSystemProps {
  onNavigate: (tab: NavTab) => void;
  onBookForChildId?: (childId: string) => void;
}

export const MigrationAlertSystem: React.FC<MigrationAlertSystemProps> = ({
  onNavigate,
  onBookForChildId
}) => {
  const [migrationAlerts, setMigrationAlerts] = useState<MigrationRecord[]>(INITIAL_MIGRATION_ALERTS);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedAlert, setSelectedAlert] = useState<MigrationRecord | null>(null);

  const handleStatusChange = (alertId: string, newStatus: MigrationRecord['status']) => {
    setMigrationAlerts(prev => prev.map(alert => {
      if (alert.id === alertId) {
        return { ...alert, status: newStatus };
      }
      return alert;
    }));
    if (selectedAlert && selectedAlert.id === alertId) {
      setSelectedAlert(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const filteredAlerts = migrationAlerts.filter(alert => {
    const q = searchFilter.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      alert.childId.toLowerCase().includes(q) ||
      alert.previousLocality.toLowerCase().includes(q) ||
      alert.currentLocality.toLowerCase().includes(q) ||
      alert.transitReason.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'All' || alert.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 py-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <span>Inter-District Surveillance</span>
            <span aria-hidden="true">·</span>
            <span>Continuity of Care</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Migration Alert &amp; Record Reconciliation System
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Identify children whose immunization records ceased in prior localities due to circular migration.
          </p>
        </div>

        <button
          onClick={() => onNavigate('tracker')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors cursor-pointer self-start md:self-auto"
        >
          <span>View All Overdue Children</span>
        </button>
      </div>

      {/* Prominent Privacy & Governance Notice Banner */}
      <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 sm:p-5 text-xs text-amber-950 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
          <Lock className="w-4 h-4 text-amber-700" />
          <span>Cross-Boundary Data Governance &amp; Privacy Safeguards</span>
        </div>
        <p className="leading-relaxed text-amber-900/90">
          <strong>Notice:</strong> Real cross-locality record linking requires strict statutory authorization, 
          cryptographic anonymization (e.g. zero-knowledge proof tokens), parental consent, and physical verification 
          by accredited frontline health workers (ASHA/ANM). Records shown here are synthetic demonstration cases representing 
          common circular labor migration trajectories.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Child ID, source, or reason..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-emerald-700 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-stone-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-hidden"
          >
            <option value="All">All Statuses ({migrationAlerts.length})</option>
            <option value="In-Transit">In-Transit</option>
            <option value="Unconfirmed Arrival">Unconfirmed Arrival</option>
            <option value="Tracing Required">Tracing Required</option>
            <option value="Re-Enrolled">Re-Enrolled</option>
          </select>
        </div>
      </div>

      {/* Alert Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAlerts.map((alert) => {
          const isReEnrolled = alert.status === 'Re-Enrolled';
          const isTracing = alert.status === 'Tracing Required';

          return (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl bg-white border transition-all ${
                isReEnrolled 
                  ? 'border-emerald-200' 
                  : isTracing 
                    ? 'border-red-200 bg-red-50/10' 
                    : 'border-stone-200'
              } shadow-xs space-y-4`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-stone-900">{alert.childId}</span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span className="text-stone-500">Alert Ref: {alert.id}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${
                    isReEnrolled 
                      ? 'bg-emerald-600' 
                      : isTracing 
                        ? 'bg-red-600' 
                        : 'bg-amber-500'
                  }`} />
                  <span className="font-semibold text-stone-900 text-xs">{alert.status}</span>
                </div>
              </div>

              {/* Transit Route Visualization */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="text-[10px] text-stone-400 font-semibold uppercase">Previous Locality</div>
                  <div className="font-medium text-stone-800">{alert.previousLocality}</div>
                  <div className="text-[11px] text-stone-500">{alert.sourceHealthCenter}</div>
                </div>

                <div className="px-2 text-stone-400 flex flex-col items-center">
                  <ArrowLeftRight className="w-4 h-4 text-emerald-700" />
                  <span className="text-[9px] uppercase tracking-wider font-semibold text-emerald-800 mt-0.5">Transit</span>
                </div>

                <div className="space-y-0.5 text-right">
                  <div className="text-[10px] text-stone-400 font-semibold uppercase">Current Locality</div>
                  <div className="font-medium text-stone-800">{alert.currentLocality}</div>
                  <div className="text-[11px] text-stone-500">Flagged: {alert.flagDate}</div>
                </div>
              </div>

              {/* Reason & Action Note */}
              <div className="text-xs space-y-1.5">
                <div>
                  <strong className="text-stone-700">Migration Context:</strong>{' '}
                  <span className="text-stone-600">{alert.transitReason}</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  {alert.authorizedSafeguardNote}
                </p>
              </div>

              {/* Action Controls */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-stone-500 text-[11px]">Update Status:</span>
                  <select
                    value={alert.status}
                    onChange={(e: any) => handleStatusChange(alert.id, e.target.value)}
                    className="p-1 text-xs bg-stone-100 border border-stone-200 rounded-md font-medium text-stone-800 cursor-pointer"
                  >
                    <option value="In-Transit">In-Transit</option>
                    <option value="Unconfirmed Arrival">Unconfirmed Arrival</option>
                    <option value="Tracing Required">Tracing Required</option>
                    <option value="Re-Enrolled">Re-Enrolled</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    if (onBookForChildId) onBookForChildId(alert.childId);
                    else onNavigate('booking');
                  }}
                  className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
                >
                  <span>Schedule Catch-up</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
