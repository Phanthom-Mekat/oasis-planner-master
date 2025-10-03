"use client";

import React, { useMemo } from 'react';
import { ScatterplotLayer } from '@deck.gl/layers';

export default function ScatterplotVisualization({ data, metadata }) {
  const layer = useMemo(() => {
    if (!data || data.length === 0) return null;

    return new ScatterplotLayer({
      id: 'scatterplot-layer',
      data: data,
      getPosition: d => d.coordinates,
      getFillColor: d => d.color || [255, 140, 0],
      getRadius: d => d.radius || 100,
      pickable: true,
      radiusScale: 1,
      radiusMinPixels: 3,
      radiusMaxPixels: 50,
      opacity: 0.8
    });
  }, [data, metadata]);

  return layer;
}
