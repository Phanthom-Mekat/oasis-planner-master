import { useState, useEffect, useCallback } from 'react';

// Generate dummy climate data
function generateDummyClimateData() {
  return {
    temperature: {
      current: 32.5 + Math.random() * 8, // 32-40°C
      humidity: 65 + Math.random() * 20, // 65-85%
      trend: Math.random() > 0.5 ? 'up' : 'down'
    },
    heatIndex: 35 + Math.random() * 10, // 35-45°C
    wind: {
      speed: 8 + Math.random() * 15, // 8-23 km/h
      direction: Math.floor(Math.random() * 360),
      trend: Math.random() > 0.5 ? 'up' : 'down'
    },
    airQuality: {
      aqi: Math.floor(Math.random() * 5) + 1, // 1-5
      pm25: 15 + Math.random() * 50, // 15-65 μg/m³
      trend: Math.random() > 0.5 ? 'up' : 'down'
    },
    uvIndex: Math.floor(Math.random() * 11), // 0-10
    timestamp: new Date()
  };
}

// Hook for real-time climate data using dummy data
export function useClimateData(refreshInterval = 30000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(() => {
    try {
      setError(null);
      setLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        const climateData = generateDummyClimateData();
        setData(climateData);
        setLoading(false);
      }, 500);
      
    } catch (err) {
      setError('Failed to fetch climate data');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh };
}

// Hook for enhanced mapping with dummy data
export function useEnhancedMapping() {
  const [overlayData, setOverlayData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cityData, setCityData] = useState([]);

  const loadLayerData = useCallback((layerType) => {
    setLoading(true);
    setTimeout(() => {
      setOverlayData({
        layerType,
        overlayData: generateLayerData(layerType)
      });
      setLoading(false);
    }, 300);
  }, []);

  const loadCityData = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setCityData([
        { 
          id: 'dhaka', 
          name: 'Dhaka', 
          country: 'Bangladesh',
          lat: 23.8103, lng: 90.4125,
          population: '9.4M',
          temperature: 32.5 + Math.random() * 8,
          aqi: Math.floor(Math.random() * 200) + 50,
          riskLevel: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'critical',
          icon: '🏙️'
        },
        { 
          id: 'mumbai', 
          name: 'Mumbai', 
          country: 'India',
          lat: 19.0760, lng: 72.8777,
          population: '20.4M',
          temperature: 31.8 + Math.random() * 7,
          aqi: Math.floor(Math.random() * 180) + 80,
          riskLevel: Math.random() > 0.5 ? 'high' : 'medium',
          icon: '🌆'
        },
        { 
          id: 'delhi', 
          name: 'Delhi', 
          country: 'India',
          lat: 28.7041, lng: 77.1025,
          population: '32.9M',
          temperature: 33.6 + Math.random() * 9,
          aqi: Math.floor(Math.random() * 250) + 100,
          riskLevel: Math.random() > 0.7 ? 'critical' : 'high',
          icon: '🏛️'
        },
        { 
          id: 'karachi', 
          name: 'Karachi', 
          country: 'Pakistan',
          lat: 24.8607, lng: 67.0011,
          population: '16.1M',
          temperature: 31.1 + Math.random() * 8,
          aqi: Math.floor(Math.random() * 190) + 70,
          riskLevel: Math.random() > 0.6 ? 'high' : 'medium',
          icon: '🏢'
        },
        { 
          id: 'jakarta', 
          name: 'Jakarta', 
          country: 'Indonesia',
          lat: -6.2088, lng: 106.8456,
          population: '10.8M',
          temperature: 29.9 + Math.random() * 6,
          aqi: Math.floor(Math.random() * 160) + 60,
          riskLevel: Math.random() > 0.4 ? 'medium' : 'high',
          icon: '🌴'
        },
        { 
          id: 'manila', 
          name: 'Manila', 
          country: 'Philippines',
          lat: 14.5995, lng: 120.9842,
          population: '14.2M',
          temperature: 30.5 + Math.random() * 7,
          aqi: Math.floor(Math.random() * 170) + 80,
          riskLevel: Math.random() > 0.5 ? 'high' : 'medium',
          icon: '🏝️'
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return { overlayData, cityData, loading, loadLayerData, loadCityData };
}

// Generate layer-specific dummy data
function generateLayerData(layerType) {
  switch (layerType) {
    case 'temperature':
      return Array.from({ length: 8 }, (_, i) => ({
        id: i,
        lat: 20 + Math.random() * 20,
        lng: 70 + Math.random() * 50,
        intensity: Math.random(),
        value: 30 + Math.random() * 15
      }));
    case 'vegetation':
      return Array.from({ length: 6 }, (_, i) => ({
        id: i,
        lat: 15 + Math.random() * 25,
        lng: 65 + Math.random() * 60,
        coverage: 60 + Math.random() * 40
      }));
    case 'flood':
      return Array.from({ length: 5 }, (_, i) => ({
        id: i,
        lat: 18 + Math.random() * 22,
        lng: 68 + Math.random() * 55,
        risk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
      }));
    default:
      return [];
  }
}

// Hook for environmental analysis with dummy data
export function useEnvironmentalAnalysis() {
  const [heatIslands, setHeatIslands] = useState([]);
  const [floodRisk, setFloodRisk] = useState([]);
  const [loading, setLoading] = useState(false);

  const analyzeHeatIslands = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setHeatIslands([
        { id: 1, severity: 'high', location: 'Downtown', temperature: 38.5 },
        { id: 2, severity: 'medium', location: 'Industrial Area', temperature: 36.2 }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const analyzeFloodRisk = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setFloodRisk([
        { id: 1, risk: 'medium', area: 'Riverside', depth: 1.2 },
        { id: 2, risk: 'low', area: 'Hills District', depth: 0.3 }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return { heatIslands, floodRisk, loading, analyzeHeatIslands, analyzeFloodRisk };
}

// Hook for AI insights with dummy data
export function useAIInsights() {
  const [insights, setInsights] = useState({ insights: [] });

  const generateInsights = useCallback((type, data) => {
    setTimeout(() => {
      const newInsight = {
        id: Date.now(),
        type,
        message: `AI analysis for ${type} completed`,
        timestamp: new Date(),
        recommendations: [
          'Consider increasing green cover in high-heat areas',
          'Implement cool pavement solutions',
          'Add more urban trees for natural cooling'
        ]
      };
      
      setInsights(prev => ({
        insights: [newInsight, ...prev.insights.slice(0, 4)]
      }));
    }, 500);
  }, []);

  return { insights, generateInsights };
}
