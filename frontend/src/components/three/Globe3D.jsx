'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';

export default function Globe3D({ position = [0, 0, 0], scale = 1 }) {
  const meshRef = useRef();
  const particlesRef = useRef();

  // Create climate data points around the globe
  const climatePoints = useMemo(() => {
    const points = [];
    const particleCount = 500;
    
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 2.2 + Math.random() * 0.3;
      
      points.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        speed: 0.5 + Math.random() * 0.5,
        color: new THREE.Color().setHSL(0.5 + Math.random() * 0.2, 0.7, 0.6)
      });
    }
    return points;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <group position={position}>
      {/* Main Globe */}
      <Sphere ref={meshRef} args={[2, 64, 64]} scale={scale}>
        <MeshDistortMaterial
          color="#3b82f6"
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.85}
        />
      </Sphere>

      {/* Atmosphere Glow */}
      <Sphere args={[2.15, 64, 64]} scale={scale}>
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Climate Data Points */}
      <group ref={particlesRef}>
        {climatePoints.map((point, i) => (
          <mesh key={i} position={[point.x, point.y, point.z]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color={point.color} transparent opacity={0.8} />
          </mesh>
        ))}
      </group>

      {/* Stars Background */}
      <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
    </group>
  );
}
