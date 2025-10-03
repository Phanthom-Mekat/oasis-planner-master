"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Smartphone, 
  Camera, 
  MapPin, 
  TreePine, 
  Building2,
  Scan,
  CheckCircle,
  Clock,
  Users,
  Zap,
  Download,
  Upload,
  Wifi,
  Battery
} from "lucide-react";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { useToast } from "@/hooks/use-toast";

export function FieldOpsDemo() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeWorkers, setActiveWorkers] = useState(3);
  const { toast } = useToast();

  const fieldProjects = [
    {
      id: "park-alpha",
      name: "Riverside Park Installation",
      type: "Green Infrastructure",
      status: "In Progress",
      progress: 65,
      location: "District 4, Block 12A",
      assignedWorkers: [
        { id: 1, name: "Maria Santos", role: "Lead Technician" },
        { id: 2, name: "James Chen", role: "Environmental Specialist" }
      ],
      arFeatures: [
        "Tree placement overlay",
        "Irrigation system visualization",
        "Soil quality indicators"
      ],
      recentUpdates: [
        "15 oak trees planted and tagged",
        "Irrigation system 80% complete",
        "Soil sensors installed and active"
      ]
    },
    {
      id: "roof-beta",
      name: "Cool Roof Initiative",
      type: "Heat Reduction",
      status: "Verification",
      progress: 90,
      location: "Downtown Commercial Zone",
      assignedWorkers: [
        { id: 3, name: "Alex Rodriguez", role: "Installation Supervisor" }
      ],
      arFeatures: [
        "Temperature overlay",
        "Material verification",
        "Coverage completion map"
      ],
      recentUpdates: [
        "12 rooftops completed this week",
        "Temperature reduction verified",
        "Quality assurance photos uploaded"
      ]
    }
  ];

  const mobileFeatures = [
    {
      icon: Scan,
      title: "AR Project Overlay",
      description: "View proposed projects in augmented reality",
      status: "Active"
    },
    {
      icon: Camera,
      title: "Smart Asset Tagging",
      description: "QR code tracking for planted trees and infrastructure",
      status: "Active"
    },
    {
      icon: CheckCircle,
      title: "Progress Verification",
      description: "Photo-based completion confirmation",
      status: "Active"
    },
    {
      icon: Upload,
      title: "Real-time Sync",
      description: "Instant data upload to Oasis Platform",
      status: "Connected"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-800 rounded-xl">
                <Smartphone className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-green-900 dark:text-green-100">
                  Oasis Field Ops - Companion App Demo
                </CardTitle>
                <CardDescription className="text-green-700 dark:text-green-300">
                  Bridging digital planning with real-world implementation
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="border-green-600 text-green-600">
              Concept Demo
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {mobileFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border"
              >
                <feature.icon className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-sm">{feature.title}</div>
                  <div className="text-xs text-slate-500">{feature.status}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Field Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {fieldProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {project.type === "Green Infrastructure" ? (
                      <TreePine className="h-5 w-5 text-green-600" />
                    ) : (
                      <Building2 className="h-5 w-5 text-blue-600" />
                    )}
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription>{project.location}</CardDescription>
                    </div>
                  </div>
                  <Badge 
                    variant={project.status === "In Progress" ? "default" : "secondary"}
                  >
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Project Progress</span>
                    <span className="text-sm text-slate-500">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <motion.div 
                      className="bg-green-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>

                {/* Assigned Workers */}
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Field Team
                  </h4>
                  <div className="space-y-2">
                    {project.assignedWorkers.map((worker) => (
                      <div key={worker.id} className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {worker.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{worker.name}</div>
                          <div className="text-xs text-slate-500">{worker.role}</div>
                        </div>
                        <div className="ml-auto">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AR Features */}
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Scan className="h-4 w-4" />
                    AR Features Active
                  </h4>
                  <div className="space-y-1">
                    {project.arFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-slate-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Updates */}
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recent Updates
                  </h4>
                  <div className="space-y-2">
                    {project.recentUpdates.map((update, index) => (
                      <div key={index} className="text-xs bg-slate-50 dark:bg-slate-800 p-2 rounded border-l-2 border-blue-500">
                        {update}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <EnhancedButton 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setSelectedProject(project.id);
                      toast({
                        title: "Map View Activated",
                        description: `Centering map view on ${project.name}`,
                        duration: 2000
                      });
                    }}
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    View on Map
                  </EnhancedButton>
                  <EnhancedButton 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Report Downloaded",
                        description: "Project progress report has been downloaded",
                        duration: 2000
                      });
                    }}
                  >
                    <Download className="h-3 w-3" />
                  </EnhancedButton>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Mobile App Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5 text-green-600" />
            Field Team Status
          </CardTitle>
          <CardDescription>
            Real-time connectivity and device status for field operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div>
                <div className="font-medium text-green-900 dark:text-green-100">Active Workers</div>
                <div className="text-2xl font-bold text-green-600">{activeWorkers}</div>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div>
                <div className="font-medium text-blue-900 dark:text-blue-100">Data Sync Rate</div>
                <div className="text-2xl font-bold text-blue-600">98.5%</div>
              </div>
              <Wifi className="h-8 w-8 text-blue-600" />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div>
                <div className="font-medium text-yellow-900 dark:text-yellow-100">Avg Battery</div>
                <div className="text-2xl font-bold text-yellow-600">78%</div>
              </div>
              <Battery className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Notice */}
      <Card className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
              <Zap className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <div className="font-medium text-purple-900 dark:text-purple-100">
                Field data automatically updates digital twin models
              </div>
              <div className="text-sm text-purple-700 dark:text-purple-300">
                Real-world progress feeds back into Oasis simulations for continuous learning
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
