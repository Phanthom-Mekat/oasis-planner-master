'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, Vignette } from '@react-three/postprocessing';
import { useSceneStore } from '@/lib/sceneStore';
import IslandsOfNeed from './IslandsOfNeed';
import LivingMiasma from './LivingMiasma';
import CrystalChronoscape from './CrystalChronoscape';

function SceneContent() {
  const activeLayer = useSceneStore((state) => state.activeLayer);

  return (
    <>
      {/* Camera Setup */}
      <PerspectiveCamera makeDefault position={[0, 8, 12]} fov={60} />
      
      {/* Controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={25}
        maxPolarAngle={Math.PI / 2.2}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />

      {/* Environment */}
      <Environment preset="night" />
      <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />

      {/* Conditional Scene Rendering */}
      {activeLayer === 'access' && <IslandsOfNeed />}
      {activeLayer === 'pollution' && <LivingMiasma />}
      {activeLayer === 'growth' && <CrystalChronoscape />}

      {/* Post Processing */}
      <EffectComposer>
        <Bloom
          intensity={1.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          radius={0.8}
        />
        <DepthOfField
          focusDistance={0.02}
          focalLength={0.05}
          bokehScale={3}
        />
        <Vignette eskil={false} offset={0.1} darkness={0.5} />
      </EffectComposer>
    </>
  );
}

export default function EtherealScene() {
  return (
    <div className="w-full h-full">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
