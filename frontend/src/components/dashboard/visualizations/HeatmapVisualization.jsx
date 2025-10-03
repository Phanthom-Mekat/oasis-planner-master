"use client";

import React, { useMemo } from 'react';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';

export default function HeatmapVisualization({ data, metadata }) {
  const layer = useMemo(() => {
    if (!data || data.length === 0) return null;

    return new HeatmapLayer({
      id: 'heatmap-layer',
      data: data,
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
    });
  }, [data, metadata]);

  return layer;
}
