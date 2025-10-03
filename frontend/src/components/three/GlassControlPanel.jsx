'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useSceneStore } from '@/lib/sceneStore';
import { Users, Wind, TrendingUp, Play, Pause } from 'lucide-react';

export default function GlassControlPanel() {
  const { activeLayer, setActiveLayer, timeline, setTimeline, toggleTimelinePlay } = useSceneStore();

  const visualizations = [
    {
      id: 'access',
      icon: Users,
      title: 'Islands of Need',
      subtitle: 'Access to Resources',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'pollution',
      icon: Wind,
      title: 'Living Miasma',
      subtitle: 'Air & Water Quality',
      color: 'from-red-500 to-orange-500',
    },
    {
      id: 'growth',
      icon: TrendingUp,
      title: 'Crystal Chronoscape',
      subtitle: 'Urban Expansion',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="absolute left-6 top-6 z-10 space-y-4"
    >
      {/* Title Card */}
      <Card className="glass p-6 border-white/10 backdrop-blur-xl bg-black/40">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2">
          OASIS
        </h1>
        <p className="text-gray-400 text-sm">Digital Etherealism</p>
      </Card>

      {/* Visualization Selector */}
      <Card className="glass p-4 border-white/10 backdrop-blur-xl bg-black/40 space-y-3">
        <h3 className="text-sm font-semibold text-white/80 mb-3">NASA Data Visualizations</h3>
        {visualizations.map((viz) => {
          const Icon = viz.icon;
          const isActive = activeLayer === viz.id;
          
          return (
            <motion.button
              key={viz.id}
              onClick={() => setActiveLayer(viz.id)}
              className={`w-full p-4 rounded-lg border transition-all duration-300 ${
                isActive
                  ? 'border-white/30 bg-white/10'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${viz.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-white font-medium text-sm">{viz.title}</div>
                  <div className="text-gray-400 text-xs">{viz.subtitle}</div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </Card>

      {/* Timeline Control (for growth visualization) */}
      {activeLayer === 'growth' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass p-4 border-white/10 backdrop-blur-xl bg-black/40 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white/80">Timeline</h3>
              <Button
                size="sm"
                variant="ghost"
                className="text-white"
                onClick={toggleTimelinePlay}
              >
                {timeline.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">{timeline.year}</div>
              <Slider
                value={[timeline.year]}
                onValueChange={([year]) => setTimeline(year)}
                min={1975}
                max={2025}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>1975</span>
                <span>2025</span>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Info Panel */}
      <Card className="glass p-4 border-white/10 backdrop-blur-xl bg-black/40">
        <div className="space-y-2 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>Live NASA Data</span>
          </div>
          <div className="text-[10px] text-gray-500">
            Dhaka, Bangladesh • Real-time Analysis
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
