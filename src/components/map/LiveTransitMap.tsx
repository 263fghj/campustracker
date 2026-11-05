import React, { useState, useMemo, useRef } from 'react';
import { useTransit } from '../../context/TransitContext';
import { Bus, GeoPoint, Route, Stop } from '../../types/transit';
import {
  ZoomIn,
  ZoomOut,
  Navigation,
  Compass,
  Bus as BusIcon,
  Layers,
  MapPin,
  Clock,
  Users,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface LiveTransitMapProps {
  height?: string;
  showAllRoutes?: boolean;
  focusedBusId?: string;
  focusedRouteId?: string;
  onSelectBus?: (busId: string) => void;
  onSelectStop?: (stop: Stop, route: Route) => void;
  compact?: boolean;
}

// Bounding box for mapping GeoPoints to SVG canvas [0,0] to [1000, 700]
const MAP_BOUNDS = {
  minLat: 17.012,
  maxLat: 17.092,
  minLng: 82.022,
  maxLng: 82.120,
};

export const LiveTransitMap: React.FC<LiveTransitMapProps> = ({
  height = 'h-[560px]',
  focusedBusId,
  focusedRouteId,
  onSelectBus,
  onSelectStop,
  compact = false,
}) => {
  const {
    buses,
    routes,
    selectedBusId,
    setSelectedBusId,
    selectedRouteId,
    setSelectedRouteId,
  } = useTransit();

  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeLayers, setActiveLayers] = useState<{ [routeId: string]: boolean }>({
    'route-north-04': true,
    'route-city-12': true,
    'route-south-07': true,
    'route-east-09': true,
  });
  const [hoveredStop, setHoveredStop] = useState<{ stop: Stop; route: Route; x: number; y: number } | null>(null);
  const [hoveredBus, setHoveredBus] = useState<Bus | null>(null);
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);
  const [showScheduleDeviationsOnly, setShowScheduleDeviationsOnly] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Convert GPS (lat, lng) to SVG space (1000 x 700)
  const projectGeoToSvg = useMemo(() => {
    return (geo: GeoPoint) => {
      const xPercent = (geo.lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng);
      const yPercent = 1 - (geo.lat - MAP_BOUNDS.minLat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat);
      const x = xPercent * 940 + 30;
      const y = yPercent * 640 + 30;
      return { x, y };
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(2.5, Math.max(0.7, +(prev + delta).toFixed(2))));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const toggleRouteLayer = (routeId: string) => {
    setActiveLayers((prev) => ({ ...prev, [routeId]: !prev[routeId] }));
  };

  const activeFocusBus = buses.find((b) => b.id === (focusedBusId || selectedBusId));
  const activeFocusRoute = routes.find((r) => r.id === (activeFocusBus?.routeId || selectedRouteId));

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${height} overflow-hidden rounded-2xl border border-[#E8E0D7] dark:border-[#3D2668] bg-[#FAF7F2] dark:bg-[#140B24] select-none shadow-sm`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Top Map Action Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        {/* Real-Time Status Pill */}
        <div className="pointer-events-auto flex items-center gap-2 bg-white/95 dark:bg-[#281747]/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#E8E0D7] dark:border-[#4C288A] shadow-xs text-xs text-[#2E1065] dark:text-[#EDE9FE]">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold">Live GPS Fleet Tracking</span>
          <span className="text-[#DDD6FE] dark:text-[#4C288A]">|</span>
          <span className="text-[11px] text-[#581C87] dark:text-[#C4B5FD]">
            {buses.filter((b) => b.isTripActive).length} Vehicles Transmitting
          </span>
        </div>

        {/* Floating Map Utility Controls */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-white/95 dark:bg-[#281747]/95 backdrop-blur-md rounded-xl p-1 border border-[#E8E0D7] dark:border-[#4C288A] shadow-xs">
          <button
            onClick={() => setShowScheduleDeviationsOnly(!showScheduleDeviationsOnly)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              showScheduleDeviationsOnly
                ? 'bg-[#3B0764] text-white shadow-xs'
                : 'text-[#4C1D95] dark:text-[#C4B5FD] hover:bg-[#F3E8FF] dark:hover:bg-[#371E63]'
            }`}
            title="Highlight vehicles with schedule delays"
          >
            {showScheduleDeviationsOnly ? 'Showing Deviations' : 'All Schedules'}
          </button>

          <div className="h-4 w-px bg-[#E8E0D7] dark:bg-[#4C288A] mx-0.5" />

          <button
            onClick={() => handleZoom(0.25)}
            title="Zoom In"
            className="w-7 h-7 flex items-center justify-center text-[#3B0764] dark:text-[#EDE9FE] hover:bg-[#F3E8FF] dark:hover:bg-[#371E63] rounded-lg transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleZoom(-0.25)}
            title="Zoom Out"
            className="w-7 h-7 flex items-center justify-center text-[#3B0764] dark:text-[#EDE9FE] hover:bg-[#F3E8FF] dark:hover:bg-[#371E63] rounded-lg transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleReset}
            title="Reset Map Bounds"
            className="w-7 h-7 flex items-center justify-center text-[#3B0764] dark:text-[#EDE9FE] hover:bg-[#F3E8FF] dark:hover:bg-[#371E63] rounded-lg transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            title="Transit Lines"
            className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
              showLayerMenu
                ? 'bg-[#581C87] text-white'
                : 'text-[#3B0764] dark:text-[#EDE9FE] hover:bg-[#F3E8FF] dark:hover:bg-[#371E63]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Route Corridors Drawer */}
      {showLayerMenu && (
        <div className="absolute top-14 right-3 z-30 w-64 bg-white dark:bg-[#281747] rounded-xl shadow-xl border border-[#DDD6FE] dark:border-[#4C288A] p-3 text-xs">
          <div className="font-bold text-[#2E1065] dark:text-[#EDE9FE] mb-2 flex items-center justify-between">
            <span>Filter Route Corridors</span>
            <span className="text-[10px] text-[#7E22CE] dark:text-[#C4B5FD] font-normal">Active paths</span>
          </div>
          <div className="space-y-1.5">
            {routes.map((route) => (
              <label
                key={route.id}
                className="flex items-center gap-2 cursor-pointer hover:bg-[#FAF7F2] dark:hover:bg-[#371E63] p-1.5 rounded-lg transition-colors"
              >
                <input
                  type="checkbox"
                  checked={!!activeLayers[route.id]}
                  onChange={() => toggleRouteLayer(route.id)}
                  className="rounded text-[#581C87] focus:ring-[#7E22CE] h-3.5 w-3.5"
                />
                <span
                  className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: route.color }}
                />
                <div className="truncate">
                  <span className="font-bold text-[#2E1065] dark:text-[#EDE9FE]">{route.code}</span>
                  <span className="text-[#581C87] dark:text-[#C4B5FD] ml-1">{route.name}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Schedule Deviation & Legend Panel */}
      {!compact && (
        <div className="absolute bottom-3 left-3 z-20 flex flex-wrap items-center gap-3 bg-white/95 dark:bg-[#281747]/95 backdrop-blur-md rounded-xl px-3.5 py-2 border border-[#E8E0D7] dark:border-[#4C288A] text-xs text-[#4C1D95] dark:text-[#DDD6FE] shadow-sm">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>On-Time (&lt;2m dev)</span>
          </div>
          <span className="text-[#DDD6FE] dark:text-[#4C288A]">·</span>
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Schedule Delay (&gt;4m dev)</span>
          </div>
          <span className="text-[#DDD6FE] dark:text-[#4C288A]">·</span>
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span>Emergency SOS</span>
          </div>
          <span className="text-[#DDD6FE] dark:text-[#4C288A]">·</span>
          <span className="font-mono text-[11px] text-[#581C87] dark:text-[#C4B5FD]">
            Campus Coordinates: 17.050°N, 82.070°E
          </span>
        </div>
      )}

      {/* Main Vector SVG Map */}
      <svg
        className="w-full h-full"
        viewBox="0 0 1000 700"
        preserveAspectRatio="xMidYMid meet"
        style={{
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.15s ease-out',
        }}
      >
        <defs>
          {/* Subtle Warm Cream Grid */}
          <pattern id="campusGridWarm" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#EDE9FE"
              strokeWidth="0.8"
              strokeDasharray="2,2"
            />
          </pattern>

          {/* Deep Purple Glow */}
          <filter id="purpleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#2E1065" floodOpacity="0.25" />
          </filter>

          <linearGradient id="warmCampusZone" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#DDD6FE" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#F5EFEB" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Background Grid Pattern */}
        <rect width="1000" height="700" fill="url(#campusGridWarm)" />

        {/* University Main Campus Boundary */}
        <polygon
          points="460,280 620,290 640,430 500,450 440,360"
          fill="url(#warmCampusZone)"
          stroke="#C4B5FD"
          strokeWidth="1.5"
          strokeDasharray="4,4"
        />
        <text
          x="530"
          y="350"
          className="text-[12px] font-bold fill-[#3B0764] dark:fill-[#EDE9FE]"
          textAnchor="middle"
          letterSpacing="0.08em"
        >
          ADITYA UNIVERSITY CAMPUS
        </text>
        <text
          x="530"
          y="366"
          className="text-[9px] fill-[#7E22CE] dark:fill-[#C4B5FD]"
          textAnchor="middle"
        >
          CENTRAL ACADEMIC RING & TERMINAL
        </text>

        {/* Lotus Lake */}
        <path
          d="M 580 380 Q 610 370 630 395 T 610 430 Q 575 420 580 380 Z"
          fill="#DDD6FE"
          fillOpacity="0.7"
          stroke="#A855F7"
          strokeWidth="1"
        />
        <text x="605" y="405" className="text-[8px] fill-[#4C1D95] dark:fill-[#2E1065] font-semibold" textAnchor="middle">
          Lotus Lake
        </text>

        {/* Campus Stadium Oval */}
        <ellipse
          cx="480"
          cy="400"
          rx="24"
          ry="15"
          fill="#FAF7F2"
          stroke="#7E22CE"
          strokeWidth="1.2"
        />
        <text x="480" y="403" className="text-[7px] fill-[#581C87] font-bold" textAnchor="middle">
          Stadium
        </text>

        {/* Arterial Road Network */}
        <path
          d="M 40 220 C 260 210, 480 180, 960 160"
          fill="none"
          stroke="#E8E0D7"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M 40 220 C 260 210, 480 180, 960 160"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 540 40 L 540 660"
          fill="none"
          stroke="#E8E0D7"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M 540 40 L 540 660"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Draw Route Polylines */}
        {routes.map((route) => {
          if (!activeLayers[route.id]) return null;
          const isSelected = focusedRouteId === route.id || selectedRouteId === route.id;

          const pointsStr = route.polylineCoords
            .map((geo) => {
              const pt = projectGeoToSvg(geo);
              return `${pt.x},${pt.y}`;
            })
            .join(' ');

          return (
            <g key={route.id} className="transition-opacity">
              {/* Soft Lavender Halo */}
              <polyline
                points={pointsStr}
                fill="none"
                stroke={route.color}
                strokeWidth={isSelected ? 10 : 5}
                strokeOpacity={isSelected ? 0.35 : 0.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Core Route Path */}
              <polyline
                points={pointsStr}
                fill="none"
                stroke={route.color}
                strokeWidth={isSelected ? 3.5 : 2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          );
        })}

        {/* Draw Bus Stops with Scheduled ETA Tag */}
        {routes.map((route) => {
          if (!activeLayers[route.id]) return null;

          return (
            <g key={`stops-${route.id}`}>
              {route.stops.map((stop) => {
                const pt = projectGeoToSvg(stop.coords);
                const isHovered = hoveredStop?.stop.id === stop.id;

                return (
                  <g
                    key={stop.id}
                    className="cursor-pointer"
                    onMouseEnter={() => {
                      setHoveredStop({ stop, route, x: pt.x, y: pt.y });
                    }}
                    onMouseLeave={() => setHoveredStop(null)}
                    onClick={() => {
                      if (onSelectStop) onSelectStop(stop, route);
                      setSelectedRouteId(route.id);
                    }}
                  >
                    {/* Geofence circular trigger zone */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="16"
                      fill="#EDE9FE"
                      fillOpacity="0.3"
                      stroke={route.color}
                      strokeWidth="0.8"
                      strokeDasharray="2,2"
                    />

                    {/* Outer Pin */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 7 : 5}
                      fill="#FFFFFF"
                      stroke={route.color}
                      strokeWidth="2.5"
                      className="transition-all"
                    />

                    {/* Waiting Commuters Badge */}
                    {stop.studentsWaiting > 0 && (
                      <g transform={`translate(${pt.x + 6}, ${pt.y - 12})`}>
                        <rect
                          width="16"
                          height="12"
                          rx="3"
                          fill="#3B0764"
                          className="shadow-sm"
                        />
                        <text
                          x="8"
                          y="9"
                          fill="#FFFFFF"
                          fontSize="8"
                          fontWeight="700"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {stop.studentsWaiting}
                        </text>
                      </g>
                    )}

                    {/* Stop Label & Scheduled Time */}
                    <text
                      x={pt.x}
                      y={pt.y + 15}
                      fill="#3B0764"
                      fontSize="9"
                      fontWeight="600"
                      textAnchor="middle"
                      className="pointer-events-none"
                    >
                      {stop.name.length > 18 ? `${stop.name.substring(0, 16)}...` : stop.name}
                    </text>
                    <text
                      x={pt.x}
                      y={pt.y + 24}
                      fill="#7E22CE"
                      fontSize="7.5"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="pointer-events-none"
                    >
                      ETA {stop.scheduledTime}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Draw Live Moving Student Transport Vehicles */}
        {buses.map((bus) => {
          if (!activeLayers[bus.routeId]) return null;
          if (showScheduleDeviationsOnly && bus.delayMinutes <= 2 && bus.status !== 'sos') {
            return null;
          }

          const pt = projectGeoToSvg(bus.telemetry);
          const isSelected = bus.id === (focusedBusId || selectedBusId);
          const isSos = bus.status === 'sos';
          const isDelayed = bus.delayMinutes > 3;

          const busBodyColor = isSos
            ? '#E11D48'
            : isDelayed
            ? '#D97706'
            : bus.status === 'at-stop'
            ? '#7E22CE' // Deep purple/lavender accent
            : '#059669'; // Emerald

          return (
            <g
              key={bus.id}
              className="cursor-pointer transition-transform duration-300"
              onClick={() => {
                setSelectedBusId(bus.id);
                setSelectedRouteId(bus.routeId);
                if (onSelectBus) onSelectBus(bus.id);
              }}
              onMouseEnter={() => setHoveredBus(bus)}
              onMouseLeave={() => setHoveredBus(null)}
            >
              {/* Radar Pulse Animation */}
              {(isSelected || isSos || isDelayed) && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="24"
                  fill="none"
                  stroke={busBodyColor}
                  strokeWidth="2"
                  className={isSos ? 'animate-ping' : 'animate-pulse'}
                  opacity="0.6"
                />
              )}

              {/* Rotated Vehicle Body (Heading direction) */}
              <g
                transform={`translate(${pt.x}, ${pt.y}) rotate(${bus.telemetry.headingDeg})`}
                filter="url(#purpleGlow)"
              >
                {/* Bus chassis */}
                <rect
                  x="-13"
                  y="-8.5"
                  width="26"
                  height="17"
                  rx="4.5"
                  fill={busBodyColor}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
                {/* Windshield */}
                <rect x="7" y="-6.5" width="4" height="13" rx="1.5" fill="#FAF7F2" />
                {/* Windows */}
                <circle cx="-5" cy="-5" r="1.5" fill="#FFFFFF" fillOpacity="0.9" />
                <circle cx="1" cy="-5" r="1.5" fill="#FFFFFF" fillOpacity="0.9" />
                <circle cx="-5" cy="5" r="1.5" fill="#FFFFFF" fillOpacity="0.9" />
                <circle cx="1" cy="5" r="1.5" fill="#FFFFFF" fillOpacity="0.9" />
              </g>

              {/* Vehicle Floating Tag: Bus Number & Schedule Deviation Tag */}
              <g transform={`translate(${pt.x}, ${pt.y - 22})`}>
                <rect
                  x="-42"
                  y="-9"
                  width="84"
                  height="17"
                  rx="4"
                  fill="#2E1065"
                  stroke={isSelected ? '#C084FC' : '#4C1D95'}
                  strokeWidth={isSelected ? 1.5 : 1}
                  className="shadow-md"
                />
                <text
                  x="0"
                  y="3.5"
                  textAnchor="middle"
                  fontSize="8.5"
                  fontWeight="700"
                  fill="#EDE9FE"
                  fontFamily="monospace"
                >
                  {bus.busNumber} · {bus.delayMinutes > 3 ? `+${bus.delayMinutes}m` : 'On-Time'}
                </text>
              </g>

              {/* ETA Indicator Tag below bus */}
              <g transform={`translate(${pt.x}, ${pt.y + 19})`}>
                <rect
                  x="-32"
                  y="-6"
                  width="64"
                  height="12"
                  rx="3"
                  fill="#FAF7F2"
                  stroke="#DDD6FE"
                  strokeWidth="0.8"
                />
                <text
                  x="0"
                  y="3"
                  textAnchor="middle"
                  fontSize="7.5"
                  fontWeight="600"
                  fill="#581C87"
                  fontFamily="monospace"
                >
                  ETA {bus.etaToNextStopMin}m · {bus.telemetry.speedKmH}km/h
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* Floating Stop Tooltip */}
      {hoveredStop && (
        <div
          className="absolute z-30 pointer-events-none bg-[#2E1065] text-[#FAF7F2] rounded-xl p-3 shadow-2xl text-xs max-w-xs border border-[#4C288A]"
          style={{
            left: `${Math.min(window.innerWidth - 260, (hoveredStop.x / 1000) * (containerRef.current?.clientWidth || 600) + 12)}px`,
            top: `${Math.max(10, (hoveredStop.y / 700) * (containerRef.current?.clientHeight || 400) - 75)}px`,
          }}
        >
          <div className="font-bold text-white flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#C084FC]" />
            <span>{hoveredStop.stop.name}</span>
          </div>
          <div className="text-[11px] text-[#DDD6FE] mt-0.5">{hoveredStop.stop.landmark}</div>
          <div className="flex items-center gap-3 mt-2 pt-2 border-t border-[#4C288A] text-[11px]">
            <div className="flex items-center gap-1 text-[#EDE9FE]">
              <Clock className="w-3 h-3 text-[#A855F7]" />
              <span>Scheduled: {hoveredStop.stop.scheduledTime}</span>
            </div>
            <div className="flex items-center gap-1 text-[#EDE9FE]">
              <Users className="w-3 h-3 text-amber-400" />
              <span>{hoveredStop.stop.studentsWaiting} students</span>
            </div>
          </div>
        </div>
      )}

      {/* Focused Bus Quick Telemetry Overlay (Top Left) */}
      {activeFocusBus && !compact && (
        <div className="absolute top-14 left-3 z-20 bg-white/95 dark:bg-[#281747]/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-[#DDD6FE] dark:border-[#4C288A] text-xs w-72">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] font-bold text-[#7E22CE] dark:text-[#C084FC] uppercase tracking-wide">
                {activeFocusRoute?.code} · {activeFocusRoute?.name}
              </div>
              <h4 className="font-extrabold text-sm text-[#2E1065] dark:text-[#FAF7F2] mt-0.5">
                {activeFocusBus.busNumber} ({activeFocusBus.plateNumber})
              </h4>
            </div>
            <span
              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg ${
                activeFocusBus.status === 'sos'
                  ? 'bg-rose-500 text-white animate-pulse'
                  : activeFocusBus.delayMinutes > 3
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}
            >
              {activeFocusBus.delayMinutes > 3 ? `+${activeFocusBus.delayMinutes}m Deviation` : 'On Schedule'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#EDE9FE] dark:border-[#3D2668] text-center">
            <div>
              <div className="text-[10px] text-slate-500">Live Speed</div>
              <div className="font-bold text-[#2E1065] dark:text-[#FAF7F2] font-mono">
                {activeFocusBus.telemetry.speedKmH} <span className="text-[9px] font-normal">km/h</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500">Occupancy</div>
              <div className="font-bold text-[#2E1065] dark:text-[#FAF7F2] font-mono">
                {activeFocusBus.passengersOnboard}/{activeFocusBus.capacity}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500">Next ETA</div>
              <div className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                ~{activeFocusBus.etaToNextStopMin} <span className="text-[9px] font-normal">min</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-[#EDE9FE] dark:border-[#3D2668] flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Next Stop:</span>
            <span className="font-bold text-[#3B0764] dark:text-[#EDE9FE] truncate max-w-[150px]">
              {activeFocusRoute?.stops[activeFocusBus.currentStopIndex]?.name || 'Next Waypoint'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
