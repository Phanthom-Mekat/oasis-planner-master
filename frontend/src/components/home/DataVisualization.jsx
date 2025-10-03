'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TrendingUp, Activity, Droplet, Wind } from 'lucide-react';

const metrics = [
  {
    icon: Activity,
    label: 'Temperature',
    value: '35.9°C',
    change: '+2.3°C',
    status: 'critical',
    color: 'from-red-500 to-orange-500',
  },
  {
    icon: Wind,
    label: 'Air Quality',
    value: 'AQI 150',
    change: 'Poor',
    status: 'warning',
    color: 'from-orange-500 to-yellow-500',
  },
  {
    icon: Droplet,
    label: 'Flood Risk',
    value: 'HIGH',
    change: '120K affected',
    status: 'critical',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: TrendingUp,
    label: 'Heat Island',
    value: '+5.3°C',
    change: 'vs Rural',
    status: 'warning',
    color: 'from-purple-500 to-pink-500',
  },
];

function MetricCard({ metric, index }) {
  const Icon = metric.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r opacity-20 group-hover:opacity-40 blur-xl transition-opacity duration-500 rounded-2xl"
        style={{
          background: `linear-gradient(to right, ${metric.color})`,
        }}
      />
      
      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-gray-600 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${metric.color} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            metric.status === 'critical' 
              ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
              : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
          }`}>
            {metric.status.toUpperCase()}
          </span>
        </div>
        
        <div className="text-gray-400 text-sm mb-2">{metric.label}</div>
        <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
        <div className="text-sm text-gray-500">{metric.change}</div>
      </div>
    </motion.div>
  );
}

export default function DataVisualization() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={containerRef} className="relative py-32 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      {/* Animated Background */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 opacity-30"
      >
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl" />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold text-white mb-6"
          >
            Real-Time{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Climate Intelligence
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            Live data from NASA satellites monitoring Dhaka's climate conditions 24/7
          </motion.p>
        </div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {metrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} index={index} />
          ))}
        </div>

        {/* Large Visual Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative p-8 rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-4">
                NASA MODIS Temperature Analysis
              </h3>
              <p className="text-gray-400 mb-6">
                Real-time land surface temperature data showing critical urban heat island effects
                across Dhaka metropolitan area. Current readings indicate +5.3°C above rural baseline.
              </p>
              <div className="space-y-3">
                {[
                  { label: 'Data Source', value: 'MODIS Terra MOD11A1' },
                  { label: 'Resolution', value: '1km spatial, hourly' },
                  { label: 'Coverage', value: '306.4 km² monitored' },
                  { label: 'Last Update', value: 'Real-time' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-gray-400">{item.label}</span>
                    <span className="text-white font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-80 rounded-2xl bg-gradient-to-br from-red-500/20 via-orange-500/20 to-yellow-500/20 border border-white/10 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-400 mb-4">
                    35.9°C
                  </div>
                  <div className="text-xl text-white mb-2">Current Temperature</div>
                  <div className="text-sm text-gray-400">Dhaka City Center</div>
                </div>
              </div>
              
              {/* Animated Circles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-red-400/30 rounded-full"
                  initial={{ width: 0, height: 0, opacity: 1 }}
                  animate={{
                    width: [0, 400],
                    height: [0, 400],
                    opacity: [1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 1,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
