"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  LayoutDashboard, 
  Map, 
  BarChart3, 
  FolderOpen, 
  Users, 
  Settings, 
  Bell,
  ChevronLeft,
  ChevronRight,
  Home,
  Zap,
  TreePine,
  Building2,
  Smartphone,
  MapPin,
  Wind,
  TrendingUp,
  Rocket,
  Sparkles

} from "lucide-react";

const sidebarItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Climate overview and key metrics"
  },
  {
    title: "Analytics", 
    href: "/dashboard/analytics",
    icon: BarChart3,
    description: "Detailed climate data analysis"
  },
  {
    title: "Opportunity Map",
    href: "/dashboard/opportunity",
    icon: MapPin,
    description: "Access & Equity Mapper"
  },
  {
    title: "Simulation",
    href: "/dashboard/simulation", 
    icon: Zap,
    description: "Test climate interventions"
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: FolderOpen,
    description: "Manage climate projects"
  },
  {
    title: "Community",
    href: "/dashboard/community",
    icon: Users,
    description: "Community engagement portal"
  },
  {
    title: "Field Ops",
    href: "/dashboard/field-ops",
    icon: Smartphone,
    description: "Mobile field operations demo"
  }
];

const nasaAnalysisItems = [
  {
    title: "Urban Planner AI",
    href: "/dashboard/nasa-agent",
    icon: Rocket,
    description: "AI assistant with NASA Earth data",
    badge: "AI"
  },
  {
    title: "Access Analysis",
    href: "/dashboard/access",
    icon: Users,
    description: "Food, housing & transport access",
    badge: "3D"
  },
  {
    title: "Pollution Map",
    href: "/dashboard/pollution",
    icon: Wind,
    description: "Air & water quality analysis",
    badge: "Live"
  },
  {
    title: "Urban Growth",
    href: "/dashboard/growth",
    icon: TrendingUp,
    description: "City expansion & housing demand",
    badge: "50Y"
  }
];

const quickActions = [
  {
    title: "Add Trees",
    icon: TreePine,
    color: "text-green-600",
    bgColor: "bg-green-50 hover:bg-green-100"
  },
  {
    title: "New Project", 
    icon: Building2,
    color: "text-blue-600",
    bgColor: "bg-blue-50 hover:bg-blue-100"
  }
];

export default function Sidebar({ collapsed = false, onToggle }) {
  const pathname = usePathname();

  return (
    <div className={cn(
      "flex flex-col h-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 border-r border-slate-200/50 dark:border-slate-800/50 shadow-lg backdrop-blur-sm transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="relative flex items-center justify-between p-4 border-b border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-purple-500/5">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <div className="absolute inset-0 blur-md bg-emerald-400/20 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Oasis
              </h2>
              <p className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold tracking-wide">Climate Platform</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="relative mx-auto">
            <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className={cn(
            "hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200",
            collapsed ? "absolute right-2" : "ml-auto"
          )}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto custom-scrollbar">
        <div className="space-y-1">
          {!collapsed && (
            <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest mb-3 px-3">
              Navigation
            </p>
          )}
          
          <Link href="/">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start group relative overflow-hidden transition-all duration-200",
                collapsed ? "px-2" : "px-3",
                pathname === "/" 
                  ? "bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 text-emerald-700 dark:text-emerald-300 shadow-sm" 
                  : "hover:bg-slate-100 dark:hover:bg-slate-800/50"
              )}
            >
              {pathname === "/" && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-r-full" />
              )}
              <Home className={cn(
                "h-4 w-4 transition-transform duration-200 group-hover:scale-110",
                pathname === "/" && "text-emerald-600 dark:text-emerald-400"
              )} />
              {!collapsed && <span className="ml-3 font-medium">Home</span>}
            </Button>
          </Link>

          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start group relative overflow-hidden transition-all duration-200",
                    collapsed ? "px-2" : "px-3",
                    isActive 
                      ? "bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 text-emerald-700 dark:text-emerald-300 shadow-sm" 
                      : "hover:bg-slate-100 dark:hover:bg-slate-800/50"
                  )}
                  title={collapsed ? item.title : undefined}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-r-full" />
                  )}
                  <item.icon className={cn(
                    "h-4 w-4 transition-transform duration-200 group-hover:scale-110",
                    isActive && "text-emerald-600 dark:text-emerald-400"
                  )} />
                  {!collapsed && (
                    <div className="ml-3 text-left flex-1">
                      <div className="text-sm font-semibold">{item.title}</div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                        {item.description}
                      </div>
                    </div>
                  )}
                </Button>
              </Link>
            );
          })}
        </div>

        <Separator className="my-4 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
        
        {/* NASA Analysis Section */}
        <div className="space-y-1">
          {!collapsed && (
            <div className="flex items-center gap-2 mb-3 px-3">
              <span className="text-lg">🛰️</span>
              <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                NASA Data Analysis
              </p>
            </div>
          )}
          
          {nasaAnalysisItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start relative group overflow-hidden transition-all duration-200",
                    collapsed ? "px-2" : "px-3",
                    isActive 
                      ? "bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-700 dark:text-blue-300 shadow-sm" 
                      : "hover:bg-slate-100 dark:hover:bg-slate-800/50"
                  )}
                  title={collapsed ? item.title : undefined}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full" />
                  )}
                  <item.icon className={cn(
                    "h-4 w-4 transition-transform duration-200 group-hover:scale-110",
                    isActive && "text-blue-600 dark:text-blue-400"
                  )} />
                  {!collapsed && (
                    <>
                      <div className="ml-3 text-left flex-1">
                        <div className="text-sm font-semibold">{item.title}</div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                          {item.description}
                        </div>
                      </div>
                      <span className="ml-2 px-2 py-0.5 text-[9px] font-bold rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm">
                        {item.badge}
                      </span>
                    </>
                  )}
                </Button>
              </Link>
            );
          })}
        </div>

        {!collapsed && (
          <>
            <Separator className="my-4 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
            
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest px-3">
                Quick Actions
              </p>
              
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left group relative overflow-hidden transition-all duration-200",
                    action.bgColor,
                    action.color,
                    "hover:shadow-sm"
                  )}
                >
                  <action.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3" />
                  <span className="ml-3 font-medium">{action.title}</span>
                </Button>
              ))}
            </div>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-r from-slate-50/50 via-transparent to-slate-50/50">
        <div className="space-y-1">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start group transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800/50",
              collapsed ? "px-2" : "px-3"
            )}
          >
            <Bell className="h-4 w-4 transition-all duration-200 group-hover:scale-110 group-hover:rotate-12" />
            {!collapsed && <span className="ml-3 font-medium">Notifications</span>}
            {!collapsed && (
              <span className="ml-auto h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/50" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start group transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800/50",
              collapsed ? "px-2" : "px-3"
            )}
          >
            <Settings className="h-4 w-4 transition-all duration-200 group-hover:scale-110 group-hover:rotate-90" />
            {!collapsed && <span className="ml-3 font-medium">Settings</span>}
          </Button>
        </div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgb(16 185 129), rgb(5 150 105));
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgb(5 150 105), rgb(4 120 87));
        }
      `}</style>
    </div>
  );
}
