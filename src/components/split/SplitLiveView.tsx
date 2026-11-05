import React from 'react';
import { useTransit } from '../../context/TransitContext';
import { DriverApp } from '../driver/DriverApp';
import { StudentApp } from '../student/StudentApp';
import { AdminDashboard } from '../admin/AdminDashboard';
import { LiveTransitMap } from '../map/LiveTransitMap';
import {
  Columns2,
  Gauge,
  Smartphone,
  Shield,
  Radio,
  ArrowRight,
  Info,
  Sparkles,
} from 'lucide-react';

export const SplitLiveView: React.FC = () => {
  const { buses, selectedBusId, selectedRouteId } = useTransit();
  const bus = buses.find((b) => b.id === selectedBusId) || buses[0];

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-5 space-y-4">
      {/* Synchronization Explanation Banner */}
      <div className="bg-gradient-to-r from-[#2E1065] via-[#4C1D95] to-[#581C87] text-white rounded-2xl p-4 shadow-sm border border-[#7E22CE] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EDE9FE]/20 flex items-center justify-center text-[#EDE9FE] shrink-0">
            <Radio className="w-5 h-5 animate-pulse text-[#C084FC]" />
          </div>
          <div>
            <div className="font-extrabold text-sm flex items-center gap-2 text-white">
              <span>Simultaneous Multi-Screen Real-Time Sync</span>
              <span className="text-[10px] font-bold bg-[#C084FC]/30 text-[#EDE9FE] px-2 py-0.5 rounded-full border border-[#C084FC]/40">
                LIVE INTERCONNECTED ENGINE
              </span>
            </div>
            <p className="text-xs text-[#DDD6FE] mt-0.5">
              Interact with the Driver Console (left) or Student App (middle); notice the Admin Real-Time Fleet Map (right) reflects GPS coordinates, delay deviations, and stop ETAs instantly.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-black/25 px-3 py-1.5 rounded-xl border border-white/10 shrink-0">
          <span className="text-[#C084FC]">Active Unit:</span>
          <span className="font-bold text-white">{bus.busNumber}</span>
          <span className="text-slate-400">·</span>
          <span className="text-emerald-300">{bus.telemetry.speedKmH} km/h</span>
        </div>
      </div>

      {/* 3-Column Simultaneous Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Column 1: Driver Console (3.5 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#1E1235] rounded-2xl border border-[#E8E0D7] dark:border-[#3D2668] shadow-xs overflow-hidden">
          <div className="bg-[#FAF7F2] dark:bg-[#281747] px-4 py-3 border-b border-[#E8E0D7] dark:border-[#3D2668] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2E1065] dark:text-[#FAF7F2]">
              <Gauge className="w-4 h-4 text-amber-500" />
              <span>1. Driver Cockpit HUD</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">In-Cab Mount</span>
          </div>
          <div className="p-3 max-h-[820px] overflow-y-auto">
            <DriverApp />
          </div>
        </div>

        {/* Column 2: Student Mobile App (3.5 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#1E1235] rounded-2xl border border-[#E8E0D7] dark:border-[#3D2668] shadow-xs overflow-hidden">
          <div className="bg-[#FAF7F2] dark:bg-[#281747] px-4 py-3 border-b border-[#E8E0D7] dark:border-[#3D2668] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2E1065] dark:text-[#FAF7F2]">
              <Smartphone className="w-4 h-4 text-[#7E22CE]" />
              <span>2. Student Mobile App</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Student Device</span>
          </div>
          <div className="p-3 max-h-[820px] overflow-y-auto flex justify-center">
            <StudentApp forceFrame={true} />
          </div>
        </div>

        {/* Column 3: Admin Real-Time Fleet Map & Schedule Deviations (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#1E1235] rounded-2xl border border-[#E8E0D7] dark:border-[#3D2668] shadow-xs overflow-hidden">
          <div className="bg-[#FAF7F2] dark:bg-[#281747] px-4 py-3 border-b border-[#E8E0D7] dark:border-[#3D2668] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2E1065] dark:text-[#FAF7F2]">
              <Shield className="w-4 h-4 text-[#581C87]" />
              <span>3. Admin Real-Time Fleet Map</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Dispatch Terminal</span>
          </div>
          <div className="p-4 space-y-4 max-h-[820px] overflow-y-auto">
            <LiveTransitMap height="h-[360px]" compact={false} />

            {/* Quick Fleet Deviation List */}
            <div className="space-y-2 pt-2 border-t border-[#E8E0D7] dark:border-[#3D2668]">
              <div className="text-xs font-bold text-[#2E1065] dark:text-[#FAF7F2] uppercase tracking-wider">
                Vehicle Schedule Deviations
              </div>
              {buses.map((b) => (
                <div
                  key={b.id}
                  className="p-2.5 rounded-xl border border-[#E8E0D7] dark:border-[#3D2668] bg-[#FAF7F2] dark:bg-[#281747] flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-[#2E1065] dark:text-[#FAF7F2]">
                      {b.busNumber} ({b.plateNumber})
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Speed: {b.telemetry.speedKmH} km/h · ETA Next: {b.etaToNextStopMin}m
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                      b.delayMinutes > 3
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}
                  >
                    {b.delayMinutes > 3 ? `+${b.delayMinutes}m Deviation` : 'On Time'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
