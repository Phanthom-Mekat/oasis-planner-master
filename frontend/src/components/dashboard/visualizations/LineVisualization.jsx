"use client";

import React, { useMemo } from 'react';
import { LineLayer } from '@deck.gl/layers';

export default function LineVisualization({ data, metadata }) {
  const layer = useMemo(() => {
    if (!data || data.length === 0) return null;

    return new LineLayer({
      id: 'line-layer',
      data: data,
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
    });
  }, [data, metadata]);

  return layer;
}
