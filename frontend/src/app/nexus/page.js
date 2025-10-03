'use client';

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with Three.js
const LivingNexusMap = dynamic(
  () => import('@/components/nexus/LivingNexusMap'),
  { ssr: false }
);

export default function NexusPage() {
  return (
    <div className="w-full h-screen">
      <LivingNexusMap />
    </div>
  );
}
