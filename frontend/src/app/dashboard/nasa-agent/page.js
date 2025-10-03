'use client';

import dynamic from 'next/dynamic';

// Dynamic import with SSR disabled to prevent hydration errors with styled-jsx and deck.gl
const NASAAgent = dynamic(
  () => import('@/components/dashboard/NASAAgent'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-screen bg-gradient-to-br from-slate-950 via-blue-950/30 to-purple-950/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="text-blue-300 text-sm">Loading NASA Earth Observation System...</p>
        </div>
      </div>
    )
  }
);

export default function NASAAgentPage() {
  return <NASAAgent />;
}

