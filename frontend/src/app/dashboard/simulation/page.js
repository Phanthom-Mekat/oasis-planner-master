"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/dashboard/Sidebar";
import EnhancedLeafletMap from "@/components/dashboard/EnhancedLeafletMap";
import SimulationPanel from "@/components/dashboard/SimulationPanel";
import { CascadingEffectsSimulation } from "@/components/ui/cascading-effects-simulation";
import { AdvancedDataLayers } from "@/components/ui/advanced-data-layers";
import NotificationSystem from "@/components/ui/notification-system";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { 
  Zap, 
  Trees, 
  Waves, 
  Building2,
  Play,
  Pause,
  RotateCcw,
  Download,
  Settings,
  Globe,
  Bell,
  Search,
  Menu
} from "lucide-react";

export default function SimulationPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const { selectedCity } = useAppStore();

  const interventions = [
    {
      name: "Urban Forest",
      icon: Trees,
      color: "text-green-600",
      bgColor: "bg-green-50",
      impact: "+15% cooling",
      cost: "$$"
    },
    {
      name: "Cool Roofs",
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      impact: "+8% cooling",
      cost: "$"
    },
    {
      name: "Bioswales",
      icon: Waves,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      impact: "+12% flood reduction",
      cost: "$$"
    },
    {
      name: "Solar Panels",
      icon: Zap,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      impact: "+25% energy efficiency",
      cost: "$$$"
    }
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <NotificationSystem />
      
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
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
                  Climate Simulation
                </h1>
                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                  <Globe className="h-4 w-4" />
                  <span>{selectedCity.name}, {selectedCity.country}</span>
                  <Badge variant="outline" className="text-xs">
                    Simulation Mode
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <Button 
                  variant={simulationRunning ? "destructive" : "default"}
                  size="sm"
                  onClick={() => setSimulationRunning(!simulationRunning)}
                >
                  {simulationRunning ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Stop Simulation
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Run Simulation
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs p-0 flex items-center justify-center">
                  3
                </Badge>
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Available Interventions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Climate Interventions</CardTitle>
                  <CardDescription>
                    Select interventions to test their impact on your region&apos;s climate
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {interventions.map((intervention, index) => (
                      <motion.div
                        key={intervention.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="cursor-pointer"
                      >
                        <Card className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className={`p-3 rounded-lg ${intervention.bgColor} mb-3`}>
                              <intervention.icon className={`h-6 w-6 ${intervention.color}`} />
                            </div>
                            <h3 className="font-medium mb-1">{intervention.name}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                              {intervention.impact}
                            </p>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                {intervention.cost}
                              </Badge>
                              <Button size="sm" variant="ghost">
                                Add
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Simulation Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Simulation Map - Takes up 2 columns */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="xl:col-span-2"
              >
                <EnhancedLeafletMap mode="simulation" />
              </motion.div>

              {/* Simulation Controls */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <SimulationPanel />
              </motion.div>
            </div>

            {/* Simulation Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Simulation Results</CardTitle>
                  <CardDescription>
                    Projected impact of your interventions over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">-3.2°C</div>
                      <div className="text-sm text-slate-600">Temperature Reduction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">-45%</div>
                      <div className="text-sm text-slate-600">Flood Risk Reduction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-600 mb-2">+32%</div>
                      <div className="text-sm text-slate-600">Energy Efficiency</div>
                    </div>
                  </div>
                  
                  {simulationRunning && (
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm font-medium">Simulation running...</span>
                      </div>
                      <div className="mt-2 bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '65%'}}></div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Advanced Data Layers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <AdvancedDataLayers />
            </motion.div>

            {/* Cascading Effects Simulation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <CascadingEffectsSimulation />
            </motion.div>

            {/* Advanced Data Layers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <AdvancedDataLayers />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
