import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Bus, Route, Driver, Student, AlertNotification, Stop, DailyTripLog } from '../types/transit';
import {
  INITIAL_BUSES,
  INITIAL_ROUTES,
  INITIAL_DRIVERS,
  INITIAL_STUDENTS,
  INITIAL_ALERTS,
  INITIAL_TRIP_LOGS,
} from '../data/mockTransitData';

export type AppViewMode = 'admin' | 'student' | 'driver' | 'split' | 'portal';

interface TransitContextType {
  // Navigation & View
  viewMode: AppViewMode;
  setViewMode: (mode: AppViewMode) => void;
  isSimulating: boolean;
  simulationSpeed: number;
  toggleSimulation: () => void;
  setSimulationSpeed: (speed: number) => void;
  resetSimulation: () => void;

  // Domain Entities
  buses: Bus[];
  routes: Route[];
  drivers: Driver[];
  students: Student[];
  alerts: AlertNotification[];
  tripLogs: DailyTripLog[];

  // Selected Entities
  selectedBusId: string;
  setSelectedBusId: (id: string) => void;
  selectedRouteId: string;
  setSelectedRouteId: (id: string) => void;
  activeDriverId: string;
  setActiveDriverId: (id: string) => void;
  activeStudentId: string;
  setActiveStudentId: (id: string) => void;

  // Helper Getters
  activeBus: Bus | undefined;
  activeRoute: Route | undefined;
  activeDriver: Driver | undefined;
  activeStudent: Student | undefined;

  // Driver Actions
  startTrip: (busId: string) => void;
  endTrip: (busId: string) => void;
  advanceToNextStop: (busId: string) => void;
  boardPassenger: (busId: string, count?: number) => void;
  alightPassenger: (busId: string, count?: number) => void;
  triggerSos: (busId: string, reason: string) => void;
  resolveSos: (busId: string) => void;
  reportDelay: (busId: string, minutes: number, reason: string) => void;

  // Student Actions
  markAlertRead: (alertId: string) => void;
  clearAllAlerts: () => void;

  // Admin Actions
  broadcastAlert: (title: string, message: string, severity: 'info' | 'warning' | 'critical', routeId?: string) => void;
  addRoute: (route: Route) => void;
  updateRoute: (route: Route) => void;
  deleteRoute: (routeId: string) => void;
  removeStopFromRoute: (routeId: string, stopId: string) => void;
  removeBus: (busId: string) => void;
  removeStudent: (studentId: string) => void;
  removeAlert: (alertId: string) => void;
  addStopToRoute: (routeId: string, stop: Omit<Stop, 'id' | 'order'>) => void;
  updateStudentPassStatus: (studentId: string, status: 'active' | 'expired' | 'pending', validUntil?: string) => void;
  assignDriverToBus: (busId: string, driverId: string) => void;
  removeDriverFromBus: (busId: string) => void;
  assignStudentToBus: (studentId: string, busId: string) => void;
  removeStudentFromBus: (studentId: string) => void;
}

const TransitContext = createContext<TransitContextType | undefined>(undefined);

// Helper math for bearing calculation
function calculateBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const y = Math.sin(dLng) * Math.cos(lat2 * (Math.PI / 180));
  const x =
    Math.cos(lat1 * (Math.PI / 180)) * Math.sin(lat2 * (Math.PI / 180)) -
    Math.sin(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.cos(dLng);
  let brng = Math.atan2(y, x) * (180 / Math.PI);
  return (brng + 360) % 360;
}

// Distance approximation in km
function calculateDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth radius km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const TransitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getInitialViewMode = (): AppViewMode => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      if (hash === 'student') return 'student';
      if (hash === 'driver') return 'driver';
      if (hash === 'split') return 'split';
      if (hash === 'portal') return 'portal';
      if (hash === 'admin') return 'admin';
    }
    return 'admin';
  };

  const [viewMode, setViewModeState] = useState<AppViewMode>(getInitialViewMode);

  const setViewMode = useCallback((mode: AppViewMode) => {
    setViewModeState(mode);
    if (typeof window !== 'undefined') {
      try {
        window.history.replaceState(null, '', `#${mode}`);
      } catch (e) {
        window.location.hash = mode;
      }
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      if (['admin', 'student', 'driver', 'split', 'portal'].includes(hash)) {
        setViewModeState(hash as AppViewMode);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);

  const [buses, setBuses] = useState<Bus[]>(INITIAL_BUSES);
  const [routes, setRoutes] = useState<Route[]>(INITIAL_ROUTES);
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [alerts, setAlerts] = useState<AlertNotification[]>(INITIAL_ALERTS);
  const [tripLogs, setTripLogs] = useState<DailyTripLog[]>(INITIAL_TRIP_LOGS);

  const [selectedBusId, setSelectedBusId] = useState<string>('bus-104');
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-north-04');
  const [activeDriverId, setActiveDriverId] = useState<string>('drv-01');
  const [activeStudentId, setActiveStudentId] = useState<string>('stu-01');

  // Keep track of polyline index progress for each bus
  const busProgressRef = useRef<{ [busId: string]: { currentSegment: number; t: number; direction: 1 | -1 } }>({
    'bus-104': { currentSegment: 4, t: 0.35, direction: 1 },
    'bus-112': { currentSegment: 3, t: 0.60, direction: 1 },
    'bus-107': { currentSegment: 2, t: 0.05, direction: 1 },
    'bus-109': { currentSegment: 2, t: 0.40, direction: 1 },
  });

  const activeBus = buses.find((b) => b.id === selectedBusId) || buses[0];
  const activeRoute = routes.find((r) => r.id === (activeBus?.routeId || selectedRouteId)) || routes[0];
  const activeDriver = drivers.find((d) => d.id === activeDriverId) || drivers[0];
  const activeStudent = students.find((s) => s.id === activeStudentId) || students[0];

  // Simulation step loop
  useEffect(() => {
    if (!isSimulating) return;

    const intervalTime = 1000 / simulationSpeed;
    const interval = setInterval(() => {
      setBuses((prevBuses) => {
        return prevBuses.map((bus) => {
          if (!bus.isTripActive || bus.status === 'sos') {
            return bus;
          }

          const route = routes.find((r) => r.id === bus.routeId);
          if (!route || route.polylineCoords.length < 2) return bus;

          const polyline = route.polylineCoords;
          let progress = busProgressRef.current[bus.id];
          if (!progress) {
            progress = { currentSegment: 0, t: 0, direction: 1 };
            busProgressRef.current[bus.id] = progress;
          }

          // Advance along the polyline
          const speedFactor = 0.045 * simulationSpeed;
          progress.t += speedFactor * progress.direction;

          if (progress.t >= 1) {
            progress.t = 0;
            progress.currentSegment += 1;
            if (progress.currentSegment >= polyline.length - 1) {
              // reverse direction or loop back
              progress.currentSegment = polyline.length - 2;
              progress.direction = -1;
              progress.t = 1;
            }
          } else if (progress.t <= 0 && progress.direction === -1) {
            progress.t = 1;
            progress.currentSegment -= 1;
            if (progress.currentSegment < 0) {
              progress.currentSegment = 0;
              progress.direction = 1;
              progress.t = 0;
            }
          }

          const seg = Math.max(0, Math.min(progress.currentSegment, polyline.length - 2));
          const p1 = polyline[seg];
          const p2 = polyline[seg + 1];

          const t = Math.max(0, Math.min(1, progress.t));
          const currentLat = p1.lat + (p2.lat - p1.lat) * t;
          const currentLng = p1.lng + (p2.lng - p1.lng) * t;

          const heading = progress.direction === 1
            ? calculateBearing(p1.lat, p1.lng, p2.lat, p2.lng)
            : calculateBearing(p2.lat, p2.lng, p1.lat, p1.lng);

          // Find closest next stop
          let closestStop = route.stops[0];
          let minDistance = 9999;
          let closestStopIndex = 0;

          route.stops.forEach((stop, idx) => {
            const dist = calculateDistanceKm(currentLat, currentLng, stop.coords.lat, stop.coords.lng);
            if (dist < minDistance) {
              minDistance = dist;
              closestStop = stop;
              closestStopIndex = idx;
            }
          });

          // Check if bus is within geofence of stop (< 70m)
          const isAtStop = minDistance < 0.08;
          const newStatus = isAtStop ? 'at-stop' : (bus.delayMinutes > 4 ? 'delayed' : 'in-transit');
          const currentSpeed = isAtStop ? 0 : Math.round(32 + Math.sin(Date.now() / 3000) * 8);
          const etaMin = Math.max(1, Math.round(minDistance * 2.5));

          return {
            ...bus,
            status: newStatus,
            currentStopIndex: closestStopIndex,
            nextStopId: closestStop.id,
            etaToNextStopMin: etaMin,
            telemetry: {
              ...bus.telemetry,
              lat: currentLat,
              lng: currentLng,
              speedKmH: currentSpeed,
              headingDeg: Math.round(heading),
              odometerKm: +(bus.telemetry.odometerKm + 0.01 * simulationSpeed).toFixed(2),
            },
            lastUpdated: 'Live',
          };
        });
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isSimulating, simulationSpeed, routes]);

  const toggleSimulation = useCallback(() => {
    setIsSimulating((prev) => !prev);
  }, []);

  const resetSimulation = useCallback(() => {
    setBuses(INITIAL_BUSES);
    busProgressRef.current = {
      'bus-104': { currentSegment: 4, t: 0.35, direction: 1 },
      'bus-112': { currentSegment: 3, t: 0.60, direction: 1 },
      'bus-107': { currentSegment: 2, t: 0.05, direction: 1 },
      'bus-109': { currentSegment: 2, t: 0.40, direction: 1 },
    };
  }, []);

  // Driver action implementations
  const startTrip = useCallback((busId: string) => {
    setBuses((prev) =>
      prev.map((bus) =>
        bus.id === busId
          ? { ...bus, isTripActive: true, status: 'in-transit', lastUpdated: 'Trip started' }
          : bus
      )
    );
    const bus = buses.find((b) => b.id === busId);
    if (bus) {
      setAlerts((prev) => [
        {
          id: `alert-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'announcement',
          severity: 'info',
          title: `${bus.busNumber} Started Route`,
          message: `${bus.busNumber} has departed for scheduled trip. Real-time GPS stream active.`,
          routeId: bus.routeId,
          busId: bus.id,
          read: false,
        },
        ...prev,
      ]);
    }
  }, [buses]);

  const endTrip = useCallback((busId: string) => {
    setBuses((prev) =>
      prev.map((bus) =>
        bus.id === busId
          ? {
              ...bus,
              isTripActive: false,
              status: 'idle',
              passengersOnboard: 0,
              telemetry: { ...bus.telemetry, speedKmH: 0 },
              lastUpdated: 'Trip completed',
            }
          : bus
      )
    );
  }, []);

  const advanceToNextStop = useCallback((busId: string) => {
    setBuses((prev) =>
      prev.map((bus) => {
        if (bus.id !== busId) return bus;
        const route = routes.find((r) => r.id === bus.routeId);
        if (!route) return bus;

        const nextIdx = (bus.currentStopIndex + 1) % route.stops.length;
        const nextStop = route.stops[nextIdx];

        // Jump bus to next stop position
        return {
          ...bus,
          currentStopIndex: nextIdx,
          nextStopId: nextStop.id,
          etaToNextStopMin: 4,
          telemetry: {
            ...bus.telemetry,
            lat: nextStop.coords.lat,
            lng: nextStop.coords.lng,
            speedKmH: 0,
          },
          status: 'at-stop',
          lastUpdated: `Arrived at ${nextStop.name}`,
        };
      })
    );
  }, [routes]);

  const boardPassenger = useCallback((busId: string, count: number = 1) => {
    setBuses((prev) =>
      prev.map((bus) => {
        if (bus.id !== busId) return bus;
        const newCount = Math.min(bus.capacity, bus.passengersOnboard + count);
        return { ...bus, passengersOnboard: newCount };
      })
    );
  }, []);

  const alightPassenger = useCallback((busId: string, count: number = 1) => {
    setBuses((prev) =>
      prev.map((bus) => {
        if (bus.id !== busId) return bus;
        const newCount = Math.max(0, bus.passengersOnboard - count);
        return { ...bus, passengersOnboard: newCount };
      })
    );
  }, []);

  const triggerSos = useCallback((busId: string, reason: string) => {
    setBuses((prev) =>
      prev.map((bus) =>
        bus.id === busId
          ? { ...bus, status: 'sos', sosReason: reason, telemetry: { ...bus.telemetry, speedKmH: 0 } }
          : bus
      )
    );

    const bus = buses.find((b) => b.id === busId);
    setAlerts((prev) => [
      {
        id: `sos-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'sos',
        severity: 'critical',
        title: `EMERGENCY SOS: ${bus?.busNumber || busId}`,
        message: `Driver triggered emergency assistance. Reason: ${reason}. Location: lat ${bus?.telemetry.lat.toFixed(4)}, lng ${bus?.telemetry.lng.toFixed(4)}. Campus Safety alerted.`,
        routeId: bus?.routeId,
        busId,
        read: false,
      },
      ...prev,
    ]);
  }, [buses]);

  const resolveSos = useCallback((busId: string) => {
    setBuses((prev) =>
      prev.map((bus) =>
        bus.id === busId ? { ...bus, status: 'in-transit', sosReason: undefined } : bus
      )
    );
  }, []);

  const reportDelay = useCallback((busId: string, minutes: number, reason: string) => {
    setBuses((prev) =>
      prev.map((bus) =>
        bus.id === busId ? { ...bus, delayMinutes: minutes, status: 'delayed' } : bus
      )
    );

    const bus = buses.find((b) => b.id === busId);
    setAlerts((prev) => [
      {
        id: `delay-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'delay',
        severity: 'warning',
        title: `${bus?.busNumber || busId} Delay: +${minutes} mins`,
        message: `Notice to commuters: Expected delay of ${minutes} minutes due to: ${reason}.`,
        routeId: bus?.routeId,
        busId,
        read: false,
      },
      ...prev,
    ]);
  }, [buses]);

  // Student Actions
  const markAlertRead = useCallback((alertId: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, read: true } : a)));
  }, []);

  const clearAllAlerts = useCallback(() => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  }, []);

  // Admin Actions
  const broadcastAlert = useCallback(
    (title: string, message: string, severity: 'info' | 'warning' | 'critical', routeId?: string) => {
      setAlerts((prev) => [
        {
          id: `broadcast-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'announcement',
          severity,
          title,
          message,
          routeId,
          read: false,
        },
        ...prev,
      ]);
    },
    []
  );

  const addRoute = useCallback((newRoute: Route) => {
    setRoutes((prev) => [...prev, newRoute]);
  }, []);

  const updateRoute = useCallback((updatedRoute: Route) => {
    setRoutes((prev) => prev.map((r) => (r.id === updatedRoute.id ? updatedRoute : r)));
  }, []);

  const deleteRoute = useCallback((routeId: string) => {
    setRoutes((prev) => prev.filter((r) => r.id !== routeId));
  }, []);

  const removeStopFromRoute = useCallback((routeId: string, stopId: string) => {
    setRoutes((prev) =>
      prev.map((r) => {
        if (r.id !== routeId) return r;
        const filteredStops = r.stops.filter((s) => s.id !== stopId);
        return {
          ...r,
          stops: filteredStops.map((s, idx) => ({ ...s, order: idx + 1 })),
        };
      })
    );
  }, []);

  const removeBus = useCallback((busId: string) => {
    setBuses((prev) => prev.filter((b) => b.id !== busId));
  }, []);

  const removeStudent = useCallback((studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
  }, []);

  const removeAlert = useCallback((alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  }, []);

  const addStopToRoute = useCallback((routeId: string, stopData: Omit<Stop, 'id' | 'order'>) => {
    setRoutes((prev) =>
      prev.map((r) => {
        if (r.id !== routeId) return r;
        const newStop: Stop = {
          ...stopData,
          id: `stop-${Date.now()}`,
          order: r.stops.length + 1,
        };
        return {
          ...r,
          stops: [...r.stops, newStop],
          polylineCoords: [...r.polylineCoords, stopData.coords],
        };
      })
    );
  }, []);

  const updateStudentPassStatus = useCallback(
    (studentId: string, status: 'active' | 'expired' | 'pending', validUntil?: string) => {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId
            ? { ...s, passStatus: status, ...(validUntil ? { passValidUntil: validUntil } : {}) }
            : s
        )
      );
    },
    []
  );

  const assignDriverToBus = useCallback((busId: string, driverId: string) => {
    // Unassign driver from other buses if any
    setDrivers((prev) =>
      prev.map((d) => (d.id === driverId ? { ...d, assignedBusId: busId } : d))
    );
    setBuses((prev) =>
      prev.map((b) => (b.id === busId ? { ...b, driverId } : b))
    );
  }, []);

  const removeDriverFromBus = useCallback((busId: string) => {
    const bus = buses.find((b) => b.id === busId);
    if (bus?.driverId) {
      setDrivers((prev) =>
        prev.map((d) => (d.id === bus.driverId ? { ...d, assignedBusId: '' } : d))
      );
    }
    setBuses((prev) =>
      prev.map((b) => (b.id === busId ? { ...b, driverId: '' } : b))
    );
  }, [buses]);

  const assignStudentToBus = useCallback((studentId: string, busId: string) => {
    const targetBus = buses.find((b) => b.id === busId);
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        return {
          ...s,
          assignedBusId: busId,
          assignedRouteId: targetBus?.routeId || s.assignedRouteId,
        };
      })
    );
  }, [buses]);

  const removeStudentFromBus = useCallback((studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, assignedBusId: undefined } : s))
    );
  }, []);

  return (
    <TransitContext.Provider
      value={{
        viewMode,
        setViewMode,
        isSimulating,
        simulationSpeed,
        toggleSimulation,
        setSimulationSpeed,
        resetSimulation,

        buses,
        routes,
        drivers,
        students,
        alerts,
        tripLogs,

        selectedBusId,
        setSelectedBusId,
        selectedRouteId,
        setSelectedRouteId,
        activeDriverId,
        setActiveDriverId,
        activeStudentId,
        setActiveStudentId,

        activeBus,
        activeRoute,
        activeDriver,
        activeStudent,

        startTrip,
        endTrip,
        advanceToNextStop,
        boardPassenger,
        alightPassenger,
        triggerSos,
        resolveSos,
        reportDelay,

        markAlertRead,
        clearAllAlerts,

        broadcastAlert,
        addRoute,
        updateRoute,
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
      }}
    >
      {children}
    </TransitContext.Provider>
  );
};

export const useTransit = () => {
  const context = useContext(TransitContext);
  if (!context) {
    throw new Error('useTransit must be used within a TransitProvider');
  }
  return context;
};
