// Map Debug Utility
// Add this to any page to debug map issues

export const MapDebugInfo = () => {
  const checkMapSupport = () => {
    console.log("=== Map Debug Info ===");
    console.log("Window object:", typeof window !== 'undefined');
    console.log("Leaflet available:", typeof window !== 'undefined' && window.L);
    console.log("Navigator:", typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A');
    
    // Check CSS
    const cssLoaded = document.querySelector('link[href*="leaflet"]');
    console.log("Leaflet CSS loaded:", !!cssLoaded);
    
    // Check network
    if (navigator.onLine !== undefined) {
      console.log("Network status:", navigator.onLine ? 'Online' : 'Offline');
    }
    
    // Check local storage (for potential map state)
    try {
      localStorage.setItem('mapTest', 'test');
      localStorage.removeItem('mapTest');
      console.log("Local storage available:", true);
    } catch (e) {
      console.log("Local storage available:", false);
    }
  };

  return (
    <div className="p-4 bg-slate-100 rounded-lg text-sm">
      <button 
        onClick={checkMapSupport}
        className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
      >
        Debug Map
      </button>
      <p className="mt-2 text-xs text-slate-600">
        Click to log map debug information to console
      </p>
    </div>
  );
};

// Usage: Add <MapDebugInfo /> to any page during development
