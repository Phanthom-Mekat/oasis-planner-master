'use client';

import { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { PolygonLayer, TextLayer } from '@deck.gl/layers';
import { Map } from 'react-map-gl/mapbox';
import { AmbientLight, PointLight, LightingEffect } from '@deck.gl/core';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZWxlY3RyMCIsImEiOiJjbWc5azF3a3owamVvMmpzOHFsMHljem5qIn0.rpjeucjo4H9UArQn-oBSAA';

// NASA-themed dramatic lighting
const ambientLight = new AmbientLight({
  color: [200, 220, 255],
  intensity: 0.4
});

const pointLight1 = new PointLight({
  color: [252, 61, 33], // NASA Red
  intensity: 3.0,
  position: [90.4, 23.8, 10000]
});

const pointLight2 = new PointLight({
  color: [11, 61, 145], // NASA Blue
  intensity: 2.5,
  position: [90.35, 23.85, 8000]
});

const pointLight3 = new PointLight({
  color: [255, 255, 255],
  intensity: 1.5,
  position: [90.42, 23.75, 6000]
});

const lightingEffect = new LightingEffect({ambientLight, pointLight1, pointLight2, pointLight3});

const INITIAL_VIEW = {
  longitude: 90.4,
  latitude: 23.8,
  zoom: 11.5,
  pitch: 60,
  bearing: -30,
  maxPitch: 85,
  minZoom: 10,
  maxZoom: 16
};

const MATERIAL = {
  ambient: 0.25,
  diffuse: 0.8,
  shininess: 64,
  specularColor: [60, 100, 180]  // NASA Blue specular
};

export default function OpportunityMapper3D() {
  const [mapdata, setMapdata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewState, setViewState] = useState(INITIAL_VIEW);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [hoveredInfo, setHoveredInfo] = useState(null);
  const [time, setTime] = useState(0);
  const [showLabels, setShowLabels] = useState(true);
  const [focusedCell, setFocusedCell] = useState(null); // Track zoomed cell
  const [layers, setLayers] = useState({
    population: true,
    food: true,
    transport: true,
    housing: true
  });

  // Animation loop for pulsing effects
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => (t + 0.05) % (Math.PI * 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8002/api/v1/dhaka/opportunity_index');
      const data = await response.json();
      setMapdata(data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const fetchCellDetails = async (cellId) => {
    try {
      const response = await fetch(`http://localhost:8002/api/v1/dhaka/opportunity_index/cell/${cellId}`);
      const data = await response.json();
      setSelected(data);
      setShowModal(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getColor = (properties, isHovered = false) => {
    const score = properties.opportunity_score;
    const housing = properties.housing_pressure_score;
    
    // Enhanced gradient colors based on score
    let r, g, b;
    
    if (score < 0.4) {
      // Critical zones: Red with intensity based on housing pressure
      const intensity = 200 + (housing * 55);
      r = intensity;
      g = 40 + (score * 80);
      b = 50 + (score * 60);
    } else if (score < 0.7) {
      // Medium zones: Amber to Yellow gradient
      const t = (score - 0.4) / 0.3;
      r = 245;
      g = 140 + (t * 80);
      b = 30 + (t * 70);
    } else {
      // High opportunity: Emerald to Cyan gradient
      const t = (score - 0.7) / 0.3;
      r = 16 + (t * 40);
      g = 185 + (t * 50);
      b = 129 + (t * 100);
    }
    
    const alpha = isHovered ? 255 : 220;
    return [r, g, b, alpha];
  };

  const getElevation = (properties, animate = false) => {
    const score = properties.opportunity_score;
    const housing = properties.housing_pressure_score;
    const population = properties.population_density;
    
    const baseHeight = (1 - score) * 1800;
    const housingBonus = housing * 1000;
    const popBonus = (population / 30000) * 600;
    
    let totalHeight = baseHeight + housingBonus + popBonus;
    
    // Pulsing animation for critical zones
    if (animate && score < 0.4) {
      const pulse = Math.sin(time * 2) * 0.1 + 1;
      totalHeight *= pulse;
    }
    
    return totalHeight;
  };

  const getLineColor = (properties, isHovered = false) => {
    const score = properties.opportunity_score;
    
    if (isHovered) {
      return [255, 255, 255, 255];
    }
    
    // Glowing edges for critical zones
    if (score < 0.4) {
      const glow = Math.sin(time * 3) * 0.3 + 0.7;
      return [252, 61, 33, Math.floor(glow * 200)]; // NASA Red glow
    } else if (score < 0.7) {
      return [245, 158, 11, 120]; // Amber outline
    }
    return [11, 61, 145, 100]; // NASA Blue outline
  };

  const toggleLayer = (layer) => {
    setLayers({ ...layers, [layer]: !layers[layer] });
  };

  // Calculate polygon centroid
  const getPolygonCenter = (coordinates) => {
    const coords = coordinates[0];
    let sumLon = 0, sumLat = 0;
    coords.forEach(([lon, lat]) => {
      sumLon += lon;
      sumLat += lat;
    });
    return [sumLon / coords.length, sumLat / coords.length];
  };

  // Zoom to specific cell
  const zoomToCell = (cellId) => {
    const feature = mapdata?.features.find(f => f.properties.cell_id === cellId);
    if (!feature) return;

    const center = getPolygonCenter(feature.geometry.coordinates);
    
    setFocusedCell(cellId); // Mark cell as focused (will hide 3D blocks)
    
    setViewState({
      ...viewState,
      longitude: center[0],
      latitude: center[1],
      zoom: 17.5,  // Very close zoom to see map details
      pitch: 0,    // Top-down view to see map clearly
      bearing: 0,  // North-up orientation
      transitionDuration: 2000,  // Smooth 2s transition
      transitionInterpolator: null
    });
  };

  // Reset to overview
  const resetView = () => {
    setFocusedCell(null);
    setViewState({
      ...INITIAL_VIEW,
      transitionDuration: 1500
    });
  };

  // Get label text for cell
  const getLabelText = (properties) => {
    const score = properties.opportunity_score;
    const category = properties.category.toUpperCase();
    return `#${properties.cell_id}\n${(score * 100).toFixed(0)}%`;
  };

  const deckLayers = mapdata && !focusedCell ? [
    // Main filled polygons with enhanced colors (hide when focused on specific cell)
    new PolygonLayer({
      id: 'opportunity-3d-filled',
      data: mapdata.features,
      pickable: true,
      stroked: false,
      filled: true,
      wireframe: false,
      extruded: true,
      material: MATERIAL,
      opacity: focusedCell ? 0 : 1, // Fade out when focused
      
      getPolygon: d => d.geometry.coordinates[0],
      getElevation: d => getElevation(d.properties, true),
      getFillColor: d => getColor(d.properties, hoveredCell === d.properties.cell_id),
      
      onClick: (info) => {
        if (info.object) {
          fetchCellDetails(info.object.properties.cell_id);
        }
      },
      
      onHover: (info) => {
        if (info.object) {
          setHoveredCell(info.object.properties.cell_id);
          setHoveredInfo({
            x: info.x,
            y: info.y,
            properties: info.object.properties
          });
          document.body.style.cursor = 'pointer';
        } else {
          setHoveredCell(null);
          setHoveredInfo(null);
          document.body.style.cursor = 'default';
        }
      },
      
      updateTriggers: {
        getElevation: [layers, time],
        getFillColor: [layers, hoveredCell]
      },
      
      transitions: {
        getElevation: {
          duration: 400,
          easing: t => t * (2 - t)
        },
        getFillColor: {
          duration: 200
        }
      }
    }),
    
    // Wireframe overlay for depth and definition
    new PolygonLayer({
      id: 'opportunity-3d-wireframe',
      data: mapdata.features,
      pickable: false,
      stroked: true,
      filled: false,
      wireframe: true,
      extruded: true,
      material: MATERIAL,
      
      getPolygon: d => d.geometry.coordinates[0],
      getElevation: d => getElevation(d.properties, true) + 5, // Slightly above to prevent z-fighting
      getLineColor: d => getLineColor(d.properties, hoveredCell === d.properties.cell_id),
      getLineWidth: hoveredCell ? (d => d.properties.cell_id === hoveredCell ? 4 : 2) : 2,
      lineWidthMinPixels: 1,
      lineWidthMaxPixels: 6,
      
      updateTriggers: {
        getElevation: [layers, time],
        getLineColor: [time, hoveredCell],
        getLineWidth: [hoveredCell]
      },
      
      transitions: {
        getElevation: {
          duration: 400,
          easing: t => t * (2 - t)
        },
        getLineColor: {
          duration: 150
        },
        getLineWidth: {
          duration: 150
        }
      }
    }),
    
    // Floating text labels above blocks
    ...(showLabels ? [new TextLayer({
      id: 'cell-labels',
      data: mapdata.features,
      pickable: false,
      
      getPosition: d => {
        const center = getPolygonCenter(d.geometry.coordinates);
        const elevation = getElevation(d.properties, true);
        return [...center, elevation + 100]; // 100 units above block
      },
      
      getText: d => getLabelText(d.properties),
      getColor: d => {
        const score = d.properties.opportunity_score;
        if (hoveredCell === d.properties.cell_id) {
          return [255, 255, 255, 255];
        }
        if (score < 0.4) return [255, 255, 255, 220];
        if (score < 0.7) return [50, 50, 50, 200];
        return [20, 20, 20, 180];
      },
      getSize: hoveredCell ? (d => d.properties.cell_id === hoveredCell ? 16 : 12) : 12,
      getAngle: 0,
      getTextAnchor: 'middle',
      getAlignmentBaseline: 'center',
      fontFamily: 'Monaco, Consolas, monospace',
      fontWeight: 'bold',
      outlineWidth: 2,
      outlineColor: [0, 0, 0, 180],
      
      updateTriggers: {
        getPosition: [time],
        getColor: [hoveredCell],
        getSize: [hoveredCell]
      },
      
      transitions: {
        getPosition: {
          duration: 400,
          easing: t => t * (2 - t)
        },
        getSize: {
          duration: 150
        }
      }
    })] : [])
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-[#0B3D91] via-slate-900 to-black relative overflow-hidden">
        {/* Animated stars background */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: Math.random() * 0.7 + 0.3
              }}
            />
          ))}
        </div>
        
        <div className="text-center z-10">
          <div className="mb-6">
            <div className="text-6xl mb-4 animate-pulse">🛰️</div>
            <div className="text-3xl font-bold text-white mb-2 tracking-wider">
              INITIALIZING MISSION
            </div>
            <div className="text-[#FC3D21] font-mono text-sm mb-4 tracking-widest">
              OPPORTUNITY INDEX MAPPER
            </div>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-gradient-to-r from-[#0B3D91] via-[#FC3D21] to-[#0B3D91] animate-pulse" 
                   style={{width: '100%'}} />
            </div>
            <div className="text-sm text-gray-400 font-mono">
              Loading NASA Satellite Data...
            </div>
            <div className="text-xs text-gray-500 mt-2 font-mono">
              VNP46A3 • MODIS • OSM
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gradient-to-br from-[#0B3D91] via-slate-900 to-black relative overflow-hidden">
      {/* Animated stars background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-px bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.2
            }}
          />
        ))}
      </div>
      
      <div className="w-96 bg-gradient-to-b from-[#0B3D91]/95 via-slate-900/95 to-black/95 backdrop-blur-sm p-6 overflow-y-auto border-r border-[#FC3D21]/30 z-10 shadow-2xl shadow-[#0B3D91]/50 relative">
        {/* NASA Logo Header */}
        <div className="mb-6 pb-4 border-b border-[#FC3D21]/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-4xl">🛰️</div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wider">OASIS</h1>
              <p className="text-xs text-[#FC3D21] font-mono tracking-widest">MISSION CONTROL</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#FC3D21] rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400 font-mono">REAL-TIME SATELLITE DATA</span>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 bg-[#FC3D21]"></div>
            <h2 className="font-bold text-white text-sm uppercase tracking-wider">Navigation Controls</h2>
          </div>
          <p className="text-xs text-gray-400 font-mono ml-3">3D Orbital View System</p>
        </div>

        <div className="mb-6 space-y-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-gradient-to-r from-[#0B3D91] to-[#FC3D21] border-[#FC3D21]/50 text-white hover:from-[#FC3D21] hover:to-[#0B3D91] transition-all duration-300 font-mono tracking-wider shadow-lg shadow-[#FC3D21]/30"
            onClick={() => resetView()}
          >
            {focusedCell ? '↩️ BACK TO OVERVIEW' : '↻ RESET ORBITAL VIEW'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-black/50 border-[#0B3D91] text-white hover:bg-[#0B3D91] hover:border-[#FC3D21] transition-all duration-300 font-mono tracking-wider"
            onClick={() => setViewState({...viewState, pitch: viewState.pitch === 0 ? 60 : 0})}
          >
            {viewState.pitch === 0 ? '↗ 3D PROJECTION' : '↓ 2D FLATMAP'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className={`w-full border-[#0B3D91] text-white hover:border-[#FC3D21] transition-all duration-300 font-mono tracking-wider ${
              showLabels ? 'bg-[#FC3D21]/30 border-[#FC3D21]' : 'bg-black/50'
            }`}
            onClick={() => setShowLabels(!showLabels)}
          >
            {showLabels ? '🏷️ LABELS ON' : '🏷️ LABELS OFF'}
          </Button>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 bg-[#FC3D21]"></div>
            <h2 className="font-bold text-white text-sm uppercase tracking-wider">Satellite Layers</h2>
          </div>
          <div className="space-y-2 bg-black/30 p-4 rounded-lg border border-[#0B3D91]/30">
            <label className="flex items-center gap-3 cursor-pointer group hover:bg-[#0B3D91]/20 p-2 rounded transition">
              <input
                type="checkbox"
                checked={layers.population}
                onChange={() => toggleLayer('population')}
                className="w-4 h-4 accent-[#FC3D21]"
              />
              <div className="flex-1">
                <div className="text-sm text-white font-mono">Population Density</div>
                <div className="text-[10px] text-[#FC3D21] tracking-wider">NASA • SEDAC</div>
              </div>
              <div className="text-xs text-emerald-400">●</div>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer group hover:bg-[#0B3D91]/20 p-2 rounded transition">
              <input
                type="checkbox"
                checked={layers.food}
                onChange={() => toggleLayer('food')}
                className="w-4 h-4 accent-[#FC3D21]"
              />
              <div className="flex-1">
                <div className="text-sm text-white font-mono">Food Access</div>
                <div className="text-[10px] text-[#FC3D21] tracking-wider">NASA • MODIS MCD12Q1</div>
              </div>
              <div className="text-xs text-emerald-400">●</div>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer group hover:bg-[#0B3D91]/20 p-2 rounded transition">
              <input
                type="checkbox"
                checked={layers.transport}
                onChange={() => toggleLayer('transport')}
                className="w-4 h-4 accent-[#FC3D21]"
              />
              <div className="flex-1">
                <div className="text-sm text-white font-mono">Transport Network</div>
                <div className="text-[10px] text-[#FC3D21] tracking-wider">OSM • ROAD DATA</div>
              </div>
              <div className="text-xs text-emerald-400">●</div>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer group hover:bg-[#0B3D91]/20 p-2 rounded transition">
              <input
                type="checkbox"
                checked={layers.housing}
                onChange={() => toggleLayer('housing')}
                className="w-4 h-4 accent-[#FC3D21]"
              />
              <div className="flex-1">
                <div className="text-sm text-white font-mono">Housing Pressure</div>
                <div className="text-[10px] text-[#FC3D21] tracking-wider">NASA • VIIRS VNP46A3</div>
              </div>
              <div className="text-xs text-emerald-400">●</div>
            </label>
          </div>
        </div>

        <div className="mb-6 bg-gradient-to-br from-[#0B3D91]/30 to-black/50 rounded-lg p-4 border border-[#FC3D21]/30">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 bg-[#FC3D21]"></div>
            <h2 className="font-bold text-white text-xs uppercase tracking-wider">Elevation Matrix</h2>
          </div>
          <div className="space-y-3 text-xs font-mono">
            <div className="flex items-center gap-3 group">
              <div className="w-16 h-2 bg-gradient-to-r from-red-600 via-red-500 to-red-400 rounded shadow-lg shadow-red-500/50"></div>
              <span className="text-gray-300 group-hover:text-white transition">CRITICAL • Low Access</span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="w-16 h-2 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 rounded shadow-lg shadow-amber-500/50"></div>
              <span className="text-gray-300 group-hover:text-white transition">MODERATE • Medium</span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="w-16 h-2 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 rounded shadow-lg shadow-emerald-500/50"></div>
              <span className="text-gray-300 group-hover:text-white transition">OPTIMAL • High Access</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#0B3D91]/50 text-[10px] text-gray-500 italic">
            Height represents intervention priority
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 bg-[#FC3D21]"></div>
            <h2 className="font-bold text-white text-xs uppercase tracking-wider">Zone Classification</h2>
          </div>
          <div className="space-y-2 bg-black/30 p-3 rounded-lg border border-[#0B3D91]/30">
            <div className="flex items-center gap-3 group cursor-pointer hover:bg-[#0B3D91]/20 p-2 rounded transition">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded shadow-lg shadow-emerald-500/50 flex items-center justify-center text-white font-bold text-xs">
                H
              </div>
              <div className="flex-1">
                <div className="text-sm text-white font-mono">High</div>
                <div className="text-[10px] text-emerald-400">Optimal Resources</div>
              </div>
            </div>
            <div className="flex items-center gap-3 group cursor-pointer hover:bg-[#0B3D91]/20 p-2 rounded transition">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded shadow-lg shadow-amber-500/50 flex items-center justify-center text-white font-bold text-xs">
                M
              </div>
              <div className="flex-1">
                <div className="text-sm text-white font-mono">Medium</div>
                <div className="text-[10px] text-amber-400">Needs Improvement</div>
              </div>
            </div>
            <div className="flex items-center gap-3 group cursor-pointer hover:bg-[#0B3D91]/20 p-2 rounded transition">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded shadow-lg shadow-red-500/50 flex items-center justify-center text-white font-bold text-xs">
                L
              </div>
              <div className="flex-1">
                <div className="text-sm text-white font-mono">Low</div>
                <div className="text-[10px] text-red-400">Priority Zone</div>
              </div>
            </div>
          </div>
        </div>

        {mapdata && (
          <div className="pt-4 border-t border-[#FC3D21]/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-[#FC3D21]"></div>
              <h2 className="font-bold text-white text-xs uppercase tracking-wider">Mission Data Sources</h2>
            </div>
            <ul className="space-y-2 bg-black/30 p-3 rounded-lg border border-[#0B3D91]/30">
              {mapdata.metadata.data_sources.map((source, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[11px] font-mono text-gray-400 hover:text-white transition group">
                  <span className="text-[#FC3D21] mt-0.5 group-hover:animate-pulse">▸</span>
                  <span>{source}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 p-3 bg-gradient-to-r from-[#0B3D91]/30 to-[#FC3D21]/20 rounded border border-[#FC3D21]/20 text-[10px] text-gray-400 italic font-mono text-center">
              <span className="text-[#FC3D21]">▶</span> Click any zone to view detailed telemetry
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 relative">
        <DeckGL
          viewState={viewState}
          onViewStateChange={({viewState}) => setViewState(viewState)}
          controller={true}
          layers={deckLayers}
          effects={[lightingEffect]}
          parameters={{
            clearColor: [0.02, 0.05, 0.1, 1]
          }}
        >
          <Map
            mapboxAccessToken={MAPBOX_TOKEN}
            mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
          />
        </DeckGL>
        
        {/* NASA-style HUD Overlay */}
        <div className="absolute top-6 right-6 bg-gradient-to-br from-[#0B3D91]/90 to-black/90 backdrop-blur-md px-5 py-3 rounded-lg border border-[#FC3D21]/50 shadow-2xl shadow-[#0B3D91]/50">
          <div className="font-mono text-xs space-y-1">
            <div className="flex items-center gap-2 text-white">
              <span className="text-[#FC3D21]">■</span>
              <span className="tracking-wider">ORBITAL VIEW</span>
            </div>
            <div className="text-gray-400 text-[10px] space-y-0.5">
              <div>PITCH: <span className="text-[#FC3D21] font-bold">{Math.round(viewState.pitch)}°</span></div>
              <div>ZOOM: <span className="text-[#FC3D21] font-bold">{viewState.zoom.toFixed(2)}x</span></div>
              <div>BEARING: <span className="text-[#FC3D21] font-bold">{Math.round(viewState.bearing)}°</span></div>
            </div>
          </div>
        </div>
        
        {/* Mission Status Badge */}
        {!focusedCell ? (
          <div className="absolute top-6 left-6 bg-gradient-to-r from-[#0B3D91]/90 to-[#FC3D21]/90 backdrop-blur-md px-4 py-2 rounded-lg border border-white/30 shadow-2xl shadow-[#FC3D21]/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-white font-mono text-xs tracking-widest">LIVE DATA STREAM</span>
            </div>
          </div>
        ) : (
          <div className="absolute top-6 left-6 bg-gradient-to-r from-black/90 to-[#0B3D91]/90 backdrop-blur-md px-4 py-3 rounded-lg border-2 border-[#FC3D21]/60 shadow-2xl shadow-[#FC3D21]/50">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="text-lg">🎯</div>
                <span className="text-white font-mono text-sm font-bold tracking-wider">FOCUSED MODE</span>
              </div>
              <div className="text-xs text-[#FC3D21] font-mono">
                ZONE #{focusedCell} • MAP VIEW
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 bg-[#FC3D21]/20 border-[#FC3D21] text-white hover:bg-[#FC3D21] transition-all font-mono text-xs"
                onClick={resetView}
              >
                ↩️ BACK TO 3D VIEW
              </Button>
            </div>
          </div>
        )}
        
        {/* Coordinates Display */}
        <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-sm px-4 py-2 rounded border border-[#0B3D91]/50 shadow-xl">
          <div className="text-[10px] font-mono text-gray-400">
            <span className="text-[#FC3D21]">LAT:</span> {viewState.latitude.toFixed(6)}° 
            <span className="mx-2 text-[#0B3D91]">|</span> 
            <span className="text-[#FC3D21]">LON:</span> {viewState.longitude.toFixed(6)}°
          </div>
        </div>
        
        {/* Hover Tooltip */}
        {hoveredInfo && (
          <div 
            className="absolute pointer-events-none z-50"
            style={{
              left: hoveredInfo.x + 15,
              top: hoveredInfo.y + 15
            }}
          >
            <div className="bg-gradient-to-br from-[#0B3D91]/95 via-slate-900/95 to-black/95 backdrop-blur-md px-4 py-3 rounded-lg border-2 border-[#FC3D21]/60 shadow-2xl shadow-[#FC3D21]/50 min-w-[200px]">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#FC3D21]/30">
                <div className="text-lg">🛰️</div>
                <div>
                  <div className="text-white font-bold font-mono text-sm">ZONE #{hoveredInfo.properties.cell_id}</div>
                  <div className="text-[10px] text-[#FC3D21] font-mono tracking-wider">
                    {hoveredInfo.properties.category.toUpperCase()} PRIORITY
                  </div>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-400 font-mono">SCORE:</span>
                  <span className="text-sm text-white font-bold font-mono">
                    {(hoveredInfo.properties.opportunity_score * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-400 font-mono">POPULATION:</span>
                  <span className="text-xs text-white font-mono">
                    {hoveredInfo.properties.population_density.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-400 font-mono">FOOD ACCESS:</span>
                  <span className="text-xs text-white font-mono">
                    {hoveredInfo.properties.food_access_distance_km}km
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-400 font-mono">TRANSPORT:</span>
                  <span className="text-xs text-white font-mono">
                    {hoveredInfo.properties.transport_access_score.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="mt-2 pt-2 border-t border-[#0B3D91]/30 text-[9px] text-gray-500 font-mono text-center">
                Click for detailed analysis
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-3xl bg-gradient-to-br from-[#0B3D91]/95 via-slate-900/95 to-black/95 border-[#FC3D21]/50 text-white backdrop-blur-xl">
          <DialogHeader className="border-b border-[#FC3D21]/30 pb-4">
            <DialogTitle className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🛰️</div>
                <div>
                  <div className="text-lg font-bold tracking-wider">ZONE TELEMETRY</div>
                  <div className="text-xs text-[#FC3D21] font-mono tracking-widest">CELL #{selected?.cell_id}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selected && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gradient-to-r from-[#0B3D91] to-[#FC3D21] border-[#FC3D21]/50 text-white hover:from-[#FC3D21] hover:to-[#0B3D91] transition-all duration-300 font-mono tracking-wider shadow-lg shadow-[#FC3D21]/30"
                    onClick={() => {
                      zoomToCell(selected.cell_id);
                      setShowModal(false);
                    }}
                  >
                    🎯 ZOOM TO AREA
                  </Button>
                )}
                {selected && (
                  <Badge 
                    variant="outline"
                    className={`font-mono tracking-widest ${
                      selected.category === 'low' 
                        ? 'bg-red-500/20 border-red-500 text-red-300' 
                        : selected.category === 'high' 
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' 
                        : 'bg-amber-500/20 border-amber-500 text-amber-300'
                    }`}
                  >
                    {selected.category.toUpperCase()}
                  </Badge>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selected && (
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              <div className="bg-gradient-to-r from-[#0B3D91]/40 via-[#FC3D21]/20 to-[#0B3D91]/40 p-6 rounded-lg border border-[#FC3D21]/30 shadow-xl shadow-[#0B3D91]/50">
                <div className="text-xs text-gray-400 mb-2 font-mono tracking-wider">OPPORTUNITY INDEX</div>
                <div className="text-6xl font-bold bg-gradient-to-r from-[#FC3D21] to-[#0B3D91] bg-clip-text text-transparent">
                  {selected.opportunity_score}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className={`h-2 flex-1 rounded-full overflow-hidden bg-black/50`}>
                    <div 
                      className={`h-full transition-all duration-500 ${
                        selected.category === 'low' ? 'bg-red-500' :
                        selected.category === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{width: `${selected.opportunity_score * 100}%`}}
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-3 font-mono uppercase tracking-wider">
                  {selected.category === 'low' && '🚨 Priority intervention zone'}
                  {selected.category === 'medium' && '⚠️ Moderate development needed'}
                  {selected.category === 'high' && '✓ Good access to resources'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {layers.population && (
                  <div className="border border-[#0B3D91]/50 rounded-lg p-4 bg-gradient-to-br from-black/60 to-[#0B3D91]/20 hover:border-[#FC3D21]/50 transition-all group">
                    <div className="text-[10px] text-[#FC3D21] mb-2 font-mono tracking-wider uppercase">Population Density</div>
                    <div className="text-3xl font-bold text-white mb-1">
                      {selected.metrics.population_density.value.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400 font-mono">people/km²</div>
                    <div className="mt-3 pt-2 border-t border-[#0B3D91]/30 text-[10px] text-gray-500 font-mono">
                      {selected.metrics.population_density.source}
                    </div>
                  </div>
                )}
                
                {layers.food && (
                  <div className="border border-[#0B3D91]/50 rounded-lg p-4 bg-gradient-to-br from-black/60 to-[#0B3D91]/20 hover:border-[#FC3D21]/50 transition-all group">
                    <div className="text-[10px] text-[#FC3D21] mb-2 font-mono tracking-wider uppercase">Food Access</div>
                    <div className="text-3xl font-bold text-white mb-1">
                      {selected.metrics.food_access.distance_km} <span className="text-lg">km</span>
                    </div>
                    <div className="text-xs text-gray-400 font-mono mb-2">to fresh markets</div>
                    <Badge variant="outline" className="bg-black/40 border-[#0B3D91]/50 text-white font-mono text-[10px]">
                      {selected.metrics.food_access.status}
                    </Badge>
                    <div className="mt-3 pt-2 border-t border-[#0B3D91]/30 text-[10px] text-gray-500 font-mono">
                      {selected.metrics.food_access.source}
                    </div>
                  </div>
                )}
                
                {layers.transport && (
                  <div className="border border-[#0B3D91]/50 rounded-lg p-4 bg-gradient-to-br from-black/60 to-[#0B3D91]/20 hover:border-[#FC3D21]/50 transition-all group">
                    <div className="text-[10px] text-[#FC3D21] mb-2 font-mono tracking-wider uppercase">Transport Access</div>
                    <div className="text-3xl font-bold text-white mb-1">
                      {selected.metrics.transport_access.score}
                    </div>
                    <div className="text-xs text-gray-400 font-mono mb-2">connectivity score</div>
                    <Badge variant="outline" className="bg-black/40 border-[#0B3D91]/50 text-white font-mono text-[10px]">
                      {selected.metrics.transport_access.status}
                    </Badge>
                    <div className="mt-3 pt-2 border-t border-[#0B3D91]/30 text-[10px] text-gray-500 font-mono">
                      {selected.metrics.transport_access.source}
                    </div>
                  </div>
                )}
                
                {layers.housing && (
                  <div className="border border-[#0B3D91]/50 rounded-lg p-4 bg-gradient-to-br from-black/60 to-[#0B3D91]/20 hover:border-[#FC3D21]/50 transition-all group">
                    <div className="text-[10px] text-[#FC3D21] mb-2 font-mono tracking-wider uppercase">Housing Pressure</div>
                    <div className="text-3xl font-bold text-white mb-1">
                      {selected.metrics.housing_pressure.score}
                    </div>
                    <div className="text-xs text-gray-400 font-mono mb-2">pressure index</div>
                    <Badge variant="outline" className="bg-black/40 border-[#0B3D91]/50 text-white font-mono text-[10px]">
                      {selected.metrics.housing_pressure.status}
                    </Badge>
                    <div className="mt-3 pt-2 border-t border-[#0B3D91]/30 text-[10px] text-gray-500 font-mono">
                      {selected.metrics.housing_pressure.source}
                    </div>
                  </div>
                )}
              </div>

              {selected.recommendations && selected.recommendations.length > 0 && (
                <div className="border-t border-[#FC3D21]/30 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-4 bg-[#FC3D21]"></div>
                    <div className="font-bold text-white text-sm uppercase tracking-wider">Mission Recommendations</div>
                  </div>
                  <ul className="space-y-3 bg-black/30 p-4 rounded-lg border border-[#0B3D91]/30">
                    {selected.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-gray-300 group hover:text-white transition">
                        <span className="text-[#FC3D21] font-bold mt-0.5 group-hover:animate-pulse">▸</span>
                        <span className="font-mono">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

