'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Globe, Zap } from 'lucide-react';

const Scene3D = dynamic(() => import('@/components/three/Scene3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900">
      <div className="text-white text-xl animate-pulse">Loading 3D Experience...</div>
    </div>
  ),
});

export default function Hero3D() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900" />}>
          <Scene3D showParticles={true} showIslands={false} />
        </Suspense>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 z-10" />

      {/* Content */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="max-w-6xl mx-auto px-4 text-center">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-white">
              Powered by NASA Data & AI
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-7xl md:text-8xl font-bold mb-6 animate-fade-in-up">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient">
              OASIS
            </span>
          </h1>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 animate-fade-in-up animation-delay-200">
            Climate-Resilient Urban Planning
          </h2>

          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto animate-fade-in-up animation-delay-400">
            Transform cities with real-time satellite data, AI-powered insights, and
            predictive climate modeling. Built for Dhaka, scalable worldwide.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12 animate-fade-in-up animation-delay-600">
            <div className="px-6 py-3 rounded-full bg-blue-500/20 backdrop-blur-lg border border-blue-400/30 text-blue-300 font-medium flex items-center gap-2">
              <Globe className="w-5 h-5" />
              7 NASA Satellites
            </div>
            <div className="px-6 py-3 rounded-full bg-purple-500/20 backdrop-blur-lg border border-purple-400/30 text-purple-300 font-medium flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Gemini AI
            </div>
            <div className="px-6 py-3 rounded-full bg-green-500/20 backdrop-blur-lg border border-green-400/30 text-green-300 font-medium flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Real-Time Analysis
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-800">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-full shadow-2xl shadow-blue-500/50 transform hover:scale-105 transition-all duration-300"
            >
              Launch Dashboard
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/30 bg-white/10 backdrop-blur-lg hover:bg-white/20 text-white px-8 py-6 text-lg rounded-full transform hover:scale-105 transition-all duration-300"
            >
              Watch Demo
            </Button>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 animate-fade-in-up animation-delay-1000">
            {[
              { value: '22M', label: 'People Monitored' },
              { value: '306', label: 'km² Coverage' },
              { value: '7', label: 'NASA Satellites' },
              { value: '94%', label: 'AI Accuracy' },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <div className="text-white/50 text-sm">Scroll to explore</div>
        <div className="w-6 h-10 border-2 border-white/30 rounded-full mx-auto mt-2 flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/50 rounded-full animate-scroll" />
        </div>
      </div>
    </div>
  );
}
