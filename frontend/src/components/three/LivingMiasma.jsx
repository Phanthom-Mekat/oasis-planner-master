'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { pollutionNebulaVertexShader, pollutionNebulaFragmentShader } from '@/lib/shaders';

// Simulated pollution data points
const generatePollutionData = () => {
  const points = [];
  const count = 5000;

  // Industrial areas (high pollution)
  for (let i = 0; i < count * 0.4; i++) {
    points.push({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 3 + 2,
        Math.random() * 4,
        (Math.random() - 0.5) * 3
      ),
      pollution: 0.8 + Math.random() * 0.2,
    });
  }

  // Highway corridors (medium pollution)
  for (let i = 0; i < count * 0.3; i++) {
    const t = Math.random();
    points.push({
      position: new THREE.Vector3(
        t * 8 - 4,
        Math.random() * 2,
        Math.sin(t * Math.PI * 2) * 2
      ),
      pollution: 0.5 + Math.random() * 0.3,
    });
  }

  // Residential areas (low pollution)
  for (let i = 0; i < count * 0.3; i++) {
    points.push({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        Math.random() * 3,
        (Math.random() - 0.5) * 8
      ),
      pollution: 0.1 + Math.random() * 0.3,
    });
  }

  return points;
};

export default function LivingMiasma() {
  const particlesRef = useRef();
  const shaderRef = useRef();

  const pollutionData = useMemo(() => generatePollutionData(), []);

  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(pollutionData.length * 3);
    const pollution = new Float32Array(pollutionData.length);

    pollutionData.forEach((point, i) => {
      positions[i * 3] = point.position.x;
      positions[i * 3 + 1] = point.position.y;
      positions[i * 3 + 2] = point.position.z;
      pollution[i] = point.pollution;
    });

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('pollution', new THREE.BufferAttribute(pollution, 1));

    return geometry;
  }, [pollutionData]);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorClean: { value: new THREE.Color('#60a5fa') },
        uColorPolluted: { value: new THREE.Color('#dc2626') },
        uPollutionLevel: { value: 1.0 },
      },
      vertexShader: pollutionNebulaVertexShader,
      fragmentShader: pollutionNebulaFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  useFrame((state) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }

    if (particlesRef.current) {
      // Slow rotation and drift
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      
      // Update positions for fluid motion
      const positions = particlesRef.current.geometry.attributes.position.array;
      const pollution = particlesRef.current.geometry.attributes.pollution.array;

      for (let i = 0; i < positions.length; i += 3) {
        // Drift motion based on pollution level
        const pollutionLevel = pollution[i / 3];
        positions[i] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.002 * pollutionLevel;
        positions[i + 1] += Math.cos(state.clock.elapsedTime * 0.3 + i) * 0.001;
        positions[i + 2] += Math.sin(state.clock.elapsedTime * 0.4 + i) * 0.002 * pollutionLevel;
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.9}
        />
      </mesh>

      {/* Pollution particle system */}
      <points ref={particlesRef} geometry={particleGeometry}>
        <shaderMaterial ref={shaderRef} attach="material" {...shaderMaterial} />
      </points>

      {/* Volumetric lighting */}
      <spotLight
        position={[5, 10, 5]}
        angle={0.5}
        penumbra={1}
        intensity={2}
        color="#dc2626"
        castShadow
      />
      <spotLight
        position={[-5, 10, -5]}
        angle={0.5}
        penumbra={1}
        intensity={1}
        color="#f59e0b"
      />

      {/* Ambient fog */}
      <fog attach="fog" args={['#0f172a', 5, 15]} />
    </group>
  );
}
