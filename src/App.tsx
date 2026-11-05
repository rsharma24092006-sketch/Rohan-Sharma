import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { MissedSessionTracker } from './components/MissedSessionTracker';
import { ExplainableRiskModel } from './components/ExplainableRiskModel';
import { LocalityHotspotMap } from './components/LocalityHotspotMap';
import { MigrationAlertSystem } from './components/MigrationAlertSystem';
import { OutreachPlanGenerator } from './components/OutreachPlanGenerator';
import { BookingSystem } from './components/BookingSystem';
import { NearbyCentreFinder } from './components/NearbyCentreFinder';
import { VaccinationTracker } from './components/VaccinationTracker';
import { NotificationCentre } from './components/NotificationCentre';
import { PresentationJudgeModal } from './components/PresentationJudgeModal';
import { Footer } from './components/Footer';
import { INITIAL_CHILDREN_RECORDS, INITIAL_NOTIFICATIONS } from './data/syntheticData';
import { ChildRecord, BookingRecord, VaccinationCentre, AppNotification } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('landing');
  const [childrenRecords, setChildrenRecords] = useState<ChildRecord[]>(INITIAL_CHILDREN_RECORDS);
  const [selectedLocalityId, setSelectedLocalityId] = useState<string>('LOC-01');
  const [prefilledChildForBooking, setPrefilledChildForBooking] = useState<ChildRecord | null>(null);
  const [isJudgeBriefOpen, setIsJudgeBriefOpen] = useState(false);

  // Notification Centre state
  const NOTIFICATIONS_STORAGE_KEY = 'vaxreach_notifications_v1';
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });
  const [isNotificationCentreOpen, setIsNotificationCentreOpen] = useState(false);

  // Persist notifications
  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  // Unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleTriggerNotification = (newNotif: AppNotification) => {
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Update a child record in local state
  const handleUpdateRecord = (updatedChild: ChildRecord) => {
    setChildrenRecords(prev => prev.map(c => c.id === updatedChild.id ? updatedChild : c));
  };

  // Direct handoff from Tracker to Booking
  const handleBookForChild = (child: ChildRecord) => {
    setPrefilledChildForBooking(child);
    setActiveTab('booking');
  };

  // Direct handoff from Migration alert to Booking
  const handleBookForChildId = (childId: string) => {
    const found = childrenRecords.find(c => c.id === childId);
    if (found) {
      setPrefilledChildForBooking(found);
    }
    setActiveTab('booking');
  };

  // Direct handoff from Centre Finder to Booking
  const handleBookAtCentre = (centre: VaccinationCentre) => {
    // Create a prefilled dummy record representing this facility
    setActiveTab('booking');
  };

  const handleBookingCreated = (booking: BookingRecord) => {
    // If booking was for an existing child, update their status to 'Scheduled for Visit'
    setChildrenRecords(prev => prev.map(child => {
      if (booking.childIdentifier.includes(child.id)) {
        return {
          ...child,
          status: 'Scheduled for Visit',
          riskScore: Math.max(10, child.riskScore - 20)
        };
      }
      return child;
    }));

    // Trigger confirmation notification
    handleTriggerNotification({
      id: `NOTIF-BOOK-${Date.now()}`,
      type: 'status_update',
      title: 'Session Confirmed',
      message: `Appointment ${booking.bookingId} booked for ${booking.childIdentifier} on ${booking.preferredDate} (${booking.timeSlot}).`,
      date: new Date().toISOString().split('T')[0],
      read: false,
      severity: 'info'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-stone-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenJudgeBrief={() => setIsJudgeBriefOpen(true)}
        unreadCount={unreadCount}
        onOpenNotifications={() => setIsNotificationCentreOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {activeTab === 'landing' && (
          <LandingPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenJudgeBrief={() => setIsJudgeBriefOpen(true)}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectLocality={(locId) => setSelectedLocalityId(locId)}
          />
        )}

        {activeTab === 'vaccination-tracker' && (
          <VaccinationTracker
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onTriggerNotification={handleTriggerNotification}
          />
        )}

        {activeTab === 'centre-finder' && (
          <NearbyCentreFinder
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBookAtCentre={handleBookAtCentre}
          />
        )}

        {activeTab === 'tracker' && (
          <MissedSessionTracker
            childrenRecords={childrenRecords}
            onUpdateRecord={handleUpdateRecord}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBookForChild={handleBookForChild}
          />
        )}

        {activeTab === 'hotspots' && (
          <LocalityHotspotMap
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            selectedLocalityId={selectedLocalityId}
            onSelectLocality={(locId) => setSelectedLocalityId(locId)}
          />
        )}

        {activeTab === 'risk-model' && (
          <ExplainableRiskModel
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'migration' && (
          <MigrationAlertSystem
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBookForChildId={handleBookForChildId}
          />
        )}

        {activeTab === 'outreach-planner' && (
          <OutreachPlanGenerator
            childrenRecords={childrenRecords}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'booking' && (
          <BookingSystem
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            prefilledChild={prefilledChildForBooking}
            onBookingCreated={handleBookingCreated}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenJudgeBrief={() => setIsJudgeBriefOpen(true)}
      />

      {/* Notification Centre Drawer */}
      <NotificationCentre
        isOpen={isNotificationCentreOpen}
        onClose={() => setIsNotificationCentreOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onClearAll={handleClearAll}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Hackathon Presentation Judge Modal */}
      <PresentationJudgeModal
        isOpen={isJudgeBriefOpen}
        onClose={() => setIsJudgeBriefOpen(false)}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

    </div>
  );
}
