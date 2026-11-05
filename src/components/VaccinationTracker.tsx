import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Bell, 
  BellRing, 
  Plus, 
  Edit3, 
  Trash2, 
  User, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles, 
  Info, 
  Heart,
  Save,
  X,
  MapPin,
  ExternalLink,
  Settings
} from 'lucide-react';
import { 
  UserPersonalProfile, 
  PersonalVaccineDose, 
  NotificationSettings, 
  AppNotification 
} from '../types';
import { 
  generateScheduleFromDOB, 
  INITIAL_USER_PROFILE, 
  INITIAL_ADMINISTERED_MAP 
} from '../data/syntheticData';
import { NavTab } from './Navbar';

interface VaccinationTrackerProps {
  onNavigate: (tab: NavTab) => void;
  onTriggerNotification?: (notif: AppNotification) => void;
}

export const VaccinationTracker: React.FC<VaccinationTrackerProps> = ({
  onNavigate,
  onTriggerNotification
}) => {
  // Local storage keys
  const PROFILE_KEY = 'vaxreach_user_profile_v1';
  const RECORDS_KEY = 'vaxreach_administered_records_v1';
  const SETTINGS_KEY = 'vaxreach_notification_settings_v1';

  // State: Profile
  const [profile, setProfile] = useState<UserPersonalProfile>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<UserPersonalProfile>(profile);

  // State: Administered Map { [vaccineKey]: { date, facility, batch, notes } }
  const [administeredMap, setAdministeredMap] = useState<Record<string, { date: string; facility?: string; batch?: string; notes?: string }>>(() => {
    try {
      const saved = localStorage.getItem(RECORDS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_ADMINISTERED_MAP;
    } catch {
      return INITIAL_ADMINISTERED_MAP;
    }
  });

  // State: Notification Settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      enableInApp: true,
      enableBrowserPush: false,
      remind7DaysBefore: true,
      remind1DayBefore: true,
      remindOnDueDate: true,
      remindWhenOverdue: true,
      pushPermissionStatus: 'Notification' in window ? (Notification.permission as any) : 'default'
    };
  });

  // Active view tab inside tracker
  const [activeSubTab, setActiveSubTab] = useState<'schedule' | 'upcoming' | 'history' | 'settings'>('schedule');

  // Modal: Mark Dose as Completed / Edit Record
  const [modalDose, setModalDose] = useState<PersonalVaccineDose | null>(null);
  const [modalAdminDate, setModalAdminDate] = useState<string>('');
  const [modalFacility, setModalFacility] = useState<string>('Shastri Nagar UPHC');
  const [modalBatch, setModalBatch] = useState<string>('');
  const [modalNotes, setModalNotes] = useState<string>('');

  // Persist Profile
  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch {}
  }, [profile]);

  // Persist Records
  useEffect(() => {
    try {
      localStorage.setItem(RECORDS_KEY, JSON.stringify(administeredMap));
    } catch {}
  }, [administeredMap]);

  // Persist Settings
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(notificationSettings));
    } catch {}
  }, [notificationSettings]);

  // Calculate dynamic schedule
  const scheduleTimeline = useMemo(() => {
    return generateScheduleFromDOB(profile.dateOfBirth, administeredMap);
  }, [profile.dateOfBirth, administeredMap]);

  // Compute stats and upcoming / overdue groups
  const { completedDoses, overdueDoses, upcomingDoses, nextDueDose } = useMemo(() => {
    const completed = scheduleTimeline.filter(d => d.status === 'Completed');
    const overdue = scheduleTimeline.filter(d => d.status === 'Overdue');
    const upcoming = scheduleTimeline.filter(d => d.status === 'Upcoming' || d.status === 'Due Today');

    const next = overdue.length > 0 ? overdue[0] : upcoming[0] || null;

    return {
      completedDoses: completed,
      overdueDoses: overdue,
      upcomingDoses: upcoming,
      nextDueDose: next
    };
  }, [scheduleTimeline]);

  // Calculate age string from DOB
  const ageDisplay = useMemo(() => {
    const dob = new Date(profile.dateOfBirth);
    if (isNaN(dob.getTime())) return 'Age unknown';
    const now = new Date();
    let months = (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth());
    if (now.getDate() < dob.getDate()) months--;
    if (months < 0) return 'Newborn';
    if (months < 12) return `${months} Months Old`;
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    return remMonths > 0 ? `${years}y ${remMonths}m Old` : `${years} Years Old`;
  }, [profile.dateOfBirth]);

  // Handle Mark Completed / Edit Submit
  const handleSaveDose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalDose) return;

    const dateToSave = modalAdminDate || new Date().toISOString().split('T')[0];

    const updated = {
      ...administeredMap,
      [modalDose.vaccineKey]: {
        date: dateToSave,
        facility: modalFacility.trim() || 'Community Primary Health Centre',
        batch: modalBatch.trim() || undefined,
        notes: modalNotes.trim() || undefined
      }
    };

    setAdministeredMap(updated);

    // Confetti celebration
    try {
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.6 }
      });
    } catch {}

    // Send in-app notification
    if (onTriggerNotification) {
      onTriggerNotification({
        id: `NOTIF-${Date.now()}`,
        type: 'status_update',
        title: `Vaccination Recorded: ${modalDose.vaccineName}`,
        message: `Administered on ${dateToSave} at ${modalFacility}. Next dose recalculated.`,
        date: dateToSave,
        read: false,
        severity: 'info',
        vaccineKey: modalDose.vaccineKey
      });
    }

    setModalDose(null);
  };

  // Handle Delete Record
  const handleDeleteRecord = (vaccineKey: string) => {
    if (!window.confirm('Are you sure you want to revert this vaccine record to unadministered?')) return;
    const updated = { ...administeredMap };
    delete updated[vaccineKey];
    setAdministeredMap(updated);
  };

  // Profile Save
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(profileForm);
    setIsEditingProfile(false);
  };

  // Browser push notification permission handler
  const handleRequestPushPermission = async () => {
    if (!('Notification' in window)) {
      alert('Your browser does not support the Web Notification API.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationSettings(prev => ({
        ...prev,
        enableBrowserPush: permission === 'granted',
        pushPermissionStatus: permission
      }));

      if (permission === 'granted') {
        new Notification('VaxReach Reminders Active', {
          body: 'You will receive reminders 7 days and 1 day prior to scheduled childhood vaccinations.',
          icon: '/favicon.ico'
        });
      }
    } catch (err) {
      console.error('Notification error:', err);
    }
  };

  const handleTestNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('VaxReach Vaccination Alert', {
        body: nextDueDose 
          ? `Reminder: ${nextDueDose.vaccineName} (${nextDueDose.doseNumber}) is due on ${nextDueDose.dueDate}.` 
          : 'All scheduled childhood vaccines are up to date!',
        icon: '/favicon.ico'
      });
    } else {
      alert('Browser notifications are not yet enabled. Enable them below to test.');
    }
  };

  return (
    <div className="space-y-6 py-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <span>Personal Health Passport</span>
            <span aria-hidden="true">·</span>
            <span>Indian National Immunization Schedule</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Personal Vaccination Tracker &amp; Schedule
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Log administered doses, track upcoming milestones, and receive automated schedule alerts.
          </p>
        </div>

        {/* Sub-nav switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl text-xs self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab('schedule')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'schedule' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Schedule Timeline
          </button>
          <button
            onClick={() => setActiveSubTab('upcoming')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'upcoming' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Upcoming ({upcomingDoses.length + overdueDoses.length})
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'history' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            History ({completedDoses.length})
          </button>
          <button
            onClick={() => setActiveSubTab('settings')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'settings' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5 inline mr-1" />
            Reminders
          </button>
        </div>
      </div>

      {/* Official Guidelines & Non-Prescription Disclaimer */}
      <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-4 text-xs text-emerald-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-emerald-900">National Immunization Schedule (NIS) Reference:</span>
          <p className="text-emerald-800 leading-relaxed">
            The generated schedule conforms to the Ministry of Health &amp; Family Welfare (MoHFW) UIP guidelines. 
            <strong> Medical Notice:</strong> This schedule is indicative and serves as an educational reminder. 
            Always confirm timing, contraindications, and vaccine availability with a registered medical officer or ANM.
          </p>
        </div>
      </div>

      {/* Profile Card & Next Due Highlight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Profile Card (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-sm">{profile.childName}</h3>
                <div className="text-[11px] text-stone-500">{ageDisplay}</div>
              </div>
            </div>
            <button
              onClick={() => {
                setProfileForm(profile);
                setIsEditingProfile(true);
              }}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="space-y-2 text-xs text-stone-700">
            <div className="flex justify-between">
              <span className="text-stone-500">Date of Birth:</span>
              <span className="font-mono font-medium text-stone-900">{profile.dateOfBirth}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Guardian Name:</span>
              <span className="font-medium text-stone-900">{profile.guardianName || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Contact Mobile:</span>
              <span className="font-mono text-stone-900">{profile.contactNumber || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Locality:</span>
              <span className="font-medium text-stone-900">{profile.locality || 'Shastri Nagar'}</span>
            </div>
            {profile.gender && (
              <div className="flex justify-between">
                <span className="text-stone-500">Gender:</span>
                <span className="font-medium text-stone-900">{profile.gender}</span>
              </div>
            )}
          </div>

          {/* Quick Progress Bar */}
          <div className="pt-2 border-t border-stone-100 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-stone-600 font-medium">Protection Progress:</span>
              <span className="font-mono font-bold text-emerald-800">
                {completedDoses.length} / {scheduleTimeline.length} Doses
              </span>
            </div>
            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${(completedDoses.length / scheduleTimeline.length) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>{overdueDoses.length} Overdue</span>
              <span>{upcomingDoses.length} Remaining</span>
            </div>
          </div>
        </div>

        {/* Next Due Vaccination Highlight (8 cols) */}
        <div className="lg:col-span-8 bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                <BellRing className="w-4 h-4 text-emerald-700" />
                <span>Next Scheduled Immunization Priority</span>
              </div>
              {nextDueDose && (
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  nextDueDose.status === 'Overdue' 
                    ? 'bg-red-100 text-red-800' 
                    : nextDueDose.status === 'Due Today'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {nextDueDose.status}
                </span>
              )}
            </div>

            {nextDueDose ? (
              <div className="mt-3 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <h2 className="text-xl font-bold text-stone-900">
                    {nextDueDose.vaccineName} ({nextDueDose.doseNumber})
                  </h2>
                  <div className="text-xs text-stone-600">
                    Recommended Milestone: <strong>{nextDueDose.recommendedAgeMilestone}</strong>
                  </div>
                </div>

                <p className="text-xs text-stone-600">
                  Target Prevention: {nextDueDose.targetDiseases}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="text-[10px] text-stone-400 font-semibold uppercase">Scheduled Due Date</div>
                    <div className="text-base font-bold font-mono text-stone-900 mt-0.5">
                      {nextDueDose.dueDate}
                    </div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="text-[10px] text-stone-400 font-semibold uppercase">Days Elapsed / Remaining</div>
                    <div className={`text-base font-bold font-mono mt-0.5 ${
                      nextDueDose.status === 'Overdue' ? 'text-red-700' : 'text-emerald-700'
                    }`}>
                      {nextDueDose.status === 'Overdue' ? 'Immediate Action Needed' : 'Approaching on Schedule'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-stone-500">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="font-semibold text-stone-800">All registered vaccinations are up to date!</p>
              </div>
            )}
          </div>

          {/* Quick CTAs */}
          {nextDueDose && (
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-stone-100">
              <button
                onClick={() => {
                  setModalDose(nextDueDose);
                  setModalAdminDate(new Date().toISOString().split('T')[0]);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark as Administered</span>
              </button>
              <button
                onClick={() => onNavigate('centre-finder')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>Locate Nearest Centre</span>
              </button>
              <button
                onClick={() => onNavigate('booking')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 font-medium text-xs transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                <span>Book Slot / Doorstep Visit</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Main Tab Viewport */}
      {activeSubTab === 'schedule' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Universal Immunization Programme Schedule Timeline
              </h2>
              <p className="text-xs text-stone-500">
                Milestones dynamically calculated from Date of Birth ({profile.dateOfBirth})
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-stone-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                Completed
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                Overdue
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                Upcoming
              </span>
            </div>
          </div>

          {/* Timeline List */}
          <div className="space-y-3">
            {scheduleTimeline.map((dose, idx) => {
              const isCompleted = dose.status === 'Completed';
              const isOverdue = dose.status === 'Overdue';

              return (
                <div
                  key={dose.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isCompleted 
                      ? 'bg-emerald-50/40 border-emerald-200' 
                      : isOverdue 
                        ? 'bg-red-50/30 border-red-200' 
                        : 'bg-stone-50/50 border-stone-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                      isCompleted 
                        ? 'bg-emerald-600 text-white' 
                        : isOverdue 
                          ? 'bg-red-600 text-white' 
                          : 'bg-stone-200 text-stone-700'
                    }`}>
                      {idx + 1}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-xs">{dose.vaccineName}</span>
                        <span className="text-[11px] text-stone-500">({dose.doseNumber})</span>
                      </div>
                      <div className="text-[11px] text-stone-600">
                        Milestone: <strong>{dose.recommendedAgeMilestone}</strong> · Target: {dose.targetDiseases}
                      </div>
                      {isCompleted && (
                        <div className="text-[11px] text-emerald-800 font-medium">
                          ✓ Administered on {dose.dateAdministered} ({dose.facilityAdministered || 'Health Centre'})
                          {dose.batchNumber && ` · Batch: ${dose.batchNumber}`}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <div className="text-right text-xs">
                      <div className="font-mono font-medium text-stone-900">
                        {isCompleted ? 'Completed' : `Due: ${dose.dueDate}`}
                      </div>
                      <span className={`text-[10px] font-bold ${
                        isCompleted ? 'text-emerald-700' : isOverdue ? 'text-red-700' : 'text-stone-500'
                      }`}>
                        {dose.status}
                      </span>
                    </div>

                    {isCompleted ? (
                      <button
                        onClick={() => {
                          setModalDose(dose);
                          setModalAdminDate(dose.dateAdministered || '');
                          setModalFacility(dose.facilityAdministered || '');
                          setModalBatch(dose.batchNumber || '');
                          setModalNotes(dose.notes || '');
                        }}
                        className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer"
                        title="Edit Record"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setModalDose(dose);
                          setModalAdminDate(new Date().toISOString().split('T')[0]);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer shadow-2xs"
                      >
                        Mark Done
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upcoming Vaccinations Tab */}
      {activeSubTab === 'upcoming' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h2 className="text-base font-bold text-stone-900">
              Upcoming &amp; Overdue Vaccinations ({upcomingDoses.length + overdueDoses.length})
            </h2>
            <p className="text-xs text-stone-500">
              Actionable pipeline of pending doses needing administration or clinic booking
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...overdueDoses, ...upcomingDoses].map((dose) => {
              const isOverdue = dose.status === 'Overdue';
              return (
                <div
                  key={dose.id}
                  className={`p-5 rounded-2xl border space-y-3 ${
                    isOverdue ? 'bg-red-50/30 border-red-200' : 'bg-stone-50/60 border-stone-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm">{dose.vaccineName}</h3>
                      <div className="text-xs text-stone-500">{dose.doseNumber} · {dose.recommendedAgeMilestone}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                      isOverdue ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {dose.status}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600">
                    <strong>Protects against:</strong> {dose.targetDiseases}
                  </p>

                  <div className="pt-2 border-t border-stone-200/70 flex items-center justify-between text-xs">
                    <span className="font-mono text-stone-700">Due Date: <strong>{dose.dueDate}</strong></span>
                    <button
                      onClick={() => {
                        setModalDose(dose);
                        setModalAdminDate(new Date().toISOString().split('T')[0]);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs cursor-pointer"
                    >
                      Record Given
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeSubTab === 'history' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Administered Vaccine History ({completedDoses.length} Records)
              </h2>
              <p className="text-xs text-stone-500">
                Official log of verified doses administered to {profile.childName}
              </p>
            </div>
            <button
              onClick={() => {
                const unadministered = scheduleTimeline.find(d => d.status !== 'Completed');
                if (unadministered) {
                  setModalDose(unadministered);
                  setModalAdminDate(new Date().toISOString().split('T')[0]);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Past Dose</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">Vaccine &amp; Dose</th>
                  <th className="py-3 px-4">Administered Date</th>
                  <th className="py-3 px-4">Administered Facility</th>
                  <th className="py-3 px-4">Batch No.</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {completedDoses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-stone-400">
                      No administered vaccines recorded yet.
                    </td>
                  </tr>
                ) : (
                  completedDoses.map((dose) => (
                    <tr key={dose.id} className="hover:bg-stone-50/80">
                      <td className="py-3 px-4 font-semibold text-stone-900">
                        <div>{dose.vaccineName}</div>
                        <div className="text-[11px] text-stone-500 font-normal">{dose.doseNumber}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-emerald-800">
                        {dose.dateAdministered}
                      </td>
                      <td className="py-3 px-4 text-stone-700">
                        {dose.facilityAdministered || 'Primary Health Centre'}
                      </td>
                      <td className="py-3 px-4 font-mono text-stone-500 text-[11px]">
                        {dose.batchNumber || '—'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setModalDose(dose);
                              setModalAdminDate(dose.dateAdministered || '');
                              setModalFacility(dose.facilityAdministered || '');
                              setModalBatch(dose.batchNumber || '');
                              setModalNotes(dose.notes || '');
                            }}
                            className="p-1 text-stone-500 hover:text-emerald-700"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRecord(dose.vaccineKey)}
                            className="p-1 text-stone-400 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reminders & Notification Settings Tab */}
      {activeSubTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <h2 className="text-base font-bold text-stone-900">
              Notification &amp; Reminder Preferences
            </h2>
            <p className="text-xs text-stone-500">
              Configure timing offsets for automated child immunization reminders
            </p>
          </div>

          <div className="space-y-4 max-w-xl text-xs">
            
            {/* Browser Push Permission Section */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-900 text-sm">Web Push Notifications</div>
                  <div className="text-stone-500 text-[11px]">Receive reminders directly on your device even when not on the page.</div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  notificationSettings.pushPermissionStatus === 'granted'
                    ? 'bg-emerald-100 text-emerald-800'
                    : notificationSettings.pushPermissionStatus === 'denied'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-stone-200 text-stone-700'
                }`}>
                  Status: {notificationSettings.pushPermissionStatus}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleRequestPushPermission}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold cursor-pointer"
                >
                  Enable Browser Push Notifications
                </button>
                {notificationSettings.pushPermissionStatus === 'granted' && (
                  <button
                    type="button"
                    onClick={handleTestNotification}
                    className="px-3 py-2 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl font-medium cursor-pointer"
                  >
                    Send Test Alert
                  </button>
                )}
              </div>
            </div>

            {/* In-app reminder toggles */}
            <div className="space-y-2.5 pt-2">
              <div className="font-bold text-stone-800">Reminder Timing Windows:</div>
              
              <label className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notificationSettings.remind7DaysBefore}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, remind7DaysBefore: e.target.checked }))}
                  className="w-4 h-4 rounded-sm accent-emerald-700"
                />
                <div>
                  <div className="font-semibold text-stone-900">7 Days Before Due Date</div>
                  <div className="text-stone-500 text-[11px]">Advance notice to arrange clinic visit or work schedule.</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notificationSettings.remind1DayBefore}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, remind1DayBefore: e.target.checked }))}
                  className="w-4 h-4 rounded-sm accent-emerald-700"
                />
                <div>
                  <div className="font-semibold text-stone-900">1 Day Before Due Date</div>
                  <div className="text-stone-500 text-[11px]">Final reminder to carry child immunization card.</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notificationSettings.remindOnDueDate}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, remindOnDueDate: e.target.checked }))}
                  className="w-4 h-4 rounded-sm accent-emerald-700"
                />
                <div>
                  <div className="font-semibold text-stone-900">On Scheduled Due Date</div>
                  <div className="text-stone-500 text-[11px]">Morning reminder confirming local session timings.</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notificationSettings.remindWhenOverdue}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, remindWhenOverdue: e.target.checked }))}
                  className="w-4 h-4 rounded-sm accent-emerald-700"
                />
                <div>
                  <div className="font-semibold text-stone-900">Overdue Follow-up Alert</div>
                  <div className="text-stone-500 text-[11px]">Follow-up prompt to book catch-up appointment with health worker.</div>
                </div>
              </label>
            </div>

          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-200 max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-sm">Edit Vaccination Profile</h3>
              <button onClick={() => setIsEditingProfile(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Child / Individual Name *</label>
                <input
                  type="text"
                  required
                  value={profileForm.childName}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, childName: e.target.value }))}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Date of Birth (DOB) *</label>
                <input
                  type="date"
                  required
                  value={profileForm.dateOfBirth}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white"
                />
                <span className="text-[10px] text-stone-400 mt-0.5 block">
                  Used to generate exact National Immunization Schedule due dates.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Gender</label>
                  <select
                    value={profileForm.gender || 'Male'}
                    onChange={(e: any) => setProfileForm(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Blood Group</label>
                  <input
                    type="text"
                    placeholder="e.g. B+"
                    value={profileForm.bloodGroup || ''}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, bloodGroup: e.target.value }))}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Parent / Guardian Name</label>
                <input
                  type="text"
                  value={profileForm.guardianName || ''}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, guardianName: e.target.value }))}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={profileForm.contactNumber || ''}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, contactNumber: e.target.value }))}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-3.5 py-2 text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Administration Modal */}
      {modalDose && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-200 max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <div className="text-[10px] uppercase font-bold text-emerald-800">Record Vaccine Dose</div>
                <h3 className="font-bold text-stone-900 text-base">{modalDose.vaccineName}</h3>
              </div>
              <button onClick={() => setModalDose(null)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDose} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Date Administered *</label>
                <input
                  type="date"
                  required
                  value={modalAdminDate}
                  onChange={(e) => setModalAdminDate(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-mono focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Administered At (Hospital / PHC / Clinic) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shastri Nagar UPHC or District Civil Hospital"
                  value={modalFacility}
                  onChange={(e) => setModalFacility(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Batch No. (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. MR-2026-99"
                    value={modalBatch}
                    onChange={(e) => setModalBatch(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Dose Sequence</label>
                  <input
                    type="text"
                    readOnly
                    value={modalDose.doseNumber}
                    className="w-full p-2 bg-stone-100 border border-stone-200 rounded-xl text-stone-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Clinical / Health Worker Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Well tolerated, paracetamol advised in case of mild low-grade fever..."
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setModalDose(null)}
                  className="px-3.5 py-2 text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold cursor-pointer"
                >
                  Confirm &amp; Update History
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
