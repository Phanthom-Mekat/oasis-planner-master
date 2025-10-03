"use client";

import { useState, useEffect, useRef } from "react";
import DeckGL from "@deck.gl/react";
import { HexagonLayer } from "@deck.gl/aggregation-layers";
import { AmbientLight, PointLight, LightingEffect } from "@deck.gl/core";
import { Map } from "react-map-gl/maplibre";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  TrendingUp,
  Loader2,
  Calendar,
  MapPin,
  Zap,
  RefreshCw,
  Info,
  BarChart3,
  Eye,
  EyeOff
} from "lucide-react";

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZWxlY3RyMCIsImEiOiJjbWc5azF3a3owamVvMmpzOHFsMHljem5qIn0.rpjeucjo4H9UArQn-oBSAA';

const DHAKA_BBOX = [90.2, 23.6, 90.6, 24.0];

// Lighting setup
const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0
});

const pointLight1 = new PointLight({
  color: [100, 150, 255],
  intensity: 2.0,
  position: [90.4, 23.8, 5000]
});

const pointLight2 = new PointLight({
  color: [255, 100, 150],
  intensity: 1.5,
  position: [90.3, 23.9, 3000]
});

const lightingEffect = new LightingEffect({ ambientLight, pointLight1, pointLight2 });

// NASA-themed color range (blue to red gradient)
const COLOR_RANGE = [
  [26, 152, 80],    // Green - Low growth
  [102, 194, 165],  // Light green
  [255, 255, 191],  // Yellow - Medium growth
  [254, 153, 41],   // Orange
  [227, 26, 28],    // Red - High growth
  [189, 0, 38]      // Dark red - Very high growth
];

const INITIAL_VIEW = {
  longitude: 90.4,
  latitude: 23.8,
  zoom: 11.5,
  pitch: 45,
  bearing: 0,
  maxZoom: 16,
  minZoom: 10
};

export default function UrbanGrowthPredictor() {
  const [data, setData] = useState(null);
  const [pointData, setPointData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewState, setViewState] = useState(INITIAL_VIEW);
  const [hoveredInfo, setHoveredInfo] = useState(null);
  const [targetYear, setTargetYear] = useState(2025);
  const [gridSize, setGridSize] = useState(20);
  const [radius, setRadius] = useState(500);
  const [stats, setStats] = useState(null);
  const [elevationScale, setElevationScale] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const deckRef = useRef(null);

  // Animate elevation on mount/data change
  useEffect(() => {
    if (pointData.length > 0) {
      // Start from 0
      setElevationScale(0);
      // Animate to full height
      const timer = setTimeout(() => setElevationScale(20), 100);
      return () => clearTimeout(timer);
    }
  }, [pointData]);

  // Pulsing elevation effect (breathing)
  useEffect(() => {
    if (pointData.length === 0) return;
    
    let frame = 0;
    const breathingAnimation = setInterval(() => {
      frame += 0.02;
      // Oscillate between 19 and 21 (base 20)
      const pulse = 20 + Math.sin(frame) * 1;
      setElevationScale(pulse);
    }, 50);
    
    return () => clearInterval(breathingAnimation);
  }, [pointData]);

  // Smooth rotation animation
  useEffect(() => {
    if (!autoRotate) return;
    
    const rotationInterval = setInterval(() => {
      setViewState(prev => ({
        ...prev,
        bearing: (prev.bearing + 0.1) % 360
      }));
    }, 50);
    
    return () => clearInterval(rotationInterval);
  }, [autoRotate]);

  // Fetch predictions
  const fetchPredictions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("http://localhost:8003/api/v1/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bbox: DHAKA_BBOX,
          grid_size: gridSize,
          year: targetYear
        })
      });
      
      if (!response.ok) throw new Error("Failed to fetch predictions");
      
      const result = await response.json();
      setData(result);
      
      // Convert grid cells to points for HexagonLayer
      const points = result.features.flatMap(f => {
        const coords = f.geometry.coordinates[0];
        const centerLon = f.properties.center_lon;
        const centerLat = f.properties.center_lat;
        const growth = f.properties.predicted_change;
        
        // Create multiple points per cell based on growth intensity
        // More points = taller hexagons in that area
        const numPoints = Math.max(1, Math.floor(growth / 10));
        return Array(numPoints).fill(null).map(() => ({
          position: [centerLon, centerLat],
          growth: growth,
          cell_id: f.properties.cell_id,
          properties: f.properties
        }));
      });
      
      setPointData(points);
      
      // Calculate statistics
      const growthValues = result.features.map(f => f.properties.predicted_change);
      const avgGrowth = growthValues.reduce((a, b) => a + b, 0) / growthValues.length;
      const maxGrowth = Math.max(...growthValues);
      const highGrowthCount = growthValues.filter(v => v > avgGrowth).length;
      
      setStats({
        totalCells: result.features.length,
        avgGrowth: avgGrowth.toFixed(2),
        maxGrowth: maxGrowth.toFixed(2),
        highGrowthCells: highGrowthCount
      });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchPredictions();
  }, []);

  // Tooltip formatter
  const getTooltip = (info) => {
    if (!info.object) return null;
    
    const count = info.object.count || 0;
    const points = info.object.points || [];
    
    if (points.length === 0) return null;
    
    const avgGrowth = points.reduce((sum, p) => sum + (p.growth || 0), 0) / points.length;
    const cellInfo = points[0]?.properties;
    
    if (!cellInfo) return null;
    
    return {
      html: `
        <div style="background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); 
                    padding: 12px; 
                    border-radius: 8px; 
                    border: 2px solid #3b82f6;
                    font-family: monospace;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
          <div style="color: #60a5fa; font-size: 11px; margin-bottom: 8px;">
            CELL #${cellInfo.cell_id}
          </div>
          <div style="color: white; font-size: 12px; margin-bottom: 4px;">
            <span style="color: #93c5fd;">Predicted Growth:</span>
            <span style="color: #34d399; font-weight: bold;"> +${avgGrowth.toFixed(1)}</span>
          </div>
          <div style="color: white; font-size: 11px;">
            <span style="color: #93c5fd;">Points:</span> ${count}
          </div>
          <div style="color: white; font-size: 11px;">
            <span style="color: #93c5fd;">Baseline GHS:</span> ${cellInfo.ghs_baseline?.toFixed(0) || 'N/A'}
          </div>
          <div style="color: white; font-size: 11px;">
            <span style="color: #93c5fd;">Night Lights:</span> ${cellInfo.nighttime_lights?.toFixed(1) || 'N/A'}
          </div>
        </div>
      `,
      style: {
        fontSize: '12px',
        color: '#fff'
      }
    };
  };

  // Layers
  const layers = [
    pointData.length > 0 && new HexagonLayer({
      id: 'hexagon-growth',
      data: pointData,
      gpuAggregation: true,
      pickable: true,
      extruded: true,
      radius: radius,
      elevationScale: elevationScale,
      elevationRange: [0, 1000],
      coverage: 0.88,
      colorRange: COLOR_RANGE,
      getPosition: d => d.position,
      getElevationWeight: d => d.growth || 1,
      getColorWeight: d => d.growth || 1,
      material: {
        ambient: 0.64,
        diffuse: 0.6,
        shininess: 32,
        specularColor: [51, 51, 51]
      },
      transitions: {
        elevationScale: {
          duration: 2000,
          easing: t => t * (2 - t) // Smooth ease-out
        },
        getPosition: {
          duration: 500,
          easing: t => t
        },
        getColorWeight: {
          duration: 1000,
          easing: t => t
        },
        radius: {
          duration: 800,
          easing: t => t * t
        },
        coverage: {
          duration: 800,
          easing: t => t
        }
      },
      updateTriggers: {
        getPosition: pointData,
        elevationScale: elevationScale
      }
    })
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Animated star field background */}
      <div className="absolute inset-0 opacity-30">
        <div className="stars"></div>
        <div className="stars2"></div>
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 via-black/50 to-transparent backdrop-blur-sm border-b border-blue-500/20">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-blue-400" />
                URBAN GROWTH PREDICTOR
              </h1>
              <p className="text-blue-200 text-sm font-mono">
                🛰️ GPU-Accelerated ML | GHS + MODIS + VIIRS | Dhaka, Bangladesh
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setAutoRotate(!autoRotate)}
                variant="outline"
                className={`border-blue-400/30 text-blue-100 hover:bg-blue-900/50 ${
                  autoRotate ? 'bg-blue-600/50' : 'bg-blue-950/50'
                }`}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${autoRotate ? 'animate-spin' : ''}`} />
                AUTO ROTATE
              </Button>
              
              <Button
                onClick={() => setViewState(INITIAL_VIEW)}
                variant="outline"
                className="bg-blue-950/50 border-blue-400/30 text-blue-100 hover:bg-blue-900/50"
              >
                <MapPin className="w-4 h-4 mr-2" />
                RESET VIEW
              </Button>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-4 gap-3">
              <Card className="bg-gradient-to-br from-blue-900/50 to-blue-950/30 border-blue-400/30 backdrop-blur-sm p-3">
                <div className="text-blue-300 text-xs font-mono mb-1">TOTAL CELLS</div>
                <div className="text-white text-2xl font-bold">{stats.totalCells}</div>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-900/50 to-green-950/30 border-green-400/30 backdrop-blur-sm p-3">
                <div className="text-green-300 text-xs font-mono mb-1">AVG GROWTH</div>
                <div className="text-white text-2xl font-bold">+{stats.avgGrowth}</div>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-900/50 to-orange-950/30 border-orange-400/30 backdrop-blur-sm p-3">
                <div className="text-orange-300 text-xs font-mono mb-1">MAX GROWTH</div>
                <div className="text-white text-2xl font-bold">+{stats.maxGrowth}</div>
              </Card>
              
              <Card className="bg-gradient-to-br from-red-900/50 to-red-950/30 border-red-400/30 backdrop-blur-sm p-3">
                <div className="text-red-300 text-xs font-mono mb-1">HIGH GROWTH</div>
                <div className="text-white text-2xl font-bold">{stats.highGrowthCells}</div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Control Panel */}
      <div className="absolute top-64 right-6 z-20 w-80">
        <Card className="bg-gradient-to-br from-slate-900/90 to-blue-950/90 border-blue-400/30 backdrop-blur-md p-6">
          <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-400" />
            PREDICTION CONTROLS
          </h2>

          {/* Target Year */}
          <div className="mb-6">
            <label className="text-blue-200 text-sm font-mono mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              TARGET YEAR: {targetYear}
            </label>
            <Slider
              value={[targetYear]}
              onValueChange={(v) => setTargetYear(v[0])}
              min={2025}
              max={2050}
              step={5}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-blue-300 mt-1">
              <span>2025</span>
              <span>2050</span>
            </div>
          </div>

          {/* Grid Resolution */}
          <div className="mb-6">
            <label className="text-blue-200 text-sm font-mono mb-2 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              GRID RESOLUTION: {gridSize}×{gridSize}
            </label>
            <Slider
              value={[gridSize]}
              onValueChange={(v) => setGridSize(v[0])}
              min={10}
              max={40}
              step={5}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-blue-300 mt-1">
              <span>Coarse</span>
              <span>Fine</span>
            </div>
          </div>

          {/* Hexagon Radius */}
          <div className="mb-6">
            <label className="text-blue-200 text-sm font-mono mb-2 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              HEXAGON SIZE: {radius}m
            </label>
            <Slider
              value={[radius]}
              onValueChange={(v) => setRadius(v[0])}
              min={200}
              max={1000}
              step={100}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-blue-300 mt-1">
              <span>Small</span>
              <span>Large</span>
            </div>
          </div>

          {/* Run Prediction */}
          <Button
            onClick={fetchPredictions}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                COMPUTING...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                RUN PREDICTION
              </>
            )}
          </Button>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-blue-400/20">
            <h3 className="text-white text-sm font-bold mb-3">GROWTH INTENSITY</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: "rgb(26,152,80)" }}></div>
                <span className="text-blue-200">Very Low</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: "rgb(102,194,165)" }}></div>
                <span className="text-blue-200">Low</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: "rgb(255,255,191)" }}></div>
                <span className="text-blue-200">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: "rgb(254,153,41)" }}></div>
                <span className="text-blue-200">High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: "rgb(227,26,28)" }}></div>
                <span className="text-blue-200">Very High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: "rgb(189,0,38)" }}></div>
                <span className="text-blue-200">Extreme</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-blue-300">
              Height = Aggregated growth predictions
            </div>
          </div>
        </Card>
      </div>

      {/* DeckGL Map */}
      <div id="deckgl-wrapper" className="absolute inset-0">
        <DeckGL
          ref={deckRef}
          initialViewState={viewState}
          controller={true}
          layers={layers}
          onViewStateChange={({ viewState }) => setViewState(viewState)}
          effects={[lightingEffect]}
          getTooltip={getTooltip}
        >
          <Map
            reuseMaps
            mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
            style={{ width: "100%", height: "100%" }}
          />
        </DeckGL>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center">
          <Card className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-400/50 p-8">
            <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
            <p className="text-blue-200 font-mono text-center">
              Inferring ML model...
            </p>
          </Card>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30">
          <Card className="bg-red-900/90 border-red-500 p-4">
            <p className="text-white">{error}</p>
          </Card>
        </div>
      )}

      <style jsx global>{`
        .stars, .stars2 {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          display: block;
        }
        
        .stars {
          background: transparent url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="10" cy="10" r="0.5" fill="white"/><circle cx="30" cy="20" r="0.3" fill="white"/><circle cx="50" cy="5" r="0.4" fill="white"/><circle cx="70" cy="15" r="0.2" fill="white"/><circle cx="90" cy="8" r="0.5" fill="white"/></svg>') repeat top center;
          animation: move-stars 100s linear infinite;
        }
        
        .stars2 {
          background: transparent url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="15" cy="25" r="0.3" fill="white"/><circle cx="35" cy="45" r="0.4" fill="white"/><circle cx="55" cy="30" r="0.2" fill="white"/><circle cx="75" cy="40" r="0.5" fill="white"/><circle cx="95" cy="35" r="0.3" fill="white"/></svg>') repeat top center;
          animation: move-stars 150s linear infinite;
          opacity: 0.5;
        }
        
        @keyframes move-stars {
          from { transform: translateY(0); }
          to { transform: translateY(-100vh); }
        }
        
        /* Pulsing glow effect for canvas */
        #deckgl-wrapper canvas {
          filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.3));
          animation: pulse-glow 3s ease-in-out infinite;
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 30px rgba(59, 130, 246, 0.5));
          }
        }
      `}</style>
    </div>
  );
}

