'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Wind, Droplet, TrendingUp, Zap } from 'lucide-react';

const DashboardScene3D = dynamic(() => import('@/components/three/DashboardScene3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 rounded-xl bg-gradient-to-br from-blue-900/50 to-purple-900/50 flex items-center justify-center">
      <div className="text-white animate-pulse">Loading 3D Visualization...</div>
    </div>
  ),
});

export default function EnhancedMetricsGrid() {
  const [metrics] = useState([
    {
      icon: Activity,
      label: 'Temperature',
      value: '35.9°C',
      change: '+2.3°C',
      status: 'critical',
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
    },
    {
      icon: Wind,
      label: 'Air Quality',
      value: 'AQI 150',
      change: 'Poor',
      status: 'warning',
      color: 'from-orange-500 to-yellow-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
    },
    {
      icon: Droplet,
      label: 'Flood Risk',
      value: 'HIGH',
      change: '120K affected',
      status: 'critical',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
    {
      icon: TrendingUp,
      label: 'Heat Island',
      value: '+5.3°C',
      change: 'vs Rural',
      status: 'warning',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
    },
  ]);

  return (
    <div className="space-y-4">
      {/* 3D Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="border-2 border-blue-500/20 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-800 overflow-hidden rounded-xl shadow-lg">
          <div className="p-3 pb-2 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                Real-Time Climate Intelligence
              </h3>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs font-semibold">
                Live
              </Badge>
            </div>
          </div>
          <div className="p-3">
            <Suspense fallback={<div className="h-48 bg-slate-800 animate-pulse rounded-lg" />}>
              <DashboardScene3D metrics={metrics} />
            </Suspense>
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div className={`relative border ${metric.borderColor} ${metric.bgColor} hover:shadow-lg transition-all duration-200 group cursor-pointer rounded-lg p-3 bg-white dark:bg-slate-800`}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${metric.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <Badge
                    variant={metric.status === 'critical' ? 'destructive' : 'secondary'}
                    className="text-[10px] font-bold px-1.5 py-0.5 h-5"
                  >
                    {metric.status.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="text-slate-500 dark:text-slate-400 text-[10px] font-semibold mb-1 uppercase tracking-wider">{metric.label}</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white mb-0.5">
                  {metric.value}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{metric.change}</div>
                
                {/* Pulse Animation */}
                <div className={`absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${metric.color} animate-pulse`} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="relative overflow-hidden border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-slate-800 dark:via-blue-950/20 dark:to-purple-950/20 rounded-xl shadow-lg">
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10"></div>
          
          <div className="relative p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Population Monitored', value: '22M', icon: '👥', color: 'from-blue-500 to-cyan-500' },
                { label: 'Area Coverage', value: '306.4 km²', icon: '📍', color: 'from-green-500 to-emerald-500' },
                { label: 'NASA Satellites', value: '7', icon: '🛰️', color: 'from-purple-500 to-pink-500' },
                { label: 'Data Points', value: '15.2K', icon: '📊', color: 'from-orange-500 to-red-500' },
              ].map((stat, i) => (
                <div key={i} className="text-center group">
                  <div className="relative inline-flex items-center justify-center mb-2">
                    <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-10 group-hover:opacity-20 transition-opacity rounded-full blur-xl`}></div>
                    <div className="text-2xl relative z-10 group-hover:scale-110 transition-transform duration-200">{stat.icon}</div>
                  </div>
                  <div className={`text-xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1 group-hover:scale-105 transition-transform duration-200`}>
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
