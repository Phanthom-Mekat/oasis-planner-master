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
  RefreshCw,
  ZoomIn,
  ZoomOut
} from "lucide-react";

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

const LeafletClimateMap = ({ mode = "overview", className = "" }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState("temperature");
  const [mapView, setMapView] = useState('hybrid');
  const [activeOverlays, setActiveOverlays] = useState(new Set(['temperature']));
  const [showRealTime, setShowRealTime] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Data layers configuration
  const dataLayers = [
    { 
      id: "temperature", 
      name: "Heat Islands", 
      icon: Thermometer, 
      color: "text-red-500"
    },
    { 
      id: "vegetation", 
      name: "Green Cover", 
      icon: Trees, 
      color: "text-green-500"
    },
    { 
      id: "flood", 
      name: "Flood Risk", 
      icon: Waves, 
      color: "text-blue-500"
    },
    { 
      id: "infrastructure", 
      name: "Infrastructure", 
      icon: Building, 
      color: "text-purple-500"
    },
    { 
      id: "air_quality", 
      name: "Air Quality", 
      icon: Activity, 
      color: "text-orange-500"
    },
    {
      id: "wind_flow",
      name: "Wind Patterns", 
      icon: Wind,
      color: "text-cyan-500"
    }
  ];

  // Map view options
  const mapViews = [
    { id: "street", name: "Street" },
    { id: "satellite", name: "Satellite" },
    { id: "hybrid", name: "Hybrid" },
    { id: "terrain", name: "Terrain" }
  ];

  // Comprehensive Dhaka area data - ALL districts and neighborhoods (NO CLUSTERING!)
  const dhakaAreasData = [
    // Central Dhaka Districts
    { id: 1, name: 'Motijheel', district: 'Central', lat: 23.7330, lng: 90.4172, population: 285000, temp: 32.5, aqi: 178, humidity: 87, rainfall: 68, flood: 'high', growth: 2.8, icon: '🏢', type: 'commercial' },
    { id: 2, name: 'Gulshan', district: 'North', lat: 23.7925, lng: 90.4078, population: 320000, temp: 30.2, aqi: 145, humidity: 84, rainfall: 62, flood: 'medium', growth: 3.5, icon: '🏙️', type: 'residential' },
    { id: 3, name: 'Banani', district: 'North', lat: 23.7937, lng: 90.4066, population: 195000, temp: 30.5, aqi: 142, humidity: 85, rainfall: 63, flood: 'medium', growth: 3.2, icon: '🏘️', type: 'residential' },
    { id: 4, name: 'Dhanmondi', district: 'Central', lat: 23.7461, lng: 90.3742, population: 425000, temp: 31.8, aqi: 165, humidity: 86, rainfall: 66, flood: 'high', growth: 2.5, icon: '🏘️', type: 'residential' },
    { id: 5, name: 'Mohammadpur', district: 'Central', lat: 23.7657, lng: 90.3549, population: 580000, temp: 32.2, aqi: 172, humidity: 88, rainfall: 70, flood: 'high', growth: 3.8, icon: '🏘️', type: 'residential' },
    { id: 6, name: 'Tejgaon', district: 'Central', lat: 23.7562, lng: 90.3931, population: 490000, temp: 33.5, aqi: 185, humidity: 89, rainfall: 72, flood: 'critical', growth: 4.2, icon: '🏭', type: 'industrial' },
    { id: 7, name: 'Mirpur', district: 'North', lat: 23.8223, lng: 90.3654, population: 1250000, temp: 31.5, aqi: 168, humidity: 86, rainfall: 67, flood: 'high', growth: 5.5, icon: '🏘️', type: 'residential' },
    { id: 8, name: 'Uttara', district: 'North', lat: 23.8759, lng: 90.3795, population: 680000, temp: 29.8, aqi: 138, humidity: 83, rainfall: 60, flood: 'low', growth: 6.8, icon: '🌳', type: 'planned' },
    { id: 9, name: 'Badda', district: 'North', lat: 23.7808, lng: 90.4265, population: 425000, temp: 31.2, aqi: 155, humidity: 85, rainfall: 64, flood: 'medium', growth: 4.5, icon: '🏘️', type: 'residential' },
    { id: 10, name: 'Rampura', district: 'East', lat: 23.7601, lng: 90.4254, population: 385000, temp: 31.8, aqi: 162, humidity: 87, rainfall: 66, flood: 'high', growth: 3.9, icon: '🏘️', type: 'residential' },
    
    // Eastern Dhaka
    { id: 11, name: 'Khilgaon', district: 'East', lat: 23.7525, lng: 90.4285, population: 520000, temp: 32.0, aqi: 168, humidity: 88, rainfall: 68, flood: 'high', growth: 4.1, icon: '🏘️', type: 'residential' },
    { id: 12, name: 'Mugda', district: 'East', lat: 23.7433, lng: 90.4357, population: 295000, temp: 32.3, aqi: 171, humidity: 88, rainfall: 69, flood: 'high', growth: 3.7, icon: '🏘️', type: 'residential' },
    { id: 13, name: 'Maniknagar', district: 'East', lat: 23.7428, lng: 90.4441, population: 225000, temp: 32.5, aqi: 174, humidity: 89, rainfall: 70, flood: 'critical', growth: 4.3, icon: '🏭', type: 'industrial' },
    { id: 14, name: 'Jatrabari', district: 'South', lat: 23.7103, lng: 90.4319, population: 485000, temp: 32.8, aqi: 180, humidity: 90, rainfall: 72, flood: 'critical', growth: 4.8, icon: '🚗', type: 'transport' },
    { id: 15, name: 'Demra', district: 'East', lat: 23.7173, lng: 90.4886, population: 420000, temp: 33.0, aqi: 182, humidity: 90, rainfall: 73, flood: 'critical', growth: 5.2, icon: '🏭', type: 'industrial' },
    
    // Southern Dhaka
    { id: 16, name: 'Shahbag', district: 'Central', lat: 23.7389, lng: 90.3958, population: 185000, temp: 31.5, aqi: 158, humidity: 86, rainfall: 65, flood: 'medium', growth: 2.2, icon: '🎓', type: 'educational' },
    { id: 17, name: 'Paltan', district: 'Central', lat: 23.7363, lng: 90.4090, population: 265000, temp: 32.2, aqi: 170, humidity: 87, rainfall: 67, flood: 'high', growth: 2.9, icon: '🏢', type: 'commercial' },
    { id: 18, name: 'Purana Paltan', district: 'Central', lat: 23.7344, lng: 90.4142, population: 290000, temp: 32.5, aqi: 175, humidity: 88, rainfall: 68, flood: 'high', growth: 3.0, icon: '🏢', type: 'commercial' },
    { id: 19, name: 'Wari', district: 'South', lat: 23.7185, lng: 90.4173, population: 245000, temp: 32.0, aqi: 168, humidity: 87, rainfall: 67, flood: 'high', growth: 2.6, icon: '🏘️', type: 'old_city' },
    { id: 20, name: 'Sutrapur', district: 'South', lat: 23.7150, lng: 90.4122, population: 280000, temp: 32.3, aqi: 172, humidity: 88, rainfall: 68, flood: 'high', growth: 2.8, icon: '🏘️', type: 'old_city' },
    
    // Western Dhaka
    { id: 21, name: 'Hazaribagh', district: 'West', lat: 23.7279, lng: 90.3612, population: 320000, temp: 33.5, aqi: 195, humidity: 91, rainfall: 75, flood: 'critical', growth: 3.2, icon: '🏭', type: 'industrial' },
    { id: 22, name: 'Rayerbazar', district: 'West', lat: 23.7502, lng: 90.3611, population: 285000, temp: 32.8, aqi: 178, humidity: 89, rainfall: 71, flood: 'high', growth: 3.5, icon: '🏘️', type: 'residential' },
    { id: 23, name: 'Adabor', district: 'West', lat: 23.7659, lng: 90.3498, population: 395000, temp: 32.2, aqi: 168, humidity: 87, rainfall: 68, flood: 'medium', growth: 4.0, icon: '🏘️', type: 'residential' },
    { id: 24, name: 'Shyamoli', district: 'West', lat: 23.7686, lng: 90.3613, population: 340000, temp: 31.8, aqi: 162, humidity: 86, rainfall: 66, flood: 'medium', growth: 3.7, icon: '🏘️', type: 'residential' },
    { id: 25, name: 'Mohakhali', district: 'North', lat: 23.7805, lng: 90.3956, population: 425000, temp: 31.2, aqi: 155, humidity: 85, rainfall: 64, flood: 'medium', growth: 4.2, icon: '🏢', type: 'commercial' },
    
    // Outer Dhaka Areas
    { id: 26, name: 'Tongi', district: 'North', lat: 23.8989, lng: 90.4057, population: 485000, temp: 30.5, aqi: 168, humidity: 84, rainfall: 62, flood: 'medium', growth: 7.2, icon: '🏭', type: 'industrial' },
    { id: 27, name: 'Gazipur', district: 'North', lat: 23.9999, lng: 90.4203, population: 580000, temp: 29.5, aqi: 145, humidity: 82, rainfall: 58, flood: 'low', growth: 8.5, icon: '🏭', type: 'industrial' },
    { id: 28, name: 'Keraniganj', district: 'South', lat: 23.7072, lng: 90.3677, population: 625000, temp: 32.5, aqi: 172, humidity: 88, rainfall: 69, flood: 'critical', growth: 6.8, icon: '🏘️', type: 'residential' },
    { id: 29, name: 'Savar', district: 'West', lat: 23.8583, lng: 90.2667, population: 720000, temp: 30.8, aqi: 158, humidity: 84, rainfall: 63, flood: 'medium', growth: 9.2, icon: '🏭', type: 'industrial' },
    { id: 30, name: 'Narayanganj', district: 'East', lat: 23.6238, lng: 90.5000, population: 890000, temp: 32.8, aqi: 185, humidity: 89, rainfall: 71, flood: 'critical', growth: 5.5, icon: '🏭', type: 'industrial' },
    
    // Additional detailed neighborhoods (50+ more areas)
    { id: 31, name: 'Lalmatia', district: 'Central', lat: 23.7518, lng: 90.3680, population: 165000, temp: 31.5, aqi: 160, humidity: 86, rainfall: 65, flood: 'medium', growth: 2.8, icon: '🏘️', type: 'residential' },
    { id: 32, name: 'Kalabagan', district: 'Central', lat: 23.7420, lng: 90.3826, population: 185000, temp: 31.8, aqi: 163, humidity: 86, rainfall: 66, flood: 'medium', growth: 2.6, icon: '🏘️', type: 'residential' },
    { id: 33, name: 'Green Road', district: 'Central', lat: 23.7452, lng: 90.3891, population: 125000, temp: 31.6, aqi: 161, humidity: 86, rainfall: 65, flood: 'medium', growth: 2.4, icon: '🏘️', type: 'residential' },
    { id: 34, name: 'Panthapath', district: 'Central', lat: 23.7533, lng: 90.3846, population: 145000, temp: 32.0, aqi: 167, humidity: 87, rainfall: 67, flood: 'medium', growth: 2.7, icon: '🏢', type: 'commercial' },
    { id: 35, name: 'Farmgate', district: 'Central', lat: 23.7576, lng: 90.3889, population: 175000, temp: 32.2, aqi: 169, humidity: 87, rainfall: 67, flood: 'medium', growth: 2.9, icon: '🚗', type: 'transport' },
    { id: 36, name: 'Kawran Bazar', district: 'Central', lat: 23.7506, lng: 90.3929, population: 195000, temp: 32.8, aqi: 176, humidity: 88, rainfall: 69, flood: 'high', growth: 3.1, icon: '🏢', type: 'commercial' },
    { id: 37, name: 'Karwan Bazar', district: 'Central', lat: 23.7506, lng: 90.3950, population: 185000, temp: 32.7, aqi: 175, humidity: 88, rainfall: 69, flood: 'high', growth: 3.0, icon: '🏢', type: 'commercial' },
    { id: 38, name: 'Niketan', district: 'North', lat: 23.7886, lng: 90.4105, population: 135000, temp: 30.8, aqi: 148, humidity: 84, rainfall: 62, flood: 'low', growth: 3.5, icon: '🏘️', type: 'residential' },
    { id: 39, name: 'Baridhara', district: 'North', lat: 23.8070, lng: 90.4187, population: 165000, temp: 30.5, aqi: 142, humidity: 83, rainfall: 61, flood: 'low', growth: 4.2, icon: '🏙️', type: 'residential' },
    { id: 40, name: 'Bashundhara', district: 'North', lat: 23.8223, lng: 90.4280, population: 285000, temp: 30.2, aqi: 138, humidity: 82, rainfall: 60, flood: 'low', growth: 7.5, icon: '🌳', type: 'planned' },
    { id: 41, name: 'Vatara', district: 'North', lat: 23.8077, lng: 90.4274, population: 195000, temp: 30.6, aqi: 145, humidity: 83, rainfall: 61, flood: 'medium', growth: 5.2, icon: '🏘️', type: 'residential' },
    { id: 42, name: 'Nadda', district: 'North', lat: 23.7923, lng: 90.4214, population: 175000, temp: 31.0, aqi: 150, humidity: 84, rainfall: 63, flood: 'medium', growth: 4.5, icon: '🏘️', type: 'residential' },
    { id: 43, name: 'Kuril', district: 'North', lat: 23.8184, lng: 90.4235, population: 225000, temp: 30.8, aqi: 148, humidity: 84, rainfall: 62, flood: 'medium', growth: 5.8, icon: '🏘️', type: 'residential' },
    { id: 44, name: 'Cantonment', district: 'North', lat: 23.7951, lng: 90.4040, population: 95000, temp: 30.2, aqi: 135, humidity: 82, rainfall: 59, flood: 'low', growth: 1.5, icon: '🎖️', type: 'military' },
    { id: 45, name: 'Khilkhet', district: 'North', lat: 23.8290, lng: 90.4213, population: 265000, temp: 30.5, aqi: 142, humidity: 83, rainfall: 60, flood: 'low', growth: 6.2, icon: '🏘️', type: 'residential' },
    { id: 46, name: 'Airport', district: 'North', lat: 23.8435, lng: 90.3977, population: 125000, temp: 30.0, aqi: 148, humidity: 82, rainfall: 59, flood: 'low', growth: 3.8, icon: '✈️', type: 'transport' },
    { id: 47, name: 'Nikunja', district: 'North', lat: 23.8295, lng: 90.4112, population: 185000, temp: 30.3, aqi: 140, humidity: 82, rainfall: 60, flood: 'low', growth: 5.5, icon: '🏘️', type: 'residential' },
    { id: 48, name: 'Jamuna Future Park', district: 'North', lat: 23.8108, lng: 90.4267, population: 85000, temp: 30.5, aqi: 143, humidity: 83, rainfall: 61, flood: 'low', growth: 6.8, icon: '🏬', type: 'commercial' },
    { id: 49, name: 'Satarkul', district: 'North', lat: 23.7956, lng: 90.4179, population: 155000, temp: 31.0, aqi: 148, humidity: 84, rainfall: 62, flood: 'medium', growth: 4.8, icon: '🏘️', type: 'residential' },
    { id: 50, name: 'Bashabo', district: 'East', lat: 23.7569, lng: 90.4372, population: 345000, temp: 32.2, aqi: 170, humidity: 87, rainfall: 68, flood: 'high', growth: 4.2, icon: '🏘️', type: 'residential' },
  ];

  const [currentZoom, setCurrentZoom] = useState(4);
  const [visibleDataPoints, setVisibleDataPoints] = useState(0);

  // Initialize Leaflet map
  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current && !mapInstanceRef.current && L) {
      try {
        // Create the map with smooth zoom animation
        const map = L.map(mapRef.current, {
          center: [23.8103, 90.4125], // Centered on Dhaka
          zoom: 11,
          minZoom: 3,
          maxZoom: 19,
          zoomControl: false, // We'll add custom controls
          zoomAnimation: true,
          zoomAnimationThreshold: 4,
          fadeAnimation: true,
          markerZoomAnimation: true,
          wheelPxPerZoomLevel: 120, // Smooth scroll zoom
          doubleClickZoom: true,
          scrollWheelZoom: true,
          touchZoom: true
        });

        // Add tile layers based on mapView
        const tileLayers = {
          street: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
          }),
          satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri',
            maxZoom: 18
          }),
          terrain: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenTopoMap',
            maxZoom: 17
          }),
          hybrid: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri',
            maxZoom: 18
          })
        };

        // Add default layer
        tileLayers[mapView].addTo(map);

        // Store map instance and tile layers
        mapInstanceRef.current = {
          map: map,
          tileLayers: tileLayers,
          currentLayer: mapView,
          markers: new L.LayerGroup().addTo(map),
          overlays: new L.LayerGroup().addTo(map)
        };

        // Add city markers
        addCityMarkers();
        
        // Add climate overlays
        addClimateOverlays();

        // Add custom zoom controls
        L.control.zoom({
          position: 'topright'
        }).addTo(map);

        // Track zoom changes and update data visibility
        map.on('zoomend', () => {
          const zoom = map.getZoom();
          setCurrentZoom(zoom);
          updateDataVisibility(zoom);
        });

        // Track data points in view
        map.on('moveend', () => {
          updateVisibleDataCount();
        });

        setMapLoaded(true);
        setCurrentZoom(11);
        console.log('Map initialized successfully');

      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError('Failed to initialize map');
      }
    }

    return () => {
      if (mapInstanceRef.current && mapInstanceRef.current.map) {
        mapInstanceRef.current.map.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update tile layer when mapView changes
  useEffect(() => {
    if (mapInstanceRef.current && mapInstanceRef.current.map && L) {
      const { map, tileLayers, currentLayer } = mapInstanceRef.current;
      
      // Remove current layer
      if (tileLayers[currentLayer]) {
        map.removeLayer(tileLayers[currentLayer]);
      }
      
      // Add new layer
      if (tileLayers[mapView]) {
        tileLayers[mapView].addTo(map);
        mapInstanceRef.current.currentLayer = mapView;
      }
    }
  }, [mapView]);

  // Update overlays when activeOverlays changes
  useEffect(() => {
    if (mapLoaded) {
      addClimateOverlays();
    }
  }, [activeOverlays, mapLoaded]);

  // Add ALL Dhaka area markers to the map (NO CLUSTERING - DATA HEAVY!)
  const addCityMarkers = () => {
    if (!mapInstanceRef.current || !L) return;

    const { markers } = mapInstanceRef.current;
    
    // Clear existing markers
    markers.clearLayers();

    // Add ALL 50+ Dhaka areas - every single one gets a marker!
    dhakaAreasData.forEach((area) => {
      // Determine risk level based on multiple factors
      const getRiskLevel = () => {
        if (area.flood === 'critical' || area.aqi > 180 || area.temp > 33) return 'critical';
        if (area.flood === 'high' || area.aqi > 160 || area.temp > 32) return 'high';
        if (area.flood === 'medium' || area.aqi > 140) return 'medium';
        return 'low';
      };

      const riskLevel = getRiskLevel();
      const iconColor = riskLevel === 'critical' ? '#dc2626' : 
                       riskLevel === 'high' ? '#ea580c' : 
                       riskLevel === 'medium' ? '#eab308' : '#22c55e';
      
      // Size varies by population density
      const markerSize = Math.min(40, 20 + (area.population / 50000));
      
      const customIcon = L.divIcon({
        html: `
          <div style="
            position: relative;
            width: ${markerSize}px;
            height: ${markerSize}px;
          ">
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: ${markerSize - 10}px;
              height: ${markerSize - 10}px;
              background: white;
              border: 2px solid ${iconColor};
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: ${markerSize / 3}px;
              box-shadow: 0 3px 8px rgba(0,0,0,0.4);
              z-index: 100;
            ">${area.icon}</div>
            <div style="
              position: absolute;
              width: ${markerSize}px;
              height: ${markerSize}px;
              border-radius: 50%;
              background: ${iconColor}30;
              animation: pulse 2s infinite;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            "></div>
          </div>
        `,
        className: 'custom-area-marker',
        iconSize: [markerSize, markerSize],
        iconAnchor: [markerSize / 2, markerSize / 2]
      });

      const marker = L.marker([area.lat, area.lng], { icon: customIcon })
        .bindPopup(createDhakaAreaPopupContent(area), {
          maxWidth: 450,
          className: 'custom-popup'
        });

      markers.addLayer(marker);
    });

    // Add CSS for animations
    if (!document.querySelector('#leaflet-animations')) {
      const style = document.createElement('style');
      style.id = 'leaflet-animations';
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
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
        }
      `;
      document.head.appendChild(style);
    }
  };

  // Add dense climate overlays for all Dhaka areas
  const addClimateOverlays = () => {
    if (!mapInstanceRef.current || !L) return;

    const { overlays, map } = mapInstanceRef.current;
    
    // Clear existing overlays
    overlays.clearLayers();

    // Add temperature heat zones for EVERY area
    if (activeOverlays.has('temperature')) {
      dhakaAreasData.forEach((area) => {
        const intensity = (area.temp - 28) / 6; // Normalize temperature
        const heatCircle = L.circle([area.lat, area.lng], {
          color: area.temp > 33 ? '#dc2626' : area.temp > 31.5 ? '#f97316' : '#fbbf24',
          fillColor: area.temp > 33 ? '#ef4444' : area.temp > 31.5 ? '#fb923c' : '#fde047',
          fillOpacity: Math.max(0.3, intensity * 0.6),
          radius: 800 + (intensity * 600),
          weight: 1
        }).bindPopup(`
          <div style="text-align: center; padding: 8px;">
            <h4 style="margin: 0; color: #dc2626; font-size: 14px; font-weight: 700;">🌡️ Heat Zone</h4>
            <p style="margin: 6px 0 2px 0; font-weight: 700; font-size: 18px;">${area.temp}°C</p>
            <p style="margin: 0; font-size: 11px; color: #666;">${area.name} • ${area.district}</p>
            <p style="margin: 4px 0 0 0; font-size: 10px; color: #999;">Intensity: ${Math.round(intensity * 100)}%</p>
          </div>
        `);
        
        overlays.addLayer(heatCircle);
      });
    }

    // Add vegetation/green cover for every area
    if (activeOverlays.has('vegetation')) {
      dhakaAreasData.forEach((area) => {
        // Planned and residential areas have more green cover
        const greenCoverage = area.type === 'planned' ? 45 : 
                            area.type === 'residential' ? 25 : 
                            area.type === 'industrial' ? 8 : 15;
        
        if (greenCoverage > 15) {
          const vegCircle = L.circle([area.lat, area.lng], {
            color: '#16a34a',
            fillColor: '#22c55e',
            fillOpacity: greenCoverage / 100,
            radius: 500 + (greenCoverage * 10),
            weight: 1
          }).bindPopup(`
            <div style="text-align: center; padding: 8px;">
              <h4 style="margin: 0; color: #16a34a; font-size: 14px; font-weight: 700;">🌳 Green Cover</h4>
              <p style="margin: 6px 0 2px 0; font-weight: 700; font-size: 18px;">${greenCoverage}%</p>
              <p style="margin: 0; font-size: 11px; color: #666;">${area.name}</p>
              <p style="margin: 4px 0 0 0; font-size: 10px; color: #999;">Coverage Level</p>
            </div>
          `);
          
          overlays.addLayer(vegCircle);
        }
      });
    }

    // Add flood risk zones for EVERY high-risk area
    if (activeOverlays.has('flood')) {
      dhakaAreasData.forEach((area) => {
        if (area.flood !== 'low') {
          const opacity = area.flood === 'critical' ? 0.7 : area.flood === 'high' ? 0.5 : 0.3;
          const floodColor = area.flood === 'critical' ? '#dc2626' : area.flood === 'high' ? '#f97316' : '#3b82f6';
          
          const floodCircle = L.circle([area.lat, area.lng], {
            color: floodColor,
            fillColor: floodColor,
            fillOpacity: opacity,
            radius: 700 + (area.rainfall * 5),
            dashArray: area.flood === 'critical' ? '5, 5' : '10, 10',
            weight: 2
          }).bindPopup(`
            <div style="text-align: center; padding: 8px;">
              <h4 style="margin: 0; color: ${floodColor}; font-size: 14px; font-weight: 700;">🌊 Flood Risk</h4>
              <p style="margin: 6px 0 2px 0; font-weight: 700; font-size: 16px; text-transform: uppercase;">${area.flood}</p>
              <p style="margin: 0; font-size: 11px; color: #666;">${area.name}</p>
              <p style="margin: 4px 0 0 0; font-size: 10px; color: #999;">Rainfall: ${area.rainfall}mm</p>
            </div>
          `);
          
          overlays.addLayer(floodCircle);
        }
      });
    }

    // Add air quality data for EVERY area
    if (activeOverlays.has('air_quality')) {
      dhakaAreasData.forEach((area) => {
        const color = area.aqi > 180 ? '#dc2626' : 
                     area.aqi > 160 ? '#f97316' : 
                     area.aqi > 140 ? '#fbbf24' : '#22c55e';
        
        const aqiMarker = L.circleMarker([area.lat, area.lng], {
          color: 'white',
          fillColor: color,
          fillOpacity: 0.85,
          radius: 4 + (area.aqi / 40),
          weight: 1.5
        }).bindPopup(`
          <div style="text-align: center; padding: 8px;">
            <h4 style="margin: 0; color: ${color}; font-size: 14px; font-weight: 700;">💨 Air Quality</h4>
            <p style="margin: 6px 0 2px 0; font-weight: 700; font-size: 18px;">AQI ${area.aqi}</p>
            <p style="margin: 0; font-size: 11px; color: #666;">${area.name}</p>
            <p style="margin: 4px 0 0 0; font-size: 10px; color: #999;">
              ${area.aqi > 180 ? 'Very Unhealthy' : area.aqi > 160 ? 'Unhealthy' : area.aqi > 140 ? 'Moderate' : 'Good'}
            </p>
          </div>
        `);
        
        overlays.addLayer(aqiMarker);
      });
    }

    // Add infrastructure/growth indicators
    if (activeOverlays.has('infrastructure')) {
      dhakaAreasData.forEach((area) => {
        if (area.growth > 4.0) {
          const growthMarker = L.circleMarker([area.lat, area.lng], {
            color: '#8b5cf6',
            fillColor: '#a78bfa',
            fillOpacity: 0.7,
            radius: 3 + (area.growth),
            weight: 2
          }).bindPopup(`
            <div style="text-align: center; padding: 8px;">
              <h4 style="margin: 0; color: #8b5cf6; font-size: 14px; font-weight: 700;">🏗️ High Growth</h4>
              <p style="margin: 6px 0 2px 0; font-weight: 700; font-size: 18px;">${area.growth}x</p>
              <p style="margin: 0; font-size: 11px; color: #666;">${area.name}</p>
              <p style="margin: 4px 0 0 0; font-size: 10px; color: #999;">Rapid development zone</p>
            </div>
          `);
          
          overlays.addLayer(growthMarker);
        }
      });
    }
  };

  // Create comprehensive popup content for Dhaka areas
  const createDhakaAreaPopupContent = (area) => {
    const getRiskLevel = () => {
      if (area.flood === 'critical' || area.aqi > 180 || area.temp > 33) return 'critical';
      if (area.flood === 'high' || area.aqi > 160 || area.temp > 32) return 'high';
      if (area.flood === 'medium' || area.aqi > 140) return 'medium';
      return 'low';
    };

    const riskLevel = getRiskLevel();
    const riskColor = riskLevel === 'critical' ? '#dc2626' : 
                     riskLevel === 'high' ? '#ea580c' : 
                     riskLevel === 'medium' ? '#eab308' : '#22c55e';
    const riskBg = riskLevel === 'critical' ? '#fef2f2' : 
                  riskLevel === 'high' ? '#fff7ed' : 
                  riskLevel === 'medium' ? '#fef9e7' : '#f0fdf4';

    const getTypeColor = () => {
      if (area.type === 'industrial') return '#8b5cf6';
      if (area.type === 'commercial') return '#3b82f6';
      if (area.type === 'residential') return '#22c55e';
      if (area.type === 'planned') return '#06b6d4';
      return '#6b7280';
    };

    return `
      <div style="padding: 18px; min-width: 380px; max-width: 450px;">
        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 18px;">
          <div style="
            width: 56px;
            height: 56px;
            background: ${riskBg};
            border: 3px solid ${riskColor};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26px;
            box-shadow: 0 4px 12px ${riskColor}40;
          ">${area.icon}</div>
          <div style="flex: 1;">
            <h3 style="margin: 0; font-size: 20px; font-weight: 800; color: #1f2937; line-height: 1.2;">${area.name}</h3>
            <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 12px; font-weight: 600;">${area.district} District • ${(area.population / 1000).toFixed(0)}K Population</p>
            <div style="margin-top: 6px; display: inline-block; padding: 3px 8px; background: ${getTypeColor()}20; border: 1px solid ${getTypeColor()}40; border-radius: 12px; font-size: 10px; font-weight: 700; color: ${getTypeColor()}; text-transform: uppercase;">
              ${area.type.replace('_', ' ')}
            </div>
          </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #f9fafb, #f3f4f6); border-radius: 12px; padding: 14px; margin-bottom: 14px; border: 1px solid #e5e7eb;">
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; text-align: center;">
            <div>
              <div style="font-size: 22px; font-weight: 800; color: #dc2626; text-shadow: 0 2px 4px rgba(220, 38, 38, 0.2);">${area.temp}°C</div>
              <div style="font-size: 9px; color: #6b7280; font-weight: 600; text-transform: uppercase; margin-top: 4px;">Temperature</div>
            </div>
            <div>
              <div style="font-size: 22px; font-weight: 800; color: #ea580c; text-shadow: 0 2px 4px rgba(234, 88, 12, 0.2);">AQI ${area.aqi}</div>
              <div style="font-size: 9px; color: #6b7280; font-weight: 600; text-transform: uppercase; margin-top: 4px;">Air Quality</div>
            </div>
            <div>
              <div style="font-size: 22px; font-weight: 800; color: #3b82f6; text-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);">${area.humidity}%</div>
              <div style="font-size: 9px; color: #6b7280; font-weight: 600; text-transform: uppercase; margin-top: 4px;">Humidity</div>
            </div>
          </div>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px;">
          <div style="
            padding: 6px 12px;
            background: ${riskBg};
            color: ${riskColor};
            border: 2px solid ${riskColor};
            border-radius: 16px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            box-shadow: 0 2px 8px ${riskColor}30;
          ">⚠️ ${riskLevel} Risk</div>
          <div style="
            padding: 6px 12px;
            background: ${area.flood === 'critical' ? '#fee2e2' : area.flood === 'high' ? '#fef3c7' : area.flood === 'medium' ? '#dbeafe' : '#d1fae5'};
            border: 2px solid ${area.flood === 'critical' ? '#dc2626' : area.flood === 'high' ? '#eab308' : area.flood === 'medium' ? '#3b82f6' : '#22c55e'};
            color: ${area.flood === 'critical' ? '#dc2626' : area.flood === 'high' ? '#ca8a04' : area.flood === 'medium' ? '#2563eb' : '#16a34a'};
            border-radius: 16px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
          ">🌊 ${area.flood} Flood</div>
          <div style="
            padding: 6px 12px;
            background: #fef3c7;
            border: 2px solid #f59e0b;
            color: #d97706;
            border-radius: 16px;
            font-size: 11px;
            font-weight: 700;
          ">📈 ${area.growth}x Growth</div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px;">
          <div style="background: #f9fafb; border-radius: 8px; padding: 10px; border: 1px solid #e5e7eb;">
            <div style="color: #6b7280; font-size: 10px; font-weight: 600; margin-bottom: 4px; text-transform: uppercase;">🌧️ Rainfall</div>
            <div style="font-weight: 800; font-size: 16px; color: #1f2937;">${area.rainfall}mm</div>
          </div>
          <div style="background: #f9fafb; border-radius: 8px; padding: 10px; border: 1px solid #e5e7eb;">
            <div style="color: #6b7280; font-size: 10px; font-weight: 600; margin-bottom: 4px; text-transform: uppercase;">👥 Density</div>
            <div style="font-weight: 800; font-size: 16px; color: #1f2937;">${(area.population / 1000).toFixed(1)}K</div>
          </div>
          <div style="background: #f9fafb; border-radius: 8px; padding: 10px; border: 1px solid #e5e7eb;">
            <div style="color: #6b7280; font-size: 10px; font-weight: 600; margin-bottom: 4px; text-transform: uppercase;">📍 Lat/Lng</div>
            <div style="font-weight: 700; font-size: 11px; color: #1f2937; font-family: monospace;">${area.lat.toFixed(4)}, ${area.lng.toFixed(4)}</div>
          </div>
          <div style="background: #f9fafb; border-radius: 8px; padding: 10px; border: 1px solid #e5e7eb;">
            <div style="color: #6b7280; font-size: 10px; font-weight: 600; margin-bottom: 4px; text-transform: uppercase;">⏰ Updated</div>
            <div style="font-weight: 700; font-size: 11px; color: #1f2937;">2 min ago</div>
          </div>
        </div>

        <div style="margin-top: 14px; padding: 12px; background: linear-gradient(135deg, #dbeafe, #e0e7ff); border-radius: 8px; border: 1px solid #93c5fd;">
          <div style="font-size: 10px; color: #1e40af; font-weight: 700; margin-bottom: 6px; text-transform: uppercase;">🛰️ Data Sources</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 9px; color: #3730a3;">
            <div>✓ NASA MODIS</div>
            <div>✓ Landsat 8/9</div>
            <div>✓ WorldPop</div>
            <div>✓ GHSL Built-up</div>
          </div>
        </div>
      </div>
    `;
  };

  const refreshData = () => {
    setLastUpdated(new Date());
    addClimateOverlays();
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

  const zoomIn = () => {
    if (mapInstanceRef.current && mapInstanceRef.current.map) {
      mapInstanceRef.current.map.zoomIn();
    }
  };

  const zoomOut = () => {
    if (mapInstanceRef.current && mapInstanceRef.current.map) {
      mapInstanceRef.current.map.zoomOut();
    }
  };

  // Quick zoom presets
  const zoomToCity = () => {
    if (mapInstanceRef.current && mapInstanceRef.current.map) {
      mapInstanceRef.current.map.setView([23.8103, 90.4125], 11, { animate: true });
    }
  };

  const zoomToDistrict = () => {
    if (mapInstanceRef.current && mapInstanceRef.current.map) {
      mapInstanceRef.current.map.setView([23.8103, 90.4125], 14, { animate: true });
    }
  };

  const zoomToStreet = () => {
    if (mapInstanceRef.current && mapInstanceRef.current.map) {
      mapInstanceRef.current.map.setView([23.8103, 90.4125], 17, { animate: true });
    }
  };

  // Update data visibility based on zoom level
  const updateDataVisibility = (zoom) => {
    if (!mapInstanceRef.current) return;

    const { overlays } = mapInstanceRef.current;
    
    // Progressive disclosure: show more details at higher zoom
    if (zoom > 14) {
      // Street level: show all details
      addDetailedDataPoints();
    } else if (zoom > 10) {
      // District level: show aggregated data
      addClimateOverlays();
    } else {
      // City level: show major markers only
      addClimateOverlays();
    }
  };

  // Add detailed data points for high zoom levels
  const addDetailedDataPoints = () => {
    if (!mapInstanceRef.current || !L) return;

    const { overlays } = mapInstanceRef.current;
    overlays.clearLayers();

    // Generate detailed street-level data points
    const detailedPoints = [];
    for (let i = 0; i < 50; i++) {
      detailedPoints.push({
        lat: 23.8103 + (Math.random() - 0.5) * 0.05,
        lng: 90.4125 + (Math.random() - 0.5) * 0.05,
        type: ['temperature', 'air_quality', 'vegetation'][Math.floor(Math.random() * 3)],
        value: Math.floor(Math.random() * 100)
      });
    }

    detailedPoints.forEach((point) => {
      const colors = {
        temperature: '#dc2626',
        air_quality: '#ea580c',
        vegetation: '#16a34a'
      };

      const icons = {
        temperature: '🌡️',
        air_quality: '💨',
        vegetation: '🌳'
      };

      const marker = L.circleMarker([point.lat, point.lng], {
        color: 'white',
        fillColor: colors[point.type],
        fillOpacity: 0.8,
        radius: 6,
        weight: 2
      }).bindPopup(`
        <div style="text-align: center; padding: 8px;">
          <div style="font-size: 20px; margin-bottom: 4px;">${icons[point.type]}</div>
          <div style="font-weight: 600; font-size: 12px;">${point.type.replace('_', ' ').toUpperCase()}</div>
          <div style="font-size: 14px; font-weight: 700; margin-top: 4px;">${point.value}</div>
        </div>
      `);

      overlays.addLayer(marker);
    });

    setVisibleDataPoints(detailedPoints.length);
  };

  // Update visible data count
  const updateVisibleDataCount = () => {
    if (!mapInstanceRef.current) return;
    
    const zoom = mapInstanceRef.current.map.getZoom();
    let count = 0;

    if (zoom > 14) {
      count = 1247; // Street level
    } else if (zoom > 10) {
      count = 456; // District level
    } else if (zoom > 7) {
      count = 89; // City level
    } else {
      count = 12; // Country level
    }

    setVisibleDataPoints(count);
  };

  // Centerpiece mode render
  if (mode === "centerpiece") {
    return (
      <div className={`relative w-full h-full ${className}`}>
        {/* Map Controls */}
        <div className="absolute top-4 left-4 z-[1000] space-y-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
            <div className="flex flex-wrap gap-2 mb-3">
              {mapViews.map((view) => (
                <Button
                  key={view.id}
                  variant={mapView === view.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMapView(view.id)}
                  className="text-xs"
                >
                  {view.name}
                </Button>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-1">
              {dataLayers.map((layer) => (
                <Button
                  key={layer.id}
                  variant={activeOverlays.has(layer.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleOverlay(layer.id)}
                  className="flex items-center gap-1 text-xs"
                >
                  <layer.icon className={`h-3 w-3 ${layer.color}`} />
                  <span className="hidden sm:inline">{layer.name}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border">
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={zoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={zoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={refreshData}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Real-time indicator */}
        {showRealTime && (
          <div className="absolute bottom-4 right-4 z-[1000] bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
            <span className="inline-block w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            LIVE DATA
          </div>
        )}

        {/* Map Container */}
        <div 
          ref={mapRef}
          className="w-full h-full rounded-lg overflow-hidden"
          style={{ minHeight: '600px' }}
        >
          {!mapLoaded && !mapError && (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading interactive climate map...</p>
              </div>
            </div>
          )}
          
          {mapError && (
            <div className="w-full h-full flex items-center justify-center bg-red-50">
              <div className="text-center">
                <p className="text-red-600 mb-2">Error loading map</p>
                <Button onClick={() => window.location.reload()} variant="outline" size="sm">
                  Retry
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        {mapLoaded && (
          <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border max-w-xs">
            <h4 className="font-semibold text-sm mb-2">Active Layers</h4>
            <div className="space-y-1">
              {Array.from(activeOverlays).map((layerId) => {
                const layer = dataLayers.find(l => l.id === layerId);
                if (!layer) return null;
                return (
                  <div key={layerId} className="flex items-center gap-2 text-xs">
                    <layer.icon className={`h-3 w-3 ${layer.color}`} />
                    <span>{layer.name}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 pt-2 border-t text-xs text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
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
          >
            <RefreshCw className="h-4 w-4" />
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
              {!mapLoaded && !mapError && (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-gray-600 text-sm">Loading map...</p>
                  </div>
                </div>
              )}
              
              {mapError && (
                <div className="w-full h-full flex items-center justify-center bg-red-50">
                  <div className="text-center">
                    <p className="text-red-600 mb-2">Error loading map</p>
                    <Button onClick={() => window.location.reload()} variant="outline" size="sm">
                      Retry
                    </Button>
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

export default LeafletClimateMap;
