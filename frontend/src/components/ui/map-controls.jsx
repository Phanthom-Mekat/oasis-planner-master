import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  RefreshCw, 
  Maximize2, 
  Minimize2, 
  Eye, 
  EyeOff 
} from "lucide-react";

const MapControls = ({
  mapViews,
  mapView,
  setMapView,
  dataLayers,
  activeOverlays,
  toggleOverlay,
  showRealTime,
  setShowRealTime,
  lastUpdated,
  refreshData,
  overlayLoading,
  isFullscreen,
  setIsFullscreen
}) => {
  return (
    <div className="absolute top-4 left-4 right-4 z-[1000] flex justify-between items-start pointer-events-none">
      {/* Left Controls */}
      <div className="flex flex-col gap-2 pointer-events-auto">
        {/* Map View Toggle */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-200/60 dark:border-slate-700/60 p-2 shadow-lg">
          <div className="flex gap-1">
            {mapViews.map((view) => (
              <Button
                key={view.id}
                variant={mapView === view.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setMapView(view.id)}
                className="text-xs px-2 py-1 h-7"
              >
                {view.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Layer Selection */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-200/60 dark:border-slate-700/60 p-2 shadow-lg">
          <div className="flex flex-wrap gap-1">
            {dataLayers.slice(0, 4).map((layer) => {
              const IconComponent = layer.icon;
              const isActive = activeOverlays.has(layer.id);
              return (
                <Button
                  key={layer.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => toggleOverlay(layer.id)}
                  className={`flex items-center gap-1 text-xs px-2 py-1 h-7 ${layer.color}`}
                >
                  <IconComponent className="h-3 w-3" />
                  <span className="hidden lg:inline">{layer.name}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex flex-col gap-2 pointer-events-auto">
        {/* Real-time Status */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-200/60 dark:border-slate-700/60 p-3 shadow-lg">
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${showRealTime ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-slate-700 dark:text-slate-300">
              {showRealTime ? 'Live Data' : 'Static View'}
            </span>
            <span className="text-slate-500 ml-2">
              {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-200/60 dark:border-slate-700/60 p-2 shadow-lg">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshData}
              disabled={overlayLoading}
              className="h-7 px-2"
            >
              <RefreshCw className={`h-3 w-3 ${overlayLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="h-7 px-2"
            >
              {isFullscreen ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRealTime(!showRealTime)}
              className="h-7 px-2"
            >
              {showRealTime ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapControls;
