import React, { useState, useEffect } from 'react';
import { useTransit } from '../../context/TransitContext';
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
  ChevronDown,
  Layers,
  Search,
  Bell,
  Grid,
} from 'lucide-react';

export const AdminWebsiteHeader: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    isSimulating,
    toggleSimulation,
    simulationSpeed,
    setSimulationSpeed,
    buses,
    resetSimulation,
    alerts,
  } = useTransit();

  const [isDark, setIsDark] = useState<boolean>(false);
  const [appSwitcherOpen, setAppSwitcherOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const sosBus = buses.find((b) => b.status === 'sos');
  const criticalAlerts = alerts.filter((a) => a.severity === 'critical');

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F2]/95 dark:bg-[#1E1235]/95 backdrop-blur-md border-b border-[#E8E0D7] dark:border-[#3D2668] transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand & Website Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#3B0764] dark:bg-[#7E22CE] flex items-center justify-center text-[#EDE9FE] shadow-sm shadow-purple-900/20">
            <Bus className="w-5 h-5 text-[#FAF7F2]" />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-[#2E1065] dark:text-[#F5F3FF] flex items-center gap-2">
              <span>CampusTrack</span>
              <span className="text-[10px] font-bold text-[#581C87] dark:text-[#C4B5FD] bg-[#EDE9FE] dark:bg-[#281747] px-2 py-0.5 rounded-full border border-[#DDD6FE] dark:border-[#4C288A]">
                ADMIN WEBSITE
              </span>
            </div>
            <div className="text-[11px] text-[#7E22CE] dark:text-[#DDD6FE] font-medium hidden sm:block">
              Aditya University Fleet & Commuter Portal
            </div>
          </div>
        </div>

        {/* Center: System Status & Quick App Launch Dropdown */}
        <div className="flex items-center gap-2">
          {/* App Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setAppSwitcherOpen(!appSwitcherOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#281747] hover:bg-[#F5EFEB] text-[#2E1065] dark:text-[#FAF7F2] border border-[#DDD6FE] dark:border-[#4C288A] rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Layers className="w-3.5 h-3.5 text-[#7E22CE]" />
              <span className="hidden sm:inline">Launch App:</span>
              <span className="text-[#581C87] dark:text-[#C4B5FD]">
                {viewMode === 'admin' ? 'Admin Website' : viewMode === 'portal' ? 'Portal Directory' : 'Triple Sync'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {appSwitcherOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-[#1E1235] rounded-2xl border border-[#DDD6FE] dark:border-[#4C288A] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">
                  Separate Transit Applications
                </div>

                <button
                  onClick={() => {
                    setViewMode('admin');
                    setAppSwitcherOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors ${
                    viewMode === 'admin'
                      ? 'bg-[#EDE9FE] text-[#2E1065] dark:bg-[#3D2668] dark:text-[#FAF7F2]'
                      : 'hover:bg-[#FAF7F2] dark:hover:bg-[#281747] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Shield className="w-4 h-4 text-[#7E22CE]" />
                  <div>
                    <div className="leading-tight">Admin Operations Website</div>
                    <div className="text-[10px] font-normal text-slate-400">Desktop dispatch center</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setViewMode('student');
                    setAppSwitcherOpen(false);
                  }}
                  className="w-full text-left p-2 rounded-xl text-xs font-bold flex items-center gap-2.5 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="leading-tight">Student Mobile App</div>
                    <div className="text-[10px] font-normal text-slate-400">Smartphone tracking & pass</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setViewMode('driver');
                    setAppSwitcherOpen(false);
                  }}
                  className="w-full text-left p-2 rounded-xl text-xs font-bold flex items-center gap-2.5 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <Gauge className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="leading-tight">Driver In-Cab Console</div>
                    <div className="text-[10px] font-normal text-slate-400">Bus tablet terminal HUD</div>
                  </div>
                </button>

                <div className="my-1 border-t border-[#E8E0D7] dark:border-[#3D2668]" />

                <button
                  onClick={() => {
                    setViewMode('split');
                    setAppSwitcherOpen(false);
                  }}
                  className="w-full text-left p-2 rounded-xl text-xs font-bold flex items-center gap-2.5 hover:bg-[#FAF7F2] dark:hover:bg-[#281747] text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <Columns2 className="w-4 h-4 text-[#9333EA]" />
                  <div>
                    <div className="leading-tight">Triple Live Sync View</div>
                    <div className="text-[10px] font-normal text-slate-400">3 apps side-by-side</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setViewMode('portal');
                    setAppSwitcherOpen(false);
                  }}
                  className="w-full text-left p-2 rounded-xl text-xs font-bold flex items-center gap-2.5 hover:bg-[#FAF7F2] dark:hover:bg-[#281747] text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <Grid className="w-4 h-4 text-slate-500" />
                  <div>
                    <div className="leading-tight">Transit Suite Hub</div>
                    <div className="text-[10px] font-normal text-slate-400">All systems landing page</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: GPS Engine, Theme & Admin Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
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

          {/* Admin User Profile Chip */}
          <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-[#E8E0D7] dark:border-[#3D2668]">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Admin"
              className="w-8 h-8 rounded-xl object-cover border border-[#DDD6FE]"
            />
            <div className="text-left">
              <div className="text-xs font-extrabold text-[#2E1065] dark:text-[#FAF7F2] leading-tight">
                Officer R. Varma
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold leading-tight flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                <span>Dispatch Lead</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
