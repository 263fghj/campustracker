import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { LiveTransitMap } from '../map/LiveTransitMap';
import {
  Navigation,
  MapPin,
  Clock,
  Users,
  Phone,
  QrCode,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Bus as BusIcon,
  Search,
  Calendar,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Smartphone,
  ExternalLink,
  Info,
  Check,
  Shield,
  Gauge,
  Grid,
} from 'lucide-react';

export const StudentApp: React.FC<{ forceFrame?: boolean }> = ({ forceFrame = true }) => {
  const {
    students,
    activeStudent,
    setActiveStudentId,
    buses,
    routes,
    alerts,
    markAlertRead,
    selectedBusId,
    setSelectedBusId,
    drivers,
    setViewMode,
  } = useTransit();

  const [activeTab, setActiveTab] = useState<'track' | 'routes' | 'pass' | 'trips' | 'alerts'>('track');
  const [usePhoneFrame, setUsePhoneFrame] = useState<boolean>(forceFrame);
  const [selectedRouteFilter, setSelectedRouteFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [callInitiated, setCallInitiated] = useState<boolean>(false);
  const [showLostItemModal, setShowLostItemModal] = useState<boolean>(false);
  const [lostItemText, setLostItemText] = useState<string>('');
  const [lostItemSuccess, setLostItemSuccess] = useState<boolean>(false);

  // Student's assigned route and bus
  const currentStudent = activeStudent || students[0];
  const myRoute = routes.find((r) => r.id === currentStudent?.assignedRouteId) || routes[0];
  const myBus = buses.find((b) => b.routeId === myRoute.id) || buses[0];
  const myDriver = drivers.find((d) => d.id === myBus.driverId) || drivers[0];
  const myPickupStop = myRoute.stops.find((s) => s.id === currentStudent?.pickupStopId) || myRoute.stops[2];

  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  const handleCallDriver = () => {
    setCallInitiated(true);
    setTimeout(() => setCallInitiated(false), 3500);
  };

  const handleReportLostItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lostItemText.trim()) return;
    setLostItemSuccess(true);
    setTimeout(() => {
      setLostItemSuccess(false);
      setShowLostItemModal(false);
      setLostItemText('');
    }, 2000);
  };

  // Content for each tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'track':
        return (
          <div className="space-y-4">
            {/* Live Status Hero Banner */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-4 shadow-md relative overflow-hidden">
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <div className="text-[11px] font-medium tracking-wide uppercase text-blue-200">
                    Live Tracking · {myRoute.code}
                  </div>
                  <h2 className="text-xl font-bold mt-0.5">{myBus.busNumber}</h2>
                  <div className="text-xs text-blue-100 mt-0.5">{myRoute.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-semibold text-blue-200">Arriving in</div>
                  <div className="text-3xl font-extrabold font-mono tracking-tight text-white">
                    {myBus.etaToNextStopMin} <span className="text-sm font-normal">min</span>
                  </div>
                </div>
              </div>

              {/* Progress and Pickup Stop */}
              <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs relative z-10">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-300" />
                  <span className="text-blue-100">Your Pickup:</span>
                  <span className="font-semibold text-white">{myPickupStop?.name}</span>
                </div>
                <div className="font-mono text-blue-200">
                  {myBus.telemetry.speedKmH} km/h
                </div>
              </div>

              {/* Crowd Capacity Indicator */}
              <div className="mt-2 text-xs relative z-10">
                <div className="flex items-center justify-between text-[11px] text-blue-200 mb-1">
                  <span>Occupancy ({myBus.passengersOnboard}/{myBus.capacity} seats)</span>
                  <span className="font-medium text-white">
                    {myBus.passengersOnboard > 45 ? 'Crowded' : 'Moderate Seats'}
                  </span>
                </div>
                <div className="w-full bg-blue-950/40 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      myBus.passengersOnboard > 45 ? 'bg-amber-300' : 'bg-emerald-300'
                    }`}
                    style={{ width: `${(myBus.passengersOnboard / myBus.capacity) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Embedded Live Map View */}
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>GPS Stream Live</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  {myBus.telemetry.lat.toFixed(4)}°N, {myBus.telemetry.lng.toFixed(4)}°E
                </span>
              </div>
              <LiveTransitMap
                height="h-[280px]"
                focusedBusId={myBus.id}
                focusedRouteId={myRoute.id}
                compact={true}
              />
            </div>

            {/* Driver Contact & Info Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <img
                  src={myDriver.avatarUrl}
                  alt={myDriver.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
                />
                <div>
                  <div className="text-xs text-slate-500">Assigned Driver</div>
                  <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{myDriver.name}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>★ {myDriver.rating}</span>
                    <span>·</span>
                    <span>{myDriver.experienceYears} yrs transit</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCallDriver}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Driver</span>
                </button>
              </div>
            </div>

            {callInitiated && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between animate-fade-in">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600 animate-bounce" />
                  <span>Connecting to Driver Michael Vance ({myDriver.phone})...</span>
                </div>
                <span className="font-mono text-[10px] text-emerald-600">Simulated Call</span>
              </div>
            )}

            {/* Route Stops Checklist Timeline */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Route Stops & Schedule
              </h3>
              <div className="relative pl-6 space-y-4">
                {/* Vertical continuous line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-800" />

                {myRoute.stops.map((stop, idx) => {
                  const isCurrent = myBus.currentStopIndex === idx;
                  const isPassed = myBus.currentStopIndex > idx;
                  const isMyPickup = stop.id === activeStudent?.pickupStopId;

                  return (
                    <div key={stop.id} className="relative flex items-start justify-between text-xs">
                      {/* Node circle */}
                      <div
                        className={`absolute -left-6 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center border-2 ${
                          isCurrent
                            ? 'bg-blue-600 border-blue-200 text-white animate-pulse'
                            : isPassed
                            ? 'bg-emerald-500 border-white dark:border-slate-900 text-white'
                            : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400'
                        }`}
                      >
                        {isPassed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>

                      <div className="pr-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold ${
                              isCurrent
                                ? 'text-blue-600 dark:text-blue-400 font-bold'
                                : 'text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {stop.name}
                          </span>
                          {isMyPickup && (
                            <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.2 rounded">
                              Your Stop
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{stop.landmark}</div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-mono text-slate-600 dark:text-slate-400 font-medium">
                          {stop.scheduledTime}
                        </div>
                        {isCurrent && (
                          <div className="text-[10px] font-semibold text-blue-600">Bus Here</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'routes':
        return (
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search stops, routes, landmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="space-y-3">
              {routes.map((route) => {
                const bus = buses.find((b) => b.routeId === route.id);
                return (
                  <div
                    key={route.id}
                    className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                          style={{ backgroundColor: route.color }}
                        >
                          {route.code}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                            {route.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {route.stops.length} stops · {route.totalDistanceKm} km · Every {route.frequencyMinutes} min
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300">
                        {bus?.busNumber || 'Assigned'}
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div className="text-slate-500">
                        Hours: <span className="font-medium text-slate-700 dark:text-slate-300">{route.operatingHours}</span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedBusId(bus?.id || 'bus-104');
                          setActiveTab('track');
                        }}
                        className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                      >
                        <span>View Live</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'pass':
        return (
          <div className="space-y-4">
            {/* Digital Student Bus Pass Card */}
            <div className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 shadow-xl border border-indigo-500/30 overflow-hidden">
              {/* Hologram badge effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-start justify-between relative z-10">
                <div>
                  <div className="text-[10px] font-bold tracking-widest uppercase text-indigo-300">
                    ADITYA UNIVERSITY TRANSPORT PASS
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">ACADEMIC YEAR 2026-2027</div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded text-[10px] font-semibold uppercase tracking-wide">
                  {currentStudent.passStatus}
                </span>
              </div>

              <div className="mt-5 flex items-center gap-4 relative z-10">
                <img
                  src={currentStudent.avatarUrl}
                  alt={currentStudent.name}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-indigo-400/50 shadow-md"
                />
                <div>
                  <h3 className="text-base font-bold text-white">{currentStudent.name}</h3>
                  <div className="text-xs text-indigo-200 font-mono mt-0.5">ID: {currentStudent.rollNo}</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">{currentStudent.department}</div>
                </div>
              </div>

              {/* Pass Route Matrix */}
              <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-xs relative z-10">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Assigned Route</div>
                  <div className="font-semibold text-white mt-0.5">{myRoute.code} - {myRoute.name}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Pickup Stop</div>
                  <div className="font-semibold text-white mt-0.5">{myPickupStop.name}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Pass Number</div>
                  <div className="font-mono text-indigo-200 font-semibold mt-0.5">{currentStudent.passNumber}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Valid Until</div>
                  <div className="font-mono text-white mt-0.5">{currentStudent.passValidUntil}</div>
                </div>
              </div>

              {/* QR Boarding Token */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    {/* SVG representation of crisp QR Code */}
                    <svg className="w-12 h-12 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm8-2h2v2h-2v-2zm4 0h4v2h-4v-2zm2 4h4v4h-4v-4zm-6 2h2v2h-2v-2zm2-2h2v2h-2v-2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Boarding QR Token</div>
                    <div className="text-[11px] text-slate-400">Scan at driver console to board</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions for pass */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Transport Fee Status</span>
                <span className="font-semibold text-emerald-600">Paid in Full · Tier A</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Emergency Parent Contact</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{currentStudent.parentPhone}</span>
              </div>
              <button
                onClick={() => setShowLostItemModal(true)}
                className="w-full py-2 px-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
              >
                Report Lost Item on Bus
              </button>
            </div>
          </div>
        );

      case 'trips':
        return (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Today's Schedule & History
            </h3>

            <div className="space-y-3">
              {/* Morning Pickup */}
              <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      Morning Inbound Trip
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    Active Today
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <div>
                    <span className="text-slate-400">Pickup Time:</span> 07:54 AM
                  </div>
                  <div>
                    <span className="text-slate-400">Drop Campus:</span> 08:20 AM
                  </div>
                  <div>
                    <span className="text-slate-400">Assigned Bus:</span> {myBus.busNumber}
                  </div>
                  <div>
                    <span className="text-slate-400">Pickup Stop:</span> {myPickupStop.name}
                  </div>
                </div>
              </div>

              {/* Evening Drop */}
              <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      Evening Outbound Trip
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">Departs 04:30 PM</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <div>
                    <span className="text-slate-400">Departs Gate:</span> Main Quad Arch
                  </div>
                  <div>
                    <span className="text-slate-400">Drop Stop:</span> {myPickupStop.name}
                  </div>
                </div>
              </div>

              {/* Historical Log */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="text-[11px] font-semibold text-slate-500 mb-2">Recent Completed Rides</div>
                <div className="space-y-2">
                  {[
                    { date: 'Yesterday', trip: 'Evening Drop', onTime: 'On Time (04:35 PM)', bus: 'Bus #104' },
                    { date: 'Yesterday', trip: 'Morning Pickup', onTime: 'On Time (07:52 AM)', bus: 'Bus #104' },
                    { date: '02 Nov', trip: 'Morning Pickup', onTime: 'Delayed +4m', bus: 'Bus #104' },
                  ].map((log, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{log.trip}</div>
                        <div className="text-[11px] text-slate-500">{log.date} · {log.bus}</div>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                        {log.onTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'alerts':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Transit Alerts & Delays
              </h3>
              <span className="text-xs text-slate-500">{alerts.length} announcements</span>
            </div>

            {alerts.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No active notifications or alerts.
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => markAlertRead(alert.id)}
                  className={`p-3.5 rounded-xl border transition-colors cursor-pointer ${
                    !alert.read
                      ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {alert.type === 'sos' ? (
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      ) : alert.type === 'delay' ? (
                        <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      ) : (
                        <Bell className="w-4 h-4 text-blue-600 shrink-0" />
                      )}
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        {alert.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{alert.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 pl-6">{alert.message}</p>
                </div>
              ))
            )}
          </div>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Standalone Student App Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 p-3 bg-white dark:bg-[#1E1235] rounded-2xl border border-[#DDD6FE] dark:border-[#4C288A] shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-[#2E1065] dark:text-[#FAF7F2]">
                Student Commuter Mobile App
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                STANDALONE APP
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              Aditya University Campus Transit Student Companion
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Switch Student Persona */}
          <div className="flex items-center gap-1.5 bg-[#FAF7F2] dark:bg-[#281747] px-2.5 py-1.5 rounded-xl border border-[#E8E0D7] dark:border-[#3D2668]">
            <span className="text-[11px] text-slate-500 font-medium">Logged in:</span>
            <select
              value={currentStudent.id}
              onChange={(e) => setActiveStudentId(e.target.value)}
              className="text-xs bg-transparent border-0 font-bold text-[#2E1065] dark:text-[#FAF7F2] focus:outline-none cursor-pointer"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id} className="text-slate-800 dark:text-slate-200">
                  {s.name} ({s.rollNo})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setUsePhoneFrame(!usePhoneFrame)}
            className="text-xs px-3 py-1.5 bg-[#FAF7F2] dark:bg-[#281747] border border-[#DDD6FE] dark:border-[#4C288A] rounded-xl text-[#581C87] dark:text-[#C4B5FD] font-bold hover:bg-[#EDE9FE] flex items-center gap-1.5 transition-colors"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{usePhoneFrame ? 'Full Screen View' : 'Phone Frame View'}</span>
          </button>

          {/* Quick jump to Admin or Driver apps */}
          <div className="flex items-center gap-1 border-l border-[#E8E0D7] dark:border-[#3D2668] pl-2">
            <button
              onClick={() => setViewMode('admin')}
              className="text-xs px-2.5 py-1.5 bg-[#3B0764] hover:bg-[#2E1065] text-white rounded-xl font-bold flex items-center gap-1 shadow-xs"
              title="Switch to Admin Website"
            >
              <Shield className="w-3 h-3 text-[#C4B5FD]" />
              <span className="hidden md:inline">Admin Website</span>
            </button>
            <button
              onClick={() => setViewMode('driver')}
              className="text-xs px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold flex items-center gap-1 shadow-xs"
              title="Switch to Driver Console"
            >
              <Gauge className="w-3 h-3 text-white" />
              <span className="hidden md:inline">Driver Console</span>
            </button>
            <button
              onClick={() => setViewMode('portal')}
              className="text-xs p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl"
              title="Transit Suite Directory"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Container: either smartphone mock bezel or full responsive */}
      <div className="flex justify-center">
        <div
          className={`${
            usePhoneFrame
              ? 'w-full max-w-[420px] rounded-[44px] border-[12px] border-slate-900 shadow-2xl p-4 bg-slate-50 dark:bg-slate-950 min-h-[780px] relative ring-1 ring-slate-800/10'
              : 'w-full max-w-3xl bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm'
          }`}
        >
          {/* Smartphone Status Bar if framed */}
          {usePhoneFrame && (
            <div className="flex items-center justify-between px-3 pt-1 pb-3 text-[11px] font-bold text-slate-800 dark:text-slate-200 select-none">
              <span>9:41</span>
              {/* Dynamic Island / Speaker Pill */}
              <div className="w-24 h-4 bg-slate-900 rounded-full flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-800" />
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono">
                <span>5G</span>
                <span className="w-4 h-2 border border-current rounded-xs inline-block p-[0.5px]">
                  <span className="block h-full bg-emerald-500 rounded-xs w-[85%]" />
                </span>
              </div>
            </div>
          )}

          {/* Student Header Bar */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <img
                src={currentStudent.avatarUrl}
                alt={currentStudent.name}
                className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                  {currentStudent.name}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">{currentStudent.rollNo}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('alerts')}
                className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Bell className="w-4 h-4" />
                {unreadAlertsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('pass')}
                className="p-1.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg text-[11px] font-semibold flex items-center gap-1"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Pass</span>
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="pb-16">{renderTabContent()}</div>

          {/* Fixed Bottom Tab Bar (Thumb Zone Ergonomics) */}
          <div className="sticky bottom-0 left-0 right-0 mt-6 pt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1.5 grid grid-cols-5 text-center text-[10px] font-medium text-slate-600 dark:text-slate-400">
            <button
              onClick={() => setActiveTab('track')}
              className={`py-1.5 flex flex-col items-center gap-0.5 rounded transition-colors ${
                activeTab === 'track' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <Navigation className="w-4 h-4" />
              <span>Track</span>
            </button>
            <button
              onClick={() => setActiveTab('routes')}
              className={`py-1.5 flex flex-col items-center gap-0.5 rounded transition-colors ${
                activeTab === 'routes' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <BusIcon className="w-4 h-4" />
              <span>Routes</span>
            </button>
            <button
              onClick={() => setActiveTab('pass')}
              className={`py-1.5 flex flex-col items-center gap-0.5 rounded transition-colors ${
                activeTab === 'pass' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Pass</span>
            </button>
            <button
              onClick={() => setActiveTab('trips')}
              className={`py-1.5 flex flex-col items-center gap-0.5 rounded transition-colors ${
                activeTab === 'trips' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule</span>
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`py-1.5 flex flex-col items-center gap-0.5 rounded transition-colors relative ${
                activeTab === 'alerts' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Alerts</span>
              {unreadAlertsCount > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 absolute top-1 right-3" />
              )}
            </button>
          </div>

          {/* Smartphone home indicator bar */}
          {usePhoneFrame && (
            <div className="w-28 h-1 bg-slate-400 dark:bg-slate-600 rounded-full mx-auto mt-4 mb-1" />
          )}
        </div>
      </div>

      {/* Report Lost Item Modal */}
      {showLostItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Report Item Left on Bus
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Your inquiry will be directly routed to Driver {myDriver.name} and Transport Dispatch.
            </p>

            <form onSubmit={handleReportLostItem} className="mt-4 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Item Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={lostItemText}
                  onChange={(e) => setLostItemText(e.target.value)}
                  placeholder="e.g. Blue umbrella left on 3rd row right side, or water bottle"
                  className="w-full mt-1 p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                />
              </div>

              {lostItemSuccess && (
                <div className="p-2 bg-emerald-50 text-emerald-800 text-xs rounded-lg flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Report submitted successfully! Dispatch notified.</span>
                </div>
              )}

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowLostItemModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
