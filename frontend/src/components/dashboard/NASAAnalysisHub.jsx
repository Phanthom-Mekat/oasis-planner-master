'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Wind, 
  TrendingUp, 
  MapPin, 
  Layers, 
  Eye,
  ChevronRight,
  Sparkles 
} from 'lucide-react';
import Link from 'next/link';

const analysisTypes = [
  {
    id: 'access',
    title: 'Access to Services',
    description: 'Identify communities with limited access to food, housing, and transportation',
    icon: Users,
    gradient: 'from-blue-500 via-blue-600 to-cyan-600',
    shadowColor: 'shadow-blue-500/50',
    bgGlow: 'bg-blue-400/20',
    iconColor: 'text-blue-300',
    badgeColor: 'bg-blue-400/20 text-blue-200 border-blue-400/30',
    datasets: ['NASA SEDAC Population', 'EU GHSL Settlements', 'VIIRS Nighttime Lights'],
    href: '/dashboard/access',
    stats: { areas: 7, critical: 2, coverage: '85%' }
  },
  {
    id: 'pollution',
    title: 'Pollution & Health',
    description: 'Track air and water pollution to protect vulnerable communities',
    icon: Wind,
    gradient: 'from-red-500 via-orange-600 to-yellow-600',
    shadowColor: 'shadow-red-500/50',
    bgGlow: 'bg-red-400/20',
    iconColor: 'text-red-300',
    badgeColor: 'bg-red-400/20 text-red-200 border-red-400/30',
    datasets: ['Sentinel-5P TROPOMI', 'MODIS AOD', 'Landsat Water Quality'],
    href: '/dashboard/pollution',
    stats: { hotspots: 5, aqi: 'Moderate', exposure: '2.3M' }
  },
  {
    id: 'growth',
    title: 'Urban Growth',
    description: 'Analyze urban expansion patterns and identify housing development priorities',
    icon: TrendingUp,
    gradient: 'from-purple-500 via-pink-600 to-rose-600',
    shadowColor: 'shadow-purple-500/50',
    bgGlow: 'bg-purple-400/20',
    iconColor: 'text-purple-300',
    badgeColor: 'bg-purple-400/20 text-purple-200 border-purple-400/30',
    datasets: ['GHSL Urban Expansion', 'VIIRS DNB Lights', 'Landsat Land Cover'],
    href: '/dashboard/growth',
    stats: { growth: '+35%', demand: '12K units', timeline: '1975-2025' }
  }
];

export default function NASAAnalysisHub() {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3 pb-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-white">Powered by NASA Earth Observation</span>
        </div>
        
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          3D Geospatial Intelligence
        </h2>
        
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          Advanced satellite data visualization answering three critical urban planning questions
        </p>
      </motion.div>

      {/* Analysis Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {analysisTypes.map((analysis, index) => {
          const Icon = analysis.icon;
          const isHovered = hoveredCard === analysis.id;
          
          return (
            <motion.div
              key={analysis.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredCard(analysis.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Link href={analysis.href}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -8 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${analysis.gradient} p-[2px] shadow-2xl ${analysis.shadowColor} transition-all duration-500 cursor-pointer`}
                >
                  {/* Card Content */}
                  <div className="relative h-full rounded-2xl bg-slate-900/95 backdrop-blur-xl p-6">
                    {/* Animated Background Glow */}
                    <motion.div
                      className={`absolute top-0 right-0 w-48 h-48 ${analysis.bgGlow} rounded-full blur-3xl`}
                      animate={{
                        scale: isHovered ? 1.5 : 1,
                        opacity: isHovered ? 0.4 : 0.2,
                      }}
                      transition={{ duration: 0.5 }}
                    />
                    
                    <div className="relative space-y-6">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <motion.div
                          className={`p-4 bg-gradient-to-br ${analysis.gradient} rounded-xl shadow-lg`}
                          animate={{
                            scale: isHovered ? 1.1 : 1,
                            rotate: isHovered ? 5 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <Icon className="w-8 h-8 text-white" />
                        </motion.div>
                        
                        <Badge className={`${analysis.badgeColor} backdrop-blur-sm`}>
                          Question {index + 1}
                        </Badge>
                      </div>
                      
                      {/* Title & Description */}
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-white group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                          {analysis.title}
                        </h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {analysis.description}
                        </p>
                      </div>
                      
                      {/* Data Sources */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Layers className="w-3 h-3" />
                          <span>Data Sources</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {analysis.datasets.map((dataset, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-xs bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 transition-colors"
                            >
                              {dataset}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10">
                        {Object.entries(analysis.stats).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="text-lg font-bold text-white">{value}</div>
                            <div className="text-xs text-gray-500 capitalize">{key}</div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Action Button */}
                      <motion.div
                        className="pt-4"
                        animate={{
                          x: isHovered ? 5 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <Button
                          className={`w-full bg-gradient-to-r ${analysis.gradient} hover:opacity-90 text-white font-semibold shadow-lg group-hover:shadow-xl transition-all duration-300`}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View 3D Analysis
                          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </motion.div>
                      
                      {/* Live Indicator */}
                      <div className="flex items-center justify-center gap-2 pt-2">
                        <div className="relative">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                          <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
                        </div>
                        <span className="text-xs text-emerald-400 font-medium">Live Data</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Feature Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8"
      >
        <Card className="glass border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Real-time Data</div>
              <div className="text-xs text-gray-400">Updated hourly</div>
            </div>
          </div>
        </Card>
        
        <Card className="glass border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Layers className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">7 NASA Datasets</div>
              <div className="text-xs text-gray-400">Multi-source</div>
            </div>
          </div>
        </Card>
        
        <Card className="glass border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Eye className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">3D Visualization</div>
              <div className="text-xs text-gray-400">Deck.gl powered</div>
            </div>
          </div>
        </Card>
        
        <Card className="glass border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">AI Insights</div>
              <div className="text-xs text-gray-400">Gemini 2.0</div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
