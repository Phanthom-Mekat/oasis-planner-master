"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, MapPin, Layers, Image as ImageIcon, Loader2, Building2, TreePine, Flame, Droplets, Wind, TrendingUp } from 'lucide-react';
import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl/maplibre';
import { GeoJsonLayer, BitmapLayer, ScatterplotLayer, TextLayer, LineLayer } from '@deck.gl/layers';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';

const AGENT_API = "http://localhost:8004/api/v1";
const DHAKA_CENTER = [90.4125, 23.8103];

// Dummy data for fallback when APIs aren't working
const DUMMY_DISASTER_DATA = [
  { coordinates: [90.4200, 23.8200], title: 'Flood Risk Zone', category: 'Flood', magnitude: 85, date: '2025-10-03' },
  { coordinates: [90.4000, 23.8000], title: 'Storm Alert', category: 'Severe Storm', magnitude: 65, date: '2025-10-02' },
  { coordinates: [90.4300, 23.8300], title: 'Heat Wave', category: 'Extreme Heat', magnitude: 42, date: '2025-10-01' }
];

const DUMMY_HEAT_ISLAND_DATA = [
  [90.4125, 23.8103, 85], // Dhaka Center - High heat
  [90.4200, 23.8200, 95], // Commercial District - Very high heat
  [90.4000, 23.8000, 75], // Industrial Zone - High heat
  [90.4300, 23.8300, 60], // Residential Area - Medium heat
  [90.4100, 23.8150, 70], // Mixed use - High heat
  [90.4250, 23.8250, 80], // Dense urban - High heat
  [90.4050, 23.8050, 65], // Suburban - Medium heat
  [90.4150, 23.8200, 90], // CBD - Very high heat
];

const DUMMY_AIR_QUALITY_DATA = [
  { coordinates: [90.4125, 23.8103], aqi: 180, category: 'Unhealthy', color: [255, 100, 100] },
  { coordinates: [90.4200, 23.8200], aqi: 220, category: 'Very Unhealthy', color: [255, 50, 50] },
  { coordinates: [90.4000, 23.8000], aqi: 160, category: 'Unhealthy', color: [255, 150, 100] },
  { coordinates: [90.4300, 23.8300], aqi: 120, category: 'Unhealthy for Sensitive', color: [255, 200, 100] },
];

const DUMMY_GREEN_SPACE_DATA = [
  { coordinates: [90.4100, 23.8150], area: 2.5, type: 'Park', quality: 'Good' },
  { coordinates: [90.4250, 23.8250], area: 0.8, type: 'Garden', quality: 'Fair' },
  { coordinates: [90.4050, 23.8050], area: 1.2, type: 'Green Corridor', quality: 'Good' },
  { coordinates: [90.4150, 23.8200], area: 0.3, type: 'Pocket Park', quality: 'Poor' },
];

export default function UrbanPlannerAI() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Hello! I\'m your AI Urban Planning Assistant powered by NASA Earth observation data.\n\n🎯 I can help you with:\n\n🛰️ **Satellite Imagery** - Monitor urban growth and land use\n🌪️ **Disaster Tracking** - Floods, wildfires, storms\n💨 **Air Quality Analysis** - Pollution trends and health impacts\n🔥 **Urban Heat Islands** - Identify hot zones and cooling strategies\n🏘️ **Urban Sprawl Monitoring** - Track city expansion\n💧 **Flood Risk Assessment** - Drainage planning\n🌳 **Green Space Equity** - Parks and vegetation distribution\n💡 **Economic Analysis** - Nighttime lights and infrastructure gaps\n\nWhat urban planning challenge can I help you analyze today?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [viewState, setViewState] = useState({
    longitude: DHAKA_CENTER[0],
    latitude: DHAKA_CENTER[1],
    zoom: 11,
    pitch: 45,
    bearing: 0
  });
  const [mapLayers, setMapLayers] = useState([]);
  const [visualizationData, setVisualizationData] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  }, []);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    // Only scroll to bottom when new messages are added, not on initial load
    if (messages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages.length]);

  const extractVisualizationData = (toolOutputs) => {
    const visData = {};
    
    for (const [toolName, output] of Object.entries(toolOutputs)) {
      try {
        const parsed = typeof output === 'string' ? JSON.parse(output.replace(/'/g, '"')) : output;
        
        // Handle satellite imagery
        if (toolName === 'get_city_satellite_imagery' && parsed.image_url && parsed.bounds) {
          visData.satelliteImage = {
            url: parsed.image_url,
            bounds: [
              [parsed.bounds.west, parsed.bounds.south],
              [parsed.bounds.east, parsed.bounds.north]
            ],
            location: parsed.location
          };
        }
        
        // Handle natural disasters - EONET format
        if (toolName === 'get_natural_disasters' && parsed.events) {
          const disasterFeatures = [];
          parsed.events.forEach(event => {
            if (event.geometry && Array.isArray(event.geometry)) {
              event.geometry.forEach(geom => {
                if (geom.coordinates && geom.coordinates.length === 2) {
                  disasterFeatures.push({
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: geom.coordinates
                    },
                    properties: {
                      title: event.title,
                      category: event.categories?.[0]?.title || 'Unknown',
                      date: geom.date,
                      magnitude: geom.magnitudeValue,
                      unit: geom.magnitudeUnit
                    }
                  });
                }
              });
            } else if (event.coordinates) {
              // Handle direct coordinate format
              disasterFeatures.push({
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: event.coordinates
                },
                properties: {
                  title: event.title,
                  category: event.category,
                  date: event.date,
                  magnitude: event.magnitude
                }
              });
            }
          });
          visData.disasters = disasterFeatures;
        }
        
        // Handle analysis points for various tools
        if (parsed.location && (toolName.includes('green_space') || toolName.includes('flood_risk') || toolName.includes('heat_islands') || toolName.includes('air_quality'))) {
          const typeMap = {
            'green_space': 'green_space',
            'flood_risk': 'flood_risk', 
            'heat_islands': 'heat_island',
            'air_quality': 'air_quality'
          };
          
          visData.analysisPoint = {
            coordinates: [parsed.location.lon, parsed.location.lat],
            title: parsed.city || 'Analysis Point',
            type: typeMap[toolName] || 'analysis',
            data: parsed // Store full data for detailed visualization
          };
        }
        
        // Handle flood risk zones
        if (toolName === 'analyze_flood_risk_zones' && parsed.risk_zones) {
          visData.analysisPoint = {
            coordinates: [parsed.location.lon, parsed.location.lat],
            title: parsed.city || 'Flood Risk Analysis',
            type: 'flood_risk',
            data: parsed
          };
        }
        
        // Handle APOD images
        if (toolName === 'get_apod' && parsed.url) {
          visData.apodImage = {
            url: parsed.url,
            hdurl: parsed.hdurl,
            title: parsed.title,
            explanation: parsed.explanation,
            date: parsed.date
          };
        }
        
      } catch (e) {
        console.error('Error parsing tool output:', e);
      }
    }
    
    return Object.keys(visData).length > 0 ? visData : null;
  };

  const createMapLayers = (visData) => {
    const layers = [];
    
    if (visData.satelliteImage) {
      layers.push(new BitmapLayer({
        id: 'satellite-imagery',
        bounds: visData.satelliteImage.bounds,
        image: visData.satelliteImage.url,
        opacity: 0.8
      }));
      
      setViewState(prev => ({
        ...prev,
        longitude: visData.satelliteImage.location.lon,
        latitude: visData.satelliteImage.location.lat,
        zoom: 13
      }));
    }
    
    if (visData.disasters && visData.disasters.length > 0) {
        layers.push(new ScatterplotLayer({
          id: 'disasters',
          data: visData.disasters,
          getPosition: d => d.geometry.coordinates,
          getFillColor: d => {
            const category = d.properties.category?.toLowerCase();
            if (category?.includes('flood')) return [0, 100, 255, 200];
            if (category?.includes('storm')) return [255, 150, 0, 200];
            if (category?.includes('heat')) return [255, 50, 50, 200];
            return [255, 100, 100, 200];
          },
          getRadius: d => {
            const magnitude = d.properties.magnitude || 50;
            return Math.max(20, Math.min(100, magnitude));
          },
          pickable: true,
          radiusMinPixels: 8,
          radiusMaxPixels: 30,
          stroked: true,
          getLineColor: [255, 255, 255],
          getLineWidth: 2
        }));
      
      layers.push(new TextLayer({
        id: 'disaster-labels',
        data: visData.disasters,
        getPosition: d => d.geometry.coordinates,
        getText: d => d.properties.category,
        getSize: 12,
        getColor: [255, 255, 255],
        getAngle: 0,
        getTextAnchor: 'middle',
        getAlignmentBaseline: 'bottom',
        getPixelOffset: [0, -15]
      }));
    } else if (visData.analysisPoint?.type === 'disaster' || !visData.disasters) {
      // Use dummy disaster data
      layers.push(new ScatterplotLayer({
        id: 'dummy-disasters',
        data: DUMMY_DISASTER_DATA,
        getPosition: d => d.coordinates,
        getFillColor: d => {
          const category = d.category?.toLowerCase();
          if (category?.includes('flood')) return [0, 100, 255, 200];
          if (category?.includes('storm')) return [255, 150, 0, 200];
          if (category?.includes('heat')) return [255, 50, 50, 200];
          return [255, 100, 100, 200];
        },
        getRadius: d => {
          const magnitude = d.magnitude || 50;
          return Math.max(20, Math.min(100, magnitude));
        },
        pickable: true,
        radiusMinPixels: 8,
        radiusMaxPixels: 30,
        stroked: true,
        getLineColor: [255, 255, 255],
        getLineWidth: 2
      }));
      
      layers.push(new TextLayer({
        id: 'dummy-disaster-labels',
        data: DUMMY_DISASTER_DATA,
        getPosition: d => d.coordinates,
        getText: d => d.category,
        getSize: 12,
        getColor: [255, 255, 255],
        getAngle: 0,
        getTextAnchor: 'middle',
        getAlignmentBaseline: 'bottom',
        getPixelOffset: [0, -15]
      }));
    }
    
    if (visData.analysisPoint) {
      const colorMap = {
        green_space: [50, 200, 50, 255],
        flood_risk: [50, 100, 255, 255],
        heat_island: [255, 100, 50, 255],
        air_quality: [255, 150, 100, 255]
      };
      
      // Create a larger analysis area for heat islands
      if (visData.analysisPoint.type === 'heat_island') {
        // Use HeatmapLayer for heat islands
        layers.push(new HeatmapLayer({
          id: 'heat-island-heatmap',
          data: DUMMY_HEAT_ISLAND_DATA,
          getPosition: d => [d[0], d[1]],
          getWeight: d => d[2],
          radiusPixels: 60,
          intensity: 1,
          threshold: 0.03,
          pickable: false
        }));
        
        // Add scatter points for specific heat zones
        const heatZones = DUMMY_HEAT_ISLAND_DATA.map((point, index) => ({
          coordinates: [point[0], point[1]],
          title: `Heat Zone ${index + 1}`,
          intensity: point[2] > 80 ? 'Very High' : point[2] > 70 ? 'High' : 'Medium'
        }));
        
        layers.push(new ScatterplotLayer({
          id: 'heat-zones',
          data: heatZones,
          getPosition: d => d.coordinates,
          getFillColor: d => {
            const intensity = d.intensity;
            if (intensity === 'Very High') return [255, 50, 50, 200];
            if (intensity === 'High') return [255, 100, 50, 200];
            return [255, 150, 50, 200];
          },
          getRadius: d => {
            if (d.intensity === 'Very High') return 60;
            if (d.intensity === 'High') return 45;
            return 30;
          },
          pickable: true,
          radiusMinPixels: 8,
          radiusMaxPixels: 25,
          stroked: true,
          getLineColor: [255, 255, 255],
          getLineWidth: 2
        }));
        
        layers.push(new TextLayer({
          id: 'heat-zone-labels',
          data: heatZones,
          getPosition: d => d.coordinates,
          getText: d => `${d.title}\n${d.intensity}`,
          getSize: 10,
          getColor: [255, 255, 255],
          getAngle: 0,
          getTextAnchor: 'middle',
          getAlignmentBaseline: 'bottom',
          getPixelOffset: [0, -25],
          background: true,
          getBackgroundColor: [0, 0, 0, 180]
        }));
      } else if (visData.analysisPoint.type === 'air_quality') {
        // Air quality visualization - use backend data if available
        const airQualityData = visData.analysisPoint.data?.monitoring_stations || DUMMY_AIR_QUALITY_DATA;
        layers.push(new ScatterplotLayer({
          id: 'air-quality',
          data: airQualityData,
          getPosition: d => d.coordinates,
          getFillColor: d => {
            if (d.color) return [...d.color, 200];
            // Default colors based on AQI
            if (d.aqi >= 200) return [255, 50, 50, 200];
            if (d.aqi >= 150) return [255, 100, 100, 200];
            if (d.aqi >= 100) return [255, 200, 100, 200];
            return [100, 200, 100, 200];
          },
          getRadius: d => {
            // Scale radius based on AQI severity
            if (d.aqi >= 200) return 50;
            if (d.aqi >= 150) return 40;
            if (d.aqi >= 100) return 30;
            return 20;
          },
          pickable: true,
          radiusMinPixels: 8,
          radiusMaxPixels: 30,
          stroked: true,
          getLineColor: [255, 255, 255],
          getLineWidth: 2
        }));
        
        layers.push(new TextLayer({
          id: 'air-quality-labels',
          data: airQualityData,
          getPosition: d => d.coordinates,
          getText: d => `AQI: ${d.aqi}\n${d.category}`,
          getSize: 10,
          getColor: [255, 255, 255],
          getAngle: 0,
          getTextAnchor: 'middle',
          getAlignmentBaseline: 'bottom',
          getPixelOffset: [0, -25],
          background: true,
          getBackgroundColor: [0, 0, 0, 180]
        }));
      } else if (visData.analysisPoint.type === 'green_space') {
        // Green space visualization - use backend data if available
        const greenSpaceData = visData.analysisPoint.data?.green_spaces || DUMMY_GREEN_SPACE_DATA;
        layers.push(new ScatterplotLayer({
          id: 'green-spaces',
          data: greenSpaceData,
          getPosition: d => d.coordinates,
          getFillColor: d => {
            if (d.quality === 'Good') return [50, 200, 50, 200];
            if (d.quality === 'Fair') return [150, 200, 50, 200];
            return [200, 150, 50, 200];
          },
          getRadius: d => {
            // Scale radius based on area
            const area = d.area || 1;
            return Math.max(20, Math.min(80, area * 20));
          },
          pickable: true,
          radiusMinPixels: 8,
          radiusMaxPixels: 40,
          stroked: true,
          getLineColor: [255, 255, 255],
          getLineWidth: 2
        }));
        
        layers.push(new TextLayer({
          id: 'green-space-labels',
          data: greenSpaceData,
          getPosition: d => d.coordinates,
          getText: d => `${d.type}\n${d.area}km²\n${d.quality}`,
          getSize: 10,
          getColor: [255, 255, 255],
          getAngle: 0,
          getTextAnchor: 'middle',
          getAlignmentBaseline: 'bottom',
          getPixelOffset: [0, -30],
          background: true,
          getBackgroundColor: [0, 0, 0, 180]
        }));
      } else if (visData.analysisPoint.type === 'flood_risk') {
        // Flood risk visualization - use backend data if available
        const floodRiskData = visData.analysisPoint.data?.risk_zones || [
          { coordinates: [90.4200, 23.8200], risk_level: 'High', elevation: 5.2 },
          { coordinates: [90.4000, 23.8000], risk_level: 'Medium', elevation: 8.1 },
          { coordinates: [90.4300, 23.8300], risk_level: 'Low', elevation: 12.5 }
        ];
        
        layers.push(new ScatterplotLayer({
          id: 'flood-risk',
          data: floodRiskData,
          getPosition: d => d.coordinates,
          getFillColor: d => {
            if (d.risk_level === 'High') return [255, 50, 50, 200];
            if (d.risk_level === 'Medium') return [255, 150, 50, 200];
            return [50, 200, 50, 200];
          },
          getRadius: d => {
            // Scale radius based on risk level
            if (d.risk_level === 'High') return 60;
            if (d.risk_level === 'Medium') return 40;
            return 25;
          },
          pickable: true,
          radiusMinPixels: 8,
          radiusMaxPixels: 30,
          stroked: true,
          getLineColor: [255, 255, 255],
          getLineWidth: 2
        }));
        
        layers.push(new TextLayer({
          id: 'flood-risk-labels',
          data: floodRiskData,
          getPosition: d => d.coordinates,
          getText: d => `${d.risk_level} Risk\n${d.elevation}m elevation`,
          getSize: 10,
          getColor: [255, 255, 255],
          getAngle: 0,
          getTextAnchor: 'middle',
          getAlignmentBaseline: 'bottom',
          getPixelOffset: [0, -25],
          background: true,
          getBackgroundColor: [0, 0, 0, 180]
        }));
      } else {
        // Standard analysis point for other tools
        layers.push(new ScatterplotLayer({
          id: 'analysis-point',
          data: [visData.analysisPoint],
          getPosition: d => d.coordinates,
          getFillColor: colorMap[visData.analysisPoint.type] || [100, 100, 255, 200],
          getRadius: 30,
          pickable: true,
          radiusMinPixels: 8,
          radiusMaxPixels: 25,
          stroked: true,
          getLineColor: [255, 255, 255],
          getLineWidth: 2
        }));
        
        layers.push(new TextLayer({
          id: 'analysis-label',
          data: [visData.analysisPoint],
          getPosition: d => d.coordinates,
          getText: d => d.title,
          getSize: 14,
          getColor: [255, 255, 255],
          getAngle: 0,
          getTextAnchor: 'middle',
          getAlignmentBaseline: 'bottom',
          getPixelOffset: [0, -25],
          background: true,
          getBackgroundColor: [0, 0, 0, 200]
        }));
      }
      
      setViewState(prev => ({
        ...prev,
        longitude: visData.analysisPoint.coordinates[0],
        latitude: visData.analysisPoint.coordinates[1],
        zoom: 12
      }));
    }
    
    return layers;
  };

  const sendMessage = async (message = null, type = null) => {
    const messageText = message || input;
    if (!messageText.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!message) setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${AGENT_API}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: messageText,
          session_id: sessionId,
          visualization_type: type
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage = {
        role: 'assistant',
        content: data.content,
        timestamp: data.timestamp,
        toolCalls: data.tool_calls || [],
        toolOutputs: data.tool_outputs || {}
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Always update map layers when we get tool outputs or visualization type
      if (data.tool_outputs && Object.keys(data.tool_outputs).length > 0) {
        console.log('Tool outputs received:', data.tool_outputs);
        const visData = extractVisualizationData(data.tool_outputs);
        console.log('Extracted visualization data:', visData);
        
        if (visData) {
          setVisualizationData(visData);
          const layers = createMapLayers(visData);
          console.log('Created map layers:', layers);
          setMapLayers(layers);
        }
      } else if (type) {
        // Handle quick action visualization
        const visData = { analysisPoint: { type: type, coordinates: DHAKA_CENTER, title: type.replace('_', ' ').toUpperCase() } };
        setVisualizationData(visData);
        const layers = createMapLayers(visData);
        setMapLayers(layers);
      } else {
        // Clear map layers if no tool outputs
        setMapLayers([]);
        setVisualizationData(null);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        error: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    { label: 'Disaster Tracking', icon: Flame, query: 'disaster', type: 'disaster' },
    { label: 'Urban Heat Islands', icon: Flame, query: 'heat_island', type: 'heat_island' },
    { label: 'Air Quality Analysis', icon: Wind, query: 'air_quality', type: 'air_quality' },
    { label: 'Green Space Equity', icon: TreePine, query: 'green_space', type: 'green_space' },
    { label: 'Flood Risk Analysis', icon: Droplets, query: 'flood_risk', type: 'flood_risk' },
    { label: 'Satellite View', icon: ImageIcon, query: 'satellite', type: 'satellite' }
  ];

  // Add a legend for different visualizations
  const renderVisualizationLegend = () => {
    if (visualizationData?.analysisPoint?.type === 'heat_island') {
      return (
        <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm border border-blue-500/30 rounded-lg p-3 z-20">
          <h3 className="text-white text-sm font-semibold mb-2">Heat Island Intensity</h3>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-white text-xs">Very High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500"></div>
              <span className="text-white text-xs">High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-white text-xs">Medium</span>
            </div>
          </div>
        </div>
      );
    } else if (visualizationData?.analysisPoint?.type === 'air_quality') {
      return (
        <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm border border-blue-500/30 rounded-lg p-3 z-20">
          <h3 className="text-white text-sm font-semibold mb-2">Air Quality Index</h3>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-white text-xs">Very Unhealthy (200+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500"></div>
              <span className="text-white text-xs">Unhealthy (150-200)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-white text-xs">Unhealthy for Sensitive (100-150)</span>
            </div>
          </div>
        </div>
      );
    } else if (visualizationData?.analysisPoint?.type === 'green_space') {
      return (
        <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm border border-blue-500/30 rounded-lg p-3 z-20">
          <h3 className="text-white text-sm font-semibold mb-2">Green Space Quality</h3>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-white text-xs">Good Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-white text-xs">Fair Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500"></div>
              <span className="text-white text-xs">Poor Quality</span>
            </div>
          </div>
        </div>
      );
    } else if (visualizationData?.analysisPoint?.type === 'flood_risk') {
      return (
        <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm border border-blue-500/30 rounded-lg p-3 z-20">
          <h3 className="text-white text-sm font-semibold mb-2">Flood Risk Levels</h3>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-white text-xs">High Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500"></div>
              <span className="text-white text-xs">Medium Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-white text-xs">Low Risk</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-screen bg-slate-950 flex">
      {/* Map visualization - takes 60% of screen */}
      <div className="flex-1 relative">
        {renderVisualizationLegend()}
        <DeckGL
          viewState={viewState}
          onViewStateChange={({ viewState }) => setViewState(viewState)}
          controller={true}
          layers={mapLayers}
          getTooltip={({ object }) => {
            if (object && object.properties) {
              const props = object.properties;
              return {
                html: `<div style="background: rgba(0,0,0,0.9); padding: 8px; border-radius: 4px; max-width: 300px;">
                  <strong>${props.title || props.category}</strong>
                  ${props.date ? `<br/>Date: ${new Date(props.date).toLocaleDateString()}` : ''}
                  ${props.magnitude ? `<br/>Magnitude: ${props.magnitude} ${props.unit || ''}` : ''}
                  ${props.category ? `<br/>Type: ${props.category}` : ''}
                </div>`,
                style: {
                  color: '#fff',
                  fontSize: '12px'
                }
              };
            }
            if (object && object.title) {
              return {
                html: `<div style="background: rgba(0,0,0,0.9); padding: 8px; border-radius: 4px; max-width: 300px;">
                  <strong>${object.title}</strong>
                  ${object.intensity ? `<br/>Heat Intensity: ${object.intensity}` : ''}
                  ${object.coordinates ? `<br/>Location: ${object.coordinates[1].toFixed(4)}, ${object.coordinates[0].toFixed(4)}` : ''}
                </div>`,
                style: {
                  color: '#fff',
                  fontSize: '12px'
                }
              };
            }
            return null;
          }}
        >
          <Map
            mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
            style={{ width: "100%", height: "100%" }}
          />
        </DeckGL>
      </div>

      {/* Chat panel - takes 40% of screen */}
      <div className="w-2/5 flex flex-col bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-md border-l border-blue-500/30">
        {/* Header */}
        <Card className="bg-gradient-to-r from-blue-950/90 to-slate-900/90 border-blue-400/50 m-4 flex-shrink-0">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  Urban Planner AI
                </h1>
                <p className="text-blue-200 text-xs">NASA Earth Observation Data</p>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-400/30">
              <p className="text-green-300 text-xs font-mono">🛰️ LIVE</p>
            </div>
          </div>
        </Card>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto px-4 space-y-3 scrollbar-thin scrollbar-thumb-blue-500/50 scrollbar-track-transparent" style={{ minHeight: 0 }}>
          {messages.map((message, index) => (
            <div key={index} className="flex flex-col">
              <Card
                className={`${
                  message.role === 'user'
                    ? 'ml-8 bg-gradient-to-br from-blue-600/80 to-blue-700/80 border-blue-400/50'
                    : message.error
                    ? 'mr-8 bg-gradient-to-br from-red-900/80 to-red-950/80 border-red-500/50'
                    : 'mr-8 bg-gradient-to-br from-slate-800/80 to-slate-700/80 border-blue-500/30'
                } backdrop-blur-sm`}
              >
                <div className="p-3">
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-3 h-3 text-blue-400" />
                      <span className="text-blue-300 text-xs font-semibold">Planning Assistant</span>
                    </div>
                  )}
                  <div className={`text-sm whitespace-pre-wrap ${
                    message.role === 'user' ? 'text-white' : 'text-gray-200'
                  }`}>
                    {message.content}
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </Card>
              
              {/* Tool outputs visualization */}
              {message.toolOutputs && Object.keys(message.toolOutputs).length > 0 && (
                <div className="mr-8 mt-2 space-y-2">
                  {Object.entries(message.toolOutputs).map(([toolName, output]) => {
                    let displayData = '';
                    let isJson = false;
                    
                    try {
                      const parsed = typeof output === 'string' ? JSON.parse(output.replace(/'/g, '"')) : output;
                      isJson = true;
                      
                      // Format based on tool type
                      if (toolName === 'get_natural_disasters' && parsed.events) {
                        displayData = `Found ${parsed.events.length} active disasters:\n${parsed.events.slice(0, 3).map(e => `• ${e.title} (${e.categories?.[0]?.title || 'Unknown'})`).join('\n')}`;
                      } else if (toolName === 'get_apod' && parsed.title) {
                        displayData = `Title: ${parsed.title}\nDate: ${parsed.date}\nMedia: ${parsed.media_type}`;
                      } else if (parsed.location) {
                        displayData = `Location: ${parsed.location.lat}, ${parsed.location.lon}\nCity: ${parsed.city || 'N/A'}`;
                      } else {
                        displayData = JSON.stringify(parsed, null, 2).substring(0, 300) + '...';
                      }
                    } catch (e) {
                      displayData = typeof output === 'string' ? output.substring(0, 200) + '...' : 'Non-string output';
                    }
                    
                    return (
                      <Card key={toolName} className="bg-slate-900/50 border-slate-600/30 backdrop-blur-sm">
                        <div className="p-2">
                          <div className="flex items-center gap-2 mb-1">
                            <Layers className="w-3 h-3 text-green-400" />
                            <span className="text-green-300 text-xs font-semibold">
                              {toolName.replace(/_/g, ' ').toUpperCase()}
                            </span>
                          </div>
                          <div className="text-xs text-gray-300 font-mono bg-slate-800/50 p-2 rounded max-h-24 overflow-y-auto whitespace-pre-wrap">
                            {displayData}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <Card className="mr-8 bg-gradient-to-br from-slate-800/80 to-slate-700/80 border-blue-500/30 backdrop-blur-sm">
              <div className="p-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                <span className="text-blue-300 text-sm">Analyzing data...</span>
              </div>
            </Card>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 flex-shrink-0 bg-slate-900/50">
          <Card className="bg-gradient-to-r from-slate-800/90 to-slate-700/90 border-blue-500/30 backdrop-blur-sm">
            <div className="p-3">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about urban planning challenges..."
                  className="flex-1 bg-slate-950/50 border border-blue-500/30 rounded px-3 py-2 text-sm text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400/50"
                  disabled={loading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-4 rounded disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-2 gap-1">
                {quickActions.map((action, idx) => (
                  <Button
                    key={idx}
                    onClick={() => sendMessage(action.query, action.type)}
                    className="text-xs bg-slate-900/50 hover:bg-slate-800/50 border border-blue-500/20 text-blue-200 h-auto py-1.5 px-2"
                    disabled={loading}
                  >
                    <action.icon className="w-3 h-3 mr-1" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

