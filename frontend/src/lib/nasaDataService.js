// NASA Data Service - Integration with Real NASA APIs

const DHAKA_BBOX = {
  west: 90.3,
  south: 23.7,
  east: 90.5,
  north: 23.9,
};

// NASA EARTHDATA API Configuration
const NASA_API_CONFIG = {
  MODIS_AOD: 'https://ladsweb.modaps.eosdis.nasa.gov/api/v2',
  TROPOMI: 'https://s5phub.copernicus.eu/dhus',
  SEDAC: 'https://sedac.ciesin.columbia.edu/data',
  WORLDPOP: 'https://www.worldpop.org/rest/data',
  GHSL: 'https://ghsl.jrc.ec.europa.eu/api',
};

/**
 * Question 1: Access to Food, Housing, Transportation
 * Data: SEDAC Population + GHSL Settlement + VIIRS Nighttime Lights
 */
export async function fetchAccessAnalysisData() {
  try {
    // Simulated data structure matching real NASA API responses
    // Replace with actual API calls in production
    
    const populationDensity = await fetchPopulationDensity();
    const settlementData = await fetchSettlementData();
    const infrastructureData = await fetchInfrastructureData();
    
    return {
      population: populationDensity,
      settlements: settlementData,
      infrastructure: infrastructureData,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching access analysis data:', error);
    return generateMockAccessData();
  }
}

async function fetchPopulationDensity() {
  // NASA SEDAC GPWv4 Population Density
  // Real API: https://sedac.ciesin.columbia.edu/data/set/gpw-v4-population-density-rev11
  
  return [
    { lat: 23.8103, lon: 90.4125, density: 45000, area: 'Motijheel', ward: 1 },
    { lat: 23.7808, lon: 90.4217, density: 52000, area: 'Old Dhaka', ward: 2 },
    { lat: 23.7561, lon: 90.3872, density: 38000, area: 'Mohammadpur', ward: 3 },
    { lat: 23.7925, lon: 90.4078, density: 41000, area: 'Dhanmondi', ward: 4 },
    { lat: 23.8223, lon: 90.3654, density: 35000, area: 'Mirpur', ward: 5 },
    { lat: 23.7956, lon: 90.3537, density: 28000, area: 'Uttara', ward: 6 },
    { lat: 23.8103, lon: 90.3372, density: 22000, area: 'Savar', ward: 7 },
  ];
}

async function fetchSettlementData() {
  // EU Copernicus GHSL Built-up Area
  // Real API: https://ghsl.jrc.ec.europa.eu/
  
  return [
    { lat: 23.8103, lon: 90.4125, builtUpArea: 0.85, formalHousing: 0.70 },
    { lat: 23.7808, lon: 90.4217, builtUpArea: 0.92, formalHousing: 0.60 },
    { lat: 23.7561, lon: 90.3872, builtUpArea: 0.78, formalHousing: 0.75 },
    { lat: 23.7925, lon: 90.4078, builtUpArea: 0.88, formalHousing: 0.80 },
    { lat: 23.8223, lon: 90.3654, builtUpArea: 0.65, formalHousing: 0.55 },
    { lat: 23.7956, lon: 90.3537, builtUpArea: 0.45, formalHousing: 0.85 },
  ];
}

async function fetchInfrastructureData() {
  // VIIRS Nighttime Lights + OSM Roads
  // Real API: https://www.ngdc.noaa.gov/eog/viirs/
  
  return {
    roads: [
      { from: [90.4125, 23.8103], to: [90.4217, 23.7808], type: 'highway', connectivity: 0.9 },
      { from: [90.4217, 23.7808], to: [90.3872, 23.7561], type: 'arterial', connectivity: 0.7 },
      { from: [90.4078, 23.7925], to: [90.3654, 23.8223], type: 'arterial', connectivity: 0.6 },
      { from: [90.3654, 23.8223], to: [90.3537, 23.7956], type: 'collector', connectivity: 0.4 },
    ],
    transit: [
      { lat: 23.8103, lon: 90.4125, type: 'metro', capacity: 50000 },
      { lat: 23.7925, lon: 90.4078, type: 'bus', capacity: 15000 },
      { lat: 23.7956, lon: 90.3537, type: 'bus', capacity: 8000 },
    ],
    markets: [
      { lat: 23.8103, lon: 90.4125, type: 'supermarket', radius: 2 },
      { lat: 23.7808, lon: 90.4217, type: 'local', radius: 1 },
      { lat: 23.7925, lon: 90.4078, type: 'supermarket', radius: 1.5 },
    ],
  };
}

/**
 * Question 2: Air & Water Pollution
 * Data: TROPOMI NO2 + MODIS AOD + Landsat Water Quality
 */
export async function fetchPollutionData() {
  try {
    const airQuality = await fetchAirQualityData();
    const waterQuality = await fetchWaterQualityData();
    
    return {
      air: airQuality,
      water: waterQuality,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching pollution data:', error);
    return generateMockPollutionData();
  }
}

async function fetchAirQualityData() {
  // ESA Sentinel-5P TROPOMI NO2 + MODIS AOD
  // Real API: https://s5phub.copernicus.eu/dhus
  
  return {
    no2: [
      { lat: 23.8103, lon: 90.4125, concentration: 85.2, unit: 'μmol/m²' },
      { lat: 23.7808, lon: 90.4217, concentration: 92.5, unit: 'μmol/m²' },
      { lat: 23.7561, lon: 90.3872, concentration: 45.3, unit: 'μmol/m²' },
      { lat: 23.8223, lon: 90.3654, concentration: 125.8, unit: 'μmol/m²' }, // Industrial
      { lat: 23.7925, lon: 90.4078, concentration: 38.1, unit: 'μmol/m²' },
    ],
    aod: [
      { lat: 23.8103, lon: 90.4125, value: 0.65, pm25: 45 },
      { lat: 23.7808, lon: 90.4217, value: 0.72, pm25: 52 },
      { lat: 23.8223, lon: 90.3654, value: 0.95, pm25: 85 }, // Worst
      { lat: 23.7925, lon: 90.4078, value: 0.35, pm25: 28 }, // Best
    ],
  };
}

async function fetchWaterQualityData() {
  // Landsat + Sentinel-2 Water Turbidity & Chlorophyll
  // Real API: USGS EarthExplorer
  
  return {
    rivers: [
      { 
        name: 'Buriganga', 
        points: [
          [90.4125, 23.8103],
          [90.4217, 23.7808],
          [90.4350, 23.7650],
        ],
        turbidity: 85, // NTU
        chlorophyll: 45, // μg/L
        pollution: 'severe',
      },
      {
        name: 'Turag',
        points: [
          [90.3654, 23.8223],
          [90.3537, 23.7956],
          [90.3450, 23.7800],
        ],
        turbidity: 65,
        chlorophyll: 32,
        pollution: 'moderate',
      },
    ],
    lakes: [
      { lat: 23.7925, lon: 90.4078, name: 'Dhanmondi Lake', quality: 0.6 },
      { lat: 23.8103, lon: 90.4125, name: 'Hatirjheel', quality: 0.5 },
    ],
  };
}

/**
 * Question 3: Urban Growth & Housing Needs
 * Data: GHSL Urban Expansion + VIIRS Nighttime Lights + Landsat
 */
export async function fetchUrbanGrowthData() {
  try {
    const historicalGrowth = await fetchHistoricalUrbanExpansion();
    const nighttimeLights = await fetchNighttimeLightsData();
    const landAvailability = await fetchLandAvailabilityData();
    
    return {
      historical: historicalGrowth,
      lights: nighttimeLights,
      land: landAvailability,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching urban growth data:', error);
    return generateMockGrowthData();
  }
}

async function fetchHistoricalUrbanExpansion() {
  // GHSL Built-Up Area (1975-2020)
  // Real API: https://ghsl.jrc.ec.europa.eu/
  
  return {
    1975: { area: 120, population: 2000000 },
    1985: { area: 180, population: 3500000 },
    1995: { area: 280, population: 6500000 },
    2005: { area: 420, population: 11000000 },
    2015: { area: 580, population: 17000000 },
    2020: { area: 650, population: 21000000 },
    2025: { area: 720, population: 23500000 }, // Projection
  };
}

async function fetchNighttimeLightsData() {
  // VIIRS DNB Nighttime Lights
  // Real API: https://www.ngdc.noaa.gov/eog/viirs/
  
  return [
    { lat: 23.8103, lon: 90.4125, radiance: 85.2, growth: 0.15 },
    { lat: 23.7808, lon: 90.4217, radiance: 92.5, growth: 0.08 },
    { lat: 23.7561, lon: 90.3872, radiance: 65.3, growth: 0.12 },
    { lat: 23.8223, lon: 90.3654, radiance: 48.8, growth: 0.25 }, // Fastest
    { lat: 23.7956, lon: 90.3537, radiance: 35.1, growth: 0.22 }, // Fast
    { lat: 23.8103, lon: 90.3372, radiance: 18.5, growth: 0.35 }, // Explosive
  ];
}

async function fetchLandAvailabilityData() {
  // Landsat Land Cover + MODIS
  // Real API: USGS EarthExplorer
  
  return [
    { lat: 23.8103, lon: 90.4125, available: 0.05, type: 'fully_developed' },
    { lat: 23.7808, lon: 90.4217, available: 0.02, type: 'fully_developed' },
    { lat: 23.7561, lon: 90.3872, available: 0.12, type: 'mostly_developed' },
    { lat: 23.8223, lon: 90.3654, available: 0.35, type: 'developing' },
    { lat: 23.7956, lon: 90.3537, available: 0.45, type: 'developing' },
    { lat: 23.8103, lon: 90.3372, available: 0.65, type: 'open_land' }, // Prime for housing
  ];
}

// Mock data generators for fallback
function generateMockAccessData() {
  return {
    population: fetchPopulationDensity(),
    settlements: fetchSettlementData(),
    infrastructure: fetchInfrastructureData(),
    timestamp: new Date().toISOString(),
  };
}

function generateMockPollutionData() {
  return {
    air: fetchAirQualityData(),
    water: fetchWaterQualityData(),
    timestamp: new Date().toISOString(),
  };
}

function generateMockGrowthData() {
  return {
    historical: fetchHistoricalUrbanExpansion(),
    lights: fetchNighttimeLightsData(),
    land: fetchLandAvailabilityData(),
    timestamp: new Date().toISOString(),
  };
}

// Helper function to calculate accessibility score
export function calculateAccessibilityScore(population, infrastructure, distance) {
  const densityScore = Math.min(population.density / 50000, 1);
  const infraScore = infrastructure.connectivity || 0;
  const distanceScore = 1 - Math.min(distance / 5, 1); // 5km max
  
  return (densityScore * 0.3 + infraScore * 0.4 + distanceScore * 0.3) * 100;
}

// Helper function to calculate pollution health risk
export function calculateHealthRisk(airQuality, population) {
  const pm25Risk = airQuality.pm25 > 50 ? (airQuality.pm25 / 100) : 0;
  const exposedPopulation = population.density * pm25Risk;
  
  return {
    risk: pm25Risk > 0.5 ? 'high' : pm25Risk > 0.3 ? 'moderate' : 'low',
    exposedPopulation: Math.round(exposedPopulation),
    severity: pm25Risk,
  };
}

// Helper function to calculate housing demand
export function calculateHousingDemand(growth, landAvailable, currentPopulation) {
  const growthRate = growth.growth || 0;
  const projectedPopulation = currentPopulation * (1 + growthRate);
  const housingGap = (projectedPopulation - currentPopulation) / 5; // 5 people per unit
  
  const developmentPotential = landAvailable.available > 0.3 ? 'high' : 
                                landAvailable.available > 0.1 ? 'medium' : 'low';
  
  return {
    demand: Math.round(housingGap),
    potential: developmentPotential,
    urgency: growthRate > 0.2 ? 'critical' : growthRate > 0.1 ? 'high' : 'moderate',
  };
}
