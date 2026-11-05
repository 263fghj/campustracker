import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { LiveTransitMap } from '../map/LiveTransitMap';
import {
  Gauge,
  Play,
  Square,
  MapPin,
  Clock,
  Users,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Fuel,
  BatteryCharging,
  Thermometer,
  QrCode,
  Check,
  Plus,
  Minus,
  Radio,
  Shield,
  Smartphone,
  Grid,
} from 'lucide-react';

export const DriverApp: React.FC = () => {
  const {
    buses,
    routes,
    drivers,
    activeDriverId,
    setActiveDriverId,
    startTrip,
    endTrip,
    advanceToNextStop,
    boardPassenger,
    alightPassenger,
    triggerSos,
    resolveSos,
    reportDelay,
    selectedBusId,
    setSelectedBusId,
    setViewMode,
  } = useTransit();

  const [showSosModal, setShowSosModal] = useState<boolean>(false);
  const [sosReason, setSosReason] = useState<string>('Medical Emergency / Passenger Unwell');
  const [showDelayModal, setShowDelayModal] = useState<boolean>(false);
  const [delayMinutes, setDelayMinutes] = useState<number>(5);
  const [delayReason, setDelayReason] = useState<string>('Heavy Highway Traffic');
  const [scanModalOpen, setScanModalOpen] = useState<boolean>(false);
  const [scannedStudentSuccess, setScannedStudentSuccess] = useState<string | null>(null);

  // Find active driver and their bus
  const currentDriver = drivers.find((d) => d.id === activeDriverId) || drivers[0];
  const currentBus = buses.find((b) => b.id === currentDriver.assignedBusId) || buses[0];
  const currentRoute = routes.find((r) => r.id === currentBus.routeId) || routes[0];
  const currentStop = currentRoute.stops[currentBus.currentStopIndex] || currentRoute.stops[0];
  const nextStop =
    currentRoute.stops[(currentBus.currentStopIndex + 1) % currentRoute.stops.length] ||
    currentRoute.stops[0];

  const isTripActive = currentBus.isTripActive;
  const isSos = currentBus.status === 'sos';

  const handleSimulateQrScan = () => {
    setScannedStudentSuccess('Ananya Sharma · 23AU-CSE-048 (Pass Verified)');
    boardPassenger(currentBus.id, 1);
    setTimeout(() => {
      setScannedStudentSuccess(null);
      setScanModalOpen(false);
    }, 1800);
  };

  const handleTriggerSos = () => {
    triggerSos(currentBus.id, sosReason);
    setShowSosModal(false);
  };

  const handleReportDelay = () => {
    reportDelay(currentBus.id, delayMinutes, delayReason);
    setShowDelayModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      {/* Standalone Driver Console HUD Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white dark:bg-[#1E1235] rounded-2xl border border-[#DDD6FE] dark:border-[#4C288A] shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-[#2E1065] dark:text-[#FAF7F2]">
                Driver In-Cab Terminal HUD
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                COCKPIT MOUNT
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              Heavy-Duty Bus Dashboard Console · Turn-by-Turn Telemetry & Passenger Counter
            </div>
          </div>
        </div>

        {/* Quick jump to Admin or Student apps */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewMode('admin')}
            className="text-xs px-3 py-1.5 bg-[#3B0764] hover:bg-[#2E1065] text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            title="Switch to Admin Website"
          >
            <Shield className="w-3.5 h-3.5 text-[#C4B5FD]" />
            <span>Admin Website</span>
          </button>
          <button
            onClick={() => setViewMode('student')}
            className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            title="Switch to Student Mobile App"
          >
            <Smartphone className="w-3.5 h-3.5 text-white" />
            <span>Student App</span>
          </button>
          <button
            onClick={() => setViewMode('portal')}
            className="text-xs p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl transition-colors"
            title="Transit Suite Directory"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Driver Cabin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-800">
        <div className="flex items-center gap-3.5">
          <img
            src={currentDriver.avatarUrl}
            alt={currentDriver.name}
            className="w-14 h-14 rounded-xl object-cover border-2 border-amber-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg">{currentDriver.name}</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
                {currentDriver.licenseNumber}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <span>{currentBus.busNumber} ({currentBus.plateNumber})</span>
              <span>·</span>
              <span className="text-emerald-400 font-semibold">{currentRoute.code} {currentRoute.name}</span>
            </div>
          </div>
        </div>

        {/* Shift & Driver Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={activeDriverId}
            onChange={(e) => {
              setActiveDriverId(e.target.value);
              const drv = drivers.find((d) => d.id === e.target.value);
              if (drv) setSelectedBusId(drv.assignedBusId);
            }}
            className="text-xs bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none"
          >
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                Switch: {d.name} ({d.assignedBusId})
              </option>
            ))}
          </select>

          {/* Trip Start/End Primary Button */}
          {isTripActive ? (
            <button
              onClick={() => endTrip(currentBus.id)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>END TRIP</span>
            </button>
          ) : (
            <button
              onClick={() => startTrip(currentBus.id)}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>START TRIP</span>
            </button>
          )}
        </div>
      </div>

      {/* Emergency SOS Banner if triggered */}
      {isSos && (
        <div className="p-4 bg-rose-600 text-white rounded-xl shadow-lg flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 shrink-0" />
            <div>
              <div className="font-extrabold text-sm uppercase">EMERGENCY SOS BROADCAST ACTIVE</div>
              <div className="text-xs text-rose-100">
                Reason: {currentBus.sosReason || 'Assistance requested'}. Campus Safety & Admin tracking this vehicle.
              </div>
            </div>
          </div>
          <button
            onClick={() => resolveSos(currentBus.id)}
            className="px-3 py-1.5 bg-white text-rose-700 font-bold text-xs rounded-lg hover:bg-rose-50 transition-colors shadow"
          >
            RESOLVE / STAND DOWN
          </button>
        </div>
      )}

      {/* Main HUD: Speedometer, Next Stop, Occupancy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Speedometer Instrument */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Telemetry Speed</span>
            <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
              Limit: 40 km/h
            </span>
          </div>

          <div className="my-4 text-center">
            <div className="text-5xl font-extrabold font-mono text-slate-900 dark:text-slate-100 tracking-tight">
              {currentBus.telemetry.speedKmH}
            </div>
            <div className="text-xs font-semibold text-slate-400 mt-1 uppercase">Kilometers Per Hour</div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
            <div>
              <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <Fuel className="w-3 h-3 text-amber-500" />
                <span>Fuel</span>
              </div>
              <div className="font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
                {currentBus.telemetry.fuelPercent}%
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <BatteryCharging className="w-3 h-3 text-emerald-500" />
                <span>Battery</span>
              </div>
              <div className="font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
                {currentBus.telemetry.batteryPercent}%
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <Thermometer className="w-3 h-3 text-blue-500" />
                <span>Cabin</span>
              </div>
              <div className="font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
                {currentBus.telemetry.temperatureC}°C
              </div>
            </div>
          </div>
        </div>

        {/* Next Stop & Nav Control */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold uppercase tracking-wider">Next Waypoint / Stop</span>
              <span className="text-emerald-600 font-semibold font-mono">
                ETA ~{currentBus.etaToNextStopMin} min
              </span>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-xl border border-blue-200 dark:border-blue-900">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {nextStop.name}
                </span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 pl-6">
                {nextStop.landmark} · Scheduled {nextStop.scheduledTime}
              </div>
              <div className="text-[11px] text-blue-700 dark:text-blue-300 font-medium mt-2 pl-6">
                Waiting passengers: <span className="font-bold">{nextStop.studentsWaiting} students</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => advanceToNextStop(currentBus.id)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>MARK ARRIVED AT STOP</span>
            </button>
          </div>
        </div>

        {/* Passenger Occupancy & Boarding Scanner */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold uppercase tracking-wider">Passenger Load</span>
              <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">
                {currentBus.passengersOnboard} / {currentBus.capacity}
              </span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden mt-1">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  currentBus.passengersOnboard > 45
                    ? 'bg-rose-500'
                    : currentBus.passengersOnboard > 35
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{
                  width: `${Math.min(100, (currentBus.passengersOnboard / currentBus.capacity) * 100)}%`,
                }}
              />
            </div>
            <div className="text-[11px] text-slate-500 mt-1.5 flex justify-between">
              <span>{currentBus.capacity - currentBus.passengersOnboard} seats available</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {currentBus.passengersOnboard > 45 ? 'Full' : 'Accepting Passengers'}
              </span>
            </div>
          </div>

          {/* Quick Counter Controls */}
          <div className="mt-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => boardPassenger(currentBus.id, 1)}
                className="py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-600" />
                <span>+1 Board</span>
              </button>
              <button
                onClick={() => alightPassenger(currentBus.id, 1)}
                className="py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-colors"
              >
                <Minus className="w-3.5 h-3.5 text-amber-600" />
                <span>-1 Alight</span>
              </button>
            </div>

            <button
              onClick={() => setScanModalOpen(true)}
              className="w-full py-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-indigo-200 dark:border-indigo-800 transition-colors"
            >
              <QrCode className="w-4 h-4" />
              <span>Scan Student Pass QR</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Map & Route Stop Progression */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Live GPS Map View */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Driver Navigation HUD Map
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Odometer: {currentBus.telemetry.odometerKm.toFixed(1)} km
            </span>
          </div>
          <LiveTransitMap
            height="h-[360px]"
            focusedBusId={currentBus.id}
            focusedRouteId={currentRoute.id}
            compact={true}
          />
        </div>

        {/* Route Stops Checklist */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">
              Route {currentRoute.code} Stop Manifest
            </h3>
            <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
              {currentRoute.stops.map((stop, idx) => {
                const isCurrent = currentBus.currentStopIndex === idx;
                const isPassed = currentBus.currentStopIndex > idx;

                return (
                  <div
                    key={stop.id}
                    className={`p-2 rounded-xl border text-xs flex items-center justify-between transition-colors ${
                      isCurrent
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-100 font-semibold'
                        : isPassed
                        ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-400 line-through'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] w-4 text-center">
                        {stop.order}.
                      </span>
                      <span className="truncate max-w-[140px]">{stop.name}</span>
                    </div>
                    <span className="font-mono text-[10px] shrink-0 text-slate-500">
                      {stop.scheduledTime}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Driver Action Footer */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 mt-3">
            <button
              onClick={() => setShowDelayModal(true)}
              className="py-2 px-3 border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-800 dark:text-amber-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report Delay</span>
            </button>

            <button
              onClick={() => setShowSosModal(true)}
              className="py-2 px-3 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-md transition-all"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>SOS EMERGENCY</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delay Reporting Modal */}
      {showDelayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Broadcast Route Delay</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              This will notify students waiting on {currentRoute.name} and update Admin dispatch.
            </p>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Estimated Delay (Minutes)
                </label>
                <div className="flex gap-2 mt-1">
                  {[3, 5, 10, 15].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setDelayMinutes(mins)}
                      className={`flex-1 py-1.5 rounded-lg border font-mono font-semibold transition-colors ${
                        delayMinutes === mins
                          ? 'bg-amber-500 border-amber-600 text-white'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      +{mins}m
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Reason for Delay
                </label>
                <select
                  value={delayReason}
                  onChange={(e) => setDelayReason(e.target.value)}
                  className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200"
                >
                  <option value="Heavy Highway Traffic">Heavy Highway Traffic</option>
                  <option value="Road Maintenance / Detour">Road Maintenance / Detour</option>
                  <option value="Heavy Rain / Inclement Weather">Heavy Rain / Weather</option>
                  <option value="Minor Mechanical Check">Minor Mechanical Check</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={() => setShowDelayModal(false)}
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReportDelay}
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-sm"
                >
                  Broadcast Delay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SOS Emergency Confirmation Modal */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full border-2 border-rose-500 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-center font-bold text-base text-slate-900 dark:text-slate-100">
              Confirm Emergency SOS Trigger
            </h3>
            <p className="text-center text-xs text-slate-500 mt-1">
              This triggers a high-priority emergency alert with your current GPS coordinates to Campus Police, Hospital dispatch, and Transportation Administration.
            </p>

            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Emergency Nature
              </label>
              <select
                value={sosReason}
                onChange={(e) => setSosReason(e.target.value)}
                className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
              >
                <option value="Medical Emergency / Passenger Unwell">Medical Emergency</option>
                <option value="Collision / Traffic Accident">Collision / Traffic Accident</option>
                <option value="Vehicle Breakdown / Engine Fire Risk">Engine / Brake Breakdown</option>
                <option value="Security Incident / Disturbance">Security Incident / Disturbance</option>
              </select>
            </div>

            <div className="flex gap-2 justify-end pt-4 mt-2">
              <button
                onClick={() => setShowSosModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleTriggerSos}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30"
              >
                CONFIRM SOS BROADCAST
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulated QR Boarding Scanner Modal */}
      {scanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl text-center">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Bus Door Boarding Scanner
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Point camera or tap below to scan incoming student pass
            </p>

            <div className="my-5 w-44 h-44 mx-auto border-2 border-dashed border-indigo-400 rounded-2xl flex flex-col items-center justify-center bg-indigo-50/50 dark:bg-indigo-950/20 relative">
              <QrCode className="w-16 h-16 text-indigo-600 dark:text-indigo-400" />
              <div className="absolute inset-x-4 top-1/2 h-0.5 bg-rose-500 animate-pulse" />
              <span className="text-[10px] text-indigo-700 dark:text-indigo-300 font-mono mt-2">
                Scanner Ready
              </span>
            </div>

            {scannedStudentSuccess ? (
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 font-bold" />
                <span>{scannedStudentSuccess}</span>
              </div>
            ) : (
              <button
                onClick={handleSimulateQrScan}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow transition-colors"
              >
                Simulate Boarding Student Scan
              </button>
            )}

            <div className="mt-3">
              <button
                onClick={() => setScanModalOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Close Scanner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
