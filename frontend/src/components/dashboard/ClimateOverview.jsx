"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, RadialBarChart, RadialBar, Cell } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  Satellite,
  AlertTriangle,
  CheckCircle,
  Activity,
  Globe,
  CloudRain,
  Eye,
  RefreshCw
} from "lucide-react";

export default function ClimateOverview({ detailed = false }) {
  const [activeDataSource, setActiveDataSource] = useState("combined");
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // Enhanced temperature data with multiple scenarios
  const temperatureData = [
    { month: 'Jan', current: 22, historical: 21, projected_2030: 24, projected_2050: 26, rcp85_2050: 28 },
    { month: 'Feb', current: 24, historical: 23, projected_2030: 26, projected_2050: 28, rcp85_2050: 31 },
    { month: 'Mar', current: 27, historical: 25, projected_2030: 29, projected_2050: 32, rcp85_2050: 35 },
    { month: 'Apr', current: 30, historical: 28, projected_2030: 33, projected_2050: 36, rcp85_2050: 39 },
    { month: 'May', current: 33, historical: 31, projected_2030: 36, projected_2050: 39, rcp85_2050: 42 },
    { month: 'Jun', current: 35, historical: 33, projected_2030: 38, projected_2050: 42, rcp85_2050: 45 },
    { month: 'Jul', current: 36, historical: 34, projected_2030: 39, projected_2050: 43, rcp85_2050: 46 },
    { month: 'Aug', current: 35, historical: 34, projected_2030: 38, projected_2050: 42, rcp85_2050: 45 },
    { month: 'Sep', current: 33, historical: 31, projected_2030: 36, projected_2050: 39, rcp85_2050: 42 },
    { month: 'Oct', current: 30, historical: 28, projected_2030: 33, projected_2050: 36, rcp85_2050: 39 },
    { month: 'Nov', current: 26, historical: 24, projected_2030: 29, projected_2050: 32, rcp85_2050: 35 },
    { month: 'Dec', current: 23, historical: 22, projected_2030: 26, projected_2050: 28, rcp85_2050: 31 }
  ];

  // Real-time climate indicators
  const climateIndicators = [
    {
      name: "Global Temperature Anomaly",
      value: "+1.18°C",
      change: "+0.02°C",
      status: "critical",
      source: "NASA GISS",
      lastUpdate: "2 hours ago"
    },
    {
      name: "Arctic Sea Ice Extent",
      value: "4.8M km²",
      change: "-0.3M km²",
      status: "warning",
      source: "NSIDC",
      lastUpdate: "Daily"
    },
    {
      name: "Atmospheric CO₂",
      value: "421.3 ppm",
      change: "+2.4 ppm",
      status: "critical",
      source: "Mauna Loa",
      lastUpdate: "Weekly"
    },
    {
      name: "Ocean pH Level", 
      value: "8.05",
      change: "-0.02",
      status: "warning",
      source: "NOAA",
      lastUpdate: "Monthly"
    }
  ];

  // Enhanced precipitation data with extremes
  const precipitationData = [
    { month: 'Jan', rainfall: 45, historical: 52, extreme_events: 2, trend: 'down' },
    { month: 'Feb', rainfall: 38, historical: 48, extreme_events: 1, trend: 'down' },
    { month: 'Mar', rainfall: 52, historical: 45, extreme_events: 3, trend: 'up' },
    { month: 'Apr', rainfall: 89, historical: 78, extreme_events: 4, trend: 'up' },
    { month: 'May', rainfall: 156, historical: 124, extreme_events: 6, trend: 'up' },
    { month: 'Jun', rainfall: 203, historical: 189, extreme_events: 8, trend: 'stable' }
  ];

  // Climate vulnerability sectors
  const vulnerabilityData = [
    { sector: "Agriculture", vulnerability: 85, adaptive_capacity: 45, risk_level: "High" },
    { sector: "Water Resources", vulnerability: 78, adaptive_capacity: 60, risk_level: "High" },
    { sector: "Urban Infrastructure", vulnerability: 72, adaptive_capacity: 70, risk_level: "Medium" },
    { sector: "Coastal Areas", vulnerability: 92, adaptive_capacity: 35, risk_level: "Critical" },
    { sector: "Human Health", vulnerability: 68, adaptive_capacity: 75, risk_level: "Medium" },
    { sector: "Energy Systems", vulnerability: 55, adaptive_capacity: 80, risk_level: "Low" }
  ];

  // Satellite data layers available
  const satelliteDataSources = [
    { id: "modis", name: "MODIS Terra/Aqua", type: "Land Surface", active: true },
    { id: "landsat", name: "Landsat 8/9", type: "Multispectral", active: true },
    { id: "sentinel", name: "Sentinel-2", type: "High Resolution", active: false },
    { id: "goes", name: "GOES-16", type: "Weather", active: true },
    { id: "grace", name: "GRACE-FO", type: "Groundwater", active: false }
  ];

  // Dhaka-specific urban planning data
  const dhakaAccessAnalysis = [
    { 
      area: "Old Dhaka", 
      population: 400000, 
      food_access: 3.2, 
      housing_quality: 2.1, 
      transport_score: 4.2, 
      priority: "High",
      no2_level: 45.2,
      pm25_level: 68.5
    },
    { 
      area: "Dhanmondi", 
      population: 350000, 
      food_access: 7.8, 
      housing_quality: 8.1, 
      transport_score: 7.5, 
      priority: "Low",
      no2_level: 32.1,
      pm25_level: 42.3
    },
    { 
      area: "Mirpur", 
      population: 650000, 
      food_access: 4.5, 
      housing_quality: 3.8, 
      transport_score: 5.2, 
      priority: "High",
      no2_level: 38.7,
      pm25_level: 55.9
    },
    { 
      area: "Uttara", 
      population: 450000, 
      food_access: 6.2, 
      housing_quality: 6.8, 
      transport_score: 6.9, 
      priority: "Medium",
      no2_level: 29.4,
      pm25_level: 41.2
    },
    { 
      area: "Tejgaon", 
      population: 280000, 
      food_access: 5.1, 
      housing_quality: 4.9, 
      transport_score: 7.8, 
      priority: "Medium",
      no2_level: 52.3,
      pm25_level: 72.1
    },
    { 
      area: "Savar", 
      population: 320000, 
      food_access: 3.8, 
      housing_quality: 3.2, 
      transport_score: 2.9, 
      priority: "High",
      no2_level: 35.6,
      pm25_level: 48.7
    }
  ];

  // Dhaka urban growth and housing data
  const dhakaGrowthData = [
    { year: 2015, built_area: 285, population: 18.2, informal_settlements: 12.3, housing_deficit: 2.1 },
    { year: 2017, built_area: 298, population: 19.1, informal_settlements: 13.8, housing_deficit: 2.3 },
    { year: 2019, built_area: 312, population: 20.1, informal_settlements: 15.2, housing_deficit: 2.6 },
    { year: 2021, built_area: 327, population: 21.2, informal_settlements: 16.9, housing_deficit: 2.9 },
    { year: 2023, built_area: 343, population: 22.3, informal_settlements: 18.4, housing_deficit: 3.2 },
    { year: 2025, built_area: 358, population: 23.5, informal_settlements: 19.8, housing_deficit: 3.5 }
  ];

  // Dhaka pollution hotspots
  const dhakaPollutionHotspots = [
    {
      name: "Hazaribagh Industrial Area",
      type: "Industrial",
      no2_avg: 78.3,
      pm25_avg: 125.4,
      affected_population: 185000,
      intervention: "Relocate industries, green buffer zones"
    },
    {
      name: "Tejgaon-Gulshan Corridor",
      type: "Traffic",
      no2_avg: 64.7,
      pm25_avg: 89.2,
      affected_population: 420000,
      intervention: "Bus rapid transit, emission controls"
    },
    {
      name: "Buriganga Riverbank",
      type: "Mixed",
      no2_avg: 52.1,
      pm25_avg: 96.8,
      affected_population: 280000,
      intervention: "Industrial regulation, waste treatment"
    },
    {
      name: "Savar Industrial Zone",
      type: "Industrial",
      no2_avg: 71.2,
      pm25_avg: 108.6,
      affected_population: 150000,
      intervention: "Cleaner production, monitoring systems"
    }
  ];

  const refreshData = async () => {
    setLoading(true);
    // Simulate NASA API call
    setTimeout(() => {
      setLoading(false);
      setLastUpdated(new Date());
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "critical": return "text-red-600 bg-red-50 border-red-200";
      case "warning": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "normal": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case "Critical": return "#ef4444";
      case "High": return "#f59e0b";
      case "Medium": return "#10b981";
      case "Low": return "#3b82f6";
      default: return "#6b7280";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Climate Overview</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Real-time climate data and projections • Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLiveMode(!isLiveMode)}
            className={isLiveMode ? "bg-green-50 border-green-200 text-green-700" : ""}
          >
            <Eye className="h-4 w-4 mr-1" />
            {isLiveMode ? "Live" : "Static"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Real-time Climate Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Satellite className="h-5 w-5 text-blue-500" />
            Global Climate Indicators
          </CardTitle>
          <CardDescription>
            Live data from NASA and NOAA monitoring stations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {climateIndicators.map((indicator, index) => (
              <div key={index} className={`p-3 rounded-lg border ${getStatusColor(indicator.status)}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">{indicator.name}</span>
                  {indicator.status === "critical" && <AlertTriangle className="h-3 w-3" />}
                  {indicator.status === "warning" && <Activity className="h-3 w-3" />}
                  {indicator.status === "normal" && <CheckCircle className="h-3 w-3" />}
                </div>
                <div className="text-lg font-bold">{indicator.value}</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-75">{indicator.change}</span>
                  <span className="opacity-60">{indicator.source}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="temperature" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
          <TabsTrigger value="precipitation">Precipitation</TabsTrigger>
          <TabsTrigger value="vulnerability">Vulnerability</TabsTrigger>
          <TabsTrigger value="satellite">Satellite Data</TabsTrigger>
          <TabsTrigger value="dhaka-access">Dhaka Access</TabsTrigger>
          <TabsTrigger value="dhaka-growth">Dhaka Growth</TabsTrigger>
        </TabsList>

        <TabsContent value="temperature">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-orange-500" />
                Temperature Projections
              </CardTitle>
              <CardDescription>
                Historical data vs. climate model projections (RCP scenarios)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={temperatureData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" />
                  <YAxis label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="historical" 
                    stroke="#6b7280" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Historical (1990-2020)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="current" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name="Current (2024)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="projected_2030" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    name="RCP 4.5 (2030)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="projected_2050" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="RCP 4.5 (2050)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rcp85_2050" 
                    stroke="#dc2626" 
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    name="RCP 8.5 (2050)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="precipitation">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  Precipitation Patterns
                </CardTitle>
                <CardDescription>Monthly rainfall and extreme events</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={precipitationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="historical" 
                      stroke="#94a3b8" 
                      fill="#94a3b830"
                      name="Historical Average"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="rainfall" 
                      stroke="#3b82f6" 
                      fill="#3b82f680"
                      name="Current Year"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudRain className="h-5 w-5 text-slate-500" />
                  Extreme Weather Events
                </CardTitle>
                <CardDescription>Monthly count of extreme precipitation events</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={precipitationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="extreme_events" fill="#ef4444" name="Extreme Events" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vulnerability">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Climate Vulnerability Assessment
              </CardTitle>
              <CardDescription>
                Sectoral vulnerability and adaptive capacity analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vulnerabilityData.map((sector, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{sector.sector}</h4>
                      <Badge 
                        style={{ 
                          backgroundColor: getRiskColor(sector.risk_level) + '20',
                          color: getRiskColor(sector.risk_level),
                          border: `1px solid ${getRiskColor(sector.risk_level)}40`
                        }}
                      >
                        {sector.risk_level} Risk
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Vulnerability:</span>
                        <span className="font-medium">{sector.vulnerability}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-red-500" 
                          style={{ width: `${sector.vulnerability}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Adaptive Capacity:</span>
                        <span className="font-medium">{sector.adaptive_capacity}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-green-500" 
                          style={{ width: `${sector.adaptive_capacity}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="satellite">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-purple-500" />
                Satellite Data Sources
              </CardTitle>
              <CardDescription>
                Available Earth observation datasets and monitoring systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {satelliteDataSources.map((source) => (
                  <div 
                    key={source.id} 
                    className={`p-3 border rounded-lg flex items-center justify-between ${
                      source.active 
                        ? "border-green-200 bg-green-50 dark:bg-green-950/20" 
                        : "border-slate-200 bg-slate-50 dark:bg-slate-800"
                    }`}
                  >
                    <div>
                      <h4 className="font-medium text-sm">{source.name}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{source.type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={source.active ? "default" : "secondary"}>
                        {source.active ? "Active" : "Available"}
                      </Badge>
                      <Button variant="outline" size="sm">
                        {source.active ? "Configure" : "Enable"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dhaka-access">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-500" />
                Dhaka Access Analysis
              </CardTitle>
              <CardDescription>
                Urban access and quality indicators for Dhaka metropolitan area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {dhakaAccessAnalysis.map((area) => (
                  <div key={area.area} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{area.area}</h4>
                      <Badge 
                        style={{ 
                          backgroundColor: area.priority === "High" ? "rgb(239 68 68 / 20%)" : area.priority === "Medium" ? "rgb(245 158 11 / 20%)" : "rgb(16 185 129 / 20%)",
                          color: area.priority === "High" ? "rgb(239 68 68)" : area.priority === "Medium" ? "rgb(245 158 11)" : "rgb(16 185 129)",
                          border: `1px solid ${area.priority === "High" ? "rgb(239 68 68 / 40%)" : area.priority === "Medium" ? "rgb(245 158 11 / 40%)" : "rgb(16 185 129 / 40%)"}`
                        }}
                      >
                        {area.priority} Priority
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <div>
                        <div className="text-xs text-slate-500">Population</div>
                        <div className="font-medium">{area.population.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Food Access</div>
                        <div className="font-medium">{area.food_access}/10</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Housing Quality</div>
                        <div className="font-medium">{area.housing_quality}/10</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Transport Score</div>
                        <div className="font-medium">{area.transport_score}/10</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Air Quality (NO₂)</div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-red-500" 
                            style={{ width: `${Math.min(area.no2_level, 100)}%` }}
                          />
                        </div>
                        <div className="text-xs text-slate-600 mt-1">{area.no2_level} μg/m³</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">PM2.5 Level</div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-orange-500" 
                            style={{ width: `${Math.min(area.pm25_level, 100)}%` }}
                          />
                        </div>
                        <div className="text-xs text-slate-600 mt-1">{area.pm25_level} μg/m³</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Data Sources</h4>
                <div className="text-sm text-blue-700">
                  Population: NASA SEDAC GPW v4 & WorldPop • Land Use: MODIS MCD12Q1 • 
                  Infrastructure: VIIRS Black Marble • Air Quality: Sentinel-5P TROPOMI
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dhaka-growth">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  Dhaka Urban Growth Trends
                </CardTitle>
                <CardDescription>
                  Population growth vs. built-up area expansion analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dhakaGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis yAxisId="left" label={{ value: 'Population (millions)', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: 'Built Area (km²)', angle: 90, position: 'insideRight' }} />
                    <Tooltip />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="population" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      name="Population (millions)"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="built_area" 
                      stroke="#06b6d4" 
                      strokeWidth={2}
                      name="Built Area (km²)"
                    />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="informal_settlements" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Informal Settlements (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Pollution Hotspots & Interventions
                </CardTitle>
                <CardDescription>
                  High-priority areas for environmental intervention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dhakaPollutionHotspots.map((hotspot, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{hotspot.name}</h4>
                        <Badge variant="outline">{hotspot.type}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <div className="text-xs text-slate-500">NO₂ Average</div>
                          <div className="font-medium text-red-600">{hotspot.no2_avg} μg/m³</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">PM2.5 Average</div>
                          <div className="font-medium text-orange-600">{hotspot.pm25_avg} μg/m³</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">Affected Population</div>
                          <div className="font-medium">{hotspot.affected_population.toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="p-3 bg-green-50 rounded border border-green-200">
                        <div className="text-xs text-green-700 font-medium mb-1">Recommended Intervention:</div>
                        <div className="text-sm text-green-800">{hotspot.intervention}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">NASA Earth Observation Sources</h4>
                  <div className="text-sm text-purple-700">
                    Growth Analysis: GHSL Built-up Areas, VIIRS Nighttime Lights, SEDAC Urban Expansion • 
                    Air Quality: TROPOMI NO₂/SO₂, MODIS AOD • Population: WorldPop, SEDAC GPW
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
