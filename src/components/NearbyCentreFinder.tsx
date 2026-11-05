import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Navigation, 
  Search, 
  Phone, 
  Clock, 
  ThermometerSnowflake, 
  ExternalLink, 
  LocateFixed, 
  AlertCircle, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  ArrowUpDown,
  Compass,
  Calendar,
  X
} from 'lucide-react';
import { VaccinationCentre } from '../types';
import { SAMPLE_VACCINATION_CENTRES, calculateHaversineDistance } from '../data/syntheticData';
import { NavTab } from './Navbar';

interface NearbyCentreFinderProps {
  onNavigate: (tab: NavTab) => void;
  onBookAtCentre?: (centre: VaccinationCentre) => void;
}

export const NearbyCentreFinder: React.FC<NearbyCentreFinderProps> = ({
  onNavigate,
  onBookAtCentre
}) => {
  // User's focal location (defaults to Central Delhi area 28.6315, 77.2167)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationSource, setLocationSource] = useState<'gps' | 'preset' | 'default'>('default');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedCentre, setSelectedCentre] = useState<VaccinationCentre | null>(null);

  // Map DOM reference
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.LayerGroup | null>(null);

  // Default coordinate if no location
  const defaultCoords = { lat: 28.6448, lng: 77.2167 };

  // Current reference location for distance calculations
  const referenceCoords = userLocation || defaultCoords;

  // Compute distances and sort
  const centresWithDistance = useMemo(() => {
    return SAMPLE_VACCINATION_CENTRES.map((centre) => {
      const distance = calculateHaversineDistance(
        referenceCoords.lat,
        referenceCoords.lng,
        centre.coordinates.lat,
        centre.coordinates.lng
      );
      return { ...centre, distanceKm: distance };
    }).sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  }, [referenceCoords]);

  // Filtered centres
  const filteredCentres = useMemo(() => {
    return centresWithDistance.filter((centre) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        centre.name.toLowerCase().includes(q) ||
        centre.locality.toLowerCase().includes(q) ||
        centre.pinCode.includes(q) ||
        centre.address.toLowerCase().includes(q) ||
        centre.availableVaccines.some(v => v.toLowerCase().includes(q));

      const matchesCategory = categoryFilter === 'All' || centre.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [centresWithDistance, searchQuery, categoryFilter]);

  // Request browser geolocation
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser. Please search by locality or PIN code.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(coords);
        setLocationSource('gps');
        setIsLocating(false);

        // Center map to user position
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([coords.lat, coords.lng], 13, { duration: 1.5 });
        }
      },
      (error) => {
        setIsLocating(false);
        let errorMsg = 'Unable to retrieve your location.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location access was denied. You can still browse centres or select a preset location below.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'Location information is unavailable. Switched to district demonstration coordinates.';
        }
        setLocationError(errorMsg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Preset location setter for quick testing
  const handleSelectPreset = (coords: { lat: number; lng: number }, name: string) => {
    setUserLocation(coords);
    setLocationSource('preset');
    setLocationError(null);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([coords.lat, coords.lng], 13, { duration: 1.2 });
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialMap = L.map(mapContainerRef.current, {
        center: [defaultCoords.lat, defaultCoords.lng],
        zoom: 12,
        zoomControl: true,
        attributionControl: true
      });

      // Clean OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(initialMap);

      markersGroupRef.current = L.layerGroup().addTo(initialMap);
      userMarkerRef.current = L.layerGroup().addTo(initialMap);
      mapInstanceRef.current = initialMap;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update User Marker
  useEffect(() => {
    if (!mapInstanceRef.current || !userMarkerRef.current) return;
    userMarkerRef.current.clearLayers();

    if (userLocation) {
      const userDivIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div style="position: relative; width: 24px; height: 24px;">
            <div style="position: absolute; inset: -8px; background: rgba(5, 150, 105, 0.25); border-radius: 50%; animation: pulse 2s infinite;"></div>
            <div style="width: 24px; height: 24px; background: #047857; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const userMarker = L.marker([userLocation.lat, userLocation.lng], {
        icon: userDivIcon,
        zIndexOffset: 1000
      }).bindPopup(`
        <div style="font-family: system-ui; font-size: 12px; padding: 4px;">
          <strong style="color: #047857;">Your Current Location</strong>
          <p style="margin: 4px 0 0; color: #57534e;">Showing nearest vaccination facilities within your area.</p>
        </div>
      `);

      userMarkerRef.current.addLayer(userMarker);

      // Draw accuracy / proximity circle
      const circle = L.circle([userLocation.lat, userLocation.lng], {
        radius: 1200,
        color: '#059669',
        fillColor: '#10b981',
        fillOpacity: 0.08,
        weight: 1
      });
      userMarkerRef.current.addLayer(circle);
    }
  }, [userLocation]);

  // Update Centre Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;
    markersGroupRef.current.clearLayers();

    filteredCentres.forEach((centre) => {
      const isSelected = selectedCentre?.id === centre.id;
      const isHospital = centre.category.includes('Hospital');
      const isPHC = centre.category.includes('PHC');

      const markerColor = isHospital ? '#047857' : isPHC ? '#0d9488' : '#0284c7';

      const customIcon = L.divIcon({
        className: 'custom-centre-marker',
        html: `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${isSelected ? '36px' : '30px'};
            height: ${isSelected ? '36px' : '30px'};
            background-color: ${isSelected ? '#0f172a' : markerColor};
            color: #ffffff;
            border: 2px solid #ffffff;
            border-radius: 50%;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            font-size: 13px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s ease;
          ">
            +
          </div>
        `,
        iconSize: isSelected ? [36, 36] : [30, 30],
        iconAnchor: isSelected ? [18, 18] : [15, 15]
      });

      const marker = L.marker([centre.coordinates.lat, centre.coordinates.lng], {
        icon: customIcon
      });

      const popupContent = `
        <div style="font-family: 'DM Sans', system-ui, sans-serif; font-size: 12px; max-width: 220px; padding: 2px;">
          <div style="font-weight: 700; color: #1c1917; font-size: 13px; margin-bottom: 2px;">${centre.name}</div>
          <div style="color: #047857; font-weight: 600; font-size: 11px;">${centre.category} · ${centre.distanceKm ? `${centre.distanceKm} km away` : ''}</div>
          <p style="margin: 6px 0; color: #57534e; font-size: 11px;">${centre.address}</p>
          <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #e7e5e4; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 10px; color: #78716c;">Timing: ${centre.operatingHours.split('(')[0]}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        setSelectedCentre(centre);
      });

      markersGroupRef.current?.addLayer(marker);
    });
  }, [filteredCentres, selectedCentre]);

  // Center on selected centre
  const handleSelectCentreFromList = (centre: VaccinationCentre) => {
    setSelectedCentre(centre);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([centre.coordinates.lat, centre.coordinates.lng], 14, { duration: 1 });
    }
  };

  return (
    <div className="space-y-6 py-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <span>Geospatial Vaccine Access</span>
            <span aria-hidden="true">·</span>
            <span>Leaflet &amp; OpenStreetMap</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Nearby Vaccination Centre Finder
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Locate authorized immunization hubs, check live distance, inspect cold-chain viability, and get direct navigation routes.
          </p>
        </div>

        {/* Geolocation Button */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleRequestLocation}
            disabled={isLocating}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <LocateFixed className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Detecting Location...' : 'Use My Current Location'}</span>
          </button>
        </div>
      </div>

      {/* Synthetic Demonstration Data Banner */}
      <div className="bg-stone-100/90 border border-stone-200 rounded-xl p-3.5 flex items-center justify-between text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            <strong>DEMONSTRATION REPOSITORY:</strong> Displaying certified synthetic public health facilities mapped with real GIS coordinates and OpenStreetMap. 
            Google Maps turn-by-turn navigation is fully supported for all coordinates.
          </span>
        </div>
        <span className="font-mono text-[11px] text-stone-500 hidden sm:inline">OSM Leaflet v1.9</span>
      </div>

      {/* Location Status / Fallback Notice */}
      {locationError && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Notice:</span> {locationError}
              <div className="mt-1 text-amber-800 flex items-center gap-2 flex-wrap">
                <span>Select demonstration reference point:</span>
                <button
                  onClick={() => handleSelectPreset({ lat: 28.6792, lng: 77.2148 }, 'Shastri Nagar Hub')}
                  className="px-2 py-0.5 bg-white border border-amber-300 rounded-md font-semibold text-amber-900 hover:bg-amber-100"
                >
                  Shastri Nagar
                </button>
                <button
                  onClick={() => handleSelectPreset({ lat: 28.7250, lng: 77.1520 }, 'Sitapur Settlement')}
                  className="px-2 py-0.5 bg-white border border-amber-300 rounded-md font-semibold text-amber-900 hover:bg-amber-100"
                >
                  Sitapur Settlement
                </button>
                <button
                  onClick={() => handleSelectPreset({ lat: 28.6315, lng: 77.2167 }, 'Central District')}
                  className="px-2 py-0.5 bg-white border border-amber-300 rounded-md font-semibold text-amber-900 hover:bg-amber-100"
                >
                  Central District
                </button>
              </div>
            </div>
          </div>
          <button onClick={() => setLocationError(null)} className="text-amber-500 hover:text-amber-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by locality, PIN code (e.g. 110054), or vaccine name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:bg-white"
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

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-800 focus:outline-hidden"
            >
              <option value="All">All Facility Types ({centresWithDistance.length})</option>
              <option value="Primary Health Centre (PHC)">Primary Health Centres (PHC)</option>
              <option value="District Civil Hospital">District Civil Hospitals</option>
              <option value="Community Health Centre (CHC)">Community Health Centres (CHC)</option>
              <option value="Urban Health Post">Urban Health Posts</option>
              <option value="Sub-Centre">Sub-Centres &amp; Outreach Posts</option>
            </select>
          </div>

          {/* Current Reference Location Badge */}
          <div className="md:col-span-3 flex items-center justify-end text-xs text-stone-500">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl w-full justify-between">
              <span className="truncate">
                {locationSource === 'gps' ? '📍 GPS Location Active' : '📍 Demonstration Reference'}
              </span>
              <span className="font-mono text-[11px] text-emerald-800 font-semibold shrink-0">
                Sorted by Proximity
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Layout: Side-by-Side Map & Comparison List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Interactive Leaflet Map Container */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-700" />
              <span className="font-semibold text-stone-900">Interactive OpenStreetMap Coverage View</span>
            </div>
            <span className="text-[11px] text-stone-500 font-mono">
              {filteredCentres.length} Centres Mapped
            </span>
          </div>

          {/* Leaflet Map Target Div */}
          <div
            ref={mapContainerRef}
            className="w-full aspect-[4/3] sm:aspect-[16/10] bg-stone-100 rounded-2xl border border-stone-200 z-10"
            style={{ minHeight: '380px' }}
          />

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500 pt-1">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
                Hospital Hub
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                Primary Health Centre (PHC)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
                Outreach Sub-Centre
              </span>
            </div>
            <span>Click any marker to view schedule and get directions</span>
          </div>
        </div>

        {/* Right: Sorted List View with Detail Card */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Detail Spotlight Card if Selected */}
          {selectedCentre && (
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
                    Selected Facility
                  </div>
                  <h3 className="text-base font-bold text-stone-900 mt-0.5">
                    {selectedCentre.name}
                  </h3>
                  <div className="text-xs text-stone-600 mt-0.5">
                    {selectedCentre.address} · PIN: {selectedCentre.pinCode}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCentre(null)}
                  className="text-stone-400 hover:text-stone-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Badges & Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 bg-white rounded-xl border border-emerald-100">
                  <div className="text-[10px] text-stone-400 uppercase font-semibold">Distance</div>
                  <div className="text-sm font-bold text-emerald-800 font-mono mt-0.5">
                    {selectedCentre.distanceKm} km
                  </div>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-emerald-100">
                  <div className="text-[10px] text-stone-400 uppercase font-semibold">Cold Chain</div>
                  <div className="text-xs font-bold text-stone-800 mt-0.5 truncate">
                    {selectedCentre.coldChainStatus}
                  </div>
                </div>
              </div>

              {/* Operating Info */}
              <div className="space-y-1 text-xs text-stone-700">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>{selectedCentre.operatingHours}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="font-mono">{selectedCentre.contactPhone}</span>
                </div>
              </div>

              {/* Available Vaccines */}
              <div className="pt-2 border-t border-emerald-200/60">
                <div className="text-[11px] font-semibold text-emerald-950 mb-1">
                  In-Stock Vaccines:
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedCentre.availableVaccines.map(v => (
                    <span key={v} className="px-2 py-0.5 bg-white border border-emerald-200 rounded-md text-[10px] font-medium text-emerald-900">
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedCentre.coordinates.lat},${selectedCentre.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors shadow-2xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                </a>
                <button
                  onClick={() => {
                    if (onBookAtCentre) onBookAtCentre(selectedCentre);
                    else onNavigate('booking');
                  }}
                  className="inline-flex items-center gap-1.5 py-2.5 px-3 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-semibold text-xs transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Book Slot</span>
                </button>
              </div>

            </div>
          )}

          {/* List of Nearby Centres */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h2 className="text-sm font-bold text-stone-900">
                Nearby Vaccination Centres ({filteredCentres.length})
              </h2>
              <span className="text-xs text-stone-500">Nearest First</span>
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredCentres.length === 0 ? (
                <div className="text-center py-8 text-stone-400 text-xs">
                  No vaccination centres match your search or filter criteria.
                </div>
              ) : (
                filteredCentres.map((centre) => {
                  const isSelected = selectedCentre?.id === centre.id;
                  return (
                    <div
                      key={centre.id}
                      onClick={() => handleSelectCentreFromList(centre)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-300' 
                          : 'bg-stone-50/50 border-stone-200 hover:bg-stone-100/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-stone-900 text-xs hover:text-emerald-800 transition-colors">
                            {centre.name}
                          </div>
                          <div className="text-[11px] text-stone-500">
                            {centre.locality} · PIN: {centre.pinCode}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="font-mono text-xs font-bold text-emerald-800">
                            {centre.distanceKm} km
                          </div>
                          <div className="text-[10px] text-stone-400">away</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 mt-2 border-t border-stone-200/60 text-[11px] text-stone-600">
                        <span className="truncate max-w-[190px]">{centre.operatingHours}</span>
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${centre.coordinates.lat},${centre.coordinates.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-emerald-700 hover:text-emerald-900 font-semibold inline-flex items-center gap-0.5"
                          >
                            <span>Navigate</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
