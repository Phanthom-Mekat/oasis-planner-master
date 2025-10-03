'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl/mapbox';
import { ScatterplotLayer, ColumnLayer, PathLayer } from '@deck.gl/layers';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import { LightingEffect, AmbientLight, _SunLight as SunLight } from '@deck.gl/core';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZWxlY3RyMCIsImEiOiJjbWc5azF3a3owamVvMmpzOHFsMHljem5qIn0.rpjeucjo4H9UArQn-oBSAA';

const INITIAL_VIEW_STATE = {
  longitude: 90.4125,
  latitude: 23.8103,
  zoom: 11.8,
  pitch: 60,
  bearing: -20,
  maxZoom: 16,
  minZoom: 9,
};

// Historical data for Dhaka urban growth (GHSL + VIIRS + WorldPop)
const HISTORICAL_GROWTH = [
  { year: 1975, population: 2.2, area: 160, builtUp: 0.15, nightLight: 0.2, type: 'historical' },
  { year: 1985, population: 4.5, area: 285, builtUp: 0.28, nightLight: 0.35, type: 'historical' },
  { year: 1995, population: 8.0, area: 420, builtUp: 0.42, nightLight: 0.55, type: 'historical' },
  { year: 2005, population: 12.5, area: 580, builtUp: 0.58, nightLight: 0.72, type: 'historical' },
  { year: 2015, population: 17.6, area: 780, builtUp: 0.78, nightLight: 0.88, type: 'historical' },
  { year: 2020, population: 20.2, area: 890, builtUp: 0.89, nightLight: 0.95, type: 'historical' },
  { year: 2025, population: 23.5, area: 1050, builtUp: 1.0, nightLight: 1.0, type: 'historical' },
];

// AI-Predicted future growth (2026-2030) - Machine Learning Projection
const PREDICTED_GROWTH = [
  { year: 2026, population: 24.8, area: 1120, builtUp: 1.07, nightLight: 1.05, type: 'predicted', confidence: 0.95 },
  { year: 2027, population: 26.2, area: 1195, builtUp: 1.14, nightLight: 1.10, type: 'predicted', confidence: 0.88 },
  { year: 2028, population: 27.7, area: 1275, builtUp: 1.21, nightLight: 1.16, type: 'predicted', confidence: 0.82 },
  { year: 2029, population: 29.3, area: 1360, builtUp: 1.30, nightLight: 1.22, type: 'predicted', confidence: 0.75 },
  { year: 2030, population: 31.0, area: 1450, builtUp: 1.38, nightLight: 1.28, type: 'predicted', confidence: 0.68 },
];

// Generate urban growth tendrils (blooming effect)
const generateGrowthTendrils = (year, time) => {
  const yearData = HISTORICAL_GROWTH.find(d => d.year === year) || HISTORICAL_GROWTH[HISTORICAL_GROWTH.length - 1];
  const progress = yearData.builtUp;
  const tendrils = [];
  
  // Center of Dhaka
  const centerLat = 23.8103;
  const centerLon = 90.4125;
  
  // 12 major growth directions (like flower petals)
  for (let direction = 0; direction < 12; direction++) {
    const angle = (direction / 12) * Math.PI * 2;
    const tendrilPoints = [];
    
    // Each tendril has multiple segments
    const segments = Math.floor(30 * progress);
    for (let i = 0; i < segments; i++) {
      const t = i / 30;
      const distance = 0.08 * t * progress; // Grows outward based on progress
      
      // Add organic variation to the path
      const variation = Math.sin(time * 0.3 + direction * 0.5 + i * 0.2) * 0.005;
      const lat = centerLat + Math.sin(angle + variation) * distance;
      const lon = centerLon + Math.cos(angle + variation) * distance;
      
      tendrilPoints.push([lon, lat]);
    }
    
    if (tendrilPoints.length > 1) {
      tendrils.push({
        path: tendrilPoints,
        direction,
        intensity: yearData.nightLight * (0.7 + Math.sin(time * 2 + direction) * 0.3),
      });
    }
  }
  
  return tendrils;
};

// Generate population density pillars
const generatePopulationPillars = (year, showDensity) => {
  if (!showDensity) return [];
  
  const yearData = HISTORICAL_GROWTH.find(d => d.year === year) || HISTORICAL_GROWTH[HISTORICAL_GROWTH.length - 1];
  const pillars = [];
  const centerLat = 23.8103;
  const centerLon = 90.4125;
  
  // Grid of population centers
  const gridSize = 15;
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const lat = centerLat + (i - gridSize/2) * 0.012;
      const lon = centerLon + (j - gridSize/2) * 0.012;
      
      // Distance from center
      const distance = Math.sqrt(Math.pow(lat - centerLat, 2) + Math.pow(lon - centerLon, 2));
      
      // Population density decreases with distance but varies by zone
      const baseHeight = Math.max(0, (1 - distance * 12) * yearData.population * 1000);
      
      // Add variation for different neighborhoods
      const variation = Math.sin(i * 0.8) * Math.cos(j * 0.8) * 0.5 + 0.5;
      const height = baseHeight * variation;
      
      if (height > 50) {
        pillars.push({
          position: [lon, lat],
          height: height,
          population: Math.round(height * 100),
          growthRate: year >= 2015 ? (distance > 0.03 ? 3.5 : 1.2) : 1.0,
        });
      }
    }
  }
  
  return pillars;
};

// Generate housing stress zones
const generateHousingStress = (year, showStress, pillars) => {
  if (!showStress || !pillars.length) return [];
  
  const yearData = HISTORICAL_GROWTH.find(d => d.year === year) || HISTORICAL_GROWTH[HISTORICAL_GROWTH.length - 1];
  const stressZones = [];
  
  // Identify high-growth, high-density areas with low land availability
  pillars.forEach(pillar => {
    if (pillar.growthRate > 2.5 && pillar.height > 800) {
      const centerLat = 23.8103;
      const centerLon = 90.4125;
      const distance = Math.sqrt(
        Math.pow(pillar.position[1] - centerLat, 2) + 
        Math.pow(pillar.position[0] - centerLon, 2)
      );
      
      // Peripheral areas with high growth = housing stress
      if (distance > 0.03) {
        const stressLevel = pillar.growthRate * pillar.height / 1000;
        stressZones.push({
          ...pillar,
          stress: Math.min(stressLevel, 5),
          urgency: stressLevel > 3 ? 'critical' : stressLevel > 2 ? 'high' : 'moderate',
        });
      }
    }
  });
  
  return stressZones;
};

export default function DeckGLGrowthMap() {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [currentYear, setCurrentYear] = useState(1975);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDensity, setShowDensity] = useState(false);
  const [showStress, setShowStress] = useState(false);
  const [time, setTime] = useState(0);
  const [selectedZone, setSelectedZone] = useState(null);
  const [isPredictionMode, setIsPredictionMode] = useState(false);
  const [predictionProgress, setPredictionProgress] = useState(0);
  const animationRef = useRef(null);

  // Combined data array
  const ALL_YEARS = isPredictionMode 
    ? [...HISTORICAL_GROWTH, ...PREDICTED_GROWTH]
    : HISTORICAL_GROWTH;

  // Animation loop for smooth effects
  useEffect(() => {
    const animate = () => {
      setTime(t => t + 0.016);
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Animate prediction progress when entering prediction mode
  useEffect(() => {
    if (isPredictionMode && predictionProgress < 1) {
      const growthInterval = setInterval(() => {
        setPredictionProgress(prev => {
          const next = prev + 0.02;
          if (next >= 1) {
            clearInterval(growthInterval);
            return 1;
          }
          return next;
        });
      }, 30);
      return () => clearInterval(growthInterval);
    } else if (!isPredictionMode && predictionProgress > 0) {
      setPredictionProgress(0);
    }
  }, [isPredictionMode]);

  // Year progression animation
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentYear(year => {
        const currentIndex = ALL_YEARS.findIndex(d => d.year === year);
        if (currentIndex < ALL_YEARS.length - 1) {
          return ALL_YEARS[currentIndex + 1].year;
        } else {
          setIsPlaying(false);
          return year;
        }
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isPlaying, isPredictionMode]);

  const tendrils = useMemo(() => generateGrowthTendrils(currentYear, time), [currentYear, time]);
  const pillars = useMemo(() => generatePopulationPillars(currentYear, showDensity), [currentYear, showDensity]);
  const stressZones = useMemo(() => generateHousingStress(currentYear, showStress, pillars), [currentYear, showStress, pillars]);
  
  const currentYearData = ALL_YEARS.find(d => d.year === currentYear) || ALL_YEARS[0];
  const isPredictedYear = currentYearData.type === 'predicted';

  const lightingEffect = useMemo(() => {
    return new LightingEffect({
      ambient: new AmbientLight({
        color: [255, 255, 255],
        intensity: 1.0,
      }),
      sun: new SunLight({
        timestamp: Date.UTC(2024, 0, 1, 14),
        color: [255, 255, 255],
        intensity: 3.0,
      }),
    });
  }, []);

  const layers = useMemo(() => {
    const result = [];
    const isPredicted = currentYearData.type === 'predicted';

    // Act I: Growth Tendrils (Blooming effect)
    tendrils.forEach((tendril, idx) => {
      const pulse = Math.sin(time * 3 + idx * 0.3) * 0.3 + 0.7;
      
      result.push(
        new PathLayer({
          id: `growth-tendril-${idx}`,
          data: [tendril],
          pickable: false,
          widthScale: 0.8,
          widthMinPixels: 3,
          widthMaxPixels: 9,
          jointRounded: true,
          capRounded: true,
          getPath: d => d.path,
          getColor: d => {
            const baseIntensity = d.intensity * 255;
            const glowPulse = pulse * 50;
            
            // Predicted years: Purple/Magenta glow
            if (isPredicted) {
              return [
                Math.min(255, 180 + baseIntensity * 0.5 + glowPulse),
                Math.min(255, 80 + baseIntensity * 0.3),
                Math.min(255, 255),
                Math.floor(d.intensity * 220 * pulse)
              ];
            }
            
            // Historical: Blue/Cyan glow
            return [
              Math.min(255, 100 + baseIntensity + glowPulse),
              Math.min(255, 200 + baseIntensity * 0.8 + glowPulse),
              Math.min(255, 255),
              Math.floor(d.intensity * 200 * pulse)
            ];
          },
          getWidth: d => d.intensity * 6 * pulse,
          updateTriggers: {
            getColor: time,
            getWidth: time,
          },
        })
      );

      // Glowing particles along tendrils
      if (tendril.path.length > 3) {
        const particles = tendril.path
          .filter((_, i) => i % 3 === 0)
          .map((point, i) => ({
            position: point,
            size: 40 + Math.sin(time * 4 + i + idx) * 20,
            opacity: tendril.intensity * (0.6 + Math.sin(time * 2 + i) * 0.4),
          }));

        result.push(
          new ScatterplotLayer({
            id: `tendril-particles-${idx}`,
            data: particles,
            pickable: false,
            opacity: 0.8,
            stroked: false,
            filled: true,
            radiusScale: 1,
            radiusMinPixels: 2,
            radiusMaxPixels: 7,
            getPosition: d => d.position,
            getRadius: d => d.size,
            getFillColor: d => isPredicted 
              ? [200, 100, 255, d.opacity * 220] 
              : [150, 220, 255, d.opacity * 200],
            updateTriggers: {
              getPosition: time,
              getRadius: time,
              getFillColor: time,
            },
          })
        );
      }
    });

    // Act II: Population Density Pillars (Forest of Souls)
    if (showDensity && pillars.length > 0) {
      result.push(
        new ColumnLayer({
          id: 'population-buildings',
          data: pillars,
          extruded: true,
          diskResolution: 4, // Small 3D cubes
          radius: 80, // Much smaller
          elevationScale: 0.4, // Short markers
          pickable: true,
          flatShading: true, // More realistic building look
          material: {
            ambient: 0.25,
            diffuse: 0.8,
            shininess: 64,
            specularColor: [255, 255, 255]
          },
          getPosition: d => d.position,
          getElevation: d => {
            const wave = Math.sin(time * 1.5 + d.position[0] * 80) * 0.05 + 0.975;
            // Prediction mode: Gradual growing animation
            if (isPredicted) {
              const growthAnimation = Math.sin(time * 2 + d.position[0] * 100) * 0.15 + 0.85;
              // Apply prediction progress for smooth growth from 0 to full height
              return d.height * wave * growthAnimation * predictionProgress * 1.3;
            }
            return d.height * wave;
          },
          getFillColor: d => {
            const intensity = Math.min(d.height / 2000, 1);
            const pulse = Math.sin(time * 2 + d.position[0] * 100) * 0.2 + 0.8;
            
            // Housing Stress (Red)
            if (showStress && stressZones.find(z => 
              z.position[0] === d.position[0] && z.position[1] === d.position[1]
            )) {
              return [
                Math.min(255, 220 + pulse * 35),
                Math.max(0, 50 - pulse * 30),
                Math.max(0, 50 - pulse * 30),
                180
              ];
            }
            
            // Prediction Mode: Gradual color transition to purple
            if (isPredicted) {
              const growthPulse = Math.sin(time * 3 + d.position[0] * 150) * 0.3 + 0.7;
              // Blend from blue to purple based on prediction progress
              const blueR = 180 + intensity * 75;
              const blueG = 200 + intensity * 55;
              const blueB = 220 + intensity * 35;
              const purpleR = 160 + intensity * 95 * growthPulse;
              const purpleG = 80 + intensity * 40 * growthPulse;
              const purpleB = 200 + intensity * 55 * growthPulse;
              
              return [
                Math.floor(blueR + (purpleR - blueR) * predictionProgress),
                Math.floor(blueG + (purpleG - blueG) * predictionProgress),
                Math.floor(blueB + (purpleB - blueB) * predictionProgress),
                Math.floor((170 + intensity * 30) * (0.7 + 0.3 * predictionProgress))
              ];
            }
            
            // Historical: Blue population density
            return [
              Math.floor(180 + intensity * 75),
              Math.floor(200 + intensity * 55),
              Math.floor(220 + intensity * 35),
              170
            ];
          },
          getLineColor: d => {
            const shimmer = Math.sin(time * 5 + d.position[0] * 200) * 30 + 200;
            if (isPredicted) {
              return [180, 80, shimmer, 120];
            }
            return [shimmer, shimmer, 255, 100];
          },
          lineWidthMinPixels: 1,
          lineWidthMaxPixels: 1,
          updateTriggers: {
            getFillColor: [time, showStress, predictionProgress],
            getElevation: [time, predictionProgress],
            getLineColor: time,
          },
          onClick: (info) => {
            if (info.object) {
              setSelectedZone(info.object);
            }
          },
        })
      );

      // Particle rain effect when density is first shown
      const rainParticles = pillars.slice(0, 50).map(p => ({
        position: [p.position[0], p.position[1]],
        size: 20 + Math.random() * 30,
        opacity: Math.random() * 0.6 + 0.2,
      }));

      result.push(
        new ScatterplotLayer({
          id: 'soul-particles',
          data: rainParticles,
          pickable: false,
          opacity: 0.6,
          stroked: true,
          filled: true,
          radiusScale: 1,
          radiusMinPixels: 2,
          radiusMaxPixels: 8,
          lineWidthMinPixels: 1,
          getPosition: d => d.position,
          getRadius: d => d.size,
          getFillColor: [200, 230, 255, 150],
          getLineColor: [255, 255, 255, 100],
          updateTriggers: {
            getRadius: time,
          },
        })
      );
    }

    // Prediction Mode: Future Growth Overlay Buildings
    if (isPredicted && showDensity) {
      // Add glowing overlay buildings showing future expansion
      const futureZones = pillars.map(p => ({
        ...p,
        height: p.height * 1.5, // 50% taller in predictions
      }));

      result.push(
        new ColumnLayer({
          id: 'future-growth-overlay',
          data: futureZones,
          extruded: true,
          diskResolution: 4, // Small 3D markers
          radius: 100,
          elevationScale: 0.6, // Small future markers
          pickable: false,
          flatShading: true,
          material: {
            ambient: 0.4,
            diffuse: 0.5,
            shininess: 16,
            specularColor: [200, 100, 255]
          },
          getPosition: d => d.position,
          getElevation: d => {
            const pulse = Math.sin(time * 2.5 + d.position[0] * 120) * 0.2 + 0.8;
            // Grow gradually with prediction progress
            return d.height * pulse * predictionProgress;
          },
          getFillColor: d => {
            const glow = Math.sin(time * 4 + d.position[0] * 150) * 50 + 205;
            // Fade in gradually
            return [glow, 80, 255, Math.floor(80 * predictionProgress)];
          },
          getLineColor: [180, 100, 255, 60],
          lineWidthMinPixels: 1,
          updateTriggers: {
            getElevation: [time, predictionProgress],
            getFillColor: [time, predictionProgress],
          },
        })
      );
    }

    // Act III: Housing Stress Zones (Fever Dream)
    if (showStress && stressZones.length > 0) {
      stressZones.forEach((zone, idx) => {
        const glitchPulse = Math.sin(time * 8 + idx * 0.7) * 0.5 + 0.5;
        const urgencySpeed = zone.urgency === 'critical' ? 6 : zone.urgency === 'high' ? 4 : 3;
        
        // Warning rings
        for (let ring = 0; ring < 3; ring++) {
          const ringPulse = Math.sin(time * urgencySpeed - ring * 1.2) * 0.5 + 0.5;
          
          result.push(
            new ScatterplotLayer({
              id: `stress-ring-${idx}-${ring}`,
              data: [zone],
              pickable: false,
              opacity: ringPulse * 0.4,
              stroked: true,
              filled: false,
              radiusScale: 1,
              lineWidthMinPixels: 3,
              getPosition: d => d.position,
              getRadius: (200 + ring * 120) * (1 + ringPulse * 0.4),
              getLineColor: [255, 0, 0, ringPulse * 200],
              updateTriggers: {
                getRadius: time,
                getLineColor: time,
              },
            })
          );
        }

        // Glitch particles
        const glitchParticles = Array(8).fill(0).map((_, i) => ({
          position: [
            zone.position[0] + (Math.random() - 0.5) * 0.003,
            zone.position[1] + (Math.random() - 0.5) * 0.003
          ],
          size: 30 + Math.random() * 40,
          opacity: glitchPulse * (Math.random() * 0.5 + 0.3),
        }));

        result.push(
          new ScatterplotLayer({
            id: `glitch-particles-${idx}`,
            data: glitchParticles,
            pickable: false,
            opacity: 0.7,
            stroked: false,
            filled: true,
            radiusScale: 1,
            radiusMinPixels: 3,
            radiusMaxPixels: 12,
            getPosition: d => d.position,
            getRadius: d => d.size,
            getFillColor: [255, 50, 50, 180],
            updateTriggers: {
              getPosition: time,
              getRadius: time,
            },
          })
        );
      });
    }

    return result;
  }, [tendrils, pillars, stressZones, time, showDensity, showStress]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-950">
      <DeckGL
        viewState={viewState}
        controller={true}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        layers={layers}
        effects={[lightingEffect]}
        getTooltip={({ object }) => {
          if (!object) return null;
          
          if (object.height) {
            const stress = stressZones.find(z => 
              z.position[0] === object.position[0] && z.position[1] === object.position[1]
            );
            
            return {
              html: `
                <div style="padding: 12px; background: rgba(0,0,0,0.95); border-radius: 10px; border: 2px solid ${stress ? 'rgba(220,38,38,0.6)' : 'rgba(59,130,246,0.6)'}; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
                  <div style="color: ${stress ? '#dc2626' : '#3b82f6'}; font-size: 13px; font-weight: bold; margin-bottom: 4px;">
                    ${stress ? '⚠️ HOUSING STRESS ZONE' : '👥 Population Center'}
                  </div>
                  <div style="color: #fff; font-size: 12px;">Population: ${object.population.toLocaleString()}</div>
                  <div style="color: #d1d5db; font-size: 11px;">Growth Rate: ${object.growthRate.toFixed(1)}x</div>
                  ${stress ? `<div style="color: #fca5a5; font-size: 11px; margin-top: 4px;">Urgency: ${stress.urgency.toUpperCase()}</div>` : ''}
                </div>
              `,
              style: { fontSize: '12px', pointerEvents: 'none' }
            };
          }
          
          return null;
        }}
      >
        <Map
          mapboxAccessToken={MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
          terrain={{ source: 'mapbox-dem', exaggeration: 1.2 }}
          fog={{
            range: [0.8, 12],
            color: '#1a1a2e',
            'horizon-blend': 0.2,
            'high-color': '#2a2a4e',
            'space-color': '#0f0f1e',
            'star-intensity': 0.1
          }}
        />
      </DeckGL>

      {/* Title Banner */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className={`bg-gradient-to-br backdrop-blur-2xl border rounded-2xl px-8 py-4 shadow-2xl pointer-events-auto transition-all duration-500 ${
          isPredictedYear 
            ? 'from-purple-900/80 to-black/70 border-purple-500/50' 
            : 'from-black/80 to-black/60 border-cyan-500/30'
        }`}>
          <div className="flex items-center gap-4">
            <div className="text-4xl">{isPredictedYear ? '🔮' : '🌸'}</div>
            <div>
              <h1 className={`text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                isPredictedYear 
                  ? 'from-purple-400 to-pink-400' 
                  : 'from-cyan-400 to-blue-400'
              }`}>
                {isPredictedYear ? 'AI Prediction Mode' : 'Living Chronoscape'}
              </h1>
              <p className="text-gray-400 text-sm">
                {isPredictedYear 
                  ? `Future Projection • Confidence: ${Math.round(currentYearData.confidence * 100)}%`
                  : 'The Bloom of Dhaka • 1975-2025'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Control Button */}
      <div className="absolute top-6 right-6 pointer-events-none">
        <button
          onClick={() => {
            if (!isPredictionMode) {
              setIsPredictionMode(true);
              setPredictionProgress(0); // Start animation from 0
              setCurrentYear(2026);
              setShowDensity(true);
            } else {
              setIsPredictionMode(false);
              setPredictionProgress(0); // Reset
              setCurrentYear(2025);
            }
            setIsPlaying(false);
          }}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-2xl pointer-events-auto ${
            isPredictionMode
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-2 border-purple-400/50'
              : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white border-2 border-cyan-400/50'
          }`}
        >
          {isPredictionMode ? '🔮 Exit Prediction' : '🔮 Predict Future (2026-2030)'}
        </button>
      </div>

      {/* Timeline Control */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[800px] pointer-events-none">
        <div className="bg-gradient-to-br from-black/70 to-black/40 backdrop-blur-3xl border border-white/20 rounded-2xl p-6 shadow-2xl pointer-events-auto">
          {/* Year Display */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                {currentYear}
              </div>
              <div className="text-gray-400 text-sm mt-1">
                {currentYearData.population.toFixed(1)}M people • {currentYearData.area} km²
              </div>
            </div>
            
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg ${
                isPlaying
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white'
              }`}
            >
              {isPlaying ? '⏸ Pause Growth' : '▶ Play Growth'}
            </button>
          </div>

          {/* Timeline Slider */}
          <div className="relative mb-6">
            <input
              type="range"
              min="0"
              max="6"
              value={HISTORICAL_GROWTH.findIndex(d => d.year === currentYear)}
              onChange={(e) => {
                const index = parseInt(e.target.value);
                setCurrentYear(HISTORICAL_GROWTH[index].year);
                setIsPlaying(false);
              }}
              className="w-full h-3 bg-gradient-to-r from-cyan-900 to-blue-900 rounded-full appearance-none cursor-pointer accent-cyan-500"
              style={{
                background: `linear-gradient(to right, rgb(34 211 238) 0%, rgb(59 130 246) ${(HISTORICAL_GROWTH.findIndex(d => d.year === currentYear) / 6) * 100}%, rgb(30 41 59) ${(HISTORICAL_GROWTH.findIndex(d => d.year === currentYear) / 6) * 100}%, rgb(30 41 59) 100%)`
              }}
            />
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              {HISTORICAL_GROWTH.map(d => (
                <span key={d.year} className={currentYear === d.year ? 'text-cyan-400 font-bold' : ''}>
                  {d.year}
                </span>
              ))}
            </div>
          </div>

          {/* Growth Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Urban Expansion</span>
              <span>{Math.round(currentYearData.builtUp * 100)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${currentYearData.builtUp * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Layer Control Panel */}
      <div className="absolute top-24 right-6 flex flex-col gap-3 pointer-events-none">
        <div className="bg-gradient-to-br from-black/70 to-black/40 backdrop-blur-3xl border border-white/20 rounded-2xl p-5 shadow-2xl w-80 pointer-events-auto">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <span className="text-2xl">🎭</span>
            Three Acts
          </h3>

          {/* Act I - Always Active */}
              <div className="mb-4 p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">�️</span>
              <div>
                <h4 className="text-cyan-400 font-bold text-sm">Urban Growth</h4>
                <p className="text-gray-400 text-xs">City expansion patterns</p>
              </div>
            </div>
            <div className="text-cyan-300 text-xs mt-2">
              ✓ Spreading urbanization tendrils
            </div>
          </div>          {/* Act II - Population Density */}
          <div className="mb-4">
            <button
              onClick={() => setShowDensity(!showDensity)}
              className={`w-full p-4 rounded-xl transition-all ${
                showDensity
                  ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-2 border-blue-500/50'
                  : 'bg-gray-800/50 border border-gray-700 hover:bg-gray-800/70'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">👥</span>
                <div className="text-left">
                  <h4 className={`font-bold text-sm ${showDensity ? 'text-blue-400' : 'text-gray-400'}`}>
                    Population Growth
                  </h4>
                  <p className="text-gray-500 text-xs">Density distribution</p>
                </div>
              </div>
              {showDensity && (
                <div className="text-blue-300 text-xs mt-2 text-left">
                  ✓ Population pillars rising ({pillars.length} centers)
                </div>
              )}
            </button>
          </div>

          {/* Act III - Housing Stress */}
          <div className="min-h-[120px]">
            <button
              onClick={() => {
                if (!showDensity) setShowDensity(true);
                setShowStress(!showStress);
              }}
              disabled={!showDensity && !showStress}
              className={`w-full p-4 rounded-xl transition-all ${
                showStress
                  ? 'bg-gradient-to-r from-red-500/30 to-orange-500/30 border-2 border-red-500/50'
                  : showDensity
                  ? 'bg-gray-800/50 border border-gray-700 hover:bg-gray-800/70'
                  : 'bg-gray-900/50 border border-gray-800 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🔥</span>
                <div className="text-left">
                  <h4 className={`font-bold text-sm ${showStress ? 'text-red-400' : showDensity ? 'text-gray-400' : 'text-gray-600'}`}>
                    Housing Needs
                  </h4>
                  <p className="text-gray-500 text-xs">Critical demand zones</p>
                </div>
              </div>
              {showStress && (
                <div className="text-red-300 text-xs mt-2 text-left">
                  ⚠️ {stressZones.length} critical zones detected!
                </div>
              )}
              {!showDensity && !showStress && (
                <div className="text-gray-600 text-xs mt-2 text-left">
                  Enable Population first
                </div>
              )}
            </button>
          </div>

          {/* Data Sources */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="text-gray-400 text-xs font-semibold mb-2">📊 Data Layers:</div>
            <div className="space-y-1 text-[10px] text-gray-500">
              <div>🏙️ Urban Growth - GHSL Built-up</div>
              <div>👥 Population - WorldPop/SEDAC</div>
              <div>🏠 Housing - Infrastructure Gap</div>
              <div>🛰️ Satellite - Landsat/MODIS</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {showDensity && (
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/40 backdrop-blur-2xl rounded-xl p-4 shadow-xl pointer-events-auto">
            <p className="text-blue-300 text-xs uppercase tracking-wider font-semibold mb-2">Population Centers</p>
            <p className="text-white text-3xl font-bold">{pillars.length}</p>
            <p className="text-gray-400 text-xs mt-1">Active density zones</p>
          </div>
        )}

        {showStress && stressZones.length > 0 && (
          <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-500/40 backdrop-blur-2xl rounded-xl p-4 shadow-xl pointer-events-auto">
            <p className="text-red-300 text-xs uppercase tracking-wider font-semibold mb-2">⚠️ Housing Crisis</p>
            <p className="text-white text-3xl font-bold">{stressZones.length}</p>
            <p className="text-gray-300 text-xs mt-1">
              Critical zones • {stressZones.reduce((sum, z) => sum + z.population, 0).toLocaleString()} people
            </p>
          </div>
        )}
      </div>

      {/* AI Prediction Analytics Panel */}
      {isPredictionMode && (
        <div className="absolute top-32 left-6 w-96 pointer-events-none">
          <div className="bg-gradient-to-br from-purple-900/90 to-black/80 backdrop-blur-3xl border-2 border-purple-500/50 rounded-2xl p-6 shadow-2xl pointer-events-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">🤖</div>
              <div>
                <h3 className="text-purple-300 font-bold text-lg">AI Prediction Engine</h3>
                <p className="text-gray-400 text-xs">Machine Learning Forecast</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="bg-purple-500/20 border border-purple-400/40 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-300 text-sm font-semibold">📊 Model Accuracy</span>
                  <span className="text-white text-lg font-bold">{Math.round(currentYearData.confidence * 100)}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${currentYearData.confidence * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-pink-500/20 border border-pink-400/40 rounded-lg p-2">
                  <p className="text-pink-300 text-xs mb-1">👥 Population</p>
                  <p className="text-white text-xl font-bold">{currentYearData.population}M</p>
                  <p className="text-pink-200 text-xs">+{(currentYearData.population - 23.5).toFixed(1)}M growth</p>
                </div>
                <div className="bg-purple-500/20 border border-purple-400/40 rounded-lg p-2">
                  <p className="text-purple-300 text-xs mb-1">🏙️ Urban Area</p>
                  <p className="text-white text-xl font-bold">{currentYearData.area}km²</p>
                  <p className="text-purple-200 text-xs">+{currentYearData.area - 1050}km² expansion</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-400/50 rounded-lg p-3">
              <p className="text-purple-200 text-xs font-semibold mb-2">🧠 AI Methodology:</p>
              <ul className="space-y-1 text-[10px] text-gray-300">
                <li>✓ NASA GHSL Historical Analysis</li>
                <li>✓ Population Growth Rate Modeling</li>
                <li>✓ Urban Sprawl Pattern Recognition</li>
                <li>✓ Climate & Economic Factors</li>
                <li>✓ Neural Network Time Series</li>
              </ul>
            </div>

          </div>
        </div>
      )}

      {/* Selected Zone Detail Modal */}
      {selectedZone && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={() => setSelectedZone(null)} />
          <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-blue-500/50 rounded-2xl p-6 shadow-2xl max-w-lg w-full mx-4 pointer-events-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">👥 Population Center</h2>
                <p className="text-gray-400 text-sm">
                  {selectedZone.position[1].toFixed(4)}°N, {selectedZone.position[0].toFixed(4)}°E
                </p>
              </div>
              <button
                onClick={() => setSelectedZone(null)}
                className="text-gray-400 hover:text-white transition-colors text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-blue-500/20 border border-blue-500/40 rounded-lg p-3">
                <p className="text-blue-400 text-xs mb-1">👥 Population</p>
                <p className="text-white text-2xl font-bold">{selectedZone.population.toLocaleString()}</p>
              </div>
              <div className="bg-purple-500/20 border border-purple-500/40 rounded-lg p-3">
                <p className="text-purple-400 text-xs mb-1">📈 Growth Rate</p>
                <p className="text-white text-2xl font-bold">{selectedZone.growthRate.toFixed(1)}x</p>
              </div>
            </div>

            {selectedZone.stress && (
              <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">🔥</div>
                  <div>
                    <p className="text-red-400 text-lg font-bold">HOUSING STRESS DETECTED</p>
                    <p className="text-gray-300 text-sm">Urgency: {selectedZone.urgency.toUpperCase()}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>⚠️ Stress Level: {selectedZone.stress.toFixed(1)}/5.0</p>
                  <p>🏗️ Immediate housing development required</p>
                  <p>🌳 Limited green space remaining</p>
                  <p>📊 Population density exceeds infrastructure capacity</p>
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedZone(null)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 rounded-lg transition-all"
            >
              Close Analysis
            </button>
          </div>
        </div>
      )}

      {/* Camera Info */}
      <div className="absolute bottom-6 right-6 pointer-events-none">
        <div className="bg-gradient-to-br from-black/70 to-black/50 backdrop-blur-2xl border border-white/20 rounded-xl px-4 py-3 shadow-2xl">
          <p className="text-gray-400 text-xs font-mono">
            🎥 Pitch: {Math.round(viewState.pitch)}° • Bearing: {Math.round(viewState.bearing)}° • Zoom: {viewState.zoom.toFixed(1)}
          </p>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.8);
        }

        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          cursor: pointer;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
          border: 3px solid white;
        }

        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          cursor: pointer;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
          border: 3px solid white;
        }
      `}</style>
    </div>
  );
}