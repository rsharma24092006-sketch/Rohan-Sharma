import { ChildRecord, LocalityData, MigrationRecord, BookingRecord, PriorityLevel } from '../types';

export const LOCALITIES_DATA: LocalityData[] = [
  {
    id: 'LOC-01',
    name: 'Malkangiri Hill Ridge',
    type: 'Remote Tribal',
    totalChildren: 184,
    fullyImmunized: 89,
    missedCount: 95,
    highRiskCount: 52,
    coverageRate: 48.4,
    distanceToPHCKm: 18.2,
    roadAccess: 'Boat/Footpath Only',
    nearestCenter: 'Malkangiri Sub-Divisional Hospital',
    activeFieldWorkers: 2,
    coordinates: { x: 18, y: 72 },
    description: 'Elevated tribal hamlets across forest river crossings. High seasonal migration and terrain bottlenecks hinder cold-chain carrier transit.'
  },
  {
    id: 'LOC-02',
    name: 'Bhilwara Forest Hamlet',
    type: 'Remote Tribal',
    totalChildren: 210,
    fullyImmunized: 114,
    missedCount: 96,
    highRiskCount: 46,
    coverageRate: 54.3,
    distanceToPHCKm: 14.5,
    roadAccess: 'Seasonal Dirt Track',
    nearestCenter: 'Bhilwara Block Primary Health Centre',
    activeFieldWorkers: 3,
    coordinates: { x: 34, y: 35 },
    description: 'Dispersed pastoral dwellings. High drop-out between Pentavalent-1 and Pentavalent-3 due to grazing migration.'
  },
  {
    id: 'LOC-03',
    name: 'Kaveri Riverine Reach',
    type: 'Riverine Rural',
    totalChildren: 295,
    fullyImmunized: 180,
    missedCount: 115,
    highRiskCount: 38,
    coverageRate: 61.0,
    distanceToPHCKm: 11.0,
    roadAccess: 'Boat/Footpath Only',
    nearestCenter: 'Kaveri Riverbank Outreach Post',
    activeFieldWorkers: 4,
    coordinates: { x: 62, y: 68 },
    description: 'Island and sandbank community cut off during high water periods. Mobile boat clinic sessions needed for cold-chain vaccine delivery.'
  },
  {
    id: 'LOC-04',
    name: 'Sitapur Peri-Urban Settlement',
    type: 'Peri-Urban Slum',
    totalChildren: 440,
    fullyImmunized: 302,
    missedCount: 138,
    highRiskCount: 31,
    coverageRate: 68.6,
    distanceToPHCKm: 4.8,
    roadAccess: 'Paved',
    nearestCenter: 'Sitapur Urban Health Clinic',
    activeFieldWorkers: 5,
    coordinates: { x: 74, y: 38 },
    description: 'High population density with rapid circular migration of construction and daily-wage families. Requires flexible evening or Sunday outreach.'
  },
  {
    id: 'LOC-05',
    name: 'Dharmanagar West Block',
    type: 'Semi-Rural Block',
    totalChildren: 360,
    fullyImmunized: 284,
    missedCount: 76,
    highRiskCount: 15,
    coverageRate: 78.9,
    distanceToPHCKm: 6.2,
    roadAccess: 'Paved',
    nearestCenter: 'Dharmanagar Community Health Centre',
    activeFieldWorkers: 4,
    coordinates: { x: 42, y: 78 },
    description: 'Mixed agricultural valley. Moderate coverage; persistent gaps in scheduled 9-month Measles-Rubella dose due to crop harvesting periods.'
  },
  {
    id: 'LOC-06',
    name: 'Shastri Nagar Sub-Center',
    type: 'District Sub-Center',
    totalChildren: 520,
    fullyImmunized: 465,
    missedCount: 55,
    highRiskCount: 8,
    coverageRate: 89.4,
    distanceToPHCKm: 2.1,
    roadAccess: 'Paved',
    nearestCenter: 'District Civil Hospital & Maternal Hub',
    activeFieldWorkers: 6,
    coordinates: { x: 82, y: 22 },
    description: 'Established health sub-center with reliable daily cold-chain refrigeration and well-mapped household rosters.'
  }
];

export const VACCINE_SCHEDULE_GUIDELINES = [
  {
    age: 'At Birth',
    vaccines: ['BCG', 'OPV-0', 'Hepatitis B (Birth Dose)'],
    purpose: 'Tuberculosis, Polio, and early viral Hepatitis B infection'
  },
  {
    age: '6 Weeks',
    vaccines: ['Pentavalent-1 (DPT+HepB+Hib)', 'OPV-1', 'Rotavirus-1', 'PCV-1'],
    purpose: 'Diphtheria, Pertussis, Tetanus, Hib, Rotavirus Diarrhoea, Pneumonia'
  },
  {
    age: '10 Weeks',
    vaccines: ['Pentavalent-2', 'OPV-2', 'Rotavirus-2'],
    purpose: 'Second dose booster sequence'
  },
  {
    age: '14 Weeks',
    vaccines: ['Pentavalent-3', 'OPV-3', 'Rotavirus-3', 'PCV-2', 'fIPV'],
    purpose: 'Primary series completion before maternal antibodies wane'
  },
  {
    age: '9 - 12 Months',
    vaccines: ['MR-1 (Measles-Rubella)', 'PCV Booster', 'JE-1 (Endemic Areas)', 'Vitamin A (Dose 1)'],
    purpose: 'Measles outbreaks, Rubella congenital defects, vision protection'
  },
  {
    age: '16 - 24 Months',
    vaccines: ['MR-2', 'DPT Booster 1', 'OPV Booster', 'JE-2'],
    purpose: 'Long-term immunity preservation through toddlerhood'
  },
  {
    age: '5 - 6 Years',
    vaccines: ['DPT Booster 2'],
    purpose: 'School-age immunity against Diphtheria and Whooping Cough'
  }
];

export function computeExplainableRisk(factors: {
  missedSessionsCount: number;
  daysOverdue: number;
  distanceKm: number;
  isMigrated: boolean;
  hesitancyReported: boolean;
}): { score: number; priority: PriorityLevel; reasons: string[] } {
  // Model weights designed for transparent logistics explainability
  // 35% weight: repeated missed sessions
  // 25% weight: overdue elapsed days
  // 20% weight: travel distance / remote terrain
  // 15% weight: migration displacement
  // 5% weight: reported caregiver hesitancy

  const missedScore = Math.min(factors.missedSessionsCount * 22, 35);
  const overdueScore = Math.min((factors.daysOverdue / 180) * 25, 25);
  const distanceScore = Math.min((factors.distanceKm / 20) * 20, 20);
  const migrationScore = factors.isMigrated ? 15 : 0;
  const hesitancyScore = factors.hesitancyReported ? 5 : 0;

  const totalScore = Math.round(missedScore + overdueScore + distanceScore + migrationScore + hesitancyScore);

  let priority: PriorityLevel = 'Low';
  if (totalScore >= 65) priority = 'High';
  else if (totalScore >= 40) priority = 'Medium';

  const reasons: string[] = [];
  if (factors.missedSessionsCount >= 2) {
    reasons.push(`${factors.missedSessionsCount} consecutive missed sessions detected`);
  } else if (factors.missedSessionsCount === 1) {
    reasons.push('1 missed scheduled immunization window');
  }

  if (factors.daysOverdue > 90) {
    reasons.push(`Severely overdue by ${factors.daysOverdue} days`);
  } else if (factors.daysOverdue > 30) {
    reasons.push(`${factors.daysOverdue} days past target schedule`);
  }

  if (factors.distanceKm > 10) {
    reasons.push(`High travel barrier (${factors.distanceKm} km from nearest cold-chain PHC)`);
  }

  if (factors.isMigrated) {
    reasons.push('Recent cross-block migration; record linkage unverified');
  }

  if (factors.hesitancyReported) {
    reasons.push('Prior caregiver hesitance/mild fever concerns noted');
  }

  return {
    score: Math.min(totalScore, 100),
    priority,
    reasons
  };
}

export const INITIAL_CHILDREN_RECORDS: ChildRecord[] = [
  {
    id: 'VR-2024-0104',
    anonymizedAlias: 'Child M.S. (14m)',
    ageMonths: 14,
    localityId: 'LOC-01',
    localityName: 'Malkangiri Hill Ridge',
    guardianContactAlias: '+91 94XXX-81204 (Guardian)',
    lastVaccineDate: '2024-05-12',
    daysOverdue: 148,
    missedAntigens: ['MR-1 (Measles-Rubella)', 'PCV Booster', 'Vitamin A (Dose 1)'],
    administeredAntigens: ['BCG', 'OPV-0', 'OPV-1', 'OPV-2', 'OPV-3', 'Pentavalent-1', 'Pentavalent-2', 'Pentavalent-3'],
    fullyImmunized: false,
    priority: 'High',
    riskScore: 88,
    riskFactors: {
      missedSessionsCount: 2,
      daysOverdueFactor: 148,
      distanceToPHCKm: 18.2,
      isMigrated: true,
      hesitancyReported: false,
      primaryReason: 'Long distance (18.2km), seasonal monsoon barrier, and intra-district migration.'
    },
    followUpNotes: [
      {
        id: 'NOTE-101',
        childId: 'VR-2024-0104',
        date: '2024-10-14',
        category: 'Recent Migration Reported',
        noteText: 'Family moved from Koraput border due to harvest labor. Requested home-visit verification.',
        workerName: 'Sunita Nayak (ANM)'
      }
    ],
    status: 'Pending Outreach'
  },
  {
    id: 'VR-2024-0109',
    anonymizedAlias: 'Child R.T. (11m)',
    ageMonths: 11,
    localityId: 'LOC-03',
    localityName: 'Kaveri Riverine Reach',
    guardianContactAlias: '+91 97XXX-19283 (Mother)',
    lastVaccineDate: '2024-07-02',
    daysOverdue: 98,
    missedAntigens: ['MR-1 (Measles-Rubella)', 'JE-1'],
    administeredAntigens: ['BCG', 'OPV-0', 'Pentavalent-1', 'Pentavalent-2', 'Pentavalent-3'],
    fullyImmunized: false,
    priority: 'High',
    riskScore: 78,
    riskFactors: {
      missedSessionsCount: 2,
      daysOverdueFactor: 98,
      distanceToPHCKm: 11.0,
      isMigrated: false,
      hesitancyReported: true,
      primaryReason: 'Caregiver hesitance after child experienced fever following Pentavalent-3; river boat crossing required.'
    },
    followUpNotes: [
      {
        id: 'NOTE-102',
        childId: 'VR-2024-0109',
        date: '2024-10-20',
        category: 'Medical Officer Conversation Required',
        noteText: 'Mother expressed anxiety over post-vaccination fever. Recommended that Community Health Officer conduct reassuring counselling.',
        workerName: 'Latha Murugan (ASHA)'
      }
    ],
    status: 'Scheduled for Visit'
  },
  {
    id: 'VR-2024-0118',
    anonymizedAlias: 'Child P.K. (19m)',
    ageMonths: 19,
    localityId: 'LOC-02',
    localityName: 'Bhilwara Forest Hamlet',
    guardianContactAlias: '+91 98XXX-67319 (Father)',
    lastVaccineDate: '2024-03-10',
    daysOverdue: 212,
    missedAntigens: ['MR-2', 'DPT Booster 1', 'OPV Booster'],
    administeredAntigens: ['BCG', 'Pentavalent-1', 'Pentavalent-2', 'Pentavalent-3', 'MR-1'],
    fullyImmunized: false,
    priority: 'High',
    riskScore: 84,
    riskFactors: {
      missedSessionsCount: 3,
      daysOverdueFactor: 212,
      distanceToPHCKm: 14.5,
      isMigrated: false,
      hesitancyReported: false,
      primaryReason: 'Extreme schedule lag (212 days overdue) due to pastoral grazing migration into forest foothills.'
    },
    followUpNotes: [],
    status: 'Pending Outreach'
  },
  {
    id: 'VR-2024-0125',
    anonymizedAlias: 'Child S.V. (8m)',
    ageMonths: 8,
    localityId: 'LOC-04',
    localityName: 'Sitapur Peri-Urban Settlement',
    guardianContactAlias: '+91 91XXX-55219 (Mother)',
    lastVaccineDate: '2024-08-15',
    daysOverdue: 58,
    missedAntigens: ['Pentavalent-3', 'OPV-3', 'fIPV'],
    administeredAntigens: ['BCG', 'OPV-0', 'OPV-1', 'Pentavalent-1', 'Pentavalent-2'],
    fullyImmunized: false,
    priority: 'Medium',
    riskScore: 54,
    riskFactors: {
      missedSessionsCount: 1,
      daysOverdueFactor: 58,
      distanceToPHCKm: 4.8,
      isMigrated: true,
      hesitancyReported: false,
      primaryReason: 'Recent migration to brick kiln settlement; mother works daily 10-hour shift during standard clinic hours.'
    },
    followUpNotes: [
      {
        id: 'NOTE-103',
        childId: 'VR-2024-0125',
        date: '2024-10-28',
        category: 'Doorstep Visit Scheduled',
        noteText: 'Planned early morning 7:30 AM visit before parent leaves for site work.',
        workerName: 'Meera Devi (ASHA)'
      }
    ],
    status: 'Scheduled for Visit'
  },
  {
    id: 'VR-2024-0133',
    anonymizedAlias: 'Child A.R. (5m)',
    ageMonths: 5,
    localityId: 'LOC-05',
    localityName: 'Dharmanagar West Block',
    guardianContactAlias: '+91 96XXX-38491 (Guardian)',
    lastVaccineDate: '2024-09-05',
    daysOverdue: 42,
    missedAntigens: ['Pentavalent-2', 'OPV-2', 'Rotavirus-2'],
    administeredAntigens: ['BCG', 'OPV-0', 'Pentavalent-1', 'Rotavirus-1'],
    fullyImmunized: false,
    priority: 'Medium',
    riskScore: 48,
    riskFactors: {
      missedSessionsCount: 1,
      daysOverdueFactor: 42,
      distanceToPHCKm: 6.2,
      isMigrated: false,
      hesitancyReported: false,
      primaryReason: 'Missed single routine session due to mother traveling to maternal home for festival.'
    },
    followUpNotes: [],
    status: 'Pending Outreach'
  },
  {
    id: 'VR-2024-0141',
    anonymizedAlias: 'Child T.B. (16m)',
    ageMonths: 16,
    localityId: 'LOC-01',
    localityName: 'Malkangiri Hill Ridge',
    guardianContactAlias: '+91 94XXX-90184 (Father)',
    lastVaccineDate: '2024-06-18',
    daysOverdue: 112,
    missedAntigens: ['MR-1', 'Vitamin A', 'JE-1'],
    administeredAntigens: ['BCG', 'OPV-0', 'OPV-1', 'Pentavalent-1', 'Pentavalent-2', 'Pentavalent-3'],
    fullyImmunized: false,
    priority: 'High',
    riskScore: 82,
    riskFactors: {
      missedSessionsCount: 2,
      daysOverdueFactor: 112,
      distanceToPHCKm: 18.2,
      isMigrated: false,
      hesitancyReported: false,
      primaryReason: 'Difficult hill ridge terrain, impassable during heavy rains; no cold storage sub-post in hamlet.'
    },
    followUpNotes: [],
    status: 'Pending Outreach'
  },
  {
    id: 'VR-2024-0149',
    anonymizedAlias: 'Child K.N. (22m)',
    ageMonths: 22,
    localityId: 'LOC-06',
    localityName: 'Shastri Nagar Sub-Center',
    guardianContactAlias: '+91 98XXX-11029 (Mother)',
    lastVaccineDate: '2024-08-20',
    daysOverdue: 26,
    missedAntigens: ['DPT Booster 1'],
    administeredAntigens: ['BCG', 'OPV-0', 'Pentavalent 1-3', 'MR-1', 'MR-2'],
    fullyImmunized: false,
    priority: 'Low',
    riskScore: 28,
    riskFactors: {
      missedSessionsCount: 1,
      daysOverdueFactor: 26,
      distanceToPHCKm: 2.1,
      isMigrated: false,
      hesitancyReported: false,
      primaryReason: 'Minor scheduling conflict. Close proximity to sub-center (2.1km).'
    },
    followUpNotes: [
      {
        id: 'NOTE-104',
        childId: 'VR-2024-0149',
        date: '2024-11-01',
        category: 'Schedule Awareness Needed',
        noteText: 'Sent automated SMS reminder and verbal confirmation for upcoming Wednesday sub-center walk-in.',
        workerName: 'Pooja Sharma (Staff Nurse)'
      }
    ],
    status: 'Contacted - Follow Up Needed'
  },
  {
    id: 'VR-2024-0158',
    anonymizedAlias: 'Child D.D. (10m)',
    ageMonths: 10,
    localityId: 'LOC-02',
    localityName: 'Bhilwara Forest Hamlet',
    guardianContactAlias: '+91 93XXX-47382 (Mother)',
    lastVaccineDate: '2024-07-14',
    daysOverdue: 86,
    missedAntigens: ['MR-1', 'Vitamin A (Dose 1)'],
    administeredAntigens: ['BCG', 'OPV-0', 'Pentavalent-1', 'Pentavalent-2', 'Pentavalent-3'],
    fullyImmunized: false,
    priority: 'High',
    riskScore: 74,
    riskFactors: {
      missedSessionsCount: 2,
      daysOverdueFactor: 86,
      distanceToPHCKm: 14.5,
      isMigrated: false,
      hesitancyReported: false,
      primaryReason: 'Unpaved seasonal access track, missed village health and nutrition day (VHND).'
    },
    followUpNotes: [],
    status: 'Pending Outreach'
  },
  {
    id: 'VR-2024-0162',
    anonymizedAlias: 'Child V.M. (12m)',
    ageMonths: 12,
    localityId: 'LOC-03',
    localityName: 'Kaveri Riverine Reach',
    guardianContactAlias: '+91 95XXX-64720 (Grandmother)',
    lastVaccineDate: '2024-06-25',
    daysOverdue: 105,
    missedAntigens: ['MR-1', 'PCV Booster'],
    administeredAntigens: ['BCG', 'OPV 1-3', 'Pentavalent 1-3'],
    fullyImmunized: false,
    priority: 'High',
    riskScore: 76,
    riskFactors: {
      missedSessionsCount: 2,
      daysOverdueFactor: 105,
      distanceToPHCKm: 11.0,
      isMigrated: false,
      hesitancyReported: true,
      primaryReason: 'Primary caregiver is working grandmother who cannot manage the ferry journey alone with infant.'
    },
    followUpNotes: [
      {
        id: 'NOTE-105',
        childId: 'VR-2024-0162',
        date: '2024-10-18',
        category: 'Doorstep Visit Scheduled',
        noteText: 'Mobile outreach boat team will dock at South Sandbank on next rotation.',
        workerName: 'Latha Murugan (ASHA)'
      }
    ],
    status: 'Scheduled for Visit'
  },
  {
    id: 'VR-2024-0170',
    anonymizedAlias: 'Child J.L. (7m)',
    ageMonths: 7,
    localityId: 'LOC-04',
    localityName: 'Sitapur Peri-Urban Settlement',
    guardianContactAlias: '+91 92XXX-83921 (Father)',
    lastVaccineDate: '2024-08-30',
    daysOverdue: 45,
    missedAntigens: ['Pentavalent-3', 'fIPV'],
    administeredAntigens: ['BCG', 'OPV-0', 'Pentavalent-1', 'Pentavalent-2'],
    fullyImmunized: false,
    priority: 'Medium',
    riskScore: 50,
    riskFactors: {
      missedSessionsCount: 1,
      daysOverdueFactor: 45,
      distanceToPHCKm: 4.8,
      isMigrated: true,
      hesitancyReported: false,
      primaryReason: 'Family migrated from rural district 2 months ago; health card misplaced during transit.'
    },
    followUpNotes: [],
    status: 'Pending Outreach'
  },
  {
    id: 'VR-2024-0175',
    anonymizedAlias: 'Child N.S. (15m)',
    ageMonths: 15,
    localityId: 'LOC-05',
    localityName: 'Dharmanagar West Block',
    guardianContactAlias: '+91 99XXX-28301 (Mother)',
    lastVaccineDate: '2024-07-28',
    daysOverdue: 72,
    missedAntigens: ['MR-1', 'JE-1'],
    administeredAntigens: ['BCG', 'OPV-0', 'OPV 1-3', 'Pentavalent 1-3'],
    fullyImmunized: false,
    priority: 'Medium',
    riskScore: 58,
    riskFactors: {
      missedSessionsCount: 1,
      daysOverdueFactor: 72,
      distanceToPHCKm: 6.2,
      isMigrated: false,
      hesitancyReported: true,
      primaryReason: 'Caregiver fear of combined measles-rubella injection reactions; peer-counselling needed.'
    },
    followUpNotes: [
      {
        id: 'NOTE-106',
        childId: 'VR-2024-0175',
        date: '2024-10-24',
        category: 'Vaccine Hesitancy Addressed',
        noteText: 'Addressed concerns about post-injection mild symptoms. Mother agreed to bring child on next village outreach day.',
        workerName: 'Rita Biswas (ANM)'
      }
    ],
    status: 'Contacted - Follow Up Needed'
  },
  {
    id: 'VR-2024-0182',
    anonymizedAlias: 'Child O.P. (24m)',
    ageMonths: 24,
    localityId: 'LOC-06',
    localityName: 'Shastri Nagar Sub-Center',
    guardianContactAlias: '+91 98XXX-77610 (Father)',
    lastVaccineDate: '2024-09-12',
    daysOverdue: 22,
    missedAntigens: ['OPV Booster'],
    administeredAntigens: ['BCG', 'OPV 1-3', 'Pentavalent 1-3', 'MR 1-2', 'DPT Booster 1'],
    fullyImmunized: false,
    priority: 'Low',
    riskScore: 24,
    riskFactors: {
      missedSessionsCount: 1,
      daysOverdueFactor: 22,
      distanceToPHCKm: 2.1,
      isMigrated: false,
      hesitancyReported: false,
      primaryReason: 'Minor delay due to seasonal cold. Caregiver highly cooperative.'
    },
    followUpNotes: [],
    status: 'Pending Outreach'
  },
  {
    id: 'VR-2024-0190',
    anonymizedAlias: 'Child B.C. (18m)',
    ageMonths: 18,
    localityId: 'LOC-01',
    localityName: 'Malkangiri Hill Ridge',
    guardianContactAlias: '+91 94XXX-33215 (Mother)',
    lastVaccineDate: '2024-04-05',
    daysOverdue: 184,
    missedAntigens: ['MR-1', 'MR-2', 'DPT Booster 1', 'Vitamin A'],
    administeredAntigens: ['BCG', 'OPV-0', 'Pentavalent-1', 'Pentavalent-2'],
    fullyImmunized: false,
    priority: 'High',
    riskScore: 92,
    riskFactors: {
      missedSessionsCount: 3,
      daysOverdueFactor: 184,
      distanceToPHCKm: 18.2,
      isMigrated: false,
      hesitancyReported: false,
      primaryReason: 'Multiple missed sessions, critical vulnerability window, remote hill dwelling.'
    },
    followUpNotes: [],
    status: 'Pending Outreach'
  },
  {
    id: 'VR-2024-0198',
    anonymizedAlias: 'Child E.G. (6m)',
    ageMonths: 6,
    localityId: 'LOC-02',
    localityName: 'Bhilwara Forest Hamlet',
    guardianContactAlias: '+91 91XXX-65432 (Mother)',
    lastVaccineDate: '2024-08-10',
    daysOverdue: 62,
    missedAntigens: ['Pentavalent-2', 'OPV-2', 'Rotavirus-2'],
    administeredAntigens: ['BCG', 'OPV-0', 'Pentavalent-1'],
    fullyImmunized: false,
    priority: 'High',
    riskScore: 70,
    riskFactors: {
      missedSessionsCount: 2,
      daysOverdueFactor: 62,
      distanceToPHCKm: 14.5,
      isMigrated: false,
      hesitancyReported: false,
      primaryReason: 'Early drop-out between Pentavalent-1 and 2 in remote forest sector.'
    },
    followUpNotes: [],
    status: 'Pending Outreach'
  },
  {
    id: 'VR-2024-0205',
    anonymizedAlias: 'Child Z.A. (13m)',
    ageMonths: 13,
    localityId: 'LOC-04',
    localityName: 'Sitapur Peri-Urban Settlement',
    guardianContactAlias: '+91 90XXX-11223 (Father)',
    lastVaccineDate: '2024-07-10',
    daysOverdue: 92,
    missedAntigens: ['MR-1', 'JE-1'],
    administeredAntigens: ['BCG', 'OPV 1-3', 'Pentavalent 1-3'],
    fullyImmunized: false,
    priority: 'Medium',
    riskScore: 62,
    riskFactors: {
      missedSessionsCount: 1,
      daysOverdueFactor: 92,
      distanceToPHCKm: 4.8,
      isMigrated: true,
      hesitancyReported: false,
      primaryReason: 'Circular migrant family in transit across municipal boundaries.'
    },
    followUpNotes: [],
    status: 'Pending Outreach'
  }
];

export const INITIAL_MIGRATION_ALERTS: MigrationRecord[] = [
  {
    id: 'MIG-801',
    childId: 'VR-2024-0104',
    previousLocality: 'Koraput Border Block',
    currentLocality: 'Malkangiri Hill Ridge',
    flagDate: '2024-09-18',
    status: 'In-Transit',
    sourceHealthCenter: 'Koraput Community Health Center',
    transitReason: 'Agricultural harvesting seasonal migration',
    authorizedSafeguardNote: 'Record flagged automatically when child missed two consecutive village sessions. Health worker confirmation pending.',
    lastContactDate: '2024-09-02'
  },
  {
    id: 'MIG-802',
    childId: 'VR-2024-0125',
    previousLocality: 'Azamgarh Rural Block',
    currentLocality: 'Sitapur Peri-Urban Settlement',
    flagDate: '2024-09-24',
    status: 'Unconfirmed Arrival',
    sourceHealthCenter: 'Azamgarh PHC',
    transitReason: 'Seasonal brick kiln labor deployment',
    authorizedSafeguardNote: 'Cross-locality data sharing requires verified consent and cryptographic matching of anonymous health card token.',
    lastContactDate: '2024-09-10'
  },
  {
    id: 'MIG-803',
    childId: 'VR-2024-0170',
    previousLocality: 'Hardoi District Sub-div',
    currentLocality: 'Sitapur Peri-Urban Settlement',
    flagDate: '2024-10-02',
    status: 'Tracing Required',
    sourceHealthCenter: 'Hardoi Sub-Center 3',
    transitReason: 'Urban construction project shift',
    authorizedSafeguardNote: 'Record ceased in source registry without transfer certificate. ASHA worker assigned to physical tracing.',
    lastContactDate: '2024-08-30'
  },
  {
    id: 'MIG-804',
    childId: 'VR-2024-0205',
    previousLocality: 'Barabanki North Cluster',
    currentLocality: 'Sitapur Peri-Urban Settlement',
    flagDate: '2024-10-15',
    status: 'Re-Enrolled',
    sourceHealthCenter: 'Barabanki Rural Post',
    transitReason: 'Permanent family relocation',
    authorizedSafeguardNote: 'Re-enrollment completed by Urban Health Clinic staff. Catch-up appointment confirmed.',
    lastContactDate: '2024-10-22'
  }
];

export const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    bookingId: 'VAX-BK-7891',
    childIdentifier: 'VR-2024-0109 (Child R.T.)',
    parentName: 'Radha Murugan',
    contactNumber: '+91 97XXX-19283',
    locality: 'Kaveri Riverine Reach',
    childAgeMonths: 11,
    preferredDate: '2024-11-12',
    timeSlot: '09:30 AM - 11:00 AM',
    sessionType: 'Doorstep Outreach Visit',
    requestedAntigens: ['MR-1 (Measles-Rubella)', 'JE-1'],
    specialNeeds: 'Requires riverboat crossing team; mother requested prior counselling regarding vaccine fever safety.',
    status: 'Confirmed',
    createdAt: '2024-11-01'
  },
  {
    bookingId: 'VAX-BK-7892',
    childIdentifier: 'VR-2024-0125 (Child S.V.)',
    parentName: 'Savita Verma',
    contactNumber: '+91 91XXX-55219',
    locality: 'Sitapur Peri-Urban Settlement',
    childAgeMonths: 8,
    preferredDate: '2024-11-14',
    timeSlot: '07:30 AM - 08:30 AM',
    sessionType: 'Doorstep Outreach Visit',
    requestedAntigens: ['Pentavalent-3', 'OPV-3'],
    specialNeeds: 'Early morning session before parent leaves for brick-kiln employment.',
    status: 'Confirmed',
    createdAt: '2024-11-02'
  },
  {
    bookingId: 'VAX-BK-7893',
    childIdentifier: 'VR-2024-0149 (Child K.N.)',
    parentName: 'Kavita Sharma',
    contactNumber: '+91 98XXX-11029',
    locality: 'Shastri Nagar Sub-Center',
    childAgeMonths: 22,
    preferredDate: '2024-11-08',
    timeSlot: '11:30 AM - 01:00 PM',
    sessionType: 'Primary Health Centre (PHC) Walk-in',
    requestedAntigens: ['DPT Booster 1'],
    specialNeeds: 'Standard sub-center routine walk-in slot booked.',
    status: 'Completed',
    createdAt: '2024-10-30'
  }
];

export const VACCINE_DROPOUT_DATA = [
  { antigen: 'BCG (Birth)', administeredRate: 94.2, dropoutRate: 5.8, targetCohort: 2009 },
  { antigen: 'Pentavalent-1 (6 Wks)', administeredRate: 88.5, dropoutRate: 11.5, targetCohort: 2009 },
  { antigen: 'Pentavalent-2 (10 Wks)', administeredRate: 81.3, dropoutRate: 18.7, targetCohort: 2009 },
  { antigen: 'Pentavalent-3 (14 Wks)', administeredRate: 72.8, dropoutRate: 27.2, targetCohort: 2009 },
  { antigen: 'MR-1 (9-12 Months)', administeredRate: 64.9, dropoutRate: 35.1, targetCohort: 2009 },
  { antigen: 'DPT Booster 1 (16-24 Mos)', administeredRate: 58.2, dropoutRate: 41.8, targetCohort: 2009 }
];

export const COVERAGE_COMPARISON_DATA = [
  { locality: 'Malkangiri Hill', fullyImmunized: 48.4, missedSessions: 42.1, inTransit: 9.5, distanceKm: 18.2 },
  { locality: 'Bhilwara Forest', fullyImmunized: 54.3, missedSessions: 38.2, inTransit: 7.5, distanceKm: 14.5 },
  { locality: 'Kaveri Riverine', fullyImmunized: 61.0, missedSessions: 33.6, inTransit: 5.4, distanceKm: 11.0 },
  { locality: 'Sitapur Slum', fullyImmunized: 68.6, missedSessions: 22.1, inTransit: 9.3, distanceKm: 4.8 },
  { locality: 'Dharmanagar W', fullyImmunized: 78.9, missedSessions: 17.5, inTransit: 3.6, distanceKm: 6.2 },
  { locality: 'Shastri Nagar', fullyImmunized: 89.4, missedSessions: 8.8, inTransit: 1.8, distanceKm: 2.1 }
];

import { VaccinationCentre, PersonalVaccineDose, UserPersonalProfile, AppNotification } from '../types';

/**
 * Calculates distance in kilometers between two geo-coordinates using Haversine formula
 */
export function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const SAMPLE_VACCINATION_CENTRES: VaccinationCentre[] = [
  {
    id: 'VC-001',
    name: 'District Civil Hospital & Maternal Child Hub',
    category: 'District Civil Hospital',
    address: 'Near Clock Tower, Main Civil Lines, Sector 4',
    locality: 'Shastri Nagar',
    pinCode: '110054',
    coordinates: { lat: 28.6792, lng: 77.2148 },
    operatingHours: '08:00 AM - 04:00 PM (Mon-Sat)',
    contactPhone: '+91 11-2384-9120',
    availableVaccines: ['BCG', 'OPV', 'Pentavalent', 'Rotavirus', 'PCV', 'MR-1', 'MR-2', 'JE', 'DPT Booster', 'Td'],
    coldChainStatus: 'Deep Freeze Hub',
    walkInAllowed: true,
    isVerifiedSample: true,
    specialNotice: 'Daily cold-chain walk-in facility with pediatric immunization OPD counter.'
  },
  {
    id: 'VC-002',
    name: 'Shastri Nagar Urban Health Sub-Centre',
    category: 'Urban Health Post',
    address: 'Block C Community Complex, Shastri Nagar',
    locality: 'Shastri Nagar',
    pinCode: '110052',
    coordinates: { lat: 28.6715, lng: 77.1895 },
    operatingHours: '09:00 AM - 02:00 PM (Daily)',
    contactPhone: '+91 11-2741-6302',
    availableVaccines: ['BCG', 'OPV', 'Pentavalent', 'MR-1', 'MR-2', 'Vitamin A'],
    coldChainStatus: 'Active Solar Refrigeration',
    walkInAllowed: true,
    isVerifiedSample: true,
    specialNotice: 'Special Wednesday and Saturday child immunization outreach sessions.'
  },
  {
    id: 'VC-003',
    name: 'Sitapur Urban Primary Health Centre (UPHC)',
    category: 'Primary Health Centre (PHC)',
    address: 'Plot 18, Transport Nagar Road, Sitapur Settlement',
    locality: 'Sitapur Peri-Urban Settlement',
    pinCode: '110042',
    coordinates: { lat: 28.7250, lng: 77.1520 },
    operatingHours: '08:30 AM - 03:00 PM (Mon-Sat)',
    contactPhone: '+91 11-2789-4411',
    availableVaccines: ['BCG', 'OPV', 'Pentavalent', 'Rotavirus', 'PCV', 'MR-1', 'fIPV'],
    coldChainStatus: 'Continuous Grid Cold-Chain',
    walkInAllowed: true,
    isVerifiedSample: true,
    specialNotice: 'Flexible early-morning registration slots for working daily-wage families.'
  },
  {
    id: 'VC-004',
    name: 'Dharmanagar Community Health Centre (CHC)',
    category: 'Community Health Centre (CHC)',
    address: 'Main Canal Road, West Sector Dharmanagar',
    locality: 'Dharmanagar West Block',
    pinCode: '110086',
    coordinates: { lat: 28.6480, lng: 77.1080 },
    operatingHours: '09:00 AM - 04:00 PM (Daily)',
    contactPhone: '+91 11-2598-1004',
    availableVaccines: ['BCG', 'OPV', 'Pentavalent', 'PCV', 'MR-1', 'MR-2', 'DPT Booster 1 & 2', 'Td'],
    coldChainStatus: 'Active Solar Refrigeration',
    walkInAllowed: true,
    isVerifiedSample: true,
    specialNotice: 'Equipped with cold-room storage and dedicated AEFI monitoring beds.'
  },
  {
    id: 'VC-005',
    name: 'Kaveri Riverbank Outreach Medical Post',
    category: 'Sub-Centre',
    address: 'Near Old Ferry Terminal, River Road South',
    locality: 'Kaveri Riverine Reach',
    pinCode: '110091',
    coordinates: { lat: 28.6180, lng: 77.2950 },
    operatingHours: '09:30 AM - 01:30 PM (Mon, Wed, Fri)',
    contactPhone: '+91 11-2275-8012',
    availableVaccines: ['BCG', 'OPV', 'Pentavalent', 'MR-1', 'Vitamin A'],
    coldChainStatus: 'Daily Carrier Supply',
    walkInAllowed: true,
    isVerifiedSample: true,
    specialNotice: 'Connected with the river boat clinic. Vaccines replenished daily via vaccine carrier.'
  },
  {
    id: 'VC-006',
    name: 'Bhilwara Block Primary Health Centre',
    category: 'Primary Health Centre (PHC)',
    address: 'Forest Range Junction, Block Office Road',
    locality: 'Bhilwara Forest Hamlet',
    pinCode: '110096',
    coordinates: { lat: 28.5830, lng: 77.3190 },
    operatingHours: '09:00 AM - 03:00 PM (Mon-Sat)',
    contactPhone: '+91 11-2244-9871',
    availableVaccines: ['BCG', 'OPV', 'Pentavalent', 'Rotavirus', 'PCV', 'MR-1', 'DPT Booster'],
    coldChainStatus: 'Active Solar Refrigeration',
    walkInAllowed: true,
    isVerifiedSample: true,
    specialNotice: 'Base station for weekly mobile vaccination vans servicing forest hamlets.'
  },
  {
    id: 'VC-007',
    name: 'Malkangiri Hill Ridge Health Post & Cold Hub',
    category: 'Sub-Centre',
    address: 'Ridge Point 4, Tribal Development Corridor',
    locality: 'Malkangiri Hill Ridge',
    pinCode: '110094',
    coordinates: { lat: 28.7100, lng: 77.2500 },
    operatingHours: '10:00 AM - 02:00 PM (Tue, Thu, Sat)',
    contactPhone: '+91 11-2212-3345',
    availableVaccines: ['BCG', 'OPV', 'Pentavalent', 'MR-1', 'Vitamin A', 'JE'],
    coldChainStatus: 'Daily Carrier Supply',
    walkInAllowed: true,
    isVerifiedSample: true,
    specialNotice: 'Dispatches ASHA and ANM foot-patrol teams with conditioned ice-packs.'
  },
  {
    id: 'VC-008',
    name: 'Connaught Central Primary Health Centre',
    category: 'Primary Health Centre (PHC)',
    address: 'Shaheed Bhagat Singh Marg, Central Zone',
    locality: 'Central District',
    pinCode: '110001',
    coordinates: { lat: 28.6315, lng: 77.2167 },
    operatingHours: '08:00 AM - 05:00 PM (Mon-Sat)',
    contactPhone: '+91 11-2336-5410',
    availableVaccines: ['BCG', 'OPV', 'Pentavalent', 'Rotavirus', 'PCV', 'fIPV', 'MR-1', 'MR-2', 'DPT', 'Td'],
    coldChainStatus: 'Deep Freeze Hub',
    walkInAllowed: true,
    isVerifiedSample: true,
    specialNotice: 'High-capacity metro hub with all national immunization vaccines in continuous stock.'
  }
];

export interface NISScheduleTemplateItem {
  key: string;
  vaccineName: string;
  doseNumber: string;
  ageMilestone: string;
  daysAfterBirth: number;
  targetDiseases: string;
}

export const INDIAN_NIS_SCHEDULE_TEMPLATE: NISScheduleTemplateItem[] = [
  {
    key: 'bcg_birth',
    vaccineName: 'BCG (Bacillus Calmette-Guérin)',
    doseNumber: 'Single Dose',
    ageMilestone: 'At Birth (within 1st year)',
    daysAfterBirth: 0,
    targetDiseases: 'Tuberculosis & TB Meningitis'
  },
  {
    key: 'opv_0',
    vaccineName: 'OPV-0 (Oral Polio Vaccine)',
    doseNumber: 'Birth Dose',
    ageMilestone: 'At Birth (within first 15 days)',
    daysAfterBirth: 0,
    targetDiseases: 'Poliomyelitis (Infantile Paralysis)'
  },
  {
    key: 'hepb_birth',
    vaccineName: 'Hepatitis B (Birth Dose)',
    doseNumber: 'Birth Dose',
    ageMilestone: 'At Birth (within 24 hours)',
    daysAfterBirth: 1,
    targetDiseases: 'Perinatal Hepatitis B Infection'
  },
  {
    key: 'penta_1',
    vaccineName: 'Pentavalent-1 (DPT + HepB + Hib)',
    doseNumber: 'Dose 1',
    ageMilestone: '6 Weeks',
    daysAfterBirth: 42,
    targetDiseases: 'Diphtheria, Pertussis, Tetanus, Hepatitis B, Hib Pneumonia/Meningitis'
  },
  {
    key: 'opv_1',
    vaccineName: 'OPV-1',
    doseNumber: 'Dose 1',
    ageMilestone: '6 Weeks',
    daysAfterBirth: 42,
    targetDiseases: 'Poliomyelitis'
  },
  {
    key: 'rota_1',
    vaccineName: 'Rotavirus Vaccine (RVV-1)',
    doseNumber: 'Dose 1',
    ageMilestone: '6 Weeks',
    daysAfterBirth: 42,
    targetDiseases: 'Severe Rotaviral Diarrhoea & Dehydration'
  },
  {
    key: 'pcv_1',
    vaccineName: 'Pneumococcal Conjugate Vaccine (PCV-1)',
    doseNumber: 'Dose 1',
    ageMilestone: '6 Weeks',
    daysAfterBirth: 42,
    targetDiseases: 'Severe Pneumococcal Pneumonia & Sepsis'
  },
  {
    key: 'fipv_1',
    vaccineName: 'Fractional IPV (fIPV-1)',
    doseNumber: 'Dose 1',
    ageMilestone: '6 Weeks',
    daysAfterBirth: 42,
    targetDiseases: 'Polio (Injectable Inactivated)'
  },
  {
    key: 'penta_2',
    vaccineName: 'Pentavalent-2',
    doseNumber: 'Dose 2',
    ageMilestone: '10 Weeks',
    daysAfterBirth: 70,
    targetDiseases: 'Diphtheria, Pertussis, Tetanus, Hepatitis B, Hib'
  },
  {
    key: 'opv_2',
    vaccineName: 'OPV-2',
    doseNumber: 'Dose 2',
    ageMilestone: '10 Weeks',
    daysAfterBirth: 70,
    targetDiseases: 'Poliomyelitis'
  },
  {
    key: 'rota_2',
    vaccineName: 'Rotavirus Vaccine (RVV-2)',
    doseNumber: 'Dose 2',
    ageMilestone: '10 Weeks',
    daysAfterBirth: 70,
    targetDiseases: 'Severe Rotaviral Diarrhoea'
  },
  {
    key: 'penta_3',
    vaccineName: 'Pentavalent-3',
    doseNumber: 'Dose 3',
    ageMilestone: '14 Weeks',
    daysAfterBirth: 98,
    targetDiseases: 'Primary 3-dose series completion for DPT-HepB-Hib'
  },
  {
    key: 'opv_3',
    vaccineName: 'OPV-3',
    doseNumber: 'Dose 3',
    ageMilestone: '14 Weeks',
    daysAfterBirth: 98,
    targetDiseases: 'Poliomyelitis'
  },
  {
    key: 'rota_3',
    vaccineName: 'Rotavirus Vaccine (RVV-3)',
    doseNumber: 'Dose 3',
    ageMilestone: '14 Weeks',
    daysAfterBirth: 98,
    targetDiseases: 'Severe Rotaviral Diarrhoea'
  },
  {
    key: 'pcv_2',
    vaccineName: 'PCV-2',
    doseNumber: 'Dose 2',
    ageMilestone: '14 Weeks',
    daysAfterBirth: 98,
    targetDiseases: 'Pneumococcal Infections'
  },
  {
    key: 'fipv_2',
    vaccineName: 'Fractional IPV (fIPV-2)',
    doseNumber: 'Dose 2',
    ageMilestone: '14 Weeks',
    daysAfterBirth: 98,
    targetDiseases: 'Polio (Injectable)'
  },
  {
    key: 'mr_1',
    vaccineName: 'MR-1 (Measles-Rubella)',
    doseNumber: 'Dose 1',
    ageMilestone: '9 - 12 Months',
    daysAfterBirth: 270,
    targetDiseases: 'Measles outbreaks & Congenital Rubella Syndrome'
  },
  {
    key: 'vita_1',
    vaccineName: 'Vitamin A (Dose 1 - 100,000 IU)',
    doseNumber: 'Dose 1',
    ageMilestone: '9 Months (with MR-1)',
    daysAfterBirth: 270,
    targetDiseases: 'Vitamin A Deficiency & Night Blindness Prevention'
  },
  {
    key: 'pcv_booster',
    vaccineName: 'PCV Booster',
    doseNumber: 'Booster',
    ageMilestone: '9 - 12 Months',
    daysAfterBirth: 270,
    targetDiseases: 'Pneumococcal Booster Immunity'
  },
  {
    key: 'je_1',
    vaccineName: 'JE-1 (Japanese Encephalitis)',
    doseNumber: 'Dose 1',
    ageMilestone: '9 - 12 Months (Endemic districts)',
    daysAfterBirth: 270,
    targetDiseases: 'Japanese Encephalitis Brain Fever'
  },
  {
    key: 'mr_2',
    vaccineName: 'MR-2 (Measles-Rubella)',
    doseNumber: 'Dose 2',
    ageMilestone: '16 - 24 Months',
    daysAfterBirth: 485,
    targetDiseases: 'Long-term immunity against Measles & Rubella'
  },
  {
    key: 'dpt_booster_1',
    vaccineName: 'DPT Booster 1',
    doseNumber: 'Booster 1',
    ageMilestone: '16 - 24 Months',
    daysAfterBirth: 485,
    targetDiseases: 'Diphtheria, Pertussis, Tetanus Booster Protection'
  },
  {
    key: 'opv_booster',
    vaccineName: 'OPV Booster',
    doseNumber: 'Booster',
    ageMilestone: '16 - 24 Months',
    daysAfterBirth: 485,
    targetDiseases: 'Mucosal Polio Immunity Booster'
  },
  {
    key: 'dpt_booster_2',
    vaccineName: 'DPT Booster 2',
    doseNumber: 'Booster 2',
    ageMilestone: '5 - 6 Years',
    daysAfterBirth: 1825,
    targetDiseases: 'School-age Diphtheria & Whooping Cough'
  },
  {
    key: 'td_10yr',
    vaccineName: 'Td (Tetanus & adult Diphtheria)',
    doseNumber: 'Adolescent Dose',
    ageMilestone: '10 Years',
    daysAfterBirth: 3650,
    targetDiseases: 'Tetanus & Diphtheria'
  },
  {
    key: 'td_16yr',
    vaccineName: 'Td Booster (16 Years)',
    doseNumber: 'Adolescent Booster',
    ageMilestone: '16 Years',
    daysAfterBirth: 5840,
    targetDiseases: 'Tetanus & Diphtheria'
  }
];

/**
 * Generates an individualized vaccination schedule timeline based on child's Date of Birth.
 */
export function generateScheduleFromDOB(
  dobString: string,
  existingRecords: Record<string, { date: string; facility?: string; batch?: string; notes?: string }> = {}
): PersonalVaccineDose[] {
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return INDIAN_NIS_SCHEDULE_TEMPLATE.map((item) => {
    // Calculate due date by adding days to DOB
    const dueDateObj = new Date(birthDate.getTime() + item.daysAfterBirth * 24 * 60 * 60 * 1000);
    const dueDateStr = dueDateObj.toISOString().split('T')[0];

    const existing = existingRecords[item.key];
    const isCompleted = !!existing?.date;

    let status: PersonalVaccineDose['status'] = 'Upcoming';

    if (isCompleted) {
      status = 'Completed';
    } else {
      const diffDays = Math.round((today.getTime() - dueDateObj.getTime()) / (24 * 60 * 60 * 1000));
      if (diffDays === 0) {
        status = 'Due Today';
      } else if (diffDays > 0) {
        status = 'Overdue';
      } else {
        status = 'Upcoming';
      }
    }

    return {
      id: `DOSE-${item.key}`,
      vaccineKey: item.key,
      vaccineName: item.vaccineName,
      doseNumber: item.doseNumber,
      recommendedAgeMilestone: item.ageMilestone,
      targetDiseases: item.targetDiseases,
      dueDate: dueDateStr,
      dateAdministered: existing?.date,
      batchNumber: existing?.batch,
      facilityAdministered: existing?.facility,
      notes: existing?.notes,
      status
    };
  });
}

export const INITIAL_USER_PROFILE: UserPersonalProfile = {
  childName: 'Aarav Sharma',
  dateOfBirth: '2025-11-20', // approximately 11 months old relative to late 2026
  gender: 'Male',
  guardianName: 'Pooja Sharma',
  contactNumber: '+91 98765-43210',
  locality: 'Shastri Nagar',
  bloodGroup: 'B+'
};

export const INITIAL_ADMINISTERED_MAP: Record<string, { date: string; facility?: string; batch?: string; notes?: string }> = {
  'bcg_birth': { date: '2025-11-21', facility: 'Civil Hospital Shastri Nagar', batch: 'BCG-25-881' },
  'opv_0': { date: '2025-11-21', facility: 'Civil Hospital Shastri Nagar', batch: 'OPV-0912' },
  'hepb_birth': { date: '2025-11-21', facility: 'Civil Hospital Shastri Nagar', batch: 'HEP-B-31' },
  'penta_1': { date: '2026-01-05', facility: 'Shastri Nagar UPHC', batch: 'PENTA-904' },
  'opv_1': { date: '2026-01-05', facility: 'Shastri Nagar UPHC', batch: 'OPV-1102' },
  'rota_1': { date: '2026-01-05', facility: 'Shastri Nagar UPHC', batch: 'RVV-441' },
  'pcv_1': { date: '2026-01-05', facility: 'Shastri Nagar UPHC', batch: 'PCV-812' },
  'fipv_1': { date: '2026-01-05', facility: 'Shastri Nagar UPHC', batch: 'fIPV-101' },
  'penta_2': { date: '2026-02-12', facility: 'Shastri Nagar UPHC', batch: 'PENTA-918' },
  'opv_2': { date: '2026-02-12', facility: 'Shastri Nagar UPHC', batch: 'OPV-1190' },
  'rota_2': { date: '2026-02-12', facility: 'Shastri Nagar UPHC', batch: 'RVV-459' },
  'penta_3': { date: '2026-03-24', facility: 'Shastri Nagar UPHC', batch: 'PENTA-982' },
  'opv_3': { date: '2026-03-24', facility: 'Shastri Nagar UPHC', batch: 'OPV-1205' },
  'rota_3': { date: '2026-03-24', facility: 'Shastri Nagar UPHC', batch: 'RVV-490' },
  'pcv_2': { date: '2026-03-24', facility: 'Shastri Nagar UPHC', batch: 'PCV-830' },
  'fipv_2': { date: '2026-03-24', facility: 'Shastri Nagar UPHC', batch: 'fIPV-120' }
};

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'NOTIF-1',
    type: 'overdue',
    title: 'Vaccination Overdue Alert',
    message: 'MR-1 (Measles-Rubella) and Vitamin A Dose 1 were due at 9 months. Please book your nearest clinic session.',
    date: '2026-11-03',
    read: false,
    vaccineKey: 'mr_1',
    severity: 'high'
  },
  {
    id: 'NOTIF-2',
    type: 'reminder_7d',
    title: 'Upcoming Milestone Reminder',
    message: 'PCV Booster is scheduled for next week. Verify cold-chain stock at your local PHC.',
    date: '2026-11-01',
    read: false,
    vaccineKey: 'pcv_booster',
    severity: 'medium'
  },
  {
    id: 'NOTIF-3',
    type: 'status_update',
    title: 'Pentavalent-3 Record Verified',
    message: 'Your 14-week primary immunization series was recorded as complete at Shastri Nagar UPHC.',
    date: '2026-03-24',
    read: true,
    vaccineKey: 'penta_3',
    severity: 'info'
  }
];

