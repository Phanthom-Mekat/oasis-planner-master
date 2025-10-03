"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/dashboard/Sidebar";
import EnhancedLeafletMap from "@/components/dashboard/EnhancedLeafletMap";
import { GroundTruthingSystem } from "@/components/ui/ground-truthing-system";
import { FieldOpsDemo } from "@/components/ui/field-ops-demo";
import NotificationSystem from "@/components/ui/notification-system";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/lib/store";
import { useClimateData } from "@/hooks/useClimateData";
import { 
  Smartphone, 
  Camera, 
  MapPin, 
  Users, 
  CheckCircle,
  AlertTriangle,
  Globe,
  Bell,
  Search,
  Menu,
  Upload,
  Download,
  Target,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  MessageSquare,
  Star,
  Clock,
  Zap,
  QrCode,
  Wifi
} from "lucide-react";

export default function FieldOpsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("mobile");
  const { selectedCity, addNotification } = useAppStore();
  const { data: climateData } = useClimateData();

  // Field data collection stats
  const fieldStats = [
    {
      title: "Reports Today",
      value: "47",
      change: "+12 vs yesterday",
      icon: Upload,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Validators",
      value: "123",
      change: "+8 this week",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Data Accuracy",
      value: "94.2%",
      change: "+2.1% improvement",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Coverage Areas",
      value: "28",
      change: "5 new districts",
      icon: MapPin,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  // Recent field reports
  const recentReports = [
    {
      id: 1,
      type: "temperature",
      location: "Downtown Plaza",
      value: "38.5°C",
      reporter: "Maria Santos",
      timestamp: "15 min ago",
      status: "validated",
      confidence: 95,
      icon: Thermometer,
      color: "text-red-500"
    },
    {
      id: 2,
      type: "flood",
      location: "River District",
      value: "Standing water 15cm",
      reporter: "Ahmed Hassan",
      timestamp: "32 min ago",
      status: "pending",
      confidence: 87,
      icon: Droplets,
      color: "text-blue-500"
    },
    {
      id: 3,
      type: "air_quality",
      location: "Industrial Zone",
      value: "AQI 156 (Unhealthy)",
      reporter: "Dr. Chen Liu",
      timestamp: "1 hour ago",
      status: "validated",
      confidence: 98,
      icon: Wind,
      color: "text-gray-500"
    }
  ];

  const validationTasks = [
    {
      id: 1,
      type: "Heat Island Detection",
      location: "Central Business District",
      priority: "high",
      reports: 8,
      deadline: "2 hours",
      status: "pending"
    },
    {
      id: 2,
      type: "Green Space Monitoring",
      location: "Riverside Park",
      priority: "medium",
      reports: 3,
      deadline: "1 day",
      status: "in_progress"
    },
    {
      id: 3,
      type: "Flood Risk Assessment",
      location: "Eastside Neighborhoods",
      priority: "high",
      reports: 12,
      deadline: "4 hours",
      status: "pending"
    }
  ];

  useEffect(() => {
    // Welcome notification
    addNotification({
      type: "info",
      title: "Field Operations Active",
      message: `123 validators are currently collecting data in ${selectedCity.name}`,
      autoRemove: true
    });
  }, [addNotification, selectedCity.name]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'validated': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      <NotificationSystem />
      
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} />
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Field Operations
                </h1>
                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                  <Globe className="h-4 w-4" />
                  <span>{selectedCity.name}, {selectedCity.country}</span>
                  <Badge variant="outline" className="text-xs">
                    123 Active Validators
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs p-0 flex items-center justify-center">
                  {validationTasks.filter(t => t.status === 'pending').length}
                </Badge>
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Field Operations Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {fieldStats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                          <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {stat.value}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {stat.title}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {stat.change}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Main Field Operations Interface */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Left Column - Field Data Collection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="xl:col-span-2 space-y-6"
              >
                {/* Field Data Collection Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="mobile">Mobile Collection</TabsTrigger>
                    <TabsTrigger value="validation">Data Validation</TabsTrigger>
                    <TabsTrigger value="reports">Field Reports</TabsTrigger>
                  </TabsList>

                  <TabsContent value="mobile" className="space-y-4">
                    <FieldOpsDemo />
                  </TabsContent>

                  <TabsContent value="validation" className="space-y-4">
                    <GroundTruthingSystem />
                  </TabsContent>

                  <TabsContent value="reports" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Field Reports</CardTitle>
                        <CardDescription>
                          Real-time data collected by community validators
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recentReports.map((report) => (
                            <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800`}>
                                  <report.icon className={`h-4 w-4 ${report.color}`} />
                                </div>
                                <div>
                                  <div className="font-medium text-slate-900 dark:text-slate-100">
                                    {report.value}
                                  </div>
                                  <div className="text-sm text-slate-600 dark:text-slate-400">
                                    {report.location} • by {report.reporter}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    {report.timestamp}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={getStatusColor(report.status)}>
                                  {report.status}
                                </Badge>
                                <div className="text-xs text-slate-500">
                                  {report.confidence}% confidence
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Interactive Map with Field Data */}
                <Card>
                  <CardHeader>
                    <CardTitle>Field Data Map</CardTitle>
                    <CardDescription>
                      Real-time visualization of community-collected data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EnhancedLeafletMap mode="field_ops" />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Right Column - Validation Tasks */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="space-y-6"
              >
                {/* Validation Queue */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Validation Queue
                    </CardTitle>
                    <CardDescription>
                      Pending data validation tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {validationTasks.map((task) => (
                        <div key={task.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-slate-900 dark:text-slate-100">
                              {task.type}
                            </h4>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            {task.location}
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">
                              {task.reports} reports • Due in {task.deadline}
                            </span>
                            <Badge className={getStatusColor(task.status)}>
                              {task.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <Button size="sm" className="w-full mt-2">
                            Validate Data
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full justify-start">
                      <Camera className="h-4 w-4 mr-2" />
                      Report New Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <MapPin className="h-4 w-4 mr-2" />
                      Set Validation Zone
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Invite Validators
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Export Field Data
                    </Button>
                  </CardContent>
                </Card>

                {/* Real-time Climate Alert */}
                {climateData && climateData.temperature.current > 35 && (
                  <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-red-100 dark:bg-red-800 rounded-full">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-red-900 dark:text-red-100">
                            Heat Emergency - Field Priority
                          </h3>
                          <p className="text-sm text-red-700 dark:text-red-300">
                            Temperature {climateData.temperature.current.toFixed(1)}°C. 
                            Prioritize heat island validation reports.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
