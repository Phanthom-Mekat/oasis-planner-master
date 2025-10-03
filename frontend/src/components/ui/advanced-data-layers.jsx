"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { useToast } from "@/hooks/use-toast";
import { 
  Volume2, 
  Car, 
  Wind, 
  Waves,
  MapPin,
  Activity,
  TrendingUp,
  BarChart3,
  Eye,
  EyeOff,
  Info
} from "lucide-react";

export function AdvancedDataLayers() {
  const [activeLayers, setActiveLayers] = useState({
    acoustic: true,
    mobility: false,
    windFlow: false
  });

  const [layerIntensity, setLayerIntensity] = useState({
    acoustic: 75,
    mobility: 60,
    windFlow: 45  });

  const { toast } = useToast();

  const dataLayers = [
    {
      id: "acoustic",
      name: "Acoustic Data Layer",
      description: "Urban noise pollution mapping and sound absorption zones",
      icon: Volume2,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      metrics: [
        { label: "Average Noise Level", value: "68 dB", trend: "+3 dB" },
        { label: "Quiet Zones", value: "12%", trend: "-2%" },
        { label: "Traffic Noise", value: "45 dB", trend: "+1 dB" }
      ],
      insights: [
        "High noise levels detected near major intersections",
        "Green corridors reduce noise by 8-12 dB",
        "Residential zones exceed WHO recommendations"
      ]
    },
    {
      id: "mobility",
      name: "Mobility & Traffic Data",
      description: "Public transit accessibility and traffic flow analysis",
      icon: Car,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      metrics: [
        { label: "Transit Accessibility", value: "78%", trend: "+5%" },
        { label: "Traffic Congestion", value: "32%", trend: "-8%" },
        { label: "Walkability Score", value: "65/100", trend: "+12" }
      ],
      insights: [
        "New bike lanes reduce car traffic by 15%",
        "Transit gaps identified in eastern districts",
        "Pedestrian zones improve local air quality"
      ]
    },
    {
      id: "windFlow",
      name: "Micro-Climate Wind Flow",
      description: "CFD modeling of urban wind patterns and ventilation",
      icon: Wind,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      metrics: [
        { label: "Wind Speed", value: "12 km/h", trend: "+2 km/h" },
        { label: "Ventilation Index", value: "0.78", trend: "+0.15" },
        { label: "Pollution Dispersion", value: "Good", trend: "↑" }
      ],
      insights: [
        "Building corridors create wind tunnels",
        "Tree placement improves natural ventilation",
        "Reduced air stagnation in redesigned areas"
      ]
    }
  ];

  const toggleLayer = (layerId) => {
    const layerNames = {
      acoustic: "Acoustic Data Layer",
      mobility: "Mobility & Traffic Data",
      windFlow: "Micro-Climate Wind Flow"
    };

    setActiveLayers(prev => {
      const newState = {
        ...prev,
        [layerId]: !prev[layerId]
      };
      
      toast({
        title: newState[layerId] ? "Layer Activated" : "Layer Deactivated",
        description: `${layerNames[layerId]} has been ${newState[layerId] ? 'enabled' : 'disabled'}`,
        duration: 2000
      });

      return newState;
    });
  };

  const handleConfigureClick = (layer) => {
    toast({
      title: "Configuration Panel",
      description: `Opening advanced settings for ${layer.name}`,
      duration: 2000
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Advanced Data Layers
          </CardTitle>
          <CardDescription>
            Next-generation urban analytics with acoustic, mobility, and wind flow modeling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dataLayers.map((layer) => (
              <motion.div
                key={layer.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${layer.bgColor}`}>
                    <layer.icon className={`h-4 w-4 ${layer.color}`} />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{layer.name}</div>
                    <div className="text-xs text-slate-500">
                      {activeLayers[layer.id] ? 'Visible' : 'Hidden'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {activeLayers[layer.id] ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-slate-400" />
                  )}
                  <Switch
                    checked={activeLayers[layer.id]}
                    onCheckedChange={() => toggleLayer(layer.id)}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Layer Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {dataLayers.map((layer) => (
          <AnimatePresence key={layer.id}>
            {activeLayers[layer.id] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-xl ${layer.bgColor}`}>
                        <layer.icon className={`h-6 w-6 ${layer.color}`} />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Active
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{layer.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {layer.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Layer Intensity Control */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Layer Opacity</span>
                        <span className="text-sm text-slate-500">
                          {layerIntensity[layer.id]}%
                        </span>
                      </div>
                      <Progress 
                        value={layerIntensity[layer.id]} 
                        className="h-2"
                      />
                    </div>

                    {/* Key Metrics */}
                    <div>
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Real-time Metrics
                      </h4>
                      <div className="space-y-3">
                        {layer.metrics.map((metric, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-medium">{metric.value}</div>
                              <div className="text-xs text-slate-500">{metric.label}</div>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-green-600" />
                              <span className="text-xs text-green-600">{metric.trend}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Insights */}
                    <div>
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        AI Insights
                      </h4>
                      <div className="space-y-2">
                        {layer.insights.map((insight, index) => (
                          <div 
                            key={index} 
                            className="text-xs bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border-l-2 border-blue-500"
                          >
                            {insight}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Layer Actions */}
                    <div className="flex gap-2">
                      <EnhancedButton 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleConfigureClick(layer)}
                      >
                        Configure
                      </EnhancedButton>
                      <EnhancedButton 
                        size="sm" 
                        variant="outline"
                        onClick={() => toast({
                          title: "Location Focus",
                          description: "Centering map view on this data layer",
                          duration: 1500
                        })}
                      >
                        <MapPin className="h-3 w-3" />
                      </EnhancedButton>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>

      {/* Integration Notice */}
      {Object.values(activeLayers).some(Boolean) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                  <Waves className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-blue-900 dark:text-blue-100">
                    Advanced layers are now feeding into your simulation
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    These data layers enhance the accuracy of cascading effects predictions
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
