/**
 * Oasis Platform API Client
 * Connects frontend to NASA-powered backend services
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const SIMULATION_API_URL = process.env.NEXT_PUBLIC_SIMULATION_API_URL || 'http://localhost:8001';

class OasisAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.simulationURL = SIMULATION_API_URL;
  }

  async request(url, options = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Geospatial Service Endpoints
  async getClimateLayers(cityId = 'dhaka_bd', layerTypes = null) {
    const params = new URLSearchParams();
    if (layerTypes) {
      layerTypes.forEach(type => params.append('layer_types', type));
    }
    const url = `${this.baseURL}/api/v1/geo/layers/${cityId}${params.toString() ? '?' + params : ''}`;
    return this.request(url);
  }

  async getAnalyticsSummary(cityId = 'dhaka_bd') {
    return this.request(`${this.baseURL}/api/v1/geo/analytics/summary/${cityId}`);
  }

  async getRealTimeClimate(lat, lon) {
    const url = `${this.baseURL}/api/v1/geo/real-time/climate?lat=${lat}&lon=${lon}`;
    return this.request(url);
  }

  async getHealthCheck() {
    return this.request(`${this.baseURL}/api/v1/geo/health`);
  }

  // Simulation Service Endpoints
  async predictImpact(cityId, interventions, predictionYears = 10) {
    return this.request(`${this.simulationURL}/api/v1/simulate/predict/impact`, {
      method: 'POST',
      body: JSON.stringify({
        city_id: cityId,
        interventions,
        prediction_years: predictionYears,
      }),
    });
  }

  async queryAI(query, cityId = 'dhaka_bd', context = null) {
    return this.request(`${this.simulationURL}/api/v1/simulate/ai/query`, {
      method: 'POST',
      body: JSON.stringify({
        query,
        city_id: cityId,
        context,
      }),
    });
  }

  async getSimulationHealth() {
    return this.request(`${this.simulationURL}/api/v1/simulate/health`);
  }

  // Helper methods
  async checkBackendStatus() {
    try {
      const [geoHealth, simHealth] = await Promise.all([
        this.getHealthCheck().catch(() => ({ status: 'offline' })),
        this.getSimulationHealth().catch(() => ({ status: 'offline' })),
      ]);

      return {
        geospatial: geoHealth.status === 'healthy',
        simulation: simHealth.status === 'healthy',
        overall: geoHealth.status === 'healthy' && simHealth.status === 'healthy',
      };
    } catch (error) {
      return {
        geospatial: false,
        simulation: false,
        overall: false,
      };
    }
  }

  // Real-time data for Dhaka
  async getDhakaRealTimeData() {
    const DHAKA_COORDS = { lat: 23.8103, lon: 90.4125 };
    return this.getRealTimeClimate(DHAKA_COORDS.lat, DHAKA_COORDS.lon);
  }

  // Comprehensive dashboard data
  async getDashboardData(cityId = 'dhaka_bd') {
    try {
      const [layers, analytics, realTime] = await Promise.all([
        this.getClimateLayers(cityId),
        this.getAnalyticsSummary(cityId),
        this.getDhakaRealTimeData(),
      ]);

      return {
        layers,
        analytics,
        realTime,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
}

// Singleton instance
export const oasisAPI = new OasisAPI();

// Export for direct use
export default oasisAPI;
