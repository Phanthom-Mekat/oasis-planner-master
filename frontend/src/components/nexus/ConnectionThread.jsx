'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useNexusStore } from '@/store/nexusStore';
import { threadVertexShader, threadFragmentShader } from '@/shaders/nexusShaders';

export default function ConnectionThread() {
  const { selectedCore, activeConnection, setActiveConnection, infrastructureData, analysisMode } = useNexusStore();
  const meshRef = useRef();

  // Calculate nearest resource when core is selected
  useEffect(() => {
    if (!selectedCore || !selectedCore.isStarved) {
      setActiveConnection(null);
      return;
    }

    // Find nearest resource based on analysis mode
    let resources = [];
    switch (analysisMode) {
      case 'food':
        resources = infrastructureData.markets;
        break;
      case 'housing':
        resources = infrastructureData.hospitals;
        break;
      case 'transportation':
        resources = infrastructureData.transit;
        break;
      default:
        resources = [...infrastructureData.markets, ...infrastructureData.hospitals, ...infrastructureData.transit];
    }

    if (resources.length === 0) return;

    // Find closest resource
    let nearestResource = null;
    let minDistance = Infinity;

    resources.forEach((resource) => {
      const dx = selectedCore.position.x - (resource.lon - 90.4) * 100000;
      const dy = selectedCore.position.y - (resource.lat - 23.8) * 100000;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < minDistance) {
        minDistance = distance;
        nearestResource = resource;
      }
    });

    if (nearestResource) {
      const targetPosition = new THREE.Vector3(
        (nearestResource.lon - 90.4) * 100000,
        (nearestResource.lat - 23.8) * 100000,
        10
      );

      setActiveConnection({
        from: selectedCore.position.clone(),
        to: targetPosition,
        distance: minDistance / 1000, // Convert to km
        resource: nearestResource,
      });
    }
  }, [selectedCore, infrastructureData, analysisMode, setActiveConnection]);

  // Create thread geometry
  const { curve, geometry } = useMemo(() => {
    if (!activeConnection) return { curve: null, geometry: null };

    // Create curved path
    const midpoint = new THREE.Vector3(
      (activeConnection.from.x + activeConnection.to.x) / 2,
      (activeConnection.from.y + activeConnection.to.y) / 2,
      Math.max(activeConnection.from.z, activeConnection.to.z) + 200
    );

    const curveObj = new THREE.QuadraticBezierCurve3(
      activeConnection.from,
      midpoint,
      activeConnection.to
    );

    // Create tube geometry along curve
    const points = curveObj.getPoints(100);
    const tubeGeometry = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(points),
      100,
      2,
      8,
      false
    );

    // Add path progress attribute for shader
    const pathProgress = new Float32Array(tubeGeometry.attributes.position.count);
    for (let i = 0; i < pathProgress.length; i++) {
      pathProgress[i] = i / pathProgress.length;
    }
    tubeGeometry.setAttribute('pathProgress', new THREE.BufferAttribute(pathProgress, 1));

    return { curve: curveObj, geometry: tubeGeometry };
  }, [activeConnection]);

  // Shader material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        flickerSpeed: { value: 8.0 },
        threadColor: { value: new THREE.Color(0.9, 0.2, 0.2) }, // Dim red
      },
      vertexShader: threadVertexShader,
      fragmentShader: threadFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  // Animate thread
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();
    
    if (meshRef.current.material && meshRef.current.material.uniforms) {
      meshRef.current.material.uniforms.time.value = time;
    }
  });

  if (!activeConnection || !geometry) return null;

  return (
    <group>
      {/* Fragile thread */}
      <mesh ref={meshRef} geometry={geometry} material={material} />
      
      {/* Traveling light particle */}
      <TravelingParticle curve={curve} color={new THREE.Color(1.0, 0.4, 0.4)} />
    </group>
  );
}

// Particle that travels along the thread
function TravelingParticle({ curve, color }) {
  const particleRef = useRef();

  useFrame(({ clock }) => {
    if (!particleRef.current || !curve) return;
    
    const time = clock.getElapsedTime();
    const t = (time * 0.1) % 1.0;
    const position = curve.getPoint(t);
    
    particleRef.current.position.copy(position);
  });

  return (
    <mesh ref={particleRef}>
      <sphereGeometry args={[5, 16, 16]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
