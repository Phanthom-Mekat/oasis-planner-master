"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Users, Building, CheckCircle } from "lucide-react";
import { useAppStore } from "@/lib/store";

const personas = [
  {
    id: "planner",
    name: "Farah Ahmed",
    role: "Urban Planner",
    icon: User,
    description: "Technical professional designing climate-resilient infrastructure",
    features: [
      "Advanced simulation tools",
      "Technical data export",
      "GIS integration",
      "Detailed analytics"
    ],
    permissions: ["simulate", "analyze", "export", "advanced_tools"],
    color: "emerald"
  },
  {
    id: "mayor",
    name: "Mayor Rahman",
    role: "City Leader",
    icon: Building,
    description: "Executive focused on policy and budget decisions",
    features: [
      "Executive dashboard",
      "Budget impact analysis",
      "ROI metrics",
      "Public reports"
    ],
    permissions: ["overview", "budget", "reports", "policy"],
    color: "blue"
  },
  {
    id: "advocate",
    name: "Anika Patel",
    role: "Community Advocate",
    icon: Users,
    description: "Community representative championing local environmental initiatives",
    features: [
      "Community portal",
      "Storytelling tools",
      "Citizen feedback",
      "Local campaigns"
    ],
    permissions: ["community", "feedback", "stories", "campaigns"],
    color: "purple"
  }
];

export default function PersonaSelector({ onPersonaChange }) {
  const { currentUser, updateSettings } = useAppStore();
  const [selectedPersona, setSelectedPersona] = useState("planner");

  const handlePersonaSelect = (persona) => {
    setSelectedPersona(persona.id);
    updateSettings({ currentPersona: persona.id });
    if (onPersonaChange) {
      onPersonaChange(persona);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Role</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Experience the Oasis Platform from different perspectives
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {personas.map((persona) => {
          const Icon = persona.icon;
          const isSelected = selectedPersona === persona.id;
          
          return (
            <motion.div
              key={persona.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? `ring-2 ring-${persona.color}-500 shadow-lg` 
                    : "hover:shadow-md"
                }`}
                onClick={() => handlePersonaSelect(persona)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg bg-${persona.color}-100 dark:bg-${persona.color}-900`}>
                      <Icon className={`h-6 w-6 text-${persona.color}-600`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{persona.name}</CardTitle>
                      <CardDescription>{persona.role}</CardDescription>
                    </div>
                    {isSelected && (
                      <CheckCircle className={`h-5 w-5 text-${persona.color}-600 ml-auto`} />
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {persona.description}
                  </p>
                  
                  <div>
                    <h5 className="text-sm font-medium mb-2">Key Features</h5>
                    <div className="space-y-1">
                      {persona.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium mb-2">Access Level</h5>
                    <div className="flex gap-1 flex-wrap">
                      {persona.permissions.map((permission, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {permission.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="pt-2"
                    >
                      <Button 
                        className={`w-full bg-${persona.color}-600 hover:bg-${persona.color}-700`}
                      >
                        Continue as {persona.name}
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
      
      {selectedPersona && (
        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            The dashboard will be customized for your selected role and use case.
          </p>
        </div>
      )}
    </div>
  );
}
