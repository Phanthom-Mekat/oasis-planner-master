'use client';

import { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { Map } from 'react-map-gl/mapbox';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZWxlY3RyMCIsImEiOiJjbWc5azF3a3owamVvMmpzOHFsMHljem5qIn0.rpjeucjo4H9UArQn-oBSAA';

const INITIAL_VIEW = {
  longitude: 90.4,
  latitude: 23.8,
  zoom: 11,
  pitch: 0,
  bearing: 0
};

export default function OpportunityMapper() {
  const [mapdata, setMapdata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [layers, setLayers] = useState({
    population: true,
    food: true,
    transport: true,
    housing: true
  });

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

  const getColor = (score) => {
    if (score < 0.4) return [239, 68, 68, 200];
    if (score < 0.7) return [245, 158, 11, 200];
    return [16, 185, 129, 200];
  };

  const toggleLayer = (layer) => {
    setLayers({ ...layers, [layer]: !layers[layer] });
  };

  const deckLayers = mapdata ? [
    new GeoJsonLayer({
      id: 'opportunity-layer',
      data: mapdata,
      filled: true,
      stroked: true,
      pickable: true,
      getFillColor: d => getColor(d.properties.opportunity_score),
      getLineColor: [255, 255, 255],
      getLineWidth: 2,
      lineWidthMinPixels: 1,
      onClick: (info) => {
        if (info.object) {
          fetchCellDetails(info.object.properties.cell_id);
        }
      },
      updateTriggers: {
        getFillColor: [layers]
      }
    })
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl">Loading Opportunity Index...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gray-50">
      <div className="w-80 bg-white p-6 overflow-y-auto border-r z-10 shadow-sm">
        <div className="mb-6">
          <h2 className="font-semibold mb-3">Data Layers</h2>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={layers.population}
                onChange={() => toggleLayer('population')}
                className="w-4 h-4"
              />
              <span className="text-sm">Population Density</span>
              <span className="text-xs text-gray-500 ml-auto">NASA SEDAC</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={layers.food}
                onChange={() => toggleLayer('food')}
                className="w-4 h-4"
              />
              <span className="text-sm">Food Access</span>
              <span className="text-xs text-gray-500 ml-auto">MODIS</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={layers.transport}
                onChange={() => toggleLayer('transport')}
                className="w-4 h-4"
              />
              <span className="text-sm">Transport Network</span>
              <span className="text-xs text-gray-500 ml-auto">OSM</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={layers.housing}
                onChange={() => toggleLayer('housing')}
                className="w-4 h-4"
              />
              <span className="text-sm">Housing Pressure</span>
              <span className="text-xs text-gray-500 ml-auto">VIIRS</span>
            </label>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold mb-3">Legend</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded"></div>
              <span className="text-sm">High Opportunity (0.7+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-500 rounded"></div>
              <span className="text-sm">Medium (0.4-0.7)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-500 rounded"></div>
              <span className="text-sm">Low Opportunity (&lt;0.4)</span>
            </div>
          </div>
        </div>

        {mapdata && (
          <div className="mt-6 pt-6 border-t text-xs text-gray-500">
            <div className="font-medium mb-2">Data Sources</div>
            <ul className="space-y-1">
              {mapdata.metadata.data_sources.map((source, idx) => (
                <li key={idx}>• {source}</li>
              ))}
            </ul>
            <div className="mt-3 text-xs text-gray-400">
              Click any zone to view details
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 relative">
        <DeckGL
          initialViewState={INITIAL_VIEW}
          controller={true}
          layers={deckLayers}
        >
          <Map
            mapboxAccessToken={MAPBOX_TOKEN}
            mapStyle="mapbox://styles/mapbox/light-v10"
          />
        </DeckGL>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Zone Analysis - Cell #{selected?.cell_id}</span>
              {selected && (
                <Badge 
                  variant={selected.category === 'low' ? 'destructive' : selected.category === 'high' ? 'default' : 'secondary'}
                  className="ml-2"
                >
                  {selected.category.toUpperCase()}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selected && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Opportunity Score</div>
                <div className="text-4xl font-bold text-gray-900">{selected.opportunity_score}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {selected.category === 'low' && 'Priority intervention zone'}
                  {selected.category === 'medium' && 'Moderate development needed'}
                  {selected.category === 'high' && 'Good access to resources'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {layers.population && (
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="text-xs text-gray-500 mb-1">Population Density</div>
                    <div className="text-2xl font-semibold text-gray-900">
                      {selected.metrics.population_density.value.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      people/km²
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      Source: {selected.metrics.population_density.source}
                    </div>
                  </div>
                )}
                
                {layers.food && (
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="text-xs text-gray-500 mb-1">Food Access</div>
                    <div className="text-2xl font-semibold text-gray-900">
                      {selected.metrics.food_access.distance_km} km
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      to fresh markets
                    </div>
                    <Badge variant="outline" className="mt-2">
                      {selected.metrics.food_access.status}
                    </Badge>
                    <div className="text-xs text-gray-400 mt-2">
                      Source: {selected.metrics.food_access.source}
                    </div>
                  </div>
                )}
                
                {layers.transport && (
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="text-xs text-gray-500 mb-1">Transport Access</div>
                    <div className="text-2xl font-semibold text-gray-900">
                      {selected.metrics.transport_access.score}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      connectivity score
                    </div>
                    <Badge variant="outline" className="mt-2">
                      {selected.metrics.transport_access.status}
                    </Badge>
                    <div className="text-xs text-gray-400 mt-2">
                      Source: {selected.metrics.transport_access.source}
                    </div>
                  </div>
                )}
                
                {layers.housing && (
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="text-xs text-gray-500 mb-1">Housing Pressure</div>
                    <div className="text-2xl font-semibold text-gray-900">
                      {selected.metrics.housing_pressure.score}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      pressure index
                    </div>
                    <Badge variant="outline" className="mt-2">
                      {selected.metrics.housing_pressure.status}
                    </Badge>
                    <div className="text-xs text-gray-400 mt-2">
                      Source: {selected.metrics.housing_pressure.source}
                    </div>
                  </div>
                )}
              </div>

              {selected.recommendations && selected.recommendations.length > 0 && (
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900 mb-3">Recommendations</div>
                  <ul className="space-y-2">
                    {selected.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex gap-2 text-sm text-gray-700">
                        <span className="text-blue-500 font-bold">→</span>
                        <span>{rec}</span>
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

