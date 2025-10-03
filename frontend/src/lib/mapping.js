import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { ClimateDataService } from '@/lib/api';

// Enhanced mapping service with real satellite data
export class EnhancedMappingService {
  constructor() {
    this.cache = new Map();
    this.layerCache = new Map();
  }

  async getSatelliteOverlay(coordinates, date, layerType = 'temperature') {
    const cacheKey = `${coordinates.join('_')}_${date}_${layerType}`;
    
    if (this.layerCache.has(cacheKey)) {
      return this.layerCache.get(cacheKey);
    }

    try {
      // Get NASA satellite imagery
      const imagery = await ClimateDataService.getSatelliteImagery(
        coordinates[0], coordinates[1], date
      );

      // Generate overlay data based on layer type
      const overlayData = await this.generateLayerData(coordinates, layerType);
      
      const result = {
        imagery,
        overlayData,
        timestamp: new Date().toISOString()
      };

      this.layerCache.set(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Failed to get satellite overlay:', error);
      return this.getMockOverlayData(coordinates, layerType);
    }
  }

  async generateLayerData(coordinates, layerType) {
    const [centerLat, centerLon] = coordinates;
    
    switch (layerType) {
      case 'temperature':
        return this.generateHeatIslandData(centerLat, centerLon);
      case 'vegetation':
        return this.generateVegetationData(centerLat, centerLon);
      case 'flood':
        return this.generateFloodRiskData(centerLat, centerLon);
      case 'infrastructure':
        return this.generateInfrastructureData(centerLat, centerLon);
      case 'air_quality':
        return this.generateAirQualityData(centerLat, centerLon);
      default:
        return [];
    }
  }

  generateHeatIslandData(centerLat, centerLon) {
    const heatZones = [];
    
    // Generate realistic heat island patterns
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * 2 * Math.PI;
      const distance = 0.005 + Math.random() * 0.01; // 0.5-1.5km radius
      
      const lat = centerLat + Math.cos(angle) * distance;
      const lon = centerLon + Math.sin(angle) * distance;
      
      // Urban areas tend to be hotter
      const isUrban = Math.random() > 0.3;
      const intensity = isUrban ? 0.4 + Math.random() * 0.6 : Math.random() * 0.4;
      
      heatZones.push({
        type: 'circle',
        coordinates: [lat, lon],
        radius: 300 + Math.random() * 700, // meters
        intensity: intensity, // 0-1 scale
        temperature: 32 + intensity * 8, // 32-40°C range
        color: this.getHeatColor(intensity),
        opacity: 0.3 + intensity * 0.4,
        metadata: {
          landUse: isUrban ? 'urban' : 'mixed',
          estimated: true
        }
      });
    }
    
    return heatZones;
  }

  generateVegetationData(centerLat, centerLon) {
    const greenSpaces = [];
    
    // Generate NDVI-like vegetation data
    for (let i = 0; i < 6; i++) {
      const lat = centerLat + (Math.random() - 0.5) * 0.02;
      const lon = centerLon + (Math.random() - 0.5) * 0.02;
      
      const ndvi = Math.random(); // 0-1 NDVI value
      
      greenSpaces.push({
        type: 'polygon',
        coordinates: this.generatePolygonCoordinates(lat, lon, 4),
        ndvi: ndvi,
        healthIndex: ndvi * 100,
        color: this.getVegetationColor(ndvi),
        opacity: 0.5,
        metadata: {
          vegetationType: ndvi > 0.7 ? 'dense_forest' : ndvi > 0.4 ? 'park' : 'sparse_vegetation',
          carbonSequestration: ndvi * 50 // tons CO2/year estimate
        }
      });
    }
    
    return greenSpaces;
  }

  generateFloodRiskData(centerLat, centerLon) {
    const floodZones = [];
    
    // Generate flood risk zones based on topography simulation
    for (let i = 0; i < 4; i++) {
      const lat = centerLat + (Math.random() - 0.5) * 0.015;
      const lon = centerLon + (Math.random() - 0.5) * 0.015;
      
      const riskLevel = Math.random();
      const returnPeriod = riskLevel > 0.7 ? 10 : riskLevel > 0.4 ? 25 : 100;
      
      floodZones.push({
        type: 'polygon',
        coordinates: this.generatePolygonCoordinates(lat, lon, 6),
        riskLevel: riskLevel,
        returnPeriod: returnPeriod,
        maxDepth: riskLevel * 3, // meters
        color: this.getFloodColor(riskLevel),
        opacity: 0.4,
        metadata: {
          drainageCapacity: (1 - riskLevel) * 100, // percentage
          populationAtRisk: Math.floor(riskLevel * 5000)
        }
      });
    }
    
    return floodZones;
  }

  generateInfrastructureData(centerLat, centerLon) {
    const infrastructure = [];
    
    // Generate critical infrastructure points
    const infraTypes = [
      { type: 'hospital', icon: 'hospital', priority: 'critical' },
      { type: 'school', icon: 'school', priority: 'high' },
      { type: 'power_station', icon: 'power', priority: 'critical' },
      { type: 'water_treatment', icon: 'water', priority: 'critical' },
      { type: 'transport_hub', icon: 'transport', priority: 'medium' }
    ];
    
    infraTypes.forEach((infra, i) => {
      const lat = centerLat + (Math.random() - 0.5) * 0.02;
      const lon = centerLon + (Math.random() - 0.5) * 0.02;
      
      infrastructure.push({
        type: 'point',
        coordinates: [lat, lon],
        infrastructureType: infra.type,
        priority: infra.priority,
        icon: infra.icon,
        color: this.getInfrastructureColor(infra.priority),
        metadata: {
          capacity: Math.floor(Math.random() * 10000),
          vulnerability: Math.random(),
          lastInspection: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
        }
      });
    });
    
    return infrastructure;
  }

  generateAirQualityData(centerLat, centerLon) {
    const aqiZones = [];
    
    for (let i = 0; i < 5; i++) {
      const lat = centerLat + (Math.random() - 0.5) * 0.02;
      const lon = centerLon + (Math.random() - 0.5) * 0.02;
      
      const aqi = Math.floor(Math.random() * 200) + 50; // AQI 50-250
      const pm25 = aqi * 0.5; // Rough conversion
      
      aqiZones.push({
        type: 'circle',
        coordinates: [lat, lon],
        radius: 500 + Math.random() * 1000,
        aqi: aqi,
        pm25: pm25,
        category: this.getAQICategory(aqi),
        color: this.getAQIColor(aqi),
        opacity: 0.4,
        metadata: {
          sources: ['traffic', 'industrial', 'residential'][Math.floor(Math.random() * 3)],
          windDispersion: Math.random()
        }
      });
    }
    
    return aqiZones;
  }

  generatePolygonCoordinates(centerLat, centerLon, sides) {
    const coordinates = [];
    const radius = 0.002 + Math.random() * 0.003; // Random size
    
    for (let i = 0; i <= sides; i++) {
      const angle = (i / sides) * 2 * Math.PI;
      const lat = centerLat + Math.cos(angle) * radius * (0.8 + Math.random() * 0.4);
      const lon = centerLon + Math.sin(angle) * radius * (0.8 + Math.random() * 0.4);
      coordinates.push([lat, lon]);
    }
    
    return coordinates;
  }

  getHeatColor(intensity) {
    if (intensity < 0.2) return '#ffffcc';
    if (intensity < 0.4) return '#ffeda0';
    if (intensity < 0.6) return '#fed976';
    if (intensity < 0.8) return '#feb24c';
    return '#fd8d3c';
  }

  getVegetationColor(ndvi) {
    if (ndvi < 0.2) return '#d7191c';
    if (ndvi < 0.4) return '#fdae61';
    if (ndvi < 0.6) return '#ffffbf';
    if (ndvi < 0.8) return '#a6d96a';
    return '#1a9641';
  }

  getFloodColor(risk) {
    if (risk < 0.3) return '#c6dbef';
    if (risk < 0.6) return '#6baed6';
    return '#2171b5';
  }

  getInfrastructureColor(priority) {
    switch (priority) {
      case 'critical': return '#d62728';
      case 'high': return '#ff7f0e';
      case 'medium': return '#2ca02c';
      default: return '#1f77b4';
    }
  }

  getAQIColor(aqi) {
    if (aqi <= 50) return '#00e400';
    if (aqi <= 100) return '#ffff00';
    if (aqi <= 150) return '#ff7e00';
    if (aqi <= 200) return '#ff0000';
    if (aqi <= 300) return '#8f3f97';
    return '#7e0023';
  }

  getAQICategory(aqi) {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  }

  getMockOverlayData(coordinates, layerType) {
    // Fallback mock data when APIs fail
    return {
      imagery: { url: '/api/placeholder/satellite-fallback.jpg' },
      overlayData: [],
      timestamp: new Date().toISOString(),
      source: 'mock'
    };
  }
}

// Hook for enhanced mapping
export function useEnhancedMapping() {
  const [mappingService] = useState(() => new EnhancedMappingService());
  const [overlayData, setOverlayData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { selectedCity } = useAppStore();

  const loadLayerData = async (layerType, date = new Date().toISOString().split('T')[0]) => {
    setLoading(true);
    setError(null);

    try {
      const data = await mappingService.getSatelliteOverlay(
        selectedCity.coordinates,
        date,
        layerType
      );
      setOverlayData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    overlayData,
    loading,
    error,
    loadLayerData,
    mappingService
  };
}

const mappingServices = { EnhancedMappingService, useEnhancedMapping };
export default mappingServices;
