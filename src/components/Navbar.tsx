import React, { useState } from 'react';
import { ShieldCheck, Menu, X, Award, PlusCircle, Bell, MapPin } from 'lucide-react';

export type NavTab = 
  | 'landing' 
  | 'dashboard' 
  | 'tracker' 
  | 'vaccination-tracker'
  | 'centre-finder'
  | 'hotspots' 
  | 'risk-model' 
  | 'migration' 
  | 'outreach-planner' 
  | 'booking';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenJudgeBrief: () => void;
  unreadCount?: number;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  onSelectTab, 
  onOpenJudgeBrief,
  unreadCount = 0,
  onOpenNotifications
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: NavTab; label: string; highlight?: boolean }[] = [
    { id: 'landing', label: 'Overview' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'vaccination-tracker', label: 'Vaccination Tracker', highlight: true },
    { id: 'centre-finder', label: 'Nearby Centres' },
    { id: 'tracker', label: 'Missed Sessions' },
    { id: 'hotspots', label: 'Locality Map' },
    { id: 'risk-model', label: 'Risk Logic' },
    { id: 'migration', label: 'Migration' },
    { id: 'outreach-planner', label: 'Outreach Plan' },
    { id: 'booking', label: 'Book Appointment' }
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Hackathon & Synthetic Data Notice Bar */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-2 px-4 border-b border-emerald-900/60 no-print">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-emerald-300">Hackathon Prototype</span>
            <span aria-hidden="true" className="text-emerald-500">·</span>
            <span className="truncate">Decision Support · Nearby Centre Finder · Personal Vaccination Tracker</span>
          </div>
          <button
            onClick={onOpenJudgeBrief}
            className="flex items-center gap-1.5 font-medium text-emerald-300 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Judge Pitch Brief</span>
          </button>
        </div>
      </div>

      {/* Main Top Bar adhering to Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-b border-stone-200/90 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          
          {/* Zone 1: Single Wordmark */}
          <button 
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-2 text-stone-900 hover:opacity-90 transition-opacity text-left shrink-0 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-stone-900 font-display">
              Vax<span className="text-emerald-700">Reach</span>
            </span>
          </button>

          {/* Zone 2: Clean single-line navigation links */}
          <nav className="hidden xl:flex items-center gap-5 text-sm font-medium text-stone-600">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive 
                      ? 'text-emerald-800 font-semibold' 
                      : link.highlight
                        ? 'text-emerald-900 font-semibold hover:text-emerald-700'
                        : 'hover:text-stone-900'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Compact Nav for Large Screens (1024px to 1279px) */}
          <nav className="hidden lg:flex xl:hidden items-center gap-3.5 text-xs font-medium text-stone-600">
            {navLinks.slice(0, 6).map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`py-1 whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive ? 'text-emerald-800 font-semibold border-b-2 border-emerald-700' : 'hover:text-stone-900'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
            <button
              onClick={() => handleNavClick('outreach-planner')}
              className={`py-1 whitespace-nowrap shrink-0 ${activeTab === 'outreach-planner' ? 'font-semibold text-emerald-800' : ''}`}
            >
              More...
            </button>
          </nav>

          {/* Zone 3: Notification Bell & Primary Action */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Notification Bell Icon */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
              title="Open Notification Centre"
              aria-label="Vaccination notifications"
            >
              <Bell className="w-5 h-5 text-stone-700" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => handleNavClick('booking')}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Book Session</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-stone-200 bg-[#faf8f5] px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === link.id
                    ? 'bg-emerald-100/80 text-emerald-900 font-semibold'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 border-t border-stone-200 mt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenJudgeBrief();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg"
              >
                <Award className="w-4 h-4" />
                <span>Presentation Pitch Guide</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
