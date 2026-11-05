import React from 'react';
import { useTransit } from '../../context/TransitContext';
import {
  Shield,
  Smartphone,
  Gauge,
  Columns2,
  Bus,
  MapPin,
  ArrowRight,
  Radio,
  CheckCircle2,
  Clock,
  QrCode,
  Users,
  Compass,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

export const TransitPortalLanding: React.FC = () => {
  const { setViewMode, buses, routes, students, drivers } = useTransit();

  const totalPassengers = buses.reduce((acc, b) => acc + b.passengersOnboard, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDE9FE] dark:bg-[#281747] border border-[#DDD6FE] dark:border-[#4C288A] text-xs font-bold text-[#581C87] dark:text-[#C4B5FD]">
          <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>Aditya University Transportation Network · Live Production System</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-[#2E1065] dark:text-[#FAF7F2] tracking-tight">
          Three Dedicated Systems. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7E22CE] via-[#9333EA] to-[#C084FC]">
            One Synchronized Fleet.
          </span>
        </h1>

        <p className="text-base text-slate-600 dark:text-slate-300 font-medium">
          Choose which application you want to launch. Each system is custom-built for its target device and user role with real-time GPS telemetry synchronization.
        </p>
      </div>

      {/* Main 3 Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* App 1: Admin Dashboard Website */}
        <div className="group relative bg-white dark:bg-[#1E1235] rounded-3xl p-7 border-2 border-[#DDD6FE] dark:border-[#4C288A] hover:border-[#7E22CE] dark:hover:border-[#A855F7] shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#3B0764] text-white flex items-center justify-center shadow-md shadow-purple-900/30">
                <Shield className="w-6 h-6 text-[#EDE9FE]" />
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#EDE9FE] dark:bg-[#281747] text-[#581C87] dark:text-[#C4B5FD] uppercase tracking-wider border border-[#DDD6FE] dark:border-[#4C288A]">
                Desktop Website
              </span>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#2E1065] dark:text-[#FAF7F2]">
                Admin Operations Website
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Full-featured operations center for dispatchers, route planners, and fleet directors.
              </p>
            </div>

            <div className="pt-2 space-y-2 border-t border-[#E8E0D7] dark:border-[#3D2668]">
              <div className="text-[11px] font-bold text-[#7E22CE] uppercase tracking-wider">
                Key Website Features:
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Interactive Real-Time Vector Route Map</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Schedule Deviation Variance (+6m Delays)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Route & Waypoint Stop Creation & Deletion</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Driver & Student Bus Assignment & Removal</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Student Digital Pass Directory & Verification</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[#E8E0D7] dark:border-[#3D2668]">
            <button
              onClick={() => setViewMode('admin')}
              className="w-full py-3 px-4 bg-[#3B0764] hover:bg-[#2E1065] text-white font-bold text-sm rounded-2xl shadow-lg shadow-purple-950/20 transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02]"
            >
              <span>Launch Admin Website</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <div className="text-center text-[11px] text-slate-400 mt-2 font-mono">
              Direct Route: #admin
            </div>
          </div>
        </div>

        {/* App 2: Student Commuter Mobile App */}
        <div className="group relative bg-white dark:bg-[#1E1235] rounded-3xl p-7 border-2 border-[#DDD6FE] dark:border-[#4C288A] hover:border-blue-500 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-900/30">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 uppercase tracking-wider border border-blue-200 dark:border-blue-800">
                Mobile Smartphone App
              </span>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#2E1065] dark:text-[#FAF7F2]">
                Student Commuter App
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Mobile companion for Aditya University students to track their assigned bus in real-time.
              </p>
            </div>

            <div className="pt-2 space-y-2 border-t border-[#E8E0D7] dark:border-[#3D2668]">
              <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                Key Mobile Features:
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Real-Time GPS Bus ETA Countdown Timer</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Live Pickup Stop Timeline & Proximity Radar</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Digital Holographic QR Transport Pass</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Direct Driver Phone Contact & Rating</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Smartphone Device Mockup or Full Viewport</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[#E8E0D7] dark:border-[#3D2668]">
            <button
              onClick={() => setViewMode('student')}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02]"
            >
              <span>Launch Student App</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <div className="text-center text-[11px] text-slate-400 mt-2 font-mono">
              Direct Route: #student
            </div>
          </div>
        </div>

        {/* App 3: Driver In-Cab Console */}
        <div className="group relative bg-white dark:bg-[#1E1235] rounded-3xl p-7 border-2 border-[#DDD6FE] dark:border-[#4C288A] hover:border-amber-500 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-900/30">
                <Gauge className="w-6 h-6 text-white" />
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 uppercase tracking-wider border border-amber-200 dark:border-amber-800">
                In-Cab Tablet HUD
              </span>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#2E1065] dark:text-[#FAF7F2]">
                Driver In-Cab Console
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Rugged cockpit terminal mounted on bus dashboards with high-contrast driver controls.
              </p>
            </div>

            <div className="pt-2 space-y-2 border-t border-[#E8E0D7] dark:border-[#3D2668]">
              <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                Key Driver Terminal Features:
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Large Digital Speedometer & 45km/h Warning</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Next Stop Arrived / Depart Touch Action</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Tactile Passenger Counter (+ / - Boarding)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Optical Camera QR Pass Reader Simulator</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>One-Tap SOS Emergency Dispatch Beacon</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[#E8E0D7] dark:border-[#3D2668]">
            <button
              onClick={() => setViewMode('driver')}
              className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-amber-900/20 transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02]"
            >
              <span>Launch Driver Console</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <div className="text-center text-[11px] text-slate-400 mt-2 font-mono">
              Direct Route: #driver
            </div>
          </div>
        </div>
      </div>

      {/* Triple Live Sync Banner */}
      <div className="bg-gradient-to-r from-[#2E1065] via-[#4C1D95] to-[#7E22CE] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#EDE9FE]">
            <Columns2 className="w-3.5 h-3.5 text-[#C4B5FD]" />
            <span>Developer & Testing Mode</span>
          </div>
          <h3 className="text-2xl font-black">
            Want to see all 3 systems synchronized side-by-side?
          </h3>
          <p className="text-xs text-[#DDD6FE] leading-relaxed">
            Launch the Triple Live Sync View to see the Driver Console in-cab action directly update the Student App and the Admin Dashboard Map in real time!
          </p>
        </div>

        <button
          onClick={() => setViewMode('split')}
          className="px-6 py-3.5 bg-white text-[#2E1065] hover:bg-[#FAF7F2] font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-transform hover:scale-105 shrink-0 flex items-center gap-2"
        >
          <span>Open Triple Live Sync</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Real-Time Fleet Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#E8E0D7] dark:border-[#3D2668]">
        <div className="p-4 bg-white dark:bg-[#1E1235] rounded-2xl border border-[#E8E0D7] dark:border-[#3D2668] text-center">
          <div className="text-2xl font-black font-mono text-[#2E1065] dark:text-[#FAF7F2]">
            {buses.length} Active
          </div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">Campus Transit Buses</div>
        </div>

        <div className="p-4 bg-white dark:bg-[#1E1235] rounded-2xl border border-[#E8E0D7] dark:border-[#3D2668] text-center">
          <div className="text-2xl font-black font-mono text-[#2E1065] dark:text-[#FAF7F2]">
            {routes.length} Corridors
          </div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">High-Frequency Routes</div>
        </div>

        <div className="p-4 bg-white dark:bg-[#1E1235] rounded-2xl border border-[#E8E0D7] dark:border-[#3D2668] text-center">
          <div className="text-2xl font-black font-mono text-[#2E1065] dark:text-[#FAF7F2]">
            {totalPassengers} / 200
          </div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">Onboard Commuters</div>
        </div>

        <div className="p-4 bg-white dark:bg-[#1E1235] rounded-2xl border border-[#E8E0D7] dark:border-[#3D2668] text-center">
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            99.8% Online
          </div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">Telemetry GPS Uptime</div>
        </div>
      </div>
    </div>
  );
};
