import React from 'react';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  AlertCircle, 
  Clock, 
  ShieldAlert, 
  Info, 
  X, 
  Trash2,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { AppNotification } from '../types';
import { NavTab } from './Navbar';

interface NotificationCentreProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onNavigate: (tab: NavTab) => void;
}

export const NotificationCentre: React.FC<NotificationCentreProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onNavigate
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notif: AppNotification) => {
    onMarkAsRead(notif.id);
    onClose();
    onNavigate('vaccination-tracker');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden no-print" aria-modal="true" role="dialog">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/30 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      {/* Floating Panel / Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-sm sm:max-w-md w-full bg-white shadow-2xl flex flex-col z-50 border-l border-stone-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900">Vaccination Notification Centre</h2>
              <p className="text-[11px] text-stone-500">
                {unreadCount > 0 ? `${unreadCount} unread reminder(s)` : 'All reminders caught up'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action bar */}
        <div className="px-4 py-2 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>Active schedule alerts</span>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-emerald-700 hover:text-emerald-900 font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-stone-400 hover:text-red-600 font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-stone-400 text-xs">
              <Bell className="w-8 h-8 text-stone-300 mx-auto mb-2 opacity-50" />
              <p className="font-semibold text-stone-600">No active notifications</p>
              <p className="text-[11px] text-stone-400 mt-1">Vaccination alerts will appear here as due dates approach.</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const isOverdue = notif.type === 'overdue' || notif.severity === 'high';
              const isUpcoming = notif.type.includes('reminder') || notif.type === 'due_today';

              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                    notif.read 
                      ? 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50' 
                      : isOverdue 
                        ? 'bg-red-50/60 border-red-200 text-stone-900 shadow-2xs' 
                        : 'bg-emerald-50/60 border-emerald-200 text-stone-900 shadow-2xs'
                  }`}
                >
                  {!notif.read && (
                    <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-emerald-600" />
                  )}

                  <div className="flex items-start gap-2.5">
                    <div className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                      isOverdue 
                        ? 'bg-red-100 text-red-700' 
                        : isUpcoming 
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {isOverdue ? <AlertCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between pr-4">
                        <span className="font-bold text-xs text-stone-900">{notif.title}</span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">{notif.message}</p>
                      
                      <div className="flex items-center justify-between pt-1 text-[10px] text-stone-400">
                        <span>{notif.date}</span>
                        <span className="font-semibold text-emerald-700 hover:underline">
                          View in Tracker →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 text-xs text-stone-500 flex items-center justify-between">
          <span>Indian NIS Reminder Engine</span>
          <button
            onClick={() => {
              onClose();
              onNavigate('vaccination-tracker');
            }}
            className="text-emerald-700 font-semibold hover:underline"
          >
            Manage Settings
          </button>
        </div>

      </div>
    </div>
  );
};
