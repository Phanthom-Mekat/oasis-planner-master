'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';

export default function DataSphere({ position = [0, 0, 0], data = {} }) {
  const meshRef = useRef();
  const particlesRef = useRef();

  // Create data visualization particles
  const particles = useMemo(() => {
    const temp = [];
    const count = 100;
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 1 + Math.random() * 0.5;
      
      temp.push({
        position: new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        ),
        speed: 0.5 + Math.random() * 0.5,
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
    
    if (particlesRef.current) {
      particlesRef.current.children.forEach((particle, i) => {
        particle.rotation.y += particles[i].speed * 0.01;
      });
    }
  });

  return (
    <group position={position}>
      {/* Core Sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial
          color="#3b82f6"
          transparent
          opacity={0.6}
          roughness={0.1}
          metalness={0.9}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Data Points */}
      <group ref={particlesRef}>
        {particles.map((p, i) => (
          <mesh key={i} position={p.position}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#60a5fa" />
          </mesh>
        ))}
      </group>

      {/* Data Label */}
      <Billboard position={[0, 1.5, 0]}>
        <Text
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {data.label || 'Climate Data'}
        </Text>
      </Billboard>
    </group>
  );
}
