'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import OpportunityMapper3D from '@/components/dashboard/OpportunityMapper3D';
import NotificationSystem from '@/components/ui/notification-system';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, Bell, Menu } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function OpportunityPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { selectedCity } = useAppStore();

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <NotificationSystem />
      
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Access & Equity Mapper
                </h1>
                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                  <Globe className="h-4 w-4" />
                  <span>{selectedCity.name}, {selectedCity.country}</span>
                  <Badge variant="outline" className="text-xs">
                    Opportunity Index
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs p-0 flex items-center justify-center">
                  3
                </Badge>
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
          <OpportunityMapper3D />
        </main>
      </div>
    </div>
  );
}

