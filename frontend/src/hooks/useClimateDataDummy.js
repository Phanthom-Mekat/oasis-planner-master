import { useState, useEffect, useCallback } from 'react';
import { generateDummyClimateData } from '@/lib/dummyData';

// Hook for real-time climate data using dummy data
export function useClimateData(refreshInterval = 30000) { // 30 seconds for demo
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

  const loadLayerData = useCallback((layerType) => {
    setLoading(true);
    setTimeout(() => {
      setOverlayData({
        layerType,
        overlayData: [] // Empty for now
      });
      setLoading(false);
    }, 300);
  }, []);

  return { overlayData, loading, loadLayerData };
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
        insights: [newInsight, ...prev.insights.slice(0, 4)] // Keep last 5 insights
      }));
    }, 500);
  }, []);

  return { insights, generateInsights };
}
