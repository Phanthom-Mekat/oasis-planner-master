/**
 * Enhanced hook for real backend integration
 */
"use client";

import { useState, useEffect, useCallback } from 'react';
import { oasisAPI } from '@/lib/oasisAPI';

export function useBackendClimateData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState({ overall: false });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check backend status
      const status = await oasisAPI.checkBackendStatus();
      setBackendStatus(status);

      if (status.overall) {
        // Backend is available, fetch real data
        const dashboardData = await oasisAPI.getDashboardData('dhaka_bd');
        
        setData({
          temperature: {
            current: dashboardData.realTime.temperature.current,
            daily_max: dashboardData.realTime.temperature.daily_max,
            daily_min: dashboardData.realTime.temperature.daily_min,
            humidity: 68,
            trend: 'up'
          },
          heatIndex: dashboardData.realTime.temperature.current + 3,
          wind: {
            speed: 12.5,
            direction: 'SE',
            trend: 'stable'
          },
          airQuality: {
            aqi: dashboardData.realTime.air_quality.aqi,
            pm25: dashboardData.realTime.air_quality.pollutants.pm25,
            trend: 'stable'
          },
          uvIndex: 8,
          analytics: dashboardData.analytics,
          layers: dashboardData.layers,
          timestamp: dashboardData.timestamp
        });
      } else {
        // Backend offline, use mock data
        console.warn('Backend offline, using mock data');
        setData(getMockData());
      }
    } catch (err) {
      console.error('Error fetching climate data:', err);
      setError(err);
      // Fallback to mock data
      setData(getMockData());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    backendStatus,
    refresh: fetchData
  };
}

function getMockData() {
  return {
    temperature: {
      current: 34.5,
      daily_max: 38.2,
      daily_min: 28.1,
      humidity: 68,
      trend: 'up'
    },
    heatIndex: 38.2,
    wind: {
      speed: 12.5,
      direction: 'SE',
      trend: 'stable'
    },
    airQuality: {
      aqi: 3,
      pm25: 78.5,
      trend: 'stable'
    },
    uvIndex: 8,
    timestamp: new Date().toISOString()
  };
}

// AI Query Hook
export function useAIQuery() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const query = useCallback(async (question, cityId = 'dhaka_bd') => {
    setLoading(true);
    setError(null);

    try {
      const response = await oasisAPI.queryAI(question, cityId);
      return response;
    } catch (err) {
      setError(err);
      console.error('AI Query error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { query, loading, error };
}

// Simulation Hook
export function useSimulation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const simulate = useCallback(async (cityId, interventions, years = 10) => {
    setLoading(true);
    setError(null);

    try {
      const response = await oasisAPI.predictImpact(cityId, interventions, years);
      setResult(response);
      return response;
    } catch (err) {
      setError(err);
      console.error('Simulation error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { simulate, result, loading, error };
}
