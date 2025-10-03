import { create } from 'zustand';

export const useNexusStore = create((set) => ({
  // Analysis Mode State
  analysisMode: 'food', // 'food' | 'housing' | 'transportation'
  setAnalysisMode: (mode) => set({ analysisMode: mode }),

  // Selection State
  selectedCore: null,
  selectCore: (core) => set({ selectedCore: core }),
  clearSelection: () => set({ selectedCore: null }),

  // Hover State
  hoveredElement: null,
  setHoveredElement: (element) => set({ hoveredElement: element }),

  // Camera State
  cameraPosition: [90.4, 23.8, 5000],
  cameraTarget: [90.4, 23.8, 0],
  updateCamera: (position, target) => set({ 
    cameraPosition: position, 
    cameraTarget: target 
  }),

  // Data Loading State
  isLoading: true,
  dataLoaded: false,
  setLoading: (loading) => set({ isLoading: loading }),
  setDataLoaded: (loaded) => set({ dataLoaded: loaded }),

  // Population Data
  populationData: [],
  setPopulationData: (data) => set({ populationData: data }),

  // Infrastructure Data
  infrastructureData: {
    roads: [],
    transit: [],
    markets: [],
    hospitals: []
  },
  setInfrastructureData: (data) => set({ infrastructureData: data }),

  // Underserved Communities
  starvedCores: [],
  setStarvedCores: (cores) => set({ starvedCores: cores }),

  // Connection Thread Visualization
  activeConnection: null,
  setActiveConnection: (connection) => set({ activeConnection: connection }),

  // UI State
  showController: true,
  toggleController: () => set((state) => ({ showController: !state.showController })),

  // Visual Effects State
  bloomIntensity: 2.0,
  setBloomIntensity: (intensity) => set({ bloomIntensity: intensity }),
}));
