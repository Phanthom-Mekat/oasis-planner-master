'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import DataSphere from './DataSphere';

export default function DashboardScene3D({ metrics = [] }) {
  return (
    <div className="w-full h-64 rounded-xl overflow-hidden">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={60} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#3b82f6" />

        {/* Environment */}
        <Environment preset="city" />
        <Stars radius={50} depth={30} count={3000} factor={2} fade speed={1} />

        {/* Data Visualizations */}
        <DataSphere 
          position={[-2, 0, 0]} 
          data={{ label: metrics[0]?.label || 'Temp', value: metrics[0]?.value }} 
        />
        <DataSphere 
          position={[2, 0, 0]} 
          data={{ label: metrics[1]?.label || 'AQI', value: metrics[1]?.value }} 
        />
        <DataSphere 
          position={[0, 2, 0]} 
          data={{ label: metrics[2]?.label || 'Flood', value: metrics[2]?.value }} 
        />

        {/* Post Processing */}
        <EffectComposer>
          <Bloom
            intensity={1}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
