import React, { useState, useEffect } from 'react';
import { useTransit, AppViewMode } from '../../context/TransitContext';
import {
  Bus,
  Shield,
  Smartphone,
  Gauge,
  Columns2,
  Play,
  Pause,
  Sun,
  Moon,
  AlertOctagon,
  RefreshCw,
  Radio,
} from 'lucide-react';

export const HeaderNav: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    isSimulating,
    toggleSimulation,
    simulationSpeed,
    setSimulationSpeed,
    buses,
    resetSimulation,
  } = useTransit();

  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const sosBus = buses.find((b) => b.status === 'sos');

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F2]/95 dark:bg-[#1E1235]/95 backdrop-blur-md border-b border-[#E8E0D7] dark:border-[#3D2668] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#3B0764] dark:bg-[#7E22CE] flex items-center justify-center text-[#EDE9FE] shadow-sm shadow-purple-900/20">
            <Bus className="w-5 h-5 text-[#FAF7F2]" />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-[#2E1065] dark:text-[#F5F3FF] flex items-center gap-2">
              <span>CampusTrack</span>
              <span className="text-[10px] font-bold text-[#581C87] dark:text-[#C4B5FD] bg-[#EDE9FE] dark:bg-[#281747] px-2 py-0.5 rounded-full border border-[#DDD6FE] dark:border-[#4C288A]">
                TRANSIT COMMAND
              </span>
            </div>
            <div className="text-[11px] text-[#7E22CE] dark:text-[#DDD6FE] font-medium hidden sm:block">
              Aditya University Fleet & Commuter Portal
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Persona Switcher */}
        <nav className="flex items-center gap-1 p-1 bg-[#F5EFEB] dark:bg-[#281747] rounded-xl border border-[#E8E0D7] dark:border-[#3D2668]">
          <button
            onClick={() => setViewMode('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              viewMode === 'admin'
                ? 'bg-[#3B0764] text-white shadow-sm'
                : 'text-[#4C1D95] dark:text-[#C4B5FD] hover:text-[#2E1065] dark:hover:text-white hover:bg-white/60 dark:hover:bg-[#371E63]'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-[#C4B5FD]" />
            <span>Admin Dashboard</span>
          </button>

          <button
            onClick={() => setViewMode('student')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              viewMode === 'student'
                ? 'bg-[#3B0764] text-white shadow-sm'
                : 'text-[#4C1D95] dark:text-[#C4B5FD] hover:text-[#2E1065] dark:hover:text-white hover:bg-white/60 dark:hover:bg-[#371E63]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-[#A855F7]" />
            <span>Student App</span>
          </button>

          <button
            onClick={() => setViewMode('driver')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              viewMode === 'driver'
                ? 'bg-[#3B0764] text-white shadow-sm'
                : 'text-[#4C1D95] dark:text-[#C4B5FD] hover:text-[#2E1065] dark:hover:text-white hover:bg-white/60 dark:hover:bg-[#371E63]'
            }`}
          >
            <Gauge className="w-3.5 h-3.5 text-amber-500" />
            <span>Driver Console</span>
          </button>

          <button
            onClick={() => setViewMode('split')}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              viewMode === 'split'
                ? 'bg-[#3B0764] text-white shadow-sm'
                : 'text-[#4C1D95] dark:text-[#C4B5FD] hover:text-[#2E1065] dark:hover:text-white hover:bg-white/60 dark:hover:bg-[#371E63]'
            }`}
            title="View Driver, Student & Admin simultaneously to test real-time synchronization"
          >
            <Columns2 className="w-3.5 h-3.5 text-[#9333EA]" />
            <span>Live Sync Triple View</span>
          </button>
        </nav>

        {/* Zone 3: Live Simulator & Theme */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Active SOS Warning Alert */}
          {sosBus && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-100 dark:bg-rose-950 border border-rose-300 dark:border-rose-800 rounded-lg text-rose-800 dark:text-rose-200 text-xs font-bold animate-pulse">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">SOS: {sosBus.busNumber}</span>
            </div>
          )}

          {/* GPS Real-Time Engine Toggles */}
          <div className="flex items-center gap-1 bg-[#F5EFEB] dark:bg-[#281747] p-1 rounded-xl border border-[#E8E0D7] dark:border-[#3D2668]">
            <button
              onClick={toggleSimulation}
              className={`p-1.5 rounded-lg transition-colors ${
                isSimulating
                  ? 'text-emerald-700 dark:text-emerald-400 hover:bg-white dark:hover:bg-[#371E63]'
                  : 'text-amber-700 dark:text-amber-400 hover:bg-white dark:hover:bg-[#371E63]'
              }`}
              title={isSimulating ? 'Pause GPS Simulation' : 'Resume GPS Simulation'}
            >
              {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => {
                const nextSpeed = simulationSpeed === 1 ? 2 : simulationSpeed === 2 ? 4 : 1;
                setSimulationSpeed(nextSpeed);
              }}
              className="px-1.5 py-0.5 text-[11px] font-mono font-bold text-[#3B0764] dark:text-[#EDE9FE] hover:bg-white dark:hover:bg-[#371E63] rounded-md transition-colors"
              title="Simulation speed multiplier"
            >
              {simulationSpeed}x
            </button>

            <button
              onClick={resetSimulation}
              className="p-1.5 text-slate-500 hover:text-[#2E1065] dark:hover:text-[#EDE9FE] hover:bg-white dark:hover:bg-[#371E63] rounded-lg transition-colors"
              title="Reset fleet positions to origins"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="w-8 h-8 flex items-center justify-center text-[#3B0764] dark:text-[#EDE9FE] hover:bg-[#F5EFEB] dark:hover:bg-[#281747] rounded-xl border border-[#E8E0D7] dark:border-[#3D2668] transition-colors"
            title="Toggle Light / Dark Mode"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#581C87]" />}
          </button>
        </div>
      </div>
    </header>
  );
};
