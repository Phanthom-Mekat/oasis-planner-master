"use client";  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '🛰️ Welcome to NASA Earth Observation Assistant!\n\nI use NASA satellite data to help you analyze urban environments:\n\n🔥 **Urban Heat Islands** - MODIS & Landsat thermal data\n💨 **Air Quality Analysis** - AIRS & OMI pollution monitoring\n🌳 **Green Space Mapping** - Vegetation indices from satellite imagery\n🌊 **Flood Risk Zones** - Elevation and precipitation data\n🏗️ **Urban Growth Patterns** - Multi-temporal land use analysis\n🌙 **Nighttime Lights** - VIIRS for infrastructure & economic activity\n🌡️ **Surface Temperature** - Real-time thermal imaging\n📊 **Multi-layer Analysis** - Combined data visualizations\n\nSelect a visualization or ask me about urban planning insights!',
      timestamp: '2025-10-03T12:00:00.000Z',
      isMarkdown: true
    }
  ]);rt React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, Sparkles, Rocket, Satellite, Image as ImageIcon, Loader2, Map as MapIcon, Layers, Square, Pentagon } from 'lucide-react';
import dynamic from 'next/dynamic';
import MarkdownMessage from './MarkdownMessage';

// Dynamically import the MapVisualization component
const MapVisualization = dynamic(() => import('./visualizations/MapVisualization'), { ssr: false });

const NASA_AGENT_API = "http://localhost:8004/api/v1";

export default function NASAAgent() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '�️ Welcome to NASA Earth Observation Assistant!\n\nI use NASA satellite data to help you analyze urban environments:\n\n🔥 **Urban Heat Islands** - MODIS & Landsat thermal data\n� **Air Quality Analysis** - AIRS & OMI pollution monitoring\n🌳 **Green Space Mapping** - Vegetation indices from satellite imagery\n🌊 **Flood Risk Zones** - Elevation and precipitation data\n🏗️ **Urban Growth Patterns** - Multi-temporal land use analysis\n� **Nighttime Lights** - VIIRS for infrastructure & economic activity\n🌡️ **Surface Temperature** - Real-time thermal imaging\n📊 **Multi-layer Analysis** - Combined data visualizations\n\nSelect a visualization or ask me about urban planning insights!',
      timestamp: '2025-10-03T12:00:00.000Z'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [showMap, setShowMap] = useState(true);
  const [visualizationData, setVisualizationData] = useState(null);
  const [viewState, setViewState] = useState({
    longitude: 90.4125,
    latitude: 23.8103,
    zoom: 11,
    pitch: 45,
    bearing: 0
  });
  const [selectedLayerType, setSelectedLayerType] = useState('heatmap');
  const [isTyping, setIsTyping] = useState(false);
  const [mapLabels, setMapLabels] = useState([]);
  const [typingText, setTypingText] = useState('');
  const [currentTypingMessage, setCurrentTypingMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingIntervalRef = useRef(null);

  useEffect(() => {
    setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchVisualizationData = async (layerType, location = null, boundary = null) => {
    try {
      const requestBody = {
        layer_type: layerType,
        location: location || { lat: 23.8103, lon: 90.4125 },
        data_type: 'urban_analysis'
      };
      
      if (boundary) {
        requestBody.boundary = boundary;
      }
      
      const response = await fetch(`${NASA_AGENT_API}/visualization/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch visualization data');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching visualization data:', error);
      return null;
    }
  };

  const handleVisualizationRequest = async (layerType, showMessage = true) => {
    setSelectedLayerType(layerType);
    setShowMap(true);
    
    if (showMessage) {
      setIsTyping(true);
      // Simulate NASA satellite data retrieval delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLoading(true);
    }

    try {
      // Fetch data from backend with optional boundary
      const data = await fetchVisualizationData(layerType, null, selectedArea);
      
      if (data && data.data) {
        // Store the data directly
        setVisualizationData(data);
        
        // Update view state if data has center info
        if (data.metadata && data.metadata.center) {
          setViewState(prev => ({
            ...prev,
            longitude: data.metadata.center[0],
            latitude: data.metadata.center[1],
            zoom: layerType === '3d-scatterplot' ? 14 : layerType === 'line' ? 9 : 10,
            pitch: layerType === '3d-scatterplot' ? 45 : 0
          }));
        }

        // Add system message about visualization if requested
        if (showMessage) {
          const layerDescriptions = {
            'heatmap': 'Urban Heat Island intensity from MODIS satellite thermal data. Red areas indicate higher surface temperatures.',
            'scatterplot': 'Air Quality monitoring stations with AQI levels from NASA AIRS sensor data. Larger circles = worse air quality.',
            'line': 'Urban transportation corridors and connectivity analysis. Colors show traffic intensity patterns.',
            '3d-scatterplot': 'Building heights and urban density from Landsat + OSM data. Pitch the view to see 3D elevation.'
          };
          
          const visualizationMessage = {
            role: 'assistant',
            content: `🛰️ **NASA Earth Observation Data Loaded**\n\n📊 ${layerDescriptions[layerType] || `Displaying ${layerType} visualization`}\n\n📍 Location: Dhaka, Bangladesh\n🔢 Data Points: ${data.data.length}\n📅 Data Source: NASA EOS (Earth Observing System)\n\nUse mouse to pan, zoom, and rotate the view.`,
            timestamp: new Date().toISOString()
          };
          setMessages(prev => [...prev, visualizationMessage]);
        }
        
        // Generate map labels for the layer
        generateMapLabels(layerType, data.metadata.center);
      } else {
        throw new Error('No data received');
      }
    } catch (error) {
      console.error('Error loading visualization:', error);
      if (showMessage) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `❌ Failed to load ${layerType} visualization. Please try again.`,
          timestamp: new Date().toISOString(),
          error: true
        }]);
      }
    } finally {
      if (showMessage) {
        setLoading(false);
        setIsTyping(false);
      }
    }
  };

  const generateMapLabels = (layerType, center) => {
    const [lon, lat] = center;
    const labels = {
      'heatmap': [
        { position: [lon, lat], text: 'City Center\n🔥 High Heat', color: [255, 100, 100] },
        { position: [lon + 0.015, lat + 0.015], text: 'Commercial\n95°C', color: [255, 150, 0] },
        { position: [lon - 0.020, lat - 0.015], text: 'Industrial\n85°C', color: [255, 165, 0] },
        { position: [lon + 0.025, lat + 0.020], text: 'Residential\n70°C', color: [255, 200, 100] },
      ],
      'scatterplot': [
        { position: [lon, lat], text: 'Downtown\nAQI: 180', color: [255, 150, 100] },
        { position: [lon + 0.015, lat + 0.010], text: 'Traffic Zone\nAQI: 195', color: [255, 100, 50] },
        { position: [lon - 0.025, lat - 0.020], text: 'Industrial\nAQI: 220', color: [255, 50, 50] },
        { position: [lon + 0.020, lat + 0.025], text: 'Suburban\nAQI: 110', color: [200, 200, 100] },
      ],
      'line': [
        { position: [lon, lat], text: 'Central Hub\n🚗 10k/day', color: [100, 200, 255] },
        { position: [lon + 0.030, lat + 0.025], text: 'Airport\n8.5k/day', color: [150, 150, 255] },
        { position: [lon - 0.025, lat - 0.020], text: 'Port\n9k/day', color: [100, 150, 255] },
      ],
      '3d-scatterplot': [
        { position: [lon, lat], text: 'CBD\n200-500m', color: [255, 100, 150] },
        { position: [lon + 0.015, lat + 0.015], text: 'Commercial\n100-300m', color: [200, 100, 200] },
        { position: [lon - 0.020, lat - 0.015], text: 'Industrial\n50-150m', color: [150, 100, 250] },
      ]
    };
    setMapLabels(labels[layerType] || []);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${NASA_AGENT_API}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: input,
          session_id: sessionId
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
      
      // Check if response mentions urban planning topics and suggest visualizations
      const urbanKeywords = ['heat island', 'air quality', 'green space', 'flood', 'urban growth', 'pollution'];
      const hasUrbanTopic = urbanKeywords.some(keyword => data.content.toLowerCase().includes(keyword));
      
      if (hasUrbanTopic && !visualizationData) {
        // Auto-suggest visualization
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: '💡 **Tip**: Click a visualization layer above to see NASA satellite data for this analysis!',
            timestamp: new Date().toISOString()
          }]);
        }, 1000);
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

  const renderImageFromData = (data) => {
    try {
      const parsed = typeof data === 'string' ? JSON.parse(data.replace(/'/g, '"')) : data;
      
      if (parsed.url || parsed.hdurl) {
        return (
          <div className="mt-3 rounded-lg overflow-hidden border border-blue-500/30">
            <img 
              src={parsed.url || parsed.hdurl} 
              alt={parsed.title || 'NASA Image'}
              className="w-full h-auto"
              onError={(e) => e.target.style.display = 'none'}
            />
            {parsed.title && (
              <div className="p-2 bg-blue-950/50 text-sm">
                <p className="font-semibold text-blue-200">{parsed.title}</p>
                {parsed.date && <p className="text-blue-300 text-xs">Date: {parsed.date}</p>}
              </div>
            )}
          </div>
        );
      }

      if (parsed.photos && Array.isArray(parsed.photos)) {
        return (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {parsed.photos.slice(0, 4).map((photo, idx) => (
              <div key={idx} className="rounded-lg overflow-hidden border border-red-500/30">
                <img 
                  src={photo.img_src} 
                  alt={`Mars ${photo.camera}`}
                  className="w-full h-32 object-cover"
                  onError={(e) => e.target.style.display = 'none'}
                />
                <div className="p-1 bg-red-950/50 text-xs">
                  <p className="text-red-200">{photo.camera}</p>
                  <p className="text-red-300">Sol {photo.sol}</p>
                </div>
              </div>
            ))}
          </div>
        );
      }

      if (parsed.images && Array.isArray(parsed.images)) {
        return (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {parsed.images.slice(0, 3).map((img, idx) => (
              <div key={idx} className="rounded-lg overflow-hidden border border-blue-500/30">
                <div className="aspect-square bg-blue-950/30 flex items-center justify-center">
                  <Satellite className="w-8 h-8 text-blue-400" />
                </div>
                <div className="p-1 bg-blue-950/50 text-xs">
                  <p className="text-blue-200 truncate">{img.caption || img.identifier}</p>
                </div>
              </div>
            ))}
          </div>
        );
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  const renderToolOutput = (toolName, toolOutput) => {
    const visualTools = ['get_apod', 'get_mars_rover_photos', 'get_epic_images'];
    
    if (visualTools.includes(toolName)) {
      return renderImageFromData(toolOutput);
    }
    
    return null;
  };

  // Map selection state
  const [selectionMode, setSelectionMode] = useState(null); // 'polygon' or 'rectangle'
  const [selectedArea, setSelectedArea] = useState(null);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-900 flex relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="stars-3d"></div>
        <div className="stars-3d-2"></div>
        <div className="stars-3d-3"></div>
      </div>
      
      {/* Glowing orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      
      {/* Map visualization - takes 60% of screen */}
      <div className="flex-1 relative z-10">
        {showMap && (
          <Card className="h-full bg-slate-900/80 border-blue-400/60 backdrop-blur-xl overflow-hidden shadow-2xl shadow-blue-500/20 transform transition-all duration-500 hover:shadow-blue-500/30">
            {/* Animated border glow */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-50 animate-pulse pointer-events-none"></div>
            <div className="h-full flex flex-col">
              {/* Map Controls */}
              <div className="p-3 bg-gradient-to-r from-slate-950/90 via-blue-950/80 to-slate-950/90 border-b border-blue-500/40 backdrop-blur-md relative">
                {/* Scanning line effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent animate-scan pointer-events-none"></div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-blue-400 animate-pulse" />
                    <span className="text-blue-200 font-semibold tracking-wide">NASA Earth Observation Layers</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1 rounded-full border border-blue-500/30">
                    <span className="text-xs text-blue-300">Active:</span>
                    <span className="text-xs font-mono text-blue-400 font-bold">{selectedLayerType.toUpperCase()}</span>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-xs text-green-400 font-semibold">NASA EOS</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={() => handleVisualizationRequest('heatmap')}
                    disabled={loading}
                    className={`text-xs ${selectedLayerType === 'heatmap' ? 'bg-gradient-to-r from-red-600 to-orange-600 shadow-lg shadow-red-500/50 scale-105' : 'bg-red-900/50 hover:scale-105'} hover:bg-red-700 border border-red-500/30 text-red-200 transition-all duration-300 transform font-semibold`}
                  >
                    🔥 Heat Islands
                  </Button>
                  <Button
                    onClick={() => handleVisualizationRequest('scatterplot')}
                    disabled={loading}
                    className={`text-xs ${selectedLayerType === 'scatterplot' ? 'bg-orange-600' : 'bg-orange-900/50'} hover:bg-orange-700 border border-orange-500/30 text-orange-200`}
                  >
                    � Air Quality
                  </Button>
                  <Button
                    onClick={() => handleVisualizationRequest('line')}
                    disabled={loading}
                    className={`text-xs ${selectedLayerType === 'line' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/50 scale-105' : 'bg-blue-900/50 hover:scale-105'} hover:bg-blue-700 border border-blue-500/30 text-blue-200 transition-all duration-300 transform font-semibold`}
                  >
                    🚗 Transport
                  </Button>
                  <Button
                    onClick={() => handleVisualizationRequest('3d-scatterplot')}
                    disabled={loading}
                    className={`text-xs ${selectedLayerType === '3d-scatterplot' ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/50 scale-105' : 'bg-purple-900/50 hover:scale-105'} hover:bg-purple-700 border border-purple-500/30 text-purple-200 transition-all duration-300 transform font-semibold`}
                  >
                    🏙️ Urban Density
                  </Button>
                </div>
              </div>

              {/* Map Container */}
              <div className="flex-1 relative">
                {visualizationData ? (
                  <MapVisualization
                    layerType={selectedLayerType}
                    data={visualizationData}
                    metadata={visualizationData.metadata}
                    viewState={viewState}
                    onViewStateChange={({viewState}) => setViewState(viewState)}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50">
                    <div className="text-center">
                      <Loader2 className="w-16 h-16 text-blue-400 animate-spin mx-auto mb-2" />
                      <p className="text-blue-300">Loading visualization...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Chat panel - takes 40% of screen */}
      <div className="w-2/5 flex flex-col bg-gradient-to-br from-slate-900/90 via-blue-950/50 to-slate-800/90 backdrop-blur-xl border-l border-blue-500/40 shadow-2xl shadow-blue-500/10 relative z-10">
        {/* Animated star field */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="stars"></div>
          <div className="stars2"></div>
        </div>
        {/* Header */}
        <Card className="bg-gradient-to-r from-blue-950/90 via-purple-950/50 to-slate-900/90 border-blue-400/60 m-4 flex-shrink-0 shadow-xl shadow-blue-500/20 relative overflow-hidden">
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shine pointer-events-none"></div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Rocket className="w-8 h-8 text-blue-400 animate-bounce-slow" />
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-4 h-4 text-yellow-400 animate-spin-slow" />
                </div>
                {/* Orbital ring */}
                <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-ping" style={{animationDuration: '3s'}}></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 animate-gradient tracking-wider">
                  NASA AI ASSISTANT
                </h1>
                <p className="text-blue-200 text-xs font-semibold">Earth Observation System • Powered by Gemini AI</p>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/40 shadow-lg shadow-green-500/20 relative overflow-hidden">
              {/* Pulse effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent animate-pulse"></div>
              <p className="text-green-300 text-xs font-mono font-bold relative z-10">🛰️ LIVE</p>
            </div>
          </div>
        </Card>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto px-4 space-y-3 scrollbar-thin scrollbar-thumb-blue-500/50 scrollbar-track-transparent" style={{ minHeight: 0 }}>
          {messages.map((message, index) => (
            <div key={index} className="flex flex-col animate-slide-in">
              <Card
                className={`${
                  message.role === 'user'
                    ? 'ml-8 bg-gradient-to-br from-blue-600/80 to-blue-700/80 border-blue-400/50 shadow-lg shadow-blue-500/20'
                    : message.error
                    ? 'mr-8 bg-gradient-to-br from-red-900/80 to-red-950/80 border-red-500/50 shadow-lg shadow-red-500/20'
                    : 'mr-8 bg-gradient-to-br from-slate-800/80 via-blue-900/30 to-slate-700/80 border-blue-500/30 shadow-lg shadow-blue-500/10'
                } backdrop-blur-md transform transition-all duration-300 hover:scale-[1.02]`}
              >
                <div className="p-3">
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-1">
                      <Satellite className="w-3 h-3 text-blue-400" />
                      <span className="text-blue-300 text-xs font-semibold">NASA AI</span>
                    </div>
                  )}
                  <div className={`text-sm whitespace-pre-wrap ${
                    message.role === 'user' ? 'text-white' : 'text-gray-200'
                  }`}>
                    {message.content}
                  </div>

                  {message.toolOutputs && Object.keys(message.toolOutputs).length > 0 && (
                    <div className="mt-2">
                      {Object.entries(message.toolOutputs).map(([toolName, output]) => (
                        <div key={toolName}>
                          {renderToolOutput(toolName, output)}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-1 text-xs text-gray-400" suppressHydrationWarning>
                    {typeof window !== 'undefined' && new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </Card>
            </div>
          ))}

          {isTyping && (
            <Card className="mr-8 bg-gradient-to-br from-blue-900/50 to-slate-800/80 border-blue-500/40 backdrop-blur-md shadow-lg shadow-blue-500/20 animate-pulse-slow">
              <div className="p-3 flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></span>
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                </div>
                <span className="text-blue-300 text-sm font-semibold">🛰️ Retrieving NASA satellite data...</span>
              </div>
            </Card>
          )}
          
          {loading && !isTyping && (
            <Card className="mr-8 bg-gradient-to-br from-slate-800/80 to-slate-700/80 border-blue-500/30 backdrop-blur-md shadow-lg shadow-blue-500/20">
              <div className="p-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                <span className="text-blue-300 text-sm">Processing data...</span>
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
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about urban planning... (e.g., 'Analyze heat islands')"
                  className="flex-1 bg-slate-950/50 border border-blue-500/30 rounded-lg px-3 py-2 text-sm text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400/70 focus:ring-2 focus:ring-blue-500/30 transition-all"
                  disabled={loading || isTyping}
                />
                <Button
                  onClick={sendMessage}
                  disabled={loading || isTyping || !input.trim()}
                  className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-600 text-white px-4 rounded-lg disabled:opacity-50 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all transform hover:scale-105"
                >
                  {loading || isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-2 gap-1">
                <Button
                  onClick={() => {
                    setInput("Analyze urban heat islands in Dhaka using NASA MODIS data");
                    handleVisualizationRequest('heatmap', false);
                  }}
                  className="text-xs bg-gradient-to-r from-red-900/30 to-orange-900/30 hover:from-red-800/60 hover:to-orange-800/60 border border-red-500/30 text-red-200 h-auto py-1.5 px-2 transition-all transform hover:scale-105 shadow-md hover:shadow-red-500/30 font-semibold"
                  disabled={loading || isTyping}
                >
                  <Sparkles className="w-3 h-3 mr-1 animate-pulse" />
                  Heat Analysis
                </Button>
                <Button
                  onClick={() => {
                    setInput("Show air quality patterns from NASA AIRS satellite sensors");
                    handleVisualizationRequest('scatterplot', false);
                  }}
                  className="text-xs bg-gradient-to-r from-orange-900/30 to-yellow-900/30 hover:from-orange-800/60 hover:to-yellow-800/60 border border-orange-500/30 text-orange-200 h-auto py-1.5 px-2 transition-all transform hover:scale-105 shadow-md hover:shadow-orange-500/30 font-semibold"
                  disabled={loading || isTyping}
                >
                  <ImageIcon className="w-3 h-3 mr-1 animate-pulse" />
                  Pollution Map
                </Button>
                <Button
                  onClick={() => {
                    setInput("Display transportation corridors and connectivity patterns");
                    handleVisualizationRequest('line', false);
                  }}
                  className="text-xs bg-gradient-to-r from-blue-900/30 to-cyan-900/30 hover:from-blue-800/60 hover:to-cyan-800/60 border border-blue-500/30 text-blue-200 h-auto py-1.5 px-2 transition-all transform hover:scale-105 shadow-md hover:shadow-blue-500/30 font-semibold"
                  disabled={loading || isTyping}
                >
                  <Rocket className="w-3 h-3 mr-1 animate-pulse" />
                  Transport
                </Button>
                <Button
                  onClick={() => {
                    setInput("Show 3D urban density and building heights from satellite data");
                    handleVisualizationRequest('3d-scatterplot', false);
                  }}
                  className="text-xs bg-gradient-to-r from-purple-900/30 to-pink-900/30 hover:from-purple-800/60 hover:to-pink-800/60 border border-purple-500/30 text-purple-200 h-auto py-1.5 px-2 transition-all transform hover:scale-105 shadow-md hover:shadow-purple-500/30 font-semibold"
                  disabled={loading || isTyping}
                >
                  <Satellite className="w-3 h-3 mr-1 animate-pulse" />
                  3D Density
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <style jsx global>{`
        .stars, .stars2 {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          display: block;
        }
        
        .stars {
          background: transparent url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="10" cy="10" r="0.5" fill="white"/><circle cx="30" cy="20" r="0.3" fill="white"/><circle cx="50" cy="5" r="0.4" fill="white"/><circle cx="70" cy="15" r="0.2" fill="white"/><circle cx="90" cy="8" r="0.5" fill="white"/></svg>') repeat top center;
          animation: move-stars 100s linear infinite;
        }
        
        .stars2 {
          background: transparent url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="15" cy="25" r="0.3" fill="white"/><circle cx="35" cy="45" r="0.4" fill="white"/><circle cx="55" cy="30" r="0.2" fill="white"/><circle cx="75" cy="40" r="0.5" fill="white"/><circle cx="95" cy="35" r="0.3" fill="white"/></svg>') repeat top center;
          animation: move-stars 150s linear infinite;
          opacity: 0.5;
        }
        
        @keyframes move-stars {
          from { transform: translateY(0); }
          to { transform: translateY(-100vh); }
        }
        
        /* 3D particle stars */
        .stars-3d, .stars-3d-2, .stars-3d-3 {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          display: block;
        }
        
        .stars-3d {
          background: transparent url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="20" cy="20" r="1" fill="white" opacity="0.8"/><circle cx="60" cy="40" r="0.8" fill="cyan" opacity="0.6"/><circle cx="100" cy="10" r="1.2" fill="white" opacity="0.9"/><circle cx="140" cy="30" r="0.6" fill="blue" opacity="0.5"/><circle cx="180" cy="16" r="1" fill="white" opacity="0.7"/></svg>') repeat top center;
          animation: move-stars-3d 120s linear infinite;
          opacity: 0.4;
        }
        
        .stars-3d-2 {
          background: transparent url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="30" cy="50" r="0.7" fill="cyan" opacity="0.8"/><circle cx="70" cy="90" r="1" fill="white" opacity="0.6"/><circle cx="110" cy="60" r="0.5" fill="blue" opacity="0.7"/><circle cx="150" cy="80" r="0.9" fill="white" opacity="0.8"/></svg>') repeat top center;
          animation: move-stars-3d 180s linear infinite;
          opacity: 0.3;
        }
        
        .stars-3d-3 {
          background: transparent url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="40" cy="70" r="0.6" fill="purple" opacity="0.5"/><circle cx="80" cy="120" r="0.8" fill="white" opacity="0.4"/><circle cx="120" cy="90" r="1.1" fill="cyan" opacity="0.6"/><circle cx="160" cy="130" r="0.7" fill="blue" opacity="0.5"/></svg>') repeat top center;
          animation: move-stars-3d 240s linear infinite;
          opacity: 0.2;
        }
        
        @keyframes move-stars-3d {
          from { transform: translateY(0) translateX(0); }
          to { transform: translateY(-100vh) translateX(20px); }
        }
        
        /* Scanning line animation */
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        .animate-scan {
          animation: scan 3s ease-in-out infinite;
        }
        
        /* Shine effect */
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        
        .animate-shine {
          animation: shine 4s ease-in-out infinite;
        }
        
        /* Gradient animation */
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        
        /* Slow bounce */
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        /* Slow spin */
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        
        /* Slow pulse */
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        /* Slide in */
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}


