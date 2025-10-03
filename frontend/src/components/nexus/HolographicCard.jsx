'use client';

import { Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HolographicCard({ element, position }) {
  if (!element) return null;

  return (
    <Html position={position} distanceFactor={50} zIndexRange={[100, 0]}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ type: 'spring', damping: 15, stiffness: 100 }}
      >
        <Card className="w-72 bg-gray-950/95 backdrop-blur-3xl border-2 border-cyan-400/40 shadow-2xl shadow-cyan-400/30">
          <CardContent className="p-4">
            {renderCardContent(element)}
          </CardContent>
        </Card>
      </motion.div>
    </Html>
  );
}

function renderCardContent(element) {
  // Population Core
  if (element.type === 'core') {
    return (
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              {element.isStarved ? '🔴' : '💙'}
              {element.area}
            </h3>
            <p className="text-xs text-gray-400">Population Center</p>
          </div>
          {element.isStarved && (
            <Badge variant="destructive" className="text-xs">
              STARVED
            </Badge>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <DataRow label="Population Density" value={`${element.density.toLocaleString()}/km²`} />
          <DataRow label="Ward" value={element.ward} />
          <DataRow 
            label="Pulse Rate" 
            value={`${element.pulseRate.toFixed(1)}x`}
            info="Growth indicator"
          />
          
          {element.isStarved && (
            <div className="pt-2 mt-2 border-t border-red-500/30">
              <div className="text-red-400 font-semibold text-xs flex items-center gap-1">
                ⚠️ Critical: Isolated Community
              </div>
              <div className="text-gray-400 text-xs mt-1">
                Far from essential resources. Click to trace access path.
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Resource Well (Market, Hospital, Transit)
  if (element.type === 'food' || element.type === 'health' || element.type === 'transit') {
    const icons = {
      food: '🍎',
      health: '🏥',
      transit: '🚇',
    };

    const titles = {
      food: 'Food Market',
      health: 'Healthcare Facility',
      transit: 'Transit Hub',
    };

    const colors = {
      food: 'text-emerald-400',
      health: 'text-cyan-400',
      transit: 'text-purple-400',
    };

    return (
      <div className="space-y-3">
        <div>
          <h3 className={`font-bold text-lg flex items-center gap-2 ${colors[element.type]}`}>
            {icons[element.type]}
            {titles[element.type]}
          </h3>
          <p className="text-xs text-gray-400">Resource Well</p>
        </div>

        <div className="space-y-2 text-sm">
          {element.data.capacity && (
            <DataRow 
              label="Daily Capacity" 
              value={element.data.capacity.toLocaleString()} 
            />
          )}
          {element.data.radius && (
            <DataRow 
              label="Service Radius" 
              value={`${element.data.radius} km`} 
            />
          )}
          <DataRow 
            label="Well Energy" 
            value={`${(element.pulseSpeed * 50).toFixed(0)}%`}
            info="Pulsing vitality"
          />

          <div className="pt-2 mt-2 border-t border-white/10">
            <div className="text-gray-400 text-xs">
              A beacon of essential services for the community
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Infrastructure Stream
  if (element.type === 'stream') {
    const connectivityLevel = element.brightness > 0.7 ? 'Excellent' : element.brightness > 0.5 ? 'Moderate' : 'Poor';
    const connectivityColor = element.brightness > 0.7 ? 'text-green-400' : element.brightness > 0.5 ? 'text-yellow-400' : 'text-red-400';

    return (
      <div className="space-y-3">
        <div>
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            ⚡ Infrastructure Stream
          </h3>
          <p className="text-xs text-gray-400">Data Flow Network</p>
        </div>

        <div className="space-y-2 text-sm">
          <DataRow 
            label="Connectivity" 
            value={connectivityLevel}
            valueClass={connectivityColor}
          />
          <DataRow 
            label="Flow Speed" 
            value={`${(element.flowSpeed * 100).toFixed(0)}%`} 
          />
          <DataRow 
            label="Brightness" 
            value={`${(element.brightness * 100).toFixed(0)}%`}
            info="Nighttime visibility"
          />

          <div className="pt-2 mt-2 border-t border-white/10">
            <div className="text-gray-400 text-xs">
              {element.brightness > 0.7 
                ? '✓ Well-connected infrastructure artery'
                : element.brightness > 0.5
                ? '⚠️ Moderate connectivity, room for improvement'
                : '❌ Poor connectivity, critical infrastructure gap'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function DataRow({ label, value, info, valueClass = 'text-white' }) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-gray-400 text-xs flex items-center gap-1">
        {label}
        {info && (
          <span className="text-gray-600 text-[10px]">({info})</span>
        )}
      </div>
      <div className={`font-semibold text-sm ${valueClass}`}>
        {value}
      </div>
    </div>
  );
}
