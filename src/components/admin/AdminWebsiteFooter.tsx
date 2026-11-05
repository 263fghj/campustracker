import React from 'react';
import { Bus, Radio, Shield, Phone, Mail, Clock, MapPin, Heart } from 'lucide-react';

export const AdminWebsiteFooter: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-[#E8E0D7] dark:border-[#3D2668] bg-[#F5EFEB] dark:bg-[#1A0F2E] text-slate-600 dark:text-slate-300 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Institutional Authority */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#3B0764] flex items-center justify-center text-white">
                <Bus className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-[#2E1065] dark:text-[#FAF7F2] text-sm">
                CampusTrack Operations
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Official transportation authority of Aditya University. Managing high-frequency student commuter corridors and campus fleet security.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-bold">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Real-Time Differential GPS Online</span>
            </div>
          </div>

          {/* Col 2: Emergency & Dispatch Lines */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-bold text-[#2E1065] dark:text-[#FAF7F2] uppercase tracking-wider text-[11px]">
              24/7 Control Room & Helpline
            </h4>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Phone className="w-3.5 h-3.5 text-[#7E22CE]" />
              <span>Transit Dispatch: (08852) 252000</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Phone className="w-3.5 h-3.5 text-rose-600" />
              <span>Campus SOS Hotline: +91 99887 76655</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Mail className="w-3.5 h-3.5 text-[#7E22CE]" />
              <span>transport@adityauniversity.in</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5 text-[#7E22CE]" />
              <span>Operations: 06:30 AM – 09:30 PM</span>
            </div>
          </div>

          {/* Col 3: Operational Links */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-[#2E1065] dark:text-[#FAF7F2] uppercase tracking-wider text-[11px]">
              Fleet & Route Portals
            </h4>
            <ul className="space-y-1.5 text-slate-500 dark:text-slate-400">
              <li>
                <a href="#admin" className="hover:text-[#581C87] dark:hover:text-[#C4B5FD] transition-colors">
                  Live Real-Time Fleet Map
                </a>
              </li>
              <li>
                <a href="#admin" className="hover:text-[#581C87] dark:hover:text-[#C4B5FD] transition-colors">
                  Schedule Deviations & Punctuality
                </a>
              </li>
              <li>
                <a href="#admin" className="hover:text-[#581C87] dark:hover:text-[#C4B5FD] transition-colors">
                  Student Bus Pass Directory
                </a>
              </li>
              <li>
                <a href="#admin" className="hover:text-[#581C87] dark:hover:text-[#C4B5FD] transition-colors">
                  Driver Duty Rosters & Vehicles
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Safety & Guidelines */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-[#2E1065] dark:text-[#FAF7F2] uppercase tracking-wider text-[11px]">
              Transit Compliance
            </h4>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              All vehicles equipped with certified GPS speed limiters (45 km/h max campus corridor). Automated geofenced passenger logging enabled.
            </p>
            <div className="pt-2 flex items-center gap-2">
              <span className="text-[10px] bg-[#EDE9FE] dark:bg-[#281747] text-[#581C87] dark:text-[#C4B5FD] font-mono px-2 py-0.5 rounded border border-[#DDD6FE] dark:border-[#4C288A]">
                Theme: Warm Cream & Deep Purple
              </span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#E8E0D7] dark:border-[#3D2668] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            © 2026 Aditya University Transportation Authority. All Rights Reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#portal" className="hover:underline">Suite Hub</a>
            <span>·</span>
            <a href="#student" className="hover:underline">Student App</a>
            <span>·</span>
            <a href="#driver" className="hover:underline">Driver Console</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
