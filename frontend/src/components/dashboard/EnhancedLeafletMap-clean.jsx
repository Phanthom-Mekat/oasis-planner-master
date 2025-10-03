"use client";

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Layers, 
  Thermometer, 
  Trees, 
  Waves, 
  Building, 
  Activity,
  Wind,
  Droplets,
  Zap,
  RefreshCw
} from "lucide-react";
import MapControls from "@/components/ui/map-controls";
import MapLoadingStates from "@/components/ui/map-loading-states";
import MapLegend from "@/components/ui/map-legend";
import { useEnhancedMapping } from "@/hooks/useClimateData";

const EnhancedLeafletMap = ({ mode = "overview", className = "" }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState("temperature");
  const [mapView, setMapView] = useState('hybrid');
  const [activeOverlays, setActiveOverlays] = useState(new Set(['temperature']));
  const [showRealTime, setShowRealTime] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const { overlayData, loading: overlayLoading, loadLayerData } = useEnhancedMapping();

  // Data layers configuration
  const dataLayers = [
    { 
      id: "temperature", 
      name: "Heat Islands", 
      icon: Thermometer, 
      color: "text-red-500",
      updateFrequency: "15 min"
    },
    { 
      id: "vegetation", 
      name: "Green Cover", 
      icon: Trees, 
      color: "text-green-500",
      updateFrequency: "Weekly"
    },
    { 
      id: "flood", 
      name: "Flood Risk", 
      icon: Waves, 
      color: "text-blue-500",
      updateFrequency: "Hourly"
    },
    { 
      id: "infrastructure", 
      name: "Infrastructure", 
      icon: Building, 
      color: "text-purple-500",
      updateFrequency: "Daily"
    },
    { 
      id: "air_quality", 
      name: "Air Quality", 
      icon: Activity, 
      color: "text-orange-500",
      updateFrequency: "1 min"
    },
    {
      id: "wind_flow",
      name: "Wind Patterns", 
      icon: Wind,
      color: "text-cyan-500",
      updateFrequency: "6 hours"
    },
    {
      id: "precipitation",
      name: "Precipitation",
      icon: Droplets, 
      color: "text-indigo-500",
      updateFrequency: "5 min"
    },
    {
      id: "energy",
      name: "Energy Usage",
      icon: Zap,
      color: "text-yellow-500", 
      updateFrequency: "15 min"
    }
  ];

  // Map view options
  const mapViews = [
    { id: "street", name: "Street" },
    { id: "satellite", name: "Satellite" },
    { id: "hybrid", name: "Hybrid" },
    { id: "terrain", name: "Terrain" }
  ];

  // Initialize map
  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current && !mapInstanceRef.current) {
      // Simulate map loading
      setTimeout(() => {
        setMapLoaded(true);
        loadLayerData(selectedLayer);
      }, 1000);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, [selectedLayer, loadLayerData]);

  const refreshData = () => {
    loadLayerData(selectedLayer);
    setLastUpdated(new Date());
  };

  const toggleOverlay = (layerId) => {
    const newActiveOverlays = new Set(activeOverlays);
    if (newActiveOverlays.has(layerId)) {
      newActiveOverlays.delete(layerId);
    } else {
      newActiveOverlays.add(layerId);
    }
    setActiveOverlays(newActiveOverlays);
  };

  // Centerpiece mode render
  if (mode === "centerpiece") {
    return (
      <div className={`relative w-full h-full ${className}`}>
        <MapControls
          mapViews={mapViews}
          mapView={mapView}
          setMapView={setMapView}
          dataLayers={dataLayers}
          activeOverlays={activeOverlays}
          toggleOverlay={toggleOverlay}
          showRealTime={showRealTime}
          setShowRealTime={setShowRealTime}
          lastUpdated={lastUpdated}
          refreshData={refreshData}
          overlayLoading={overlayLoading}
          isFullscreen={isFullscreen}
          setIsFullscreen={setIsFullscreen}
        />

        <div 
          ref={mapRef}
          className="w-full h-full rounded-lg overflow-hidden"
          style={{ minHeight: '600px' }}
        >
          <MapLoadingStates mapLoaded={mapLoaded} mapError={mapError} />
          {mapLoaded && (
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Layers className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Interactive Climate Map</p>
                <p className="text-sm">Map visualization will be integrated here</p>
              </div>
            </div>
          )}
        </div>

        {mapLoaded && (
          <MapLegend activeOverlays={activeOverlays} dataLayers={dataLayers} />
        )}
      </div>
    );
  }

  // Card mode render
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Enhanced Climate Map
            </CardTitle>
            <CardDescription>
              Real-time climate data visualization with satellite imagery
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={overlayLoading}
          >
            <RefreshCw className={`h-4 w-4 ${overlayLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Layer Selection */}
          <div className="flex flex-wrap gap-2">
            {dataLayers.map((layer) => (
              <Button
                key={layer.id}
                variant={selectedLayer === layer.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLayer(layer.id)}
                className="flex items-center gap-1"
              >
                <layer.icon className={`h-4 w-4 ${layer.color}`} />
                <span className="hidden sm:inline">{layer.name}</span>
              </Button>
            ))}
          </div>

          {/* Map Container */}
          <div className="relative">
            <div 
              ref={mapRef}
              className="w-full h-96 rounded-lg overflow-hidden border"
              style={{ minHeight: '400px' }}
            >
              <MapLoadingStates mapLoaded={mapLoaded} mapError={mapError} />
              {mapLoaded && (
                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Layers className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">Climate Map View</p>
                    <p className="text-sm">Layer: {dataLayers.find(l => l.id === selectedLayer)?.name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedLeafletMap;
