"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Sidebar from "@/components/dashboard/Sidebar";
import EnhancedLeafletMap from "@/components/dashboard/EnhancedLeafletMap";
import LeafletClimateMap from "@/components/dashboard/LeafletClimateMap";
import EnhancedMetricsGrid from "@/components/dashboard/EnhancedMetricsGrid";
import MetricsGrid from "@/components/dashboard/MetricsGrid";
import SimulationPanel from "@/components/dashboard/SimulationPanel";
import ProjectsList from "@/components/dashboard/ProjectsList";
import NotificationSystem from "@/components/ui/notification-system";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AIChiefOfStaff } from "@/components/ui/ai-chief-of-staff";
import { useAppStore } from "@/lib/store";
import { useClimateData, useEnvironmentalAnalysis, useAIInsights } from "@/hooks/useClimateData";
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  Users, 
  TrendingUp,
  TrendingDown,
  Globe,
  Bell,
  Search,
  Menu,
  RefreshCw,
  AlertTriangle,
  Activity,
  Maximize2,
  X
} from "lucide-react";

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    name: "Dhaka",
    country: "Bangladesh",
    climate_zone: "Tropical Monsoon"
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const { addNotification, selectedCity } = useAppStore();
  
  // Real-time climate data
  const { data: climateData, loading: climateLoading, error: climateError, refresh } = useClimateData();
  
  // Environmental analysis
  const { 
    heatIslands, 
    floodRisk, 
    loading: analysisLoading, 
    analyzeHeatIslands, 
    analyzeFloodRisk 
  } = useEnvironmentalAnalysis();
  
  // AI insights
  const { insights, generateInsights } = useAIInsights();
  
  // Dhaka-specific weather data
  const dhakaWeatherData = {
    current: {
      temp: 29,
      condition: "Heavy thunderstorm",
      precipitation: 65,
      humidity: 89,
      wind: 14,
      feelsLike: 34,
      uvIndex: 5,
      aqi: 156,
      visibility: 8
    },
    forecast: [
      { day: "Friday", condition: "Heavy thunderstorm", temp: 29, precipitation: 65, wind: 14, humidity: 89 },
      { day: "Saturday", condition: "Thunderstorm", temp: 28, precipitation: 40, wind: 12, humidity: 85 },
      { day: "Sunday", condition: "Partly cloudy", temp: 31, precipitation: 25, wind: 10, humidity: 80 },
      { day: "Monday", condition: "Sunny", temp: 33, precipitation: 10, wind: 8, humidity: 75 },
      { day: "Tuesday", condition: "Partly cloudy", temp: 32, precipitation: 20, wind: 11, humidity: 78 }
    ]
  };

  useEffect(() => {
    // Welcome notification with real data
    if (climateData && !climateLoading) {
      addNotification({
        type: "success",
        title: "Climate Data Updated",
        message: `Current temperature: ${climateData.temperature.current.toFixed(1)}°C. Heat index: ${climateData.heatIndex.toFixed(1)}°C`,
        autoRemove: true
      });
    }
  }, [climateData, climateLoading, addNotification]);

  // Auto-analyze environmental conditions
  useEffect(() => {
    if (climateData?.temperature?.current > 35) {
      analyzeHeatIslands();
      generateInsights('heat_emergency', { temperature: climateData.temperature.current });
    }
  }, [climateData, analyzeHeatIslands, generateInsights]);

  // Generate climate metrics from Dhaka data
  const climateMetrics = [
    {
      title: "Temperature",
      value: `${dhakaWeatherData.current.temp}°C`,
      change: `Feels like ${dhakaWeatherData.current.feelsLike}°C`,
      trend: "stable",
      icon: Thermometer,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Humidity",
      value: `${dhakaWeatherData.current.humidity}%`,
      change: "Very High",
      trend: "up",
      icon: Droplets,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Wind Speed",
      value: `${dhakaWeatherData.current.wind} km/h`,
      change: "Moderate",
      trend: "stable",
      icon: Wind,
      color: "text-slate-600",
      bgColor: "bg-slate-50"
    },
    {
      title: "Precipitation",
      value: `${dhakaWeatherData.current.precipitation}%`,
      change: "Heavy Rain",
      trend: "up",
      icon: Droplets,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      title: "Air Quality",
      value: "Unhealthy",
      change: `AQI ${dhakaWeatherData.current.aqi}`,
      trend: "up",
      icon: Activity,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "UV Index",
      value: `${dhakaWeatherData.current.uvIndex}`,
      change: "Moderate",
      trend: "stable",
      icon: Sun,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    }
  ];

  // Helper functions for AQI
  function getAQILabel(aqi) {
    if (aqi <= 1) return "Good";
    if (aqi <= 2) return "Fair";
    if (aqi <= 3) return "Moderate";
    if (aqi <= 4) return "Poor";
    return "Very Poor";
  }

  function getAQIColor(aqi) {
    if (aqi <= 1) return "text-green-600";
    if (aqi <= 2) return "text-yellow-600";
    if (aqi <= 3) return "text-orange-600";
    if (aqi <= 4) return "text-red-600";
    return "text-purple-600";
  }

  function getAQIBgColor(aqi) {
    if (aqi <= 1) return "bg-green-50";
    if (aqi <= 2) return "bg-yellow-50";
    if (aqi <= 3) return "bg-orange-50";
    if (aqi <= 4) return "bg-red-50";
    return "bg-purple-50";
  }

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
        {/* Top Header Bar - Enhanced with Dhaka Weather */}
        <header className="bg-gradient-to-r from-white/90 via-blue-50/30 to-white/90 dark:from-slate-800/90 dark:via-slate-700/30 dark:to-slate-800/90 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-700/60 px-6 py-3 sticky top-0 z-40 shadow-sm">
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
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Climate Dashboard
                </h1>
                <div className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300">
                  <Globe className="h-4 w-4" />
                  <span className="font-semibold">{selectedLocation.name}, {selectedLocation.country}</span>
                  <Badge variant="outline" className="text-xs bg-emerald-50 border-emerald-200 text-emerald-700">
                    {selectedLocation.climate_zone}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Current Weather Summary */}
            <div className="hidden lg:flex items-center gap-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl px-4 py-2 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="text-2xl">⛈️</div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{dhakaWeatherData.current.temp}°C</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">{dhakaWeatherData.current.condition}</div>
                </div>
              </div>
              <div className="h-8 w-px bg-slate-300 dark:bg-slate-600"></div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <Droplets className="h-3 w-3 text-blue-500" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">{dhakaWeatherData.current.humidity}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wind className="h-3 w-3 text-slate-500" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">{dhakaWeatherData.current.wind} km/h</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="h-3 w-3 text-red-500" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">AQI {dhakaWeatherData.current.aqi}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-2 bg-white/80 dark:bg-slate-700/80 rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-600 shadow-sm">
                <Search className="h-4 w-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search Dhaka areas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm outline-none w-48 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 font-medium"
                />
              </div>
              
              <Button variant="ghost" size="sm" className="relative hover:bg-slate-100 dark:hover:bg-slate-700">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs p-0 flex items-center justify-center bg-red-500 text-white border-2 border-white animate-pulse">
                  3
                </Badge>
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Climate Alerts Section - Dhaka */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {/* Thunderstorm Alert */}
              {dhakaWeatherData.current.condition.includes('thunderstorm') && (
                <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 dark:bg-purple-900/20 shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-full shadow-sm">
                        <AlertTriangle className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-purple-900 dark:text-purple-100">⛈️ Thunderstorm Warning</h3>
                        <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                          Heavy thunderstorm expected. Precipitation probability: {dhakaWeatherData.current.precipitation}%. 
                          Stay indoors and avoid travel if possible.
                        </p>
                      </div>
                      <Button size="sm" variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-100 font-semibold">
                        Safety Tips
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Air Quality Alert */}
              {dhakaWeatherData.current.aqi > 150 && (
                <Card className="border-red-200 bg-gradient-to-r from-red-50 to-orange-50 dark:bg-red-900/20 shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-100 dark:bg-red-800 rounded-full shadow-sm">
                        <Activity className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-red-900 dark:text-red-100">🚨 Unhealthy Air Quality</h3>
                        <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                          Air Quality Index: {dhakaWeatherData.current.aqi} (Unhealthy). 
                          Sensitive groups should limit outdoor exposure. Consider wearing masks.
                        </p>
                      </div>
                      <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-100 font-semibold">
                        View Map
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* High Humidity Alert */}
              {dhakaWeatherData.current.humidity > 85 && (
                <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 dark:bg-blue-900/20 shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full shadow-sm">
                        <Droplets className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-blue-900 dark:text-blue-100">💧 High Humidity Alert</h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                          Humidity at {dhakaWeatherData.current.humidity}%. Stay hydrated and avoid strenuous outdoor activities.
                        </p>
                      </div>
                      <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100 font-semibold">
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Refresh Data Button */}
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refresh}
                  disabled={climateLoading}
                  className="flex items-center space-x-2 shadow-sm hover:shadow-md transition-all font-semibold"
                >
                  <RefreshCw className={`h-4 w-4 ${climateLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh Weather Data</span>
                </Button>
              </div>
            </motion.div>
            {/* NASA Data Analysis - 3 Key Questions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <div className="mb-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  NASA Data Intelligence
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Advanced 3D geospatial analysis powered by NASA Earth observation satellites
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Question 1: Access Analysis */}
                <motion.a
                  href="/dashboard/access"
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 p-1 shadow-2xl shadow-blue-500/50 transition-all duration-300 hover:shadow-blue-500/70"
                >
                  <div className="relative h-full rounded-xl bg-slate-900/90 backdrop-blur-xl p-6">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl group-hover:bg-blue-400/30 transition-all"></div>
                    
                    <div className="relative space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="p-3 bg-blue-500/20 rounded-xl backdrop-blur-sm border border-blue-400/30">
                          <Users className="w-8 h-8 text-blue-300" />
                        </div>
                        <Badge className="bg-blue-400/20 text-blue-200 border-blue-400/30">
                          Question 1
                        </Badge>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
                          Access to Services
                        </h3>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          Which communities need better access to food, housing, or transportation?
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs bg-blue-950/50 border-blue-400/30 text-blue-200">
                          SEDAC Population
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-blue-950/50 border-blue-400/30 text-blue-200">
                          GHSL Settlements
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-blue-950/50 border-blue-400/30 text-blue-200">
                          VIIRS Lights
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-blue-300 font-medium">View 3D Analysis →</span>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-emerald-300">Live</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.a>

                {/* Question 2: Pollution Analysis */}
                <motion.a
                  href="/dashboard/pollution"
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 via-orange-600 to-yellow-600 p-1 shadow-2xl shadow-red-500/50 transition-all duration-300 hover:shadow-red-500/70"
                >
                  <div className="relative h-full rounded-xl bg-slate-900/90 backdrop-blur-xl p-6">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-400/20 rounded-full blur-3xl group-hover:bg-red-400/30 transition-all"></div>
                    
                    <div className="relative space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="p-3 bg-red-500/20 rounded-xl backdrop-blur-sm border border-red-400/30">
                          <Wind className="w-8 h-8 text-red-300" />
                        </div>
                        <Badge className="bg-red-400/20 text-red-200 border-red-400/30">
                          Question 2
                        </Badge>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-200 transition-colors">
                          Pollution & Health
                        </h3>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          Which areas are dealing with polluted air or water, and how can that be addressed?
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs bg-red-950/50 border-red-400/30 text-red-200">
                          TROPOMI NO₂
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-red-950/50 border-red-400/30 text-red-200">
                          MODIS AOD
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-red-950/50 border-red-400/30 text-red-200">
                          Landsat Water
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-red-300 font-medium">View 3D Analysis →</span>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-emerald-300">Live</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.a>

                {/* Question 3: Urban Growth */}
                <motion.a
                  href="/dashboard/growth"
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-pink-600 to-rose-600 p-1 shadow-2xl shadow-purple-500/50 transition-all duration-300 hover:shadow-purple-500/70"
                >
                  <div className="relative h-full rounded-xl bg-slate-900/90 backdrop-blur-xl p-6">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl group-hover:bg-purple-400/30 transition-all"></div>
                    
                    <div className="relative space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="p-3 bg-purple-500/20 rounded-xl backdrop-blur-sm border border-purple-400/30">
                          <TrendingUp className="w-8 h-8 text-purple-300" />
                        </div>
                        <Badge className="bg-purple-400/20 text-purple-200 border-purple-400/30">
                          Question 3
                        </Badge>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">
                          Urban Growth
                        </h3>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          Which parts of the city are experiencing the most growth, and where is new housing development most needed?
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs bg-purple-950/50 border-purple-400/30 text-purple-200">
                          GHSL Urban
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-purple-950/50 border-purple-400/30 text-purple-200">
                          VIIRS Lights
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-purple-950/50 border-purple-400/30 text-purple-200">
                          Landsat Cover
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-purple-300 font-medium">View 3D Analysis →</span>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-emerald-300">Live</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.a>
              </div>
            </motion.div>

            {/* Current Weather Card - Dhaka */}
           

            {/* Climate Metrics Cards - More compact on smaller screens */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {climateMetrics.map((metric, index) => (
                <motion.div
                  key={metric.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 rounded-lg ${metric.bgColor} shadow-sm`}>
                          <metric.icon className={`h-4 w-4 ${metric.color}`} />
                        </div>
                        <div className={`flex items-center text-xs font-semibold ${
                          metric.trend === 'up' ? 'text-red-500' : metric.trend === 'down' ? 'text-green-500' : 'text-slate-500'
                        }`}>
                          {metric.trend !== 'stable' && (
                            <TrendingUp className={`h-3 w-3 mr-1 ${
                              metric.trend === 'down' ? 'rotate-180' : ''
                            }`} />
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                          {metric.value}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">
                          {metric.title}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-500 font-medium">
                          {metric.change}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Climate Map Centerpiece - Enhanced User-Friendly Version */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="w-full"
            >
              <Card className="border-slate-200/50 dark:border-slate-700/50 shadow-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 dark:from-emerald-950/30 dark:via-blue-950/30 dark:to-purple-950/30 border-b border-slate-200/50 dark:border-slate-700/50 pb-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
                        🗺️ Interactive Climate Data Map
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                        Zoom in/out to explore detailed climate data • Click areas for detailed insights • {selectedLocation.name}, {selectedLocation.country}
                      </CardDescription>
                    </div>
                    
                    {/* Map Controls */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Layer Selector */}
                      <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900">
                          🌡️ Temperature
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs font-semibold hover:bg-purple-100 dark:hover:bg-purple-900">
                          💨 Air Quality
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs font-semibold hover:bg-green-100 dark:hover:bg-green-900">
                          🌳 Vegetation
                        </Button>
                      </div>

                      {/* Quick Zoom Buttons */}
                      <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs font-semibold" title="City View">
                          🏙️
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs font-semibold" title="District View">
                          🏘️
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs font-semibold" title="Street View">
                          🏠
                        </Button>
                      </div>

                      {/* Status Badges */}
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300 text-xs font-bold">
                          Live Data
                        </Badge>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Updating</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Map Legend - Expandable */}
                  <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Legend:</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600"></div>
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Low Risk</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"></div>
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Medium Risk</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-red-700"></div>
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">High Risk</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-600"></div>
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Critical</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" className="h-6 text-xs font-semibold">
                          📸 Screenshot
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 text-xs font-semibold">
                          📊 Export Data
                        </Button>
                        <Button 
                          size="sm" 
                          variant="default" 
                          className="h-6 text-xs font-semibold bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                          onClick={() => setIsMapFullscreen(true)}
                        >
                          <Maximize2 className="h-3 w-3 mr-1" />
                          Fullscreen
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0 relative">
                  {/* Zoom Level Indicator */}
                  <div className="absolute top-4 left-4 z-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Zoom Level:</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className={`w-1.5 h-3 rounded-full ${i < 3 ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">3/5</span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">District View • High Detail</div>
                  </div>

                  {/* Data Clusters Info */}
                  <div className="absolute top-4 right-4 z-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Data Points:</span>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">1,247 visible</span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">💡 Zoom in for more details</div>
                  </div>

                  {/* Map Container */}
                  <div className="h-[600px] w-full bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative">
                    <LeafletClimateMap mode="centerpiece" />
                    
                    {/* Interactive Hint */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-slate-900/90 dark:bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white dark:text-slate-900">💡 Pro Tip:</span>
                        <span className="text-xs text-slate-200 dark:text-slate-700 font-medium">Click any area to view detailed climate analytics</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats Overlay */}
                  <div className="absolute bottom-4 right-4 z-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl p-3 shadow-xl border border-slate-200/50 dark:border-slate-700/50 max-w-xs">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Current View Stats</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-2 border border-red-200 dark:border-red-800">
                        <div className="font-semibold text-red-700 dark:text-red-300">Hot Zones</div>
                        <div className="text-lg font-bold text-red-600 dark:text-red-400">47</div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-2 border border-blue-200 dark:border-blue-800">
                        <div className="font-semibold text-blue-700 dark:text-blue-300">Flood Risk</div>
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">23</div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-2 border border-purple-200 dark:border-purple-800">
                        <div className="font-semibold text-purple-700 dark:text-purple-300">Air Quality</div>
                        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">Poor</div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-2 border border-green-200 dark:border-green-800">
                        <div className="font-semibold text-green-700 dark:text-green-300">Green Areas</div>
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">156</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Climate Overview Grid - Improved Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Climate Analysis & Metrics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card className="h-full border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                  <CardHeader className="pb-3 border-b border-slate-200/50 dark:border-slate-700/50">
                    <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      📊 Climate Analysis & Metrics
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      Real-time environmental data and insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <EnhancedMetricsGrid />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Simulation & Real-time Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Card className="h-full border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                  <CardHeader className="pb-3 border-b border-slate-200/50 dark:border-slate-700/50">
                    <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      🧪 Climate Simulation
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      Test interventions and predict outcomes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <SimulationPanel />
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* AI Insights and Projects - Enhanced Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Left Column: AI Chief of Staff + Location Data */}
              <div className="space-y-6">
                {/* AI Chief of Staff - Half size */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <AIChiefOfStaff />
                </motion.div>

                {/* Current Location Data Card - Orange/Amber Theme */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Card className="bg-gradient-to-br from-orange-500 via-amber-600 to-orange-700 border-0 shadow-2xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Globe className="h-5 w-5 text-orange-200" />
                            <h3 className="text-lg font-bold text-white">Current Location</h3>
                          </div>
                          <p className="text-2xl font-bold text-white">{selectedLocation.name}</p>
                          <p className="text-sm text-orange-100">Choose area</p>
                        </div>
                        <div className="text-right">
                          <div className="text-5xl font-bold text-white mb-1">{dhakaWeatherData.current.temp}°C</div>
                          <div className="text-sm text-orange-100">Feels like {dhakaWeatherData.current.feelsLike}°C</div>
                        </div>
                      </div>

                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="text-4xl">⛈️</div>
                          <div>
                            <p className="text-xl font-semibold text-white">{dhakaWeatherData.current.condition}</p>
                            <p className="text-sm text-orange-100">Friday</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div className="bg-white/10 rounded-lg p-2">
                            <p className="text-xs text-orange-200 mb-1">Precipitation</p>
                            <p className="text-lg font-bold text-white">{dhakaWeatherData.current.precipitation}%</p>
                          </div>
                          <div className="bg-white/10 rounded-lg p-2">
                            <p className="text-xs text-orange-200 mb-1">Humidity</p>
                            <p className="text-lg font-bold text-white">{dhakaWeatherData.current.humidity}%</p>
                          </div>
                          <div className="bg-white/10 rounded-lg p-2">
                            <p className="text-xs text-orange-200 mb-1">Wind</p>
                            <p className="text-lg font-bold text-white">{dhakaWeatherData.current.wind} km/h</p>
                          </div>
                        </div>
                      </div>

                      {/* 5-Day Forecast */}
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-orange-100 mb-3">5-Day Forecast</p>
                        {dhakaWeatherData.forecast.map((day, index) => (
                          <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <span className="text-sm font-medium text-white w-20">{day.day}</span>
                              <span className="text-2xl">{day.condition.includes('thunder') ? '⛈️' : day.condition.includes('cloudy') ? '⛅' : '☀️'}</span>
                              <span className="text-xs text-orange-100 flex-1">{day.condition}</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs">
                              <div className="text-center">
                                <p className="text-orange-200">Temp</p>
                                <p className="font-bold text-white">{day.temp}°C</p>
                              </div>
                              <div className="text-center">
                                <p className="text-orange-200">Rain</p>
                                <p className="font-bold text-white">{day.precipitation}%</p>
                              </div>
                              <div className="text-center">
                                <p className="text-orange-200">Wind</p>
                                <p className="font-bold text-white">{day.wind} km/h</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Right Column: Projects Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <ProjectsList />
              </motion.div>
            </div>
          </div>
        </main>
      </div>

      {/* Fullscreen Map Modal */}
      {isMapFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md"
        >
          {/* Close Button */}
          <Button
            onClick={() => setIsMapFullscreen(false)}
            className="absolute top-4 right-4 z-[10000] bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm"
            size="icon"
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Fullscreen Header */}
         

          {/* Fullscreen Map Container */}
          <div className="w-full h-full relative">
            <LeafletClimateMap mode="centerpiece" />
          </div>

          {/* Fullscreen Controls Panel */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-[10000] bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 shadow-2xl border border-white/20">
            <div className="flex items-center gap-4">
              {/* Layer Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white/90">Layers:</span>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="h-8 px-3 text-xs font-semibold text-white hover:bg-white/20 border border-white/20">
                    🌡️ Temperature
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 px-3 text-xs font-semibold text-white hover:bg-white/20 border border-white/20">
                    💨 Air Quality
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 px-3 text-xs font-semibold text-white hover:bg-white/20 border border-white/20">
                    🌳 Vegetation
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 px-3 text-xs font-semibold text-white hover:bg-white/20 border border-white/20">
                    🌊 Flood Risk
                  </Button>
                </div>
              </div>

              <div className="w-px h-8 bg-white/20"></div>

              {/* Quick Zoom */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white/90">Quick Zoom:</span>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="h-8 px-3 text-xs font-semibold text-white hover:bg-white/20 border border-white/20">
                    🏙️ City
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 px-3 text-xs font-semibold text-white hover:bg-white/20 border border-white/20">
                    🏘️ District
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 px-3 text-xs font-semibold text-white hover:bg-white/20 border border-white/20">
                    🏠 Street
                  </Button>
                </div>
              </div>

              <div className="w-px h-8 bg-white/20"></div>

              {/* Live Status */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
                <span className="text-xs font-bold text-white">LIVE DATA</span>
              </div>
            </div>
          </div>

          {/* Fullscreen Help Text */}
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-[10000]">
            <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 shadow-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">💡 Pro Tip:</span>
                <span className="text-xs text-white/90 font-medium">Scroll to zoom • Click markers for details • Drag to pan</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
