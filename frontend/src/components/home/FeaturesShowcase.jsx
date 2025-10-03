'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Satellite, Brain, BarChart3, Users, Zap, Shield } from 'lucide-react';

const features = [
  {
    icon: Satellite,
    title: 'NASA Earth Observation',
    description: '7 satellite data sources providing real-time climate intelligence',
    color: 'from-blue-500 to-cyan-500',
    stats: ['MODIS Terra', 'Sentinel-5P', 'Landsat 8/9', 'SEDAC'],
  },
  {
    icon: Brain,
    title: 'AI Chief of Staff',
    description: 'Gemini-powered natural language queries and climate insights',
    color: 'from-purple-500 to-pink-500',
    stats: ['94% Accuracy', 'Real-time Analysis', 'Natural Language', 'Smart Recommendations'],
  },
  {
    icon: BarChart3,
    title: 'Impact Simulation',
    description: 'Predict multi-dimensional impacts with cascading effects modeling',
    color: 'from-orange-500 to-red-500',
    stats: ['ROI Analysis', 'Cost-Benefit', 'Timeline Projection', 'Risk Assessment'],
  },
  {
    icon: Users,
    title: 'Civic Garden',
    description: 'Community-driven data validation and grassroots participation',
    color: 'from-green-500 to-emerald-500',
    stats: ['Ground Truthing', 'Public Engagement', 'Data Validation', 'Local Knowledge'],
  },
  {
    icon: Zap,
    title: 'Real-Time Monitoring',
    description: 'Live climate metrics with instant alerts and notifications',
    color: 'from-yellow-500 to-orange-500',
    stats: ['Temperature', 'Air Quality', 'Flood Risk', 'Heat Alerts'],
  },
  {
    icon: Shield,
    title: 'Climate Resilience',
    description: 'Evidence-based strategies for urban adaptation and sustainability',
    color: 'from-indigo-500 to-purple-500',
    stats: ['Heat Reduction', 'Air Improvement', 'Flood Protection', 'Green Spaces'],
  },
];

function FeatureCard({ feature, index }) {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);

  const Icon = feature.icon;

  return (
    <motion.div
      ref={cardRef}
      style={{ y, opacity, scale }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 rounded-3xl"
        style={{
          background: `linear-gradient(to right, var(--tw-gradient-stops))`,
          '--tw-gradient-from': feature.color.split(' ')[1],
          '--tw-gradient-to': feature.color.split(' ')[3],
        }}
      />
      
      <div className="relative p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:scale-105">
        {/* Icon */}
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 transform group-hover:rotate-12 transition-transform duration-300`}>
          <Icon className="w-8 h-8 text-white" />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 mb-6 leading-relaxed">
          {feature.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {feature.stats.map((stat, i) => (
            <div
              key={i}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 text-center hover:bg-white/10 transition-colors duration-200"
            >
              {stat}
            </div>
          ))}
        </div>

        {/* Glow Effect */}
        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
      </div>
    </motion.div>
  );
}

export default function FeaturesShowcase() {
  return (
    <section className="relative py-32 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <span className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium">
              Platform Capabilities
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-white mt-6 mb-4"
          >
            Powered by{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Advanced Technology
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            Combining NASA's Earth observation data with cutting-edge AI to create
            the most comprehensive climate resilience platform
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
