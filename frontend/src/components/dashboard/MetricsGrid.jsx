"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Shield, DollarSign, Users, Leaf, Thermometer, Droplets, Zap, Wind, Eye, RefreshCw, Satellite } from "lucide-react";

export default function MetricsGrid({ detailed = false }) {
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [realTimeMode, setRealTimeMode] = useState(false);

  // Simulate real-time data updates
  useEffect(() => {
    if (realTimeMode) {
      const interval = setInterval(() => {
        setLastUpdated(new Date());
        // Here you would typically fetch new data from APIs
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [realTimeMode]);

  const metrics = [
    {
      title: "Climate Resilience Score",
      value: "67",
      unit: "/100",
      change: "+5",
      changeType: "positive",
      icon: Shield,
      description: "Overall city resilience to climate impacts",
      trend: [62, 64, 65, 66, 67],
      source: "NASA GISS",
      critical: false
    },
    {
      title: "Green Coverage",
      value: "23.4",
      unit: "%",
      change: "+2.1",
      changeType: "positive",
      icon: Leaf,
      description: "Percentage of area with vegetation",
      trend: [21.3, 21.8, 22.5, 23.1, 23.4],
      source: "Landsat 8",
      critical: false
    },
    {
      title: "Average Temperature",
      value: "28.3",
      unit: "°C",
      change: "+0.5",
      changeType: "negative",
      icon: Thermometer,
      description: "City-wide average temperature",
      trend: [27.8, 27.9, 28.0, 28.2, 28.3],
      source: "NOAA",
      critical: true
    },
    {
      title: "Flood Risk Areas",
      value: "142",
      unit: "zones",
      change: "-8",
      changeType: "positive",
      icon: Droplets,
      description: "Areas at high flood risk",
      trend: [150, 148, 145, 144, 142],
      source: "USGS",
      critical: false
    },
    {
      title: "Air Quality Index",
      value: "89",
      unit: "AQI",
      change: "-12",
      changeType: "positive",
      icon: Wind,
      description: "Current air quality measurement",
      trend: [101, 98, 95, 91, 89],
      source: "EPA",
      critical: false
    },
    {
      title: "Energy Efficiency",
      value: "78.2",
      unit: "%",
      change: "+3.4",
      changeType: "positive",
      icon: Zap,
      description: "Building energy performance score",
      trend: [74.8, 75.9, 76.8, 77.5, 78.2],
      source: "Smart Grid",
      critical: false
    },
    {
      title: "Investment ROI",
      value: "3.2x",
      unit: "",
      change: "+0.4x",
      changeType: "positive",
      icon: DollarSign,
      description: "Return on green infrastructure investment",
      trend: [2.8, 2.9, 3.0, 3.1, 3.2],
      source: "Economic Analysis",
      critical: false
    },
    {
      title: "Population Benefited",
      value: "1.2M",
      unit: "",
      change: "+150K",
      changeType: "positive",
      icon: Users,
      description: "People in improved climate zones",
      trend: [1.05, 1.08, 1.12, 1.18, 1.2],
      source: "Census Data",
      critical: false
    }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      setLastUpdated(new Date());
    }, 1500);
  };

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Climate Metrics</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRealTimeMode(!realTimeMode)}
            className={realTimeMode ? "bg-green-50 border-green-200 text-green-700" : ""}
          >
            <Eye className="h-4 w-4 mr-1" />
            {realTimeMode ? "Live" : "Static"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-3">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card 
              key={index} 
              className={`hover:shadow-sm transition-all duration-200 border-slate-200/60 dark:border-slate-700/60 ${
                metric.critical ? "border-l-4 border-l-red-500" : ""
              }`}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${
                      metric.changeType === "positive" 
                        ? "bg-green-50 dark:bg-green-900/20" 
                        : "bg-red-50 dark:bg-red-900/20"
                    }`}>
                      <Icon className={`h-3.5 w-3.5 ${
                        metric.changeType === "positive" 
                          ? "text-green-600 dark:text-green-400" 
                          : "text-red-600 dark:text-red-400"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{metric.title}</p>
                        {metric.critical && (
                          <Badge variant="destructive" className="text-xs px-1 py-0">
                            Critical
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                        {metric.description}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Satellite className="h-3 w-3 text-slate-400" />
                        <span className="text-xs text-slate-400">{metric.source}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{metric.value}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{metric.unit}</span>
                    </div>
                    <div className="flex items-center justify-end gap-1">
                      {metric.changeType === "positive" ? (
                        <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                      )}
                      <span className={`text-xs font-medium ${
                        metric.changeType === "positive" 
                          ? "text-green-600 dark:text-green-400" 
                          : "text-red-600 dark:text-red-400"
                      }`}>
                        {metric.change}
                      </span>
                    </div>
                    {/* Mini trend chart */}
                    {detailed && (
                      <div className="flex items-end gap-0.5 mt-1">
                        {metric.trend.map((value, i) => (
                          <div
                            key={i}
                            className={`w-1 bg-gradient-to-t ${
                              metric.changeType === "positive" 
                                ? "from-green-200 to-green-500" 
                                : "from-red-200 to-red-500"
                            } rounded-sm`}
                            style={{ height: `${(value / Math.max(...metric.trend)) * 20}px` }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {detailed && (
        <Card className="border-slate-200/60 dark:border-slate-700/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-900 dark:text-slate-100">Environmental Justice</CardTitle>
            <CardDescription className="text-xs text-slate-600 dark:text-slate-400">
              Equity assessment across communities
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">Low-income coverage</span>
                <Badge variant="secondary" className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">78%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">Vulnerable protection</span>
                <Badge variant="secondary" className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">65%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">Engagement level</span>
                <Badge variant="secondary" className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">82%</Badge>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                <div className="bg-gradient-to-r from-emerald-500 to-blue-500 h-1.5 rounded-full" style={{width: "75%"}}></div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Overall Score: 75/100
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
