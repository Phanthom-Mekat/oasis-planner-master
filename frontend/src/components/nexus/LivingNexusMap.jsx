'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sparkles, Stars, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Import components
import { useNexusStore } from '@/store/nexusStore';
import PopulationCores from '@/components/nexus/PopulationCores';
import InfrastructureStreams from '@/components/nexus/InfrastructureStreams';
import ResourceWells from '@/components/nexus/ResourceWells';
import ConnectionThread from '@/components/nexus/ConnectionThread';
import NexusController from '@/components/nexus/NexusController';

// Mapbox token
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZWxlY3RyMCIsImEiOiJjbWc5azF3a3owamVvMmpzOHFsMHljem5qIn0.rpjeucjo4H9UArQn-oBSAA';

export default function LivingNexusMap() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const { 
    setPopulationData, 
    setInfrastructureData, 
    setStarvedCores,
    setLoading,
    setDataLoaded,
    loading
  } = useNexusStore();

  // Initialize Mapbox
  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    try {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12', // Google Maps-like hybrid style
        center: [90.4, 23.8], // Dhaka, Bangladesh
        zoom: 11.5,
        pitch: 0,
        bearing: 0,
        antialias: true,
      });

      // Handle map load
      map.on('load', () => {
        console.log('✅ Mapbox loaded successfully');
        setMapLoaded(true);
      });

      // Handle errors gracefully
      map.on('error', (e) => {
        console.warn('Mapbox warning:', e.error?.message || 'Unknown error');
        // Don't block the app on tile errors
      });

      mapRef.current = map;

      // Cleanup
      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    } catch (err) {
      console.error('Failed to initialize Mapbox:', err);
      setMapLoaded(true); // Continue anyway
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadNexusData();
  }, []);

  const loadNexusData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate loading delay for smooth experience
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate synthetic data for demo
      const populationData = generatePopulationData();
      const infrastructureData = generateInfrastructureData();
      const starvedCores = identifyStarvedCores(populationData, infrastructureData);

      setPopulationData(populationData);
      setInfrastructureData(infrastructureData);
      setStarvedCores(starvedCores);
      
      setLoading(false);
      setDataLoaded(true);
      setIsReady(true);
    } catch (err) {
      console.error('Error loading Nexus data:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Error state
  if (error) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center max-w-2xl p-8">
          <div className="text-red-400 text-8xl mb-6">⚠️</div>
          <h2 className="text-white text-3xl font-bold mb-4">Failed to Initialize Nexus</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Mapbox Base Map (Google Maps Hybrid Style) */}
      <div 
        ref={mapContainerRef}
        className="absolute inset-0 z-0"
        style={{
          opacity: mapLoaded ? 0.5 : 0,
          transition: 'opacity 1s ease-in-out',
          filter: 'brightness(0.6) contrast(1.2) saturate(0.9)',
        }}
      />
      
      {/* Enhanced Overlay Effects */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        {/* Animated gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(59, 130, 246, 0.08) 50%, rgba(139, 92, 246, 0.08) 100%)',
            backgroundSize: '200% 200%',
            animation: 'gradient 15s ease infinite',
          }}
        />
        
        {/* Subtle cyber grid */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(6, 182, 212, 0.1) 80px, rgba(6, 182, 212, 0.1) 81px),
              repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(6, 182, 212, 0.1) 80px, rgba(6, 182, 212, 0.1) 81px)
            `,
          }}
        />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 10}s`,
                animation: 'float 18s ease-in-out infinite',
              }}
            />
          ))}
        </div>
      </div>

      {/* Three.js 3D Scene */}
      <div className="absolute inset-0 z-10">
        <Canvas
          camera={{ position: [0, -3500, 6000], fov: 55 }}
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
          }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <NexusController />
      
      {/* Top Status Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
        <div className="flex items-center justify-between p-6">
          <div className="backdrop-blur-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl px-6 py-3 pointer-events-auto">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-cyan-300 font-semibold text-sm">NEXUS ACTIVE</span>
            </div>
          </div>
          
          <div className="backdrop-blur-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl px-6 py-3 pointer-events-auto">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-purple-300 text-xs font-medium">POPULATION</div>
                <div className="text-white text-lg font-bold">150</div>
              </div>
              <div className="w-px h-8 bg-purple-500/30" />
              <div className="text-center">
                <div className="text-pink-300 text-xs font-medium">STARVED</div>
                <div className="text-red-400 text-lg font-bold">12</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State with Progress */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/80">
          <div className="text-center max-w-lg">
            {/* Animated logo */}
            <div className="relative mb-8">
              <div className="text-8xl animate-pulse">🌐</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
              </div>
            </div>
            
            {/* Loading text */}
            <h2 className="text-white text-3xl font-bold mb-3 animate-pulse">
              Awakening the Nexus
            </h2>
            <p className="text-cyan-300 text-sm mb-6 font-medium">
              Initializing NASA satellite data streams...
            </p>
            
            {/* Progress indicators */}
            <div className="space-y-2 max-w-md mx-auto">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Population Cores</span>
                <span className="text-cyan-400">✓</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Infrastructure Streams</span>
                <span className="text-cyan-400 animate-pulse">●</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Resource Wells</span>
                <span className="text-gray-600">○</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Keyboard Shortcuts Help */}
      <div className="absolute bottom-6 right-6 z-20 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-white/10 rounded">←→</kbd>
            <span>Rotate</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-white/10 rounded">Scroll</kbd>
            <span>Zoom</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-white/10 rounded">Click</kbd>
            <span>Select</span>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// Enhanced 3D Scene with better lighting
function Scene() {
  const { populationData, infrastructureData } = useNexusStore();

  return (
    <>
      {/* Multi-layered Lighting Setup */}
      <ambientLight intensity={0.4} color="#1e3a8a" />
      
      {/* Main sun light */}
      <directionalLight 
        position={[200, 200, 100]} 
        intensity={2} 
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Accent lights for glow effect */}
      <pointLight position={[0, 0, 2000]} intensity={3} color="#06b6d4" distance={10000} />
      <pointLight position={[-2000, -2000, 1000]} intensity={2} color="#8b5cf6" distance={8000} />
      <pointLight position={[2000, 2000, 1000]} intensity={2} color="#ec4899" distance={8000} />

      {/* Atmospheric fog */}
      <fog attach="fog" args={['#000510', 8000, 20000]} />

      {/* Starfield Background */}
      <Stars 
        radius={400} 
        depth={80} 
        count={8000} 
        factor={6} 
        saturation={0.2} 
        fade 
        speed={0.3}
      />
      
      {/* Floating particles */}
      <Sparkles
        count={300}
        scale={[25000, 25000, 8000]}
        size={4}
        speed={0.2}
        opacity={0.4}
        color="#06b6d4"
      />

      {/* The Living Organism Components */}
      <PopulationCores populationData={populationData} />
      <InfrastructureStreams 
        roads={infrastructureData.roads} 
        nightlightData={[]} 
      />
      <ResourceWells
        markets={infrastructureData.markets}
        hospitals={infrastructureData.hospitals}
        transitHubs={infrastructureData.transit}
      />
      <ConnectionThread />

      {/* Camera Controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
        minDistance={1000}
        maxDistance={15000}
        maxPolarAngle={Math.PI / 2}
      />

      {/* Enhanced Post-Processing Effects */}
      <EffectComposer multisampling={8}>
        {/* Stronger bloom for dramatic glow */}
        <Bloom
          intensity={2.5}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.95}
          radius={1.0}
          mipmapBlur
        />
        
        {/* Subtle chromatic aberration */}
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.0015, 0.0015)}
        />
        
        {/* Dramatic vignette */}
        <Vignette
          offset={0.2}
          darkness={0.7}
          eskil={false}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </>
  );
}

// Data generation functions
function generatePopulationData() {
  const data = [];
  const centerLon = 90.4;
  const centerLat = 23.8;
  const numPoints = 150;

  for (let i = 0; i < numPoints; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 0.15;
    
    const lon = centerLon + Math.cos(angle) * distance;
    const lat = centerLat + Math.sin(angle) * distance;
    
    data.push({
      id: `pop-${i}`,
      lon,
      lat,
      density: Math.random() * 50000 + 10000,
      growthRate: Math.random() * 0.5,
      ward: `Ward ${Math.floor(Math.random() * 92) + 1}`,
      area: `Dhaka-${Math.floor(Math.random() * 100)}`,
    });
  }

  return data;
}

function generateInfrastructureData() {
  const centerLon = 90.4;
  const centerLat = 23.8;

  // Generate roads
  const roads = [];
  for (let i = 0; i < 200; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance1 = Math.random() * 0.1;
    const distance2 = Math.random() * 0.1 + distance1;
    
    roads.push({
      from: [
        centerLon + Math.cos(angle) * distance1,
        centerLat + Math.sin(angle) * distance1
      ],
      to: [
        centerLon + Math.cos(angle) * distance2,
        centerLat + Math.sin(angle) * distance2
      ],
      connectivity: Math.random(),
    });
  }

  // Generate markets
  const markets = [];
  for (let i = 0; i < 30; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 0.12;
    
    markets.push({
      id: `market-${i}`,
      lon: centerLon + Math.cos(angle) * distance,
      lat: centerLat + Math.sin(angle) * distance,
      type: Math.random() > 0.5 ? 'supermarket' : 'local',
      radius: Math.random() * 2 + 0.5,
    });
  }

  // Generate hospitals
  const hospitals = [];
  for (let i = 0; i < 15; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 0.1;
    
    hospitals.push({
      id: `hospital-${i}`,
      lon: centerLon + Math.cos(angle) * distance,
      lat: centerLat + Math.sin(angle) * distance,
      capacity: Math.random() * 500 + 100,
    });
  }

  // Generate transit
  const transit = [];
  for (let i = 0; i < 20; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 0.08;
    
    transit.push({
      id: `transit-${i}`,
      lon: centerLon + Math.cos(angle) * distance,
      lat: centerLat + Math.sin(angle) * distance,
      type: Math.random() > 0.7 ? 'metro' : 'bus',
      capacity: Math.random() * 10000 + 5000,
    });
  }

  return { roads, markets, hospitals, transit };
}

function identifyStarvedCores(populationData, infrastructureData) {
  const starved = [];
  const allResources = [
    ...infrastructureData.markets,
    ...infrastructureData.hospitals,
    ...infrastructureData.transit
  ];

  populationData.forEach((core) => {
    // Find nearest resource
    let minDistance = Infinity;
    
    allResources.forEach((resource) => {
      const dx = core.lon - resource.lon;
      const dy = core.lat - resource.lat;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < minDistance) {
        minDistance = distance;
      }
    });

    // If far from resources and high density = starved
    if (minDistance > 0.03 && core.density > 30000) {
      starved.push({
        ...core,
        isStarved: true,
        nearestResourceDistance: minDistance,
      });
    }
  });

  return starved;
}
