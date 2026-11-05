/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TransitProvider, useTransit } from './context/TransitContext';
import { AdminWebsiteHeader } from './components/admin/AdminWebsiteHeader';
import { AdminWebsiteFooter } from './components/admin/AdminWebsiteFooter';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentApp } from './components/student/StudentApp';
import { DriverApp } from './components/driver/DriverApp';
import { SplitLiveView } from './components/split/SplitLiveView';
import { TransitPortalLanding } from './components/portal/TransitPortalLanding';
import { FloatingPortalDock } from './components/common/FloatingPortalDock';

const AppContent: React.FC = () => {
  const { viewMode } = useTransit();

  // Separate Experience 1: Standalone Student Mobile App
  if (viewMode === 'student') {
    return (
      <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#120822] text-[#1F1235] dark:text-[#F5F3FF] transition-colors selection:bg-[#DDD6FE] selection:text-[#2E1065]">
        <main className="py-2 sm:py-6">
          <StudentApp />
        </main>
        <FloatingPortalDock />
      </div>
    );
  }

  // Separate Experience 2: Standalone Driver Cockpit Tablet HUD
  if (viewMode === 'driver') {
    return (
      <div className="min-h-screen bg-[#0C0617] text-[#F5F3FF] transition-colors selection:bg-amber-500 selection:text-black">
        <main className="py-2 sm:py-6">
          <DriverApp />
        </main>
        <FloatingPortalDock />
      </div>
    );
  }

  // Separate Experience 3: Standalone Admin Operations Website
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] dark:bg-[#140B24] text-[#1F1235] dark:text-[#F5F3FF] transition-colors selection:bg-[#DDD6FE] selection:text-[#2E1065]">
      <AdminWebsiteHeader />

      <main className="flex-1 pb-12">
        {viewMode === 'admin' && <AdminDashboard />}
        {viewMode === 'portal' && <TransitPortalLanding />}
        {viewMode === 'split' && <SplitLiveView />}
      </main>

      <AdminWebsiteFooter />
      <FloatingPortalDock />
    </div>
  );
};

export default function App() {
  return (
    <TransitProvider>
      <AppContent />
    </TransitProvider>
  );
}
