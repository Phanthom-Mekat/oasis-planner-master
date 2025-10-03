"use client";

import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl/mapbox';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { ScatterplotLayer, LineLayer, TextLayer, PolygonLayer } from '@deck.gl/layers';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mapbox access token - same as OpportunityMapper3D
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZWxlY3RyMCIsImEiOiJjbWc5azF3a3owamVvMmpzOHFsMHljem5qIn0.rpjeucjo4H9UArQn-oBSAA';

// Map style options
export const MAP_STYLES = {
  dark: 'mapbox://styles/mapbox/dark-v11',
  light: 'mapbox://styles/mapbox/light-v11',
  streets: 'mapbox://styles/mapbox/streets-v12',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  terrain: 'mapbox://styles/mapbox/outdoors-v12'
};

export default function MapVisualization({ 
  layerType, 
  data, 
  metadata, 
  viewState, 
  onViewStateChange,
  locationLabels = [],
  selectionMode = null,
  onSelectionComplete = null,
  mapStyle = 'dark' // default map style
}) {
  const [layers, setLayers] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState({ type: 'FeatureCollection', features: [] });

  useEffect(() => {
    if (!data || !data.data) {
      setLayers([]);
      return;
    }

    console.log('Creating layer:', layerType, 'with', data.data.length, 'points');

    let newLayers = [];

    try {
      switch (layerType) {
        case 'heatmap':
          newLayers = [
            new HeatmapLayer({
              id: 'heatmap-layer',
              data: data.data,
              getPosition: d => [d[0], d[1]],
              getWeight: d => d[2] || 1,
              radiusPixels: metadata?.radiusPixels || 30,
              intensity: metadata?.intensity || 1,
              threshold: metadata?.threshold || 0.03,
              colorRange: [
                [0, 25, 100],      // Blue
                [0, 150, 200],     // Cyan
                [0, 255, 255],     // Light cyan
                [255, 255, 0],     // Yellow
                [255, 165, 0],     // Orange
                [255, 0, 0]        // Red
              ],
              aggregation: 'SUM'
            })
          ];
          console.log('Heatmap layer created');
          break;

        case 'scatterplot':
          newLayers = [
            new ScatterplotLayer({
              id: 'scatterplot-layer',
              data: data.data,
              getPosition: d => d.coordinates,
              getFillColor: d => d.color || [255, 140, 0],
              getRadius: d => d.radius || 100,
              pickable: true,
              radiusScale: 1,
              radiusMinPixels: 3,
              radiusMaxPixels: 50,
              opacity: 0.8
            })
          ];
          console.log('Scatterplot layer created');
          break;

        case 'line':
          newLayers = [
            new LineLayer({
              id: 'line-layer',
              data: data.data,
              getSourcePosition: d => d.start.slice(0, 2),
              getTargetPosition: d => d.end.slice(0, 2),
              getColor: d => {
                const intensity = (d.value || 50) / 100;
                return [
                  Math.floor(255 * intensity),
                  Math.floor(128 * (1 - intensity)),
                  Math.floor(255 * (1 - intensity)),
                  200
                ];
              },
              getWidth: metadata?.lineWidth || 3,
              pickable: true,
              widthMinPixels: 2,
              widthMaxPixels: 10
            })
          ];
          console.log('Line layer created');
          break;

        case '3d-scatterplot':
          newLayers = [
            new ScatterplotLayer({
              id: '3d-scatterplot-layer',
              data: data.data,
              getPosition: d => [...d.coordinates, d.height || 0],
              getFillColor: d => d.color || [255, 140, 0],
              getRadius: d => d.radius || 50,
              pickable: true,
              radiusScale: 1,
              radiusMinPixels: 3,
              radiusMaxPixels: 50,
              opacity: 0.8
            })
          ];
          console.log('3D layer created');
          break;

        default:
          newLayers = [];
      }

      // Add city/location labels as TextLayer
      const labelsToShow = locationLabels.length > 0 ? locationLabels : defaultCityLabels;
      const textLayer = new TextLayer({
        id: 'text-layer',
        data: labelsToShow,
        getPosition: d => d.position,
        getText: d => d.name || d.text,
        getSize: d => d.size || 16,
        getColor: d => d.color || [255, 255, 255, 255],
        getAngle: 0,
        getTextAnchor: 'middle',
        getAlignmentBaseline: 'center',
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold',
        outlineWidth: 2,
        outlineColor: [0, 0, 0, 255],
        pickable: true
      });
      
      newLayers.push(textLayer);
      
      // Add EditableGeoJsonLayer for map selection if selection mode is active
      // Note: Selection drawing removed - nebula.gl is incompatible with deck.gl 9.1.14
      // For now, selection mode is disabled. Consider using deck.gl 8.x or alternative drawing library
      if (selectionMode && selectedFeatures.features.length > 0) {
        // Show the selected area as a polygon
        const selectionLayer = new PolygonLayer({
          id: 'selection-layer',
          data: selectedFeatures.features,
          getPolygon: d => d.geometry.coordinates,
          getFillColor: [0, 200, 0, 100],
          getLineColor: [0, 255, 0, 255],
          getLineWidth: 2,
          pickable: false
        });
        
        newLayers.push(selectionLayer);
      }

      console.log('Layers to render:', newLayers);
      setLayers(newLayers);
    } catch (error) {
      console.error('Error creating layers:', error);
      setLayers([]);
    }
  }, [layerType, data, metadata, selectionMode, locationLabels]);

  console.log('MapVisualization render - Layers count:', layers.length, 'Layer type:', layerType);

  return (
    <div className="w-full h-full">
      {layers.length > 0 ? (
        <DeckGL
          viewState={viewState}
          onViewStateChange={onViewStateChange}
          controller={true}
          layers={layers}
          getTooltip={({object}) => {
            if (!object) return null;
            return {
              html: `<div style="background: rgba(0,0,0,0.8); color: white; padding: 8px; border-radius: 4px;">
                <strong>${object.name || object.category || 'Data point'}</strong>
                ${object.category ? `<br/>Category: ${object.category}` : ''}
                ${object.value ? `<br/>Value: ${object.value}` : ''}
              </div>`,
              style: {
                fontSize: '12px'
              }
            };
          }}
        >
          <Map
            mapboxAccessToken={MAPBOX_TOKEN}
            mapStyle={MAP_STYLES[mapStyle] || MAP_STYLES.dark}
            terrain={mapStyle === 'terrain' ? { source: 'mapbox-dem', exaggeration: 1.5 } : undefined}
          />
        </DeckGL>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-950/50 text-blue-300">
          Loading visualization...
        </div>
      )}
    </div>
  );
}
