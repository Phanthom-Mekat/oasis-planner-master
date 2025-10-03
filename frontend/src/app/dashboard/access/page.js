'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Home, Bus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

const DeckGLAccessMap = dynamic(
  () => import('@/components/deck/DeckGLAccessMap'),
  { ssr: false, loading: () => <MapLoadingState /> }
);

function MapLoadingState() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
        <div className="text-white text-xl font-semibold">Loading NASA SEDAC & GHSL Data...</div>
        <div className="text-gray-400 text-sm">Analyzing access to essential services</div>
      </div>
    </div>
  );
}

export default function AccessAnalysisPage() {
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
                <Users className="w-5 h-5 text-blue-400" />
                Access to Essential Services
              </h1>
              <p className="text-sm text-gray-400">
                Question 1: Which communities need better access to food, housing, or transportation?
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-right mr-4">
              <div className="text-xs text-gray-400">Data Updated</div>
              <div className="text-sm text-white font-medium">Real-time</div>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative">
        <Suspense fallback={<MapLoadingState />}>
          <DeckGLAccessMap />
        </Suspense>
      </div>

      {/* Bottom Info Bar */}
      <div className="glass border-t border-white/10 p-3 z-10">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <Home className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400">Housing Access</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ShoppingBag className="w-4 h-4 text-green-400" />
              <span className="text-gray-400">Food Markets</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Bus className="w-4 h-4 text-purple-400" />
              <span className="text-gray-400">Transportation</span>
            </div>
          </div>
          
          <div className="text-xs text-gray-500">
            Powered by NASA SEDAC • EU Copernicus GHSL • VIIRS Nighttime Lights
          </div>
        </div>
      </div>
    </div>
  );
}
