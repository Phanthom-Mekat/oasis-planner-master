'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Leaf, 
  TreePine, 
  Droplets, 
  Recycle, 
  Home,
  Building,
  Plus,
  MoreHorizontal,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Brain,
  Zap,
  Eye,
  Filter,
  ArrowUpDown,
  Satellite
} from 'lucide-react';

export default function ProjectsList() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("priority");
  const [showInsights, setShowInsights] = useState(true);

  const projects = [
    {
      id: 1,
      title: "Mirpur-Uttara Urban Forest Belt",
      description: "1.25M residents • NASA MODIS shows -2.8°C potential reduction",
      impact: "15,500 trees • 1.25M served",
      status: "active",
      progress: 78,
      icon: TreePine,
      color: "text-green-600",
      budget: 825000,
      budgetUsed: 643500,
      deadline: "2025-03-15",
      team: ["Dr. Rahman", "Sultana Ahmed", "Karim Hassan"],
      priority: "critical",
      location: "Mirpur to Uttara Corridor",
      nasaData: "MODIS Thermal, LANDSAT 8/9",
      aiInsights: {
        riskLevel: "low",
        completion: "78% complete - ahead of schedule",
        budget: "22% under budget ($181,500 saved)",
        communityEngagement: "1,247 community seeds • 94% approval",
        nasaValidation: "NDVI improvement detected in phase 1 areas"
      },
      milestones: [
        { name: "NASA baseline data collection", completed: true, date: "2024-08-01" },
        { name: "Phase 1: Mirpur planting (5,000 trees)", completed: true, date: "2024-09-15" },
        { name: "Phase 2: Cantonment area (6,500 trees)", completed: true, date: "2024-11-30" },
        { name: "Phase 3: Uttara expansion (4,000 trees)", completed: false, date: "2025-02-15" },
        { name: "MODIS impact validation", completed: false, date: "2025-03-15" }
      ],
      metrics: {
        temperature_reduction: "-2.8°C (projected)",
        population_served: "1.25M residents",
        co2_sequestration: "1,850 tons/year",
        humidity_increase: "+15%",
        community_seeds: 1247,
        nasaConfidence: "92%"
      }
    },
    {
      id: 2,
      title: "Flood Mitigation - Jatrabari-Demra",
      description: "485K residents • GPM data shows 72-73mm critical rainfall",
      impact: "485K protected • Smart drainage",
      status: "active",
      progress: 62,
      icon: Droplets,
      color: "text-blue-600",
      budget: 1250000,
      budgetUsed: 775000,
      deadline: "2025-06-01",
      team: ["Dr. Nasrin Islam", "Hossain Mahmud"],
      priority: "critical",
      location: "Jatrabari-Demra Corridor",
      nasaData: "GPM Precipitation, MODIS Flood Mapping",
      aiInsights: {
        riskLevel: "high",
        completion: "62% complete - critical timeline",
        budget: "On track ($475K remaining)",
        communityEngagement: "892 seeds • 89% approval",
        nasaValidation: "GPM shows consistent 70+ mm rainfall events"
      },
      milestones: [
        { name: "GPM rainfall pattern analysis", completed: true, date: "2024-07-15" },
        { name: "Smart sensor network installation", completed: true, date: "2024-10-15" },
        { name: "Drainage infrastructure upgrade", completed: false, date: "2025-03-30" },
        { name: "IoT monitoring system", completed: false, date: "2025-05-15" },
        { name: "Community early warning setup", completed: false, date: "2025-06-01" }
      ],
      metrics: {
        population_protected: "485K residents",
        flood_reduction: "-65% (projected)",
        drainage_capacity: "+180%",
        early_warning: "Real-time alerts",
        community_seeds: 892,
        nasaConfidence: "88%"
      }
    },
    {
      id: 3,
      title: "Air Quality Improvement - Tejgaon Industrial",
      description: "490K residents • MERRA-2 shows AQI 185 reduction to 150",
      impact: "490K served • -35 AQI points",
      status: "active",
      progress: 55,
      icon: Recycle,
      color: "text-purple-600",
      budget: 580000,
      budgetUsed: 319000,
      deadline: "2025-08-30",
      team: ["Dr. Akter", "Rahman Khan", "Sultana Begum"],
      priority: "high",
      location: "Tejgaon Industrial Zone",
      nasaData: "MERRA-2, OMI, VIIRS",
      aiInsights: {
        riskLevel: "medium",
        completion: "55% complete - on schedule",
        budget: "45% remaining ($261K)",
        communityEngagement: "756 seeds • 87% support",
        nasaValidation: "OMI detects high aerosol optical depth"
      },
      milestones: [
        { name: "MERRA-2 baseline assessment", completed: true, date: "2024-06-01" },
        { name: "Green buffer zone creation", completed: true, date: "2024-09-15" },
        { name: "Industrial filtration systems", completed: false, date: "2025-03-30" },
        { name: "Air quality monitoring network", completed: false, date: "2025-06-15" },
        { name: "NASA OMI validation study", completed: false, date: "2025-08-30" }
      ],
      metrics: {
        aqi_reduction: "AQI 185→150 (target)",
        pm25_reduction: "-35%",
        population_served: "490K residents",
        green_buffer: "25 hectares",
        community_seeds: 756,
        nasaConfidence: "85%"
      }
    },
    {
      id: 4,
      title: "Green Rooftops - Gulshan-Banani",
      description: "515K residents • LANDSAT shows -3.2°C cooling potential",
      impact: "2,800 rooftops • 515K served",
      status: "active",
      progress: 68,
      icon: Home,
      color: "text-orange-600",
      budget: 680000,
      budgetUsed: 462400,
      deadline: "2025-04-30",
      team: ["Fatima Khatun", "Jamal Ahmed", "Nazma Begum"],
      priority: "high",
      location: "Gulshan-Banani Residential",
      nasaData: "LANDSAT 8/9 Thermal, MODIS LST",
      aiInsights: {
        riskLevel: "low",
        completion: "68% complete - on track",
        budget: "32% remaining ($217.6K)",
        communityEngagement: "2,156 seeds • 96% approval",
        nasaValidation: "LANDSAT thermal shows -2.1°C in completed zones"
      },
      milestones: [
        { name: "LANDSAT thermal baseline study", completed: true, date: "2024-06-15" },
        { name: "Phase 1: 1,200 rooftops (Gulshan)", completed: true, date: "2024-11-30" },
        { name: "Phase 2: 1,600 rooftops (Banani)", completed: false, date: "2025-03-15" },
        { name: "MODIS validation & monitoring", completed: false, date: "2025-04-30" }
      ],
      metrics: {
        rooftops_completed: "2,800 buildings",
        temperature_reduction: "-3.2°C (projected)",
        energy_savings: "+42%",
        population_served: "515K residents",
        community_seeds: 2156,
        nasaConfidence: "94%"
      }
    },
    {
      id: 5,
      title: "Cool Pavement - Motijheel to Gulshan",
      description: "605K residents • MODIS thermal shows -2.1°C reduction potential",
      impact: "18.5 km corridor • 605K served",
      status: "planning",
      progress: 28,
      icon: Building,
      color: "text-slate-600",
      budget: 485000,
      budgetUsed: 135800,
      deadline: "2025-09-15",
      team: ["Kamal Hossain", "Rupa Das"],
      priority: "medium",
      location: "Motijheel-Gulshan Transport Corridor",
      nasaData: "MODIS LST, VIIRS Nighttime",
      aiInsights: {
        riskLevel: "medium",
        completion: "28% complete - planning phase",
        budget: "72% remaining ($349.2K)",
        communityEngagement: "290 seeds • 68% awareness",
        nasaValidation: "VIIRS shows high traffic density - heat correlation"
      },
      milestones: [
        { name: "MODIS thermal corridor assessment", completed: true, date: "2024-09-01" },
        { name: "Traffic flow analysis (VIIRS)", completed: true, date: "2024-10-15" },
        { name: "Phase 1: Motijheel section (6 km)", completed: false, date: "2025-04-30" },
        { name: "Phase 2: Kawran Bazar (5 km)", completed: false, date: "2025-07-15" },
        { name: "Phase 3: Gulshan corridor (7.5 km)", completed: false, date: "2025-09-15" }
      ],
      metrics: {
        corridor_length: "18.5 km",
        temperature_reduction: "-2.1°C (projected)",
        albedo_increase: "+45%",
        population_served: "605K residents",
        community_seeds: 290,
        nasaConfidence: "81%"
      }
    }
  ];

  const statusColors = {
    active: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    planning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
  };

  const priorityColors = {
    critical: "bg-red-600 text-white border-red-700 font-bold shadow-lg",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200", 
    low: "bg-green-100 text-green-800 border-green-200"
  };

  const getRiskColor = (level) => {
    switch (level) {
      case "none": return "text-green-600";
      case "low": return "text-green-600";
      case "medium": return "text-yellow-600";
      case "high": return "text-red-600";
      default: return "text-slate-600";
    }
  };

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => filterStatus === "all" || project.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "progress":
          return b.progress - a.progress;
        case "deadline":
          return new Date(a.deadline) - new Date(b.deadline);
        case "budget":
          return b.budget - a.budget;
        default:
          return 0;
      }
    });

  // Calculate summary stats
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalBudgetUsed = projects.reduce((sum, p) => sum + p.budgetUsed, 0);
  const avgProgress = projects.reduce((sum, p) => sum + p.progress, 0) / projects.length;
  const completedProjects = projects.filter(p => p.status === "completed").length;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Project Portfolio
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1">
            {filteredProjects.length} projects • ${totalBudgetUsed.toLocaleString()} of ${totalBudget.toLocaleString()} used
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline" 
            size="sm"
            onClick={() => setShowInsights(!showInsights)}
            className={showInsights ? "bg-purple-50 border-purple-200 text-purple-700" : ""}
          >
            <Brain className="h-4 w-4 mr-1" />
            AI Insights
          </Button>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New Project
          </Button>
        </div>
      </div>

      {/* Summary Cards - Dhaka Climate Initiatives */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold">Dhaka Residents Served</p>
              <p className="text-xl font-bold mt-1 text-blue-900 dark:text-blue-100">3.84M</p>
              <p className="text-[10px] text-blue-600/70 dark:text-blue-400/70 mt-0.5">across 5 projects</p>
            </div>
            <Users className="h-7 w-7 text-blue-600 dark:text-blue-400" />
          </div>
        </Card>
        <Card className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-700 dark:text-green-300 font-semibold">NASA Data Confidence</p>
              <p className="text-xl font-bold text-green-600 mt-1">88%</p>
              <p className="text-[10px] text-green-600/70 dark:text-green-400/70 mt-0.5">8 satellite datasets</p>
            </div>
            <Satellite className="h-7 w-7 text-green-600 dark:text-green-400" />
          </div>
        </Card>
        <Card className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-700 dark:text-purple-300 font-semibold">Avg Progress</p>
              <p className="text-xl font-bold mt-1 text-purple-900 dark:text-purple-100">{Math.round(avgProgress)}%</p>
              <p className="text-[10px] text-purple-600/70 dark:text-purple-400/70 mt-0.5">on schedule</p>
            </div>
            <TrendingUp className="h-7 w-7 text-purple-600 dark:text-purple-400" />
          </div>
        </Card>
        <Card className="p-3 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-orange-700 dark:text-orange-300 font-semibold">Total Budget</p>
              <p className="text-xl font-bold mt-1 text-orange-900 dark:text-orange-100">${(totalBudget/1000000).toFixed(2)}M</p>
              <p className="text-[10px] text-orange-600/70 dark:text-orange-400/70 mt-0.5">{Math.round((totalBudgetUsed/totalBudget)*100)}% allocated</p>
            </div>
            <DollarSign className="h-7 w-7 text-orange-600 dark:text-orange-400" />
          </div>
        </Card>
      </div>

      {/* Filters & Sorting */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-gray-500" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
              <SelectItem value="deadline">Deadline</SelectItem>
              <SelectItem value="budget">Budget</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredProjects.map((project) => {
            const IconComponent = project.icon;
            const isSelected = selectedProject === project.id;
            
            return (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isSelected 
                      ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800' 
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedProject(isSelected ? null : project.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 ${project.color}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-base font-bold text-gray-900 dark:text-white">
                              {project.title}
                            </h4>
                            <Badge className={`${priorityColors[project.priority]} text-xs font-semibold`}>
                              {project.priority}
                            </Badge>
                            <Badge className={`${statusColors[project.status]} text-xs font-semibold`}>
                              {project.status}
                            </Badge>
                          </div>
                          
                          <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-2">
                            {project.description}
                          </p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                            <div>
                              <span className="text-gray-500 font-medium">Impact:</span>
                              <div className="font-semibold text-gray-900 dark:text-white mt-0.5">{project.impact}</div>
                            </div>
                            <div>
                              <span className="text-gray-500 font-medium">Budget:</span>
                              <div className="font-semibold text-gray-900 dark:text-white mt-0.5">${project.budgetUsed.toLocaleString()} / ${project.budget.toLocaleString()}</div>
                            </div>
                            <div>
                              <span className="text-gray-500 font-medium">Deadline:</span>
                              <div className="font-semibold text-gray-900 dark:text-white mt-0.5">{new Date(project.deadline).toLocaleDateString()}</div>
                            </div>
                            <div>
                              <span className="text-gray-500 font-medium">Team:</span>
                              <div className="font-semibold text-gray-900 dark:text-white mt-0.5">{project.team.length} members</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    {/* AI Insights */}
                    {showInsights && (
                      <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="h-4 w-4 text-purple-600" />
                          <span className="text-xs font-bold text-purple-700 dark:text-purple-300">AI Insights</span>
                          <div className={`text-xs font-semibold ${getRiskColor(project.aiInsights.riskLevel)}`}>
                            Risk: {project.aiInsights.riskLevel}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-purple-600">Status:</span> {project.aiInsights.completion}
                          </div>
                          <div>
                            <span className="text-purple-600">Budget:</span> {project.aiInsights.budget}
                          </div>
                          <div className="md:col-span-2">
                            <span className="text-purple-600">Community:</span> {project.aiInsights.communityEngagement}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Expanded Details */}
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 border-t pt-4"
                      >
                        <Tabs defaultValue="milestones" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="milestones">Milestones</TabsTrigger>
                            <TabsTrigger value="metrics">Metrics</TabsTrigger>
                            <TabsTrigger value="team">Team</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="milestones" className="space-y-2 mt-4">
                            {project.milestones.map((milestone, index) => (
                              <div key={index} className="flex items-center gap-3 p-2 rounded border">
                                {milestone.completed ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Clock className="h-4 w-4 text-gray-400" />
                                )}
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{milestone.name}</div>
                                  <div className="text-xs text-gray-500">{milestone.date}</div>
                                </div>
                              </div>
                            ))}
                          </TabsContent>
                          
                          <TabsContent value="metrics" className="grid grid-cols-2 gap-4 mt-4">
                            {Object.entries(project.metrics).map(([key, value]) => (
                              <div key={key} className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                <div className="text-xs text-gray-500 uppercase">{key.replace('_', ' ')}</div>
                                <div className="font-medium">{value}</div>
                              </div>
                            ))}
                          </TabsContent>
                          
                          <TabsContent value="team" className="space-y-2 mt-4">
                            {project.team.map((member, index) => (
                              <div key={index} className="flex items-center gap-3 p-2 rounded border">
                                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                  {member.split(' ').map(n => n[0]).join('')}
                                </div>
                                <span className="font-medium">{member}</span>
                              </div>
                            ))}
                          </TabsContent>
                        </Tabs>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
