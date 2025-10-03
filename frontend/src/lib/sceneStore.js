import { create } from 'zustand';

export const useSceneStore = create((set) => ({
  // Active visualization
  activeLayer: 'access', // 'access', 'pollution', 'growth'
  
  // Camera state
  cameraTarget: [23.8103, 90.4125, 0],
  cameraPosition: [0, 0, 15],
  
  // Data layers visibility
  layers: {
    population: true,
    infrastructure: true,
    heatIslands: false,
    airPollution: false,
    waterPollution: false,
    urbanGrowth: false,
    greenSpaces: true,
  },
  
  // Simulation parameters
  simulation: {
    isActive: false,
    type: null,
    progress: 0,
  },
  
  // Timeline for growth visualization
  timeline: {
    year: 2025,
    isPlaying: false,
    speed: 1,
  },
  
  // Selected feature
  selectedFeature: null,
  
  // Actions
  setActiveLayer: (layer) => set({ activeLayer: layer }),
  setCameraTarget: (target) => set({ cameraTarget: target }),
  setCameraPosition: (position) => set({ cameraPosition: position }),
  toggleLayer: (layer) => set((state) => ({
    layers: { ...state.layers, [layer]: !state.layers[layer] }
  })),
  startSimulation: (type) => set({
    simulation: { isActive: true, type, progress: 0 }
  }),
  updateSimulation: (progress) => set((state) => ({
    simulation: { ...state.simulation, progress }
  })),
  endSimulation: () => set({
    simulation: { isActive: false, type: null, progress: 0 }
  }),
  setTimeline: (year) => set((state) => ({
    timeline: { ...state.timeline, year }
  })),
  toggleTimelinePlay: () => set((state) => ({
    timeline: { ...state.timeline, isPlaying: !state.timeline.isPlaying }
  })),
  selectFeature: (feature) => set({ selectedFeature: feature }),
}));
