"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Layers, 
  Zap, 
  Trees, 
  Waves, 
  MapPin, 
  Wind, 
  Eye, 
  Activity,
  Thermometer,
  Droplets,
  Building,
  Satellite,
  Map,
  Globe,
  Mountain,
  RefreshCw,
  Maximize,
  Settings
} from "lucide-react";

export default function InteractiveMap({ mode = "overview" }) {
  const mapRef = useRef(null);
  const [selectedLayer, setSelectedLayer] = useState("temperature");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapView, setMapView] = useState("street");
  const [activeOverlays, setActiveOverlays] = useState(new Set(["temperature"]));
  const [selectedCity, setSelectedCity] = useState(null);
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => setMapLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-refresh real-time data
  useEffect(() => {
    if (realTimeEnabled) {
      const interval = setInterval(() => {
        setLastUpdate(new Date());
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [realTimeEnabled]);

  const layers = [
    { id: "temperature", name: "Heat Islands", icon: Thermometer, color: "text-red-500", active: true },
    { id: "vegetation", name: "Green Cover", icon: Trees, color: "text-green-500", active: false },
    { id: "flood", name: "Flood Risk", icon: Waves, color: "text-blue-500", active: false },
    { id: "infrastructure", name: "Infrastructure", icon: Building, color: "text-purple-500", active: false },
    { id: "air_quality", name: "Air Quality", icon: Activity, color: "text-orange-500", active: false },
    { id: "wind", name: "Wind Patterns", icon: Wind, color: "text-cyan-500", active: false },
  ];

  const mapViews = [
    { id: "street", name: "Street", icon: Map },
    { id: "satellite", name: "Satellite", icon: Satellite },
    { id: "hybrid", name: "Hybrid", icon: Globe },
    { id: "terrain", name: "Terrain", icon: Mountain },
  ];

  const cities = [
    { 
      id: "dhaka", name: "Dhaka", country: "Bangladesh", 
      x: 45, y: 35, temp: 34.2, aqi: 165, population: "9.4M",
      riskLevel: "high", icon: "🏙️"
    },
    { 
      id: "mumbai", name: "Mumbai", country: "India", 
      x: 30, y: 50, temp: 32.8, aqi: 142, population: "20.4M",
      riskLevel: "high", icon: "🌆"
    },
    { 
      id: "delhi", name: "Delhi", country: "India", 
      x: 25, y: 25, temp: 35.6, aqi: 178, population: "32.9M",
      riskLevel: "critical", icon: "🏛️"
    },
    { 
      id: "karachi", name: "Karachi", country: "Pakistan", 
      x: 15, y: 40, temp: 33.1, aqi: 156, population: "16.1M",
      riskLevel: "high", icon: "🏢"
    },
  ];

  const toggleOverlay = (layerId) => {
    const newOverlays = new Set(activeOverlays);
    if (newOverlays.has(layerId)) {
      newOverlays.delete(layerId);
    } else {
      newOverlays.add(layerId);
    }
    setActiveOverlays(newOverlays);
  };

  return (
    <Card className="relative">
      <CardHeader className="pb-2">
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
          <div className="flex items-center gap-2">
            <Badge variant={realTimeEnabled ? "default" : "secondary"} className="gap-1">
              <div className={`w-2 h-2 rounded-full ${realTimeEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              {realTimeEnabled ? "LIVE" : "OFFLINE"}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRealTimeEnabled(!realTimeEnabled)}
            >
              <RefreshCw className={`h-4 w-4 ${realTimeEnabled ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="outline" size="sm">
              <Maximize className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Enhanced Toolbar - Moved to Top */}
        <div className="space-y-3 pt-3 border-t">
          {/* Map View Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">View:</span>
            {mapViews.map((view) => (
              <Button
                key={view.id}
                variant={mapView === view.id ? "default" : "outline"}
                size="sm"
                onClick={() => setMapView(view.id)}
                className="flex items-center gap-1"
              >
                <view.icon className="h-3 w-3" />
                {view.name}
              </Button>
            ))}
          </div>
          
          {/* Layer Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-600">Layers:</span>
            {layers.map((layer) => (
              <Button
                key={layer.id}
                variant={activeOverlays.has(layer.id) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleOverlay(layer.id)}
                className={`flex items-center gap-1 ${activeOverlays.has(layer.id) ? layer.color : ''}`}
              >
                <layer.icon className={`h-3 w-3 ${layer.color}`} />
                <span className="hidden sm:inline">{layer.name}</span>
              </Button>
            ))}
          </div>
          
          {/* Real-time Status */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            <span>Zoom: 12x | Cities: {cities.length}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2">
        <div className="relative">
          {/* Enhanced Map Container */}
          <div 
            ref={mapRef}
            className="w-full h-96 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-lg overflow-hidden relative border-2 border-gray-200 dark:border-gray-700"
          >
            {!mapLoaded ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                  <p className="text-sm text-slate-600">Loading climate data...</p>
                  <p className="text-xs text-slate-400 mt-1">Connecting to satellite feeds</p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0">
                {/* Enhanced Map Background */}
                <div className={`w-full h-full relative transition-all duration-500 ${
                  mapView === 'satellite' ? 'bg-gradient-to-br from-gray-800 to-gray-900' :
                  mapView === 'terrain' ? 'bg-gradient-to-br from-green-100 to-blue-100' :
                  mapView === 'hybrid' ? 'bg-gradient-to-br from-gray-100 to-green-50' :
                  'bg-gradient-to-br from-gray-50 to-gray-100'
                }`}>
                  
                  {/* Dynamic Background Pattern */}
                  {mapView === 'street' && (
                    <div className="absolute inset-0" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.3'%3E%3Cpath d='M0 0h40v40H0z'/%3E%3C/g%3E%3C/svg%3E")`,
                      backgroundSize: '40px 40px'
                    }} />
                  )}
                  
                  {mapView === 'satellite' && (
                    <div className="absolute inset-0" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23374151' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/svg%3E")`,
                      backgroundSize: '60px 60px'
                    }} />
                  )}

                  {/* Major roads and features */}
                  <div className="absolute top-1/4 left-0 right-0 h-2 bg-yellow-400 opacity-60"></div>
                  <div className="absolute top-3/4 left-0 right-0 h-1 bg-gray-400 opacity-40"></div>
                  <div className="absolute left-1/3 top-0 bottom-0 w-1 bg-gray-400 opacity-40"></div>
                  <div className="absolute left-2/3 top-0 bottom-0 w-2 bg-yellow-400 opacity-60"></div>

                  {/* City Markers */}
                  {cities.map((city) => (
                    <div
                      key={city.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                      style={{ left: `${city.x}%`, top: `${city.y}%` }}
                      onClick={() => setSelectedCity(city)}
                    >
                      {/* Pulse Animation */}
                      <div className="absolute w-8 h-8 bg-blue-400 rounded-full opacity-20 animate-ping"></div>
                      
                      {/* City Icon */}
                      <div className={`relative w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 transition-all duration-200 group-hover:scale-110 ${
                        city.riskLevel === 'critical' ? 'bg-red-500 border-red-600 text-white' :
                        city.riskLevel === 'high' ? 'bg-orange-500 border-orange-600 text-white' :
                        'bg-blue-500 border-blue-600 text-white'
                      }`}>
                        {city.icon}
                      </div>
                      
                      {/* City Label */}
                      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                        <div className="font-semibold">{city.name}</div>
                        <div className="text-gray-500">{city.temp}°C • AQI {city.aqi}</div>
                      </div>
                    </div>
                  ))}

                  {/* Enhanced Overlays */}
                  {activeOverlays.has('temperature') && (
                    <>
                      <div className="absolute top-16 left-16 w-32 h-24 bg-red-500 rounded-full opacity-30 animate-pulse blur-sm"></div>
                      <div className="absolute top-36 left-56 w-24 h-20 bg-orange-500 rounded-full opacity-25 animate-pulse blur-sm"></div>
                      <div className="absolute bottom-32 right-24 w-28 h-22 bg-red-600 rounded-full opacity-35 animate-pulse blur-sm"></div>
                    </>
                  )}
                  
                  {activeOverlays.has('vegetation') && (
                    <>
                      <div className="absolute top-60 left-60 w-20 h-20 bg-green-500 rounded-full opacity-60"></div>
                      <div className="absolute top-80 left-40 w-16 h-16 bg-green-600 rounded-full opacity-70"></div>
                      <div className="absolute bottom-20 right-40 w-24 h-18 bg-green-400 rounded-lg opacity-50"></div>
                    </>
                  )}
                  
                  {activeOverlays.has('flood') && (
                    <>
                      <div className="absolute top-32 left-24 w-40 h-12 bg-blue-500 rounded opacity-40 animate-pulse"></div>
                      <div className="absolute bottom-40 right-20 w-32 h-16 bg-blue-600 rounded opacity-35 animate-pulse"></div>
                    </>
                  )}

                  {activeOverlays.has('air_quality') && (
                    <>
                      {cities.map((city, index) => (
                        <div
                          key={`aqi-${city.id}`}
                          className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg"
                          style={{ 
                            left: `${city.x + 3}%`, 
                            top: `${city.y + 3}%`,
                            backgroundColor: city.aqi > 150 ? '#dc2626' : city.aqi > 100 ? '#ea580c' : '#16a34a'
                          }}
                        />
                      ))}
                    </>
                  )}

                  {activeOverlays.has('wind') && (
                    <>
                      <div className="absolute top-20 left-30 w-8 h-1 bg-cyan-500 opacity-70 transform rotate-45"></div>
                      <div className="absolute top-50 left-70 w-8 h-1 bg-cyan-500 opacity-70 transform rotate-12"></div>
                      <div className="absolute bottom-30 right-30 w-8 h-1 bg-cyan-500 opacity-70 transform -rotate-30"></div>
                    </>
                  )}

                  {activeOverlays.has('infrastructure') && (
                    <>
                      <div className="absolute top-28 left-32 w-3 h-3 bg-purple-600 rounded-sm shadow-lg"></div>
                      <div className="absolute top-48 left-56 w-3 h-3 bg-purple-600 rounded-sm shadow-lg"></div>
                      <div className="absolute bottom-32 right-32 w-3 h-3 bg-purple-600 rounded-sm shadow-lg"></div>
                    </>
                  )}
                </div>

                {/* Enhanced Map Controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Button size="sm" variant="secondary" className="w-8 h-8 p-0 shadow-lg">+</Button>
                  <Button size="sm" variant="secondary" className="w-8 h-8 p-0 shadow-lg">-</Button>
                  <Button size="sm" variant="secondary" className="w-8 h-8 p-0 shadow-lg">
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>

                {/* Compass */}
                <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
                  <div className="w-8 h-8 relative">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-xs font-bold text-red-500">N</div>
                    <div className="absolute inset-0 border border-gray-300 rounded-full"></div>
                  </div>
                </div>

                {/* Enhanced Legend */}
                <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-gray-800/95 rounded-lg p-3 shadow-lg backdrop-blur-sm">
                  <div className="text-xs font-semibold mb-2 flex items-center gap-2">
                    <Layers className="h-3 w-3" />
                    Active Layers
                  </div>
                  <div className="space-y-1">
                    {Array.from(activeOverlays).map(layerId => {
                      const layer = layers.find(l => l.id === layerId);
                      return (
                        <div key={layerId} className="flex items-center gap-2 text-xs">
                          <layer.icon className={`h-3 w-3 ${layer.color}`} />
                          <span>{layer.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Scale Bar */}
                <div className="absolute bottom-4 right-4 bg-white/95 dark:bg-gray-800/95 rounded p-2 shadow-lg text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-12 bg-gray-600"></div>
                    <span>2 km</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* City Detail Panel */}
          {selectedCity && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 min-w-80 z-20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{selectedCity.icon}</div>
                  <div>
                    <h3 className="font-semibold">{selectedCity.name}</h3>
                    <p className="text-sm text-gray-500">{selectedCity.country} • {selectedCity.population}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCity(null)}
                >
                  ×
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded">
                  <div className="font-medium text-red-700 dark:text-red-300">Temperature</div>
                  <div className="text-2xl font-bold text-red-600">{selectedCity.temp}°C</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
                  <div className="font-medium text-orange-700 dark:text-orange-300">Air Quality</div>
                  <div className="text-2xl font-bold text-orange-600">{selectedCity.aqi}</div>
                </div>
              </div>
              
              <div className="mt-3 flex items-center gap-2">
                <Badge variant={selectedCity.riskLevel === 'critical' ? 'destructive' : 'secondary'}>
                  {selectedCity.riskLevel.toUpperCase()} RISK
                </Badge>
                <Button size="sm" variant="outline">View Details</Button>
              </div>
            </div>
          )}

          {mode === "simulation" && (
            <div className="mt-4 flex gap-2 flex-wrap">
              <Button size="sm" variant="outline" className="text-green-600 hover:bg-green-50">
                <Trees className="h-4 w-4 mr-1" />
                Add Trees
              </Button>
              <Button size="sm" variant="outline" className="text-blue-600 hover:bg-blue-50">
                <Waves className="h-4 w-4 mr-1" />
                Bioswale
              </Button>
              <Button size="sm" variant="outline" className="text-gray-600 hover:bg-gray-50">
                Cool Pavement
              </Button>
              <Button size="sm" variant="outline" className="text-purple-600 hover:bg-purple-50">
                Green Roof
              </Button>
              <Button size="sm" variant="outline" className="text-orange-600 hover:bg-orange-50">
                Solar Panels
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
