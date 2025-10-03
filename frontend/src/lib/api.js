// API integration for NASA Earthdata and climate services
import { useAppStore } from './store';

const NASA_API_BASE = 'https://api.nasa.gov/planetary/earth';
const OPENWEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5';

// NASA API Key - In production, this would be on the server
const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY';
const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || 'demo_key';

// Climate data service
export class ClimateDataService {
  static async getSatelliteImagery(lat, lon, date) {
    try {
      const response = await fetch(
        `${NASA_API_BASE}/imagery?lon=${lon}&lat=${lat}&date=${date}&api_key=${NASA_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch satellite imagery');
      }
      
      return await response.json();
    } catch (error) {
      console.error('NASA API Error:', error);
      // Return mock data for demo
      return {
        url: '/api/placeholder/satellite-image.jpg',
        date: date,
        id: 'mock_satellite_image'
      };
    }
  }

  static async getAssets(lat, lon) {
    try {
      const response = await fetch(
        `${NASA_API_BASE}/assets?lon=${lon}&lat=${lat}&api_key=${NASA_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch earth assets');
      }
      
      return await response.json();
    } catch (error) {
      console.error('NASA Assets API Error:', error);
      // Return mock data
      return {
        count: 0,
        results: []
      };
    }
  }

  static async getCurrentWeather(lat, lon) {
    try {
      const response = await fetch(
        `${OPENWEATHER_API_BASE}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Weather API Error:', error);
      // Return mock data for demo
      return {
        main: {
          temp: 32.5,
          humidity: 68,
          pressure: 1013
        },
        wind: {
          speed: 12.3,
          deg: 180
        },
        weather: [{
          main: 'Hot',
          description: 'Clear sky, heat warning',
          icon: '01d'
        }],
        visibility: 8000,
        dt: Date.now() / 1000
      };
    }
  }

  static async getAirQuality(lat, lon) {
    try {
      const response = await fetch(
        `${OPENWEATHER_API_BASE}/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch air quality data');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Air Quality API Error:', error);
      // Return mock data
      return {
        list: [{
          main: {
            aqi: 3 // Moderate
          },
          components: {
            co: 233.36,
            no: 0.14,
            no2: 8.63,
            o3: 76.38,
            so2: 1.47,
            pm2_5: 15.32,
            pm10: 22.45,
            nh3: 2.14
          },
          dt: Date.now() / 1000
        }]
      };
    }
  }

  static async getClimateProjections(lat, lon, scenario = 'rcp45') {
    // Simulate climate projection API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const baseTemp = 32;
        const yearProjections = [];
        
        for (let year = 2025; year <= 2050; year += 5) {
          const tempIncrease = scenario === 'rcp45' ? 
            (year - 2025) * 0.05 : (year - 2025) * 0.08;
          
          yearProjections.push({
            year,
            temperature: baseTemp + tempIncrease,
            precipitation: 180 + (year - 2025) * 2,
            heatDays: 45 + (year - 2025) * 1.5,
            scenario
          });
        }
        
        resolve({
          location: { lat, lon },
          scenario,
          projections: yearProjections,
          lastUpdated: new Date().toISOString()
        });
      }, 1000);
    });
  }
}

// Real-time data fetcher with caching
export class RealTimeDataFetcher {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async fetchClimateData(coordinates) {
    const { selectedCity } = useAppStore.getState();
    const [lat, lon] = coordinates || selectedCity.coordinates;
    
    const cacheKey = `${lat}_${lon}`;
    const cachedData = this.cache.get(cacheKey);
    
    if (cachedData && Date.now() - cachedData.timestamp < this.cacheTimeout) {
      return cachedData.data;
    }

    try {
      const [weather, airQuality, satelliteAssets] = await Promise.all([
        ClimateDataService.getCurrentWeather(lat, lon),
        ClimateDataService.getAirQuality(lat, lon),
        ClimateDataService.getAssets(lat, lon)
      ]);

      const climateData = {
        temperature: {
          current: weather.main.temp,
          feelsLike: weather.main.feels_like || weather.main.temp + 2,
          humidity: weather.main.humidity,
          trend: this.calculateTrend('temperature')
        },
        wind: {
          speed: weather.wind.speed,
          direction: weather.wind.deg,
          trend: this.calculateTrend('wind')
        },
        airQuality: {
          aqi: airQuality.list[0].main.aqi,
          pm25: airQuality.list[0].components.pm2_5,
          pm10: airQuality.list[0].components.pm10,
          trend: this.calculateTrend('air_quality')
        },
        visibility: weather.visibility / 1000, // Convert to km
        uvIndex: this.calculateUVIndex(lat, weather.dt),
        heatIndex: this.calculateHeatIndex(weather.main.temp, weather.main.humidity),
        satelliteData: {
          available: satelliteAssets.count > 0,
          lastUpdate: new Date(weather.dt * 1000).toISOString()
        },
        timestamp: Date.now()
      };

      // Cache the data
      this.cache.set(cacheKey, {
        data: climateData,
        timestamp: Date.now()
      });

      return climateData;
    } catch (error) {
      console.error('Failed to fetch real-time climate data:', error);
      throw error;
    }
  }

  calculateTrend(metric) {
    // Simulate trend calculation based on historical data
    const trends = ['up', 'down', 'stable'];
    const weights = metric === 'temperature' ? [0.6, 0.1, 0.3] : [0.3, 0.3, 0.4];
    
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < trends.length; i++) {
      cumulative += weights[i];
      if (random < cumulative) {
        return trends[i];
      }
    }
    
    return 'stable';
  }

  calculateUVIndex(lat, timestamp) {
    // Simplified UV index calculation
    const hour = new Date(timestamp * 1000).getHours();
    const baseLine = Math.abs(lat) > 30 ? 8 : 10;
    
    if (hour < 8 || hour > 18) return 0;
    if (hour < 10 || hour > 16) return Math.floor(baseLine * 0.3);
    return Math.floor(baseLine * Math.sin((hour - 6) * Math.PI / 12));
  }

  calculateHeatIndex(temp, humidity) {
    // Heat index calculation (simplified)
    if (temp < 27) return temp;
    
    const hi = -8.78469475556 +
               1.61139411 * temp +
               2.33854883889 * humidity +
               -0.14611605 * temp * humidity +
               -0.012308094 * temp * temp +
               -0.0164248277778 * humidity * humidity +
               0.002211732 * temp * temp * humidity +
               0.00072546 * temp * humidity * humidity +
               -0.000003582 * temp * temp * humidity * humidity;
    
    return Math.round(hi * 10) / 10;
  }
}

// Environmental analysis service
export class EnvironmentalAnalysis {
  static analyzeHeatIslands(coordinates, radius = 5000) {
    // Simulate heat island analysis
    return new Promise((resolve) => {
      setTimeout(() => {
        const heatIslands = [];
        const [centerLat, centerLon] = coordinates;
        
        for (let i = 0; i < 5; i++) {
          const lat = centerLat + (Math.random() - 0.5) * 0.01;
          const lon = centerLon + (Math.random() - 0.5) * 0.01;
          
          heatIslands.push({
            id: `heat_island_${i}`,
            coordinates: [lat, lon],
            intensity: 2 + Math.random() * 6, // 2-8°C above ambient
            area: 500 + Math.random() * 2000, // square meters
            risk: Math.random() > 0.5 ? 'high' : 'medium',
            causes: ['concrete surfaces', 'lack of vegetation', 'traffic density'][Math.floor(Math.random() * 3)]
          });
        }
        
        resolve({
          heatIslands,
          summary: {
            total: heatIslands.length,
            highRisk: heatIslands.filter(h => h.risk === 'high').length,
            averageIntensity: heatIslands.reduce((sum, h) => sum + h.intensity, 0) / heatIslands.length
          },
          recommendations: [
            'Increase urban tree canopy by 25%',
            'Install cool pavement materials',
            'Create green corridors for air circulation',
            'Implement rooftop gardens program'
          ]
        });
      }, 1500);
    });
  }

  static analyzeFloodRisk(coordinates) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const floodZones = [];
        const [centerLat, centerLon] = coordinates;
        
        for (let i = 0; i < 3; i++) {
          const lat = centerLat + (Math.random() - 0.5) * 0.02;
          const lon = centerLon + (Math.random() - 0.5) * 0.02;
          
          floodZones.push({
            id: `flood_zone_${i}`,
            coordinates: [lat, lon],
            riskLevel: ['low', 'medium', 'high'][i],
            returnPeriod: [100, 25, 10][i], // years
            depth: [0.5, 1.2, 2.1][i], // meters
            affectedArea: 1000 + i * 500
          });
        }
        
        resolve({
          floodZones,
          summary: {
            totalArea: floodZones.reduce((sum, z) => sum + z.affectedArea, 0),
            highRiskAreas: floodZones.filter(z => z.riskLevel === 'high').length
          }
        });
      }, 1200);
    });
  }

  static analyzeAirQualityTrends(coordinates, timeRange = '30d') {
    return new Promise((resolve) => {
      setTimeout(() => {
        const trends = [];
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        
        for (let i = 0; i < days; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          
          trends.push({
            date: date.toISOString().split('T')[0],
            aqi: Math.floor(50 + Math.random() * 100),
            pm25: 10 + Math.random() * 25,
            pm10: 15 + Math.random() * 35,
            no2: 20 + Math.random() * 30,
            o3: 40 + Math.random() * 80
          });
        }
        
        resolve({
          trends: trends.reverse(),
          analysis: {
            averageAQI: Math.floor(trends.reduce((sum, t) => sum + t.aqi, 0) / trends.length),
            worstDay: trends.reduce((worst, current) => 
              current.aqi > worst.aqi ? current : worst
            ),
            improvement: Math.random() > 0.5,
            recommendations: [
              'Increase electric vehicle adoption',
              'Expand public transit networks',
              'Create low-emission zones',
              'Plant air-purifying tree species'
            ]
          }
        });
      }, 1000);
    });
  }
}

// Initialize real-time data fetcher
export const realTimeDataFetcher = new RealTimeDataFetcher();

// Export API utilities
export default {
  ClimateDataService,
  RealTimeDataFetcher,
  EnvironmentalAnalysis,
  realTimeDataFetcher
};
