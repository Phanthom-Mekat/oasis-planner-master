import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";

const MapLegend = ({ activeOverlays, dataLayers }) => {
  if (activeOverlays.size === 0) return null;

  return (
    <div className="absolute bottom-4 left-4 z-[1000] pointer-events-auto">
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg border border-slate-200/60 dark:border-slate-700/60 p-3 shadow-lg max-w-xs">
        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <Target className="h-4 w-4 text-emerald-600" />
          Active Data Layers
        </h4>
        <div className="space-y-2 text-xs">
          {Array.from(activeOverlays).map(layerId => {
            const layer = dataLayers.find(l => l.id === layerId);
            if (!layer) return null;
            const IconComponent = layer.icon;
            return (
              <div key={layerId} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconComponent className={`h-3 w-3 ${layer.color}`} />
                  <span>{layer.name}</span>
                </div>
                <Badge variant="outline" className="text-xs px-1 py-0">
                  {layer.updateFrequency}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MapLegend;
