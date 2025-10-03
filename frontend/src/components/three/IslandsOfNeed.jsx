'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';

// Simulated population data for Dhaka districts
const populationData = [
  { lat: 23.8103, lon: 90.4125, density: 45000, label: 'Motijheel' },
  { lat: 23.7808, lon: 90.4217, density: 52000, label: 'Old Dhaka' },
  { lat: 23.7561, lon: 90.3872, density: 38000, label: 'Mohammadpur' },
  { lat: 23.7925, lon: 90.4078, density: 41000, label: 'Dhanmondi' },
  { lat: 23.8223, lon: 90.3654, density: 35000, label: 'Mirpur' },
  { lat: 23.7956, lon: 90.3537, density: 28000, label: 'Uttara' },
  { lat: 23.8103, lon: 90.3372, density: 22000, label: 'Savar' },
];

// Infrastructure access points
const infrastructurePoints = [
  { lat: 23.8103, lon: 90.4125, type: 'hospital', connections: 12 },
  { lat: 23.7808, lon: 90.4217, type: 'market', connections: 8 },
  { lat: 23.7561, lon: 90.3872, type: 'transport', connections: 15 },
  { lat: 23.7925, lon: 90.4078, type: 'hospital', connections: 10 },
  { lat: 23.8223, lon: 90.3654, type: 'market', connections: 6 },
  { lat: 23.7956, lon: 90.3537, type: 'transport', connections: 4 },
];

function PopulationPillar({ position, height, density, label }) {
  const meshRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    if (meshRef.current && glowRef.current) {
      // Gentle pulsing effect
      const pulse = Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1 + 0.9;
      meshRef.current.scale.y = pulse;
      glowRef.current.material.opacity = pulse * 0.3;
    }
  });

  return (
    <group position={position}>
      {/* Main pillar */}
      <mesh ref={meshRef} castShadow>
        <cylinderGeometry args={[0.03, 0.05, height, 16]} />
        <meshPhysicalMaterial
          color="#60a5fa"
          emissive="#3b82f6"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Glow effect */}
      <mesh ref={glowRef} position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.08, 0.1, height, 16]} />
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Top light point */}
      <pointLight
        position={[0, height, 0]}
        color="#60a5fa"
        intensity={density / 10000}
        distance={2}
      />
    </group>
  );
}

function InfrastructureNetwork() {
  const linesRef = useRef();

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.material.opacity = Math.sin(state.clock.elapsedTime * 3) * 0.2 + 0.6;
    }
  });

  const lines = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    infrastructurePoints.forEach((point, i) => {
      infrastructurePoints.forEach((otherPoint, j) => {
        if (i < j && Math.random() > 0.3) {
          // Convert lat/lon to 3D coordinates (simplified)
          const x1 = (point.lon - 90.4) * 10;
          const z1 = (point.lat - 23.8) * 10;
          const x2 = (otherPoint.lon - 90.4) * 10;
          const z2 = (otherPoint.lat - 23.8) * 10;

          positions.push(x1, 0.05, z1);
          positions.push(x2, 0.05, z2);

          const color = new THREE.Color('#10b981');
          colors.push(color.r, color.g, color.b);
          colors.push(color.r, color.g, color.b);
        }
      });
    });

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return geometry;
  }, []);

  return (
    <lineSegments ref={linesRef} geometry={lines}>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={0.6}
        linewidth={2}
      />
    </lineSegments>
  );
}

function InfrastructureNodes() {
  return (
    <Instances limit={infrastructurePoints.length}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial
        color="#10b981"
        emissive="#10b981"
        emissiveIntensity={2}
        toneMapped={false}
      />
      {infrastructurePoints.map((point, i) => {
        const x = (point.lon - 90.4) * 10;
        const z = (point.lat - 23.8) * 10;
        return <Instance key={i} position={[x, 0.05, z]} />;
      })}
    </Instances>
  );
}

export default function IslandsOfNeed() {
  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#0a0a0a"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Population pillars */}
      {populationData.map((area, i) => {
        const x = (area.lon - 90.4) * 10;
        const z = (area.lat - 23.8) * 10;
        const height = (area.density / 10000) * 2;
        return (
          <PopulationPillar
            key={i}
            position={[x, height / 2, z]}
            height={height}
            density={area.density}
            label={area.label}
          />
        );
      })}

      {/* Infrastructure network */}
      <InfrastructureNetwork />
      <InfrastructureNodes />

      {/* Ambient lighting for the scene */}
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#3b82f6" />
    </group>
  );
}
