import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { LiveTransitMap } from '../map/LiveTransitMap';
import { Bus, Route, Stop, Student, Driver } from '../../types/transit';
import {
  Shield,
  Bus as BusIcon,
  Navigation,
  MapPin,
  Clock,
  Users,
  AlertTriangle,
  Radio,
  Plus,
  Send,
  CheckCircle2,
  AlertOctagon,
  TrendingUp,
  FileText,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Phone,
  QrCode,
  ShieldCheck,
  Check,
  X,
  Gauge,
  Sparkles,
  ArrowRight,
  ChevronRight,
  TrendingDown,
  GraduationCap,
  UserPlus,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    buses,
    routes,
    drivers,
    students,
    alerts,
    selectedBusId,
    setSelectedBusId,
    selectedRouteId,
    setSelectedRouteId,
    broadcastAlert,
    addRoute,
    deleteRoute,
    removeStopFromRoute,
    removeBus,
    removeStudent,
    removeAlert,
    addStopToRoute,
    updateStudentPassStatus,
    assignDriverToBus,
    removeDriverFromBus,
    assignStudentToBus,
    removeStudentFromBus,
    resolveSos,
  } = useTransit();

  const [adminTab, setAdminTab] = useState<'map' | 'routes' | 'fleet' | 'students' | 'alerts' | 'analytics'>('map');
  const [filterBusStatus, setFilterBusStatus] = useState<string>('all');
  const [showBroadcastModal, setShowBroadcastModal] = useState<boolean>(false);
  const [broadcastTitle, setBroadcastTitle] = useState<string>('');
  const [broadcastMessage, setBroadcastMessage] = useState<string>('');
  const [broadcastSeverity, setBroadcastSeverity] = useState<'info' | 'warning' | 'critical'>('info');
  const [broadcastTargetRoute, setBroadcastTargetRoute] = useState<string>('all');

  // Add Route Modal state
  const [showAddRouteModal, setShowAddRouteModal] = useState<boolean>(false);
  const [newRouteCode, setNewRouteCode] = useState<string>('R-15');
  const [newRouteName, setNewRouteName] = useState<string>('West Sports Complex & Stadium Shuttle');
  const [newRouteColor, setNewRouteColor] = useState<string>('#9333EA');

  // Add Stop Modal state
  const [showAddStopModal, setShowAddStopModal] = useState<boolean>(false);
  const [selectedRouteForStop, setSelectedRouteForStop] = useState<string>(routes[0].id);
  const [newStopName, setNewStopName] = useState<string>('');
  const [newStopLandmark, setNewStopLandmark] = useState<string>('');
  const [newStopLat, setNewStopLat] = useState<number>(17.0520);
  const [newStopLng, setNewStopLng] = useState<number>(82.0720);
  const [newStopTime, setNewStopTime] = useState<string>('08:00 AM');

  // Student Pass Search
  const [studentSearch, setStudentSearch] = useState<string>('');
  const [passFilter, setPassFilter] = useState<string>('all');

  // Bus assignment modal state
  const [showAssignDriverModal, setShowAssignDriverModal] = useState<boolean>(false);
  const [driverModalBusId, setDriverModalBusId] = useState<string>(buses[0]?.id || 'bus-104');
  const [driverModalDriverId, setDriverModalDriverId] = useState<string>(drivers[0]?.id || 'drv-01');

  const [showAddStudentToBusModal, setShowAddStudentToBusModal] = useState<boolean>(false);
  const [studentModalBusId, setStudentModalBusId] = useState<string>(buses[0]?.id || 'bus-104');
  const [studentModalStudentId, setStudentModalStudentId] = useState<string>(students[0]?.id || 'stu-01');

  const selectedBus = buses.find((b) => b.id === selectedBusId) || buses[0];
  const selectedBusRoute = routes.find((r) => r.id === selectedBus.routeId) || routes[0];
  const selectedBusDriver = drivers.find((d) => d.id === selectedBus.driverId);
  const studentsAssignedToSelectedBus = students.filter((s) => s.assignedBusId === selectedBus.id);

  const totalPassengers = buses.reduce((acc, b) => acc + b.passengersOnboard, 0);
  const totalCapacity = buses.reduce((acc, b) => acc + b.capacity, 0);
  const sosCount = buses.filter((b) => b.status === 'sos').length;
  const delayedBuses = buses.filter((b) => b.delayMinutes > 3);

  const filteredBuses = buses.filter((b) => {
    if (filterBusStatus === 'all') return true;
    if (filterBusStatus === 'delayed') return b.delayMinutes > 3 || b.status === 'delayed';
    return b.status === filterBusStatus;
  });

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.department.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesPass = passFilter === 'all' || s.passStatus === passFilter;
    return matchesSearch && matchesPass;
  });

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;
    broadcastAlert(
      broadcastTitle,
      broadcastMessage,
      broadcastSeverity,
      broadcastTargetRoute === 'all' ? undefined : broadcastTargetRoute
    );
    setShowBroadcastModal(false);
    setBroadcastTitle('');
    setBroadcastMessage('');
  };

  const handleAddRouteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRoute: Route = {
      id: `route-${Date.now()}`,
      code: newRouteCode,
      name: newRouteName,
      color: newRouteColor,
      activeBusId: 'bus-104',
      totalDistanceKm: 12.0,
      avgDurationMinutes: 32,
      frequencyMinutes: 20,
      operatingHours: '07:00 AM - 08:00 PM',
      stops: [
        {
          id: `stop-${Date.now()}-1`,
          name: 'Main Quad Terminal',
          landmark: 'Clock Tower Gate',
          coords: { lat: 17.0540, lng: 82.0715 },
          scheduledTime: '07:30 AM',
          order: 1,
          geofenceRadiusMeters: 70,
          studentsWaiting: 15,
        },
        {
          id: `stop-${Date.now()}-2`,
          name: 'West Complex Arena',
          landmark: 'Olympic Pool Annex',
          coords: { lat: 17.0490, lng: 82.0570 },
          scheduledTime: '07:48 AM',
          order: 2,
          geofenceRadiusMeters: 60,
          studentsWaiting: 8,
        },
      ],
      polylineCoords: [
        { lat: 17.0540, lng: 82.0715 },
        { lat: 17.0515, lng: 82.0640 },
        { lat: 17.0490, lng: 82.0570 },
      ],
    };
    addRoute(newRoute);
    setShowAddRouteModal(false);
  };

  const handleAddStopSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStopName) return;
    addStopToRoute(selectedRouteForStop, {
      name: newStopName,
      landmark: newStopLandmark || 'Near Campus Checkpoint',
      coords: { lat: Number(newStopLat), lng: Number(newStopLng) },
      scheduledTime: newStopTime,
      geofenceRadiusMeters: 65,
      studentsWaiting: 5,
    });
    setShowAddStopModal(false);
    setNewStopName('');
    setNewStopLandmark('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Fleet KPI Strip (Warm Cream & Deep Purple Themed) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="bg-white dark:bg-[#1E1235] rounded-2xl p-4 border border-[#E8E0D7] dark:border-[#3D2668] shadow-xs">
          <div className="text-[11px] font-bold text-[#7E22CE] dark:text-[#C084FC] uppercase tracking-wider">
            Active Fleet Units
          </div>
          <div className="text-2xl font-black font-mono text-[#2E1065] dark:text-[#FAF7F2] mt-1">
            {buses.filter((b) => b.isTripActive).length}{' '}
            <span className="text-xs font-normal text-slate-400">/ {buses.length} Transmitting</span>
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            <Radio className="w-3 h-3 text-emerald-600" />
            <span>Telemetry 100% Online</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1235] rounded-2xl p-4 border border-[#E8E0D7] dark:border-[#3D2668] shadow-xs">
          <div className="text-[11px] font-bold text-[#7E22CE] dark:text-[#C084FC] uppercase tracking-wider">
            Student Commuters
          </div>
          <div className="text-2xl font-black font-mono text-[#2E1065] dark:text-[#FAF7F2] mt-1">
            {totalPassengers}{' '}
            <span className="text-xs font-normal text-slate-400">/ {totalCapacity} Capacity</span>
          </div>
          <div className="text-[11px] text-[#581C87] dark:text-[#DDD6FE] mt-1 font-medium">
            {Math.round((totalPassengers / totalCapacity) * 100)}% Bus Seat Utilization
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1235] rounded-2xl p-4 border border-[#E8E0D7] dark:border-[#3D2668] shadow-xs">
          <div className="text-[11px] font-bold text-[#7E22CE] dark:text-[#C084FC] uppercase tracking-wider">
            Schedule Compliance
          </div>
          <div className="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-400 mt-1">
            96.4%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Avg Variance: <span className="font-mono font-bold text-[#2E1065] dark:text-[#FAF7F2]">1.2 min</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1235] rounded-2xl p-4 border border-[#E8E0D7] dark:border-[#3D2668] shadow-xs">
          <div className="text-[11px] font-bold text-[#7E22CE] dark:text-[#C084FC] uppercase tracking-wider">
            Active Corridors
          </div>
          <div className="text-2xl font-black font-mono text-[#2E1065] dark:text-[#FAF7F2] mt-1">
            {routes.length} <span className="text-xs font-normal text-slate-400">Routes</span>
          </div>
          <div className="text-[11px] text-[#581C87] dark:text-[#DDD6FE] mt-1">
            {routes.reduce((acc, r) => acc + r.stops.length, 0)} Geofenced Stops
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1235] rounded-2xl p-4 border border-[#E8E0D7] dark:border-[#3D2668] shadow-xs col-span-2 md:col-span-1">
          <div className="text-[11px] font-bold text-[#7E22CE] dark:text-[#C084FC] uppercase tracking-wider">
            Schedule Deviations
          </div>
          <div className="text-2xl font-black font-mono text-[#2E1065] dark:text-[#FAF7F2] mt-1 flex items-center gap-2">
            <span>{delayedBuses.length}</span>
            {delayedBuses.length > 0 && (
              <span className="text-xs bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 px-2 py-0.5 rounded-md font-sans">
                + Delay Alert
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {delayedBuses.length === 0 ? 'All buses strictly on time' : `${delayedBuses.length} bus with +4m deviation`}
          </div>
        </div>
      </div>

      {/* Admin Navigation Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E8E0D7] dark:border-[#3D2668]">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'map', label: 'Real-Time Map & Deviations', icon: Navigation },
            { id: 'routes', label: 'Routes & Waypoints', icon: MapPin },
            { id: 'fleet', label: 'Fleet & Drivers', icon: BusIcon },
            { id: 'students', label: 'Pass Directory', icon: Users },
            { id: 'alerts', label: 'Emergency & Broadcast', icon: AlertTriangle },
            { id: 'analytics', label: 'Punctuality Analytics', icon: TrendingUp },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = adminTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setAdminTab(item.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#3B0764] text-white shadow-sm'
                    : 'text-[#4C1D95] dark:text-[#C4B5FD] hover:bg-[#F5EFEB] dark:hover:bg-[#281747]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setDriverModalBusId(selectedBus.id);
              setShowAssignDriverModal(true);
            }}
            className="px-3.5 py-2 bg-[#3B0764] hover:bg-[#2E1065] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#C4B5FD]" />
            <span>Assign Driver / Students</span>
          </button>
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="px-3.5 py-2 bg-[#581C87] hover:bg-[#3B0764] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Broadcast Notice</span>
          </button>
          <button
            onClick={() => setShowAddRouteModal(true)}
            className="px-3.5 py-2 border border-[#DDD6FE] dark:border-[#4C288A] bg-white dark:bg-[#281747] hover:bg-[#F5EFEB] text-[#3B0764] dark:text-[#EDE9FE] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Route</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Real-Time Map Interface & Schedule Deviations */}
      {adminTab === 'map' && (
        <div className="space-y-4">
          {/* Real-time Map & Schedule Deviations Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Real-Time Map (8 Cols) */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-[#2E1065] dark:text-[#FAF7F2] flex items-center gap-2">
                    <span>Live Transport Fleet Positioning</span>
                    <span className="text-xs font-mono font-medium text-[#7E22CE] dark:text-[#C4B5FD] bg-[#EDE9FE] dark:bg-[#281747] px-2 py-0.5 rounded-full">
                      Real-Time GPS Map
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Continuous telemetry tracking with route lines, stop ETAs, and schedule variance.
                  </p>
                </div>

                {/* Filter Selector */}
                <div className="flex items-center gap-1 bg-[#F5EFEB] dark:bg-[#281747] p-1 rounded-xl text-xs border border-[#E8E0D7] dark:border-[#3D2668]">
                  {['all', 'delayed', 'in-transit', 'at-stop'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterBusStatus(status)}
                      className={`px-2.5 py-1 rounded-lg capitalize font-semibold transition-all ${
                        filterBusStatus === status
                          ? 'bg-[#3B0764] text-white shadow-xs'
                          : 'text-[#4C1D95] dark:text-[#C4B5FD] hover:text-[#2E1065]'
                      }`}
                    >
                      {status === 'delayed' ? 'Deviations Only' : status.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* The Live Map Component */}
              <LiveTransitMap
                height="h-[540px]"
                focusedBusId={selectedBus.id}
                focusedRouteId={selectedBus.routeId}
                onSelectBus={(id) => setSelectedBusId(id)}
              />

              {/* Quick Bus Selector Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {filteredBuses.map((bus) => {
                  const isSelected = bus.id === selectedBus.id;
                  const isDeviated = bus.delayMinutes > 3;
                  const route = routes.find((r) => r.id === bus.routeId);

                  return (
                    <div
                      key={bus.id}
                      onClick={() => {
                        setSelectedBusId(bus.id);
                        setSelectedRouteId(bus.routeId);
                      }}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#7E22CE] bg-[#EDE9FE]/50 dark:bg-[#281747] shadow-sm'
                          : 'border-[#E8E0D7] dark:border-[#3D2668] bg-white dark:bg-[#1E1235] hover:border-[#DDD6FE]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-black text-[#2E1065] dark:text-[#FAF7F2]">
                          {bus.busNumber}
                        </div>
                        <span
                          className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            isDeviated
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {isDeviated ? `+${bus.delayMinutes}m Deviation` : 'On Time'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                        <span className="font-medium text-[#581C87] dark:text-[#C4B5FD]">{route?.code}</span>
                        <span className="font-mono">{bus.telemetry.speedKmH} km/h</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 flex justify-between border-t border-[#F5EFEB] dark:border-[#3D2668] pt-1">
                        <span>ETA Next: <span className="font-bold text-emerald-600">{bus.etaToNextStopMin}m</span></span>
                        <span>{bus.passengersOnboard}/{bus.capacity} seats</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Telemetry & Schedule Deviation Details Drawer (4 Cols) */}
            <div className="lg:col-span-4 space-y-4 bg-white dark:bg-[#1E1235] rounded-2xl p-5 border border-[#E8E0D7] dark:border-[#3D2668] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between pb-3 border-b border-[#E8E0D7] dark:border-[#3D2668]">
                  <div>
                    <div className="text-[11px] font-bold text-[#7E22CE] dark:text-[#C084FC]">
                      {selectedBusRoute.code} · {selectedBusRoute.name}
                    </div>
                    <h3 className="text-lg font-black text-[#2E1065] dark:text-[#FAF7F2] mt-0.5">
                      {selectedBus.busNumber}
                    </h3>
                    <div className="text-xs font-mono text-slate-400">{selectedBus.plateNumber}</div>
                  </div>

                  {/* Deviation Status Tag */}
                  <div className="text-right">
                    <span
                      className={`inline-block text-xs font-bold uppercase px-2.5 py-1 rounded-lg ${
                        selectedBus.delayMinutes > 3
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}
                    >
                      {selectedBus.delayMinutes > 3 ? `+${selectedBus.delayMinutes}m Delay` : 'On Schedule'}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                      Speed: {selectedBus.telemetry.speedKmH} km/h
                    </div>
                  </div>
                </div>

                {/* Schedule Deviation Detailed Breakdown */}
                <div className="mt-4 p-3.5 bg-[#FAF7F2] dark:bg-[#281747] rounded-xl border border-[#E8E0D7] dark:border-[#3D2668] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#2E1065] dark:text-[#FAF7F2] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#7E22CE]" />
                      <span>Schedule Variance</span>
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        selectedBus.delayMinutes > 3 ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'
                      }`}
                    >
                      {selectedBus.delayMinutes > 3 ? `+${selectedBus.delayMinutes} minutes delayed` : 'Nominal variance (±0m)'}
                    </span>
                  </div>

                  <div className="w-full bg-[#E8E0D7] dark:bg-[#3D2668] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        selectedBus.delayMinutes > 3 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{
                        width: `${Math.min(100, Math.max(10, 100 - selectedBus.delayMinutes * 10))}%`,
                      }}
                    />
                  </div>

                  <div className="text-[11px] text-slate-500 flex justify-between pt-0.5">
                    <span>Planned Transit: 38 min</span>
                    <span>Projected: {38 + selectedBus.delayMinutes} min</span>
                  </div>
                </div>

                {/* Driver Assignment for this Bus Number */}
                <div className="mt-4 p-3.5 bg-[#FAF7F2] dark:bg-[#281747] rounded-xl border border-[#E8E0D7] dark:border-[#3D2668] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#2E1065] dark:text-[#FAF7F2] flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#7E22CE]" />
                      <span>Assigned Driver ({selectedBus.busNumber})</span>
                    </span>
                    {selectedBusDriver && (
                      <button
                        onClick={() => removeDriverFromBus(selectedBus.id)}
                        className="text-[10px] text-rose-600 hover:underline font-semibold"
                        title="Unassign driver from this bus"
                      >
                        Remove Driver
                      </button>
                    )}
                  </div>

                  {selectedBusDriver ? (
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={selectedBusDriver.avatarUrl}
                          alt={selectedBusDriver.name}
                          className="w-9 h-9 rounded-full object-cover border border-[#DDD6FE]"
                        />
                        <div>
                          <div className="font-bold text-xs text-[#2E1065] dark:text-[#FAF7F2]">
                            {selectedBusDriver.name}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {selectedBusDriver.phone} · ★ {selectedBusDriver.rating}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setDriverModalBusId(selectedBus.id);
                            setDriverModalDriverId(selectedBusDriver.id);
                            setShowAssignDriverModal(true);
                          }}
                          className="px-2.5 py-1 text-[11px] bg-white dark:bg-[#1E1235] border border-[#DDD6FE] dark:border-[#4C288A] text-[#581C87] dark:text-[#C4B5FD] font-bold rounded-lg hover:bg-[#EDE9FE] transition-colors"
                        >
                          Change Driver
                        </button>
                        <button
                          onClick={() => removeDriverFromBus(selectedBus.id)}
                          className="px-2 py-1 text-[11px] bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
                          title="Unassign driver from this bus number"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-amber-700 italic">No driver currently assigned</span>
                      <button
                        onClick={() => {
                          setDriverModalBusId(selectedBus.id);
                          setShowAssignDriverModal(true);
                        }}
                        className="px-2.5 py-1 text-[11px] bg-[#581C87] text-white font-bold rounded-lg hover:bg-[#3B0764]"
                      >
                        + Assign Driver
                      </button>
                    </div>
                  )}
                </div>

                {/* Students Assigned to this Bus Number */}
                <div className="mt-3 p-3.5 bg-[#FAF7F2] dark:bg-[#281747] rounded-xl border border-[#E8E0D7] dark:border-[#3D2668] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="font-bold text-[#2E1065] dark:text-[#FAF7F2] flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#7E22CE]" />
                      <span>Students on {selectedBus.busNumber}</span>
                      <span className="text-[10px] bg-[#EDE9FE] dark:bg-[#3D2668] text-[#581C87] dark:text-[#C4B5FD] px-1.5 py-0.2 rounded-full font-mono font-bold">
                        {studentsAssignedToSelectedBus.length}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setStudentModalBusId(selectedBus.id);
                        setShowAddStudentToBusModal(true);
                      }}
                      className="text-[11px] font-bold text-[#581C87] dark:text-[#C4B5FD] hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Student</span>
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                    {studentsAssignedToSelectedBus.length === 0 ? (
                      <div className="text-[11px] text-slate-400 italic py-1">
                        No students assigned to this bus number yet.
                      </div>
                    ) : (
                      studentsAssignedToSelectedBus.map((st) => (
                        <div
                          key={st.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#1E1235] border border-[#E8E0D7] dark:border-[#3D2668] text-xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <img
                              src={st.avatarUrl}
                              alt={st.name}
                              className="w-6 h-6 rounded-full object-cover shrink-0"
                            />
                            <div className="truncate">
                              <span className="font-semibold text-[#2E1065] dark:text-[#FAF7F2]">
                                {st.name}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono ml-1">
                                ({st.rollNo})
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeStudentFromBus(st.id)}
                            title="Remove student from this bus number"
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Live Estimated Arrival Times (Stops Breakdown) */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-[#2E1065] dark:text-[#FAF7F2] font-bold mb-2">
                    <span className="uppercase tracking-wider text-[11px] text-[#7E22CE]">
                      Route Stop Schedule & ETAs
                    </span>
                    <span className="text-[11px] font-mono text-emerald-600 font-bold">
                      ~{selectedBus.etaToNextStopMin} min next
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                    {selectedBusRoute.stops.map((stop, idx) => {
                      const isCurrent = selectedBus.currentStopIndex === idx;
                      const isPassed = selectedBus.currentStopIndex > idx;

                      return (
                        <div
                          key={stop.id}
                          className={`p-2 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                            isCurrent
                              ? 'bg-[#EDE9FE] dark:bg-[#371E63] border-[#C4B5FD] font-bold text-[#2E1065] dark:text-[#FAF7F2]'
                              : isPassed
                              ? 'bg-[#FAF7F2] dark:bg-[#1E1235] border-transparent text-slate-400 line-through'
                              : 'bg-white dark:bg-[#281747] border-[#E8E0D7] dark:border-[#3D2668] text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-[#7E22CE]">{stop.order}.</span>
                            <span className="truncate max-w-[130px]">{stop.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-mono text-[11px]">
                              {isCurrent ? `ETA ${selectedBus.etaToNextStopMin}m` : stop.scheduledTime}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#E8E0D7] dark:border-[#3D2668] space-y-2">
                <button
                  onClick={() => {
                    setBroadcastTitle(`Delay Update: ${selectedBus.busNumber}`);
                    setBroadcastMessage(
                      `${selectedBus.busNumber} on ${selectedBusRoute.name} is currently running with a ${selectedBus.delayMinutes} minute delay.`
                    );
                    setBroadcastTargetRoute(selectedBusRoute.id);
                    setShowBroadcastModal(true);
                  }}
                  className="w-full py-2 bg-[#581C87] hover:bg-[#3B0764] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Notify Commuters of Delay</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Routes & Stops Management */}
      {adminTab === 'routes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-[#2E1065] dark:text-[#FAF7F2]">
                Transit Routes & Geofencing Corridors
              </h2>
              <p className="text-xs text-slate-500">
                Configure bus lines, add scheduled stops with geo-coordinates, and adjust geofence trigger radius.
              </p>
            </div>
            <button
              onClick={() => setShowAddStopModal(true)}
              className="px-3.5 py-2 bg-[#581C87] text-white text-xs font-bold rounded-xl hover:bg-[#3B0764] flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Stop to Route</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routes.map((route) => {
              const assignedBus = buses.find((b) => b.routeId === route.id);
              return (
                <div
                  key={route.id}
                  className="bg-white dark:bg-[#1E1235] rounded-2xl p-5 border border-[#E8E0D7] dark:border-[#3D2668] shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-xs shadow-xs"
                        style={{ backgroundColor: route.color }}
                      >
                        {route.code}
                      </span>
                      <div>
                        <h3 className="font-extrabold text-sm text-[#2E1065] dark:text-[#FAF7F2]">
                          {route.name}
                        </h3>
                        <div className="text-xs text-slate-500">
                          {route.totalDistanceKm} km · {route.stops.length} stops · Frequency: Every {route.frequencyMinutes} min
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-bold text-[#581C87] dark:text-[#C4B5FD] bg-[#EDE9FE] dark:bg-[#281747] px-2.5 py-1 rounded-lg">
                        {assignedBus?.busNumber || 'Unassigned'}
                      </span>
                      <button
                        onClick={() => {
                          if (confirm(`Remove route "${route.name}"?`)) {
                            deleteRoute(route.id);
                          }
                        }}
                        title="Remove Route"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Stop sequence */}
                  <div className="space-y-2 pt-2 border-t border-[#E8E0D7] dark:border-[#3D2668]">
                    <div className="text-[11px] font-bold text-[#7E22CE] uppercase tracking-wider">
                      Stops & Scheduled ETAs
                    </div>
                    {route.stops.map((stop) => (
                      <div
                        key={stop.id}
                        className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#281747] border border-[#E8E0D7] dark:border-[#3D2668] group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] w-4 text-[#7E22CE] font-bold">{stop.order}.</span>
                          <div>
                            <div className="font-bold text-[#2E1065] dark:text-[#FAF7F2]">{stop.name}</div>
                            <div className="text-[10px] text-slate-500">{stop.landmark}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <div className="text-right">
                            <div className="font-mono text-[#2E1065] dark:text-[#FAF7F2] font-bold">
                              {stop.scheduledTime}
                            </div>
                            <div className="text-[10px] text-[#7E22CE] font-mono">
                              ±{stop.geofenceRadiusMeters}m geofence
                            </div>
                          </div>
                          <button
                            onClick={() => removeStopFromRoute(route.id, stop.id)}
                            title="Remove Stop"
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Fleet Vehicles & Driver Roster */}
      {adminTab === 'fleet' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-[#2E1065] dark:text-[#FAF7F2]">
                Fleet Roster & Driver Crew Management
              </h2>
              <p className="text-xs text-slate-500">
                Inspect college transit buses, license credentials, mechanical health, and driver shifts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Drivers list */}
            <div className="bg-white dark:bg-[#1E1235] rounded-2xl p-5 border border-[#E8E0D7] dark:border-[#3D2668] shadow-xs space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#7E22CE]">
                Transit Drivers ({drivers.length})
              </h3>
              <div className="space-y-3">
                {drivers.map((driver) => {
                  const assignedBus = buses.find((b) => b.id === driver.assignedBusId);
                  return (
                    <div
                      key={driver.id}
                      className="p-3.5 rounded-xl border border-[#E8E0D7] dark:border-[#3D2668] bg-[#FAF7F2] dark:bg-[#281747] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={driver.avatarUrl}
                          alt={driver.name}
                          className="w-12 h-12 rounded-xl object-cover border border-[#DDD6FE]"
                        />
                        <div>
                          <div className="font-bold text-sm text-[#2E1065] dark:text-[#FAF7F2]">
                            {driver.name}
                          </div>
                          <div className="text-slate-500 font-mono">{driver.licenseNumber}</div>
                          <div className="text-[#581C87] dark:text-[#DDD6FE] mt-0.5">
                            {driver.experienceYears} yrs experience · ★ {driver.rating}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-[#7E22CE]">{assignedBus?.busNumber}</div>
                        <div className="font-mono text-[11px] text-slate-500">{driver.phone}</div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase mt-1 inline-block">
                          {driver.shiftStatus}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Fleet Buses list */}
            <div className="bg-white dark:bg-[#1E1235] rounded-2xl p-5 border border-[#E8E0D7] dark:border-[#3D2668] shadow-xs space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#7E22CE]">
                Campus Transport Fleet ({buses.length})
              </h3>
              <div className="space-y-3">
                {buses.map((bus) => {
                  const route = routes.find((r) => r.id === bus.routeId);
                  const driver = drivers.find((d) => d.id === bus.driverId);
                  return (
                    <div
                      key={bus.id}
                      className="p-3.5 rounded-xl border border-[#E8E0D7] dark:border-[#3D2668] bg-[#FAF7F2] dark:bg-[#281747] text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BusIcon className="w-4 h-4 text-[#7E22CE]" />
                          <span className="font-bold text-[#2E1065] dark:text-[#FAF7F2]">
                            {bus.busNumber}
                          </span>
                          <span className="font-mono text-[11px] text-slate-500">({bus.plateNumber})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                              bus.delayMinutes > 3
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            }`}
                          >
                            {bus.delayMinutes > 3 ? `+${bus.delayMinutes}m Deviation` : 'On Schedule'}
                          </span>
                          <button
                            onClick={() => {
                              if (confirm(`Remove vehicle ${bus.busNumber} from active fleet?`)) {
                                removeBus(bus.id);
                              }
                            }}
                            title="Remove Vehicle"
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-[#E8E0D7] dark:border-[#3D2668]">
                        <div>
                          <span className="text-slate-400">Route:</span>{' '}
                          <span className="font-bold text-[#581C87] dark:text-[#C4B5FD]">
                            {route?.code} - {route?.name}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">Capacity:</span>{' '}
                          <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                            {bus.capacity} seats
                          </span>
                        </div>
                      </div>

                      {/* Driver Assignment for this Bus */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#1E1235] border border-[#E8E0D7] dark:border-[#3D2668]">
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-[#7E22CE]" />
                          <span className="text-[11px] text-slate-500">Driver:</span>
                          <span className="font-bold text-xs text-[#2E1065] dark:text-[#FAF7F2]">
                            {driver ? (
                              driver.name
                            ) : (
                              <span className="text-amber-600 font-normal italic">Unassigned</span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setDriverModalBusId(bus.id);
                              if (driver) setDriverModalDriverId(driver.id);
                              setShowAssignDriverModal(true);
                            }}
                            className="px-2 py-0.5 text-[10px] bg-[#EDE9FE] dark:bg-[#3D2668] text-[#581C87] dark:text-[#C4B5FD] font-bold rounded hover:bg-[#DDD6FE]"
                          >
                            {driver ? 'Reassign' : '+ Assign Driver'}
                          </button>
                          {driver && (
                            <button
                              onClick={() => removeDriverFromBus(bus.id)}
                              title="Unassign driver from this bus"
                              className="text-[10px] text-rose-500 hover:text-rose-700 font-semibold px-1"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Students on this Bus Number */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#1E1235] border border-[#E8E0D7] dark:border-[#3D2668]">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-3.5 h-3.5 text-[#7E22CE]" />
                          <span className="text-[11px] text-slate-500">Students:</span>
                          <span className="font-bold text-xs text-[#2E1065] dark:text-[#FAF7F2]">
                            {students.filter((s) => s.assignedBusId === bus.id).length} assigned
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setStudentModalBusId(bus.id);
                            setShowAddStudentToBusModal(true);
                          }}
                          className="px-2.5 py-0.5 text-[10px] bg-[#581C87] text-white font-bold rounded hover:bg-[#3B0764]"
                        >
                          + Add Student
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Student Passes Directory */}
      {adminTab === 'students' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-[#2E1065] dark:text-[#FAF7F2]">
                Student Transport Passes & Verification
              </h2>
              <p className="text-xs text-slate-500">
                Inspect registered students, route passes, validity status, and renewal operations.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student or roll no..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-[#1E1235] border border-[#E8E0D7] dark:border-[#3D2668] rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <select
                value={passFilter}
                onChange={(e) => setPassFilter(e.target.value)}
                className="text-xs bg-white dark:bg-[#1E1235] border border-[#E8E0D7] dark:border-[#3D2668] rounded-xl px-2.5 py-1.5 text-slate-700 dark:text-slate-300"
              >
                <option value="all">All Passes</option>
                <option value="active">Active Passes</option>
                <option value="expired">Expired</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1235] rounded-2xl border border-[#E8E0D7] dark:border-[#3D2668] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] dark:bg-[#281747] border-b border-[#E8E0D7] dark:border-[#3D2668] text-[11px] font-bold text-[#7E22CE] uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5">Student</th>
                    <th className="px-4 py-3.5">Roll Number</th>
                    <th className="px-4 py-3.5">Assigned Bus Number</th>
                    <th className="px-4 py-3.5">Assigned Route</th>
                    <th className="px-4 py-3.5">Pickup Stop</th>
                    <th className="px-4 py-3.5">Pass No & Validity</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E0D7] dark:divide-[#3D2668]">
                  {filteredStudents.map((student) => {
                    const route = routes.find((r) => r.id === student.assignedRouteId);
                    const stop = route?.stops.find((s) => s.id === student.pickupStopId);
                    const isActive = student.passStatus === 'active';

                    return (
                      <tr key={student.id} className="hover:bg-[#FAF7F2] dark:hover:bg-[#281747]/60 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={student.avatarUrl}
                              alt={student.name}
                              className="w-8 h-8 rounded-full object-cover border border-[#DDD6FE]"
                            />
                            <div>
                              <div className="font-bold text-[#2E1065] dark:text-[#FAF7F2]">
                                {student.name}
                              </div>
                              <div className="text-[10px] text-slate-400">{student.department}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 font-mono font-semibold text-slate-700 dark:text-slate-300">
                          {student.rollNo}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <select
                              value={student.assignedBusId || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val) {
                                  assignStudentToBus(student.id, val);
                                } else {
                                  removeStudentFromBus(student.id);
                                }
                              }}
                              className="text-xs bg-[#FAF7F2] dark:bg-[#281747] border border-[#DDD6FE] dark:border-[#4C288A] rounded-lg px-2 py-1 font-bold text-[#2E1065] dark:text-[#FAF7F2]"
                            >
                              <option value="">No Bus Assigned</option>
                              {buses.map((b) => (
                                <option key={b.id} value={b.id}>
                                  {b.busNumber}
                                </option>
                              ))}
                            </select>
                            {student.assignedBusId && (
                              <button
                                onClick={() => removeStudentFromBus(student.id)}
                                title="Remove student from bus"
                                className="p-1 text-slate-400 hover:text-rose-600 rounded"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-[#7E22CE]">
                          {route?.code} - {route?.name}
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
                          {stop?.name || 'Main Gate'}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-slate-600 dark:text-slate-400">
                          <div>{student.passNumber}</div>
                          <div className="text-[10px] text-slate-400">Exp: {student.passValidUntil}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              isActive
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : 'bg-rose-100 text-rose-900 border border-rose-300'
                            }`}
                          >
                            {student.passStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                const newStatus = isActive ? 'expired' : 'active';
                                updateStudentPassStatus(student.id, newStatus, '31 Dec 2026');
                              }}
                              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                                isActive
                                  ? 'text-rose-600 hover:bg-rose-50'
                                  : 'bg-[#581C87] text-white hover:bg-[#3B0764]'
                              }`}
                            >
                              {isActive ? 'Revoke Pass' : 'Renew Pass'}
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Remove ${student.name} from pass directory?`)) {
                                  removeStudent(student.id);
                                }
                              }}
                              title="Remove Student"
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Incident Log & Announcements */}
      {adminTab === 'alerts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-[#2E1065] dark:text-[#FAF7F2]">
                Incident Response & Emergency Log
              </h2>
              <p className="text-xs text-slate-500">
                Full chronological history of driver SOS triggers, geofence breaches, traffic delays, and broadcasts.
              </p>
            </div>
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="px-3.5 py-2 bg-[#581C87] text-white text-xs font-bold rounded-xl hover:bg-[#3B0764] flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Announcement</span>
            </button>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-2xl border flex items-start justify-between text-xs transition-colors ${
                  alert.severity === 'critical'
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900'
                    : alert.severity === 'warning'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900'
                    : 'bg-white dark:bg-[#1E1235] border-[#E8E0D7] dark:border-[#3D2668]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {alert.severity === 'critical' ? (
                      <AlertOctagon className="w-5 h-5 text-rose-600" />
                    ) : alert.severity === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    ) : (
                      <Radio className="w-5 h-5 text-[#7E22CE]" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#2E1065] dark:text-[#FAF7F2]">
                      {alert.title}
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 mt-1">{alert.message}</div>
                    {alert.busId && (
                      <div className="text-[11px] text-slate-400 mt-1 font-mono">
                        Target Unit: {alert.busId} · Route: {alert.routeId || 'All Network'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0 flex items-center gap-2">
                  <span className="font-mono text-slate-500 text-[11px]">{alert.timestamp}</span>
                  <button
                    onClick={() => removeAlert(alert.id)}
                    title="Dismiss and remove notice"
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Analytics & Reports */}
      {adminTab === 'analytics' && (
        <div className="space-y-5">
          <div>
            <h2 className="text-base font-extrabold text-[#2E1065] dark:text-[#FAF7F2]">
              Campus Transit Analytics & Ridership Insights
            </h2>
            <p className="text-xs text-slate-500">
              Ridership volume by hour, route punctuality compliance, and vehicle speed telemetry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-[#1E1235] rounded-2xl p-5 border border-[#E8E0D7] dark:border-[#3D2668] shadow-xs">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#7E22CE] mb-4">
                Peak Commuter Volume (Hourly Students Boarded)
              </h3>
              <div className="flex items-end gap-3 h-44 pt-4 border-b border-[#E8E0D7] dark:border-[#3D2668] pb-2">
                {[
                  { time: '07 AM', count: 180, pct: 90 },
                  { time: '08 AM', count: 210, pct: 100 },
                  { time: '09 AM', count: 70, pct: 35 },
                  { time: '12 PM', count: 45, pct: 22 },
                  { time: '01 PM', count: 60, pct: 30 },
                  { time: '04 PM', count: 195, pct: 95 },
                  { time: '05 PM', count: 160, pct: 80 },
                  { time: '07 PM', count: 40, pct: 20 },
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] font-mono text-slate-500">{bar.count}</span>
                    <div
                      className="w-full bg-[#581C87] rounded-t-md hover:bg-[#3B0764] transition-all"
                      style={{ height: `${bar.pct}%` }}
                    />
                    <span className="text-[10px] text-slate-400 mt-1 whitespace-nowrap">{bar.time}</span>
                  </div>
                ))}
              </div>
              <div className="text-[11px] text-slate-500 mt-3 flex justify-between">
                <span>Peak Inbound: 07:45 - 08:30 AM</span>
                <span>Peak Outbound: 04:15 - 05:30 PM</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E1235] rounded-2xl p-5 border border-[#E8E0D7] dark:border-[#3D2668] shadow-xs space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#7E22CE]">
                Route Reliability & On-Time Arrival Rates
              </h3>
              <div className="space-y-3">
                {[
                  { route: 'Route 04 (North Express)', onTime: 98, avgDelay: '0.4m', status: 'Excellent' },
                  { route: 'Route 12 (City Railway Link)', onTime: 95, avgDelay: '1.2m', status: 'Good' },
                  { route: 'Route 07 (South Hostels)', onTime: 99, avgDelay: '0.2m', status: 'Optimal' },
                  { route: 'Route 09 (Bio-Tech Express)', onTime: 91, avgDelay: '2.5m', status: 'Traffic Alert' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#2E1065] dark:text-[#FAF7F2]">{item.route}</span>
                      <span className="font-mono font-bold text-[#7E22CE]">
                        {item.onTime}% On-Time
                      </span>
                    </div>
                    <div className="w-full bg-[#EDE9FE] dark:bg-[#3D2668] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${item.onTime}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Avg Deviation: {item.avgDelay}</span>
                      <span>{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Announcement Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1E1235] rounded-2xl p-5 max-w-md w-full border border-[#DDD6FE] dark:border-[#4C288A] shadow-2xl">
            <h3 className="font-bold text-sm text-[#2E1065] dark:text-[#FAF7F2] flex items-center gap-2">
              <Send className="w-4 h-4 text-[#7E22CE]" />
              <span>Broadcast Network Notice</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Sends an instantaneous notification alert to student mobile apps and driver consoles.
            </p>

            <form onSubmit={handleSendBroadcast} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Notice Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weather Alert: Afternoon Shuttles Running Regular"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full mt-1 p-2 bg-[#FAF7F2] dark:bg-[#281747] border border-[#E8E0D7] dark:border-[#3D2668] rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Detailed Message</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide precise details regarding stops, route changes, or safety..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full mt-1 p-2 bg-[#FAF7F2] dark:bg-[#281747] border border-[#E8E0D7] dark:border-[#3D2668] rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Severity</label>
                  <select
                    value={broadcastSeverity}
                    onChange={(e) => setBroadcastSeverity(e.target.value as any)}
                    className="w-full mt-1 p-2 bg-[#FAF7F2] dark:bg-[#281747] border border-[#E8E0D7] dark:border-[#3D2668] rounded-xl"
                  >
                    <option value="info">Informational</option>
                    <option value="warning">Warning / Delay</option>
                    <option value="critical">Critical / Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Target Line</label>
                  <select
                    value={broadcastTargetRoute}
                    onChange={(e) => setBroadcastTargetRoute(e.target.value)}
                    className="w-full mt-1 p-2 bg-[#FAF7F2] dark:bg-[#281747] border border-[#E8E0D7] dark:border-[#3D2668] rounded-xl"
                  >
                    <option value="all">Entire Transit Network</option>
                    {routes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.code} - {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#581C87] hover:bg-[#3B0764] text-white font-bold rounded-xl shadow-xs"
                >
                  Broadcast to Fleet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Route Modal */}
      {showAddRouteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1E1235] rounded-2xl p-5 max-w-md w-full border border-[#DDD6FE] dark:border-[#4C288A] shadow-2xl">
            <h3 className="font-bold text-sm text-[#2E1065] dark:text-[#FAF7F2] flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#7E22CE]" />
              <span>Create New Bus Route</span>
            </h3>

            <form onSubmit={handleAddRouteSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Route Code</label>
                <input
                  type="text"
                  required
                  value={newRouteCode}
                  onChange={(e) => setNewRouteCode(e.target.value)}
                  className="w-full mt-1 p-2 bg-[#FAF7F2] dark:bg-[#281747] border border-[#E8E0D7] dark:border-[#3D2668] rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Route Name</label>
                <input
                  type="text"
                  required
                  value={newRouteName}
                  onChange={(e) => setNewRouteName(e.target.value)}
                  className="w-full mt-1 p-2 bg-[#FAF7F2] dark:bg-[#281747] border border-[#E8E0D7] dark:border-[#3D2668] rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Route Map Color</label>
                <div className="flex gap-2 mt-1">
                  {['#9333EA', '#7E22CE', '#059669', '#D97706', '#2563EB'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewRouteColor(color)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        newRouteColor === color ? 'scale-110 border-[#2E1065] dark:border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddRouteModal(false)}
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#581C87] hover:bg-[#3B0764] text-white font-bold rounded-xl shadow-xs"
                >
                  Create Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Stop to Route Modal */}
      {showAddStopModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1E1235] rounded-2xl p-5 max-w-md w-full border border-[#DDD6FE] dark:border-[#4C288A] shadow-2xl">
            <h3 className="font-bold text-sm text-[#2E1065] dark:text-[#FAF7F2] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#7E22CE]" />
              <span>Add Waypoint / Stop to Route</span>
            </h3>

            <form onSubmit={handleAddStopSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Select Route</label>
                <select
                  value={selectedRouteForStop}
                  onChange={(e) => setSelectedRouteForStop(e.target.value)}
                  className="w-full mt-1 p-2 bg-[#FAF7F2] dark:bg-[#281747] border border-[#E8E0D7] dark:border-[#3D2668] rounded-xl"
                >
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.code} - {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Stop Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science & Innovation Quad Gate 3"
                  value={newStopName}
                  onChange={(e) => setNewStopName(e.target.value)}
                  className="w-full mt-1 p-2 bg-[#FAF7F2] dark:bg-[#281747] border border-[#E8E0D7] dark:border-[#3D2668] rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Landmark</label>
                <input
                  type="text"
                  placeholder="e.g. Opposite Solar Canopy"
                  value={newStopLandmark}
                  onChange={(e) => setNewStopLandmark(e.target.value)}
                  className="w-full mt-1 p-2 bg-[#FAF7F2] dark:bg-[#281747] border border-[#E8E0D7] dark:border-[#3D2668] rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newStopLat}
                    onChange={(e) => setNewStopLat(Number(e.target.value))}
                    className="w-full mt-1 p-2 bg-[#FAF7F2] dark:bg-[#281747] border border-[#E8E0D7] dark:border-[#3D2668] rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newStopLng}
                    onChange={(e) => setNewStopLng(Number(e.target.value))}
                    className="w-full mt-1 p-2 bg-[#FAF7F2] dark:bg-[#281747] border border-[#E8E0D7] dark:border-[#3D2668] rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddStopModal(false)}
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#581C87] hover:bg-[#3B0764] text-white font-bold rounded-xl shadow-xs"
                >
                  Save Stop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign / Remove Driver Modal */}
      {showAssignDriverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1E1235] rounded-2xl p-6 max-w-lg w-full border border-[#DDD6FE] dark:border-[#4C288A] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D7] dark:border-[#3D2668]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] dark:bg-[#3B0764] flex items-center justify-center text-[#581C87] dark:text-[#C4B5FD]">
                  <BusIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#2E1065] dark:text-[#FAF7F2]">
                    Assign / Remove Driver for Bus
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Allocate licensed driver to transport vehicle or unassign current driver
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAssignDriverModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Target Bus Selection */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Select Vehicle / Bus Number
              </label>
              <select
                value={driverModalBusId}
                onChange={(e) => {
                  const bId = e.target.value;
                  setDriverModalBusId(bId);
                  const targetB = buses.find((b) => b.id === bId);
                  if (targetB?.driverId) {
                    setDriverModalDriverId(targetB.driverId);
                  }
                }}
                className="w-full mt-1.5 p-2.5 bg-[#FAF7F2] dark:bg-[#281747] border border-[#DDD6FE] dark:border-[#4C288A] rounded-xl text-xs font-bold text-[#2E1065] dark:text-[#FAF7F2]"
              >
                {buses.map((b) => {
                  const r = routes.find((rt) => rt.id === b.routeId);
                  const d = drivers.find((drv) => drv.id === b.driverId);
                  return (
                    <option key={b.id} value={b.id}>
                      {b.busNumber} ({r?.code || 'Fleet'} - {r?.name || 'Corridor'}) {d ? `[Driver: ${d.name}]` : '[No Driver Assigned]'}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Current Driver Status Card */}
            {(() => {
              const currentBus = buses.find((b) => b.id === driverModalBusId);
              const currentDriver = drivers.find((d) => d.id === currentBus?.driverId);

              return (
                <div className="p-3.5 bg-[#FAF7F2] dark:bg-[#281747] rounded-xl border border-[#E8E0D7] dark:border-[#3D2668]">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Current Bus Status & Driver
                  </div>
                  {currentDriver ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={currentDriver.avatarUrl}
                          alt={currentDriver.name}
                          className="w-10 h-10 rounded-full object-cover border border-[#DDD6FE]"
                        />
                        <div>
                          <div className="font-bold text-xs text-[#2E1065] dark:text-[#FAF7F2]">
                            {currentDriver.name}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            Lic: {currentDriver.licenseNumber} · {currentDriver.phone}
                          </div>
                          <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                            ★ {currentDriver.rating} Rating · {currentDriver.experienceYears} Years Exp.
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          removeDriverFromBus(driverModalBusId);
                        }}
                        className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 text-rose-700 dark:text-rose-300 font-bold text-xs rounded-xl transition-colors border border-rose-300 dark:border-rose-800"
                      >
                        Unassign Driver
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-amber-700 dark:text-amber-400 font-medium italic py-1 flex items-center justify-between">
                      <span>No driver is currently assigned to {currentBus?.busNumber || 'this bus'}.</span>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Select Driver to Assign */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Choose Driver to Assign
              </label>
              <select
                value={driverModalDriverId}
                onChange={(e) => setDriverModalDriverId(e.target.value)}
                className="w-full mt-1.5 p-2.5 bg-[#FAF7F2] dark:bg-[#281747] border border-[#DDD6FE] dark:border-[#4C288A] rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                {drivers.map((drv) => {
                  const assignedToBus = buses.find((b) => b.driverId === drv.id);
                  const isCurrentBus = assignedToBus?.id === driverModalBusId;
                  return (
                    <option key={drv.id} value={drv.id}>
                      {drv.name} (Lic: {drv.licenseNumber}) {isCurrentBus ? '— Currently on this bus' : assignedToBus ? `— Assigned to ${assignedToBus.busNumber}` : '— Available'}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#E8E0D7] dark:border-[#3D2668]">
              <button
                type="button"
                onClick={() => setShowAssignDriverModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#281747] rounded-xl transition-colors"
              >
                Cancel
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    assignDriverToBus(driverModalBusId, driverModalDriverId);
                    setShowAssignDriverModal(false);
                  }}
                  className="px-4 py-2 bg-[#581C87] hover:bg-[#3B0764] text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Assign Driver to Bus</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Remove Students for Bus Number Modal */}
      {showAddStudentToBusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1E1235] rounded-2xl p-6 max-w-xl w-full border border-[#DDD6FE] dark:border-[#4C288A] shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D7] dark:border-[#3D2668] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] dark:bg-[#3B0764] flex items-center justify-center text-[#581C87] dark:text-[#C4B5FD]">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#2E1065] dark:text-[#FAF7F2]">
                    Add / Remove Students for Bus Number
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Allocate student transit passes to bus numbers and manage onboard roster
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddStudentToBusModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Target Bus Selector */}
            <div className="shrink-0">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Select Target Bus Number
              </label>
              <select
                value={studentModalBusId}
                onChange={(e) => setStudentModalBusId(e.target.value)}
                className="w-full mt-1.5 p-2.5 bg-[#FAF7F2] dark:bg-[#281747] border border-[#DDD6FE] dark:border-[#4C288A] rounded-xl text-xs font-bold text-[#2E1065] dark:text-[#FAF7F2]"
              >
                {buses.map((b) => {
                  const r = routes.find((rt) => rt.id === b.routeId);
                  const count = students.filter((s) => s.assignedBusId === b.id).length;
                  return (
                    <option key={b.id} value={b.id}>
                      {b.busNumber} — {r?.name || 'Route'} ({count} / {b.capacity} Students Assigned)
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Add Student Section */}
            <div className="p-3.5 bg-[#FAF7F2] dark:bg-[#281747] rounded-xl border border-[#E8E0D7] dark:border-[#3D2668] shrink-0 space-y-2.5">
              <div className="text-[11px] font-bold text-[#581C87] dark:text-[#C4B5FD] uppercase tracking-wider">
                Add Student to {buses.find((b) => b.id === studentModalBusId)?.busNumber}
              </div>
              <div className="flex gap-2">
                <select
                  value={studentModalStudentId}
                  onChange={(e) => setStudentModalStudentId(e.target.value)}
                  className="flex-1 p-2 bg-white dark:bg-[#1E1235] border border-[#DDD6FE] dark:border-[#4C288A] rounded-xl text-xs text-slate-800 dark:text-slate-200 font-medium"
                >
                  {students.map((st) => {
                    const currentBus = buses.find((b) => b.id === st.assignedBusId);
                    const isAlreadyOnThisBus = st.assignedBusId === studentModalBusId;
                    return (
                      <option key={st.id} value={st.id} disabled={isAlreadyOnThisBus}>
                        {st.name} ({st.rollNo}) — {st.department} {isAlreadyOnThisBus ? '✓ Already on this bus' : currentBus ? `(On ${currentBus.busNumber})` : '(Unassigned)'}
                      </option>
                    );
                  })}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    assignStudentToBus(studentModalStudentId, studentModalBusId);
                  }}
                  className="px-4 py-2 bg-[#581C87] hover:bg-[#3B0764] text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Assign to Bus</span>
                </button>
              </div>
            </div>

            {/* Current Students Assigned Roster with Remove Action */}
            <div className="flex-1 min-h-0 flex flex-col space-y-2">
              {(() => {
                const assignedRoster = students.filter((s) => s.assignedBusId === studentModalBusId);
                const currentBus = buses.find((b) => b.id === studentModalBusId);

                return (
                  <>
                    <div className="flex items-center justify-between text-xs shrink-0">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        Assigned Students Roster ({assignedRoster.length})
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Bus {currentBus?.busNumber} · Capacity: {currentBus?.capacity}
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 border border-[#E8E0D7] dark:border-[#3D2668] rounded-xl p-2 bg-slate-50/50 dark:bg-[#190D2D]/60 min-h-[140px]">
                      {assignedRoster.length === 0 ? (
                        <div className="text-center py-6 text-xs text-slate-400">
                          No students are currently assigned to this bus number.
                          <div className="text-[11px] text-[#7E22CE] dark:text-[#C4B5FD] mt-1">
                            Select a student above and click "Assign to Bus".
                          </div>
                        </div>
                      ) : (
                        assignedRoster.map((st) => (
                          <div
                            key={st.id}
                            className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#1E1235] border border-[#DDD6FE] dark:border-[#4C288A] text-xs hover:border-[#7E22CE] transition-colors"
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <img
                                src={st.avatarUrl}
                                alt={st.name}
                                className="w-8 h-8 rounded-full object-cover border border-[#DDD6FE]"
                              />
                              <div className="truncate">
                                <div className="font-bold text-[#2E1065] dark:text-[#FAF7F2]">
                                  {st.name}
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono">
                                  {st.rollNo} · {st.department}
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeStudentFromBus(st.id)}
                              className="px-2.5 py-1 text-[11px] bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 text-rose-600 dark:text-rose-400 font-bold rounded-lg transition-colors flex items-center gap-1 border border-rose-200 dark:border-rose-900"
                              title="Remove this student from the bus"
                            >
                              <X className="w-3 h-3" />
                              <span>Remove</span>
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end pt-3 border-t border-[#E8E0D7] dark:border-[#3D2668] shrink-0">
              <button
                type="button"
                onClick={() => setShowAddStudentToBusModal(false)}
                className="px-5 py-2 bg-[#3B0764] hover:bg-[#2E1065] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
