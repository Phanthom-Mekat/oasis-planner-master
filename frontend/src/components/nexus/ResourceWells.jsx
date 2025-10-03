'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useNexusStore } from '@/store/nexusStore';
import { wellVertexShader, wellFragmentShader } from '@/shaders/nexusShaders';

export default function ResourceWells({ markets, hospitals, transitHubs }) {
  const groupRef = useRef();
  const { analysisMode } = useNexusStore();

  // Combine all resource types
  const wells = useMemo(() => {
    const allWells = [];

    // Food markets - Emerald green
    if (markets && (analysisMode === 'food' || analysisMode === 'all')) {
      markets.forEach((market, index) => {
        allWells.push({
          id: `market-${index}`,
          type: 'food',
          position: [
            (market.lon - 90.4) * 100000,
            (market.lat - 23.8) * 100000,
            5
          ],
          color: new THREE.Color(0.2, 0.9, 0.4), // Emerald green
          radius: market.radius * 50,
          pulseSpeed: 1.5,
          data: market,
        });
      });
    }

    // Hospitals - Cyan blue
    if (hospitals && (analysisMode === 'housing' || analysisMode === 'all')) {
      hospitals.forEach((hospital, index) => {
        allWells.push({
          id: `hospital-${index}`,
          type: 'health',
          position: [
            (hospital.lon - 90.4) * 100000,
            (hospital.lat - 23.8) * 100000,
            5
          ],
          color: new THREE.Color(0.3, 0.8, 0.9), // Cyan
          radius: 80,
          pulseSpeed: 1.0,
          data: hospital,
        });
      });
    }

    // Transit hubs - Electric purple
    if (transitHubs && (analysisMode === 'transportation' || analysisMode === 'all')) {
      transitHubs.forEach((hub, index) => {
        allWells.push({
          id: `transit-${index}`,
          type: 'transit',
          position: [
            (hub.lon - 90.4) * 100000,
            (hub.lat - 23.8) * 100000,
            5
          ],
          color: new THREE.Color(0.7, 0.3, 1.0), // Purple
          radius: Math.sqrt(hub.capacity || 1000) * 0.5,
          pulseSpeed: 2.0,
          data: hub,
        });
      });
    }

    return allWells;
  }, [markets, hospitals, transitHubs, analysisMode]);

  // Animate wells
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const time = clock.getElapsedTime();
    
    groupRef.current.children.forEach((child) => {
      // Traverse to find meshes with shader materials
      child.traverse((obj) => {
        if (obj.material && obj.material.uniforms && obj.material.uniforms.time) {
          obj.material.uniforms.time.value = time;
        }
      });
    });
  });

  return (
    <group ref={groupRef}>
      {wells.map((well) => (
        <ResourceWell key={well.id} well={well} />
      ))}
    </group>
  );
}

// Individual resource well
function ResourceWell({ well }) {
  const meshRef = useRef();

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pulseSpeed: { value: well.pulseSpeed },
        wellColor: { value: well.color },
        radius: { value: 0.5 },
      },
      vertexShader: wellVertexShader,
      fragmentShader: wellFragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [well]);

  // Create particle system for well
  const particles = useMemo(() => {
    const particleCount = 50;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = Math.random() * well.radius;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = Math.random() * 100;

      velocities[i * 3] = (Math.random() - 0.5) * 2;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 2;
      velocities[i * 3 + 2] = Math.random() * 5 + 5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    return geometry;
  }, [well.radius]);

  return (
    <group position={well.position}>
      {/* Main well circle */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[well.radius, 64]} />
        <primitive object={material} />
      </mesh>

      {/* Particle system */}
      <points geometry={particles}>
        <pointsMaterial
          size={3}
          color={well.color}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Glow sphere at center */}
      <mesh>
        <sphereGeometry args={[well.radius * 0.3, 16, 16]} />
        <meshBasicMaterial
          color={well.color}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
