"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { useToast } from "@/hooks/use-toast";
import { 
  TreePine, 
  Building2, 
  Waves, 
  Zap, 
  TrendingUp, 
  ArrowRight, 
  Wind,
  Car,
  Volume2,
  Thermometer,
  Droplets,
  Activity
} from "lucide-react";

export function CascadingEffectsSimulation() {
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();

  const interventions = [
    {
      id: "urban-forest",
      name: "Urban Tree Corridor",
      icon: TreePine,
      color: "text-green-600",
      bgColor: "bg-green-50",
      cost: "$125,000",
      coverage: "2.5 km corridor"
    },
    {
      id: "green-roofs", 
      name: "Green Roof Network",
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      cost: "$89,000",
      coverage: "50 buildings"
    },
    {
      id: "bioswales",
      name: "Bioswale System",
      icon: Waves,
      color: "text-cyan-600", 
      bgColor: "bg-cyan-50",
      cost: "$67,000",
      coverage: "12 intersections"
    }
  ];

  const cascadingEffects = {
    "urban-forest": {
      primary: {
        title: "Primary Effect: Temperature Reduction",
        value: "-3.2°C",
        description: "Direct cooling from tree shade and evapotranspiration",
        icon: Thermometer,
        color: "text-red-500"
      },
      secondary: [
        {
          title: "Increased Pedestrian Activity",
          value: "+45%",
          description: "Cooler streets encourage walking and cycling",
          icon: Activity,
          color: "text-blue-500",
          delay: 2
        },
        {
          title: "Reduced Traffic Volume", 
          value: "-18%",
          description: "More walking reduces local car dependency",
          icon: Car,
          color: "text-green-500",
          delay: 4
        }
      ],
      tertiary: [
        {
          title: "Improved Air Quality",
          value: "+22%",
          description: "Less traffic + tree filtration improves AQI",
          icon: Wind,
          color: "text-emerald-500",
          delay: 6
        },
        {
          title: "Noise Reduction",
          value: "-8 dB",
          description: "Trees absorb sound + less traffic noise",
          icon: Volume2,
          color: "text-purple-500",
          delay: 8
        },
        {
          title: "Enhanced Property Values",
          value: "+12%",
          description: "Green corridor creates desirable neighborhood",
          icon: TrendingUp,
          color: "text-yellow-600",
          delay: 10
        }
      ]
    },
    "green-roofs": {
      primary: {
        title: "Primary Effect: Building Cooling",
        value: "-2.1°C",
        description: "Rooftop insulation and evapotranspiration",
        icon: Building2,
        color: "text-blue-500"
      },
      secondary: [
        {
          title: "Energy Savings",
          value: "-25%", 
          description: "Reduced AC demand in summer months",
          icon: Zap,
          color: "text-yellow-500",
          delay: 2
        },
        {
          title: "Stormwater Management",
          value: "+40%",
          description: "Green roofs absorb and slow rainwater runoff",
          icon: Droplets,
          color: "text-blue-600",
          delay: 4
        }
      ],
      tertiary: [
        {
          title: "Grid Stability",
          value: "+15%",
          description: "Lower peak energy demand improves grid resilience",
          icon: Activity,
          color: "text-green-500",
          delay: 6
        },
        {
          title: "Urban Biodiversity",
          value: "+8 species",
          description: "Rooftop habitats support birds and pollinators",
          icon: TreePine,
          color: "text-emerald-500",
          delay: 8
        }
      ]
    }
  };

  const runSimulation = () => {
    if (!selectedIntervention) return;
    
    setSimulationRunning(true);
    setCurrentStep(0);
    
    const effects = cascadingEffects[selectedIntervention.id];
    const totalSteps = 1 + effects.secondary.length + effects.tertiary.length;
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= totalSteps - 1) {
          clearInterval(interval);
          setSimulationRunning(false);
          toast({
            title: "Simulation Complete",
            description: `The ${selectedIntervention.name} simulation has finished running. Observe the positive feedback loops created.`,
            variant: "success"
          });
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  const resetSimulation = () => {
    setCurrentStep(0);
    setSimulationRunning(false);
    toast({
      title: "Simulation Reset",
      description: "Ready to run a new cascading effects analysis",
      duration: 1500
    });
  };

  const renderEffect = (effect, index, type, isVisible) => (
    <motion.div
      key={`${type}-${index}`}
      initial={{ opacity: 0, x: -20, scale: 0.9 }}
      animate={isVisible ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -20, scale: 0.9 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`p-4 rounded-lg border-2 ${
        isVisible ? 'border-blue-300 bg-white shadow-md' : 'border-slate-200 bg-slate-50'
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg ${isVisible ? 'bg-blue-50' : 'bg-slate-100'}`}>
          <effect.icon className={`h-5 w-5 ${isVisible ? effect.color : 'text-slate-400'}`} />
        </div>
        <div className="flex-1">
          <div className={`font-medium ${isVisible ? 'text-slate-900' : 'text-slate-500'}`}>
            {effect.title}
          </div>
          <div className={`text-sm ${isVisible ? 'text-slate-600' : 'text-slate-400'}`}>
            {effect.description}
          </div>
          {isVisible && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className={`text-lg font-bold mt-2 ${effect.color}`}
            >
              {effect.value}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Intervention Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Climate Intervention</CardTitle>
          <CardDescription>
            Choose an intervention to see its cascading effects across the urban system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {interventions.map((intervention) => (
              <motion.div
                key={intervention.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedIntervention(intervention)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedIntervention?.id === intervention.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`p-3 rounded-lg ${intervention.bgColor} mb-3`}>
                  <intervention.icon className={`h-6 w-6 ${intervention.color}`} />
                </div>
                <h3 className="font-medium mb-2">{intervention.name}</h3>
                <div className="text-sm text-slate-600 space-y-1">
                  <div>Cost: {intervention.cost}</div>
                  <div>Coverage: {intervention.coverage}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Simulation Controls */}
      {selectedIntervention && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Cascading Effects: {selectedIntervention.name}
            </CardTitle>
            <CardDescription>
              Watch how this intervention creates positive feedback loops across multiple urban systems
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <EnhancedButton 
                onClick={runSimulation}
                disabled={simulationRunning}
                className="flex items-center gap-2"
                variant={simulationRunning ? "loading" : "primary"}
              >
                <Activity className="h-4 w-4" />
                {simulationRunning ? 'Simulation Running...' : 'Run Simulation'}
              </EnhancedButton>
              <EnhancedButton 
                variant="outline"
                onClick={resetSimulation}
              >
                Reset
              </EnhancedButton>
            </div>

            {simulationRunning && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm font-medium">Analyzing cascading effects...</span>
                </div>
                <Progress value={(currentStep / (cascadingEffects[selectedIntervention.id].secondary.length + cascadingEffects[selectedIntervention.id].tertiary.length)) * 100} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Effects Visualization */}
      {selectedIntervention && cascadingEffects[selectedIntervention.id] && (
        <div className="space-y-6">
          {/* Primary Effect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">1°</span>
                Primary Effect
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderEffect(cascadingEffects[selectedIntervention.id].primary, 0, 'primary', currentStep >= 0)}
            </CardContent>
          </Card>

          {/* Secondary Effects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">2°</span>
                Secondary Effects
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cascadingEffects[selectedIntervention.id].secondary.map((effect, index) => 
                  renderEffect(effect, index, 'secondary', currentStep >= 1 + index)
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tertiary Effects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">3°</span>
                Tertiary Effects
                <ArrowRight className="h-4 w-4 text-slate-400" />
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cascadingEffects[selectedIntervention.id].tertiary.map((effect, index) => 
                  renderEffect(
                    effect, 
                    index, 
                    'tertiary', 
                    currentStep >= 1 + cascadingEffects[selectedIntervention.id].secondary.length + index
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          {currentStep >= cascadingEffects[selectedIntervention.id].secondary.length + cascadingEffects[selectedIntervention.id].tertiary.length && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-800">
                    ✅ Simulation Complete: Positive Feedback Loop Created
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-green-700">
                    The {selectedIntervention.name} creates a self-reinforcing cycle of improvements 
                    across temperature, mobility, air quality, and economic factors. Each effect 
                    amplifies the others, creating lasting urban resilience.
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
