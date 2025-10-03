"use client";

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Layers, 
  Thermometer, 
  Trees, 
  Waves, 
  Building, 
  Activity,
  Wind,
  Droplets,
  Zap,
  RefreshCw
} from "lucide-react";
import MapControls from "@/components/ui/map-controls";
import MapLoadingStates from "@/components/ui/map-loading-states";
import MapLegend from "@/components/ui/map-legend";
import { useEnhancedMapping } from "@/hooks/useClimateData";

// Import Leaflet dynamically to avoid SSR issues
let L;
if (typeof window !== 'undefined') {
  L = require('leaflet');
  require('leaflet/dist/leaflet.css');
  
  // Fix for default markers
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

const EnhancedLeafletMap = ({ mode = "overview", className = "" }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState("temperature");
  const [mapView, setMapView] = useState('hybrid');
  const [activeOverlays, setActiveOverlays] = useState(new Set(['temperature']));
  const [showRealTime, setShowRealTime] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const { overlayData, loading: overlayLoading, loadLayerData } = useEnhancedMapping();

  // Data layers configuration
  const dataLayers = [
    { 
      id: "temperature", 
      name: "Heat Islands", 
      icon: Thermometer, 
      color: "text-red-500",
      updateFrequency: "15 min"
    },
    { 
      id: "vegetation", 
      name: "Green Cover", 
      icon: Trees, 
      color: "text-green-500",
      updateFrequency: "Weekly"
    },
    { 
      id: "flood", 
      name: "Flood Risk", 
      icon: Waves, 
      color: "text-blue-500",
      updateFrequency: "Hourly"
    },
    { 
      id: "infrastructure", 
      name: "Infrastructure", 
      icon: Building, 
      color: "text-purple-500",
      updateFrequency: "Daily"
    },
    { 
      id: "air_quality", 
      name: "Air Quality", 
      icon: Activity, 
      color: "text-orange-500",
      updateFrequency: "1 min"
    },
    {
      id: "wind_flow",
      name: "Wind Patterns", 
      icon: Wind,
      color: "text-cyan-500",
      updateFrequency: "6 hours"
    },
    {
      id: "precipitation",
      name: "Precipitation",
      icon: Droplets, 
      color: "text-indigo-500",
      updateFrequency: "5 min"
    },
    {
      id: "energy",
      name: "Energy Usage",
      icon: Zap,
      color: "text-yellow-500", 
      updateFrequency: "15 min"
    }
  ];

  // Map view options
  const mapViews = [
    { id: "street", name: "Street" },
    { id: "satellite", name: "Satellite" },
    { id: "hybrid", name: "Hybrid" },
    { id: "terrain", name: "Terrain" }
  ];

  // Initialize map
  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current && !mapInstanceRef.current) {
      // Create a simple interactive map without external dependencies
      const mapContainer = mapRef.current;
      
      // Initialize map instance
      mapInstanceRef.current = {
        container: mapContainer,
        view: mapView,
        layers: new Set(['temperature'])
      };
      
      // Simulate map loading
      setTimeout(() => {
        setMapLoaded(true);
        loadLayerData(selectedLayer);
        
        // Add sample climate data points
        addClimateDataPoints();
      }, 1000);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Major cities data with coordinates and climate info
  const majorCities = [
    { 
      id: 'dhaka', 
      name: 'Dhaka', 
      country: 'Bangladesh',
      x: 45, y: 35, 
      population: '9.4M',
      temperature: 34.2,
      aqi: 165,
      riskLevel: 'high',
      icon: '🏙️'
    },
    { 
      id: 'mumbai', 
      name: 'Mumbai', 
      country: 'India',
      x: 30, y: 50, 
      population: '20.4M',
      temperature: 32.8,
      aqi: 142,
      riskLevel: 'high',
      icon: '🌆'
    },
    { 
      id: 'delhi', 
      name: 'Delhi', 
      country: 'India',
      x: 25, y: 25, 
      population: '32.9M',
      temperature: 35.6,
      aqi: 178,
      riskLevel: 'critical',
      icon: '🏛️'
    },
    { 
      id: 'karachi', 
      name: 'Karachi', 
      country: 'Pakistan',
      x: 15, y: 40, 
      population: '16.1M',
      temperature: 33.1,
      aqi: 156,
      riskLevel: 'high',
      icon: '🏢'
    },
    { 
      id: 'jakarta', 
      name: 'Jakarta', 
      country: 'Indonesia',
      x: 70, y: 75, 
      population: '10.8M',
      temperature: 31.9,
      aqi: 134,
      riskLevel: 'medium',
      icon: '🌴'
    },
    { 
      id: 'manila', 
      name: 'Manila', 
      country: 'Philippines',
      x: 85, y: 60, 
      population: '14.2M',
      temperature: 32.5,
      aqi: 148,
      riskLevel: 'high',
      icon: '🏝️'
    }
  ];

  // Add sample climate data visualization with cities
  const addClimateDataPoints = () => {
    if (!mapRef.current) return;
    
    // Clear existing overlays
    const existingOverlays = mapRef.current.querySelectorAll('.climate-overlay, .city-marker');
    existingOverlays.forEach(overlay => overlay.remove());

    // Add city markers first (so they appear on top)
    addCityMarkers();

    // Add temperature heat islands
    if (activeOverlays.has('temperature')) {
      addTemperatureOverlay();
    }
    
    // Add vegetation coverage
    if (activeOverlays.has('vegetation')) {
      addVegetationOverlay();
    }
    
    // Add flood risk zones
    if (activeOverlays.has('flood')) {
      addFloodOverlay();
    }
    
    // Add air quality indicators
    if (activeOverlays.has('air_quality')) {
      addAirQualityOverlay();
    }

    // Add infrastructure overlay
    if (activeOverlays.has('infrastructure')) {
      addInfrastructureOverlay();
    }

    // Add wind patterns
    if (activeOverlays.has('wind_flow')) {
      addWindOverlay();
    }
  };

  // Add interactive city markers
  const addCityMarkers = () => {
    majorCities.forEach((city, index) => {
      const marker = document.createElement('div');
      marker.className = 'city-marker';
      marker.style.cssText = `
        position: absolute;
        left: ${city.x}%;
        top: ${city.y}%;
        transform: translate(-50%, -50%);
        cursor: pointer;
        z-index: 20;
        transition: all 0.3s ease;
      `;
      
      // Create the marker with pulse animation
      marker.innerHTML = `
        <div class="city-marker-container" style="
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        ">
          <div class="city-pulse" style="
            position: absolute;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(59, 130, 246, 0.3);
            animation: pulse 2s infinite;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          "></div>
          <div class="city-icon" style="
            width: 24px;
            height: 24px;
            background: white;
            border: 3px solid ${city.riskLevel === 'critical' ? '#dc2626' : city.riskLevel === 'high' ? '#ea580c' : '#3b82f6'};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 1;
            position: relative;
          ">${city.icon}</div>
          <div class="city-label" style="
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            margin-top: 8px;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ">${city.name}</div>
        </div>
      `;
      
      // Add click handler for city details
      marker.addEventListener('click', () => {
        showCityPopup(city);
      });

      // Add hover effects
      marker.addEventListener('mouseenter', () => {
        marker.style.transform = 'translate(-50%, -50%) scale(1.1)';
      });

      marker.addEventListener('mouseleave', () => {
        marker.style.transform = 'translate(-50%, -50%) scale(1)';
      });
      
      mapRef.current.appendChild(marker);
    });

    // Add CSS animation for pulse effect
    if (!document.querySelector('#city-animations')) {
      const style = document.createElement('style');
      style.id = 'city-animations';
      style.textContent = `
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0.5;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .climate-overlay {
          animation: float 3s ease-in-out infinite;
        }
        .temperature-overlay {
          animation: float 3s ease-in-out infinite, temperature-pulse 2s ease-in-out infinite alternate;
        }
        @keyframes temperature-pulse {
          0% { opacity: 0.6; }
          100% { opacity: 0.9; }
        }
      `;
      document.head.appendChild(style);
    }
  };

  // Show detailed city popup
  const showCityPopup = (city) => {
    // Remove existing popup
    const existingPopup = document.querySelector('.city-popup');
    if (existingPopup) existingPopup.remove();

    // Create popup
    const popup = document.createElement('div');
    popup.className = 'city-popup';
    popup.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      z-index: 1000;
      min-width: 400px;
      max-width: 500px;
    `;

    const riskColor = city.riskLevel === 'critical' ? '#dc2626' : city.riskLevel === 'high' ? '#ea580c' : '#16a34a';
    const riskBg = city.riskLevel === 'critical' ? '#fef2f2' : city.riskLevel === 'high' ? '#fff7ed' : '#f0fdf4';

    popup.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
        <div style="
          width: 48px;
          height: 48px;
          background: ${riskBg};
          border: 2px solid ${riskColor};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        ">${city.icon}</div>
        <div>
          <h2 style="margin: 0; font-size: 24px; font-weight: 700; color: #1f2937;">${city.name}</h2>
          <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">${city.country} • Population: ${city.population}</p>
        </div>
        <button onclick="this.closest('.city-popup').remove()" style="
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #9ca3af;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        ">×</button>
      </div>
      
      <div style="background: #f9fafb; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div style="text-align: center;">
            <div style="font-size: 28px; font-weight: 700; color: #dc2626;">${city.temperature}°C</div>
            <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Temperature</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 28px; font-weight: 700; color: #ea580c;">${city.aqi}</div>
            <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Air Quality Index</div>
          </div>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
        <div style="
          padding: 4px 12px;
          background: ${riskBg};
          color: ${riskColor};
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        ">${city.riskLevel} Risk</div>
        <div style="font-size: 12px; color: #6b7280;">Climate Impact Level</div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 14px;">
        <div>
          <div style="color: #6b7280; margin-bottom: 4px;">Heat Islands</div>
          <div style="font-weight: 600;">15 active zones</div>
        </div>
        <div>
          <div style="color: #6b7280; margin-bottom: 4px;">Flood Risk</div>
          <div style="font-weight: 600;">${city.riskLevel === 'critical' ? 'Very High' : city.riskLevel === 'high' ? 'High' : 'Moderate'}</div>
        </div>
        <div>
          <div style="color: #6b7280; margin-bottom: 4px;">Green Cover</div>
          <div style="font-weight: 600;">${Math.floor(Math.random() * 30 + 15)}%</div>
        </div>
        <div>
          <div style="color: #6b7280; margin-bottom: 4px;">Last Updated</div>
          <div style="font-weight: 600;">2 min ago</div>
        </div>
      </div>

      <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
        <button style="
          width: 100%;
          background: #3b82f6;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
        " onclick="alert('Opening detailed analytics for ${city.name}...')">
          View Detailed Analytics
        </button>
      </div>
    `;

    document.body.appendChild(popup);

    // Add click outside to close
    setTimeout(() => {
      const closeOnClickOutside = (e) => {
        if (!popup.contains(e.target)) {
          popup.remove();
          document.removeEventListener('click', closeOnClickOutside);
        }
      };
      document.addEventListener('click', closeOnClickOutside);
    }, 100);
  };

  const addTemperatureOverlay = () => {
    const tempPoints = [
      { x: 20, y: 15, temp: 38.5, size: 80, intensity: 0.9 },
      { x: 60, y: 30, temp: 35.2, size: 60, intensity: 0.7 },
      { x: 80, y: 60, temp: 41.3, size: 100, intensity: 1.0 },
      { x: 30, y: 70, temp: 34.8, size: 50, intensity: 0.6 }
    ];

    tempPoints.forEach((point, index) => {
      const overlay = document.createElement('div');
      overlay.className = 'climate-overlay temperature-overlay';
      overlay.style.cssText = `
        position: absolute;
        left: ${point.x}%;
        top: ${point.y}%;
        width: ${point.size}px;
        height: ${point.size}px;
        border-radius: 50%;
        background: radial-gradient(circle, 
          rgba(239, 68, 68, ${point.intensity * 0.6}) 0%, 
          rgba(245, 158, 11, ${point.intensity * 0.4}) 50%, 
          rgba(245, 158, 11, 0.1) 100%);
        transform: translate(-50%, -50%);
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 10;
      `;
      
      // Add tooltip
      overlay.title = `Heat Island: ${point.temp}°C`;
      
      // Add click handler
      overlay.addEventListener('click', () => {
        showDataPopup(point, 'temperature');
      });
      
      mapRef.current.appendChild(overlay);
    });
  };

  const addVegetationOverlay = () => {
    const vegAreas = [
      { x: 15, y: 20, coverage: 85, width: 120, height: 80 },
      { x: 70, y: 15, coverage: 92, width: 100, height: 60 },
      { x: 25, y: 80, coverage: 78, width: 90, height: 70 },
      { x: 85, y: 75, coverage: 88, width: 80, height: 50 }
    ];

    vegAreas.forEach((area, index) => {
      const overlay = document.createElement('div');
      overlay.className = 'climate-overlay vegetation-overlay';
      overlay.style.cssText = `
        position: absolute;
        left: ${area.x}%;
        top: ${area.y}%;
        width: ${area.width}px;
        height: ${area.height}px;
        border-radius: 20px;
        background: linear-gradient(45deg, 
          rgba(34, 197, 94, ${area.coverage / 150}) 0%, 
          rgba(101, 163, 13, ${area.coverage / 200}) 100%);
        transform: translate(-50%, -50%);
        cursor: pointer;
        border: 2px solid rgba(34, 197, 94, 0.5);
        z-index: 8;
      `;
      
      overlay.title = `Green Cover: ${area.coverage}%`;
      overlay.addEventListener('click', () => {
        showDataPopup(area, 'vegetation');
      });
      
      mapRef.current.appendChild(overlay);
    });
  };

  const addFloodOverlay = () => {
    const floodZones = [
      { x: 45, y: 85, risk: 'high', width: 150, height: 40 },
      { x: 20, y: 50, risk: 'medium', width: 80, height: 60 },
      { x: 75, y: 40, risk: 'low', width: 60, height: 30 }
    ];

    floodZones.forEach((zone, index) => {
      const overlay = document.createElement('div');
      overlay.className = 'climate-overlay flood-overlay';
      const opacity = zone.risk === 'high' ? 0.7 : zone.risk === 'medium' ? 0.5 : 0.3;
      overlay.style.cssText = `
        position: absolute;
        left: ${zone.x}%;
        top: ${zone.y}%;
        width: ${zone.width}px;
        height: ${zone.height}px;
        border-radius: 15px;
        background: rgba(59, 130, 246, ${opacity});
        transform: translate(-50%, -50%);
        cursor: pointer;
        border: 2px dashed rgba(59, 130, 246, 0.8);
        z-index: 9;
      `;
      
      overlay.title = `Flood Risk: ${zone.risk.toUpperCase()}`;
      overlay.addEventListener('click', () => {
        showDataPopup(zone, 'flood');
      });
      
      mapRef.current.appendChild(overlay);
    });
  };

  const addAirQualityOverlay = () => {
    const aqiPoints = [
      { x: 40, y: 25, aqi: 150, category: 'Poor' },
      { x: 65, y: 55, aqi: 95, category: 'Moderate' },
      { x: 25, y: 65, aqi: 45, category: 'Good' },
      { x: 80, y: 30, aqi: 180, category: 'Very Poor' }
    ];

    aqiPoints.forEach((point, index) => {
      const overlay = document.createElement('div');
      overlay.className = 'climate-overlay aqi-overlay';
      const color = point.aqi > 150 ? '#dc2626' : point.aqi > 100 ? '#ea580c' : point.aqi > 50 ? '#ca8a04' : '#16a34a';
      overlay.style.cssText = `
        position: absolute;
        left: ${point.x}%;
        top: ${point.y}%;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: ${color};
        transform: translate(-50%, -50%);
        cursor: pointer;
        border: 3px solid white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        z-index: 12;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 10px;
        font-weight: bold;
      `;
      
      overlay.textContent = point.aqi;
      overlay.title = `Air Quality: ${point.category} (AQI: ${point.aqi})`;
      overlay.addEventListener('click', () => {
        showDataPopup(point, 'air_quality');
      });
      
      mapRef.current.appendChild(overlay);
    });
  };

  const addInfrastructureOverlay = () => {
    const infrastructurePoints = [
      { x: 35, y: 20, type: 'Hospital', name: 'Central Medical Center', status: 'operational' },
      { x: 55, y: 45, type: 'School', name: 'International School', status: 'operational' },
      { x: 70, y: 25, type: 'Power Plant', name: 'Energy Station', status: 'critical' },
      { x: 20, y: 60, type: 'Water Treatment', name: 'Water Facility', status: 'maintenance' },
      { x: 85, y: 70, type: 'Transportation', name: 'Metro Hub', status: 'operational' }
    ];

    infrastructurePoints.forEach((point, index) => {
      const overlay = document.createElement('div');
      overlay.className = 'climate-overlay infrastructure-overlay';
      const statusColor = point.status === 'critical' ? '#dc2626' : point.status === 'maintenance' ? '#ea580c' : '#16a34a';
      const icon = point.type === 'Hospital' ? '🏥' : point.type === 'School' ? '🏫' : point.type === 'Power Plant' ? '⚡' : point.type === 'Water Treatment' ? '💧' : '🚇';
      
      overlay.style.cssText = `
        position: absolute;
        left: ${point.x}%;
        top: ${point.y}%;
        width: 32px;
        height: 32px;
        background: white;
        border: 2px solid ${statusColor};
        border-radius: 8px;
        transform: translate(-50%, -50%);
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 11;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
      `;
      
      overlay.textContent = icon;
      overlay.title = `${point.type}: ${point.name} (${point.status})`;
      overlay.addEventListener('click', () => {
        showDataPopup(point, 'infrastructure');
      });
      
      mapRef.current.appendChild(overlay);
    });
  };

  const addWindOverlay = () => {
    const windVectors = [
      { x: 30, y: 30, direction: 45, speed: 12 },
      { x: 60, y: 40, direction: 90, speed: 8 },
      { x: 45, y: 65, direction: 180, speed: 15 },
      { x: 75, y: 50, direction: 270, speed: 10 }
    ];

    windVectors.forEach((wind, index) => {
      const overlay = document.createElement('div');
      overlay.className = 'climate-overlay wind-overlay';
      overlay.style.cssText = `
        position: absolute;
        left: ${wind.x}%;
        top: ${wind.y}%;
        width: 40px;
        height: 40px;
        transform: translate(-50%, -50%) rotate(${wind.direction}deg);
        cursor: pointer;
        z-index: 10;
        pointer-events: none;
      `;
      
      overlay.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 40 40">
          <defs>
            <marker id="arrowhead-${index}" markerWidth="6" markerHeight="4" 
                    refX="6" refY="2" orient="auto">
              <polygon points="0 0, 6 2, 0 4" fill="#06b6d4" />
            </marker>
          </defs>
          <line x1="20" y1="30" x2="20" y2="10" 
                stroke="#06b6d4" stroke-width="2" 
                marker-end="url(#arrowhead-${index})" />
          <text x="22" y="25" font-size="8" fill="#06b6d4" font-weight="bold">${wind.speed}</text>
        </svg>
      `;
      
      overlay.title = `Wind: ${wind.speed} km/h, ${wind.direction}°`;
      
      mapRef.current.appendChild(overlay);
    });
  };

  const showDataPopup = (data, type) => {
    // Remove existing popup
    const existingPopup = document.querySelector('.climate-popup');
    if (existingPopup) existingPopup.remove();

    // Create popup
    const popup = document.createElement('div');
    popup.className = 'climate-popup';
    popup.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      min-width: 300px;
    `;

    let content = '';
    switch (type) {
      case 'temperature':
        content = `
          <h3 style="margin: 0 0 10px 0; color: #dc2626;">🌡️ Heat Island Data</h3>
          <p><strong>Temperature:</strong> ${data.temp}°C</p>
          <p><strong>Intensity:</strong> ${Math.round(data.intensity * 100)}%</p>
          <p><strong>Status:</strong> ${data.temp > 38 ? 'Critical' : 'Elevated'}</p>
        `;
        break;
      case 'vegetation':
        content = `
          <h3 style="margin: 0 0 10px 0; color: #16a34a;">🌳 Vegetation Coverage</h3>
          <p><strong>Green Cover:</strong> ${data.coverage}%</p>
          <p><strong>Health:</strong> ${data.coverage > 85 ? 'Excellent' : 'Good'}</p>
        `;
        break;
      case 'flood':
        content = `
          <h3 style="margin: 0 0 10px 0; color: #2563eb;">🌊 Flood Risk Zone</h3>
          <p><strong>Risk Level:</strong> ${data.risk.toUpperCase()}</p>
          <p><strong>Zone Type:</strong> ${data.risk === 'high' ? 'Critical Area' : 'Monitored Zone'}</p>
        `;
        break;
      case 'air_quality':
        content = `
          <h3 style="margin: 0 0 10px 0; color: #ea580c;">💨 Air Quality Station</h3>
          <p><strong>AQI:</strong> ${data.aqi}</p>
          <p><strong>Category:</strong> ${data.category}</p>
          <p><strong>Health Impact:</strong> ${data.aqi > 150 ? 'Unhealthy' : data.aqi > 100 ? 'Moderate' : 'Good'}</p>
        `;
        break;
      case 'infrastructure':
        const statusColor = data.status === 'critical' ? '#dc2626' : data.status === 'maintenance' ? '#ea580c' : '#16a34a';
        content = `
          <h3 style="margin: 0 0 10px 0; color: ${statusColor};">🏗️ Infrastructure</h3>
          <p><strong>Type:</strong> ${data.type}</p>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${data.status.toUpperCase()}</span></p>
          <p><strong>Climate Resilience:</strong> ${data.status === 'critical' ? 'Needs Attention' : 'Good'}</p>
        `;
        break;
    }

    popup.innerHTML = `
      ${content}
      <button onclick="this.parentElement.remove()" style="
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
      ">×</button>
    `;

    document.body.appendChild(popup);
  };

  // Update overlays when active layers change
  useEffect(() => {
    if (mapLoaded) {
      addClimateDataPoints();
    }
  }, [activeOverlays, mapLoaded]);

  const refreshData = () => {
    loadLayerData(selectedLayer);
    setLastUpdated(new Date());
  };

  const toggleOverlay = (layerId) => {
    const newActiveOverlays = new Set(activeOverlays);
    if (newActiveOverlays.has(layerId)) {
      newActiveOverlays.delete(layerId);
    } else {
      newActiveOverlays.add(layerId);
    }
    setActiveOverlays(newActiveOverlays);
  };

  // Centerpiece mode render
  if (mode === "centerpiece") {
    return (
      <div className={`relative w-full h-full ${className}`}>
        <MapControls
          mapViews={mapViews}
          mapView={mapView}
          setMapView={setMapView}
          dataLayers={dataLayers}
          activeOverlays={activeOverlays}
          toggleOverlay={toggleOverlay}
          showRealTime={showRealTime}
          setShowRealTime={setShowRealTime}
          lastUpdated={lastUpdated}
          refreshData={refreshData}
          overlayLoading={overlayLoading}
          isFullscreen={isFullscreen}
          setIsFullscreen={setIsFullscreen}
        />

        <div 
          ref={mapRef}
          className="w-full h-full rounded-lg overflow-hidden"
          style={{ minHeight: '600px' }}
        >
          <MapLoadingStates mapLoaded={mapLoaded} mapError={mapError} />
          {mapLoaded && (
            <div className="w-full h-full relative overflow-hidden">
              {/* Base Map Background */}
              <div className="absolute inset-0" style={{
                backgroundImage: mapView === 'satellite' 
                  ? `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='8'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"), linear-gradient(45deg, #1f2937 0%, #374151 100%)`
                  : mapView === 'terrain'
                  ? `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23065f46' fill-opacity='0.2'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20v20h40V20c0-11.046-8.954-20-20-20z'/%3E%3C/g%3E%3C/svg%3E"), linear-gradient(135deg, #d4b896 0%, #8fbc8f 100%)`
                  : `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.4'%3E%3Cpath d='M0 0h20v20H0z'/%3E%3C/g%3E%3C/svg%3E"), linear-gradient(to bottom, #f8fafc 0%, #e2e8f0 100%)`,
                backgroundSize: mapView === 'satellite' ? '60px 60px' : mapView === 'terrain' ? '40px 40px' : '20px 20px'
              }}>
                
                {/* Grid Lines for Street View */}
                {mapView === 'street' && (
                  <>
                    {/* Major roads */}
                    <div className="absolute top-1/4 left-0 right-0 h-2 bg-gray-400 opacity-40" />
                    <div className="absolute top-3/4 left-0 right-0 h-1 bg-gray-400 opacity-30" />
                    <div className="absolute left-1/3 top-0 bottom-0 w-1 bg-gray-400 opacity-30" />
                    <div className="absolute left-2/3 top-0 bottom-0 w-2 bg-gray-400 opacity-40" />
                    
                    {/* Secondary streets */}
                    {Array.from({ length: 8 }, (_, i) => (
                      <div key={`street-h-${i}`} className="absolute left-0 right-0 border-t border-gray-300 opacity-20" 
                           style={{ top: `${i * 12.5}%` }} />
                    ))}
                    {Array.from({ length: 10 }, (_, i) => (
                      <div key={`street-v-${i}`} className="absolute top-0 bottom-0 border-l border-gray-300 opacity-20" 
                           style={{ left: `${i * 10}%` }} />
                    ))}

                    {/* Building blocks */}
                    <div className="absolute top-10 left-10 w-20 h-16 bg-gray-300 opacity-25 rounded" />
                    <div className="absolute top-32 right-20 w-16 h-20 bg-gray-400 opacity-30 rounded" />
                    <div className="absolute bottom-24 left-1/4 w-24 h-18 bg-gray-350 opacity-25 rounded" />
                    <div className="absolute top-20 left-1/2 w-18 h-22 bg-gray-400 opacity-30 rounded" />
                  </>
                )}

                {/* Enhanced Terrain features */}
                {mapView === 'terrain' && (
                  <>
                    {/* Mountains/Hills */}
                    <div className="absolute top-8 left-8 w-40 h-24 bg-green-400 opacity-35 rounded-full transform rotate-12" />
                    <div className="absolute top-16 left-32 w-28 h-20 bg-green-500 opacity-30 rounded-full transform -rotate-6" />
                    <div className="absolute top-40 right-16 w-32 h-18 bg-green-600 opacity-25 rounded-full" />
                    
                    {/* Water bodies */}
                    <div className="absolute bottom-20 left-1/4 w-48 h-16 bg-blue-300 opacity-50 rounded-full" />
                    <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-blue-400 opacity-45 rounded-full" />
                    
                    {/* Forest areas */}
                    <div className="absolute top-24 left-1/2 w-36 h-28 bg-green-700 opacity-30 rounded-lg transform rotate-3" />
                    <div className="absolute bottom-32 right-12 w-28 h-20 bg-green-600 opacity-25 rounded-lg transform -rotate-12" />
                  </>
                )}

                {/* Enhanced Satellite View */}
                {mapView === 'satellite' && (
                  <>
                    {/* Urban sprawl */}
                    <div className="absolute top-16 left-16 w-20 h-20 bg-gray-600 opacity-50 rounded" />
                    <div className="absolute top-20 left-40 w-16 h-24 bg-gray-700 opacity-45 rounded" />
                    <div className="absolute top-44 right-28 w-18 h-16 bg-gray-500 opacity-40 rounded" />
                    <div className="absolute bottom-28 left-1/3 w-24 h-16 bg-gray-600 opacity-45 rounded" />
                    
                    {/* Industrial areas */}
                    <div className="absolute top-1/2 left-12 w-32 h-12 bg-gray-800 opacity-50 rounded-sm" />
                    <div className="absolute bottom-20 right-16 w-28 h-20 bg-gray-700 opacity-45 rounded-sm" />
                    
                    {/* Agricultural patches */}
                    <div className="absolute top-20 right-20 w-24 h-32 bg-yellow-600 opacity-30 rounded-sm transform rotate-6" />
                    <div className="absolute bottom-40 left-8 w-36 h-24 bg-green-600 opacity-30 rounded-sm transform -rotate-3" />
                  </>
                )}

                {/* Enhanced overlays based on hybrid mode */}
                {mapView === 'hybrid' && (
                  <>
                    {/* Combine street and satellite elements */}
                    <div className="absolute top-1/4 left-0 right-0 h-2 bg-yellow-400 opacity-40" />
                    <div className="absolute left-1/3 top-0 bottom-0 w-1 bg-yellow-400 opacity-40" />
                    <div className="absolute top-20 left-20 w-16 h-16 bg-gray-500 opacity-40 rounded" />
                    <div className="absolute bottom-32 right-24 w-20 h-12 bg-green-500 opacity-30 rounded" />
                  </>
                )}

                {/* Enhanced geographic labels */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 px-4 py-2 rounded-full text-sm font-semibold text-gray-800 shadow-lg border">
                  <span className="text-blue-600">📍</span> South Asian Climate Region
                </div>

                {/* Enhanced compass with more details */}
                <div className="absolute top-4 right-4 bg-white/90 rounded-full p-2 shadow-lg border">
                  <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center relative">
                    <div className="absolute top-1 text-xs font-bold text-red-600">N</div>
                    <div className="absolute bottom-1 text-xs text-gray-400">S</div>
                    <div className="absolute left-1 text-xs text-gray-400">W</div>
                    <div className="absolute right-1 text-xs text-gray-400">E</div>
                    <div className="w-1 h-3 bg-red-600 rounded-full"></div>
                  </div>
                </div>

                {/* Enhanced scale with metric */}
                <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-2 rounded-lg text-xs text-gray-700 shadow-lg border">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-8 bg-gray-600"></div>
                    <span className="font-medium">2 km</span>
                  </div>
                  <div className="text-gray-500 text-xs mt-1">Scale 1:50,000</div>
                </div>

                {/* Weather overlay indicator */}
                <div className="absolute top-4 left-4 bg-white/90 px-3 py-2 rounded-lg text-xs shadow-lg border">
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500">🌡️</span>
                    <span className="font-medium">34°C</span>
                  </div>
                  <div className="text-gray-500">Partly Cloudy</div>
                </div>

                {/* Real-time data indicator */}
                {showRealTime && (
                  <div className="absolute bottom-4 right-4 bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                    <span className="inline-block w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                    LIVE DATA
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {mapLoaded && (
          <MapLegend activeOverlays={activeOverlays} dataLayers={dataLayers} />
        )}
      </div>
    );
  }

  // Card mode render
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Enhanced Climate Map
            </CardTitle>
            <CardDescription>
              Real-time climate data visualization with satellite imagery
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={overlayLoading}
          >
            <RefreshCw className={`h-4 w-4 ${overlayLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Layer Selection */}
          <div className="flex flex-wrap gap-2">
            {dataLayers.map((layer) => (
              <Button
                key={layer.id}
                variant={selectedLayer === layer.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLayer(layer.id)}
                className="flex items-center gap-1"
              >
                <layer.icon className={`h-4 w-4 ${layer.color}`} />
                <span className="hidden sm:inline">{layer.name}</span>
              </Button>
            ))}
          </div>

          {/* Map Container */}
          <div className="relative">
            <div 
              ref={mapRef}
              className="w-full h-96 rounded-lg overflow-hidden border"
              style={{ minHeight: '400px' }}
            >
              <MapLoadingStates mapLoaded={mapLoaded} mapError={mapError} />
              {mapLoaded && (
                <div className="w-full h-full relative overflow-hidden">
                  {/* Base Map Background - Simplified for card view */}
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.4'%3E%3Cpath d='M0 0h20v20H0z'/%3E%3C/g%3E%3C/svg%3E"), linear-gradient(to bottom, #f8fafc 0%, #e2e8f0 100%)`,
                    backgroundSize: '20px 20px'
                  }}>
                    
                    {/* Simple grid */}
                    {Array.from({ length: 6 }, (_, i) => (
                      <div key={`v-${i}`} className="absolute top-0 bottom-0 border-l border-gray-200 opacity-20" 
                           style={{ left: `${i * 16.67}%` }} />
                    ))}
                    {Array.from({ length: 5 }, (_, i) => (
                      <div key={`h-${i}`} className="absolute left-0 right-0 border-t border-gray-200 opacity-20" 
                           style={{ top: `${i * 20}%` }} />
                    ))}

                    {/* City center indicator */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full shadow-lg" />
                    
                    {/* Layer indicator */}
                    <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium">
                      {dataLayers.find(l => l.id === selectedLayer)?.name}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedLeafletMap;
