"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, MapPin, DollarSign } from "lucide-react";

const projects = [
  {
    id: 1,
    name: "Downtown Green Corridor",
    description: "Linear park system connecting business district with residential areas",
    status: "Active",
    progress: 65,
    location: "Central Business District",
    budget: "$2.3M",
    timeline: "18 months"
  },
  {
    id: 2,
    name: "Riverside Flood Resilience",
    description: "Comprehensive flood management using natural infrastructure",
    status: "Planning",
    progress: 25,
    location: "Riverside District",
    budget: "$4.1M",
    timeline: "24 months"
  },
  {
    id: 3,
    name: "Community Heat Island Mitigation",
    description: "Neighborhood-scale cooling interventions in vulnerable areas",
    status: "Completed",
    progress: 100,
    location: "Eastside Neighborhoods",
    budget: "$850K",
    timeline: "12 months"
  }
];

const statusColors = {
  "Active": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  "Planning": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "Completed": "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
};

export default function ProjectsList() {
  return (
    <Card className="border-slate-200/60 dark:border-slate-700/60">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-slate-900 dark:text-slate-100">Projects</CardTitle>
            <CardDescription className="text-xs text-slate-600 dark:text-slate-400">
              Track climate resilience initiatives
            </CardDescription>
          </div>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-7 text-xs px-2">
            <Plus className="h-3 w-3 mr-1" />
            New Project
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 pt-0">
        {projects.map((project) => (
          <div key={project.id} className="p-2.5 border border-slate-200/60 dark:border-slate-700/60 rounded-lg hover:shadow-sm transition-all duration-200">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">{project.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                  {project.description}
                </p>
              </div>
              <Badge className={`ml-2 text-xs px-1.5 py-0.5 ${statusColors[project.status]}`}>
                {project.status}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{project.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  <span>{project.budget}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-1">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 h-1 rounded-full transition-all duration-300" 
                    style={{width: `${project.progress}%`}}
                  ></div>
                </div>
                <span className="text-xs font-medium">{project.progress}%</span>
              </div>
            </div>
          </div>
        ))}
        
        <Button variant="ghost" size="sm" className="w-full text-xs h-7 text-slate-600 dark:text-slate-400">
          <Eye className="h-3 w-3 mr-1" />
          View All Projects
        </Button>
      </CardContent>
    </Card>
  );
}
