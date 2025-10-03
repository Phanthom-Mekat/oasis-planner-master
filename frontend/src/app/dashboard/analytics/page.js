"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/dashboard/Sidebar";
import MetricsGrid from "@/components/dashboard/MetricsGrid";
import NotificationSystem from "@/components/ui/notification-system";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Download,
  Filter,
  RefreshCcw,
  Globe,
  Bell,
  Search,
  Menu,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Satellite,
  Zap,
  Activity,
  Layers,
  Eye,
  Cloud,
  Sparkles,
  Radio,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Database,
  Waves,
  Flame,
  Leaf
} from "lucide-react";

export default function AnalyticsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [timeRange, setTimeRange] = useState("7d");
  const [activeTab, setActiveTab] = useState("overview");
  const [satelliteData, setSatelliteData] = useState({ loading: false, lastUpdate: new Date() });
  const { selectedCity } = useAppStore();

  // Simulate real-time satellite data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSatelliteData({ loading: false, lastUpdate: new Date() });
    }, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const nasaDatasets = [
    {
      name: "MODIS Terra/Aqua",
      status: "active",
      resolution: "250m-1km",
      coverage: "Dhaka Urban",
      lastPass: "12 min ago",
      nextPass: "98 min",
      icon: Satellite,
      color: "from-blue-500 to-cyan-500",
      metrics: { temperature: "31.2°C", coverage: "100%" }
    },
    {
      name: "VIIRS NPP/NOAA-20",
      status: "active",
      resolution: "375m",
      coverage: "Bangladesh Region",
      lastPass: "28 min ago",
      nextPass: "72 min",
      icon: Eye,
      color: "from-purple-500 to-pink-500",
      metrics: { nightLights: "High", quality: "98.2%" }
    },
    {
      name: "GPM IMERG",
      status: "active",
      resolution: "10km",
      coverage: "South Asia",
      lastPass: "15 min ago",
      nextPass: "45 min",
      icon: Cloud,
      color: "from-indigo-500 to-blue-500",
      metrics: { precipitation: "2.4mm/hr", confidence: "High" }
    },
    {
      name: "LANDSAT 8/9",
      status: "scheduled",
      resolution: "30m",
      coverage: "Path 137/44",
      lastPass: "4 days ago",
      nextPass: "12 days",
      icon: Layers,
      color: "from-green-500 to-emerald-500",
      metrics: { cloudCover: "18%", quality: "Excellent" }
    }
  ];

  const analyticsData = [
    {
      title: "Urban Heat Index",
      subtitle: "MODIS LST Analysis",
      current: "42.8°C",
      previous: "38.2°C", 
      change: "+12.0%",
      trend: "critical",
      icon: Flame,
      color: "text-red-600",
      bgGradient: "from-red-50 via-orange-50 to-red-50",
      data: [38, 39, 40, 41, 42, 43, 42.8],
      insight: "Peak heat detected in Tejgaon & Mirpur zones",
      nasaSource: "MODIS Terra"
    },
    {
      title: "Flood Risk Score",
      subtitle: "GPM Precipitation",
      current: "7.2/10",
      previous: "5.8/10",
      change: "+24.1%", 
      trend: "warning",
      icon: Waves,
      color: "text-blue-600",
      bgGradient: "from-blue-50 via-cyan-50 to-blue-50",
      data: [5.2, 5.5, 6.1, 6.8, 7.0, 7.5, 7.2],
      insight: "High precipitation zones: Jatrabari-Demra",
      nasaSource: "GPM IMERG"
    },
    {
      title: "Air Quality Index",
      subtitle: "MERRA-2 & OMI",
      current: "187 AQI",
      previous: "168 AQI",
      change: "+11.3%",
      trend: "unhealthy", 
      icon: Wind,
      color: "text-orange-600",
      bgGradient: "from-orange-50 via-amber-50 to-orange-50",
      data: [155, 162, 170, 178, 182, 192, 187],
      insight: "PM2.5: 82 µg/m³ - Exceeds WHO limits",
      nasaSource: "MERRA-2"
    },
    {
      title: "Green Coverage",
      subtitle: "LANDSAT NDVI",
      current: "18.2%",
      previous: "22.1%",
      change: "-17.6%",
      trend: "declining",
      icon: Leaf,
      color: "text-green-600", 
      bgGradient: "from-green-50 via-emerald-50 to-green-50",
      data: [24, 23, 21, 20, 19, 18.5, 18.2],
      insight: "Vegetation loss in northern districts",
      nasaSource: "LANDSAT 8/9"
    }
  ];

  const climateInsights = [
    {
      title: "Critical Heat Alert",
      description: "MODIS data shows 6.2°C urban-rural temperature differential",
      severity: "critical",
      affected: "2.4M residents",
      recommendation: "Deploy cool pavement in top 3 zones",
      icon: AlertTriangle,
      gradient: "from-red-500 to-orange-500"
    },
    {
      title: "Flood Preparedness",
      description: "GPM forecasts 280mm rainfall in next 72 hours",
      severity: "high",
      affected: "1.53M at risk",
      recommendation: "Activate emergency response protocols",
      icon: Waves,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Green Infrastructure Gap",
      description: "NDVI analysis reveals 32% deficit in target zones",
      severity: "medium",
      affected: "8 priority areas",
      recommendation: "Accelerate urban forest projects",
      icon: Leaf,
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  const timeRanges = [
    { label: "24H", value: "24h", icon: Clock },
    { label: "7D", value: "7d", icon: Calendar },
    { label: "30D", value: "30d", icon: Calendar },
    { label: "90D", value: "90d", icon: Calendar }
  ];

  const tabs = [
    { id: "overview", label: "Climate Overview", icon: Activity },
    { id: "satellite", label: "Satellite Data", icon: Satellite },
    { id: "predictions", label: "AI Predictions", icon: Sparkles }
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <NotificationSystem />
      
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* NASA-Branded Hero Header */}
        <header className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 px-6 py-8 overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} />
          </div>
          
          {/* Floating Satellite Icons */}
          <motion.div
            className="absolute top-4 right-20 text-white/20"
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Satellite className="h-16 w-16" />
          </motion.div>
          
          <motion.div
            className="absolute bottom-4 right-40 text-white/10"
            animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <Globe className="h-12 w-12" />
          </motion.div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-white hover:bg-white/20"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center space-x-4">
                <motion.div
                  className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Activity className="h-8 w-8 text-white" />
                </motion.div>
                
                <div>
                  <div className="flex items-center space-x-3">
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                      🛰️ NASA Earth Analytics
                    </h1>
                    <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                      <Radio className="h-3 w-3 mr-1 animate-pulse" />
                      LIVE
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-3 mt-2 text-white/90">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">{selectedCity.name}, {selectedCity.country}</span>
                    <span className="text-white/60">•</span>
                    <Database className="h-4 w-4" />
                    <span className="text-sm">8 NASA Datasets Active</span>
                    <span className="text-white/60">•</span>
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Updated {satelliteData.lastUpdate.toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Tab Navigation */}
              <div className="hidden lg:flex items-center bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant="ghost"
                    size="sm"
                    className={`text-white hover:bg-white/20 ${
                      activeTab === tab.id ? 'bg-white/25 shadow-lg' : ''
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <tab.icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </Button>
                ))}
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => setSatelliteData({ ...satelliteData, loading: true })}
              >
                <RefreshCcw className={`h-4 w-4 mr-2 ${satelliteData.loading ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              <Button variant="ghost" size="sm" className="relative text-white hover:bg-white/20">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs p-0 flex items-center justify-center animate-pulse">
                  3
                </Badge>
              </Button>
            </div>
          </div>
          
          {/* Time Range Selector */}
          <div className="relative z-10 mt-6 flex items-center space-x-3">
            <span className="text-white/80 text-sm font-medium">Time Range:</span>
            <div className="flex items-center bg-white/10 backdrop-blur-md rounded-lg p-1 border border-white/20">
              {timeRanges.map((range) => (
                <Button
                  key={range.value}
                  variant="ghost"
                  size="sm"
                  className={`text-white hover:bg-white/20 ${
                    timeRange === range.value ? 'bg-white/25 shadow-md' : ''
                  }`}
                  onClick={() => setTimeRange(range.value)}
                >
                  <range.icon className="h-3.5 w-3.5 mr-1.5" />
                  {range.label}
                </Button>
              ))}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-[1800px] mx-auto space-y-6">
            {/* NASA Satellite Status Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
            >
              {nasaDatasets.map((dataset, index) => (
                <motion.div
                  key={dataset.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <Card className="relative overflow-hidden border-2 hover:shadow-2xl transition-all duration-300">
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${dataset.color} opacity-5`} />
                    
                    <CardContent className="relative p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <motion.div
                            className={`p-2.5 bg-gradient-to-br ${dataset.color} rounded-xl`}
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            <dataset.icon className="h-5 w-5 text-white" />
                          </motion.div>
                          <div>
                            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                              {dataset.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {dataset.resolution} • {dataset.coverage}
                            </p>
                          </div>
                        </div>
                        <Badge 
                          className={`${
                            dataset.status === 'active' 
                              ? 'bg-green-100 text-green-700 border-green-300' 
                              : 'bg-amber-100 text-amber-700 border-amber-300'
                          }`}
                        >
                          <div className={`h-2 w-2 rounded-full mr-1.5 ${
                            dataset.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'
                          }`} />
                          {dataset.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 mt-4">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600 dark:text-slate-400">Last Pass:</span>
                          <span className="font-semibold text-slate-900 dark:text-slate-100">{dataset.lastPass}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600 dark:text-slate-400">Next Pass:</span>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">{dataset.nextPass}</span>
                        </div>
                        
                        {/* Metrics */}
                        <div className="pt-3 border-t border-slate-200 dark:border-slate-700 mt-3">
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(dataset.metrics).map(([key, value]) => (
                              <div key={key} className="text-center p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="text-xs text-slate-500 capitalize">{key}</div>
                                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Advanced Climate Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {analyticsData.map((metric, index) => (
                <motion.div
                  key={metric.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                >
                  <Card className={`relative overflow-hidden border-2 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br ${metric.bgGradient}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <motion.div
                            className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            <metric.icon className={`h-6 w-6 ${metric.color}`} />
                          </motion.div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-slate-100">
                              {metric.title}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                              <Satellite className="h-3 w-3" />
                              {metric.subtitle}
                            </p>
                          </div>
                        </div>
                        
                        <Badge 
                          variant="outline"
                          className={`${
                            metric.trend === 'critical' ? 'bg-red-100 text-red-700 border-red-300 animate-pulse' :
                            metric.trend === 'warning' ? 'bg-orange-100 text-orange-700 border-orange-300' :
                            metric.trend === 'unhealthy' ? 'bg-amber-100 text-amber-700 border-amber-300' :
                            'bg-blue-100 text-blue-700 border-blue-300'
                          }`}
                        >
                          {metric.trend === 'critical' && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {metric.change}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="text-3xl font-black text-slate-900 dark:text-slate-100">
                          {metric.current}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Previous: <span className="font-semibold">{metric.previous}</span>
                        </div>
                        
                        {/* Enhanced Mini Chart */}
                        <div className="mt-4 h-12 flex items-end space-x-1.5 bg-white/50 dark:bg-slate-800/50 rounded-lg p-2">
                          {metric.data.map((value, i) => (
                            <motion.div
                              key={i}
                              className={`flex-1 rounded-t-md ${
                                metric.color.includes('red') ? 'bg-gradient-to-t from-red-400 to-red-600' :
                                metric.color.includes('blue') ? 'bg-gradient-to-t from-blue-400 to-blue-600' :
                                metric.color.includes('orange') ? 'bg-gradient-to-t from-orange-400 to-orange-600' :
                                'bg-gradient-to-t from-green-400 to-green-600'
                              } shadow-lg`}
                              style={{ height: `${(value / Math.max(...metric.data)) * 100}%` }}
                              initial={{ height: 0 }}
                              animate={{ height: `${(value / Math.max(...metric.data)) * 100}%` }}
                              transition={{ duration: 0.8, delay: 0.8 + i * 0.1 }}
                              whileHover={{ opacity: 0.8 }}
                            />
                          ))}
                        </div>
                        
                        {/* Insight */}
                        <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                            💡 {metric.insight}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Source: {metric.nasaSource}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* AI-Powered Climate Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-indigo-900/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="h-6 w-6 text-white" />
                      </motion.div>
                      <div>
                        <CardTitle className="text-2xl">🤖 AI Climate Intelligence</CardTitle>
                        <CardDescription className="text-base">
                          Machine learning insights from NASA Earth observations
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-sm px-4 py-2">
                      <Zap className="h-4 w-4 mr-1" />
                      Powered by AI
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {climateInsights.map((insight, index) => (
                      <motion.div
                        key={insight.title}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 1.0 + index * 0.15 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="relative overflow-hidden"
                      >
                        <div className="p-5 bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-300">
                          {/* Gradient Accent */}
                          <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${insight.gradient}`} />
                          
                          <div className="flex items-start justify-between mb-3">
                            <motion.div
                              className={`p-2.5 bg-gradient-to-br ${insight.gradient} rounded-lg`}
                              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                              transition={{ duration: 0.5 }}
                            >
                              <insight.icon className="h-5 w-5 text-white" />
                            </motion.div>
                            <Badge 
                              className={`${
                                insight.severity === 'critical' ? 'bg-red-100 text-red-700 border-red-300' :
                                insight.severity === 'high' ? 'bg-orange-100 text-orange-700 border-orange-300' :
                                'bg-blue-100 text-blue-700 border-blue-300'
                              }`}
                            >
                              {insight.severity}
                            </Badge>
                          </div>
                          
                          <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">
                            {insight.title}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                            {insight.description}
                          </p>
                          
                          <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-500">Affected Population:</span>
                              <span className="font-bold text-slate-900 dark:text-slate-100">{insight.affected}</span>
                            </div>
                            <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <p className="text-xs text-blue-900 dark:text-blue-100 font-medium">
                                ✓ {insight.recommendation}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Detailed Analytics Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Advanced Temperature Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <Card className="border-2 hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-b">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg">
                        <Thermometer className="h-5 w-5 text-white" />
                      </div>
                      Urban Heat Island Analysis
                    </CardTitle>
                    <CardDescription>
                      MODIS Land Surface Temperature • 1km Resolution
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="h-64 flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/10 dark:via-orange-900/10 dark:to-yellow-900/10 rounded-xl border-2 border-red-200 dark:border-red-800 relative overflow-hidden">
                      {/* Animated Heat Waves */}
                      <motion.div
                        className="absolute inset-0 opacity-20"
                        animate={{
                          background: [
                            'radial-gradient(circle at 20% 30%, red 0%, transparent 50%)',
                            'radial-gradient(circle at 80% 70%, orange 0%, transparent 50%)',
                            'radial-gradient(circle at 50% 50%, red 0%, transparent 50%)',
                          ]
                        }}
                        transition={{ duration: 5, repeat: Infinity }}
                      />
                      
                      <div className="relative z-10 text-center">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Flame className="h-16 w-16 mx-auto mb-3 text-red-500" />
                        </motion.div>
                        <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                          Temperature Heatmap Visualization
                        </p>
                        <p className="text-sm text-slate-500 mt-2">
                          6.2°C urban-rural temperature differential detected
                        </p>
                        <div className="flex items-center justify-center gap-2 mt-3">
                          <Badge className="bg-red-500 text-white">Hot Zones: 8</Badge>
                          <Badge className="bg-orange-500 text-white">Moderate: 12</Badge>
                          <Badge className="bg-green-500 text-white">Cool: 4</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                        <div className="text-2xl font-black text-red-600">42.8°C</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Peak LST</div>
                        <div className="text-xs font-semibold text-red-600 mt-1">Tejgaon Zone</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <div className="text-2xl font-black text-blue-600">28.3°C</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Min LST</div>
                        <div className="text-xs font-semibold text-blue-600 mt-1">Parks Area</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                        <div className="text-2xl font-black text-orange-600">36.5°C</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">City Avg</div>
                        <div className="text-xs font-semibold text-orange-600 mt-1">All Districts</div>
                      </div>
                    </div>
                    
                    {/* Top Hot Zones */}
                    <div className="mt-6 space-y-2">
                      <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-3">🔥 Critical Heat Zones</h4>
                      {[
                        { name: "Tejgaon Industrial", temp: "42.8°C", pop: "485K", risk: "Critical" },
                        { name: "Mirpur DOHS", temp: "41.2°C", pop: "620K", risk: "High" },
                        { name: "Uttara Commercial", temp: "40.5°C", pop: "380K", risk: "High" }
                      ].map((zone, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="font-medium text-sm text-slate-900 dark:text-slate-100">{zone.name}</div>
                            <Badge variant="outline" className="text-xs">{zone.pop} residents</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-red-600">{zone.temp}</span>
                            <Badge className="bg-red-100 text-red-700 border-red-300 text-xs">{zone.risk}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Flood & Precipitation Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.3 }}
              >
                <Card className="border-2 hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-b">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                        <Waves className="h-5 w-5 text-white" />
                      </div>
                      Flood Risk & GPM Data
                    </CardTitle>
                    <CardDescription>
                      Global Precipitation Measurement • 10km/30-min
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 dark:from-blue-900/10 dark:via-cyan-900/10 dark:to-indigo-900/10 rounded-xl border-2 border-blue-200 dark:border-blue-800 relative overflow-hidden">
                      {/* Animated Water Ripples */}
                      <motion.div
                        className="absolute inset-0 opacity-20"
                        animate={{
                          background: [
                            'radial-gradient(circle at 30% 40%, blue 0%, transparent 50%)',
                            'radial-gradient(circle at 70% 60%, cyan 0%, transparent 50%)',
                            'radial-gradient(circle at 50% 50%, blue 0%, transparent 50%)',
                          ]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                      />
                      
                      <div className="relative z-10 text-center">
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Cloud className="h-16 w-16 mx-auto mb-3 text-blue-500" />
                        </motion.div>
                        <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                          Precipitation & Flood Risk Map
                        </p>
                        <p className="text-sm text-slate-500 mt-2">
                          280mm forecasted in next 72 hours
                        </p>
                        <div className="flex items-center justify-center gap-2 mt-3">
                          <Badge className="bg-red-500 text-white">High Risk: 3</Badge>
                          <Badge className="bg-orange-500 text-white">Medium: 8</Badge>
                          <Badge className="bg-green-500 text-white">Low: 13</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <div className="text-2xl font-black text-blue-600">7.2/10</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Flood Score</div>
                        <div className="text-xs font-semibold text-blue-600 mt-1">City Average</div>
                      </div>
                      <div className="text-center p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl border border-cyan-200 dark:border-cyan-800">
                        <div className="text-2xl font-black text-cyan-600">1.53M</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">At Risk</div>
                        <div className="text-xs font-semibold text-cyan-600 mt-1">Population</div>
                      </div>
                      <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                        <div className="text-2xl font-black text-indigo-600">$28.5M</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Economic Loss</div>
                        <div className="text-xs font-semibold text-indigo-600 mt-1">Annual</div>
                      </div>
                    </div>
                    
                    {/* Critical Flood Zones */}
                    <div className="mt-6 space-y-2">
                      <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-3">🌊 Critical Flood Zones</h4>
                      {[
                        { name: "Jatrabari-Demra", score: "9.2/10", depth: "1.8m", pop: "680K" },
                        { name: "Keraniganj South", score: "8.5/10", depth: "1.5m", pop: "420K" },
                        { name: "Hazaribagh Industrial", score: "8.1/10", depth: "1.2m", pop: "310K" }
                      ].map((zone, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="font-medium text-sm text-slate-900 dark:text-slate-100">{zone.name}</div>
                            <Badge variant="outline" className="text-xs">{zone.pop}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-600">Depth: {zone.depth}</span>
                            <Badge className="bg-red-100 text-red-700 border-red-300 text-xs">{zone.score}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Real-Time Earth Observation Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4 }}
            >
              <Card className="border-2 border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-blue-900/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      >
                        <Globe className="h-6 w-6 text-white" />
                      </motion.div>
                      <div>
                        <CardTitle className="text-2xl">🌍 Real-Time Earth Observation</CardTitle>
                        <CardDescription className="text-base">
                          Live satellite tracking and data acquisition status
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500 text-white border-0">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        All Systems Operational
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Satellite Pass Schedule */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Satellite className="h-5 w-5 text-indigo-600" />
                        Next Satellite Passes (Dhaka)
                      </h4>
                      <div className="space-y-2">
                        {[
                          { sat: "Terra MODIS", time: "43 min", elevation: "78°", direction: "N→S", quality: "Excellent" },
                          { sat: "NPP VIIRS", time: "72 min", elevation: "62°", direction: "S→N", quality: "Good" },
                          { sat: "Aqua MODIS", time: "98 min", elevation: "81°", direction: "N→S", quality: "Excellent" },
                          { sat: "NOAA-20 VIIRS", time: "2h 15m", elevation: "55°", direction: "S→N", quality: "Good" }
                        ].map((pass, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.6 + i * 0.1 }}
                            className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                              >
                                <Satellite className="h-4 w-4 text-indigo-600" />
                              </motion.div>
                              <div>
                                <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">{pass.sat}</div>
                                <div className="text-xs text-slate-500">
                                  {pass.elevation} elevation • {pass.direction}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-indigo-600">{pass.time}</div>
                              <Badge variant="outline" className="text-xs mt-1">{pass.quality}</Badge>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Data Acquisition Statistics */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Database className="h-5 w-5 text-purple-600" />
                        Data Acquisition (Last 24H)
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "Images Captured", value: "342", change: "+12%", color: "blue" },
                          { label: "Data Volume", value: "2.8 TB", change: "+8%", color: "purple" },
                          { label: "Coverage Quality", value: "96.2%", change: "+2.1%", color: "green" },
                          { label: "Cloud-Free", value: "78%", change: "-4%", color: "cyan" }
                        ].map((stat, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.8 + i * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className={`p-4 bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 dark:from-${stat.color}-900/20 dark:to-${stat.color}-900/30 rounded-xl border-2 border-${stat.color}-200 dark:border-${stat.color}-800`}
                          >
                            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">{stat.label}</div>
                            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{stat.value}</div>
                            <div className={`text-xs font-semibold mt-1 ${
                              stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {stat.change} vs yesterday
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* Processing Status */}
                      <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Data Processing Pipeline</span>
                          <Badge className="bg-green-100 text-green-700 border-green-300">Active</Badge>
                        </div>
                        <div className="space-y-2">
                          {[
                            { stage: "Raw Data Ingestion", progress: 100, status: "complete" },
                            { stage: "Atmospheric Correction", progress: 85, status: "processing" },
                            { stage: "Geospatial Analysis", progress: 62, status: "processing" },
                            { stage: "AI Model Inference", progress: 45, status: "processing" }
                          ].map((stage, i) => (
                            <div key={i}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-slate-600 dark:text-slate-400">{stage.stage}</span>
                                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">{stage.progress}%</span>
                              </div>
                              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <motion.div
                                  className={`h-full ${
                                    stage.status === 'complete' ? 'bg-green-500' : 'bg-indigo-500'
                                  }`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${stage.progress}%` }}
                                  transition={{ duration: 1, delay: 2.0 + i * 0.2 }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enhanced Metrics Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.5 }}
            >
              <MetricsGrid detailed />
            </motion.div>

            {/* Footer Attribution */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.6 }}
              className="text-center py-8"
            >
              <div className="flex items-center justify-center gap-3 text-slate-600 dark:text-slate-400">
                <Satellite className="h-5 w-5" />
                <span className="text-sm font-medium">
                  Powered by NASA Earth Observations • Data Sources: MODIS, VIIRS, GPM, LANDSAT, MERRA-2, OMI
                </span>
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                Real-time climate intelligence for Dhaka • Updated every 30 minutes • All times in Bangladesh Standard Time (BST)
              </p>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
