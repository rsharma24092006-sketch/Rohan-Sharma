export type PriorityLevel = 'High' | 'Medium' | 'Low';

export interface ChildRecord {
  id: string; // e.g. "VR-2024-0104"
  anonymizedAlias: string; // e.g. "Child A.K. (14m)"
  ageMonths: number;
  localityId: string;
  localityName: string;
  guardianContactAlias: string; // e.g. "+91 98XXX-44102 (Mother)"
  lastVaccineDate: string; // ISO date string
  daysOverdue: number;
  missedAntigens: string[]; // e.g. ["MR-1 (Measles-Rubella)", "DPT Booster"]
  administeredAntigens: string[]; // e.g. ["BCG", "OPV-0", "Pentavalent-1", "Pentavalent-2"]
  fullyImmunized: boolean;
  priority: PriorityLevel;
  riskScore: number; // 0 to 100
  riskFactors: {
    missedSessionsCount: number;
    daysOverdueFactor: number;
    distanceToPHCKm: number;
    isMigrated: boolean;
    hesitancyReported: boolean;
    primaryReason: string;
  };
  followUpNotes: FollowUpNote[];
  status: 'Pending Outreach' | 'Scheduled for Visit' | 'Contacted - Follow Up Needed' | 'Re-enrolled' | 'Vaccination Completed';
  assignedWorker?: string;
}

export interface LocalityData {
  id: string;
  name: string;
  type: 'Remote Tribal' | 'Riverine Rural' | 'Peri-Urban Slum' | 'Semi-Rural Block' | 'District Sub-Center';
  totalChildren: number;
  fullyImmunized: number;
  missedCount: number;
  highRiskCount: number;
  coverageRate: number; // percentage e.g. 64.2
  distanceToPHCKm: number;
  roadAccess: 'Paved' | 'Seasonal Dirt Track' | 'Boat/Footpath Only';
  nearestCenter: string;
  activeFieldWorkers: number;
  coordinates: { x: number; y: number }; // percentage coordinates for interactive map canvas
  description: string;
}

export interface MigrationRecord {
  id: string;
  childId: string;
  previousLocality: string;
  currentLocality: string;
  flagDate: string;
  status: 'In-Transit' | 'Unconfirmed Arrival' | 'Re-Enrolled' | 'Tracing Required';
  sourceHealthCenter: string;
  transitReason: string;
  authorizedSafeguardNote: string;
  lastContactDate: string;
}

export interface FollowUpNote {
  id: string;
  childId: string;
  date: string;
  category: 'Schedule Awareness Needed' | 'Medical Officer Conversation Required' | 'Doorstep Visit Scheduled' | 'Recent Migration Reported' | 'Vaccine Hesitancy Addressed' | 'General Note';
  noteText: string;
  workerName: string;
}

export interface BookingRecord {
  bookingId: string;
  childIdentifier: string;
  parentName: string;
  contactNumber: string;
  locality: string;
  childAgeMonths: number;
  preferredDate: string;
  timeSlot: string;
  sessionType: 'Doorstep Outreach Visit' | 'Primary Health Centre (PHC) Walk-in' | 'Mobile Village Camp';
  requestedAntigens: string[];
  specialNeeds: string;
  status: 'Confirmed' | 'Completed' | 'Pending Verification' | 'Rescheduled';
  createdAt: string;
}

export interface VaccinationCentre {
  id: string;
  name: string;
  category: 'Primary Health Centre (PHC)' | 'Community Health Centre (CHC)' | 'District Civil Hospital' | 'Urban Health Post' | 'Sub-Centre';
  address: string;
  locality: string;
  pinCode: string;
  coordinates: { lat: number; lng: number };
  operatingHours: string;
  contactPhone: string;
  availableVaccines: string[];
  coldChainStatus: 'Active Solar Refrigeration' | 'Continuous Grid Cold-Chain' | 'Daily Carrier Supply' | 'Deep Freeze Hub';
  walkInAllowed: boolean;
  distanceKm?: number;
  isVerifiedSample: boolean;
  specialNotice?: string;
}

export interface PersonalVaccineDose {
  id: string;
  vaccineKey: string;
  vaccineName: string;
  doseNumber: string;
  recommendedAgeMilestone: string;
  targetDiseases: string;
  dueDate: string; // ISO YYYY-MM-DD
  dateAdministered?: string; // ISO YYYY-MM-DD
  batchNumber?: string;
  facilityAdministered?: string;
  status: 'Completed' | 'Upcoming' | 'Overdue' | 'Due Today';
  notes?: string;
}

export interface UserPersonalProfile {
  childName: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  guardianName?: string;
  contactNumber?: string;
  locality?: string;
  bloodGroup?: string;
}

export interface AppNotification {
  id: string;
  type: 'due_today' | 'reminder_1d' | 'reminder_7d' | 'overdue' | 'status_update' | 'custom';
  title: string;
  message: string;
  date: string;
  read: boolean;
  vaccineKey?: string;
  severity: 'high' | 'medium' | 'info';
}

export interface NotificationSettings {
  enableInApp: boolean;
  enableBrowserPush: boolean;
  remind7DaysBefore: boolean;
  remind1DayBefore: boolean;
  remindOnDueDate: boolean;
  remindWhenOverdue: boolean;
  pushPermissionStatus: 'default' | 'granted' | 'denied';
}

