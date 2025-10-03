'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { streamVertexShader, streamFragmentShader } from '@/shaders/nexusShaders';

export default function InfrastructureStreams({ roads, nightlightData }) {
  const groupRef = useRef();

  // Process roads into animated streams
  const streams = useMemo(() => {
    if (!roads || roads.length === 0) return [];

    return roads.map((road, index) => {
      // Find brightness from nightlight data
      const avgLon = (road.from[0] + road.to[0]) / 2;
      const avgLat = (road.from[1] + road.to[1]) / 2;
      
      const brightness = road.connectivity || 0.5;
      const thickness = brightness * 3 + 1;
      
      // Convert to 3D coordinates
      const from3D = new THREE.Vector3(
        (road.from[0] - 90.4) * 100000,
        (road.from[1] - 23.8) * 100000,
        10
      );
      const to3D = new THREE.Vector3(
        (road.to[0] - 90.4) * 100000,
        (road.to[1] - 23.8) * 100000,
        10
      );

      // Color based on connectivity
      const color = brightness > 0.7 
        ? new THREE.Color(0.1, 0.8, 0.5) // Green - good
        : brightness > 0.5 
        ? new THREE.Color(0.9, 0.7, 0.2) // Yellow - moderate
        : new THREE.Color(0.9, 0.3, 0.3); // Red - poor

      return {
        id: `stream-${index}`,
        from: from3D,
        to: to3D,
        color,
        thickness,
        brightness,
        flowSpeed: 0.2 + brightness * 0.3,
      };
    });
  }, [roads, nightlightData]);

  // Animate flow
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const time = clock.getElapsedTime();
    
    groupRef.current.children.forEach((child) => {
      if (child.material && child.material.uniforms && child.material.uniforms.time) {
        child.material.uniforms.time.value = time;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {streams.map((stream) => (
        <StreamLine key={stream.id} stream={stream} />
      ))}
    </group>
  );
}

// Individual animated stream line - using simple approach without custom shaders for now
function StreamLine({ stream }) {
  const lineRef = useRef();

  const geometry = useMemo(() => {
    const points = [stream.from, stream.to];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [stream]);

  // Animate opacity/intensity
  useFrame(({ clock }) => {
    if (!lineRef.current) return;
    const time = clock.getElapsedTime();
    const pulse = Math.sin(time * stream.flowSpeed * 2) * 0.3 + 0.7;
    lineRef.current.material.opacity = pulse * 0.6;
  });

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        color={stream.color}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        linewidth={2}
      />
    </line>
  );
}
