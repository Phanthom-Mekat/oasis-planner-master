"use client";

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layers, Zap, Trees, Waves, MapPin, Plus, Minus, Maximize2 } from "lucide-react";

const LeafletMap = ({ mode = "overview", className = "" }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [selectedLayer, setSelectedLayer] = useState("temperature");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapError, setMapError] = useState(null);

  const layers = [
    { id: "temperature", name: "Heat Islands", icon: Zap, color: "text-orange-500" },
    { id: "vegetation", name: "Green Cover", icon: Trees, color: "text-green-500" },
    { id: "flood", name: "Flood Risk", icon: Waves, color: "text-blue-500" },
    { id: "infrastructure", name: "Infrastructure", icon: MapPin, color: "text-purple-500" },
  ];

  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current && !mapInstanceRef.current) {
      // Dynamically import Leaflet to avoid SSR issues
      import('leaflet').then((L) => {
        try {
          // Fix for default marker icons in Leaflet
          delete L.Icon.Default.prototype._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          });

          // Initialize map
          const map = L.map(mapRef.current, {
            center: [23.8103, 90.4125], // Dhaka, Bangladesh
            zoom: 12,
            zoomControl: false, // We'll add custom controls
          });

          // Add tile layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          // Add sample heat island markers
          if (selectedLayer === 'temperature') {
            const heatPoints = [
              [23.8103, 90.4125],
              [23.8203, 90.4225],
              [23.8003, 90.4025],
            ];
            
            heatPoints.forEach(point => {
              L.circle(point, {
                color: 'red',
                fillColor: '#ff0000',
              fillOpacity: 0.3,
              radius: 1000
            }).addTo(map);
          });
        }

        // Add green spaces
        if (selectedLayer === 'vegetation') {
          const greenSpaces = [
            [23.8153, 90.4175],
            [23.8053, 90.4075],
          ];
          
          greenSpaces.forEach(point => {
            L.circle(point, {
              color: 'green',
              fillColor: '#00ff00',
              fillOpacity: 0.6,
              radius: 800
            }).addTo(map);
          });
        }

        mapInstanceRef.current = map;
        setMapLoaded(true);
        } catch (error) {
          console.error("Error initializing map:", error);
          setMapError("Failed to load map. Please try again later.");
        }
      }).catch(error => {
        console.error("Error loading Leaflet:", error);
        setMapError("Failed to load map. Please try again later.");
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update layers when selection changes
  useEffect(() => {
    if (mapInstanceRef.current && typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        // Clear existing layers except base tile layer
        mapInstanceRef.current.eachLayer((layer) => {
          if (!layer._url) { // Not a tile layer
            mapInstanceRef.current.removeLayer(layer);
          }
        });

        // Add new layers based on selection
        if (selectedLayer === 'temperature') {
          const heatPoints = [
            [23.8103, 90.4125],
            [23.8203, 90.4225],
            [23.8003, 90.4025],
          ];
          
          heatPoints.forEach(point => {
            L.circle(point, {
              color: 'red',
              fillColor: '#ff0000',
              fillOpacity: 0.3,
              radius: 1000
            }).addTo(mapInstanceRef.current);
          });
        }

        if (selectedLayer === 'vegetation') {
          const greenSpaces = [
            [23.8153, 90.4175],
            [23.8053, 90.4075],
          ];
          
          greenSpaces.forEach(point => {
            L.circle(point, {
              color: 'green',
              fillColor: '#00ff00',
              fillOpacity: 0.6,
              radius: 800
            }).addTo(mapInstanceRef.current);
          });
        }

        if (selectedLayer === 'flood') {
          const floodAreas = [
            [23.8123, 90.4145],
            [23.8023, 90.4045],
          ];
          
          floodAreas.forEach(point => {
            L.circle(point, {
              color: 'blue',
              fillColor: '#0000ff',
              fillOpacity: 0.4,
              radius: 1200
            }).addTo(mapInstanceRef.current);
          });
        }

        if (selectedLayer === 'infrastructure') {
          const infraPoints = [
            [23.8113, 90.4135],
            [23.8213, 90.4235],
            [23.8013, 90.4035],
          ];
          
          infraPoints.forEach(point => {
            L.marker(point).addTo(mapInstanceRef.current);
          });
        }
      }).catch(error => {
        console.error("Error updating map layers:", error);
        setMapError("Failed to update map layers. Please try again later.");
      });
    }
  }, [selectedLayer]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              {mode === "simulation" ? "Simulation Canvas" : "Climate Data Map"}
            </CardTitle>
            <CardDescription>
              {mode === "simulation" 
                ? "Design and test green infrastructure interventions"
                : "Real-time climate and environmental data visualization"
              }
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {layers.map((layer) => (
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
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Map Container */}
          <div 
            ref={mapRef}
            className="w-full h-96 rounded-lg overflow-hidden border"
            style={{ minHeight: '400px' }}
          >
            {!mapLoaded && !mapError && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Loading map data...</p>
                </div>
              </div>
            )}
            {mapError && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-100 dark:bg-red-900 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-red-600 dark:text-red-300 mb-2">{mapError}</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => window.location.reload()}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    Retry
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Map Controls */}
          {mapLoaded && (
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <Button size="sm" variant="secondary" className="w-8 h-8 p-0" onClick={handleZoomIn}>
                <Plus className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary" className="w-8 h-8 p-0" onClick={handleZoomOut}>
                <Minus className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary" className="w-8 h-8 p-0" onClick={() => setIsFullscreen(!isFullscreen)}>
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Legend */}
          {mapLoaded && (
            <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-800 rounded-lg p-3 shadow-lg border">
              <div className="text-xs font-medium mb-2">
                {layers.find(l => l.id === selectedLayer)?.name}
              </div>
              <div className="flex items-center gap-2 text-xs">
                {selectedLayer === "temperature" && (
                  <>
                    <div className="w-3 h-3 bg-red-400 rounded"></div>
                    <span>High Risk</span>
                    <div className="w-3 h-3 bg-orange-400 rounded"></div>
                    <span>Medium Risk</span>
                  </>
                )}
                {selectedLayer === "vegetation" && (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Dense</span>
                    <div className="w-3 h-3 bg-green-400 rounded"></div>
                    <span>Moderate</span>
                  </>
                )}
                {selectedLayer === "flood" && (
                  <>
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>High Risk</span>
                    <div className="w-3 h-3 bg-blue-400 rounded"></div>
                    <span>Low Risk</span>
                  </>
                )}
                {selectedLayer === "infrastructure" && (
                  <>
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span>Critical Infrastructure</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {mode === "simulation" && (
          <div className="mt-4 flex gap-2 flex-wrap">
            <Button size="sm" variant="outline" className="text-green-600">
              <Trees className="h-4 w-4 mr-1" />
              Add Trees
            </Button>
            <Button size="sm" variant="outline" className="text-blue-600">
              <Waves className="h-4 w-4 mr-1" />
              Bioswale
            </Button>
            <Button size="sm" variant="outline" className="text-gray-600">
              Cool Pavement
            </Button>
            <Button size="sm" variant="outline" className="text-purple-600">
              Green Roof
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeafletMap;
