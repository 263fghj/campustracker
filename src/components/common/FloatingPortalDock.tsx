import React, { useState } from 'react';
import { useTransit, AppViewMode } from '../../context/TransitContext';
import {
  Shield,
  Smartphone,
  Gauge,
  Columns2,
  Grid,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Layers,
  Sparkles,
  Radio,
  X,
} from 'lucide-react';

export const FloatingPortalDock: React.FC = () => {
  const { viewMode, setViewMode, buses } = useTransit();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const activeSos = buses.find((b) => b.status === 'sos');

  const apps = [
    {
      id: 'admin' as AppViewMode,
      name: 'Admin Website',
      type: 'Desktop Web Portal',
      description: 'Fleet command, live vector map, route editor & roster',
      icon: Shield,
      badge: 'Website',
      color: 'bg-[#3B0764] text-white',
      badgeColor: 'bg-[#EDE9FE] text-[#581C87] dark:bg-[#3D2668] dark:text-[#C4B5FD]',
    },
    {
      id: 'student' as AppViewMode,
      name: 'Student App',
      type: 'Mobile Smartphone',
      description: 'Live bus ETA, stop timeline & digital QR pass',
      icon: Smartphone,
      badge: 'Mobile App',
      color: 'bg-blue-600 text-white',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    },
    {
      id: 'driver' as AppViewMode,
      name: 'Driver Console',
      type: 'In-Cab Tablet HUD',
      description: 'Speedometer HUD, stop arrivals, passenger count & SOS',
      icon: Gauge,
      badge: 'Terminal HUD',
      color: 'bg-amber-600 text-white',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    },
    {
      id: 'split' as AppViewMode,
      name: 'Triple Live Sync',
      type: 'Multi-Screen View',
      description: 'Watch Driver, Student & Admin update concurrently',
      icon: Columns2,
      badge: 'Live Sync',
      color: 'bg-[#7E22CE] text-white',
      badgeColor: 'bg-[#FAF7F2] text-[#2E1065] dark:bg-[#281747] dark:text-[#FAF7F2]',
    },
    {
      id: 'portal' as AppViewMode,
      name: 'Transit Suite Hub',
      type: 'Portal Directory',
      description: 'Overview launcher with separate access to all systems',
      icon: Grid,
      badge: 'Portal Hub',
      color: 'bg-slate-700 text-white',
      badgeColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
    },
  ];

  const currentApp = apps.find((a) => a.id === viewMode) || apps[0];
  const CurrentIcon = currentApp.icon;

  return (
    <aside aria-label="Portal Navigation" className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Expanded App Switcher Menu */}
      {isOpen && (
        <div className="mb-3 w-80 bg-white dark:bg-[#1E1235] rounded-2xl border border-[#DDD6FE] dark:border-[#4C288A] shadow-2xl p-3.5 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-[#E8E0D7] dark:border-[#3D2668]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#3B0764] flex items-center justify-center text-white">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <span className="font-extrabold text-xs text-[#2E1065] dark:text-[#FAF7F2]">
                CampusTrack Application Suite
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-[11px] text-slate-500 mb-2 px-1">
            Switch between the distinct systems:
          </div>

          <div className="space-y-1.5">
            {apps.map((app) => {
              const Icon = app.icon;
              const isActive = viewMode === app.id;

              return (
                <button
                  key={app.id}
                  onClick={() => {
                    setViewMode(app.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-[#FAF7F2] dark:bg-[#281747] border-[#7E22CE] dark:border-[#A855F7] ring-1 ring-[#7E22CE]/30'
                      : 'bg-white/60 dark:bg-[#1E1235]/60 hover:bg-[#FAF7F2] dark:hover:bg-[#281747] border-transparent hover:border-[#DDD6FE]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${app.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-[#2E1065] dark:text-[#FAF7F2]">
                          {app.name}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ${app.badgeColor}`}>
                          {app.badge}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 line-clamp-1">
                        {app.description}
                      </div>
                    </div>
                  </div>

                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {activeSos && (
            <div className="mt-2.5 p-2 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 rounded-xl text-[11px] text-rose-800 dark:text-rose-200 flex items-center gap-1.5 font-bold">
              <Radio className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span>SOS Active: Bus {activeSos.busNumber}</span>
            </div>
          )}
        </div>
      )}

      {/* Pill Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2.5 bg-[#2E1065] hover:bg-[#3B0764] text-white rounded-2xl shadow-xl shadow-purple-950/30 border border-[#4C288A] transition-all hover:scale-[1.02] active:scale-[0.98] group"
        title="Switch between Admin Website, Student App, and Driver Console"
      >
        <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
          <CurrentIcon className="w-3.5 h-3.5 text-white" />
        </div>

        <div className="text-left hidden sm:block">
          <div className="text-[10px] text-[#DDD6FE] leading-tight font-medium">
            Active Application:
          </div>
          <div className="text-xs font-bold text-white leading-tight flex items-center gap-1">
            <span>{currentApp.name}</span>
            <span className="text-[10px] bg-white/20 text-[#FAF7F2] px-1.5 rounded-full font-mono">
              {currentApp.badge}
            </span>
          </div>
        </div>

        <div className="pl-1 border-l border-white/20 text-[#DDD6FE] group-hover:text-white">
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </div>
      </button>
    </aside>
  );
};
