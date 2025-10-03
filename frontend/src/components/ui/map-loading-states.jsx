import { AlertTriangle } from "lucide-react";

const MapLoadingStates = ({ mapLoaded, mapError }) => {
  if (!mapLoaded && !mapError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 z-[999]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading satellite imagery...</p>
          <p className="text-xs text-slate-500 mt-1">Initializing real-time climate data</p>
        </div>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20 z-[999]">
        <div className="text-center text-red-600 dark:text-red-400">
          <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
          <p className="font-medium">Map Loading Error</p>
          <p className="text-sm">{mapError}</p>
        </div>
      </div>
    );
  }

  return null;
};

export default MapLoadingStates;
