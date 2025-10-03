"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Brain,
  Activity,
  Zap,
  Waves,
  Cloud,
  TreePine,
  Building,
  Users,
  AlertTriangle
} from "lucide-react";

const interventions = [
  {
    id: "urban-forest",
    name: "Miyawaki Urban Forest",
    type: "Vegetation",
    cost: 45000,
    costUnit: "$45K",
    impact: {
      temperature: -3.2,
      biodiversity: 35,
      air_quality: 18,
      carbon_sequestration: 25,
      noise_reduction: 15
    },
    area: "0.5 hectares",
    timeframe: "2-3 years",
    icon: TreePine,
    cascadingEffects: ["improved_mental_health", "property_value_increase", "reduced_energy_costs"]
  },
  {
    id: "green-roofs",
    name: "Green Roof Network",
    type: "Building",
    cost: 120000,
    costUnit: "$120K",
    impact: {
      temperature: -1.8,
      energy_savings: 25,
      stormwater: -40,
      insulation: 30,
      building_lifespan: 20
    },
    area: "2.1 hectares",
    timeframe: "1-2 years",
    icon: Building,
    cascadingEffects: ["reduced_hvac_load", "improved_air_quality", "urban_agriculture"]
  },
  {
    id: "bioswales",
    name: "Bioswale System",
    type: "Infrastructure",
    cost: 80000,
    costUnit: "$80K",
    impact: {
      flood_risk: -65,
      water_quality: 30,
      temperature: -1.2,
      groundwater_recharge: 45,
      pollutant_removal: 50
    },
    area: "1.8 km length",
    timeframe: "6-12 months",
    icon: Waves,
    cascadingEffects: ["reduced_infrastructure_stress", "habitat_creation", "community_engagement"]
  },
  {
    id: "solar-canopies",
    name: "Solar Canopy Network",
    type: "Energy",
    cost: 200000,
    costUnit: "$200K",
    impact: {
      energy_generation: 500,
      temperature: -2.5,
      renewable_capacity: 40,
      grid_resilience: 25,
      shading_coverage: 60
    },
    area: "1.2 hectares",
    timeframe: "8-12 months",
    icon: Zap,
    cascadingEffects: ["energy_independence", "emergency_power", "ev_charging_expansion"]
  }
];

const climateScenarios = [
  { id: "current", name: "Current Conditions", rcp: "Baseline", temp_increase: 0, year: 2024 },
  { id: "rcp26", name: "2030 Low Emission", rcp: "RCP 2.6", temp_increase: 1.2, year: 2030 },
  { id: "rcp45", name: "2030 Moderate", rcp: "RCP 4.5", temp_increase: 1.8, year: 2030 },
  { id: "rcp85", name: "2050 High Emission", rcp: "RCP 8.5", temp_increase: 3.2, year: 2050 }
];

export default function SimulationPanel() {
  const [isRunning, setIsRunning] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState("rcp45");
  const [activeInterventions, setActiveInterventions] = useState([]);
  const [budgetConstraint, setBudgetConstraint] = useState([500000]);
  const [timeHorizon, setTimeHorizon] = useState([10]);
  const [simulationResults, setSimulationResults] = useState(null);
  const [aiRecommendations, setAiRecommendations] = useState([]);

  const toggleIntervention = (id) => {
    setActiveInterventions(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const runSimulation = async () => {
    setIsRunning(true);
    setSimulationProgress(0);
    
    // Simulate progressive calculation
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, 150));
      setSimulationProgress((i / steps) * 100);
    }

    // Calculate simulation results
    const totalCost = activeInterventions.reduce((sum, id) => {
      const intervention = interventions.find(i => i.id === id);
      return sum + intervention.cost;
    }, 0);

    const aggregatedImpact = activeInterventions.reduce((acc, id) => {
      const intervention = interventions.find(i => i.id === id);
      Object.keys(intervention.impact).forEach(key => {
        acc[key] = (acc[key] || 0) + intervention.impact[key];
      });
      return acc;
    }, {});

    // Generate AI recommendations
    const recommendations = [
      {
        priority: "High",
        recommendation: "Add bioswales to maximize flood protection synergy",
        confidence: 87,
        reasoning: "Current interventions create 40% better performance when combined with water management"
      },
      {
        priority: "Medium", 
        recommendation: "Consider phased implementation to spread costs",
        confidence: 74,
        reasoning: "Budget optimization suggests 20% cost savings with delayed green roof installation"
      }
    ];

    setSimulationResults({
      totalCost,
      aggregatedImpact,
      roi: ((aggregatedImpact.energy_savings || 0) * 0.15 + (aggregatedImpact.flood_risk || 0) * 0.08) / (totalCost / 100000),
      beneficiaries: Math.round(125000 * activeInterventions.length * 0.7),
      implementationTime: Math.max(...activeInterventions.map(id => {
        const intervention = interventions.find(i => i.id === id);
        return parseInt(intervention.timeframe.split('-')[1]) || 12;
      }))
    });
    
    setAiRecommendations(recommendations);
    setIsRunning(false);
  };

  const resetSimulation = () => {
    setActiveInterventions([]);
    setSimulationResults(null);
    setAiRecommendations([]);
    setSimulationProgress(0);
  };

  const selectedScenarioData = climateScenarios.find(s => s.id === selectedScenario);
  const totalInterventionCost = activeInterventions.reduce((sum, id) => {
    const intervention = interventions.find(i => i.id === id);
    return sum + intervention.cost;
  }, 0);

  return (
    <div className="h-fit space-y-4">
      <div className="space-y-3">
        <Tabs defaultValue="interventions" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-9 bg-slate-100 dark:bg-slate-800">
            <TabsTrigger value="interventions" className="text-xs font-semibold">Interventions</TabsTrigger>
            <TabsTrigger value="scenarios" className="text-xs font-semibold">Scenarios</TabsTrigger>
            <TabsTrigger value="constraints" className="text-xs font-semibold">Constraints</TabsTrigger>
          </TabsList>

          <TabsContent value="interventions" className="space-y-3 mt-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Available Interventions</h4>
                <Badge variant="outline" className="text-xs font-semibold">
                  {activeInterventions.length} selected
                </Badge>
              </div>
              <div className="space-y-2">
                {interventions.map((intervention) => {
                  const Icon = intervention.icon;
                  const isSelected = activeInterventions.includes(intervention.id);
                  const isAffordable = intervention.cost <= budgetConstraint[0];
                  
                  return (
                    <div
                      key={intervention.id}
                      className={`p-2.5 border rounded-lg cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "border-emerald-200 bg-emerald-50 dark:bg-emerald-950/50 dark:border-emerald-800"
                          : isAffordable 
                            ? "border-slate-200/60 hover:border-slate-300 dark:border-slate-700/60 dark:hover:border-slate-600"
                            : "border-red-200/60 bg-red-50/50 dark:bg-red-950/20 dark:border-red-800/60 opacity-60"
                      }`}
                      onClick={() => isAffordable && toggleIntervention(intervention.id)}
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        <div className="flex items-start gap-2">
                          <Icon className={`h-4 w-4 mt-0.5 ${isSelected ? 'text-emerald-600' : 'text-slate-500'}`} />
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{intervention.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{intervention.area} • {intervention.timeframe}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={isAffordable ? "outline" : "destructive"} 
                            className="text-xs border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                          >
                            {intervention.costUnit}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {Object.entries(intervention.impact).slice(0, 3).map(([key, value]) => (
                          <Badge key={key} variant="secondary" className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {key.replace('_', ' ')}: {value > 0 ? '+' : ''}{value}{key.includes('temperature') ? '°C' : '%'}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-3 mt-3">
            <div>
              <h4 className="text-xs font-medium mb-2 text-slate-700 dark:text-slate-300">Climate Scenarios</h4>
              <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {climateScenarios.map((scenario) => (
                    <SelectItem key={scenario.id} value={scenario.id} className="text-xs">
                      {scenario.name} ({scenario.rcp})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedScenarioData && (
                <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-800 rounded border">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">Temperature increase:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      +{selectedScenarioData.temp_increase}°C
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="text-slate-600 dark:text-slate-400">Projection year:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {selectedScenarioData.year}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="constraints" className="space-y-3 mt-3">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-2">
                  Budget Constraint: ${budgetConstraint[0].toLocaleString()}
                </label>
                <Slider
                  value={budgetConstraint}
                  onValueChange={setBudgetConstraint}
                  max={1000000}
                  min={50000}
                  step={50000}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-2">
                  Time Horizon: {timeHorizon[0]} years
                </label>
                <Slider
                  value={timeHorizon}
                  onValueChange={setTimeHorizon}
                  max={30}
                  min={5}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-1 mb-1">
                  <AlertTriangle className="h-3 w-3 text-blue-600" />
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Budget Alert</span>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Selected interventions cost ${totalInterventionCost.toLocaleString()}
                  {totalInterventionCost > budgetConstraint[0] && " (exceeds budget)"}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Simulation Controls */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button 
              onClick={runSimulation}
              disabled={isRunning || activeInterventions.length === 0}
              className="flex-1 h-8 text-xs"
            >
              {isRunning ? (
                <>
                  <Activity className="h-3 w-3 mr-1 animate-pulse" />
                  Simulating...
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 mr-1" />
                  Run AI Simulation
                </>
              )}
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={resetSimulation}>
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>

          {/* Progress Bar */}
          {isRunning && (
            <div className="space-y-1">
              <Progress value={simulationProgress} className="h-2" />
              <p className="text-xs text-slate-500 text-center">
                Calculating cascading effects and AI recommendations...
              </p>
            </div>
          )}

          {/* Simulation Results */}
          {simulationResults && (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/50 rounded-lg border border-emerald-200/60 dark:border-emerald-800/60">
                <h5 className="text-sm font-bold mb-2 flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                  <TrendingUp className="h-4 w-4" />
                  Simulation Results
                </h5>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Total Investment:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      ${simulationResults.totalCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">People Benefited:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {simulationResults.beneficiaries.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Implementation Time:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {simulationResults.implementationTime} months
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">ROI ({timeHorizon[0]} years):</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {simulationResults.roi.toFixed(1)}x
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Recommendations */}
              {aiRecommendations.length > 0 && (
                <div className="p-3 bg-purple-50/80 dark:bg-purple-950/50 rounded-lg border border-purple-200/60 dark:border-purple-800/60">
                  <h5 className="text-sm font-bold mb-2 flex items-center gap-1.5 text-purple-700 dark:text-purple-300">
                    <Brain className="h-4 w-4" />
                    AI Recommendations
                  </h5>
                  <div className="space-y-2">
                    {aiRecommendations.map((rec, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant={rec.priority === "High" ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {rec.priority}
                          </Badge>
                          <span className="text-xs text-slate-500">{rec.confidence}% confidence</span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                          {rec.recommendation}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {rec.reasoning}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
