export type BusStatus = 'in-transit' | 'at-stop' | 'idle' | 'delayed' | 'sos';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Stop {
  id: string;
  name: string;
  landmark: string;
  coords: GeoPoint;
  scheduledTime: string;
  order: number;
  geofenceRadiusMeters: number;
  studentsWaiting: number;
}

export interface Route {
  id: string;
  code: string;
  name: string;
  color: string;
  activeBusId: string;
  totalDistanceKm: number;
  avgDurationMinutes: number;
  frequencyMinutes: number;
  stops: Stop[];
  polylineCoords: GeoPoint[];
  operatingHours: string;
}

export interface BusTelemetry {
  lat: number;
  lng: number;
  speedKmH: number;
  headingDeg: number;
  fuelPercent: number;
  batteryPercent: number;
  temperatureC: number;
  odometerKm: number;
}

export interface Bus {
  id: string;
  busNumber: string;
  plateNumber: string;
  routeId: string;
  driverId: string;
  status: BusStatus;
  capacity: number;
  passengersOnboard: number;
  telemetry: BusTelemetry;
  currentStopIndex: number;
  nextStopId: string;
  etaToNextStopMin: number;
  delayMinutes: number;
  lastUpdated: string;
  isTripActive: boolean;
  sosReason?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  avatarUrl: string;
  rating: number;
  experienceYears: number;
  assignedBusId: string;
  assignedRouteId: string;
  shiftStatus: 'on-duty' | 'off-duty' | 'break';
  emergencyContact: string;
}

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  department: string;
  semester: string;
  avatarUrl: string;
  assignedRouteId: string;
  assignedBusId?: string;
  pickupStopId: string;
  dropStopId: string;
  passNumber: string;
  passValidUntil: string;
  passStatus: 'active' | 'expired' | 'pending';
  parentPhone: string;
  studentPhone: string;
}

export interface AlertNotification {
  id: string;
  timestamp: string;
  type: 'delay' | 'emergency' | 'sos' | 'geofence' | 'announcement';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  routeId?: string;
  busId?: string;
  read: boolean;
}

export interface DailyTripLog {
  id: string;
  busId: string;
  routeId: string;
  tripType: 'morning-pickup' | 'evening-drop';
  startTime: string;
  endTime?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  passengersBoarded: number;
  onTimeArrivalRate: number;
}
