'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useNexusStore } from '@/store/nexusStore';
import { coreVertexShader, coreFragmentShader, glitchFragmentShader } from '@/shaders/nexusShaders';

export default function PopulationCores({ populationData }) {
  const meshRef = useRef();
  const { analysisMode, selectCore, starvedCores } = useNexusStore();

  // Create instanced mesh for performance
  const { instancedMesh, coreData } = useMemo(() => {
    if (!populationData || populationData.length === 0) return { instancedMesh: null, coreData: [] };

    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const count = populationData.length;
    const mesh = new THREE.InstancedMesh(geometry, null, count);

    const data = populationData.map((point, index) => {
      // Calculate if this core is starved (far from resources)
      const isStarved = starvedCores.some(s => s.id === point.id);
      
      // Map density to size (0.5 to 3.0)
      const size = Math.sqrt(point.density / 10000) * 0.8;
      
      // Map growth rate to pulse speed
      const pulseRate = 1.0 + (point.growthRate || 0) * 2.0;
      
      // Position: lon, lat converted to 3D coordinates
      const position = new THREE.Vector3(
        (point.lon - 90.4) * 100000, // Scale and center on Dhaka
        (point.lat - 23.8) * 100000,
        size * 500 // Hover at height based on size
      );

      // Set instance matrix
      const matrix = new THREE.Matrix4();
      matrix.makeScale(size * 100, size * 100, size * 100);
      matrix.setPosition(position);
      mesh.setMatrixAt(index, matrix);

      return {
        id: point.id,
        position,
        size,
        density: point.density,
        pulseRate,
        isStarved,
        ward: point.ward,
        area: point.area,
      };
    });

    mesh.instanceMatrix.needsUpdate = true;
    return { instancedMesh: mesh, coreData: data };
  }, [populationData, starvedCores]);

  // Animate cores
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();
    
    // Update shader uniforms for pulsing effect
    if (meshRef.current.material) {
      meshRef.current.material.uniforms.time.value = time;
    }
  });

  // Create shader material
  const material = useMemo(() => {
    const isHousingMode = analysisMode === 'housing';
    
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pulseRate: { value: 1.5 },
        coreColor: { value: new THREE.Color(isHousingMode ? 0xff4444 : 0x44aaff) },
        opacity: { value: 0.8 },
        baseRadius: { value: 1.0 },
        isStarved: { value: false },
        glitchIntensity: { value: isHousingMode ? 0.3 : 0.0 },
      },
      vertexShader: coreVertexShader,
      fragmentShader: isHousingMode ? glitchFragmentShader : coreFragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
  }, [analysisMode]);

  if (!instancedMesh) return null;

  return (
    <primitive 
      ref={meshRef} 
      object={instancedMesh} 
      material={material}
      onClick={(e) => {
        e.stopPropagation();
        const instanceId = e.instanceId;
        if (instanceId !== undefined && coreData[instanceId]) {
          selectCore(coreData[instanceId]);
        }
      }}
    />
  );
}
