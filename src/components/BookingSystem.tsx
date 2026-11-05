import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Printer, 
  PlusCircle, 
  AlertCircle,
  FileCheck,
  Search,
  Filter,
  Check
} from 'lucide-react';
import { BookingRecord, ChildRecord } from '../types';
import { LOCALITIES_DATA, INITIAL_BOOKINGS } from '../data/syntheticData';
import { NavTab } from './Navbar';

interface BookingSystemProps {
  onNavigate: (tab: NavTab) => void;
  prefilledChild?: ChildRecord | null;
  onBookingCreated?: (booking: BookingRecord) => void;
}

export const BookingSystem: React.FC<BookingSystemProps> = ({
  onNavigate,
  prefilledChild,
  onBookingCreated
}) => {
  const [bookings, setBookings] = useState<BookingRecord[]>(INITIAL_BOOKINGS);
  const [activeView, setActiveView] = useState<'form' | 'list'>('form');

  // Form state
  const [childIdentifier, setChildIdentifier] = useState(
    prefilledChild ? `${prefilledChild.id} (${prefilledChild.anonymizedAlias})` : ''
  );
  const [parentName, setParentName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [locality, setLocality] = useState(
    prefilledChild ? prefilledChild.localityName : LOCALITIES_DATA[0].name
  );
  const [childAgeMonths, setChildAgeMonths] = useState<number>(
    prefilledChild ? prefilledChild.ageMonths : 12
  );
  const [preferredDate, setPreferredDate] = useState<string>('2024-11-20');
  const [timeSlot, setTimeSlot] = useState<string>('09:30 AM - 11:00 AM');
  const [sessionType, setSessionType] = useState<BookingRecord['sessionType']>('Doorstep Outreach Visit');
  const [selectedAntigens, setSelectedAntigens] = useState<string[]>(
    prefilledChild && prefilledChild.missedAntigens.length > 0 
      ? prefilledChild.missedAntigens 
      : ['MR-1 (Measles-Rubella)', 'Vitamin A (Dose 1)']
  );
  const [specialNeeds, setSpecialNeeds] = useState(
    prefilledChild ? `Overdue by ${prefilledChild.daysOverdue} days. ${prefilledChild.riskFactors.primaryReason}` : ''
  );

  // Success Confirmation Modal
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  // List filter state
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const antigenOptions = [
    { name: 'BCG (Tuberculosis)', age: 'At Birth' },
    { name: 'Oral Polio Vaccine (OPV)', age: 'Birth, 6, 10, 14 Wks' },
    { name: 'Pentavalent (DPT-HepB-Hib)', age: '6, 10, 14 Wks' },
    { name: 'Rotavirus (Severe Diarrhoea)', age: '6, 10, 14 Wks' },
    { name: 'PCV (Pneumococcal)', age: '6, 14 Wks & 9 Mos' },
    { name: 'MR-1 (Measles-Rubella)', age: '9 - 12 Months' },
    { name: 'MR-2 & DPT Booster', age: '16 - 24 Months' },
    { name: 'Vitamin A Supplementation', age: '9 Months+' }
  ];

  const handleAntigenToggle = (antigenName: string) => {
    if (selectedAntigens.includes(antigenName)) {
      setSelectedAntigens(prev => prev.filter(a => a !== antigenName));
    } else {
      setSelectedAntigens(prev => [...prev, antigenName]);
    }
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childIdentifier.trim() || !parentName.trim() || !contactNumber.trim()) {
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newBooking: BookingRecord = {
      bookingId: `VAX-BK-${randomSuffix}`,
      childIdentifier: childIdentifier.trim(),
      parentName: parentName.trim(),
      contactNumber: contactNumber.trim(),
      locality,
      childAgeMonths: Number(childAgeMonths),
      preferredDate,
      timeSlot,
      sessionType,
      requestedAntigens: selectedAntigens.length > 0 ? selectedAntigens : ['Routine Age-Appropriate Catch-up'],
      specialNeeds: specialNeeds.trim() || 'Standard vaccination appointment booked.',
      status: 'Confirmed',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setBookings(prev => [newBooking, ...prev]);
    setConfirmedBooking(newBooking);
    if (onBookingCreated) onBookingCreated(newBooking);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }
  };

  const handleStatusChange = (bookingId: string, newStatus: BookingRecord['status']) => {
    setBookings(prev => prev.map(b => {
      if (b.bookingId === bookingId) return { ...b, status: newStatus };
      return b;
    }));
  };

  const filteredBookings = bookings.filter(b => {
    const q = searchFilter.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      b.bookingId.toLowerCase().includes(q) ||
      b.childIdentifier.toLowerCase().includes(q) ||
      b.parentName.toLowerCase().includes(q) ||
      b.locality.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 py-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <span>Direct Citizen &amp; Frontline Portal</span>
            <span aria-hidden="true">·</span>
            <span>Appointment Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Vaccination Session &amp; Doorstep Outreach Booking
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Schedule a dedicated clinic slot or request a doorstep health worker visit for overdue child vaccines.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl text-xs self-start md:self-auto">
          <button
            onClick={() => setActiveView('form')}
            className={`px-3.5 py-1.5 font-medium rounded-lg transition-colors cursor-pointer ${
              activeView === 'form' 
                ? 'bg-white text-stone-900 shadow-2xs font-semibold' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Schedule New Session
          </button>
          <button
            onClick={() => setActiveView('list')}
            className={`px-3.5 py-1.5 font-medium rounded-lg transition-colors cursor-pointer ${
              activeView === 'list' 
                ? 'bg-white text-stone-900 shadow-2xs font-semibold' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            View Bookings ({bookings.length})
          </button>
        </div>
      </div>

      {/* Main View: Booking Form */}
      {activeView === 'form' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Booking Form Card */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Vaccination Appointment Details
              </h2>
              <p className="text-xs text-stone-500">
                Please enter the child&apos;s details, requested vaccine doses, and preferred timing.
              </p>
            </div>

            <form onSubmit={handleSubmitBooking} className="space-y-6">
              
              {/* Section 1: Child & Guardian Details */}
              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                  1. Child &amp; Guardian Information
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">
                      Child Identifier or Name <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="e.g. VR-2024-0104 or Child Aarav M."
                        value={childIdentifier}
                        onChange={(e) => setChildIdentifier(e.target.value)}
                        required
                        className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-700 focus:bg-white text-stone-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-1">
                      Parent / Guardian Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Radha Murugan"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-700 focus:bg-white text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-1">
                      Contact Mobile Number <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        placeholder="e.g. +91 98765-43210"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        required
                        className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-700 focus:bg-white text-stone-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-1">
                      Child&apos;s Age (in Months) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={72}
                      value={childAgeMonths}
                      onChange={(e) => setChildAgeMonths(parseInt(e.target.value) || 0)}
                      required
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-700 focus:bg-white text-stone-900 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Locality & Mode */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <div className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                  2. Locality &amp; Service Delivery Mode
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">
                      Residential Locality:
                    </label>
                    <select
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900 focus:outline-hidden"
                    >
                      {LOCALITIES_DATA.map(loc => (
                        <option key={loc.id} value={loc.name}>
                          {loc.name} ({loc.type} - {loc.distanceToPHCKm} km)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-1">
                      Delivery Location:
                    </label>
                    <select
                      value={sessionType}
                      onChange={(e: any) => setSessionType(e.target.value)}
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900 focus:outline-hidden"
                    >
                      <option value="Doorstep Outreach Visit">Doorstep Outreach Visit (Health Worker visits home)</option>
                      <option value="Primary Health Centre (PHC) Walk-in">Primary Health Centre (PHC) Walk-in (Reserved slot)</option>
                      <option value="Mobile Village Camp">Mobile Village Health Camp (Village Anganwadi)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Antigens Multi-Select */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                    3. Required Vaccines / Due Doses ({selectedAntigens.length} Selected)
                  </div>
                  <span className="text-[11px] text-stone-500">Tap to toggle</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {antigenOptions.map((antigen) => {
                    const isChecked = selectedAntigens.includes(antigen.name);
                    return (
                      <div
                        key={antigen.name}
                        onClick={() => handleAntigenToggle(antigen.name)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer select-none transition-colors ${
                          isChecked 
                            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-medium' 
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <div>
                          <div>{antigen.name}</div>
                          <div className="text-[10px] text-stone-500 font-normal">{antigen.age}</div>
                        </div>
                        <div className={`w-4 h-4 rounded-sm flex items-center justify-center border ${
                          isChecked ? 'bg-emerald-700 border-emerald-700 text-white' : 'border-stone-300 bg-white'
                        }`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: Preferred Date & Time Slot */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <div className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                  4. Preferred Schedule &amp; Timing
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">
                      Preferred Date:
                    </label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-1">
                      Time Slot Window:
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900 focus:outline-hidden"
                    >
                      <option value="07:30 AM - 09:00 AM">07:30 AM - 09:00 AM (Early Morning / Working shifts)</option>
                      <option value="09:30 AM - 11:00 AM">09:30 AM - 11:00 AM (Standard Morning Slot)</option>
                      <option value="11:30 AM - 01:00 PM">11:30 AM - 01:00 PM (Midday Session)</option>
                      <option value="04:00 PM - 05:30 PM">04:00 PM - 05:30 PM (Late Afternoon Outreach)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1 text-xs">
                    Special Accessibility, Language, or Hesitancy Notes (Optional):
                  </label>
                  <textarea
                    rows={2}
                    value={specialNeeds}
                    onChange={(e) => setSpecialNeeds(e.target.value)}
                    placeholder="e.g. Caregiver requested gentle counselling regarding post-vaccine fever; needs boat transit across south bank..."
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-emerald-700 focus:bg-white text-stone-900"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-stone-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 inline mr-1" />
                  Free public healthcare program booking · Synthetic demonstration
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Confirm Vaccination Booking</span>
                </button>
              </div>

            </form>
          </div>

          {/* Right Information & Vaccine Guidance Column */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Guidance Card */}
            <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>How VaxReach Booking Works</span>
              </div>
              <ul className="space-y-3 text-xs text-stone-600 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Doorstep Cold-Chain Delivery:</strong> Frontline ASHA workers are allocated conditioned ice-pack vaccine carriers for confirmed home visits.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>No Long Queues:</strong> Clinic walk-in appointments ensure vaccine availability without stockout disappointments.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Automatic Roster Update:</strong> Completed bookings immediately update the surveillance registry and reduce the child&apos;s risk score.
                  </span>
                </li>
              </ul>
            </div>

            {/* Quick Stats on Bookings */}
            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-2">
              <div className="font-semibold text-stone-800">Recent Session Summary</div>
              <div className="flex justify-between text-stone-600">
                <span>Active Bookings:</span>
                <span className="font-mono font-bold text-stone-900">{bookings.length}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Confirmed Doorstep:</span>
                <span className="font-mono font-bold text-emerald-700">
                  {bookings.filter(b => b.sessionType === 'Doorstep Outreach Visit').length}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>PHC Walk-in:</span>
                <span className="font-mono font-bold text-stone-900">
                  {bookings.filter(b => b.sessionType === 'Primary Health Centre (PHC) Walk-in').length}
                </span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* View: Existing Bookings List */}
      {activeView === 'list' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Scheduled Vaccination Appointments ({filteredBookings.length})
              </h2>
              <p className="text-xs text-stone-500">
                Live registry of confirmed citizen bookings and frontline visits
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-1.5 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
              >
                <option value="All">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Rescheduled">Rescheduled</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12 text-stone-400 text-xs">
                No appointments match your search criteria.
              </div>
            ) : (
              filteredBookings.map((b) => (
                <div
                  key={b.bookingId}
                  className="p-4 rounded-2xl border border-stone-200 hover:border-emerald-300 transition-colors bg-stone-50/50 space-y-2 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-stone-900">{b.bookingId}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-emerald-950">{b.childIdentifier}</span>
                      <span className="text-stone-500">({b.childAgeMonths}m)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        b.status === 'Completed' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : b.status === 'Confirmed' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-stone-600 pt-1">
                    <div>
                      <strong>Parent / Contact:</strong> {b.parentName} ({b.contactNumber})
                    </div>
                    <div>
                      <strong>Locality:</strong> {b.locality}
                    </div>
                    <div>
                      <strong>Mode:</strong> {b.sessionType}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-200/60 text-stone-500">
                    <div>
                      <Calendar className="w-3.5 h-3.5 inline mr-1 text-emerald-700" />
                      <strong>Date &amp; Slot:</strong> {b.preferredDate} ({b.timeSlot})
                    </div>
                    <div>
                      <strong>Antigens:</strong> {b.requestedAntigens.join(', ')}
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={b.status}
                        onChange={(e: any) => handleStatusChange(b.bookingId, e.target.value)}
                        className="py-1 px-2 text-[11px] bg-white border border-stone-200 rounded-md font-medium"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Rescheduled">Rescheduled</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Booking Confirmation Success Modal */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-200 max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl text-center">
            
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                Session Confirmed
              </div>
              <h3 className="text-2xl font-bold text-stone-900">
                Appointment Booked Successfully
              </h3>
              <p className="text-xs text-stone-500">
                Booking Reference Token:{' '}
                <span className="font-mono font-bold text-stone-900 text-sm">
                  {confirmedBooking.bookingId}
                </span>
              </p>
            </div>

            {/* Appointment Pass Card */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Child:</span>
                <span className="font-bold text-stone-900">{confirmedBooking.childIdentifier}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Guardian &amp; Phone:</span>
                <span className="font-medium text-stone-800">{confirmedBooking.parentName} ({confirmedBooking.contactNumber})</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Date &amp; Time Slot:</span>
                <span className="font-bold text-emerald-800">{confirmedBooking.preferredDate} · {confirmedBooking.timeSlot}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Delivery Type:</span>
                <span className="font-medium text-stone-800">{confirmedBooking.sessionType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Vaccines:</span>
                <span className="font-medium text-stone-900 text-right">{confirmedBooking.requestedAntigens.join(', ')}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setConfirmedBooking(null);
                  setActiveView('list');
                }}
                className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold cursor-pointer"
              >
                View in Roster
              </button>
              <button
                onClick={() => {
                  setConfirmedBooking(null);
                  setActiveView('form');
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer"
              >
                Done / Add Another
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
