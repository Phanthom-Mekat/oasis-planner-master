'use client';

import { motion } from 'framer-motion';
import { useNexusStore } from '@/store/nexusStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function NexusController() {
  const { 
    analysisMode, 
    setAnalysisMode, 
    showController, 
    toggleController,
    selectedCore,
    activeConnection 
  } = useNexusStore();

  if (!showController) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 right-6 z-50"
      >
        <Button
          onClick={toggleController}
          className="bg-white/10 backdrop-blur-2xl border border-white/20 hover:bg-white/20"
        >
          <span className="text-white">⚙️ Show Controls</span>
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className="absolute top-6 right-6 w-96 z-50"
    >
      <Card className="bg-gray-950/90 backdrop-blur-3xl border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
        <CardHeader className="border-b border-white/10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              🌐 Nexus Controller
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleController}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Control the living organism of the city
          </p>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Analysis Mode Selection */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm flex items-center gap-2">
              <span className="text-lg">🎭</span>
              Analysis Mode
            </h3>
            
            <div className="grid grid-cols-1 gap-2">
              {/* Food Access */}
              <AnalysisModeButton
                mode="food"
                currentMode={analysisMode}
                onClick={() => setAnalysisMode('food')}
                icon="🍎"
                title="Food Access"
                description="Emerald wells & starved communities"
                color="from-emerald-600 to-green-600"
                borderColor="border-emerald-500/50"
              />

              {/* Housing Access */}
              <AnalysisModeButton
                mode="housing"
                currentMode={analysisMode}
                onClick={() => setAnalysisMode('housing')}
                icon="🏠"
                title="Housing Access"
                description="Overcrowded & fractured cores"
                color="from-cyan-600 to-blue-600"
                borderColor="border-cyan-500/50"
              />

              {/* Transportation Access */}
              <AnalysisModeButton
                mode="transportation"
                currentMode={analysisMode}
                onClick={() => setAnalysisMode('transportation')}
                icon="🚇"
                title="Transportation Access"
                description="Purple transit hubs & gaps"
                color="from-purple-600 to-pink-600"
                borderColor="border-purple-500/50"
              />
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <h3 className="text-white font-semibold text-sm">Visual Guide</h3>
            <div className="space-y-2 text-xs">
              <LegendItem
                color="bg-cyan-500"
                label="Thriving Cores"
                description="Well-connected communities"
              />
              <LegendItem
                color="bg-red-500"
                label="Starved Cores"
                description="Isolated, flickering (click to trace)"
                pulse
              />
              <LegendItem
                color="bg-emerald-500"
                label="Resource Wells"
                description="Food, health, transit hubs"
              />
              <LegendItem
                color="bg-yellow-500"
                label="Data Streams"
                description="Infrastructure connectivity"
              />
            </div>
          </div>

          {/* Selected Core Info */}
          {selectedCore && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/50"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-white font-bold">
                  {selectedCore.isStarved ? '🔴' : '💙'} {selectedCore.area}
                </h4>
                {selectedCore.isStarved && (
                  <Badge variant="destructive" className="text-xs">
                    STARVED
                  </Badge>
                )}
              </div>
              
              <div className="space-y-1 text-xs text-gray-300">
                <div>Population: {selectedCore.density.toLocaleString()}/km²</div>
                <div>Ward: {selectedCore.ward}</div>
                {activeConnection && (
                  <div className="mt-2 pt-2 border-t border-white/20">
                    <div className="text-red-400 font-semibold">
                      ⚠️ Access Difficulty
                    </div>
                    <div>Distance to nearest resource: {activeConnection.distance.toFixed(2)} km</div>
                    <div className="text-xs text-gray-400 mt-1">
                      A fragile thread shows the arduous journey
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Data Sources */}
          <div className="pt-3 border-t border-white/10 text-xs text-gray-400">
            <div className="font-semibold text-gray-300 mb-2">🛰️ Data Sources:</div>
            <div className="space-y-1">
              <div>• NASA SEDAC Population Density</div>
              <div>• WorldPop Demographic Data</div>
              <div>• VIIRS Nighttime Lights</div>
              <div>• MODIS Land Cover Classification</div>
              <div>• OpenStreetMap Infrastructure</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AnalysisModeButton({ mode, currentMode, onClick, icon, title, description, color, borderColor }) {
  const isActive = currentMode === mode;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        w-full p-4 rounded-xl text-left transition-all
        ${isActive 
          ? `bg-gradient-to-r ${color} border-2 ${borderColor} shadow-lg` 
          : 'bg-gray-800/50 border border-gray-700 hover:bg-gray-800/70'}
      `}
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl">{icon}</div>
        <div className="flex-1">
          <div className={`font-bold text-sm ${isActive ? 'text-white' : 'text-gray-400'}`}>
            {title}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            {description}
          </div>
        </div>
        {isActive && (
          <div className="text-white text-lg">✓</div>
        )}
      </div>
    </motion.button>
  );
}

function LegendItem({ color, label, description, pulse }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color} ${pulse ? 'animate-pulse' : ''}`} />
      <div className="flex-1">
        <div className="text-gray-300 font-medium">{label}</div>
        <div className="text-gray-500 text-[10px]">{description}</div>
      </div>
    </div>
  );
}
