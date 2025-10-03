// Dummy climate data to replace API calls
export const generateDummyClimateData = () => {
  return {
    temperature: {
      current: 32.5 + Math.random() * 8, // 32-40°C
      trend: Math.random() > 0.5 ? 'up' : 'down',
      humidity: 60 + Math.random() * 25 // 60-85%
    },
    heatIndex: 35 + Math.random() * 10, // 35-45°C
    wind: {
      speed: 5 + Math.random() * 15, // 5-20 km/h
      direction: Math.random() * 360,
      trend: Math.random() > 0.5 ? 'up' : 'down'
    },
    airQuality: {
      aqi: Math.floor(Math.random() * 5) + 1, // 1-5 scale
      pm25: 15 + Math.random() * 35, // 15-50 μg/m³
      trend: Math.random() > 0.5 ? 'up' : 'down'
    },
    uvIndex: Math.floor(Math.random() * 11), // 0-10
    precipitation: {
      current: Math.random() * 5, // 0-5mm
      forecast: Math.random() * 20 // 0-20mm
    }
  };
};

export const generateTemperatureData = () => {
  const baseCoords = [23.8103, 90.4125];
  const data = [];
  
  for (let i = 0; i < 15; i++) {
    data.push({
      lat: baseCoords[0] + (Math.random() - 0.5) * 0.05,
      lng: baseCoords[1] + (Math.random() - 0.5) * 0.05,
      temp: 28 + Math.random() * 12, // 28-40°C
      intensity: Math.random(),
      timestamp: new Date(),
      source: 'Municipal Sensors'
    });
  }
  
  return data;
};

export const generateVegetationData = () => {
  const baseCoords = [23.8103, 90.4125];
  const data = [];
  
  for (let i = 0; i < 10; i++) {
    data.push({
      lat: baseCoords[0] + (Math.random() - 0.5) * 0.08,
      lng: baseCoords[1] + (Math.random() - 0.5) * 0.08,
      ndvi: Math.random(), // 0-1 vegetation index
      coverage: Math.random() * 100, // 0-100% coverage
      type: ['park', 'forest', 'garden', 'green_roof'][Math.floor(Math.random() * 4)]
    });
  }
  
  return data;
};

export const generateAirQualityData = () => {
  const baseCoords = [23.8103, 90.4125];
  const data = [];
  
  for (let i = 0; i < 8; i++) {
    const aqi = Math.floor(Math.random() * 5) + 1;
    data.push({
      lat: baseCoords[0] + (Math.random() - 0.5) * 0.06,
      lng: baseCoords[1] + (Math.random() - 0.5) * 0.06,
      aqi: aqi,
      pm25: 10 + Math.random() * 40,
      category: ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'][aqi - 1],
      timestamp: new Date()
    });
  }
  
  return data;
};

export const generateFloodData = () => {
  const baseCoords = [23.8103, 90.4125];
  const data = [];
  
  for (let i = 0; i < 6; i++) {
    data.push({
      lat: baseCoords[0] + (Math.random() - 0.5) * 0.04,
      lng: baseCoords[1] + (Math.random() - 0.5) * 0.04,
      riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      maxDepth: Math.random() * 3, // 0-3m potential depth
      probability: Math.random() * 100 // 0-100% probability
    });
  }
  
  return data;
};
