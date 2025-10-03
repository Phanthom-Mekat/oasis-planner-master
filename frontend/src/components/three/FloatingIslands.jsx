'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

function Island({ position, color, label, speed = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002 * speed;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={2}>
      <group position={position} ref={meshRef}>
        {/* Island Base */}
        <mesh castShadow>
          <cylinderGeometry args={[0.8, 0.5, 0.3, 32]} />
          <meshStandardMaterial
            color={color}
            roughness={0.3}
            metalness={0.5}
            emissive={color}
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Floating Crystals */}
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i * Math.PI) / 2) * 0.6,
              0.5 + Math.sin((i * Math.PI) / 2) * 0.2,
              Math.sin((i * Math.PI) / 2) * 0.6,
            ]}
          >
            <octahedronGeometry args={[0.1, 0]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}

        {/* Label */}
        <Center position={[0, -0.5, 0]}>
          <Text3D
            font="/fonts/helvetiker_regular.typeface.json"
            size={0.15}
            height={0.02}
            curveSegments={12}
          >
            {label}
            <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.3} />
          </Text3D>
        </Center>
      </group>
    </Float>
  );
}

export default function FloatingIslands() {
  return (
    <group>
      <Island position={[-3, 2, -2]} color="#10b981" label="NASA" speed={0.8} />
      <Island position={[3, 1, -2]} color="#8b5cf6" label="AI" speed={1.2} />
      <Island position={[0, 3, -3]} color="#f59e0b" label="CLIMATE" speed={1} />
      <Island position={[-2, 0, -1]} color="#ef4444" label="DATA" speed={0.9} />
      <Island position={[2, -1, -1]} color="#06b6d4" label="OASIS" speed={1.1} />
    </group>
  );
}
