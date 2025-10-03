'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wind, Droplet, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const DeckGLPollutionMap = dynamic(
  () => import('@/components/deck/DeckGLPollutionMap'),
  { ssr: false, loading: () => <MapLoadingState /> }
);

function MapLoadingState() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto"></div>
        <div className="text-white text-xl font-semibold">Loading TROPOMI & MODIS Data...</div>
        <div className="text-gray-400 text-sm">Analyzing air and water pollution levels</div>
      </div>
    </div>
  );
}

export default function PollutionAnalysisPage() {
  return (
    <div className="h-screen w-full bg-black flex flex-col">
      {/* Header */}
      <div className="glass border-b border-white/10 p-4 z-10">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <div className="h-6 w-px bg-white/20"></div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Wind className="w-5 h-5 text-red-400" />
                Pollution & Environmental Health
              </h1>
              <p className="text-sm text-gray-400">
                Question 2: Which areas are dealing with polluted air or water, and how can that be addressed?
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="glass-light px-3 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-white font-medium">3 High Risk Areas</span>
              </div>
            </div>
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative">
        <Suspense fallback={<MapLoadingState />}>
          <DeckGLPollutionMap />
        </Suspense>
      </div>

      {/* Bottom Info Bar */}
      <div className="glass border-t border-white/10 p-3 z-10">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <Wind className="w-4 h-4 text-orange-400" />
              <span className="text-gray-400">Air Quality (NO₂ & PM₂.₅)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Droplet className="w-4 h-4 text-cyan-400" />
              <span className="text-gray-400">Water Quality</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-gray-400">Health Risks</span>
            </div>
          </div>
          
          <div className="text-xs text-gray-500">
            Powered by ESA Sentinel-5P TROPOMI • NASA MODIS AOD • Landsat Water Quality
          </div>
        </div>
      </div>
    </div>
  );
}
