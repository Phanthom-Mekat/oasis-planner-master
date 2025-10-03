'use client';

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';
import { crystallineGrowthVertexShader, crystallineGrowthFragmentShader } from '@/lib/shaders';
import { useSceneStore } from '@/lib/sceneStore';

// Urban growth data (1975-2025)
const urbanGrowthData = {
  1975: [
    { lat: 23.8103, lon: 90.4125, size: 0.3, intensity: 0.4 },
    { lat: 23.7808, lon: 90.4217, size: 0.4, intensity: 0.5 },
  ],
  1985: [
    { lat: 23.8103, lon: 90.4125, size: 0.5, intensity: 0.6 },
    { lat: 23.7808, lon: 90.4217, size: 0.6, intensity: 0.7 },
    { lat: 23.7925, lon: 90.4078, size: 0.3, intensity: 0.4 },
  ],
  1995: [
    { lat: 23.8103, lon: 90.4125, size: 0.7, intensity: 0.8 },
    { lat: 23.7808, lon: 90.4217, size: 0.8, intensity: 0.9 },
    { lat: 23.7925, lon: 90.4078, size: 0.5, intensity: 0.6 },
    { lat: 23.7561, lon: 90.3872, size: 0.4, intensity: 0.5 },
    { lat: 23.8223, lon: 90.3654, size: 0.3, intensity: 0.4 },
  ],
  2005: [
    { lat: 23.8103, lon: 90.4125, size: 0.9, intensity: 0.95 },
    { lat: 23.7808, lon: 90.4217, size: 1.0, intensity: 1.0 },
    { lat: 23.7925, lon: 90.4078, size: 0.7, intensity: 0.8 },
    { lat: 23.7561, lon: 90.3872, size: 0.6, intensity: 0.7 },
    { lat: 23.8223, lon: 90.3654, size: 0.5, intensity: 0.6 },
    { lat: 23.7956, lon: 90.3537, size: 0.4, intensity: 0.5 },
  ],
  2015: [
    { lat: 23.8103, lon: 90.4125, size: 1.0, intensity: 1.0 },
    { lat: 23.7808, lon: 90.4217, size: 1.0, intensity: 1.0 },
    { lat: 23.7925, lon: 90.4078, size: 0.9, intensity: 0.95 },
    { lat: 23.7561, lon: 90.3872, size: 0.8, intensity: 0.9 },
    { lat: 23.8223, lon: 90.3654, size: 0.7, intensity: 0.8 },
    { lat: 23.7956, lon: 90.3537, size: 0.6, intensity: 0.7 },
    { lat: 23.8103, lon: 90.3372, size: 0.4, intensity: 0.5 },
  ],
  2025: [
    { lat: 23.8103, lon: 90.4125, size: 1.0, intensity: 1.0 },
    { lat: 23.7808, lon: 90.4217, size: 1.0, intensity: 1.0 },
    { lat: 23.7925, lon: 90.4078, size: 1.0, intensity: 1.0 },
    { lat: 23.7561, lon: 90.3872, size: 0.9, intensity: 0.95 },
    { lat: 23.8223, lon: 90.3654, size: 0.8, intensity: 0.9 },
    { lat: 23.7956, lon: 90.3537, size: 0.8, intensity: 0.9 },
    { lat: 23.8103, lon: 90.3372, size: 0.6, intensity: 0.7 },
  ],
};

function CrystallineStructure({ position, size, intensity, growthProgress }) {
  const meshRef = useRef();
  const shaderRef = useRef();

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uGrowthProgress: { value: 0 },
        uTime: { value: 0 },
        uCrystalColor: { value: new THREE.Color('#60a5fa') },
        uEmissiveIntensity: { value: intensity },
      },
      vertexShader: crystallineGrowthVertexShader,
      fragmentShader: crystallineGrowthFragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, [intensity]);

  useFrame((state) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      shaderRef.current.uniforms.uGrowthProgress.value = THREE.MathUtils.lerp(
        shaderRef.current.uniforms.uGrowthProgress.value,
        growthProgress,
        0.05
      );
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[size, 2]} />
        <shaderMaterial ref={shaderRef} attach="material" {...shaderMaterial} />
      </mesh>

      {/* Point light at crystal */}
      <pointLight
        color="#60a5fa"
        intensity={intensity * 2 * growthProgress}
        distance={size * 3}
      />
    </group>
  );
}

export default function CrystalChronoscape() {
  const timeline = useSceneStore((state) => state.timeline);
  
  // Calculate current growth data based on timeline
  const currentGrowthData = useMemo(() => {
    const years = Object.keys(urbanGrowthData).map(Number).sort((a, b) => a - b);
    const currentYear = timeline.year;

    // Find bounding years
    let lowerYear = years[0];
    let upperYear = years[years.length - 1];

    for (let i = 0; i < years.length - 1; i++) {
      if (currentYear >= years[i] && currentYear <= years[i + 1]) {
        lowerYear = years[i];
        upperYear = years[i + 1];
        break;
      }
    }

    // Interpolate between years
    const lowerData = urbanGrowthData[lowerYear];
    const upperData = urbanGrowthData[upperYear];
    const t = (currentYear - lowerYear) / (upperYear - lowerYear);

    // Merge and interpolate data
    const merged = [];
    upperData.forEach((upper) => {
      const lower = lowerData.find(
        (l) => l.lat === upper.lat && l.lon === upper.lon
      );
      if (lower) {
        merged.push({
          ...upper,
          size: THREE.MathUtils.lerp(lower.size, upper.size, t),
          intensity: THREE.MathUtils.lerp(lower.intensity, upper.intensity, t),
          growthProgress: t,
        });
      } else {
        merged.push({ ...upper, growthProgress: Math.min(t * 2, 1) });
      }
    });

    return merged;
  }, [timeline.year]);

  return (
    <group>
      {/* Terrain base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[20, 20, 50, 50]} />
        <meshStandardMaterial
          color="#0a0a0a"
          roughness={0.9}
          wireframe={false}
        />
      </mesh>

      {/* Crystalline urban structures */}
      {currentGrowthData.map((crystal, i) => {
        const x = (crystal.lon - 90.4) * 10;
        const z = (crystal.lat - 23.8) * 10;
        const y = crystal.size;
        return (
          <CrystallineStructure
            key={i}
            position={[x, y, z]}
            size={crystal.size}
            intensity={crystal.intensity}
            growthProgress={crystal.growthProgress || 1}
          />
        );
      })}

      {/* Ambient lighting */}
      <ambientLight intensity={0.05} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.3}
        color="#3b82f6"
      />

      {/* Ground glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.49, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial
          color="#1e40af"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
