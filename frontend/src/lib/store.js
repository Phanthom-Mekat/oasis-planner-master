import { create } from 'zustand';

export const useAppStore = create((set, get) => ({
  // Current user and persona
  currentUser: {
    name: "Farah Ahmed",
    role: "Urban Planner",
    avatar: "/avatars/farah.jpg",
    permissions: ["simulate", "analyze", "export"]
  },

  // Active project
  activeProject: null,
  setActiveProject: (project) => set({ activeProject: project }),

  // Selected location/city
  selectedCity: {
    name: "Dhaka",
    country: "Bangladesh",
    coordinates: [90.4125, 23.8103],
    population: "9.4M",
    climate_zone: "Tropical"
  },
  setSelectedCity: (city) => set({ selectedCity: city }),

  // Dashboard view state
  dashboardView: "overview",
  setDashboardView: (view) => set({ dashboardView: view }),

  // Map state
  mapState: {
    selectedLayers: ["temperature"],
    zoomLevel: 10,
    center: [90.4125, 23.8103],
    mode: "view" // "view", "simulate", "analyze"
  },
  updateMapState: (updates) => set((state) => ({
    mapState: { ...state.mapState, ...updates }
  })),

  // Simulation state
  simulation: {
    isRunning: false,
    selectedInterventions: [],
    scenario: "2030",
    results: null
  },
  updateSimulation: (updates) => set((state) => ({
    simulation: { ...state.simulation, ...updates }
  })),

  // Climate data cache
  climateData: {
    temperature: null,
    precipitation: null,
    airQuality: null,
    lastUpdated: null
  },
  updateClimateData: (data) => set((state) => ({
    climateData: { ...state.climateData, ...data, lastUpdated: new Date() }
  })),

  // Notifications
  notifications: [],
  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, { 
      id: Date.now(), 
      timestamp: new Date(),
      ...notification 
    }]
  })),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),

  // Settings
  settings: {
    theme: "light",
    units: "metric",
    language: "en",
    notifications: true,
    autoSave: true
  },
  updateSettings: (updates) => set((state) => ({
    settings: { ...state.settings, ...updates }
  }))
}));
