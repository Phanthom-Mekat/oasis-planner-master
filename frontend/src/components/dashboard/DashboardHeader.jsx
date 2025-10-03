"use client";

import { Bell, Settings, User, Search, Globe, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";

export default function DashboardHeader() {
  const { currentUser, selectedCity, notifications, addNotification } = useAppStore();
  
  const handleTestNotification = () => {
    addNotification({
      type: "success",
      title: "Climate Data Updated",
      message: "New satellite data has been processed for your region.",
    });
  };

  return (
    <header className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Oasis Platform
            </h1>
            <div className="hidden md:flex items-center space-x-2 text-sm text-slate-600">
              <span>•</span>
              <Globe className="h-4 w-4" />
              <span>{selectedCity.name}, {selectedCity.country}</span>
              <Badge variant="outline" className="text-xs">
                {selectedCity.climate_zone}
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2">
              <Search className="h-4 w-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search locations, projects..."
                className="bg-transparent text-sm outline-none w-48"
              />
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative"
              onClick={handleTestNotification}
            >
              <Bell className="h-4 w-4" />
              {notifications.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500">
                  {notifications.length}
                </Badge>
              )}
            </Button>
            
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg px-3 py-2">
              <User className="h-4 w-4" />
              <div className="hidden sm:block text-sm">
                <div className="font-medium">{currentUser.name}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">{currentUser.role}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
