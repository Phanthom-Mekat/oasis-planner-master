"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/dashboard/Sidebar";
import ProjectsList from "@/components/dashboard/ProjectsList";
import NotificationSystem from "@/components/ui/notification-system";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { 
  FolderOpen, 
  Plus,
  Filter,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Globe,
  Bell,
  Search,
  Menu
} from "lucide-react";

export default function ProjectsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filter, setFilter] = useState("all");
  const { selectedCity } = useAppStore();

  const projectStats = [
    {
      title: "Active Projects",
      value: "12",
      change: "+3 this month",
      icon: FolderOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Completed",
      value: "8",
      change: "+2 this month",
      icon: CheckCircle,
      color: "text-green-600", 
      bgColor: "bg-green-50"
    },
    {
      title: "In Planning",
      value: "5",
      change: "+1 this week",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "At Risk", 
      value: "2",
      change: "Needs attention",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    }
  ];

  const recentProjects = [
    {
      id: 1,
      name: "Urban Forest Initiative",
      description: "Planting 1,000 trees across downtown area",
      status: "active",
      progress: 65,
      budget: "$125,000",
      timeline: "6 months",
      team: 8,
      location: "Downtown District",
      impact: "15% temperature reduction"
    },
    {
      id: 2,
      name: "Cool Roof Program",
      description: "Installing reflective roofing on 50 buildings",
      status: "planning", 
      progress: 25,
      budget: "$89,000",
      timeline: "4 months",
      team: 5,
      location: "Industrial Zone",
      impact: "8% cooling effect"
    },
    {
      id: 3,
      name: "Green Corridor Development",
      description: "Creating connected green spaces and bike lanes",
      status: "active",
      progress: 80,
      budget: "$275,000", 
      timeline: "12 months",
      team: 12,
      location: "City-wide",
      impact: "25% carbon reduction"
    }
  ];

  const filterOptions = [
    { label: "All Projects", value: "all" },
    { label: "Active", value: "active" },
    { label: "Planning", value: "planning" },
    { label: "Completed", value: "completed" },
    { label: "At Risk", value: "at-risk" }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'at-risk': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
                  Project Management
                </h1>
                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                  <Globe className="h-4 w-4" />
                  <span>{selectedCity.name}, {selectedCity.country}</span>
                  <Badge variant="outline" className="text-xs">
                    27 Total Projects
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 rounded-lg px-3 py-2">
                <Search className="h-4 w-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search projects..."
                  className="bg-transparent text-sm outline-none w-48 text-slate-900 dark:text-slate-100"
                />
              </div>
              
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
              
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
            {/* Project Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {projectStats.map((stat, index) => (
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

            {/* Filter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Filter className="h-4 w-4 text-slate-500" />
                      <span className="text-sm font-medium">Filter Projects:</span>
                      <div className="flex space-x-1">
                        {filterOptions.map((option) => (
                          <Button
                            key={option.value}
                            variant={filter === option.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter(option.value)}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Timeline View
                      </Button>
                      <Button variant="outline" size="sm">
                        <MapPin className="h-4 w-4 mr-2" />
                        Map View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Projects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Recent Projects</CardTitle>
                  <CardDescription>
                    Latest climate action projects in your region
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                {project.name}
                              </h3>
                              <Badge className={getStatusColor(project.status)}>
                                {project.status}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {project.progress}% Complete
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                              {project.description}
                            </p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-slate-500">Budget:</span>
                                <div className="font-medium">{project.budget}</div>
                              </div>
                              <div>
                                <span className="text-slate-500">Timeline:</span>
                                <div className="font-medium">{project.timeline}</div>
                              </div>
                              <div>
                                <span className="text-slate-500">Team:</span>
                                <div className="font-medium flex items-center">
                                  <Users className="h-4 w-4 mr-1" />
                                  {project.team} members
                                </div>
                              </div>
                              <div>
                                <span className="text-slate-500">Impact:</span>
                                <div className="font-medium text-green-600">{project.impact}</div>
                              </div>
                            </div>
                            
                            <div className="mt-3 flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-slate-400" />
                              <span className="text-sm text-slate-600">{project.location}</span>
                            </div>
                          </div>
                          
                          <div className="ml-4">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-slate-500">Progress</span>
                            <span className="text-slate-700 dark:text-slate-300">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Full Projects List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <ProjectsList />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
