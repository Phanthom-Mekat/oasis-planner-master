'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer, LineLayer, IconLayer } from '@deck.gl/layers';
import { HeatmapLayer, HexagonLayer } from '@deck.gl/aggregation-layers';
import { TileLayer } from '@deck.gl/geo-layers';
import { BitmapLayer } from '@deck.gl/layers';
import { fetchAccessAnalysisData, calculateAccessibilityScore } from '@/lib/nasaDataService';
import 'leaflet/dist/leaflet.css';

const INITIAL_VIEW_STATE = {
  longitude: 90.4,
  latitude: 23.8,
  zoom: 11,
  pitch: 45,
  bearing: 0,
};

export default function DeckGLAccessMap() {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [data, setData] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(true);

  useEffect(() => {
    fetchAccessAnalysisData().then(setData);
  }, []);

  const layers = useMemo(() => {
    if (!data) return [];

    return [
      // Base Map Layer (Hybrid Satellite Style like Google Maps)
      new TileLayer({
        id: 'satellite-base',
        data: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        minZoom: 0,
        maxZoom: 19,
        tileSize: 256,
        renderSubLayers: props => {
          const {
            bbox: { west, south, east, north }
          } = props.tile;
          return new BitmapLayer(props, {
            data: null,
            image: props.data,
            bounds: [west, south, east, north]
          });
        }
      }),
      
      // Hybrid Labels and Roads Overlay
      new TileLayer({
        id: 'hybrid-labels',
        data: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        minZoom: 0,
        maxZoom: 19,
        tileSize: 256,
        renderSubLayers: props => {
          const {
            bbox: { west, south, east, north }
          } = props.tile;
          return new BitmapLayer(props, {
            data: null,
            image: props.data,
            bounds: [west, south, east, north],
            opacity: 0.8
          });
        }
      }),

      // Population Density Heatmap (Vibrant colors for satellite map)
      showHeatmap && new HeatmapLayer({
        id: 'population-heatmap',
        data: data.population,
        getPosition: d => [d.lon, d.lat],
        getWeight: d => d.density / 1000,
        radiusPixels: 60,
        intensity: 1.2,
        threshold: 0.03,
        colorRange: [
          [64, 224, 208, 40],   // Turquoise (low)
          [72, 209, 204, 90],   // Medium turquoise
          [255, 215, 0, 150],   // Gold (medium)
          [255, 165, 0, 200],   // Orange
          [255, 69, 0, 240],    // Orange red (high)
          [220, 20, 60, 255],   // Crimson (very high)
        ],
      }),

      // Population Density Pillars (3D Hexagons with vibrant colors)
      new HexagonLayer({
        id: 'population-hexagons',
        data: data.population,
        getPosition: d => [d.lon, d.lat],
        getElevationWeight: d => d.density,
        elevationScale: 0.8,
        extruded: true,
        radius: 200,
        coverage: 0.75,
        elevationRange: [0, 4000],
        material: {
          ambient: 0.8,
          diffuse: 0.7,
          shininess: 64,
          specularColor: [255, 255, 255],
        },
        colorRange: [
          [72, 209, 204, 200],    // Turquoise (low density)
          [64, 224, 208, 220],    // Light turquoise
          [255, 215, 0, 240],     // Gold (medium)
          [255, 140, 0, 250],     // Dark orange
          [255, 69, 0, 255],      // Red-orange (high)
          [220, 20, 60, 255],     // Crimson (very high)
        ],
        pickable: true,
        autoHighlight: true,
        onClick: (info) => setSelectedFeature(info.object),
      }),

      // Infrastructure Network Lines
      new LineLayer({
        id: 'infrastructure-lines',
        data: data.infrastructure.roads,
        getSourcePosition: d => d.from,
        getTargetPosition: d => d.to,
        getColor: d => {
          const connectivity = d.connectivity;
          return connectivity > 0.7 
            ? [16, 185, 129, 200] // Green - good connectivity
            : connectivity > 0.5 
            ? [251, 191, 36, 200] // Yellow - moderate
            : [239, 68, 68, 200]; // Red - poor
        },
        getWidth: d => d.connectivity * 5,
        widthMinPixels: 2,
        widthMaxPixels: 10,
        pickable: true,
      }),

      // Transit Stations
      new ScatterplotLayer({
        id: 'transit-stations',
        data: data.infrastructure.transit,
        getPosition: d => [d.lon, d.lat],
        getRadius: d => Math.sqrt(d.capacity) * 0.5,
        getFillColor: d => {
          switch(d.type) {
            case 'metro': return [139, 92, 246, 200]; // Purple
            case 'bus': return [59, 130, 246, 200]; // Blue
            default: return [156, 163, 175, 200]; // Gray
          }
        },
        radiusMinPixels: 5,
        radiusMaxPixels: 30,
        pickable: true,
        autoHighlight: true,
        onClick: (info) => setSelectedFeature(info.object),
      }),

      // Markets & Food Access
      new ScatterplotLayer({
        id: 'markets',
        data: data.infrastructure.markets,
        getPosition: d => [d.lon, d.lat],
        getRadius: d => d.radius * 500,
        getFillColor: [34, 197, 94, 100],
        getLineColor: [34, 197, 94, 255],
        lineWidthMinPixels: 2,
        stroked: true,
        filled: true,
        radiusUnits: 'meters',
        pickable: true,
        autoHighlight: true,
        onClick: (info) => setSelectedFeature(info.object),
      }),

      // Underserved Areas (Islands of Need)
      new ScatterplotLayer({
        id: 'underserved-areas',
        data: data.population.filter(p => {
          const nearestMarket = data.infrastructure.markets.reduce((nearest, market) => {
            const dist = Math.hypot(p.lon - market.lon, p.lat - market.lat);
            return dist < nearest ? dist : nearest;
          }, Infinity);
          return nearestMarket > 0.02 && p.density > 30000; // Far from markets + high density
        }),
        getPosition: d => [d.lon, d.lat],
        getRadius: 300,
        getFillColor: [255, 0, 0, 150],
        radiusUnits: 'meters',
        pickable: true,
        autoHighlight: true,
      }),
    ];
  }, [data, showHeatmap]);

  if (!data) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🛰️</div>
          <div className="text-gray-800 text-xl font-semibold mb-2">
            Loading Satellite Data
          </div>
          <div className="text-gray-600 text-sm">
            NASA SEDAC • GHSL • VIIRS Nighttime Lights
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <DeckGL
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        controller={true}
        layers={layers}
        getTooltip={({ object }) => {
          if (!object) return null;
          if (object.density) {
            return {
              html: `
                <div style="backdrop-filter: blur(16px); background: rgba(255, 255, 255, 0.95); padding: 12px 16px; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.15); border: 1px solid rgba(255,255,255,0.3);">
                  <div style="font-weight: 700; color: #1f2937; font-size: 14px; margin-bottom: 4px;">${object.area}</div>
                  <div style="font-size: 12px; color: #6b7280;">Population: <strong style="color: #0891b2;">${object.density.toLocaleString()}/km²</strong></div>
                  <div style="font-size: 12px; color: #6b7280;">Ward: <strong style="color: #7c3aed;">#${object.ward}</strong></div>
                </div>
              `,
              style: { backgroundColor: 'transparent', border: 'none' }
            };
          }
          if (object.type === 'metro' || object.type === 'bus') {
            return {
              html: `
                <div style="backdrop-filter: blur(16px); background: rgba(255, 255, 255, 0.95); padding: 12px 16px; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.15); border: 1px solid rgba(255,255,255,0.3);">
                  <div style="font-weight: 700; color: #1f2937; font-size: 14px; margin-bottom: 4px; text-transform: capitalize;">🚇 ${object.type} Station</div>
                  <div style="font-size: 12px; color: #6b7280;">Capacity: <strong style="color: #8b5cf6;">${object.capacity.toLocaleString()}/day</strong></div>
                </div>
              `,
              style: { backgroundColor: 'transparent', border: 'none' }
            };
          }
          if (object.type === 'supermarket' || object.type === 'local') {
            return {
              html: `
                <div style="backdrop-filter: blur(16px); background: rgba(255, 255, 255, 0.95); padding: 12px 16px; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.15); border: 1px solid rgba(255,255,255,0.3);">
                  <div style="font-weight: 700; color: #1f2937; font-size: 14px; margin-bottom: 4px; text-transform: capitalize;">🏪 ${object.type} Market</div>
                  <div style="font-size: 12px; color: #6b7280;">Service Radius: <strong style="color: #10b981;">${object.radius} km</strong></div>
                </div>
              `,
              style: { backgroundColor: 'transparent', border: 'none' }
            };
          }
          return null;
        }}
      />

      {/* Control Panel - Modern glass design */}
      <div className="absolute top-4 right-4 backdrop-blur-xl bg-white/90 shadow-2xl border border-gray-200/50 p-5 rounded-2xl space-y-4 w-80">
        <div className="flex items-center gap-2 mb-3">
          <div className="text-2xl">🏙️</div>
          <h3 className="text-gray-900 font-bold text-lg">
            Access Analysis
          </h3>
        </div>
        
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full shadow-lg" style={{ background: 'linear-gradient(135deg, #40E0D0 0%, #48D1CC 100%)' }}></div>
            <span className="text-gray-700 font-medium">Population Density</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg"></div>
            <span className="text-gray-700 font-medium">Infrastructure Network</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-400 to-violet-500 shadow-lg"></div>
            <span className="text-gray-700 font-medium">Transit Stations</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg"></div>
            <span className="text-gray-700 font-medium">Food Markets</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-400 to-rose-500 shadow-lg"></div>
            <span className="text-gray-700 font-medium">Underserved Areas</span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <label className="flex items-center gap-3 text-gray-800 text-sm font-medium cursor-pointer hover:text-cyan-600 transition-colors">
            <input
              type="checkbox"
              checked={showHeatmap}
              onChange={(e) => setShowHeatmap(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
            />
            Show Population Heatmap
          </label>
        </div>

        <div className="pt-4 border-t border-gray-200 text-xs text-gray-600">
          <div className="font-semibold text-gray-800 mb-2 text-sm">📡 Data Sources:</div>
          <div className="space-y-1">
            <div>• NASA SEDAC Population</div>
            <div>• EU Copernicus GHSL</div>
            <div>• VIIRS Nighttime Lights</div>
          </div>
        </div>
      </div>

      {/* Selected Feature Info - Modern design */}
      {selectedFeature && (
        <div className="absolute bottom-6 left-6 backdrop-blur-xl bg-white/95 shadow-2xl border border-gray-200/50 p-6 rounded-2xl w-96 animate-in slide-in-from-left duration-300">
          <button
            onClick={() => setSelectedFeature(null)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1.5 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex items-start gap-3 mb-4">
            <div className="text-3xl">
              {selectedFeature.type === 'metro' || selectedFeature.type === 'bus' ? '🚇' : 
               selectedFeature.type === 'supermarket' || selectedFeature.type === 'local' ? '🏪' : '📍'}
            </div>
            <div>
              <h4 className="text-gray-900 font-bold text-lg">
                {selectedFeature.area || 
                 (selectedFeature.type && selectedFeature.type.charAt(0).toUpperCase() + selectedFeature.type.slice(1)) || 
                 'Location Details'}
              </h4>
              <p className="text-gray-500 text-sm">Click anywhere to close</p>
            </div>
          </div>
          
          <div className="space-y-3 text-sm">
            {selectedFeature.density && (
              <>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Population Density</span>
                  <span className="text-gray-900 font-bold">{selectedFeature.density.toLocaleString()}/km²</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Ward Number</span>
                  <span className="text-gray-900 font-bold">#{selectedFeature.ward}</span>
                </div>
              </>
            )}
            {selectedFeature.capacity && (
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <span className="text-gray-700 font-medium">Daily Capacity</span>
                <span className="text-gray-900 font-bold">{selectedFeature.capacity.toLocaleString()}</span>
              </div>
            )}
            {selectedFeature.radius && (
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                <span className="text-gray-700 font-medium">Service Radius</span>
                <span className="text-gray-900 font-bold">{selectedFeature.radius} km</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
